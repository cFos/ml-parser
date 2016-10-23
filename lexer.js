const WHITESPACE_CHARS = ' \t\u00A0'
const LINEEND_CHARS = '\n\r'

const KEYWORD_OPERATOR = '#'
const COMMENT_OPERATOR = '/'
const ESCAPE_OPERATOR = '\\'
const LANGKEY_ASSIGN_OPERATOR = '='
const LANGSTRING_START = '"'
const LANGSTRING_END = '";'

const TOKEN_KEYWORD = 'keyword'
const TOKEN_LANGKEY = 'key'
const TOKEN_LANGASSIGN = 'assign'
const TOKEN_LANGSTRING = 'string'
const TOKEN_COMMENT = 'comment'
const TOKEN_WHITESPACE = 'whitespace'
const TOKEN_NEWLINE = 'newline'

const token = (type, value, lineno, colno) => ({ type, value, lineno, colno })

class Lexer {
  constructor(str) {
    this.str = str
    this.index = 0
    this.len = this.str.length
    this.lineno = 0
    this.colno = 0
  }

  nextToken() {
    const { lineno, colno } = this
    let tok

    let cur = this.current()

    if (this.isFinished()) return null
    if (cur === LANGSTRING_START) return token(TOKEN_LANGSTRING, this.parseString(cur), lineno, colno)
    if (tok = this.extract(WHITESPACE_CHARS)) return token(TOKEN_WHITESPACE, tok, lineno, colno)
    if (tok = this.extract(LINEEND_CHARS)) return token(TOKEN_NEWLINE, tok, lineno, colno)
    if ((cur === KEYWORD_OPERATOR) && (tok = this.extractUntil(WHITESPACE_CHARS))) return token(TOKEN_KEYWORD, tok, lineno, colno)
    if ((cur === COMMENT_OPERATOR) && (tok = this.extractUntil(LINEEND_CHARS))) return token(TOKEN_COMMENT, tok, lineno, colno)
    if (cur === LANGKEY_ASSIGN_OPERATOR) {
      this.forward()
      return token(TOKEN_LANGASSIGN, cur, lineno, colno)
    }

    this.forward()
  }

  isFinished() { return this.index >= this.len }

  forward() {
    this.index++
    if (this.previous() === '\n') {
      this.lineno++
      this.colno = 0
    } else {
      this.colno++
    }
  }

  current() { return (!this.isFinished()) ? this.str.charAt(this.index) : 'NULL' }
  previous(steps = 1) { return this.str.charAt(this.index - steps) }
  next(steps = 1) { return this.str.charAt(this.index + steps) }

  extract(breakingChars) { return this.extractMatching(false, breakingChars) }
  extractUntil(breakingChars) { return this.extractMatching(true, breakingChars)  }
  extractMatching(breakOnMatch, breakingChars) {
    if (this.isFinished()) return null

    const getIsBreakingChar = (char) => breakingChars.indexOf(char) !== -1

    let isBreakingChar = getIsBreakingChar(this.current())
    let t = ''

    while (((breakOnMatch && !isBreakingChar) || (!breakOnMatch && isBreakingChar)) && !this.isFinished()) {
      t += this.current()
      this.forward()

      isBreakingChar = getIsBreakingChar(this.current())
    }

    return t
  }

  parseString() {
    this.forward()

    let str = ''

    const getIsEndingChar = () => this.previous() !== ESCAPE_OPERATOR && this.current() + this.next() === LANGSTRING_END

    while (!this.isFinished() && !getIsEndingChar()) {
      let cur = this.current()

      str += cur
      this.forward()
    }

    this.forward()
    return str
  }
}

module.exports = {
  Lexer,

  TOKEN_KEY,
  TOKEN_VALUE,
  TOKEN_LANGKEY,
  TOKEN_LANGASSIGN,
  TOKEN_LANGSTRING,
  TOKEN_COMMENT,
  TOKEN_WHITESPACE,
  TOKEN_NEWLINE
}
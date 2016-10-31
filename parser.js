const {
  Lexer,
  TOKEN_PRAGMA,
  TOKEN_PRAGMA_VALUE,
  TOKEN_LANGKEY,
  TOKEN_LANGKEY_ASSIGN,
  TOKEN_LANGKEY_STRING,
  TOKEN_LANGKEY_END,
  TOKEN_COMMENT,
  TOKEN_INLINE_COMMENT,
  TOKEN_WHITESPACE,
  TOKEN_NEWLINE
} = require('./lexer')

const isAnyWhitespace = (input) => input.type === TOKEN_WHITESPACE || input.type === TOKEN_NEWLINE

class Parser {
  constructor(str) {
    this.lexer = new Lexer(str)
    this.peeked = null
    this.current = null
  }

  nextToken() {
    let tok

    if (this.peeked) {
      tok = this.peeked
      this.peeked = null
      return tok
    }

    tok = this.lexer.nextToken()

    while(tok && isAnyWhitespace(tok)) {
      tok = this.lexer.nextToken()
    }

    this.current = tok
    return tok
  }

  peekToken() {
    this.peeked = this.peeked || this.nextToken()
    return this.peeked
  }

  pushToken(tok) {
    if (this.peeked) throw new Error('[pushToken] can only push one token on between reads')
    this.peeked = tok
  }

  skip(type) {
    const tok = this.nextToken()

    if (!tok || tok.type !== type) {
      this.pushToken(tok)
      return false
    }

    return true
  }

  expect(type, onCurrent = false) {
    const tok = onCurrent ? this.current : this.nextToken()
    if (tok.type !== type) this.error(`expected ${type}, got ${tok.type}`, tok.lineno, tok.colno)
    return tok
  }

  error(msg, lineno, colno) {
    if ((lineno === undefined || colno === undefined) && this.peekToken()) {
      const tok = this.peekToken()
      lineno = tok.lineno
      colno = tok.colno
    }

    throw new Error(`${msg}, ${lineno}:${colno}`)
  }

  parseStatement() {
    const { type, value } = this.current
    let nextToken

    switch (type) {

      case TOKEN_PRAGMA:
        this.peekToken()
        nextToken = this.expect(TOKEN_PRAGMA_VALUE)
        return { type, [value]: nextToken.value }

      case TOKEN_COMMENT:
      case TOKEN_INLINE_COMMENT:
        return { type, value }

      case TOKEN_LANGKEY:
        this.expect(TOKEN_LANGKEY_ASSIGN)

        let strings = []
        nextToken = this.expect(TOKEN_LANGKEY_STRING)

        while (nextToken.type === TOKEN_LANGKEY_STRING) {
          strings.push(nextToken.value)
          nextToken = this.nextToken()
        }

        this.expect(TOKEN_LANGKEY_END, true)

        return { type, [value]: strings }

      default:
        this.error(`Unknown token ${type}`)
    }
  }

  parse() {
    let tok
    let buf = []

    while (tok = this.nextToken()) {
      const { value, lineno, colno } = tok
      // console.log(tok)
      const node = this.parseStatement()
      buf.push(Object.assign(node, { lineno, colno }))
    }

    return buf
  }
}

module.exports = {
  Parser
}
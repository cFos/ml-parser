const { Lexer, TOKEN_WHITESPACE, TOKEN_NEWLINE } = require('./lexer')

const isAnyWhitespace = (input) => input.type === TOKEN_WHITESPACE || input.type === TOKEN_NEWLINE

class Parser {
  constructor(str) {
    this.lexer = new Lexer(str)
    this.peeked = null
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

    return tok
  }

  peekToken() {
    this.peeked = this.peeked || this.nextToken()

    return this.peeked
  }

  error(msg, lineno, colno) {
    if ((lineno === undefined || colno === undefined) && this.peekToken()) {
      const tok = this.peekToken()
      lineno = tok.lineno
      colno = tok.colno
    }

    throw new Error(`${msg}, ${lineno}:${colno}`)
  }

  parse() {
    let tok
    let buf = []

    while (tok = this.nextToken()) {
      const { value, lineno, colno } = tok
      buf.push({ value, lineno, colno })
    }

    return buf
  }
}

module.exports = {
  Parser
}
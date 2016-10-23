const { Lexer } = require('./lexer')

class Parser {
  constructor(str, filter = []) {
    this.lexer = new Lexer(str)
    this.AST = []

    const { lexer, AST } = this

    while (!lexer.isFinished()) {
      let token = lexer.nextToken()

      if (token && !filter.includes(token.type)) AST.push(token)
    }

    console.log(AST)
  }
}

module.exports = {
  Parser
}
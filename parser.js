const { Lexer } = require('./lexer')

class Parser {
  constructor(str) {
    this.lexer = new Lexer(str)
    this.AST = []

    const { lexer, AST } = this

    while (!lexer.isFinished()) {
      let token = lexer.nextToken()

      if (token) AST.push(token)
    }

    console.log(AST)
  }
}

module.exports = {
  Parser
}
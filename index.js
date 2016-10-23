const { readFileSync } = require('fs')
const { TOKEN_LANGASSIGN, TOKEN_WHITESPACE, TOKEN_NEWLINE } = require('./lexer')
const { Parser } = require('./parser')

let file = readFileSync('input.cfos.txt', 'utf8')

new Parser(file, [TOKEN_LANGASSIGN, TOKEN_WHITESPACE, TOKEN_NEWLINE])
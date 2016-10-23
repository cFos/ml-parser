const { readFileSync } = require('fs')
const { Parser } = require('./parser')

let file = readFileSync('input.cfos.txt', 'utf8')

new Parser(file)
const cli = require('commander')
const { readFileSync, writeFileSync } = require('fs')
const { Parser } = require('./parser')

const pkg = require('./package.json')

cli
  .version(pkg.version)
  .option('-i, --input [string]', 'cFos ml-file to parse')
  .option('-o, --output [string]', 'File to write parsed result')
  .parse(process.argv)

const file = readFileSync(cli.input, 'utf8')
const parser = new Parser(file)
const parsed = parser.parse()

writeFileSync(cli.output || `${cli.input}.json`, JSON.stringify(parsed, null, 2))

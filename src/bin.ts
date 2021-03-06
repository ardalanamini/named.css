#!/usr/bin/env node

import * as program from 'commander'
import * as path from 'path'
import * as fs from 'fs'
import { name, version, description } from '../package.json'
import build from './index'

let startTime = new Date().getTime()

program
  .name('named-css')
  .version(version)
  .description(description)
  .usage('<inputs> [options]')
  .option('-o, --output <output>', 'output path', (output: string) => {
    if (path.isAbsolute(output)) return output

    return path.join(process.cwd(), output)
  }, path.join(process.cwd(), 'build'))
  .option('-p, --prefix <prefix>', 'prefix for classes and ids', '')
  .parse(process.argv)

if (!fs.existsSync(program.output)) fs.mkdirSync(program.output)

let input = ''
program.args.map((inputPath) => {
  let filePath = inputPath

  if (!path.isAbsolute(inputPath)) filePath = path.join(process.cwd(), inputPath)

  input += fs.readFileSync(filePath, 'utf8') + '\n\n'
})

let result = build(input, program.prefix)

let output = result.output

output = '/**\n * Built with pnamed.css\n */\n\n' + output

fs.writeFileSync(path.join(program.output, 'build.css'), output, 'utf8');
fs.writeFileSync(path.join(program.output, 'classes.json'), JSON.stringify(result.classes), 'utf8');
fs.writeFileSync(path.join(program.output, 'ids.json'), JSON.stringify(result.ids), 'utf8');

console.log(`finished in ${new Date().getTime() - startTime}ms`)

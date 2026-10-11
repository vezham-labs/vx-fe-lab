import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export const readYamlConfig = <T>(file: string): T =>
  parse(readFileSync(file, 'utf8')) as T

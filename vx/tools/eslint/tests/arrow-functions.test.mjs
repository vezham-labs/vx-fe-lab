import nx from '@nx/eslint-plugin'
import { ESLint } from 'eslint'
import assert from 'node:assert/strict'
import test from 'node:test'

import rule from '../arrow-functions.mjs'

const parser = nx.configs['flat/typescript'].find(
  config => config.languageOptions?.parser
).languageOptions.parser
const eslint = new ESLint({
  overrideConfigFile: true,
  fix: true,
  overrideConfig: [
    {
      files: ['**/*.tsx'],
      languageOptions: {
        parser,
        parserOptions: { ecmaFeatures: { jsx: true } }
      },
      plugins: { vx: { rules: { arrows: rule } } },
      rules: { 'vx/arrows': 'error' }
    }
  ]
})

const cases = [
  ['export function usePosts() { return 1 }', true, 0],
  ['export async function usePosts() { return 1 }', true, 0],
  ['function value(x: number): number { return x } value(1)', true, 0],
  ['export function useValue<T>(x: T): T { return x }', true, 0],
  ['export function useValue<T,>(x: T): T { return x }', true, 0],
  ['export function useValue<T extends string>(x: T): T { return x }', true, 0],
  ['export default function View() { return null }', false, 1],
  ['export function libraryApi() { return 1 }', false, 1],
  ['function dynamic() { return this.value }', false, 0],
  ['function args() { return arguments[0] }', false, 0],
  ['function outer() { return () => this.value }', false, 0],
  ['function outer() { return () => arguments[0] }', false, 0],
  [
    'function outer() { function inner() { return this.value } return inner }',
    true,
    0
  ],
  ['called(); function called() {}', false, 0],
  ['function* sequence() { yield 1 }', false, 0],
  ['function Thing() {} new Thing()', false, 0],
  ['function f() {} const alias = f', false, 1],
  ['function f() {} f = () => 2', false, 1],
  [
    'function f(x: string): string; function f(x: number): number; function f(x: any) { return x }',
    false,
    0
  ],
  ['function assertValue(x: unknown): asserts x is string {}', false, 1],
  ['function /* keep comment */ example() {}', false, 1]
]

for (const [code, fixed, errors] of cases) {
  test(code, async () => {
    const [result] = await eslint.lintText(code, {
      filePath: 'arrow-review.tsx'
    })
    assert.equal(!!result.output, fixed)
    assert.equal(result.errorCount, errors, JSON.stringify(result.messages))
    if (fixed) {
      const [again] = await eslint.lintText(result.output, {
        filePath: 'arrow-review.tsx'
      })
      assert.equal(again.output, undefined, 'Fix must be idempotent')
      assert.match(result.output, /const \w+ = /)
    }
  })
}

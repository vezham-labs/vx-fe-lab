import nx from '@nx/eslint-plugin'
import { ESLint } from 'eslint'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import rule from '../dot-notation.mjs'

const parser = nx.configs['flat/typescript'].find(
  c => c.languageOptions?.parser
).languageOptions.parser
const fixture = async (t, files) => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'vx-compound-'))
  t.after(() => rm(cwd, { recursive: true, force: true }))
  for (const [name, contents] of Object.entries(files))
    await writeFile(path.join(cwd, name), contents)
  const lint = new ESLint({
    cwd,
    overrideConfigFile: true,
    fix: true,
    overrideConfig: [
      {
        files: ['**/*.tsx'],
        languageOptions: { parser },
        plugins: { vx: { rules: { compound: rule } } },
        rules: { 'vx/compound': 'error' }
      }
    ]
  })
  return {
    cwd,
    check: async (code, expected) => {
      const [result] = await lint.lintText(code, { filePath: 'consumer.tsx' })
      assert.equal(result.output, undefined)
      assert.deepEqual(
        result.messages.map(m => m.message),
        expected.map(
          replacement =>
            `Use ${replacement} instead of Header to follow Vx compound-component notation.`
        )
      )
    }
  }
}

test('infers custom compounds through aliases and local barrels', async t => {
  const { check } = await fixture(t, {
    'parts.tsx':
      'const Head = () => null; const Root = () => null; export { Head, Root };',
    'profile.tsx':
      "import { Head as H, Root } from './parts'; export const Profile = Object.assign(Root, { Header: H }); export { H as Header };",
    'index.ts': "export * from './profile';"
  })
  await check("import { Header as H } from './index';", ['Profile.Header'])
  await check("export { Header as H } from './index';", ['Profile.Header'])
  await check("import * as UI from './index'; const X = () => <UI.Header />;", [
    'Profile.Header'
  ])
  await check("import * as UI from './index'; const H = UI['Header'];", [
    'Profile.Header'
  ])
  await check(
    "import * as UI from './index'; const X = (UI: any) => <UI.Header />;",
    []
  )
  await check(
    "import { Profile } from './index'; const X = () => <Profile.Header />;",
    []
  )
  await check("import type { Header } from './index';", [])
  await check("export type { Header } from './index';", [])
})

test('compares binding identity across selective re-exports', async t => {
  const { check } = await fixture(t, {
    'parts.tsx': 'const H = () => null; export { H as Header };',
    'profile.tsx':
      "import { Header } from './parts'; const P = { Header }; export { P as Profile };",
    'index.ts':
      "export { Profile as Account } from './profile'; export { Header } from './parts';"
  })
  await check("import { Header } from './index';", ['Account.Header'])
  await check("import { Header } from './parts';", [])
})

test('preserves named declarations and ignores type-only exports', async t => {
  const { check } = await fixture(t, {
    'parts.tsx':
      'export function Header() { return null }; export class Root {};',
    'profile.tsx':
      "import { Header, Root } from './parts'; export const Profile = Object.assign(Root, { Header }); export { Header } from './parts';",
    'types.ts': "export type { Header } from './profile';"
  })
  await check("import { Header } from './profile';", ['Profile.Header'])
  await check("import { Header } from './types';", [])
})

test('skips independent, private, and unknown relationships', async t => {
  for (const source of [
    'export const Header = () => null; export const Profile = () => null;',
    'export const Header = () => null; const Other = () => null; export const Profile = { Header: Other };',
    'export const Header = () => null; const Profile = { Header };',
    'export const Header = () => null; const Root = () => null; export const Profile = makeCompound(Root, { Header });',
    'export const Header = () => null; const Root = () => null; export const Profile = Object.assign(Root, { Header }, extra);',
    'export const Header = () => null; export const Profile = { Header, ...extra };',
    'export const Header = () => null; export const Profile = { Header() {} };',
    'export const Header = () => null; export const Profile = { ["Header"]: Header };',
    'export const Header = () => null; export const Profile = { Header: makeHeader() };',
    'export const Header = () => null; const Other = () => null; export const Profile = { Header, Header: Other };',
    'export let Header = () => null; export const Profile = { Header }; Header = () => null;',
    'export const Header = () => null; const Root = () => null; const Object = factory; export const Profile = Object.assign(Root, { Header });'
  ]) {
    const { check } = await fixture(t, { 'profile.tsx': source })
    await check("import { Header } from './profile';", [])
  }
})

test('ignores malformed modules and accepts wrapped compound initializers', async t => {
  const { check } = await fixture(t, {
    'broken.tsx': 'export const Profile = {;',
    'profile.tsx':
      'export const Header = () => null; export const Profile = ({ Header: (Header as unknown) } satisfies object);'
  })
  await check("import { Header } from './broken';", [])
  await check("import { Header } from './profile';", ['Profile.Header'])
})

test('resolves configured import paths and observes source edits', async t => {
  const { check, cwd } = await fixture(t, {
    'tsconfig.json': JSON.stringify({
      compilerOptions: { paths: { '@ui/profile': ['./profile.tsx'] } }
    }),
    'profile.tsx':
      'export const Header = () => null; export const Profile = { Header } as const;'
  })
  await check("import { Header } from '@ui/profile';", ['Profile.Header'])
  await writeFile(
    path.join(cwd, 'profile.tsx'),
    'export const Header = () => null;'
  )
  await check("import { Header } from '@ui/profile';", [])
  await check("import { Header } from '@ui/missing';", [])
})

test('handles cycles and ambiguous wildcard barrels conservatively', async t => {
  const { check } = await fixture(t, {
    'a.tsx':
      "export const Header = () => null; export const Profile = { Header }; export * from './index';",
    'b.tsx': 'export const Header = () => null;',
    'index.ts': "export * from './a'; export * from './b';"
  })
  await check("import { Header } from './index';", [])
})

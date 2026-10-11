import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { readYamlConfig } from './yaml-config'

const roots: string[] = []

const writeConfig = (source: string) => {
  const root = mkdtempSync(path.join(tmpdir(), 'vx-yaml-'))
  roots.push(root)
  const file = path.join(root, 'vx.app.yaml')
  writeFileSync(file, source)
  return file
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe('YAML config input', () => {
  it('reads comments, nested values, and quoted strings without coercion', () => {
    const file = writeConfig(`
# yaml-language-server: $schema=../../vx/schemas/vx.app.json
framework: tanstack
core:
  version: "1.0"
branding:
  themeColor: "#000000"
routes:
  - path: /api/**
    prerender: false
`)
    expect(readYamlConfig(file)).toEqual({
      framework: 'tanstack',
      core: { version: '1.0' },
      branding: { themeColor: '#000000' },
      routes: [{ path: '/api/**', prerender: false }]
    })
  })

  it('rejects duplicate keys rather than silently overwriting configuration', () => {
    const file = writeConfig('framework: tanstack\nframework: next\n')
    expect(() => readYamlConfig(file)).toThrow(/unique/)
  })
})

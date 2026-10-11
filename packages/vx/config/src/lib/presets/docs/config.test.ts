import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { stringify } from 'yaml'

import { loadVxDocsConfig } from './config.ts'

describe('docs language configuration', () => {
  it.each([
    [undefined, { defaultLanguage: 'en', languages: ['en'] }],
    [
      { defaultLanguage: 'ta', languages: ['en'] },
      { defaultLanguage: 'ta', languages: ['en', 'ta'] }
    ]
  ])('normalizes languages before docs generation', (i18n, expected) => {
    const projectRoot = mkdtempSync(path.join(tmpdir(), 'vx-docs-'))
    try {
      writeFileSync(path.join(projectRoot, 'vx.app.yaml'), stringify({ i18n }))
      expect(loadVxDocsConfig(projectRoot).i18n).toEqual(expected)
    } finally {
      rmSync(projectRoot, { force: true, recursive: true })
    }
  })
})

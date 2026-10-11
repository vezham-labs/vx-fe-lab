import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'

import { defineConfig } from './index'

vi.mock('@nx/playwright/preset', () => ({ nxE2EPreset: () => ({}) }))

afterEach(() => vi.unstubAllEnvs())

it('keeps app ports isolated when multiple configs load in one process', () => {
  vi.stubEnv('PRE_PORT', undefined)
  vi.stubEnv('BASE_URL', undefined)
  const root = mkdtempSync(path.join(tmpdir(), 'vx-playwright-'))
  try {
    const load = (name: string, port: number) => {
      const dir = path.join(root, name)
      mkdirSync(dir)
      writeFileSync(path.join(dir, '.env'), `PRE_PORT=${port}\n`)
      return defineConfig(path.join(dir, 'playwright.config.ts'), {
        webServer: { command: 'echo test' }
      })
    }
    expect(load('first', 2001).use?.baseURL).toBe('http://localhost:2001')
    expect(load('second', 2002).use?.baseURL).toBe('http://localhost:2002')
    expect(process.env.PRE_PORT).toBeUndefined()
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

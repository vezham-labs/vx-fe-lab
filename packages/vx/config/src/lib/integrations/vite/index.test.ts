import path from 'node:path'
import type { ConfigEnv, UserConfigExport } from 'vite'
import { describe, expect, it, vi } from 'vitest'

import { defineConfig as defineAppConfig } from '../../presets/app/index.ts'
import { createViteConfig, defineConfig } from './index.ts'

const env: ConfigEnv = { command: 'serve', mode: 'test' }
const resolveConfig = async (config: UserConfigExport, configEnv = env) =>
  typeof config === 'function' ? config(configEnv) : config

describe('Vite config composition', () => {
  it('resolves async overrides once before defaults and merges overrides last', async () => {
    const root = path.resolve('fixture')
    const overrides = vi.fn(async () => ({
      root,
      server: { port: 4321 },
      define: { SHARED: 'override' }
    }))
    const defaults = vi.fn(() => ({
      root,
      server: { host: 'localhost', port: 1234 },
      define: { SHARED: 'default', DEFAULT_ONLY: 'true' }
    }))

    const config = await resolveConfig(createViteConfig(defaults, overrides))

    expect(overrides).toHaveBeenCalledExactlyOnceWith(env)
    expect(defaults).toHaveBeenCalledExactlyOnceWith(root, env)
    expect(config.server).toEqual({ host: 'localhost', port: 4321 })
    expect(config.define).toEqual({ SHARED: 'override', DEFAULT_ONLY: 'true' })
  })

  it('uses the current project when no overrides are supplied', async () => {
    expect(await resolveConfig(defineConfig())).toMatchObject({
      root: process.cwd(),
      test: {}
    })
  })

  it.each(['serve', 'build'] as const)(
    'keeps app defaults and user overrides for %s',
    async command => {
      const config = await resolveConfig(
        defineAppConfig({
          build: { outDir: 'custom-output' },
          resolve: { alias: { 'react/jsx-dev-runtime': '/custom-runtime.js' } },
          preview: { port: 4321 }
        }),
        { ...env, command }
      )

      expect(config.build).toMatchObject({
        outDir: 'custom-output',
        emptyOutDir: true
      })
      expect(config.resolve).toMatchObject({
        dedupe: ['react', 'react-dom'],
        alias: { 'react/jsx-dev-runtime': '/custom-runtime.js' }
      })
      expect(config.preview?.port).toBe(4321)
    }
  )
})

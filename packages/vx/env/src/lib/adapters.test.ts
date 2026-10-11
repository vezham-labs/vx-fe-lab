import { afterEach, beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.stubEnv('V_APP_ID', 'test-app')
  vi.stubEnv('V_APP_NAME', 'Test App')
  vi.stubEnv('V_APP_VER', '27.0.0')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

it('allows Next config discovery before required runtime settings are loaded', async () => {
  vi.stubEnv('V_APP_ENV', undefined)
  vi.stubEnv('V_APP_ID', undefined)
  vi.stubEnv('V_APP_NAME', undefined)
  vi.stubEnv('V_APP_VER', undefined)

  const { configEnv } = await import('@vx/env/next/config')

  expect(configEnv.V_APP_ENV).toBeUndefined()
  await expect(import('./next')).rejects.toThrow('V_APP_ID is required')
})

it('exposes deployment and channel settings through the Vite entry point', async () => {
  vi.stubEnv('MODE', 'production')
  vi.stubEnv('V_APP_ENV', 'dev')
  vi.stubEnv('V_RELEASE_CHANNEL', 'canary')
  vi.stubEnv('V_IS_DEBUG', 'false')

  const env = await import('./vite')

  expect(env).toMatchObject({
    APP_ENV: 'dev',
    RELEASE_CHANNEL: 'canary',
    __PRODUCTION__: true
  })
})

it('exposes deployment and channel settings through the Next entry point', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('V_APP_ENV', 'preview')
  vi.stubEnv('V_RELEASE_CHANNEL', 'beta')
  vi.stubEnv('V_IS_DEBUG', 'false')

  const env = await import('./next')

  expect(env).toMatchObject({
    APP_ENV: 'preview',
    RELEASE_CHANNEL: 'beta',
    __PRODUCTION__: true,
    configEnv: {
      V_APP_ENV: 'preview',
      V_RELEASE_CHANNEL: 'beta'
    }
  })
})

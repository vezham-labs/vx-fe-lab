import { describe, expect, it } from 'vitest'

import { createEnv } from './base'

const requiredSettings = {
  V_APP_ID: 'test-app',
  V_APP_NAME: 'Test App',
  V_APP_VER: '27.0.0'
}

describe('deployment environments and release channels', () => {
  it.each(['local', 'dev', 'qa', 'preview', 'production'])(
    'supports every release channel in %s',
    environment => {
      for (const channel of ['canary', 'beta', 'stable']) {
        expect(
          createEnv({
            ...requiredSettings,
            MODE: 'production',
            V_APP_ENV: environment,
            V_RELEASE_CHANNEL: channel
          })
        ).toMatchObject({
          APP_ENV: environment,
          RELEASE_CHANNEL: channel,
          __DEV__: false,
          __PRODUCTION__: true
        })
      }
    }
  )

  it('keeps explicit deployment settings independent of build mode', () => {
    expect(
      createEnv({
        ...requiredSettings,
        MODE: 'development',
        V_APP_ENV: 'production',
        V_RELEASE_CHANNEL: 'stable'
      })
    ).toMatchObject({
      APP_ENV: 'production',
      RELEASE_CHANNEL: 'stable',
      __DEV__: true,
      __PRODUCTION__: false
    })
  })

  it.each(['V_APP_ID', 'V_APP_NAME', 'V_APP_VER'] as const)(
    'requires a non-blank %s',
    key => {
      for (const value of [undefined, '', '   ']) {
        expect(() => createEnv({ ...requiredSettings, [key]: value })).toThrow(
          `${key} is required`
        )
      }
    }
  )

  it.each([undefined, 'development', 'production', 'test'])(
    'defaults deployment to local independently of %s build mode',
    mode => {
      for (const environment of [undefined, '']) {
        expect(
          createEnv({ ...requiredSettings, MODE: mode, V_APP_ENV: environment })
        ).toMatchObject({
          APP_ENV: 'local',
          __DEV__: mode === 'development',
          __PRODUCTION__: mode === 'production'
        })
      }
    }
  )

  it.each([undefined, ''])('defaults channel %j to stable', channel => {
    expect(
      createEnv({ ...requiredSettings, V_RELEASE_CHANNEL: channel })
    ).toMatchObject({
      APP_ENV: 'local',
      RELEASE_CHANNEL: 'stable'
    })
  })

  it('returns the configured app identity without placeholders', () => {
    expect(createEnv(requiredSettings)).toMatchObject({
      APP_ID: 'test-app',
      APP_NAME: 'Test App',
      APP_VER: '27.0.0'
    })
  })

  it.each([
    ['V_APP_ENV', 'development'],
    ['V_APP_ENV', 'beta'],
    ['V_APP_ENV', 'unknown'],
    ['V_APP_ENV', '   '],
    ['V_RELEASE_CHANNEL', 'preview'],
    ['V_RELEASE_CHANNEL', 'Beta']
  ])('rejects invalid %s=%s instead of falling back', (key, value) => {
    expect(() => createEnv({ ...requiredSettings, [key]: value })).toThrow(
      `${key} must be one of:`
    )
  })

  it('keeps artifact version independent from release channel', () => {
    expect(
      createEnv({ ...requiredSettings, V_APP_VER: '27.0.0-beta.1' })
    ).toMatchObject({
      APP_VER: '27.0.0-beta.1',
      RELEASE_CHANNEL: 'stable'
    })
  })
})

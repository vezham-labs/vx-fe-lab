import { workspaceRoot } from '@nx/devkit'
import { nxE2EPreset } from '@nx/playwright/preset'
import type { PlaywrightTestConfig } from '@playwright/test'
import {
  defineConfig as definePlaywrightConfig,
  devices
} from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { parseEnv } from 'node:util'

type WebServerConfig = Exclude<
  NonNullable<PlaywrightTestConfig['webServer']>,
  unknown[]
>

const isCI = Boolean(process.env.CI)
const testTimeout = isCI ? 180_000 : 120_000
const webServerTimeout = isCI ? 400_000 : 300_000

export type PlaywrightConfig = Omit<PlaywrightTestConfig, 'webServer'> & {
  webServer: WebServerConfig
}

const defaultProjects: PlaywrightTestConfig['projects'] = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] }
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] }
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] }
  },

  // vx-bot/NOTE: branded browsers
  {
    name: 'Microsoft Edge',
    use: { ...devices['Desktop Edge'], channel: 'msedge' }
  },
  {
    name: 'Google Chrome',
    use: { ...devices['Desktop Chrome'], channel: 'chrome' }
  },

  // vx-bot/NOTE: mobile browsers support
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] }
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] }
  }
]

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const defineConfig = (configFile: string, config: PlaywrightConfig) => {
  const envFile = join(dirname(configFile), '.env')

  // vx-bot/NOTE: Nx loads multiple configs in one process; keep each app's env isolated.
  const env = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {}

  // wjdlz/TODO: process.env['BASE_URL'] || `http://localhost:${port}` - For CI, you may want to set BASE_URL to the deployed application.
  const port = process.env.PRE_PORT || env.PRE_PORT || 8080
  const baseURL =
    process.env.BASE_URL || env.BASE_URL || `http://localhost:${port}`
  const { projects, use, webServer, ...restConfig } = config

  return definePlaywrightConfig({
    ...nxE2EPreset(configFile, { testDir: './src' }),
    timeout: testTimeout,
    workers: 1,
    /* vx-bot/NOTE: Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    ...restConfig,
    use: {
      baseURL,
      /* vx-bot/NOTE: Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: 'on-first-retry',
      ...use
    },
    /* vx-bot/NOTE: Run your local dev server before starting the tests */
    webServer: {
      url: baseURL,
      timeout: webServerTimeout,
      reuseExistingServer:
        !isCI && process.env.PLAYWRIGHT_REUSE_SERVER !== 'false',
      cwd: workspaceRoot,
      ...webServer
    },
    projects: projects ?? defaultProjects
  })
}

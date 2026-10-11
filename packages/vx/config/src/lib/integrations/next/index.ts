import { workspaceRoot } from '@nx/devkit'
import { composePlugins, withNx } from '@nx/next'
import type { WithNxOptions } from '@nx/next/plugins/with-nx'

export type NextConfig = WithNxOptions

const defaults: NextConfig = {
  nx: {},
  typescript: {
    tsconfigPath: 'tsconfig.app.json'
  },
  turbopack: {
    root: workspaceRoot
  }
}

export const defineConfig = (overrides: NextConfig = {}) => {
  const config: NextConfig = {
    ...defaults,
    ...overrides,
    nx: {
      ...defaults.nx,
      ...overrides.nx
    },
    typescript: {
      ...defaults.typescript,
      ...overrides.typescript
    },
    turbopack: {
      ...defaults.turbopack,
      ...overrides.turbopack
    }
  }

  return composePlugins(withNx)(config)
}

import { workspaceRoot } from '@nx/devkit'
import path from 'node:path'
import { mergeConfig } from 'vite'

import {
  type ViteConfigOverrides,
  defineConfig as defineViteConfig
} from '../vite/index.ts'

export const defineTestConfig = (
  feature: 'react' | 'next' | 'docs',
  overrides: ViteConfigOverrides = {}
) =>
  defineViteConfig(async env => {
    const config =
      typeof overrides === 'function' ? await overrides(env) : overrides
    const setupFiles = [path.join(workspaceRoot, 'vx/__tests__/react.ts')]
    if (feature === 'next')
      setupFiles.push(path.join(workspaceRoot, 'vx/__tests__/next.ts'))
    const plugins = []
    if (feature === 'docs') {
      const { docsTestPlugins } = await import('./frameworks/docs-plugins.ts')
      plugins.push(...docsTestPlugins())
    }
    return mergeConfig(
      {
        plugins,
        test: { environment: 'jsdom', setupFiles, fileParallelism: false }
      },
      config
    )
  })

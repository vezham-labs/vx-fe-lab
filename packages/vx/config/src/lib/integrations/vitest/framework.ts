import type { Framework } from '../../framework.ts'
import { type ViteConfigOverrides } from '../vite/index.ts'
import { defineTestConfig } from './shared.ts'

export const defineFrameworkTestConfig = (
  framework: Framework,
  overrides: ViteConfigOverrides = {}
) =>
  defineTestConfig(
    framework === 'next'
      ? 'next'
      : framework === 'tanstack-docs'
        ? 'docs'
        : 'react',
    overrides
  )

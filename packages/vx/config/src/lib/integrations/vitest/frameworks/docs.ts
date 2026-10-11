import { type ViteConfigOverrides } from '../../vite/index.ts'
import { defineTestConfig } from '../shared.ts'

export const defineConfig = (overrides: ViteConfigOverrides = {}) =>
  defineTestConfig('docs', overrides)

// vx-bot/NOTE: Reuse the base configuration for Node-only tests.
// eslint-disable-next-line @vx-lint/wildcard-barrel
export { defineConfig } from '../vite/index.ts'
export * from '../../framework.ts'
export * from './framework.ts'

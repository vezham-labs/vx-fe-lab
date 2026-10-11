import { afterEach, expect, it, vi } from 'vitest'

import { defineConfig } from './index'

vi.mock('react-dom/client', () => ({
  default: { createRoot: () => ({ render: vi.fn() }) }
}))
vi.mock('@vezham/use-logger', () => ({ useLogger: { log: vi.fn() } }))
vi.mock('@vx/env/vite', () => ({
  APP_ID: 'test',
  APP_NAME: 'Test',
  APP_VER: '1'
}))
vi.mock('./provider', () => ({ Provider: () => null }))

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
})

it.each([
  ['ta', 'ta'],
  [undefined, 'en']
])('sets the document language for %s', (lang, expected) => {
  document.body.innerHTML = '<div id="root"></div>'
  defineConfig({ lang })
  expect(document.documentElement.lang).toBe(expected)
})

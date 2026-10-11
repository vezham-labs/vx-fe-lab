import { Outlet } from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'

import { RootDocument, createRootComponent, defineConfig } from './index'

vi.mock('@vx/env/vite', () => ({
  APP_ID: 'test-app',
  APP_NAME: 'Test App',
  APP_VER: '27.0.0',
  APP_ENV: 'local',
  __DEV__: false,
  __DEBUG__: false
}))

describe('TanStack root component', () => {
  it('renders the router outlet by default', () => {
    const root = defineConfig({})

    expect(root.type).toBe(RootDocument)
    expect(root.props.children.type).toBe(Outlet)
  })

  it('renders custom children when supplied', () => {
    const children = <main>Application</main>
    const RootComponent = createRootComponent({ children })
    const root = RootComponent()

    expect(root.type).toBe(RootDocument)
    expect(root.props.children).toBe(children)
  })
})

import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  notFound,
  useRouter
} from '@tanstack/react-router'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { RouterRoot, createRouter } from './index'

vi.mock('@vx/env/vite', () => ({
  APP_ID: 'test',
  APP_NAME: 'Test',
  APP_VER: '1',
  APP_ENV: 'development',
  __DEV__: true
}))
vi.mock('@vx/template/components', () => ({
  Loading: () => null,
  ErrorPage: () => <span>Route error</span>,
  NotFound: () => <span>Not found</span>
}))
vi.mock('../../provider/shared/devtools', () => ({
  ClientDevtools: ({ env }: { env: boolean }) => {
    const router = useRouter()
    return env ? <span>Devtools: {router.state.location.pathname}</span> : null
  }
}))

afterEach(cleanup)

it('keeps the shell mounted when a catch-all throws notFound', async () => {
  const root = createRootRoute({
    component: () => (
      <main>
        <span>App shell</span>
        <Outlet />
      </main>
    )
  })
  const page = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <span>Home page</span>
  })
  const missing = createRoute({
    getParentRoute: () => root,
    path: '$',
    beforeLoad: () => {
      throw notFound()
    }
  })
  const router = createRouter({
    routeTree: root.addChildren([page, missing]),
    history: createMemoryHistory({ initialEntries: ['/'] })
  })
  await router.load()
  render(<RouterProvider router={router} />)
  const shell = await screen.findByText('App shell')
  await act(() => router.navigate({ to: '/missing' }))
  expect(await screen.findByText('Not found')).toBeTruthy()
  expect(screen.getByText('App shell')).toBe(shell)
  await act(() => router.navigate({ to: '/' }))
  expect(await screen.findByText('Home page')).toBeTruthy()
  expect(screen.getByText('App shell')).toBe(shell)
})

it('respects the default and explicit route not-found components', async () => {
  const root = createRootRoute({ component: Outlet })
  const custom = createRoute({
    getParentRoute: () => root,
    path: 'custom',
    beforeLoad: () => {
      throw notFound()
    },
    notFoundComponent: () => <span>Custom not found</span>
  })
  const missing = createRoute({
    getParentRoute: () => root,
    path: '$',
    beforeLoad: () => {
      throw notFound()
    }
  })
  const router = createRouter({
    routeTree: root.addChildren([custom, missing]),
    history: createMemoryHistory({ initialEntries: ['/missing'] }),
    defaultNotFoundComponent: () => <span>Default not found</span>
  })
  await router.load()
  render(<RouterProvider router={router} />)
  expect(await screen.findByText('Default not found')).toBeTruthy()
  await act(() => router.navigate({ to: '/custom' }))
  expect(await screen.findByText('Custom not found')).toBeTruthy()
})

it('renders route content and devtools inside the same router context', async () => {
  const root = createRootRoute({ component: RouterRoot })
  const page = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <span>Page content</span>
  })
  const router = createRouter({
    routeTree: root.addChildren([page]),
    history: createMemoryHistory({ initialEntries: ['/'] })
  })
  await router.load()
  render(<RouterProvider router={router} />)
  expect(await screen.findByText('Page content')).toBeTruthy()
  expect(await screen.findByText('Devtools: /')).toBeTruthy()
})

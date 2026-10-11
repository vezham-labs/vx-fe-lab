import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from '@tanstack/react-router'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { toast } from '@vezham/react-v3'

import { useAppMenu } from '../../components/app-menu'
import { useToolbarAction } from '../../components/toolbar-actions'
import { useSettingsNavigation } from '../../pages/settings/navigation'
import { useUser } from '../../store/users/useUserStore'
import { AppFrame, AppLayout } from './index'

vi.mock('../menu-layout', () => ({ MenuLayout: () => null }))

it('dispatches app menu actions to the active page and reports unhandled actions', async () => {
  const handler = vi.fn()
  const notice = vi.spyOn(toast, 'info').mockReturnValue('app-menu-notice')
  const action = { key: 'file.new', label: 'New…' }
  const Consumer = () => {
    const menu = useAppMenu()
    useToolbarAction('file.new', handler, { pageKey: 'records' })
    if (!menu) throw new Error('App menu context was not provided')
    return (
      <button onClick={() => menu.onAction(menu.items[0].groups[0][0])}>
        New record
      </button>
    )
  }
  const root = createRootRoute({
    component: () => (
      <AppLayout
        navigationItems={[
          { key: 'records', title: 'Records', href: '/records' },
          { key: 'other', title: 'Other', href: '/other' }
        ]}
        appMenu={[{ key: 'file', label: 'File', groups: [[action]] }]}>
        <Consumer />
      </AppLayout>
    )
  })
  const records = createRoute({ getParentRoute: () => root, path: '/records' })
  const other = createRoute({ getParentRoute: () => root, path: '/other' })
  const router = createRouter({
    routeTree: root.addChildren([records, other]),
    history: createMemoryHistory({ initialEntries: ['/records'] })
  })
  try {
    await router.load()
    render(<RouterProvider router={router} />)
    fireEvent.click(await screen.findByRole('button', { name: 'New record' }))
    expect(handler).toHaveBeenCalledWith({
      actionKey: 'file.new',
      pageKey: 'records',
      pathname: '/records'
    })
    expect(notice).not.toHaveBeenCalled()
    await act(() => router.navigate({ to: '/other' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/other'))
    fireEvent.click(screen.getByRole('button', { name: 'New record' }))
    expect(handler).toHaveBeenCalledOnce()
    expect(notice).toHaveBeenCalledWith('TODO: New is not implemented yet.')
  } finally {
    notice.mockRestore()
  }
})

describe('AppFrame', () => {
  it('renders navigation and content in the shared app frame', () => {
    const markup = renderToStaticMarkup(
      <AppFrame
        navigation={<nav data-testid="navigation">Navigation</nav>}
        className="custom-frame"
        contentClassName="custom-content">
        <section data-testid="content">Content</section>
      </AppFrame>
    )

    expect(markup).toContain('data-vx="app-layout"')
    expect(markup).toContain('data-slot="app-layout-content"')
    expect(markup).toContain('data-testid="navigation"')
    expect(markup).toContain('data-testid="content"')
    expect(markup).toContain('custom-frame')
    expect(markup).toContain('custom-content')
  })
})

it.each([false, true])(
  'renders the outlet and preserves user state with settings=%s',
  async settings => {
    const Probe = () => {
      const { user, updateUser } = useUser()
      const openSettings = useSettingsNavigation()
      return (
        <>
          <span>{user?.firstName}</span>
          <button onClick={() => updateUser({ firstName: 'Updated' })}>
            Update user
          </button>
          <span>{openSettings ? 'Settings enabled' : 'Settings disabled'}</span>
        </>
      )
    }
    const root = createRootRoute({
      component: () => <AppLayout navigationItems={[]} settings={settings} />
    })
    const home = createRoute({
      getParentRoute: () => root,
      path: '/',
      component: Probe
    })
    const settingsRoute = createRoute({
      getParentRoute: () => root,
      path: '/settings',
      component: Probe
    })
    const router = createRouter({
      routeTree: root.addChildren([home, settingsRoute]),
      history: createMemoryHistory({ initialEntries: ['/'] })
    })
    await router.load()
    const { container } = render(<RouterProvider router={router} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Update user' }))
    await act(() => router.navigate({ to: '/settings' }))
    expect(await screen.findByText('Updated')).toBeInTheDocument()
    expect(
      screen.getByText(settings ? 'Settings enabled' : 'Settings disabled')
    ).toBeInTheDocument()
    const content = container.querySelector('[data-slot="app-layout-content"]')
    if (settings) expect(content).toHaveClass('p-0', 'overflow-hidden')
    else expect(content).toHaveClass('pt-18')
  }
)

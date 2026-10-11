import { fireEvent, render, screen } from '@testing-library/react'
import { type ComponentProps, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Header } from '../../components/panel/header'
import { type HeaderActionsProps } from '../../components/panel/header/types'
import type { AppNavigationItem } from '../../navigation'
import { MenuMD } from './index-md'

const items: AppNavigationItem[] = [
  { key: 'home', title: 'Home', href: '/', icon: 'vx:home' },
  { key: 'academic', title: 'Academic', href: '/academic', icon: 'vx:library' },
  { key: 'reports', title: 'Reports', href: '/reports', icon: 'vx:chart' }
]

const state = vi.hoisted(() => ({
  pathname: '/',
  isNavigationCollapsed: false,
  toggleNavigation: vi.fn(),
  closeInfoPanel: vi.fn(),
  openCommand: vi.fn(),
  closeCommand: vi.fn()
}))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: state.pathname })
}))
vi.mock('../../components/workspace-navigation', () => ({
  useWorkspaceNavigation: () => state,
  useSidebarShortcut: vi.fn()
}))
vi.mock('../../components/command', () => ({
  useCommand: () => state
}))
vi.mock('../../components/panel/info-panel', () => ({
  useInfoPanel: () => state,
  InfoPanelContainer: () => null
}))
vi.mock('../../store/users/useUserStore', () => ({
  useUser: () => ({ user: null })
}))
vi.mock('../../components/panel/header', () => ({
  Header: vi.fn(
    ({
      compact,
      onToggleDock,
      showMenuUtilities = true
    }: HeaderActionsProps) =>
      compact ? (
        <div>
          <button onClick={onToggleDock}>Show Dock</button>
          {showMenuUtilities && (
            <button onClick={state.openCommand}>Open command palette</button>
          )}
        </div>
      ) : (
        <div>
          Application menu
          {showMenuUtilities && onToggleDock && (
            <button onClick={onToggleDock}>Hide Dock</button>
          )}
          {showMenuUtilities && (
            <button onClick={state.openCommand}>Open command palette</button>
          )}
        </div>
      )
  )
}))
vi.mock('../../components/panel/menu', () => ({ Menu: () => null }))
vi.mock('../../components/panel/footer', () => ({ Footer: () => null }))
vi.mock('../../components/panel/footer/ai', () => ({ aiPanel: {} }))
vi.mock('../../components/panel/header/bookmarks', () => ({
  bookmarksPanel: {}
}))
vi.mock('../../components/panel/header/storage', () => ({ storagePanel: {} }))
vi.mock('../../components/panel/footer/notification-center', () => ({
  NotificationDrawer: () => null
}))
vi.mock('../../components/panel/footer/preferences/modal', () => ({
  UserInfoModal: () => null
}))
vi.mock('@vezham/react-v3', () => ({
  Surface: ({
    children,
    role,
    className,
    'aria-label': label,
    'data-vx': vx
  }: ComponentProps<'div'> & { 'data-vx'?: string; children?: ReactNode }) => (
    <div role={role} aria-label={label} className={className} data-vx={vx}>
      {children}
    </div>
  )
}))

describe('Home desktop navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.pathname = '/'
    state.isNavigationCollapsed = false
  })

  it('closes auxiliary panels and restores the rail from the Home bubble', () => {
    render(<MenuMD items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hide Dock' }))

    expect(state.closeInfoPanel).toHaveBeenCalledOnce()
    expect(state.closeCommand).toHaveBeenCalledOnce()
    expect(screen.queryByText('Application menu')).toBeNull()

    expect(vi.mocked(Header).mock.lastCall?.[0]).toMatchObject({
      compact: true,
      showBookamarks: true,
      showStorage: true
    })

    fireEvent.click(screen.getByRole('button', { name: 'Show Dock' }))
    expect(screen.getByText('Application menu')).toBeTruthy()
    expect(state.toggleNavigation).not.toHaveBeenCalled()
  })

  it('opens search from the bubble without expanding the rail', () => {
    render(<MenuMD items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hide Dock' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Open command palette' })
    )

    expect(state.openCommand).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Show Dock' })).toBeTruthy()
  })

  it('keeps Home collapsed independently when navigating to a module and back', () => {
    const { rerender } = render(<MenuMD items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hide Dock' }))

    state.pathname = '/academic'
    rerender(<MenuMD items={items} />)
    expect(screen.getByText('Application menu')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Hide Dock' })).toBeTruthy()

    state.pathname = '/'
    rerender(<MenuMD items={items} />)
    expect(screen.getByRole('button', { name: 'Show Dock' })).toBeTruthy()
  })

  it.each(['/academic', '/reports/grade'])(
    'keeps dock and search actions on %s in expanded and bubble modes',
    pathname => {
      state.pathname = pathname
      const { rerender } = render(<MenuMD items={items} />)
      fireEvent.click(
        screen.getByRole('button', { name: 'Open command palette' })
      )
      expect(state.openCommand).toHaveBeenCalledOnce()
      fireEvent.click(screen.getByRole('button', { name: 'Hide Dock' }))
      expect(state.toggleNavigation).toHaveBeenCalledOnce()
      state.isNavigationCollapsed = true
      rerender(<MenuMD items={items} />)
      expect(screen.queryByText('Application menu')).toBeNull()
      expect(vi.mocked(Header).mock.lastCall?.[0]).toMatchObject({
        compact: true,
        showBookamarks: true,
        showStorage: true
      })
      fireEvent.click(
        screen.getByRole('button', { name: 'Open command palette' })
      )
      expect(state.openCommand).toHaveBeenCalledTimes(2)
      fireEvent.click(screen.getByRole('button', { name: 'Show Dock' }))
      expect(state.toggleNavigation).toHaveBeenCalledTimes(2)
    }
  )

  it('preserves the module bubble and its existing expand action', () => {
    state.isNavigationCollapsed = true
    const { rerender } = render(<MenuMD items={items} />)
    expect(screen.getByText('Application menu')).toBeTruthy()

    state.pathname = '/reports/grade'
    rerender(<MenuMD items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Show Dock' }))
    expect(state.toggleNavigation).toHaveBeenCalledOnce()
    expect(screen.queryByRole('group', { name: 'Home navigation' })).toBeNull()
  })

  it('reuses the compact application header with the same app avatar', () => {
    render(<MenuMD items={items} />)
    const expandedUsers = vi.mocked(Header).mock.calls[0][0].users
    fireEvent.click(screen.getByRole('button', { name: 'Hide Dock' }))

    expect(screen.getByRole('group', { name: 'Home navigation' })).toBeTruthy()
    expect(vi.mocked(Header).mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ compact: true, users: expandedUsers })
    )
  })

  it('keeps the Home gutter on collapse but still releases it on module pages', () => {
    const { container, rerender } = render(<MenuMD items={items} />)
    const rail = container.querySelector('[data-vx="menu-layout"]')
    expect(rail).toHaveClass('w-[105px]')

    fireEvent.click(screen.getByRole('button', { name: 'Hide Dock' }))
    expect(rail).toHaveClass('w-[105px]', 'p-0', 'border-0')
    expect(rail).not.toHaveClass('w-0')
    expect(rail).toBeEmptyDOMElement()

    fireEvent.click(screen.getByRole('button', { name: 'Show Dock' }))
    expect(rail).toHaveClass('w-[105px]')

    state.pathname = '/academic'
    state.isNavigationCollapsed = true
    rerender(<MenuMD items={items} />)
    expect(rail).toHaveClass('w-0')
    expect(rail).not.toHaveClass('w-[106px]')
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  WorkspaceNavigationProvider,
  useSidebarShortcut,
  useWorkspaceNavigation
} from './index'

vi.mock('../command', () => ({
  useCommand: () => ({ closeCommand: vi.fn() })
}))
vi.mock('../panel/info-panel', () => ({
  useInfoPanel: () => ({ closeInfoPanel: vi.fn() })
}))

const NavigationState = () => {
  const { isNavigationCollapsed } = useWorkspaceNavigation()
  return <output>{isNavigationCollapsed ? 'hidden' : 'shown'}</output>
}

const ActiveSidebar = ({ onToggle }: { onToggle: () => void }) => {
  useSidebarShortcut(onToggle)
  return null
}

const pressSidebarShortcut = () => {
  fireEvent.keyDown(document, { key: 's', code: 'KeyS', metaKey: true })
  fireEvent.keyUp(document, { key: 's', code: 'KeyS', metaKey: true })
}

describe('Sidebar shortcut dispatch', () => {
  it('toggles the shell once per key press', () => {
    render(
      <WorkspaceNavigationProvider>
        <NavigationState />
      </WorkspaceNavigationProvider>
    )
    pressSidebarShortcut()
    expect(screen.getByRole('status')).toHaveTextContent('hidden')
    pressSidebarShortcut()
    expect(screen.getByRole('status')).toHaveTextContent('shown')
  })

  it('uses the active sidebar handler and restores the shell on unmount', () => {
    const onToggle = vi.fn()
    const { rerender } = render(
      <WorkspaceNavigationProvider>
        <NavigationState />
        <ActiveSidebar onToggle={onToggle} />
      </WorkspaceNavigationProvider>
    )
    pressSidebarShortcut()
    expect(onToggle).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toHaveTextContent('shown')

    rerender(
      <WorkspaceNavigationProvider>
        <NavigationState />
      </WorkspaceNavigationProvider>
    )
    pressSidebarShortcut()
    expect(onToggle).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toHaveTextContent('hidden')
  })
})

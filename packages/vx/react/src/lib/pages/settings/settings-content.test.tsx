import { act, fireEvent, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'

import { UserProvider } from '../../store/users/useUserStore'
import { SettingsContent } from './settings-content'
import { TileGallery } from './tile-gallery'

afterEach(() => {
  localStorage.removeItem('demo:notification-settings')
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-theme-mode')
})

it('hydrates saved notification preferences without changing the initial server markup', async () => {
  localStorage.setItem(
    'demo:notification-settings',
    JSON.stringify({ sounds: false, badges: true })
  )
  const element = (
    <UserProvider>
      <SettingsContent active="Notifications" />
    </UserProvider>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(element)
  document.body.append(container)
  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError })
    })
    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(
      screen.getByRole('switch', { name: 'Notification sounds' })
    ).not.toBeChecked()
    expect(
      screen.getByRole('switch', { name: 'Notification badges' })
    ).toBeChecked()
    fireEvent.click(screen.getByRole('switch', { name: 'Notification sounds' }))
    const preferences = localStorage.getItem('demo:notification-settings')
    if (preferences === null)
      throw new Error('Notification preferences were not saved')
    expect(JSON.parse(preferences)).toEqual({ sounds: true, badges: true })
  } finally {
    await act(async () => root?.unmount())
    container.remove()
  }
})

it('drops a hidden gallery tile into empty preview space without requiring an existing drop target', () => {
  const onPlace = vi.fn()
  const tiles = [
    {
      id: 'first',
      label: 'First',
      category: 'General',
      shape: 'small' as const
    },
    {
      id: 'second',
      label: 'Second',
      category: 'General',
      shape: 'small' as const
    }
  ]
  render(
    <TileGallery
      title="Edit Widgets"
      kind="widgets"
      tiles={tiles}
      onDone={vi.fn()}
      editor={{
        items: tiles.map(tile => ({
          id: tile.id,
          label: tile.label,
          visible: tile.id === 'first',
          editable: true
        })),
        onPlace,
        onVisibilityChange: vi.fn(),
        onMove: vi.fn(),
        onReset: vi.fn()
      }}
    />
  )
  fireEvent.drop(
    screen.getByRole('complementary', {
      name: 'Current widgets',
      hidden: true
    }),
    {
      dataTransfer: { getData: () => 'second' }
    }
  )
  expect(onPlace).toHaveBeenCalledWith('second', undefined)
})

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserProvider } from '../../../../store/users/useUserStore'
import { Footer } from '../index'
import { ControlCenter } from './index'
import type { TileDefinition } from './types'

const viewport = vi.hoisted(() => ({ compact: false }))

vi.mock('@vezham/react-v3', async importOriginal => ({
  ...(await importOriginal<typeof import('@vezham/react-v3')>()),
  useMediaQuery: () => viewport.compact
}))

type Context = { language: string; onThemeChange: (language: string) => void }

const tiles: readonly TileDefinition<Context>[] = [
  {
    id: 'theme',
    span: 'compact',
    label: 'Change theme',
    onAction: ({ language, onThemeChange }) => onThemeChange(language)
  },
  {
    id: 'language',
    title: 'Language',
    span: 'wide',
    Tile: ({ language, onOpen }) => (
      <button onClick={onOpen}>Language: {language}</button>
    ),
    Panel: ({ language }) => <p>Current language: {language}</p>
  }
]

beforeEach(() => {
  viewport.compact = false
})

describe('ControlCenter', () => {
  it.each([false, true])(
    'opens the new default from the footer without app registration (compact: %s)',
    async compact => {
      viewport.compact = compact
      render(
        <UserProvider>
          <Footer
            user={{ id: 'guest', name: 'Guest' }}
            showControlCenter
            showUserInfo={false}
          />
        </UserProvider>
      )
      if (compact) {
        expect(
          screen.queryByRole('button', { name: 'Control center' })
        ).toBeNull()
        fireEvent.click(
          screen.getByRole('button', { name: 'Open footer actions' })
        )
        fireEvent.click(
          await screen.findByRole('menuitem', { name: 'Control center' })
        )
      } else {
        const triggers = screen.getAllByRole('button', {
          name: 'Control center'
        })
        expect(triggers).toHaveLength(1)
        fireEvent.click(triggers[0])
      }
      const dialog = await screen.findByRole('dialog', {
        name: 'Control Center'
      })
      expect(Boolean(dialog.closest('[data-slot="sheet-backdrop"]'))).toBe(
        compact
      )
      expect(screen.getByRole('button', { name: 'Appearance' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Theme' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Direction' })).toBeTruthy()
      expect(screen.queryByRole('button', { name: 'Edit Controls' })).toBeNull()
      expect(screen.queryByText(/Device controls are simulated/)).toBeNull()
      expect(screen.queryByRole('button', { name: 'Wi-Fi' })).toBeNull()
      fireEvent.click(screen.getByRole('button', { name: 'Appearance' }))
      await screen.findByRole('button', { name: 'Auto' })
      fireEvent.keyDown(dialog, { key: 'Escape' })
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    }
  )

  it('hides the default when the footer control is disabled', () => {
    render(
      <UserProvider>
        <Footer user={{ id: 'guest', name: 'Guest' }} showUserInfo={false} />
      </UserProvider>
    )
    expect(screen.queryByRole('button', { name: 'Control center' })).toBeNull()
  })
  it('renders an app-provided control center once in the footer', async () => {
    render(
      <UserProvider>
        <Footer
          user={{ id: 'guest', name: 'Guest' }}
          showControlCenter
          showUserInfo={false}
          controlCenter={
            <ControlCenter
              context={{ language: 'English', onThemeChange: vi.fn() }}
              tiles={tiles}
              placement="right bottom"
            />
          }
        />
      </UserProvider>
    )
    const triggers = screen.getAllByRole('button', { name: 'Control center' })
    expect(triggers).toHaveLength(1)
    fireEvent.click(triggers[0])
    await screen.findByRole('dialog', { name: 'Control Center' })
    expect(
      screen.getByRole('button', { name: 'Language: English' })
    ).toBeTruthy()
  })
  it('runs direct actions, navigates details locally, and resets on close', async () => {
    const onThemeChange = vi.fn()
    const { rerender } = render(
      <ControlCenter
        context={{ language: 'English', onThemeChange }}
        tiles={tiles}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    await screen.findByRole('dialog', { name: 'Control Center' })
    fireEvent.click(screen.getByRole('button', { name: 'Change theme' }))
    expect(onThemeChange).toHaveBeenCalledOnce()
    expect(onThemeChange).toHaveBeenCalledWith('English')
    expect(screen.queryByText('Current language: English')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Language: English' }))
    expect(screen.getByText('Current language: English')).toBeTruthy()
    rerender(
      <ControlCenter
        context={{ language: 'Tamil', onThemeChange }}
        tiles={tiles}
      />
    )
    expect(screen.getByText('Current language: Tamil')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Back to Control Center' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Change theme' }))
    expect(onThemeChange).toHaveBeenLastCalledWith('Tamil')
    fireEvent.click(screen.getByRole('button', { name: 'Language: Tamil' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    await screen.findByRole('dialog', { name: 'Control Center' })
    expect(screen.getByRole('button', { name: 'Language: Tamil' })).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Back to Control Center' })
    ).toBeNull()
  })

  it('uses a bottom sheet on small screens and returns focus after pressing Close', async () => {
    viewport.compact = true
    render(
      <ControlCenter
        context={{ language: 'English', onThemeChange: vi.fn() }}
        tiles={tiles}
      />
    )
    const trigger = screen.getByRole('button', { name: 'Control center' })
    act(() => trigger.focus())
    fireEvent.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Control Center' })
    expect(dialog.closest('[data-slot="sheet-backdrop"]')).toBeTruthy()
    expect(dialog.getAttribute('data-placement')).toBe('bottom')
    expect(document.querySelector('[data-slot="sheet-handle"]')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Close Control Center' })
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })
})

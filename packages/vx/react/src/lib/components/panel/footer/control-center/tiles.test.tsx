import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  AppearanceSettings,
  AppearanceTile,
  AppearanceToggle,
  ControlCenter,
  type LanguageAdapter,
  LanguageSettings,
  LanguageTile,
  ThemeSettings,
  ThemeTile,
  type TileDefinition
} from './index'

const tiles = [
  { id: 'theme', span: 'compact', Tile: AppearanceToggle },
  {
    id: 'language',
    span: 'wide',
    Tile: LanguageTile,
    title: 'Language',
    Panel: LanguageSettings
  }
] as const satisfies readonly TileDefinition<{
  language: LanguageAdapter
}>[]

afterEach(() => {
  vi.restoreAllMocks()
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-theme-mode')
})

describe('shared control center tiles', () => {
  it('follows system appearance in Auto while closed, and stops after manual selection', async () => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listeners = new Set<EventListenerOrEventListenerObject>()
    const systemMedia = {
      ...media,
      matches: false
    }
    vi.spyOn(systemMedia, 'addEventListener').mockImplementation(
      (_event, listener) => {
        listeners.add(listener)
      }
    )
    vi.spyOn(systemMedia, 'removeEventListener').mockImplementation(
      (_event, listener) => {
        listeners.delete(listener)
      }
    )
    const notifySystemChange = () =>
      listeners.forEach(listener => {
        const event = new Event('change')
        if (typeof listener === 'function') listener(event)
        else listener.handleEvent(event)
      })
    const matchMedia = window.matchMedia.bind(window)
    vi.spyOn(window, 'matchMedia').mockImplementation(query =>
      query === '(prefers-color-scheme: dark)' ? systemMedia : matchMedia(query)
    )
    const themeTiles: readonly TileDefinition[] = [
      {
        id: 'theme',
        span: 'wide',
        Tile: AppearanceTile,
        title: 'Appearance',
        Panel: AppearanceSettings
      }
    ]
    const { unmount } = render(
      <ControlCenter tiles={themeTiles} context={{}} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Appearance' }))
    const auto = await screen.findByRole('button', { name: 'Auto' })
    fireEvent.click(auto)
    await waitFor(() => expect(auto.getAttribute('aria-pressed')).toBe('true'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    act(() => {
      systemMedia.matches = true
      notifySystemChange()
    })
    await waitFor(() =>
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    )
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Appearance' }))
    expect(
      (await screen.findByRole('button', { name: 'Auto' })).getAttribute(
        'aria-pressed'
      )
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Light' }))
    await waitFor(() =>
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    )
    act(notifySystemChange)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    unmount()
    expect(listeners.size).toBe(0)
  })

  it('changes accent colors without changing appearance and restores original theme overrides', async () => {
    const root = document.documentElement
    const originalStyle = root.getAttribute('style')
    const themeTiles: readonly TileDefinition[] = [
      {
        id: 'theme',
        span: 'wide',
        Tile: ThemeTile,
        title: 'Theme',
        Panel: ThemeSettings
      }
    ]
    root.classList.add('dark')
    root.style.setProperty('--accent', '#123456', 'important')
    try {
      render(<ControlCenter tiles={themeTiles} context={{}} />)
      fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
      fireEvent.click(await screen.findByRole('button', { name: 'Theme' }))
      const purple = await screen.findByRole('option', { name: 'Purple' })
      fireEvent.click(purple)
      await waitFor(() =>
        expect(purple.getAttribute('aria-selected')).toBe('true')
      )
      expect(root.style.getPropertyValue('--accent')).toBe('#7d3fc8')
      expect(root.style.getPropertyValue('--heroui-primary')).toContain('%')
      expect(root.classList.contains('dark')).toBe(true)
      fireEvent.click(
        screen.getByRole('button', { name: 'Back to Control Center' })
      )
      expect(
        (await screen.findByRole('button', { name: 'Theme' })).textContent
      ).toContain('Purple')
      fireEvent.click(screen.getByRole('button', { name: 'Theme' }))
      expect(
        (await screen.findByRole('option', { name: 'Purple' })).getAttribute(
          'aria-selected'
        )
      ).toBe('true')
      fireEvent.click(screen.getByRole('button', { name: 'Default' }))
      await waitFor(() =>
        expect(root.style.getPropertyValue('--accent')).toBe('#123456')
      )
      expect(root.style.getPropertyPriority('--accent')).toBe('important')
      expect(root.style.getPropertyValue('--heroui-primary')).toBe('')
    } finally {
      if (originalStyle === null) root.removeAttribute('style')
      else root.setAttribute('style', originalStyle)
      root.removeAttribute('data-vx-theme-color')
    }
  })

  it('uses the supplied appearance adapter and responds to updated theme state', async () => {
    const setDark = vi.fn()
    const context = {
      language: { value: 'en', options: [], onChange: vi.fn() }
    }
    const { rerender } = render(
      <ControlCenter
        tiles={tiles}
        context={context}
        appearance={{ isDark: true, setDark }}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    const toggle = await screen.findByRole('button', {
      name: 'Switch to light mode'
    })
    fireEvent.click(toggle)
    expect(setDark).toHaveBeenCalledWith(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    rerender(
      <ControlCenter
        tiles={tiles}
        context={context}
        appearance={{ isDark: false, setDark }}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeTruthy()
    // vx-bot/NOTE: An app-provided theme remains authoritative over the root class.
    act(() => document.documentElement.classList.add('dark'))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Switch to dark mode' })
      ).toBeTruthy()
    )
  })

  it('renders language destinations, preserves modified clicks, and calls the app action', async () => {
    const onChange = vi.fn()
    const language = {
      value: 'en',
      options: [
        { value: 'en', label: 'English', href: '#en' },
        { value: 'ta', label: 'Tamil', href: '#ta' }
      ],
      onChange
    }
    const { rerender } = render(
      <ControlCenter tiles={tiles} context={{ language }} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Language' }))
    const tamil = screen.getByRole('link', { name: 'Tamil' })
    expect(tamil.getAttribute('href')).toBe('#ta')
    expect(
      screen.getByRole('link', { name: 'English' }).getAttribute('aria-current')
    ).toBe('true')
    fireEvent.click(tamil, { ctrlKey: true })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(tamil)
    expect(onChange).toHaveBeenCalledWith('ta')
    rerender(
      <ControlCenter
        tiles={tiles}
        context={{ language: { ...language, value: 'ta' } }}
      />
    )
    expect(tamil.getAttribute('aria-current')).toBe('true')
  })
})

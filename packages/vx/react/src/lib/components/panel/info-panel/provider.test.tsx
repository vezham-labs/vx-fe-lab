import { detectPlatform } from '@tanstack/react-hotkeys'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { InfoPanelProvider, useInfoPanel } from './provider'

const PanelState = () => {
  const { activeInfoPanel, isOpen } = useInfoPanel()
  return (
    <>
      <output>{isOpen ? activeInfoPanel : 'closed'}</output>
      <input aria-label="Edit text" />
    </>
  )
}

const shortcut = {
  key: 'B',
  code: 'KeyB',
  shiftKey: true,
  metaKey: detectPlatform() === 'mac',
  ctrlKey: detectPlatform() !== 'mac'
}

it('migrates the saved Disc panel to Storage', () => {
  window.localStorage.setItem(
    'vx-app:info-panel',
    JSON.stringify({ activeInfoPanel: 'disc', isOpen: true })
  )
  render(
    <InfoPanelProvider>
      <PanelState />
    </InfoPanelProvider>
  )
  expect(screen.getByRole('status')).toHaveTextContent('storage')
  expect(
    JSON.parse(window.localStorage.getItem('vx-app:info-panel') ?? '{}')
  ).toEqual({ activeInfoPanel: 'storage', isOpen: true })
})

describe.each([
  ['B', 'bookmarks'],
  ['S', 'storage']
])('%s panel shortcut', (key, panel) => {
  const panelShortcut = { ...shortcut, key, code: `Key${key}` }
  beforeEach(() => window.localStorage.clear())

  it('toggles the panel and prevents the default action', () => {
    render(
      <InfoPanelProvider>
        <PanelState />
      </InfoPanelProvider>
    )
    const event = createEvent.keyDown(document, panelShortcut)
    fireEvent(document, event)
    expect(screen.getByRole('status')).toHaveTextContent(panel)
    expect(event.defaultPrevented).toBe(true)
    fireEvent.keyUp(document, panelShortcut)
    fireEvent.keyDown(document, panelShortcut)
    expect(screen.getByRole('status')).toHaveTextContent('closed')
    fireEvent.keyUp(document, panelShortcut)
  })

  it('leaves editing fields alone', () => {
    render(
      <InfoPanelProvider>
        <PanelState />
      </InfoPanelProvider>
    )
    const input = screen.getByRole('textbox', { name: 'Edit text' })
    input.focus()
    fireEvent.keyDown(input, panelShortcut)
    expect(screen.getByRole('status')).toHaveTextContent('closed')
    fireEvent.keyUp(input, panelShortcut)
  })
})

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  ControlCenter,
  PreviewAirDropSettings,
  PreviewAirDropTile,
  PreviewBluetoothSettings,
  PreviewBluetoothTile,
  PreviewDisplayTile,
  PreviewFocusTile,
  PreviewMediaTile,
  PreviewMirroringSettings,
  PreviewMirroringTile,
  PreviewSoundTile,
  PreviewStageManagerTile,
  PreviewWiFiSettings,
  PreviewWiFiTile,
  type TileDefinition
} from './index'

const tiles: readonly TileDefinition[] = [
  {
    id: 'wifi',
    span: 'wide',
    Tile: PreviewWiFiTile,
    title: 'Wi-Fi',
    Panel: PreviewWiFiSettings
  },
  {
    id: 'bluetooth',
    span: 'wide',
    Tile: PreviewBluetoothTile,
    title: 'Bluetooth',
    Panel: PreviewBluetoothSettings
  },
  {
    id: 'airdrop',
    span: 'wide',
    Tile: PreviewAirDropTile,
    title: 'AirDrop',
    Panel: PreviewAirDropSettings
  },
  {
    id: 'focus',
    label: 'Do Not Disturb',
    span: 'full',
    Tile: PreviewFocusTile
  },
  {
    id: 'stage',
    label: 'Stage Manager',
    span: 'full',
    Tile: PreviewStageManagerTile
  },
  {
    id: 'mirror',
    span: 'full',
    Tile: PreviewMirroringTile,
    title: 'Screen Mirroring',
    Panel: PreviewMirroringSettings
  },
  {
    id: 'media',
    label: 'Media',
    span: 'full',
    Tile: PreviewMediaTile
  },
  {
    id: 'display',
    label: 'Display',
    span: 'full',
    Tile: PreviewDisplayTile
  },
  {
    id: 'sound',
    label: 'Sound',
    span: 'full',
    Tile: PreviewSoundTile
  }
]

const open = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
  return screen.findByRole('dialog', { name: 'Control Center' })
}
const back = () =>
  fireEvent.click(
    screen.getByRole('button', { name: 'Back to Control Center' })
  )

describe('Control Center UI preview', () => {
  it('changes simulated connections and keeps their state across panels and closing', async () => {
    render(<ControlCenter tiles={tiles} context={{}} preview />)
    await open()
    expect(screen.getByText(/Device controls are simulated/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Wi-Fi' }))
    fireEvent.click(await screen.findByRole('button', { name: 'iPhone' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Wi-Fi' }))
    expect(screen.queryByRole('button', { name: 'iPhone' })).toBeNull()
    back()
    expect(screen.getByRole('button', { name: 'Wi-Fi' }).textContent).toContain(
      'Off'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Bluetooth' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Keyboard' }))
    back()
    expect(
      screen.getByRole('button', { name: 'Bluetooth' }).textContent
    ).toContain('Keyboard')
    fireEvent.click(screen.getByRole('button', { name: 'AirDrop' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Everyone' }))
    back()
    fireEvent.click(screen.getByRole('button', { name: 'Screen Mirroring' }))
    fireEvent.click(
      await screen.findByRole('button', { name: 'Studio Display' })
    )
    back()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await open()
    expect(
      screen.getByRole('button', { name: 'AirDrop' }).textContent
    ).toContain('Everyone')
    expect(
      screen.getByRole('button', { name: 'Screen Mirroring' }).textContent
    ).toContain('Studio Display')
    fireEvent.click(screen.getByRole('button', { name: 'Wi-Fi' }))
    fireEvent.click(await screen.findByRole('switch', { name: 'Wi-Fi' }))
    expect(
      screen
        .getByRole('button', { name: 'iPhone' })
        .getAttribute('aria-pressed')
    ).toBe('true')
  })

  it('toggles focus and stage manager, plays a demo playlist, and adjusts display and sound', async () => {
    render(<ControlCenter tiles={tiles} context={{}} preview />)
    await open()
    const focus = screen.getByRole('button', { name: 'Do Not Disturb' })
    fireEvent.click(focus)
    expect(focus.getAttribute('aria-pressed')).toBe('true')
    const stage = screen.getByRole('button', { name: 'Stage Manager' })
    fireEvent.click(stage)
    expect(stage.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Play media' }))
    expect(screen.getByText('Morning Light')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next track' }))
    expect(screen.getByText('Quiet Hours')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Previous track' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pause media' }))
    expect(screen.getByText('Morning Light')).toBeTruthy()
    const brightness = screen.getByRole('slider', { name: 'Brightness' })
    act(() => brightness.focus())
    fireEvent.keyDown(brightness, { key: 'ArrowRight' })
    expect((brightness as HTMLInputElement).value).toBe('51')
    const volume = screen.getByRole('slider', { name: 'Volume' })
    act(() => volume.focus())
    fireEvent.keyDown(volume, { key: 'ArrowLeft' })
    expect((volume as HTMLInputElement).value).toBe('74')
    fireEvent.click(screen.getByRole('button', { name: 'Mute sound' }))
    expect(
      screen
        .getByRole('button', { name: 'Unmute sound' })
        .getAttribute('aria-pressed')
    ).toBe('true')
    expect(volume.hasAttribute('disabled')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Unmute sound' }))
    expect((volume as HTMLInputElement).value).toBe('74')
  })

  it('does not offer an inline editor without application Settings', async () => {
    render(<ControlCenter tiles={tiles} context={{}} preview editControls />)
    await open()
    expect(screen.queryByRole('button', { name: 'Edit Controls' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Reset Controls' })).toBeNull()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ShortcutTooltipLabel } from './index'

const platform = vi.hoisted(() => ({ value: 'mac' }))
vi.mock('@tanstack/react-hotkeys', () => ({
  detectPlatform: () => platform.value
}))

describe('Shortcut modifier display', () => {
  it.each([
    ['mac', '⌘'],
    ['windows', 'Ctrl'],
    ['linux', 'Ctrl']
  ])('shows the modifier for %s', (os, modifier) => {
    platform.value = os
    render(<ShortcutTooltipLabel label="Search" shortcut="Mod K" />)

    expect(screen.getByText('Search')).toBeTruthy()
    expect(screen.getByText(modifier)).toBeTruthy()
    expect(screen.getByLabelText(`${modifier} K`)).toBeTruthy()
    expect(screen.queryByText('Ctrl/⌘')).toBeNull()
  })
})

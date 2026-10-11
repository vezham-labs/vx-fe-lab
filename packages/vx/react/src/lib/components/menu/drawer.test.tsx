import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MenuDrawer } from './drawer'

const items = [{ key: 'reports', title: 'Reports', href: '/reports' }]

describe('bottom navigation More sheet', () => {
  it('selects a destination, closes the sheet, and restores focus to More', async () => {
    const select = vi.fn()
    const App = () => {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>More</button>
          <MenuDrawer
            items={items}
            selectedKey="reports"
            onItemSelect={select}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </>
      )
    }
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'More' })
    act(() => trigger.focus())
    fireEvent.click(trigger)
    const dialog = await screen.findByRole('dialog', {
      name: 'More navigation'
    })
    expect(dialog.closest('[data-slot="sheet-backdrop"]')).toBeTruthy()
    expect(dialog.getAttribute('data-placement')).toBe('bottom')
    fireEvent.click(screen.getByRole('button', { name: 'Reports' }))
    expect(select).toHaveBeenCalledWith(items[0])
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })
})

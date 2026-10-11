import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { InfoPanelContainer } from './container'
import { InfoPanelProvider, useInfoPanel } from './provider'

vi.mock('@vezham/react-v3', async importOriginal => ({
  ...(await importOriginal<typeof import('@vezham/react-v3')>()),
  useMediaQuery: () => false
}))

const Controls = () => {
  const { openInfoPanel, closeInfoPanel } = useInfoPanel()
  return (
    <>
      <button onClick={() => openInfoPanel('bookmarks')}>Open bookmarks</button>
      <button onClick={closeInfoPanel}>Close panel</button>
    </>
  )
}

it('keeps closing content inert until the CSS animation finishes and handles reopening', () => {
  localStorage.clear()
  render(
    <InfoPanelProvider>
      <Controls />
      <InfoPanelContainer
        panels={{
          bookmarks: {
            title: 'Bookmarks',
            content: <button>Bookmark entry</button>
          },
          storage: { title: 'Storage', content: null },
          ai: { title: 'AI', content: null }
        }}
      />
    </InfoPanelProvider>
  )
  fireEvent.click(screen.getByText('Open bookmarks'))
  const panel = screen.getByText('Bookmark entry').closest('[data-state]')
  if (!panel) throw new Error('Info panel content was not found')
  const aside = panel.closest('aside')
  if (!aside) throw new Error('Info panel container was not found')
  expect(panel).toHaveAttribute('data-state', 'open')
  expect(aside).toHaveStyle({ width: '328px' })
  fireEvent.click(screen.getByText('Close panel'))
  expect(panel).toHaveAttribute('inert')
  expect(aside).toHaveAttribute('aria-hidden', 'true')
  expect(aside).toHaveStyle({ width: '328px' })
  fireEvent.click(screen.getByText('Open bookmarks'))
  fireEvent.animationEnd(panel)
  fireEvent(panel, new Event('webkitAnimationEnd', { bubbles: true }))
  expect(panel).toHaveAttribute('data-state', 'open')
  expect(panel).not.toHaveAttribute('inert')
  fireEvent.click(screen.getByText('Close panel'))
  fireEvent.animationEnd(panel)
  fireEvent(panel, new Event('webkitAnimationEnd', { bubbles: true }))
  expect(screen.queryByText('Bookmark entry')).not.toBeInTheDocument()
  expect(aside).toHaveStyle({ width: '0px' })
})

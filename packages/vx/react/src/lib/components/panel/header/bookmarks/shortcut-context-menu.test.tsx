import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { FavoriteGridList } from './favorites/grid-list'
import { ShortcutContextMenu } from './shortcut-context-menu'

it.each([
  ['favorite', 'Remove Favorite'],
  ['pin', 'Unpin']
] as const)(
  'uses a %s context menu to remove the targeted shortcut',
  async (kind, label) => {
    const onRemove = vi.fn()
    const item = { id: 'docs', name: 'Docs', url: '/docs' }
    render(
      <ShortcutContextMenu items={[item]} kind={kind} onRemove={onRemove}>
        <button data-shortcut-id={item.id}>Open Docs</button>
      </ShortcutContextMenu>
    )
    expect(
      screen.queryByRole('button', { name: label })
    ).not.toBeInTheDocument()
    fireEvent.contextMenu(screen.getByText('Open Docs'), {
      clientX: 20,
      clientY: 20
    })
    fireEvent.click(await screen.findByRole('menuitem', { name: label }))
    expect(onRemove).toHaveBeenCalledWith('docs')
  }
)

it('removes a Favorite through its tile context menu without an inline remove button', async () => {
  const onRemove = vi.fn()
  render(
    <FavoriteGridList
      items={[{ id: 'docs', name: 'Docs', url: '/docs' }]}
      onRemove={onRemove}
    />
  )
  expect(
    screen.queryByRole('button', { name: /Remove/ })
  ).not.toBeInTheDocument()
  fireEvent.contextMenu(screen.getByTitle('Docs'), { clientX: 20, clientY: 20 })
  fireEvent.click(
    await screen.findByRole('menuitem', { name: 'Remove Favorite' })
  )
  expect(onRemove).toHaveBeenCalledWith('docs')
})

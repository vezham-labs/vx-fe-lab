import { createEvent, fireEvent, render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { ReorderableGridList } from './index'

it('starts a native drag from the favorite tile', () => {
  const { container } = render(
    <ReorderableGridList
      items={[
        { id: 'a', name: 'Classes', url: '/classes', avatar: '/avatar.png' }
      ]}
      onReorder={vi.fn()}
    />
  )
  const tile = container.querySelector('[data-shortcut-id="a"]')
  if (!tile) throw new Error('Favorite tile was not rendered')
  expect(tile.getAttribute('draggable')).toBe('true')
  const data = new Map<string, string>()
  const dataTransfer = {
    types: [],
    items: Object.assign([], {
      add: vi.fn((value: string, type: string) => data.set(type, value))
    }),
    clearData: () => data.clear(),
    getData: (type: string) => data.get(type) ?? '',
    setData: vi.fn((type: string, value: string) => data.set(type, value)),
    setDragImage: vi.fn()
  }
  const event = createEvent.dragStart(tile, {
    dataTransfer,
    clientX: 10,
    clientY: 10
  })
  fireEvent(tile, event)
  expect(event.defaultPrevented).toBe(false)
  expect(dataTransfer.items.add).toHaveBeenCalled()
  expect([...data.values()].join(' ')).toContain('Classes')
  fireEvent.dragEnd(tile, { dataTransfer })
})

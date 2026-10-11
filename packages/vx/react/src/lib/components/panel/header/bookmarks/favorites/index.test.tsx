import { act, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import type { FavoriteItem } from '../../../../../store/useBookmarks/types'
import { ReorderableGridList } from './index'

type DragOptions = Parameters<
  typeof import('react-aria-components').useDragAndDrop<FavoriteItem>
>[0]
const captured = vi.hoisted(() => ({ options: null as DragOptions | null }))
vi.mock('react-aria-components', async importOriginal => ({
  ...(await importOriginal<typeof import('react-aria-components')>()),
  useDragAndDrop: (options: DragOptions) => {
    captured.options = options
    return { dragAndDropHooks: {} }
  }
}))
vi.mock('./grid-list', () => ({
  FavoriteGridList: ({ items }: { items: FavoriteItem[] }) => (
    <div data-testid="order">{items.map(item => item.id).join(',')}</div>
  )
}))

const items = ['a', 'b', 'c'].map(id => ({ id, name: id, url: `/${id}` }))
const start = () =>
  captured.options?.onDragStart?.({
    type: 'dragstart',
    keys: new Set(['a']),
    x: 0,
    y: 0
  })
const enter = () =>
  captured.options?.onDropEnter?.({
    type: 'dropenter',
    x: 0,
    y: 0,
    target: { type: 'item', key: 'c', dropPosition: 'after' }
  })

it('previews movement immediately and retains the dropped order until the store updates', () => {
  const onReorder = vi.fn()
  const view = render(
    <ReorderableGridList items={items} onReorder={onReorder} />
  )
  act(start)
  act(enter)
  expect(screen.getByTestId('order').textContent).toBe('b,c,a')
  expect(onReorder).not.toHaveBeenCalled()
  act(() =>
    captured.options?.onReorder?.({
      keys: new Set(['a']),
      dropOperation: 'move',
      target: { type: 'item', key: 'c', dropPosition: 'after' }
    })
  )
  act(() =>
    captured.options?.onDragEnd?.({
      type: 'dragend',
      keys: new Set(['a']),
      x: 0,
      y: 0,
      dropOperation: 'move',
      isInternal: true
    })
  )
  expect(screen.getByTestId('order').textContent).toBe('b,c,a')
  expect(onReorder).toHaveBeenCalledTimes(1)
  view.rerender(
    <ReorderableGridList
      items={onReorder.mock.calls[0][0]}
      onReorder={onReorder}
    />
  )
  expect(screen.getByTestId('order').textContent).toBe('b,c,a')
})

it('restores the original order on cancellation without updating the store', () => {
  const onReorder = vi.fn()
  render(<ReorderableGridList items={items} onReorder={onReorder} />)
  act(start)
  act(enter)
  act(() =>
    captured.options?.onDragEnd?.({
      type: 'dragend',
      keys: new Set(['a']),
      x: 0,
      y: 0,
      dropOperation: 'cancel',
      isInternal: false
    })
  )
  expect(screen.getByTestId('order').textContent).toBe('a,b,c')
  expect(onReorder).not.toHaveBeenCalled()
})

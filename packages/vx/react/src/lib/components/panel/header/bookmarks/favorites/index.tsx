import { useRef, useState } from 'react'
import { type Key, useDragAndDrop } from 'react-aria-components'

import type { FavoriteItem } from '../../../../../store/useBookmarks/types'
import { sampleFavorites } from './data'
import { FavoriteGridList } from './grid-list'
import { type FavoriteGridListProps } from './types'

type Props = Omit<FavoriteGridListProps, 'dragAndDropHooks'>
type Draft = { source: FavoriteItem[]; items: FavoriteItem[] }
type Drag = Draft & { keys: Set<Key>; committed: boolean }

const reorder = (
  items: FavoriteItem[],
  keys: Set<Key>,
  target: { key: Key; dropPosition: string }
) => {
  if (keys.has(target.key) || target.dropPosition === 'on') return items
  const moved = items.filter(item => keys.has(item.id))
  const remaining = items.filter(item => !keys.has(item.id))
  const index = remaining.findIndex(item => item.id === target.key)
  if (index < 0 || moved.length === 0) return items
  remaining.splice(
    index + (target.dropPosition === 'after' ? 1 : 0),
    0,
    ...moved
  )
  return remaining.every((item, index) => item.id === items[index].id)
    ? items
    : remaining
}

const ReorderableGridList = (props: Props) => {
  const [internalItems, setInternalItems] = useState(
    props.items ?? sampleFavorites
  )
  const controlled = Boolean(props.items && props.onReorder)
  const items = controlled ? (props.items ?? internalItems) : internalItems
  const [draft, setDraft] = useState<Draft | null>(null)
  const drag = useRef<Drag | null>(null)
  const displayedItems = draft?.source === items ? draft.items : items

  const { dragAndDropHooks } = useDragAndDrop<FavoriteItem>({
    getAllowedDropOperations: () => ['move'],
    getItems(_keys, items) {
      return items.map(item => ({
        'text/plain': item.name,
        favorite: JSON.stringify(item)
      }))
    },
    onDragStart(event) {
      drag.current = {
        source: items,
        items,
        keys: event.keys,
        committed: false
      }
      setDraft(null)
    },
    onDropEnter(event) {
      const current = drag.current
      if (!current || event.target.type !== 'item') return
      const next = reorder(current.items, current.keys, event.target)
      if (next === current.items) return
      current.items = next
      setDraft({ source: current.source, items: next })
    },
    onReorder(event) {
      const current = drag.current
      const next = reorder(current?.items ?? items, event.keys, event.target)
      // vx-bot/NOTE: Keep the local order visible while the store notification catches up.
      setDraft({ source: current?.source ?? items, items: next })
      if (current) current.committed = true
      if (!controlled) setInternalItems(next)
      props.onReorder?.(next)
    },
    onDragEnd(event) {
      if (event.dropOperation !== 'move' || !event.isInternal) {
        setDraft(null)
        drag.current = null
      } else if (drag.current?.committed) {
        drag.current = null
      }
    }
  })

  return (
    <FavoriteGridList
      {...props}
      items={displayedItems}
      dragAndDropHooks={dragAndDropHooks}
    />
  )
}

export { ReorderableGridList }

import { type ReactNode, useState } from 'react'

import { ContextMenu } from '@vezham/react-pro-v3'
import { Label } from '@vezham/react-v3'

import { panelContextMenuClass } from '../../info-panel/styles'
import type { FavoriteItem } from './types'

type Props = {
  children: ReactNode
  items: readonly FavoriteItem[]
  kind: 'favorite' | 'pin'
  onRemove?: (id: string) => void
}

export const ShortcutContextMenu = ({
  children,
  items,
  kind,
  onRemove
}: Props) => {
  const [targetId, setTargetId] = useState<string | null>(null)
  const rememberTarget = (target: EventTarget | null) => {
    const element =
      target instanceof Element
        ? target.closest<HTMLElement>('[data-shortcut-id]')
        : null
    setTargetId(element?.dataset.shortcutId ?? null)
  }
  const target = items.find(item => item.id === targetId)
  const label = kind === 'favorite' ? 'Remove Favorite' : 'Unpin'
  return (
    <ContextMenu>
      <ContextMenu.Trigger className="block! w-full min-w-0">
        <div
          className="w-full min-w-0"
          onContextMenuCapture={event => rememberTarget(event.target)}
          onKeyDownCapture={event => {
            if (
              event.key === 'ContextMenu' ||
              (event.shiftKey && event.key === 'F10')
            )
              rememberTarget(event.target)
          }}>
          {children}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Popover className={panelContextMenuClass}>
        <ContextMenu.Menu
          aria-label={target ? `${target.name} actions` : 'Item actions'}>
          <ContextMenu.Item
            id="remove-shortcut"
            textValue={label}
            isDisabled={!target || !onRemove}
            onPress={() => target && onRemove?.(target.id)}>
            <Label>{label}</Label>
          </ContextMenu.Item>
        </ContextMenu.Menu>
      </ContextMenu.Popover>
    </ContextMenu>
  )
}

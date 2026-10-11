import React, { useMemo, useState } from 'react'
import { Collection } from 'react-aria-components/Collection'
import { useTreeData } from 'react-aria-components/useTreeData'

import {
  CodeFile,
  Folder,
  FolderOpen,
  TrashBinTrash
} from '@vezham/icons-react'
import { ContextMenu, FileTree, useFileTreeDrag } from '@vezham/react-pro-v3'
import { Avatar, Button } from '@vezham/react-v3'

import { AppIcon } from '../../../../app-icon'
import { panelContextMenuClass } from '../../../info-panel/styles'
import {
  BookmarkContextMenuItems,
  BrowserContextMenuItems
} from '../context-menu'
import {
  type BookmarkContextTarget,
  type FolderTarget
} from '../context-menu/types'
import { BookmarkSectionEmptyState } from '../empty-state'
import { FolderVisualPreview } from '../folder-modal'
import {
  DEFAULT_FOLDER_COLOR,
  DEFAULT_FOLDER_EMOJI,
  DEFAULT_FOLDER_ICON
} from '../folder-modal/variants'
import {
  type BookmarkItem,
  type BookmarkTreeItem,
  type TreeSelection
} from '../types'
import { type BookmarkFileTreeProps } from './types'
import { collectFolderTargets, moveBookmarkTreeItems } from './variants'

const folderIcon = ({ isExpanded }: { isExpanded: boolean }) =>
  isExpanded ? (
    <FolderOpen size={16} aria-hidden="true" />
  ) : (
    <Folder size={16} aria-hidden="true" />
  )

const BookmarkFileTree = ({
  items,
  defaultExpandedKeys,
  getFileTreeProps,
  getBookmarkTreeEmptyStateProps,
  onBookmarkClick,
  onBookmarkRemove,
  onFolderEdit,
  onFolderDelete,
  onNewFolder,
  onBookmarkMove,
  onTreeChange
}: BookmarkFileTreeProps) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(defaultExpandedKeys)
  )
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [contextTarget, setContextTarget] = useState<BookmarkContextTarget>({
    type: 'area'
  })

  const bookmarkById = useMemo(() => {
    return items.reduce((acc, item) => {
      const collect = (node: BookmarkTreeItem) => {
        if (node.kind === 'bookmark' && node.bookmark) {
          acc.set(node.id, node.bookmark)
        }

        node.children?.forEach(collect)
      }

      collect(item)
      return acc
    }, new Map<string, BookmarkItem>())
  }, [items])

  const tree = useTreeData<BookmarkTreeItem>({
    getChildren: item => item.children ?? [],
    getKey: item => item.id,
    initialItems: items
  })

  const { dragAndDropHooks } = useFileTreeDrag({
    tree,
    onMove: (
      keys: Set<React.Key>,
      target: { key: React.Key; dropPosition: string }
    ) => {
      const result = moveBookmarkTreeItems(
        items,
        [...keys].map(String),
        String(target.key),
        target.dropPosition
      )

      const { expandedKey } = result

      if (expandedKey) {
        setExpandedKeys(currentKeys => {
          const nextKeys = new Set(currentKeys)
          nextKeys.add(expandedKey)

          return nextKeys
        })
      }

      onTreeChange(result.items, result.expandedKey)
    }
  })

  const folderTargets = useMemo<FolderTarget[]>(
    () => collectFolderTargets(items),
    [items]
  )

  const renderBookmarkIcon = (item: BookmarkTreeItem) => {
    if (item.kind === 'folder') {
      if (item.visualType === 'emoji' && item.emoji) {
        return (
          <FolderVisualPreview
            color={item.color ?? DEFAULT_FOLDER_COLOR}
            visualType="emoji"
            emoji={item.emoji}
            icon={item.icon ?? DEFAULT_FOLDER_ICON}
            className="h-4 w-4 text-xs"
          />
        )
      }

      if (
        item.visualType === 'icon' &&
        item.icon &&
        item.icon !== DEFAULT_FOLDER_ICON
      ) {
        return (
          <FolderVisualPreview
            color={item.color ?? DEFAULT_FOLDER_COLOR}
            visualType="icon"
            emoji={item.emoji ?? DEFAULT_FOLDER_EMOJI}
            icon={item.icon}
            className="h-4 w-4 text-xs"
          />
        )
      }

      return ({ isExpanded }: { isExpanded: boolean }) => (
        <span className="text-warning">{folderIcon({ isExpanded })}</span>
      )
    }

    if (item.bookmark?.icon) {
      return <AppIcon icon={item.bookmark.icon} size="1em" aria-hidden="true" />
    }

    if (item.bookmark?.avatar || item.bookmark?.backgroundImage) {
      return (
        <Avatar className="h-4 w-4 shrink-0 rounded-sm">
          <Avatar.Image
            src={item.bookmark.avatar ?? item.bookmark.backgroundImage}
            alt={item.title}
          />
          <Avatar.Fallback>
            {item.title.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>
      )
    }

    return <CodeFile size={16} aria-hidden="true" />
  }

  const handleItemContextMenu = (
    event: React.MouseEvent,
    item: BookmarkTreeItem
  ) => {
    event.stopPropagation()
    setContextTarget({
      type: item.kind,
      item
    })
    setSelectedKeys(new Set([item.id]))
  }

  const handleAreaContextMenu = () => {
    setContextTarget({ type: 'area' })
    setSelectedKeys(new Set())
  }

  const handleSelectionChange = (keys: TreeSelection) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(items.map(item => item.id)))
      return
    }

    setSelectedKeys(new Set([...keys].map(String)))
  }

  const renderTitle = (item: (typeof tree.items)[number]) => (
    <div
      className="relative flex min-h-7 w-full min-w-0 flex-1 items-center gap-2 pe-0 group-hover/bookmark-item:pe-14 group-has-[:focus-visible]/bookmark-item:pe-14 group-data-[focus-visible]/bookmark-item:pe-14 [@media(hover:none)]:pe-14"
      onContextMenu={event => handleItemContextMenu(event, item.value)}>
      {item.value.kind === 'folder' ? (
        <button
          type="button"
          title={item.value.title}
          className="min-w-0 flex-1 cursor-pointer truncate text-start text-sm leading-5 font-semibold"
          aria-expanded={expandedKeys.has(String(item.key))}
          onClick={event => {
            event.stopPropagation()
            toggleFolder(String(item.key))
          }}>
          {item.value.title}
        </button>
      ) : (
        <span
          title={item.value.title}
          className="min-w-0 flex-1 truncate text-sm leading-5 font-normal">
          {item.value.title}
        </span>
      )}
      <Button
        isIconOnly
        aria-label={`Remove ${item.value.title}`}
        variant="ghost"
        size="sm"
        className="text-muted hover:text-danger absolute end-0 hidden size-7 min-w-0 shrink-0 group-hover/bookmark-item:inline-flex group-has-[:focus-visible]/bookmark-item:inline-flex group-data-[focus-visible]/bookmark-item:inline-flex hover:bg-transparent data-[hovered=true]:bg-transparent [@media(hover:none)]:inline-flex"
        onPress={() => {
          if (item.value.kind === 'folder') onFolderDelete(String(item.key))
          else onBookmarkRemove(String(item.key))
        }}>
        <TrashBinTrash size={16} aria-hidden="true" />
      </Button>
    </div>
  )

  const toggleFolder = (key: string) => {
    setExpandedKeys(currentKeys => {
      const nextKeys = new Set(currentKeys)
      if (nextKeys.has(key)) nextKeys.delete(key)
      else nextKeys.add(key)
      return nextKeys
    })
  }

  const renderItem = (item: (typeof tree.items)[number]) => {
    const isFolder = item.value.kind === 'folder'

    return (
      <FileTree.Item
        className="group/bookmark-item min-h-9 rounded-lg px-0 py-1 ring-inset [&_[data-slot=file-tree-item-content]]:min-w-0 [&_[data-slot=file-tree-item-content]]:gap-2 [&_[slot=chevron]]:size-4"
        icon={renderBookmarkIcon(item.value)}
        id={item.key}
        onClick={(event: React.MouseEvent) => {
          if (isFolder && !(event.target as HTMLElement).closest('button')) {
            toggleFolder(String(item.key))
          }
        }}
        textValue={item.value.title}
        title={renderTitle(item)}
        onContextMenu={(event: React.MouseEvent) =>
          handleItemContextMenu(event, item.value)
        }>
        {isFolder && (
          <Collection items={item.children ?? []}>
            {renderItem as unknown as React.ReactNode}
          </Collection>
        )}
      </FileTree.Item>
    )
  }

  return (
    <ContextMenu>
      <ContextMenu.Trigger className="block w-full">
        <div className="w-full min-w-0" onContextMenu={handleAreaContextMenu}>
          <FileTree
            {...getFileTreeProps()}
            aria-label="Bookmarks file tree"
            dragAndDropHooks={dragAndDropHooks}
            expandedKeys={expandedKeys}
            items={tree.items}
            renderEmptyState={() => (
              <BookmarkSectionEmptyState
                title="No bookmarks yet."
                description="Your saved links and folders appear here."
                {...getBookmarkTreeEmptyStateProps()}
              />
            )}
            selectedKeys={selectedKeys}
            showGuideLines="hover"
            onAction={(key: React.Key) => {
              const bookmark = bookmarkById.get(String(key))

              if (bookmark) {
                onBookmarkClick(bookmark)
                return
              }
            }}
            onExpandedChange={(keys: Iterable<React.Key>) => {
              setExpandedKeys(new Set([...keys].map(String)))
            }}
            onSelectionChange={handleSelectionChange}>
            {renderItem as unknown as React.ReactNode}
          </FileTree>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Popover className={panelContextMenuClass}>
        <ContextMenu.Menu>
          <BookmarkContextMenuItems
            contextTarget={contextTarget}
            folderTargets={folderTargets}
            onBookmarkRemove={onBookmarkRemove}
            onFolderEdit={onFolderEdit}
            onFolderDelete={onFolderDelete}
            onNewFolder={onNewFolder}
            onBookmarkMove={onBookmarkMove}
          />
        </ContextMenu.Menu>
      </ContextMenu.Popover>
      <ContextMenu.Popover className={panelContextMenuClass}>
        <ContextMenu.Menu>
          <BrowserContextMenuItems />
        </ContextMenu.Menu>
      </ContextMenu.Popover>
    </ContextMenu>
  )
}

export { BookmarkFileTree }

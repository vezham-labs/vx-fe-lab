import { type BookmarkTreeItem } from '../types'

const getUniqueTreeId = (baseId: string, counts: Map<string, number>) => {
  const count = counts.get(baseId) ?? 0
  counts.set(baseId, count + 1)

  return count === 0 ? baseId : `${baseId}:${count + 1}`
}

const getExpandableBookmarkKeys = (items: BookmarkTreeItem[]) => {
  const keys: string[] = []

  const collect = (item: BookmarkTreeItem) => {
    if (item.kind === 'folder') {
      keys.push(item.id)
    }

    item.children?.forEach(collect)
  }

  items.forEach(collect)

  return keys
}

const removeTreeItem = (
  items: BookmarkTreeItem[],
  itemId: string
): BookmarkTreeItem[] =>
  items
    .filter(item => item.id !== itemId)
    .map(item => ({
      ...item,
      children: item.children
        ? removeTreeItem(item.children, itemId)
        : item.children
    }))

const updateTreeItem = (
  items: BookmarkTreeItem[],
  itemId: string,
  updater: (item: BookmarkTreeItem) => BookmarkTreeItem
): BookmarkTreeItem[] =>
  items.map(item => {
    if (item.id === itemId) {
      return updater(item)
    }

    return {
      ...item,
      children: item.children
        ? updateTreeItem(item.children, itemId, updater)
        : item.children
    }
  })

const insertFolderItem = (
  items: BookmarkTreeItem[],
  folder: BookmarkTreeItem,
  parentId?: string
): { inserted: boolean; items: BookmarkTreeItem[] } => {
  if (!parentId) {
    return {
      inserted: true,
      items: [...items, folder]
    }
  }

  let inserted = false
  const nextItems = items.map(item => {
    if (item.id === parentId && item.kind === 'folder') {
      inserted = true

      return {
        ...item,
        children: [...(item.children ?? []), folder]
      }
    }

    if (!item.children?.length) {
      return item
    }

    const childResult = insertFolderItem(item.children, folder, parentId)
    inserted = inserted || childResult.inserted

    return {
      ...item,
      children: childResult.items
    }
  })

  return { inserted, items: nextItems }
}

const createTreeItemId = (prefix: string, existingIds: Set<string>) => {
  const randomValue =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const baseId = `${prefix}:${randomValue}`
  let nextId = baseId
  let index = 1

  while (existingIds.has(nextId)) {
    index += 1
    nextId = `${baseId}:${index}`
  }

  existingIds.add(nextId)

  return nextId
}

const dedupeTreeItems = (
  items: BookmarkTreeItem[],
  seen = new Set<string>()
): BookmarkTreeItem[] =>
  items.reduce<BookmarkTreeItem[]>((acc, item) => {
    if (seen.has(item.id)) {
      return acc
    }

    seen.add(item.id)
    acc.push({
      ...item,
      children: item.children ? dedupeTreeItems(item.children, seen) : undefined
    })

    return acc
  }, [])

const collectTreeItemIds = (
  items: BookmarkTreeItem[],
  ids = new Set<string>()
) => {
  items.forEach(item => {
    ids.add(item.id)

    if (item.children) {
      collectTreeItemIds(item.children, ids)
    }
  })

  return ids
}

const getUniqueFolderGroupId = (targetId: string, existingIds: Set<string>) => {
  const baseId = `folder:group:${targetId}`
  let nextId = baseId
  let index = 1

  while (existingIds.has(nextId)) {
    index += 1
    nextId = `${baseId}:${index}`
  }

  existingIds.add(nextId)

  return nextId
}

const getFolderTitleFromMovedItems = (movedItems: BookmarkTreeItem[]) => {
  const movedFileName = movedItems[0]?.title.trim()

  return movedFileName || 'New Folder'
}

const cloneTreeItem = (item: BookmarkTreeItem): BookmarkTreeItem => ({
  ...item,
  children: item.children?.map(cloneTreeItem)
})

const normalizeBookmarkGroups = (
  items: BookmarkTreeItem[],
  existingIds = collectTreeItemIds(items)
): BookmarkTreeItem[] =>
  items.map(item => {
    const children = item.children
      ? normalizeBookmarkGroups(item.children, existingIds)
      : undefined

    if (item.kind !== 'bookmark' || !children?.length) {
      return {
        ...item,
        children
      }
    }

    return {
      id: getUniqueFolderGroupId(item.id, existingIds),
      title: getFolderTitleFromMovedItems(children),
      kind: 'folder',
      children: [
        {
          ...item,
          children: undefined
        },
        ...children
      ]
    }
  })

const findTreeItem = (
  items: BookmarkTreeItem[],
  itemId: string
): BookmarkTreeItem | undefined => {
  for (const item of items) {
    if (item.id === itemId) {
      return item
    }

    const childItem = item.children
      ? findTreeItem(item.children, itemId)
      : undefined

    if (childItem) {
      return childItem
    }
  }

  return undefined
}

const collectFolderTargets = (
  items: BookmarkTreeItem[],
  excludedId?: string,
  path: string[] = []
): { id: string; title: string; depth: number }[] =>
  items.reduce<{ id: string; title: string; depth: number }[]>((acc, item) => {
    if (item.kind !== 'folder' || item.id === excludedId) {
      return acc
    }

    const nextPath = [...path, item.title]
    acc.push({
      id: item.id,
      title: nextPath.join(' / '),
      depth: nextPath.length - 1
    })
    acc.push(...collectFolderTargets(item.children ?? [], excludedId, nextPath))

    return acc
  }, [])

const removeTreeItems = (
  items: BookmarkTreeItem[],
  itemIds: Set<string>,
  removedItems: BookmarkTreeItem[] = []
): BookmarkTreeItem[] =>
  items.reduce<BookmarkTreeItem[]>((acc, item) => {
    if (itemIds.has(item.id)) {
      removedItems.push(cloneTreeItem(item))
      return acc
    }

    acc.push({
      ...item,
      children: item.children
        ? removeTreeItems(item.children, itemIds, removedItems)
        : item.children
    })

    return acc
  }, [])

const insertTreeItemsRelativeToTarget = (
  items: BookmarkTreeItem[],
  targetId: string,
  movedItems: BookmarkTreeItem[],
  placement: 'before' | 'after'
): { inserted: boolean; items: BookmarkTreeItem[] } => {
  let inserted = false

  const nextItems = items.reduce<BookmarkTreeItem[]>((acc, item) => {
    if (item.id === targetId) {
      inserted = true

      if (placement === 'before') {
        acc.push(...movedItems, item)
      } else {
        acc.push(item, ...movedItems)
      }

      return acc
    }

    if (item.children?.length) {
      const childResult = insertTreeItemsRelativeToTarget(
        item.children,
        targetId,
        movedItems,
        placement
      )

      inserted = inserted || childResult.inserted
      acc.push({
        ...item,
        children: childResult.items
      })

      return acc
    }

    acc.push(item)

    return acc
  }, [])

  return { inserted, items: nextItems }
}

const insertTreeItemsOnTarget = (
  items: BookmarkTreeItem[],
  targetId: string,
  movedItems: BookmarkTreeItem[],
  existingIds: Set<string>
): {
  inserted: boolean
  expandedKey?: string
  items: BookmarkTreeItem[]
} => {
  let expandedKey: string | undefined
  let inserted = false

  const nextItems = items.map(item => {
    if (item.id === targetId) {
      inserted = true

      if (item.kind === 'folder') {
        expandedKey = item.id

        return {
          ...item,
          children: [...(item.children ?? []), ...movedItems]
        }
      }

      const folderId = getUniqueFolderGroupId(item.id, existingIds)
      expandedKey = folderId

      return {
        id: folderId,
        title: getFolderTitleFromMovedItems(movedItems),
        kind: 'folder' as const,
        children: [
          {
            ...item,
            children: undefined
          },
          ...movedItems
        ]
      }
    }

    if (!item.children?.length) {
      return item
    }

    const childResult = insertTreeItemsOnTarget(
      item.children,
      targetId,
      movedItems,
      existingIds
    )

    if (childResult.inserted) {
      inserted = true
      expandedKey = childResult.expandedKey
    }

    return {
      ...item,
      children: childResult.items
    }
  })

  return { expandedKey, inserted, items: nextItems }
}

const moveTreeItemToFolder = (
  items: BookmarkTreeItem[],
  movedId: string,
  targetFolderId?: string
): { expandedKey?: string; items: BookmarkTreeItem[] } => {
  if (targetFolderId && movedId === targetFolderId) {
    return { items }
  }

  const movedItems: BookmarkTreeItem[] = []
  const itemsWithoutMoved = removeTreeItems(
    items,
    new Set([movedId]),
    movedItems
  )

  if (!movedItems.length) {
    return { items }
  }

  if (!targetFolderId) {
    return {
      items: normalizeBookmarkGroups([...itemsWithoutMoved, ...movedItems])
    }
  }

  if (!findTreeItem(itemsWithoutMoved, targetFolderId)) {
    return { items }
  }

  const result = insertTreeItemsOnTarget(
    itemsWithoutMoved,
    targetFolderId,
    movedItems,
    collectTreeItemIds([...itemsWithoutMoved, ...movedItems])
  )

  return result.inserted
    ? {
        expandedKey: result.expandedKey,
        items: normalizeBookmarkGroups(result.items)
      }
    : { items }
}

const moveBookmarkTreeItems = (
  items: BookmarkTreeItem[],
  movedIds: string[],
  targetId: string,
  dropPosition: string
): { expandedKey?: string; items: BookmarkTreeItem[] } => {
  if (!movedIds.length || movedIds.includes(targetId)) {
    return { items }
  }

  const movedIdSet = new Set(movedIds)
  if (!findTreeItem(items, targetId)) {
    return { items }
  }

  const movedItems: BookmarkTreeItem[] = []
  const itemsWithoutMoved = removeTreeItems(items, movedIdSet, movedItems)

  if (!movedItems.length || !findTreeItem(itemsWithoutMoved, targetId)) {
    return { items }
  }

  if (dropPosition === 'on') {
    const result = insertTreeItemsOnTarget(
      itemsWithoutMoved,
      targetId,
      movedItems,
      collectTreeItemIds([...itemsWithoutMoved, ...movedItems])
    )

    return result.inserted
      ? {
          expandedKey: result.expandedKey,
          items: normalizeBookmarkGroups(result.items)
        }
      : { items }
  }

  const result = insertTreeItemsRelativeToTarget(
    itemsWithoutMoved,
    targetId,
    movedItems,
    dropPosition === 'after' ? 'after' : 'before'
  )

  return result.inserted
    ? { items: normalizeBookmarkGroups(result.items) }
    : { items }
}

const getBookmarkTreeSignature = (items: BookmarkTreeItem[]): string =>
  items
    .map(item =>
      [
        item.id,
        item.kind,
        item.title,
        item.children ? getBookmarkTreeSignature(item.children) : ''
      ].join(':')
    )
    .join('|')

export {
  collectFolderTargets,
  collectTreeItemIds,
  createTreeItemId,
  dedupeTreeItems,
  getBookmarkTreeSignature,
  getExpandableBookmarkKeys,
  getUniqueTreeId,
  insertFolderItem,
  moveBookmarkTreeItems,
  moveTreeItemToFolder,
  removeTreeItem,
  updateTreeItem
}

import { getUniqueTreeId } from './bookmark-file-tree/variants'
import {
  DEFAULT_FOLDER_COLOR,
  DEFAULT_FOLDER_ICON
} from './folder-modal/variants'
import type { BookmarkItem, BookmarkTreeItem } from './types'

const getFolderPathFromBookmark = (bookmark: BookmarkItem) => {
  if (bookmark.folderPath?.length) {
    return bookmark.folderPath
  }

  return bookmark.folder?.split('/').filter(Boolean) ?? []
}

const createBookmarkTreeNode = (
  bookmark: BookmarkItem,
  counts: Map<string, number>
): BookmarkTreeItem => ({
  id: getUniqueTreeId(`bookmark:${bookmark.id}`, counts),
  title: bookmark.name,
  kind: 'bookmark',
  bookmark: {
    ...bookmark,
    kind: 'bookmark',
    children: undefined
  }
})

export const bookmarksToTreeItems = (bookmarks: BookmarkItem[]) => {
  const treeItems: BookmarkTreeItem[] = []
  const folderByPath = new Map<string, BookmarkTreeItem>()
  const idCounts = new Map<string, number>()

  const ensureFolder = (path: string[]) => {
    let children = treeItems
    let currentFolder: BookmarkTreeItem | undefined
    let currentPath: string[] = []

    path.forEach(folderName => {
      currentPath = [...currentPath, folderName]
      const pathKey = currentPath.join('/')
      const existingFolder = folderByPath.get(pathKey)

      if (existingFolder) {
        currentFolder = existingFolder
        children = existingFolder.children ?? []
        existingFolder.children = children
        return
      }

      const folder: BookmarkTreeItem = {
        id: getUniqueTreeId(`folder:${pathKey}`, idCounts),
        title: folderName,
        kind: 'folder',
        color: DEFAULT_FOLDER_COLOR,
        visualType: 'icon',
        icon: DEFAULT_FOLDER_ICON,
        children: []
      }

      children.push(folder)
      folderByPath.set(pathKey, folder)
      currentFolder = folder
      children = folder.children ?? []
    })

    return currentFolder?.children ?? treeItems
  }

  const appendBookmark = (
    bookmark: BookmarkItem,
    parentPath: string[] = []
  ) => {
    const isFolder =
      bookmark.kind === 'folder' || Boolean(bookmark.children?.length)

    if (isFolder) {
      const folderPath = [
        ...(parentPath.length
          ? parentPath
          : getFolderPathFromBookmark(bookmark)),
        bookmark.name
      ]
      ensureFolder(folderPath)
      const folder = folderByPath.get(folderPath.join('/'))
      if (folder) {
        folder.id = bookmark.id
        folder.color = bookmark.color ?? DEFAULT_FOLDER_COLOR
        folder.visualType = bookmark.visualType ?? 'icon'
        folder.icon = bookmark.icon ?? DEFAULT_FOLDER_ICON
        folder.emoji = bookmark.emoji
      }
      bookmark.children?.forEach(child => appendBookmark(child, folderPath))

      return
    }

    const folderPath = parentPath.length
      ? parentPath
      : getFolderPathFromBookmark(bookmark)
    const children = ensureFolder(folderPath)
    children.push(createBookmarkTreeNode(bookmark, idCounts))
  }

  bookmarks.forEach(bookmark => appendBookmark(bookmark))

  return treeItems
}

export const treeItemsToBookmarks = (items: BookmarkTreeItem[]) => {
  const convert = (
    node: BookmarkTreeItem,
    folderPath: string[] = []
  ): BookmarkItem => {
    if (node.kind === 'bookmark' && node.bookmark) {
      return {
        ...node.bookmark,
        folder: folderPath[folderPath.length - 1],
        folderPath,
        children: undefined
      }
    }

    const nextPath = [...folderPath, node.title]

    return {
      id: node.id,
      name: node.title,
      kind: 'folder',
      color: node.color,
      visualType: node.visualType,
      emoji: node.emoji,
      icon: node.icon,
      folder: folderPath[folderPath.length - 1],
      folderPath,
      children: (node.children ?? []).map(child => convert(child, nextPath))
    }
  }

  return items.map(item => convert(item))
}

import { type BookmarkTreeItem } from '../types'

export type BookmarkContextTarget =
  | { type: 'folder'; item: BookmarkTreeItem }
  | { type: 'bookmark'; item: BookmarkTreeItem }
  | { type: 'area' }

export interface FolderTarget {
  id: string
  title: string
  depth: number
}

export interface BookmarkContextMenuItemsProps {
  contextTarget: BookmarkContextTarget
  folderTargets: FolderTarget[]
  onBookmarkRemove: (id: string) => void
  onFolderEdit: (item: BookmarkTreeItem) => void
  onFolderDelete: (id: string) => void
  onNewFolder: (parentId?: string) => void
  onBookmarkMove: (id: string, targetFolderId?: string) => void
}

import {
  type BookmarkItem,
  type BookmarkTreeItem,
  type useProps
} from '../types'

export interface BookmarkFileTreeProps extends Pick<
  ReturnType<typeof useProps>,
  'getFileTreeProps' | 'getBookmarkTreeEmptyStateProps'
> {
  items: BookmarkTreeItem[]
  defaultExpandedKeys: string[]
  onBookmarkClick: (item: BookmarkItem) => void
  onBookmarkRemove: (id: string) => void
  onFolderEdit: (item: BookmarkTreeItem) => void
  onFolderDelete: (id: string) => void
  onNewFolder: (parentId?: string) => void
  onBookmarkMove: (id: string, targetFolderId?: string) => void
  onTreeChange: (items: BookmarkTreeItem[], expandedKey?: string) => void
}

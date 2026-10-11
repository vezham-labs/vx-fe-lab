export const FAVORITES_LIMIT = 12

export type RQBookmarks = Record<string, never>

export interface FavoriteItem {
  id: string
  name: string
  url: string
  avatar?: string
  backgroundImage?: string
}

export interface BookmarkItem {
  id: string
  name: string
  url?: string
  avatar?: string
  backgroundImage?: string
  icon?: string
  color?: string
  visualType?: 'emoji' | 'icon'
  emoji?: string
  folder?: string
  folderPath?: string[]
  kind?: 'bookmark' | 'folder'
  children?: BookmarkItem[]
}

export type BookmarksResponse = {
  favorites: FavoriteItem[]
  pins: FavoriteItem[]
  bookmarks: BookmarkItem[]
}

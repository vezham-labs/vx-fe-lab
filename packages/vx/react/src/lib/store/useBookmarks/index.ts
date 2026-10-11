import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Bookmarks } from './action'
import { bookmarksData } from './data'
import {
  type BookmarkItem,
  type BookmarksResponse,
  FAVORITES_LIMIT,
  type FavoriteItem,
  type RQBookmarks
} from './types'

export * from './data'
export * from './types'

const CK_BOOKMARKS = 'bookmarks'

const useBookmarksList = (rq: RQBookmarks = {}) =>
  useQuery({
    queryKey: [CK_BOOKMARKS, rq],
    queryFn: () => Bookmarks.list(rq),
    initialData: bookmarksData,
    staleTime: Infinity
  })

const useBookmarksActions = (rq: RQBookmarks = {}) => {
  const client = useQueryClient()
  const update = (next: Partial<BookmarksResponse>) =>
    client.setQueryData<BookmarksResponse>([CK_BOOKMARKS, rq], current => ({
      ...(current ?? bookmarksData),
      ...next
    }))
  return {
    setFavorites: (items: FavoriteItem[]) =>
      update({ favorites: items.slice(0, FAVORITES_LIMIT) }),
    setPins: (items: FavoriteItem[]) => update({ pins: items }),
    setBookmarks: (items: BookmarkItem[]) => update({ bookmarks: items })
  }
}

export const useBookmarks = {
  list: useBookmarksList,
  actions: useBookmarksActions
}

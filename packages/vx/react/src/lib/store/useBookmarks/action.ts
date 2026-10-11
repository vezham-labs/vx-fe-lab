import { bookmarksData } from './data'
import type { BookmarksResponse, RQBookmarks } from './types'

const Bookmarks = {
  list: async (rq: RQBookmarks): Promise<BookmarksResponse> => {
    void rq
    return Promise.resolve(bookmarksData)
  }
}

export { Bookmarks }

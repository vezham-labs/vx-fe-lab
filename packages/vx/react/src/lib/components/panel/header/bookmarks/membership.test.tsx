import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'

import {
  type BookmarksResponse,
  FAVORITES_LIMIT,
  useBookmarks
} from '../../../../store/useBookmarks'
import { getBookmarkShortcuts } from './membership'

const items = Array.from({ length: 20 }, (_, index) => ({
  id: String(index),
  name: `Item ${index}`,
  url: `/item/${index}`
}))
const createStore = (data: BookmarksResponse) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  client.setQueryData(['bookmarks', {}], data)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const useShortcuts = () => {
    const { data } = useBookmarks.list()
    const actions = useBookmarks.actions()
    return {
      ...getBookmarkShortcuts({
        favorites: data.favorites,
        pins: data.pins,
        onFavoritesChange: actions.setFavorites,
        onPinsChange: actions.setPins
      }),
      ...actions
    }
  }
  return { client, wrapper, useShortcuts }
}

it('updates independent collections in the store, limits Favorites, and writes no localStorage', async () => {
  const store = createStore({
    bookmarks: [],
    favorites: items.slice(0, FAVORITES_LIMIT),
    pins: items.slice(0, 18)
  })
  const storageWrite = vi.spyOn(Storage.prototype, 'setItem')
  try {
    const { result } = renderHook(store.useShortcuts, {
      wrapper: store.wrapper
    })
    expect(result.current.pins).toHaveLength(18)
    act(() => result.current.removeFavorite('0'))
    await waitFor(() =>
      expect(result.current.favorites).toHaveLength(FAVORITES_LIMIT - 1)
    )
    expect(result.current.pins.some(item => item.id === '0')).toBe(true)
    act(() => result.current.unpin('1'))
    await waitFor(() => expect(result.current.pins).toHaveLength(17))
    expect(result.current.favorites.some(item => item.id === '1')).toBe(true)
    act(() => result.current.setFavorites(items))
    await waitFor(() =>
      expect(result.current.favorites).toHaveLength(FAVORITES_LIMIT)
    )
    expect(
      store.client.getQueryData<BookmarksResponse>(['bookmarks', {}])?.favorites
    ).toHaveLength(FAVORITES_LIMIT)
    expect(storageWrite).not.toHaveBeenCalled()
  } finally {
    storageWrite.mockRestore()
    store.client.clear()
  }
})

it('keeps removals and reordering across panel remounts using the same store', async () => {
  const store = createStore({
    bookmarks: items,
    favorites: items.slice(0, 2),
    pins: items.slice(1, 3)
  })
  const first = renderHook(store.useShortcuts, { wrapper: store.wrapper })
  act(() => first.result.current.reorderFavorites([items[1], items[0]]))
  await waitFor(() => expect(first.result.current.favorites[0].id).toBe('1'))
  act(() => first.result.current.unpin('1'))
  await waitFor(() => expect(first.result.current.pins).toHaveLength(1))
  first.unmount()
  const second = renderHook(store.useShortcuts, { wrapper: store.wrapper })
  expect(second.result.current.favorites.map(item => item.id)).toEqual([
    '1',
    '0'
  ])
  expect(second.result.current.pins.map(item => item.id)).toEqual(['2'])
  expect(
    store.client.getQueryData<BookmarksResponse>(['bookmarks', {}])?.bookmarks
  ).toHaveLength(20)
  store.client.clear()
})

it('resolves pins and Favorites independently even when their IDs overlap', async () => {
  const favorite = { id: 'same', name: 'Favorite app', url: '/favorite' }
  const pin = { id: 'same', name: 'Pinned app', url: '/pin' }
  const store = createStore({
    bookmarks: [],
    favorites: [favorite],
    pins: [pin]
  })
  const { result } = renderHook(store.useShortcuts, { wrapper: store.wrapper })
  expect(result.current.favorites).toEqual([favorite])
  expect(result.current.pins).toEqual([pin])
  act(() => result.current.unpin('same'))
  await waitFor(() => expect(result.current.pins).toEqual([]))
  expect(result.current.favorites).toEqual([favorite])
  store.client.clear()
})

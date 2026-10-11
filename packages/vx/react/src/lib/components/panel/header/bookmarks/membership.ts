import { FAVORITES_LIMIT } from '../../../../store/useBookmarks/types'
import type { FavoriteItem } from './types'

export const getBookmarkShortcuts = ({
  favorites,
  pins,
  onFavoritesChange,
  onPinsChange
}: {
  favorites: FavoriteItem[]
  pins: FavoriteItem[]
  onFavoritesChange: (items: FavoriteItem[]) => void
  onPinsChange: (items: FavoriteItem[]) => void
}) => {
  const currentFavorites =
    favorites.length > FAVORITES_LIMIT
      ? favorites.slice(0, FAVORITES_LIMIT)
      : favorites
  return {
    favorites: currentFavorites,
    pins,
    unpin: (id: string) => onPinsChange(pins.filter(item => item.id !== id)),
    removeFavorite: (id: string) =>
      onFavoritesChange(currentFavorites.filter(item => item.id !== id)),
    reorderFavorites: (items: readonly FavoriteItem[]) =>
      onFavoritesChange(items.slice(0, FAVORITES_LIMIT))
  }
}

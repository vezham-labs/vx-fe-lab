import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, expect, it } from 'vitest'

import { getBookmarkShortcuts } from '../membership'
import { useProps } from '../types'
import { QuickAccess } from './index'

beforeEach(() => localStorage.clear())

it('shows all pins and unpins without changing favorites or bookmarks', () => {
  const bookmarks = Array.from({ length: 15 }, (_, index) => ({
    id: String(index),
    name: `Pin ${index}`,
    url: ''
  }))
  const App = () => {
    const [favorites, setFavorites] = useState(bookmarks.slice(0, 2))
    const [pins, setPins] = useState(bookmarks)
    const membership = getBookmarkShortcuts({
      favorites,
      pins,
      onFavoritesChange: setFavorites,
      onPinsChange: setPins
    })
    const styles = useProps({})
    return (
      <>
        <output>
          {membership.favorites.length} favorites; {bookmarks.length} bookmarks
        </output>
        <QuickAccess
          {...styles}
          mode="all"
          favorites={membership.favorites}
          pins={membership.pins}
          visiblePins={membership.pins.slice(0, 6)}
          hasMorePins
          isScrollFavoritesOpen
          onUnpin={membership.unpin}
          onFavoriteRemove={membership.removeFavorite}
          onFavoritesReorder={membership.reorderFavorites}
          onFavoriteClick={() => undefined}
          onViewAllPins={() => undefined}
          onBackToNormalView={() => undefined}
          onToggleScrollFavorites={() => undefined}
        />
      </>
    )
  }
  render(<App />)
  expect(screen.getByRole('heading', { name: 'All Pins' })).toBeInTheDocument()
  expect(
    screen.getAllByRole('button', { name: /^Unpin .* from Quick Access$/ })
  ).toHaveLength(15)
  fireEvent.click(
    screen.getByRole('button', { name: 'Unpin Pin 0 from Quick Access' })
  )
  expect(screen.queryByText('Pin 0')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent(
    '2 favorites; 15 bookmarks'
  )
})

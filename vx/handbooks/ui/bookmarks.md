# Bookmarks, Favorites, and Quick Access

Bookmarks, Favorites, and Quick Access pins are three independent app-supplied
collections. Bookmarks supports folders; Favorites and pins do not depend on a
matching bookmark. Their IDs and item metadata are resolved separately.

- Favorites shows a compact grid capped by `FAVORITES_LIMIT`. Adding items is owned by the app. The tile context menu provides Remove Favorite.
- Quick Access shows the first six pins as horizontal cards. Pins have no limit.
  View All opens All Pins inside the Bookmarks panel; Back returns to the normal
  sections.
- All Pins shows every pinned item with its name and optional URL. Its unpin
  action removes the pin without deleting the bookmark or its favorite status.

Favorites and Quick Access cards use ContextMenu for Remove Favorite and Unpin,
respectively; they do not show inline removal buttons. All Pins can expose a
visible unpin action. Bookmark and folder operations remain in their context menus; their rows also
provide a delete icon on hover or keyboard focus. Drag-and-drop reordering remains available.

Favorites previews reordering locally as the dragged tile enters a new position.
Other tiles shift immediately, with a subtle outline in the dragged tile's current
position and no extra placeholder at the old location.
Dropping saves the order once and keeps the preview visible until the store updates;
cancelling restores the original order without changing the store.

The app owns adding Favorites and pins. The panel provides no pin, star, or add
controls. Pass app collections through `favorites` and `pins`; use
`onFavoritesChange` and `onPinsChange` to handle removal in app state. The panel
calls these callbacks with the remaining items, and app updates are authoritative.

The bookmark store response contains `bookmarks`, `favorites`, and `pins`.
The three arrays are independent. Demo fixtures use a dedicated `samplePins`
array rather than deriving pins from Favorites or Bookmarks.

The current implementation is store/data based. `bookmarksData` seeds the
in-memory React Query store. `useBookmarks.actions()` updates Favorites, pins,
and Bookmarks independently. Changes survive panel remounts in the same app
session and reset when the app reloads. The mock query stays fresh so focus or
remount does not replace edits with seed data.

There is no panel-level localStorage fallback or browser storage event. Apps may
supply their own collections and change callbacks. API and local-store persistence
will be introduced as an app-wide design later.

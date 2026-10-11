import { useNavigate } from '@tanstack/react-router'
import { type ComponentProps, forwardRef, useMemo, useState } from 'react'

import { Bookmark as BookmarkIcon, Star as StarIcon } from '@vezham/icons-react'
import { ScrollShadow, Tooltip, Typography } from '@vezham/react-v3'

import { FAVORITES_LIMIT, useBookmarks } from '../../../../store/useBookmarks'
import { getAppPath, getOpenUrl } from '../../../../utils/url'
import { ShortcutTooltipLabel } from '../../../shortcut-key'
import { InfoPanelDefinition, useInfoPanel } from '../../info-panel'
import { BookmarkFileTree } from './bookmark-file-tree'
import {
  collectTreeItemIds,
  createTreeItemId,
  dedupeTreeItems,
  getBookmarkTreeSignature,
  getExpandableBookmarkKeys,
  insertFolderItem,
  moveTreeItemToFolder,
  removeTreeItem,
  updateTreeItem
} from './bookmark-file-tree/variants'
import { FolderModal } from './folder-modal'
import { type FolderFormState } from './folder-modal/types'
import {
  DEFAULT_FOLDER_COLOR,
  DEFAULT_FOLDER_EMOJI,
  DEFAULT_FOLDER_ICON,
  createDefaultFolderForm
} from './folder-modal/variants'
import { getBookmarkShortcuts } from './membership'
import { QuickAccess } from './quick-access'
import { bookmarksToTreeItems, treeItemsToBookmarks } from './tree-data'
import {
  type BookmarkItem,
  type BookmarkTreeItem,
  type FavoriteItem,
  type Props,
  useProps
} from './types'

const useBookmarkItemNavigation = (
  onFavoriteClick: Props['onFavoriteClick'],
  onBookmarkClick: Props['onBookmarkClick']
) => {
  const navigate = useNavigate()

  const openItem = (url: string) => {
    if (!url || url === '#') {
      return
    }

    const appPath = getAppPath(url, window.location.origin)

    if (appPath) {
      navigate({ to: appPath })
      return
    }

    window.open(getOpenUrl(url), '_blank', 'noopener,noreferrer')
  }

  return {
    openBookmark: (url: string, item: BookmarkItem) =>
      onBookmarkClick ? onBookmarkClick(url, item) : openItem(url),
    openFavorite: (url: string, item: FavoriteItem) =>
      onFavoriteClick ? onFavoriteClick(url, item) : openItem(url)
  }
}

const getSavedFolderItems = ({
  items,
  form,
  mode,
  parentId
}: {
  items: BookmarkTreeItem[]
  form: FolderFormState
  mode: 'create' | 'edit'
  parentId?: string
}): BookmarkTreeItem[] | null | undefined => {
  const folderName = form.name.trim()

  if (!folderName) {
    return null
  }

  if (mode === 'edit' && form.id) {
    return updateTreeItem(items, form.id, item => ({
      ...item,
      title: folderName,
      color: form.color,
      visualType: form.visualType,
      emoji: form.emoji,
      icon: form.icon
    }))
  }

  const folder: BookmarkTreeItem = {
    id: createTreeItemId('folder:custom', collectTreeItemIds(items)),
    title: folderName,
    kind: 'folder',
    color: form.color,
    visualType: form.visualType,
    emoji: form.emoji,
    icon: form.icon,
    children: []
  }
  const result = insertFolderItem(items, folder, parentId)

  return result.inserted ? result.items : undefined
}

const BookmarksContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    Component,
    getScrollShadowProps,
    getContentContainerProps,
    getSectionProps,
    getSectionHeaderProps,
    getSectionIconProps,
    getSectionTitleProps,
    getFavorite2ItemsProps,
    getFavoriteBackgroundImageProps,
    getFavoriteBackgroundGradientProps,
    getFavoriteOverlayProps,
    getFavoriteAvatarContainerProps,
    getFavoriteAvatarProps,
    getFavoriteAvatarIconProps,
    getFavoriteAvatarFallbackProps,
    getFavoriteContentProps,
    getFavoriteNameProps,
    getFileTreeProps,
    getBookmarkTreeEmptyStateProps,
    externalFavorites,
    externalBookmarks,
    externalPins,
    onFavoriteClick,
    onBookmarkClick,
    renderFavoriteItem,
    onFavoritesChange,
    onPinsChange,
    onFavoritesReorder,
    onBookmarksReorder,
    onFolderReorder
  } = useProps({
    ...props,
    ref
  })
  const { openBookmark, openFavorite } = useBookmarkItemNavigation(
    onFavoriteClick,
    onBookmarkClick
  )

  const bookmarksQuery = useBookmarks.list({})
  const bookmarkActions = useBookmarks.actions({})
  const [showAllPinsMode, setShowAllPinsMode] = useState(false)
  const [isScrollFavoritesOpen, setIsScrollFavoritesOpen] = useState(true)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [folderModalMode, setFolderModalMode] = useState<'create' | 'edit'>(
    'create'
  )
  const [folderParentId, setFolderParentId] = useState<string | undefined>()
  const [folderForm, setFolderForm] = useState<FolderFormState>(() =>
    createDefaultFolderForm()
  )

  const sourceFavorites = externalFavorites ?? bookmarksQuery.data.favorites
  const visibleFavorites = useMemo(
    () => sourceFavorites.slice(0, FAVORITES_LIMIT),
    [sourceFavorites]
  )
  const membership = getBookmarkShortcuts({
    favorites: visibleFavorites,
    pins: externalPins ?? bookmarksQuery.data.pins,
    onFavoritesChange: onFavoritesChange ?? bookmarkActions.setFavorites,
    onPinsChange: onPinsChange ?? bookmarkActions.setPins
  })
  const favorites = membership.favorites
  const bookmarks = externalBookmarks ?? bookmarksQuery.data.bookmarks

  const activeBookmarkTreeItems = useMemo(
    () => bookmarksToTreeItems(bookmarks),
    [bookmarks]
  )

  const bookmarkTreeExpandedKeys = useMemo(
    () => getExpandableBookmarkKeys(activeBookmarkTreeItems),
    [activeBookmarkTreeItems]
  )

  const bookmarkTreeKey = useMemo(
    () => getBookmarkTreeSignature(activeBookmarkTreeItems),
    [activeBookmarkTreeItems]
  )

  const pins = membership.pins
  const visiblePins = pins.slice(0, 6)
  const hasMorePins = pins.length > 6
  const getFavoriteAvatarIconPropsForIcon =
    getFavoriteAvatarIconProps as unknown as () => ComponentProps<
      typeof StarIcon
    >

  const handleViewAllPins = () => {
    setShowAllPinsMode(true)
  }

  const handleBackToNormalView = () => {
    setShowAllPinsMode(false)
  }

  const toggleScrollFavorites = () => {
    setIsScrollFavoritesOpen(!isScrollFavoritesOpen)
  }

  const handleBookmarkTreeClick = (item: BookmarkItem) => {
    openBookmark(item.url ?? '#', item)
  }

  const handleBookmarkTreeChange = (items: BookmarkTreeItem[]) => {
    const nextItems = dedupeTreeItems(items)
    const nextBookmarks = treeItemsToBookmarks(nextItems)

    if (!externalBookmarks) {
      bookmarkActions.setBookmarks(nextBookmarks)
    }

    onBookmarksReorder?.(nextBookmarks)
    onFolderReorder?.(nextBookmarks)
  }

  const handleBookmarkRemove = (id: string) => {
    handleBookmarkTreeChange(removeTreeItem(activeBookmarkTreeItems, id))
  }

  const openCreateFolderModal = (parentId?: string) => {
    setFolderModalMode('create')
    setFolderParentId(parentId)
    setFolderForm(createDefaultFolderForm())
    setFolderModalOpen(true)
  }

  const openEditFolderModal = (item: BookmarkTreeItem) => {
    setFolderModalMode('edit')
    setFolderParentId(undefined)
    setFolderForm({
      id: item.id,
      name: item.title,
      color: item.color ?? DEFAULT_FOLDER_COLOR,
      visualType: item.visualType ?? 'icon',
      emoji: item.emoji ?? DEFAULT_FOLDER_EMOJI,
      icon: item.icon ?? DEFAULT_FOLDER_ICON
    })
    setFolderModalOpen(true)
  }

  const handleFolderSave = () => {
    const nextItems = getSavedFolderItems({
      items: activeBookmarkTreeItems,
      form: folderForm,
      mode: folderModalMode,
      parentId: folderParentId
    })

    if (nextItems === null) {
      return
    }

    if (nextItems) {
      handleBookmarkTreeChange(nextItems)
    }

    setFolderModalOpen(false)
  }

  const handleBookmarkMove = (id: string, targetFolderId?: string) => {
    const result = moveTreeItemToFolder(
      activeBookmarkTreeItems,
      id,
      targetFolderId
    )

    handleBookmarkTreeChange(result.items)
  }

  return (
    <Component className="h-full min-h-0">
      <ScrollShadow {...getScrollShadowProps()}>
        <div {...getContentContainerProps()}>
          <QuickAccess
            mode={showAllPinsMode ? 'all' : 'sections'}
            favorites={favorites}
            onUnpin={membership.unpin}
            onFavoriteRemove={membership.removeFavorite}
            onFavoritesReorder={items => {
              membership.reorderFavorites(items)
              onFavoritesReorder?.(items)
            }}
            pins={pins}
            visiblePins={visiblePins}
            hasMorePins={hasMorePins}
            isScrollFavoritesOpen={isScrollFavoritesOpen}
            renderFavoriteItem={renderFavoriteItem}
            getSectionProps={getSectionProps}
            getSectionHeaderProps={getSectionHeaderProps}
            getSectionTitleProps={getSectionTitleProps}
            getSectionIconProps={getSectionIconProps}
            getFavorite2ItemsProps={getFavorite2ItemsProps}
            getFavoriteBackgroundImageProps={getFavoriteBackgroundImageProps}
            getFavoriteBackgroundGradientProps={
              getFavoriteBackgroundGradientProps
            }
            getFavoriteOverlayProps={getFavoriteOverlayProps}
            getFavoriteAvatarContainerProps={getFavoriteAvatarContainerProps}
            getFavoriteAvatarProps={getFavoriteAvatarProps}
            getFavoriteAvatarIconProps={getFavoriteAvatarIconPropsForIcon}
            getFavoriteAvatarFallbackProps={getFavoriteAvatarFallbackProps}
            getFavoriteContentProps={getFavoriteContentProps}
            getFavoriteNameProps={getFavoriteNameProps}
            onFavoriteClick={openFavorite}
            onViewAllPins={handleViewAllPins}
            onBackToNormalView={handleBackToNormalView}
            onToggleScrollFavorites={toggleScrollFavorites}
          />
          {!showAllPinsMode && (
            <section {...getSectionProps()}>
              <div {...getSectionHeaderProps()}>
                <BookmarkIcon
                  {...getSectionIconProps('text-primary')}
                  weight="filled"
                  aria-hidden="true"
                />
                <Typography.Heading {...getSectionTitleProps('Bookmarks')} />
              </div>
              <BookmarkFileTree
                key={bookmarkTreeKey}
                items={activeBookmarkTreeItems}
                defaultExpandedKeys={bookmarkTreeExpandedKeys}
                getFileTreeProps={getFileTreeProps}
                getBookmarkTreeEmptyStateProps={getBookmarkTreeEmptyStateProps}
                onBookmarkClick={handleBookmarkTreeClick}
                onBookmarkRemove={handleBookmarkRemove}
                onFolderEdit={openEditFolderModal}
                onFolderDelete={handleBookmarkRemove}
                onNewFolder={openCreateFolderModal}
                onBookmarkMove={handleBookmarkMove}
                onTreeChange={handleBookmarkTreeChange}
              />
            </section>
          )}
        </div>
      </ScrollShadow>
      <FolderModal
        open={folderModalOpen}
        mode={folderModalMode}
        form={folderForm}
        onFormChange={setFolderForm}
        onOpenChange={setFolderModalOpen}
        onSave={handleFolderSave}
      />
    </Component>
  )
})

BookmarksContent.displayName = 'BookmarksContent'

const BookmarksTrigger = () => {
  const { activeInfoPanel, isOpen, toggleInfoPanel } = useInfoPanel()
  const isActive = isOpen && activeInfoPanel === 'bookmarks'

  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger>
        <span aria-label="Bookmarks">
          <BookmarkIcon
            className={isActive ? 'text-muted' : ''}
            weight={isActive ? 'filled' : 'outline'}
            size={20}
            onClick={() => toggleInfoPanel('bookmarks')}
            aria-hidden="true"
          />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right">
        <ShortcutTooltipLabel label="Bookmarks" shortcut="Mod ⇧ B" />
      </Tooltip.Content>
    </Tooltip>
  )
}

const BookmarksPanelContent = () => {
  return <BookmarksContent />
}

const bookmarksPanel: InfoPanelDefinition = {
  title: 'Bookmarks',
  scrollable: false,
  content: <BookmarksPanelContent />
}

export { BookmarksTrigger, bookmarksPanel }

import { type ComponentPropsWithRef, type ElementType, ReactNode } from 'react'

import { cn } from '@vezham/react-v3'

import type {
  BookmarkItem,
  FavoriteItem
} from '../../../../store/useBookmarks/types'
import { tvProps, tvSlots, tva } from './variant'

export type { BookmarkItem, FavoriteItem }

export interface BookmarkTreeItem {
  id: string
  title: string
  kind: 'bookmark' | 'folder'
  color?: string
  visualType?: 'emoji' | 'icon'
  emoji?: string
  icon?: string
  bookmark?: BookmarkItem
  children?: BookmarkTreeItem[]
}

export type TreeKey = string | number
export type TreeSelection = 'all' | Set<TreeKey>

export interface BookmarkFileTreeNode {
  key: TreeKey
  value: BookmarkTreeItem
  children?: BookmarkFileTreeNode[] | null
}

export interface FavoriteItemRendererProps {
  item: FavoriteItem
  onItemClick?: (url: string) => void
}

export interface BookmarkItemRendererProps {
  item: BookmarkItem
  onItemClick?: (url: string) => void
}

interface Props extends tvProps, ComponentPropsWithRef<'div'> {
  as?: ElementType
  classNames?: Partial<Record<tvSlots, string>>
  favorites?: FavoriteItem[]
  bookmarks?: BookmarkItem[]
  pins?: FavoriteItem[]
  onFavoriteClick?: (url: string, item: FavoriteItem) => void
  onBookmarkClick?: (url: string, item: BookmarkItem) => void
  onFavoritesChange?: (items: FavoriteItem[]) => void
  onPinsChange?: (items: FavoriteItem[]) => void
  onFavoritesReorder?: (newFavorites: FavoriteItem[]) => void
  onBookmarksReorder?: (newBookmarks: BookmarkItem[]) => void
  onFolderReorder?: (newBookmarks: BookmarkItem[]) => void
  renderFavoriteItem?: (props: FavoriteItemRendererProps) => ReactNode
  renderBookmarkItem?: (props: BookmarkItemRendererProps) => ReactNode
  renderFolderItem?: (
    folder: string,
    items: BookmarkItem[],
    onItemClick: (url: string) => void
  ) => ReactNode
}

const useProps = (originalProps: Props) => {
  const {
    variant,
    size,
    as,
    ref,
    children,
    classNames,
    favorites: externalFavorites,
    bookmarks: externalBookmarks,
    pins: externalPins,
    onFavoriteClick,
    onBookmarkClick,
    onFavoritesChange,
    onPinsChange,
    onFavoritesReorder,
    onBookmarksReorder,
    onFolderReorder,
    renderFavoriteItem,
    renderBookmarkItem,
    renderFolderItem
  } = originalProps

  const Component = as || 'div'
  const domRef = ref
  const slots = tva({ variant, size })

  const getSearchContainerProps = () => ({
    className: slots.search_container({ class: classNames?.search_container })
  })

  const getSearchInputProps = () => ({
    className: slots.search_input({ class: classNames?.search_input }),
    placeholder: 'Search ...' as const,
    classNames: {
      inputWrapper: slots.search_input_wrapper({
        class: classNames?.search_input_wrapper
      })
    }
  })

  const getScrollShadowProps = () => ({
    className: slots.scroll_shadow({ class: classNames?.scroll_shadow }),
    hideScrollBar: true
  })

  const getEmptyContainerProps = () => ({
    className: slots.empty_container({ class: classNames?.empty_container })
  })

  const getEmptyIconProps = () => ({
    icon: 'vx:star' as const,
    width: 64,
    className: slots.empty_icon({ class: classNames?.empty_icon })
  })

  const getEmptyTitleProps = () => ({
    className: slots.empty_title({ class: classNames?.empty_title }),
    children: 'No items yet' as const
  })

  const getEmptyDescriptionProps = () => ({
    className: slots.empty_description({
      class: classNames?.empty_description
    }),
    children:
      'Add items to favorites or bookmarks to quickly access them later.' as const
  })

  const getContentContainerProps = () => ({
    className: slots.content_container({ class: classNames?.content_container })
  })

  const getSectionProps = () => ({
    className: slots.section({ class: classNames?.section })
  })

  const getSectionHeaderProps = () => ({
    className: slots.section_header({ class: classNames?.section_header })
  })

  const getSectionIconProps = (className?: string) => ({
    size: 18,
    className: cn(
      slots.section_icon({ class: classNames?.section_icon }),
      className
    )
  })

  const getSectionTitleProps = (title: string) => ({
    className: slots.section_title({ class: classNames?.section_title }),
    children: title
  })

  const getFavoritesGridProps = () => ({
    className: slots.favorites_grid({ class: classNames?.favorites_grid })
  })

  const getFavorites2GridProps = () => ({
    className: slots.favorites_grid2({ class: classNames?.favorites_grid2 })
  })

  const getFavoriteItemProps = () => ({
    className: slots.favorite_item({ class: classNames?.favorite_item })
  })

  const getFavorite2ItemsProps = () => ({
    className: slots.favorite_item2({ class: classNames?.favorite_item2 })
  })
  const getFavoriteBackgroundImageProps = (src: string, alt: string) => ({
    src,
    'aria-label': alt,
    className: slots.favorite_background_image({
      class: classNames?.favorite_background_image
    })
  })

  const getFavoriteBackgroundGradientProps = () => ({
    className: slots.favorite_background_gradient({
      class: classNames?.favorite_background_gradient
    })
  })

  const getFavoriteOverlayProps = () => ({
    className: slots.favorite_overlay({ class: classNames?.favorite_overlay })
  })

  const getFavoriteAvatarContainerProps = () => ({
    className: slots.favorite_avatar_container({
      class: classNames?.favorite_avatar_container
    })
  })

  const getFavoriteAvatarProps = () => ({
    size: 'sm' as const,
    className: slots.favorite_avatar({ class: classNames?.favorite_avatar })
  })

  const getFavoriteAvatarIconProps = () => ({
    icon: 'vx:star-filled' as const,
    width: 14,
    className: slots.favorite_avatar_icon({
      class: classNames?.favorite_avatar_icon
    })
  })

  const getFavoriteAvatarFallbackProps = (name: string) => ({
    className: slots.favorite_avatar_fallback({
      class: classNames?.favorite_avatar_fallback
    }),
    children: name.charAt(0).toUpperCase()
  })

  const getFavoriteContentProps = () => ({
    className: slots.favorite_content({ class: classNames?.favorite_content })
  })

  const getFavoriteNameProps = (name: string) => ({
    className: slots.favorite_name({ class: classNames?.favorite_name }),
    children: name
  })

  const getBookmarksListProps = () => ({
    className: slots.bookmarks_list({ class: classNames?.bookmarks_list })
  })

  const getBookmarkItemProps = () => ({
    className: slots.bookmark_item({ class: classNames?.bookmark_item })
  })

  const getBookmarkAvatarProps = () => ({
    size: 'sm' as const,
    className: slots.bookmark_avatar({ class: classNames?.bookmark_avatar })
  })

  const getBookmarkAvatarFallbackProps = (name: string) => ({
    className: slots.bookmark_avatar_fallback({
      class: classNames?.bookmark_avatar_fallback
    }),
    children: name.charAt(0).toUpperCase()
  })

  const getBookmarkContentProps = () => ({
    className: slots.bookmark_content({ class: classNames?.bookmark_content })
  })

  const getBookmarkNameProps = (name: string) => ({
    className: slots.bookmark_name({ class: classNames?.bookmark_name }),
    children: name
  })

  const getBookmarkUrlProps = (url: string) => ({
    className: slots.bookmark_url({ class: classNames?.bookmark_url }),
    children: url
  })

  const getBookmarkArrowProps = () => ({
    icon: 'vx:external-link' as const,
    width: 16,
    className: slots.bookmark_arrow({ class: classNames?.bookmark_arrow })
  })

  const getBookmarkDeleteButtonProps = () => ({
    className: slots.bookmark_delete_button({
      class: classNames?.bookmark_delete_button
    })
  })

  const getFileTreeProps = () => ({
    className: slots.file_tree({ class: classNames?.file_tree })
  })

  const getBookmarkTreeEmptyStateProps = () => ({
    className: slots.bookmark_tree_empty_state({
      class: classNames?.bookmark_tree_empty_state
    })
  })

  const getFolderAccordionProps = () => ({
    variant: 'light' as const,
    selectionMode: 'multiple' as const,
    className: slots.folder_accordion({ class: classNames?.folder_accordion })
  })

  const getFolderItemProps = () => ({
    className: slots.folder_item({ class: classNames?.folder_item })
  })

  const getFolderHeadingProps = () => ({
    className: slots.folder_heading({ class: classNames?.folder_heading })
  })

  const getFolderTriggerProps = () => ({
    className: slots.folder_trigger({ class: classNames?.folder_trigger })
  })

  const getFolderTriggerContentProps = () => ({
    className: slots.folder_trigger_content({
      class: classNames?.folder_trigger_content
    })
  })

  const getFolderIconProps = () => ({
    icon: 'vx:folder-filled' as const,
    width: 18,
    className: slots.folder_icon({ class: classNames?.folder_icon })
  })

  const getFolderNameProps = (name: string) => ({
    className: slots.folder_name({ class: classNames?.folder_name }),
    children: name
  })

  const getFolderCountProps = (count: number) => ({
    className: slots.folder_count({ class: classNames?.folder_count }),
    children: `(${count})`
  })

  const getFolderIndicatorProps = () => ({
    className: slots.folder_indicator({ class: classNames?.folder_indicator })
  })

  const getFolderPanelProps = () => ({
    className: slots.folder_panel({ class: classNames?.folder_panel })
  })

  const getFolderBodyProps = () => ({
    className: slots.folder_body({ class: classNames?.folder_body })
  })

  return {
    Component,
    domRef,
    slots,
    classNames,
    children,
    getSearchContainerProps,
    getSearchInputProps,
    getScrollShadowProps,
    getEmptyContainerProps,
    getEmptyIconProps,
    getEmptyTitleProps,
    getEmptyDescriptionProps,
    getContentContainerProps,
    getSectionProps,
    getSectionHeaderProps,
    getSectionIconProps,
    getSectionTitleProps,
    getFavoritesGridProps,
    getFavoriteItemProps,
    getFavorites2GridProps,
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
    getBookmarksListProps,
    getBookmarkItemProps,
    getBookmarkAvatarProps,
    getBookmarkAvatarFallbackProps,
    getBookmarkContentProps,
    getBookmarkNameProps,
    getBookmarkUrlProps,
    getBookmarkArrowProps,
    getBookmarkDeleteButtonProps,
    getFileTreeProps,
    getBookmarkTreeEmptyStateProps,
    getFolderAccordionProps,
    getFolderItemProps,
    getFolderHeadingProps,
    getFolderTriggerProps,
    getFolderTriggerContentProps,
    getFolderIconProps,
    getFolderNameProps,
    getFolderCountProps,
    getFolderIndicatorProps,
    getFolderPanelProps,
    getFolderBodyProps,
    externalFavorites,
    externalBookmarks,
    externalPins,
    onFavoriteClick,
    onBookmarkClick,
    onFavoritesChange,
    onPinsChange,
    onFavoritesReorder,
    onBookmarksReorder,
    onFolderReorder,
    renderFavoriteItem,
    renderBookmarkItem,
    renderFolderItem
  }
}

export { useProps }
export type { Props }

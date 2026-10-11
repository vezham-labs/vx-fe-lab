import {
  type ComponentProps,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode
} from 'react'

import { Star as StarIcon } from '@vezham/icons-react'
import { Avatar, Typography } from '@vezham/react-v3'

import { type FavoriteItem } from '../types'

export interface QuickAccessProps {
  mode: 'sections' | 'all'
  favorites: FavoriteItem[]
  onUnpin: (id: string) => void
  onFavoriteRemove: (id: string) => void
  onFavoritesReorder: (items: FavoriteItem[]) => void
  pins: FavoriteItem[]
  visiblePins: FavoriteItem[]
  hasMorePins: boolean
  isScrollFavoritesOpen: boolean
  renderFavoriteItem?: (props: {
    item: FavoriteItem
    onItemClick?: (url: string) => void
  }) => ReactNode
  getSectionProps: () => HTMLAttributes<HTMLElement>
  getSectionHeaderProps: () => HTMLAttributes<HTMLDivElement>
  getSectionIconProps: (className?: string) => ComponentProps<typeof StarIcon>
  getSectionTitleProps: (
    title: string
  ) => ComponentProps<typeof Typography.Heading>
  getFavorite2ItemsProps: () => HTMLAttributes<HTMLDivElement>
  getFavoriteBackgroundImageProps: (
    src: string,
    alt: string
  ) => ImgHTMLAttributes<HTMLImageElement>
  getFavoriteBackgroundGradientProps: () => HTMLAttributes<HTMLDivElement>
  getFavoriteOverlayProps: () => HTMLAttributes<HTMLDivElement>
  getFavoriteAvatarContainerProps: () => HTMLAttributes<HTMLDivElement>
  getFavoriteAvatarProps: () => ComponentProps<typeof Avatar>
  getFavoriteAvatarIconProps: () => ComponentProps<typeof StarIcon>
  getFavoriteAvatarFallbackProps: (
    name: string
  ) => ComponentProps<typeof Avatar.Fallback>
  getFavoriteContentProps: () => HTMLAttributes<HTMLDivElement>
  getFavoriteNameProps: (
    name: string
  ) => ComponentProps<typeof Typography.Paragraph>
  onFavoriteClick: (url: string, item: FavoriteItem) => void
  onViewAllPins: () => void
  onBackToNormalView: () => void
  onToggleScrollFavorites: () => void
}

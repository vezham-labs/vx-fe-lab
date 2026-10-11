import { Dispatch, ReactNode, SetStateAction } from 'react'

import type { useProps } from '../types'

export interface ArchiveItem {
  id: string
  title: string
  url: string
  archivedDate: string
  favicon?: string
}

export interface ArchiveItemRendererProps {
  item: ArchiveItem
  onAction?: (action: string, item: ArchiveItem) => void
}

type StorageProps = ReturnType<typeof useProps>

export interface ArchiveProps extends Pick<
  StorageProps,
  | 'getSearchInputProps'
  | 'getActionsBarProps'
  | 'getClearAllButtonProps'
  | 'getContainerProps'
  | 'getEmptyContainerProps'
  | 'getEmptyIconProps'
  | 'getEmptyTitleProps'
  | 'getEmptyDescriptionProps'
  | 'getItemsContainerProps'
  | 'getDateGroupProps'
  | 'getDateHeaderProps'
  | 'getDateLabelProps'
  | 'getDateDividerProps'
  | 'getItemsListProps'
  | 'getItemProps'
  | 'getItemFaviconProps'
  | 'getItemFallbackIconProps'
  | 'getItemContentProps'
  | 'getItemTitleProps'
  | 'getItemUrlProps'
  | 'getItemActionsProps'
  | 'getUnarchiveButtonProps'
  | 'getDeleteButtonProps'
  | 'getActionIconProps'
> {
  archiveItems: ArchiveItem[]
  archiveSearch: string
  setArchiveSearch: Dispatch<SetStateAction<string>>
  setInternalArchiveItems: Dispatch<SetStateAction<ArchiveItem[]>>
  onUnarchive?: (id: string) => void
  onDeleteFromArchive?: (id: string) => void
  onClearAllArchive?: () => void
  onItemClick?: (url: string) => void
  renderArchiveItem?: (props: ArchiveItemRendererProps) => ReactNode
}

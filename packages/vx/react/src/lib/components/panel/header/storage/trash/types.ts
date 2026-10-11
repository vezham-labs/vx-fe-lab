import { Dispatch, ReactNode, SetStateAction } from 'react'

import type { useProps } from '../types'

export interface TrashItem {
  id: string
  title: string
  url: string
  deletedDate: string
  favicon?: string
}

export interface TrashItemRendererProps {
  item: TrashItem
  onAction?: (action: string, item: TrashItem) => void
}

type StorageProps = ReturnType<typeof useProps>

export interface TrashProps extends Pick<
  StorageProps,
  | 'getSearchInputProps'
  | 'getActionsBarProps'
  | 'getRestoreAllButtonProps'
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
  | 'getRestoreButtonProps'
  | 'getDeletePermanentButtonProps'
  | 'getActionIconProps'
> {
  trashItems: TrashItem[]
  trashSearch: string
  setTrashSearch: Dispatch<SetStateAction<string>>
  setInternalTrashItems: Dispatch<SetStateAction<TrashItem[]>>
  onRestore?: (id: string) => void
  onDeletePermanently?: (id: string) => void
  onClearAllTrash?: () => void
  onRestoreAllTrash?: () => void
  renderTrashItem?: (props: TrashItemRendererProps) => ReactNode
}

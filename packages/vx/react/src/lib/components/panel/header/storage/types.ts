import { type ComponentPropsWithRef, type ElementType, ReactNode } from 'react'

import { cn } from '@vezham/react-v3'

import { ArchiveItem, ArchiveItemRendererProps } from './archive/types'
import { TrashItem, TrashItemRendererProps } from './trash/types'
import { tvProps, tvSlots, tva } from './variant'

interface Props extends tvProps, ComponentPropsWithRef<'div'> {
  as?: ElementType
  classNames?: Partial<Record<tvSlots, string>>
  archiveItems?: ArchiveItem[]
  trashItems?: TrashItem[]
  onUnarchive?: (id: string) => void
  onDeleteFromArchive?: (id: string) => void
  onRestore?: (id: string) => void
  onDeletePermanently?: (id: string) => void
  onClearAllArchive?: () => void
  onClearAllTrash?: () => void
  onRestoreAllTrash?: () => void
  onItemClick?: (url: string) => void
  renderArchiveItem?: (props: ArchiveItemRendererProps) => ReactNode
  renderTrashItem?: (props: TrashItemRendererProps) => ReactNode
}

const useProps = (originalProps: Props) => {
  const {
    variant,
    size,
    as,
    ref,
    children,
    classNames,
    archiveItems: externalArchiveItems,
    trashItems: externalTrashItems,
    onUnarchive,
    onDeleteFromArchive,
    onRestore,
    onDeletePermanently,
    onClearAllArchive,
    onClearAllTrash,
    onRestoreAllTrash,
    onItemClick,
    renderArchiveItem,
    renderTrashItem,
    ...otherProps
  } = originalProps

  const Component = as || 'div'
  const domRef = ref
  const slots = tva({ variant, size })
  void otherProps

  const getTabsProps = () => ({
    className: slots.tabs({ class: classNames?.tabs })
  })

  const getTabsListContainerProps = () => ({
    className: slots.tabs_list_container({
      class: classNames?.tabs_list_container
    })
  })

  const getTabsListProps = () => ({
    className: slots.tabs_list({ class: classNames?.tabs_list }),
    'aria-label': 'Archive and Trash tabs'
  })

  const getTabArchiveProps = () => ({
    id: 'archive',
    className: slots.tab_archive({ class: classNames?.tab_archive })
  })

  const getTabTrashProps = () => ({
    id: 'trash',
    className: slots.tab_trash({ class: classNames?.tab_trash })
  })

  const getTabIndicatorProps = () => ({
    className: slots.tab_indicator({ class: classNames?.tab_indicator })
  })

  const getContainerProps = () => ({
    className: slots.container({ class: classNames?.container })
  })

  const getSearchInputProps = (isArchive: boolean) => ({
    className: cn(
      slots.search_input({ class: classNames?.search_input }),
      slots.search_input_wrapper({ class: classNames?.search_input_wrapper })
    ),
    placeholder: isArchive ? 'Search' : 'Search',
    variant: 'secondary' as const
  })

  const getActionsBarProps = (hasRestore: boolean) => ({
    className: hasRestore
      ? slots.actions_bar_with_gap({ class: classNames?.actions_bar })
      : slots.actions_bar({ class: classNames?.actions_bar })
  })

  const getClearAllButtonProps = () => ({
    size: 'sm' as const,
    variant: 'danger-soft' as const
  })

  const getRestoreAllButtonProps = () => ({
    size: 'sm' as const,
    variant: 'outline' as const,
    className: 'text-success'
  })

  const getEmptyContainerProps = () => ({
    className: slots.empty_container({ class: classNames?.empty_container })
  })

  const getEmptyIconProps = () => ({
    size: 64,
    className: slots.empty_icon({ class: classNames?.empty_icon })
  })

  const getEmptyTitleProps = () => ({
    className: slots.empty_title({ class: classNames?.empty_title })
  })

  const getEmptyDescriptionProps = () => ({
    className: slots.empty_description({ class: classNames?.empty_description })
  })

  const getItemsContainerProps = () => ({
    className: slots.items_container({ class: classNames?.items_container })
  })

  const getDateGroupProps = () => ({
    className: slots.date_group({ class: classNames?.date_group })
  })

  const getDateHeaderProps = () => ({
    className: slots.date_header({ class: classNames?.date_header })
  })

  const getDateLabelProps = () => ({
    className: slots.date_label({ class: classNames?.date_label })
  })

  const getDateDividerProps = () => ({
    className: slots.date_divider({ class: classNames?.date_divider })
  })

  const getItemsListProps = () => ({
    className: slots.items_list({ class: classNames?.items_list })
  })

  const getItemProps = () => ({
    className: slots.item({ class: classNames?.item })
  })

  const getItemFaviconProps = () => ({
    className: slots.item_favicon({ class: classNames?.item_favicon }),
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = 'none'
    }
  })

  const getItemFallbackIconProps = () => ({
    size: 16,
    className: slots.item_fallback_icon({
      class: classNames?.item_fallback_icon
    })
  })

  const getItemContentProps = () => ({
    className: slots.item_content({ class: classNames?.item_content })
  })

  const getItemTitleProps = (title: string) => ({
    className: slots.item_title({ class: classNames?.item_title }),
    children: title
  })

  const getItemUrlProps = (url: string) => ({
    className: slots.item_url({ class: classNames?.item_url }),
    children: url
  })

  const getItemActionsProps = () => ({
    className: slots.item_actions({ class: classNames?.item_actions })
  })

  const getUnarchiveButtonProps = () => ({
    size: 'sm' as const,
    className: slots.unarchive_button({ class: classNames?.unarchive_button }),
    'aria-label': 'Unarchive'
  })

  const getRestoreButtonProps = () => ({
    size: 'sm' as const,
    className: slots.restore_button({ class: classNames?.restore_button }),
    'aria-label': 'Restore'
  })

  const getDeleteButtonProps = () => ({
    size: 'sm' as const,
    className: slots.delete_button({ class: classNames?.delete_button }),
    'aria-label': 'Delete'
  })

  const getDeletePermanentButtonProps = () => ({
    size: 'sm' as const,
    className: slots.delete_permanent_button({
      class: classNames?.delete_permanent_button
    }),
    'aria-label': 'Delete Permanently'
  })

  const getActionIconProps = (color?: 'success' | 'danger' | 'default') => ({
    size: 18,
    className:
      color === 'success'
        ? slots.action_icon_success({ class: classNames?.action_icon })
        : color === 'danger'
          ? slots.action_icon_danger({ class: classNames?.action_icon })
          : slots.action_icon_default({ class: classNames?.action_icon })
  })

  return {
    Component,
    domRef,
    slots,
    classNames,
    children,
    getTabsProps,
    getTabsListContainerProps,
    getTabsListProps,
    getTabArchiveProps,
    getTabTrashProps,
    getTabIndicatorProps,
    getContainerProps,
    getSearchInputProps,
    getActionsBarProps,
    getClearAllButtonProps,
    getRestoreAllButtonProps,
    getEmptyContainerProps,
    getEmptyIconProps,
    getEmptyTitleProps,
    getEmptyDescriptionProps,
    getItemsContainerProps,
    getDateGroupProps,
    getDateHeaderProps,
    getDateLabelProps,
    getDateDividerProps,
    getItemsListProps,
    getItemProps,
    getItemFaviconProps,
    getItemFallbackIconProps,
    getItemContentProps,
    getItemTitleProps,
    getItemUrlProps,
    getItemActionsProps,
    getUnarchiveButtonProps,
    getRestoreButtonProps,
    getDeleteButtonProps,
    getDeletePermanentButtonProps,
    getActionIconProps,
    externalArchiveItems,
    externalTrashItems,
    onUnarchive,
    onDeleteFromArchive,
    onRestore,
    onDeletePermanently,
    onClearAllArchive,
    onClearAllTrash,
    onRestoreAllTrash,
    onItemClick,
    renderArchiveItem,
    renderTrashItem
  }
}

export { useProps }
export type { ArchiveItem, Props, TrashItem }

import type { ChangeEvent } from 'react'

import {
  ArchiveUp as ArchiveUpIcon,
  TrashBinTrash as TrashIcon
} from '@vezham/icons-react'
import { EmptyState } from '@vezham/react-pro-v3/empty-state'
import { Button, Input } from '@vezham/react-v3'

import { StorageHistoryActions } from '../history-actions'
import { StorageHistoryDateGroup } from '../history-date-group'
import { StorageHistoryItemContent } from '../history-item-content'
import { StorageHistoryShell } from '../history-shell'
import { filterHistoryItems, groupHistoryItemsByDate } from '../history-utils'
import { TrashProps } from './types'
import { trashActions } from './variants'

const SearchInput = Input

const Trash = (props: TrashProps) => {
  const {
    trashItems,
    trashSearch,
    setTrashSearch,
    setInternalTrashItems,
    getSearchInputProps,
    getActionsBarProps,
    getRestoreAllButtonProps,
    getClearAllButtonProps,
    getContainerProps,
    getEmptyContainerProps,
    getEmptyIconProps,
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
    getRestoreButtonProps,
    getDeletePermanentButtonProps,
    getActionIconProps,
    onRestore,
    onDeletePermanently,
    onClearAllTrash,
    onRestoreAllTrash,
    renderTrashItem
  } = props

  const filteredTrashItems = filterHistoryItems(trashItems, trashSearch)
  const trashByDate = groupHistoryItemsByDate(
    filteredTrashItems,
    item => item.deletedDate
  )

  const handleRestore = (id: string) => {
    if (onRestore) {
      onRestore(id)
    } else {
      setInternalTrashItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleDeletePermanently = (id: string) => {
    if (onDeletePermanently) {
      onDeletePermanently(id)
    } else {
      setInternalTrashItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleClearAllTrash = () => {
    if (onClearAllTrash) {
      onClearAllTrash()
    } else {
      setInternalTrashItems([])
    }
  }

  const handleRestoreAllTrash = () => {
    if (onRestoreAllTrash) {
      onRestoreAllTrash()
    } else {
      setInternalTrashItems([])
    }
  }

  const hasTrashItems = filteredTrashItems.length > 0

  const renderTrashContent = () => {
    if (!hasTrashItems) {
      return (
        <div {...getEmptyContainerProps()}>
          <EmptyState className="rounded-2xl">
            <EmptyState.Media>
              <TrashIcon
                {...getEmptyIconProps()}
                weight="outline"
                aria-hidden="true"
              />
            </EmptyState.Media>
            <EmptyState.Title>Trash is Empty</EmptyState.Title>
          </EmptyState>
        </div>
      )
    }

    return (
      <div {...getItemsContainerProps()}>
        {Object.entries(trashByDate).map(([date, items]) => (
          <StorageHistoryDateGroup
            key={date}
            date={date}
            getDateGroupProps={getDateGroupProps}
            getDateHeaderProps={getDateHeaderProps}
            getDateLabelProps={getDateLabelProps}
            getDateDividerProps={getDateDividerProps}
            getItemsListProps={getItemsListProps}>
            {items.map(item => {
              if (renderTrashItem) {
                return renderTrashItem({
                  item,
                  onAction: action => {
                    if (action === 'restore') handleRestore(item.id)
                    if (action === 'delete') handleDeletePermanently(item.id)
                  }
                })
              }

              return (
                <div key={item.id} {...getItemProps()}>
                  <StorageHistoryItemContent
                    item={item}
                    getItemFaviconProps={getItemFaviconProps}
                    getItemFallbackIconProps={getItemFallbackIconProps}
                    getItemContentProps={getItemContentProps}
                    getItemTitleProps={getItemTitleProps}
                    getItemUrlProps={getItemUrlProps}
                  />

                  <div {...getItemActionsProps()}>
                    <Button
                      isIconOnly
                      variant="ghost"
                      {...getRestoreButtonProps()}
                      onPress={() => {
                        handleRestore(item.id)
                      }}>
                      <ArchiveUpIcon
                        {...getActionIconProps('default')}
                        weight="outline"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button
                      isIconOnly
                      variant="ghost"
                      {...getDeletePermanentButtonProps()}
                      onPress={() => {
                        handleDeletePermanently(item.id)
                      }}>
                      <TrashIcon
                        {...getActionIconProps('danger')}
                        weight="outline"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              )
            })}
          </StorageHistoryDateGroup>
        ))}
      </div>
    )
  }

  const actions = trashActions.map(action => ({
    ...action,
    props:
      action.type === 'restore'
        ? getRestoreAllButtonProps()
        : getClearAllButtonProps(),
    onPress:
      action.type === 'restore' ? handleRestoreAllTrash : handleClearAllTrash
  }))

  return (
    <StorageHistoryShell
      containerProps={getContainerProps()}
      search={
        <SearchInput
          {...getSearchInputProps(false)}
          value={trashSearch}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTrashSearch(e.target.value)
          }
        />
      }
      actions={
        <StorageHistoryActions
          visible={hasTrashItems}
          actions={actions}
          barProps={getActionsBarProps(true)}
        />
      }>
      {renderTrashContent()}
    </StorageHistoryShell>
  )
}

export { Trash }

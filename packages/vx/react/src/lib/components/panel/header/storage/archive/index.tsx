import { useNavigate } from '@tanstack/react-router'
import type { ChangeEvent } from 'react'

import {
  Archive as ArchiveIcon,
  ArchiveUp as ArchiveUpIcon,
  TrashBinTrash as TrashIcon
} from '@vezham/icons-react'
import { EmptyState } from '@vezham/react-pro-v3/empty-state'
import { Button, Input } from '@vezham/react-v3'

import { getAppPath, getOpenUrl } from '../../../../../utils/url'
import { StorageHistoryActions } from '../history-actions'
import { StorageHistoryDateGroup } from '../history-date-group'
import { StorageHistoryItemContent } from '../history-item-content'
import { StorageHistoryShell } from '../history-shell'
import { filterHistoryItems, groupHistoryItemsByDate } from '../history-utils'
import { ArchiveProps } from './types'
import { archiveActions } from './variants'

const SearchInput = Input

const Archive = (props: ArchiveProps) => {
  const navigate = useNavigate()
  const {
    archiveItems,
    archiveSearch,
    setArchiveSearch,
    setInternalArchiveItems,
    getSearchInputProps,
    getActionsBarProps,
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
    getUnarchiveButtonProps,
    getDeleteButtonProps,
    getActionIconProps,
    onUnarchive,
    onDeleteFromArchive,
    onClearAllArchive,
    onItemClick,
    renderArchiveItem
  } = props

  const filteredArchiveItems = filterHistoryItems(archiveItems, archiveSearch)
  const archiveByDate = groupHistoryItemsByDate(
    filteredArchiveItems,
    item => item.archivedDate
  )

  const handleUnarchive = (id: string) => {
    if (onUnarchive) {
      onUnarchive(id)
    } else {
      setInternalArchiveItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleDeleteFromArchive = (id: string) => {
    if (onDeleteFromArchive) {
      onDeleteFromArchive(id)
    } else {
      setInternalArchiveItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleClearAllArchive = () => {
    if (onClearAllArchive) {
      onClearAllArchive()
    } else {
      setInternalArchiveItems([])
    }
  }

  const handleItemClick = (url: string) => {
    if (onItemClick) {
      onItemClick(url)
    } else if (url && url !== '#') {
      const appPath = getAppPath(url, window.location.origin)

      if (appPath) {
        navigate({ to: appPath })
      } else {
        window.open(getOpenUrl(url), '_blank', 'noopener,noreferrer')
      }
    }
  }

  const hasArchiveItems = filteredArchiveItems.length > 0

  const renderArchiveContent = () => {
    if (!hasArchiveItems) {
      return (
        <div {...getEmptyContainerProps()}>
          <EmptyState className="rounded-2xl">
            <EmptyState.Media>
              <ArchiveIcon
                {...getEmptyIconProps()}
                weight="outline"
                aria-hidden="true"
              />
            </EmptyState.Media>
            <EmptyState.Title>Archive is Empty</EmptyState.Title>
          </EmptyState>
        </div>
      )
    }

    return (
      <div {...getItemsContainerProps()}>
        {Object.entries(archiveByDate).map(([date, items]) => (
          <StorageHistoryDateGroup
            key={date}
            date={date}
            getDateGroupProps={getDateGroupProps}
            getDateHeaderProps={getDateHeaderProps}
            getDateLabelProps={getDateLabelProps}
            getDateDividerProps={getDateDividerProps}
            getItemsListProps={getItemsListProps}>
            {items.map(item => {
              if (renderArchiveItem) {
                return renderArchiveItem({
                  item,
                  onAction: action => {
                    if (action === 'unarchive') handleUnarchive(item.id)
                    if (action === 'delete') handleDeleteFromArchive(item.id)
                  }
                })
              }

              return (
                <div key={item.id} {...getItemProps()}>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => handleItemClick(item.url)}>
                    <StorageHistoryItemContent
                      item={item}
                      getItemFaviconProps={getItemFaviconProps}
                      getItemFallbackIconProps={getItemFallbackIconProps}
                      getItemContentProps={getItemContentProps}
                      getItemTitleProps={getItemTitleProps}
                      getItemUrlProps={getItemUrlProps}
                    />
                  </button>

                  <div {...getItemActionsProps()}>
                    <Button
                      isIconOnly
                      variant="ghost"
                      {...getUnarchiveButtonProps()}
                      onPress={() => {
                        handleUnarchive(item.id)
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
                      {...getDeleteButtonProps()}
                      onPress={() => {
                        handleDeleteFromArchive(item.id)
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

  const actions = archiveActions.map(action => ({
    ...action,
    props: getClearAllButtonProps(),
    onPress: handleClearAllArchive
  }))

  return (
    <StorageHistoryShell
      containerProps={getContainerProps()}
      search={
        <SearchInput
          {...getSearchInputProps(true)}
          value={archiveSearch}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setArchiveSearch(e.target.value)
          }
        />
      }
      actions={
        <StorageHistoryActions
          visible={hasArchiveItems}
          actions={actions}
          barProps={getActionsBarProps(false)}
        />
      }>
      {renderArchiveContent()}
    </StorageHistoryShell>
  )
}

export { Archive }

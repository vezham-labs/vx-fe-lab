import { type ReactNode, useState } from 'react'

import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  MenuDots,
  SortFromBottomToTop,
  SortFromTopToBottom
} from '@vezham/icons-react'
import { Button, Label, Separator } from '@vezham/react-v3'

import { AppIcon } from '../../components/app-icon'
import { MenuSheet } from '../../components/menu/sheet'
import { type SectionSort, sortDirections, sortFields } from './sort-menu'
import type {
  SectionAction,
  SectionFilterKey,
  SectionViewAction,
  SectionViewMode
} from './toolbar'

type Props = {
  filterAction?: SectionAction
  filterGroups: readonly {
    label: string
    options: readonly { key: SectionFilterKey; label: string; icon: string }[]
  }[]
  menuActions: SectionAction[]
  onSync: () => void
  onToggleFilter: (filter: SectionFilterKey) => void
  onViewModeChange: (view: SectionViewMode) => void
  selectedFilters: SectionFilterKey[]
  sync: boolean
  sort: boolean
  sortValue: SectionSort
  onSortChange?: (value: SectionSort) => void
  viewModeActions: SectionViewAction[]
}

const actionClass =
  'h-auto min-h-11 w-full justify-start gap-3 rounded-lg px-3 py-2 text-start'

const SheetFilters = ({
  filterGroups,
  selectedFilters,
  onToggleFilter
}: Pick<Props, 'filterGroups' | 'selectedFilters' | 'onToggleFilter'>) => {
  const selectedFilterKeys = new Set(selectedFilters)
  return filterGroups.map((group, index) => (
    <div key={group.label} className="flex flex-col gap-1">
      {index > 0 && <Separator className="my-1" />}
      <Label className="text-muted px-3 pt-2">{group.label}</Label>
      {group.options.map(option => (
        <Button
          key={option.key}
          variant="ghost"
          className={actionClass}
          aria-pressed={selectedFilterKeys.has(option.key)}
          onPress={() => onToggleFilter(option.key)}>
          <AppIcon icon={option.icon} size={18} aria-hidden="true" />
          <span className="flex-1">{option.label}</span>
          {selectedFilterKeys.has(option.key) && (
            <CheckCircle size={18} aria-hidden="true" weight="filled" />
          )}
        </Button>
      ))}
    </div>
  ))
}

const SheetSort = ({
  sortValue,
  onSortChange
}: Pick<Props, 'sortValue' | 'onSortChange'>) => (
  <>
    <Label className="text-muted px-3 pt-2">Sort by</Label>
    {sortFields.map(option => (
      <Button
        key={option.key}
        variant="ghost"
        className={actionClass}
        aria-pressed={sortValue.by === option.key}
        onPress={() => onSortChange?.({ ...sortValue, by: option.key })}>
        <span className="flex-1">{option.label}</span>
        {sortValue.by === option.key && (
          <CheckCircle size={18} aria-hidden="true" weight="filled" />
        )}
      </Button>
    ))}
    <Separator className="my-1" />
    <Label className="text-muted px-3 pt-2">Direction</Label>
    {sortDirections.map(option => (
      <Button
        key={option.key}
        variant="ghost"
        className={actionClass}
        aria-pressed={sortValue.direction === option.key}
        onPress={() => onSortChange?.({ ...sortValue, direction: option.key })}>
        <span className="flex-1">{option.label}</span>
        {sortValue.direction === option.key && (
          <CheckCircle size={18} aria-hidden="true" weight="filled" />
        )}
      </Button>
    ))}
  </>
)

const SheetHome = ({
  sync,
  onSync,
  filterAction,
  sort,
  sortValue,
  viewModeActions,
  onViewModeChange,
  menuActions,
  setPage,
  renderActions
}: Pick<
  Props,
  | 'sync'
  | 'onSync'
  | 'filterAction'
  | 'sort'
  | 'sortValue'
  | 'viewModeActions'
  | 'onViewModeChange'
  | 'menuActions'
> & {
  setPage: (page: 'home' | 'filter' | 'sort') => void
  renderActions: (actions: SectionAction[]) => ReactNode
}) => (
  <>
    {sync &&
      renderActions([
        {
          key: 'sync',
          label: 'Sync',
          icon: 'vx:refresh',
          onAction: onSync
        }
      ])}
    {filterAction && (
      <Button
        variant="ghost"
        className={actionClass}
        onPress={() => setPage('filter')}>
        <AppIcon icon={filterAction.icon} size={18} aria-hidden="true" />
        <span className="flex-1">Filter</span>
        <AltArrowRight size={18} aria-hidden="true" />
      </Button>
    )}
    {sort && (
      <Button
        variant="ghost"
        className={actionClass}
        onPress={() => setPage('sort')}>
        {sortValue.direction === 'ascending' ? (
          <SortFromBottomToTop size={18} aria-hidden="true" />
        ) : (
          <SortFromTopToBottom size={18} aria-hidden="true" />
        )}
        <span className="flex-1">Sort</span>
        <AltArrowRight size={18} aria-hidden="true" />
      </Button>
    )}
    {(filterAction || sort) && viewModeActions.length > 0 && (
      <Separator className="my-1" />
    )}
    {renderActions(
      viewModeActions.map(action => ({
        ...action,
        onAction: () => onViewModeChange(action.key)
      }))
    )}
    {menuActions.length > 0 &&
      (sync || filterAction || sort || viewModeActions.length > 0) && (
        <Separator className="my-1" />
      )}
    {renderActions(menuActions)}
  </>
)

export const ToolbarMoreSheet = ({
  filterAction,
  filterGroups,
  menuActions,
  onSync,
  onToggleFilter,
  onViewModeChange,
  selectedFilters,
  sync,
  sort,
  sortValue,
  onSortChange,
  viewModeActions
}: Props) => {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<'home' | 'filter' | 'sort'>('home')
  const [path, setPath] = useState<SectionAction[]>([])
  const changeOpen = (value: boolean) => {
    setOpen(value)
    if (!value) {
      setPage('home')
      setPath([])
    }
  }
  const run = (action?: () => void) => {
    changeOpen(false)
    action?.()
  }
  const current = path[path.length - 1]
  const title =
    page === 'filter'
      ? 'Filter'
      : page === 'sort'
        ? 'Sort'
        : (current?.label ?? 'More')
  const renderActions = (actions: SectionAction[]) =>
    actions.map(action => (
      <Button
        key={action.key}
        variant="ghost"
        className={actionClass}
        onPress={() =>
          action.children?.length
            ? setPath([...path, action])
            : run(action.onAction)
        }>
        <AppIcon icon={action.icon} size={18} aria-hidden="true" />
        <span className="flex-1">{action.label}</span>
        {Boolean(action.children?.length) && (
          <AltArrowRight size={18} aria-hidden="true" />
        )}
      </Button>
    ))
  return (
    <MenuSheet
      title="Toolbar actions"
      hideTitle
      isOpen={open}
      onOpenChange={changeOpen}
      trigger={
        <Button
          isIconOnly
          variant="ghost"
          aria-label="More"
          className="h-9 w-9 min-w-9 rounded-full p-0">
          <MenuDots className="rotate-90" size={18} aria-hidden="true" />
        </Button>
      }>
      <div
        key={`${page}:${path.map(action => action.key).join(':')}`}
        className="flex flex-col gap-1">
        {(page !== 'home' || current) && (
          <Button
            variant="ghost"
            className={actionClass}
            aria-label="Back to toolbar actions"
            onPress={() => {
              if (current) setPath(path.slice(0, -1))
              else setPage('home')
            }}>
            <AltArrowLeft size={18} aria-hidden="true" />
            {title}
          </Button>
        )}
        {page === 'filter' ? (
          <SheetFilters
            filterGroups={filterGroups}
            selectedFilters={selectedFilters}
            onToggleFilter={onToggleFilter}
          />
        ) : page === 'sort' ? (
          <SheetSort sortValue={sortValue} onSortChange={onSortChange} />
        ) : current ? (
          renderActions(current.children ?? [])
        ) : (
          <SheetHome
            sync={sync}
            onSync={onSync}
            filterAction={filterAction}
            sort={sort}
            sortValue={sortValue}
            viewModeActions={viewModeActions}
            onViewModeChange={onViewModeChange}
            menuActions={menuActions}
            setPage={setPage}
            renderActions={renderActions}
          />
        )}
      </div>
    </MenuSheet>
  )
}

import { Link } from '@tanstack/react-router'
import { type Dispatch, type SetStateAction, useId } from 'react'

import { AltArrowDown } from '@vezham/icons-react'

import { AppIcon } from '../../components/app-icon'
import { type AppNavigationItem, getSelectedMenuKey } from '../../navigation'
import { useSectionSidebarState } from './sidebar-state'

const SidebarEntry = ({
  item,
  pathname,
  onNavigate,
  expandedKeys,
  setExpandedKeys
}: {
  item: AppNavigationItem
  pathname: string
  onNavigate: () => void
  expandedKeys: Set<string>
  setExpandedKeys: Dispatch<SetStateAction<Set<string>>>
}) => {
  const active = Boolean(getSelectedMenuKey(pathname, [item]))
  const expandable =
    item.childrenDisplay === 'sidebar' && Boolean(item.children?.length)
  const expanded = expandedKeys.has(item.key)
  const childrenId = useId()
  const content = (
    <>
      {item.icon && (
        <AppIcon
          icon={item.icon}
          size={18}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="min-w-0 flex-1 truncate">{item.title}</span>
    </>
  )
  return (
    <div>
      {expandable ? (
        <button
          type="button"
          aria-label={item.title}
          aria-expanded={expanded}
          aria-controls={childrenId}
          className={`hover:bg-surface-secondary flex w-full cursor-pointer items-center gap-3 rounded-full px-3 py-2 text-start text-sm ${active ? 'text-foreground font-bold' : 'text-muted'}`}
          onClick={() =>
            setExpandedKeys(current => {
              const next = new Set(current)
              if (next.has(item.key)) next.delete(item.key)
              else next.add(item.key)
              return next
            })
          }>
          {content}
          <AltArrowDown
            size={16}
            className={`shrink-0 ${expanded ? '' : '-rotate-90'}`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <Link
          to={item.href ?? item.children?.[0]?.href ?? '/'}
          aria-current={active ? 'page' : undefined}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm ${active ? 'bg-surface-secondary text-foreground font-bold' : 'text-muted hover:bg-surface-secondary'}`}>
          {content}
        </Link>
      )}
      {expandable && expanded && (
        <div
          id={childrenId}
          className="border-separator mt-1 ml-5 space-y-1 border-l pl-2">
          {item.children?.map(child => (
            <SidebarEntry
              key={child.key}
              item={child}
              pathname={pathname}
              onNavigate={onNavigate}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const SectionSidebar = ({
  items,
  pathname,
  label,
  onNavigate,
  expandedKeys: controlledExpandedKeys,
  onExpandedChange
}: {
  items: AppNavigationItem[]
  pathname: string
  label: string
  onNavigate: () => void
  expandedKeys?: Set<string>
  onExpandedChange?: Dispatch<SetStateAction<Set<string>>>
}) => {
  const {
    expandedKeys: localExpandedKeys,
    setExpandedKeys: setLocalExpandedKeys
  } = useSectionSidebarState(items, pathname)
  const expandedKeys = controlledExpandedKeys ?? localExpandedKeys
  const setExpandedKeys = onExpandedChange ?? setLocalExpandedKeys
  return (
    <nav aria-label={label} className="space-y-1 p-2">
      {items.map(item => (
        <SidebarEntry
          key={item.key}
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
          expandedKeys={expandedKeys}
          setExpandedKeys={setExpandedKeys}
        />
      ))}
    </nav>
  )
}

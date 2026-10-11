import { type SetStateAction, useCallback, useState } from 'react'

import { type AppNavigationItem, getSelectedMenuKey } from '../../navigation'

const expandActiveGroups = (
  items: AppNavigationItem[],
  pathname: string,
  expandedKeys: Set<string>
) => {
  const next = new Set(expandedKeys)
  for (const item of items) {
    if (item.childrenDisplay !== 'sidebar' || !item.children?.length) continue
    if (!getSelectedMenuKey(pathname, [item])) continue
    next.add(item.key)
    for (const key of expandActiveGroups(item.children, pathname, next)) {
      next.add(key)
    }
  }
  return next
}

export const useSectionSidebarState = (
  items: AppNavigationItem[],
  pathname: string
) => {
  const [state, setState] = useState(() => ({
    pathname,
    expandedKeys: expandActiveGroups(items, pathname, new Set())
  }))

  if (state.pathname !== pathname) {
    setState({
      pathname,
      expandedKeys: expandActiveGroups(items, pathname, state.expandedKeys)
    })
  }

  const setExpandedKeys = useCallback((update: SetStateAction<Set<string>>) => {
    setState(current => ({
      ...current,
      expandedKeys:
        typeof update === 'function' ? update(current.expandedKeys) : update
    }))
  }, [])

  return { expandedKeys: state.expandedKeys, setExpandedKeys }
}

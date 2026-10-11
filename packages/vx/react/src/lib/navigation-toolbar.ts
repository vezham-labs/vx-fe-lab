import type { AppNavigationItem } from './navigation'

export type NavigationAction = {
  key: string
  label: string
  icon: string
  children?: NavigationAction[]
}

export type NavigationViewAction = {
  key: 'grid' | 'list'
  label: string
  icon: string
  enabled?: boolean
}

export type NavigationToolbar = {
  search?: boolean | { label?: string; placeholder?: string }
  sync?: boolean
  filter?: boolean
  sort?: boolean
  view?: NavigationViewAction[]
  menuActions?: NavigationAction[]
  primaryAction?: false | NavigationAction
}

export const getNavigationToolbar = (
  items: AppNavigationItem[],
  pathname: string
): Omit<NavigationToolbar, 'search'> & {
  search?: false | { label?: string; placeholder?: string }
} => {
  let toolbar: NavigationToolbar = {}
  let matchLength = -1
  const visit = (
    entries: AppNavigationItem[],
    inherited: NavigationToolbar
  ) => {
    for (const item of entries) {
      const resolved = { ...inherited, ...item.toolbar }
      if (
        item.href &&
        (pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(`${item.href}/`))) &&
        item.href.length >= matchLength
      ) {
        toolbar = resolved
        matchLength = item.href.length
      }
      visit(item.children ?? [], resolved)
    }
  }
  visit(items, {})
  const { search, ...settings } = toolbar
  return {
    ...settings,
    ...(search === true
      ? { search: { label: 'Search content', placeholder: 'Search' } }
      : search === undefined
        ? {}
        : { search })
  }
}

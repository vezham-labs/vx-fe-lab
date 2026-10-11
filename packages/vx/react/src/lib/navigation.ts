import type { ReactNode } from 'react'

import type { NavigationToolbar } from './navigation-toolbar'

export type AppNavigationItem = {
  key: string
  title: string
  href?: string
  icon?: string
  iconActive?: string
  toolbar?: NavigationToolbar
  startContent?: ReactNode
  endContent?: ReactNode
  childrenDisplay?: 'tabs' | 'sidebar'
  children?: AppNavigationItem[]
  submenu?: AppNavigationItem[]
  items?: AppNavigationItem[]
  type?: 'nest'
  isSelected?: boolean
}

const getMatchLength = (pathname: string, item: AppNavigationItem): number => {
  const href = item.href
  const ownMatch =
    href &&
    (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)))
      ? href.length
      : 0
  const descendants = [
    ...(item.children ?? []),
    ...(item.submenu ?? []),
    ...(item.items ?? [])
  ]
  return descendants.reduce(
    (length, child) => Math.max(length, getMatchLength(pathname, child)),
    ownMatch
  )
}

export const getSelectedMenuKey = (
  pathname: string,
  items: AppNavigationItem[]
) => {
  let selectedKey: string | undefined
  let matchLength = 0
  for (const item of items) {
    const length = getMatchLength(pathname, item)
    if (length > matchLength) {
      selectedKey = item.key
      matchLength = length
    }
  }
  return selectedKey
}

export const getNavigationPageKey = (
  items: AppNavigationItem[],
  pathname: string
) => {
  let key = ''
  let matchLength = -1
  const visit = (entries: AppNavigationItem[]) => {
    for (const item of entries) {
      if (
        item.href &&
        (pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(`${item.href}/`))) &&
        item.href.length >= matchLength
      ) {
        key = item.key
        matchLength = item.href.length
      }
      visit(item.children ?? [])
    }
  }
  visit(items)
  return key
}

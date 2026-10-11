import type { AppNavigationItem } from '../../navigation'

export enum SidebarItemType {
  Nest = 'nest'
}

export type SidebarItem = Omit<AppNavigationItem, 'items' | 'type'> & {
  items?: SidebarItem[]
  type?: 'nest'
}

export interface BottomNavbarProps {
  items: SidebarItem[]
  selectedKey: string
  onSelect: (key: string) => void
  isDarkMode?: boolean
  showSearch?: boolean
  hasPrimaryAction?: boolean
  onSearch?: () => void
  bgColorClass?: string
  textColorClass?: string
  buttonTextColor?: string
}

export type MenuDrawerProps = {
  items: SidebarItem[]
  selectedKey: string
  onItemSelect: (item: SidebarItem) => void
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
  buttonTextColor?: string
}

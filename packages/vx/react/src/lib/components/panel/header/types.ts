import { ReactNode } from 'react'

export interface User {
  id: string
  name: string
  avatar?: string
}

export interface HeaderActionsProps {
  users: User

  showSearch?: boolean
  showBookamarks?: boolean
  showStorage?: boolean

  favoritesCount?: number
  archiveCount?: number

  onAvatarClick?: (user: User) => void
  onSearchClick?: () => void

  className?: string
  compact?: boolean
  hideSeparator?: boolean
  showMenuUtilities?: boolean
  isDockHidden?: boolean
  onToggleDock?: () => void
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
  extraActions?: ReactNode
}

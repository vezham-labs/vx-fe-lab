import type { ReactElement, ReactNode } from 'react'

export interface UserInfo {
  id: string
  name: string
  avatar?: string
  isOnline?: boolean
}

export type UserStatus = 'active' | 'away' | 'idle' | 'busy' | 'dnd'

export interface UserStatusOption {
  id: UserStatus
  label: string
  icon: string
  color?: string
}

export interface SuggestedStatusOption {
  id: string
  label: string
  emoji: string
}

export interface StatusTimingOption {
  id: string
  label: string
}

export type UserSettingsEntryPoint = 'account' | 'profiles'

export interface FooterActionsProps {
  user: UserInfo

  showAI?: boolean
  showControlCenter?: boolean
  controlCenter?: ReactElement
  showNotifications?: boolean
  showUserInfo?: boolean

  notificationCount?: number

  onAI?: () => void
  onNotificationsClick?: () => void
  onUserClick?: (user: UserInfo, entryPoint?: UserSettingsEntryPoint) => void

  toolbarAction?: ReactNode
  className?: string
}

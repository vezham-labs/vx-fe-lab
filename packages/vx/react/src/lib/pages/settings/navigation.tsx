import { createContext, useContext } from 'react'

export type SettingsSection =
  | 'General'
  | 'Appearance'
  | 'Notifications'
  | 'Account'
  | 'Edit Widgets'
  | 'Edit Controls'
export const SettingsNavigationContext = createContext<
  ((section: SettingsSection) => void) | null
>(null)
export const useSettingsNavigation = () => useContext(SettingsNavigationContext)

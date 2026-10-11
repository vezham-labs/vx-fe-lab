import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore
} from 'react'

import { Moon, Sun } from '@vezham/icons-react'

import { Options } from './options'
import { ActionTile } from './tile'
import type { AppearanceAdapter, ThemeMode } from './types'

const AppearanceContext = createContext<AppearanceAdapter | null>(null)
const subscribeRootAppearance = (onChange: () => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const applyAuto = () => {
    if (document.documentElement.getAttribute('data-theme-mode') === 'auto') {
      document.documentElement.classList.toggle('dark', media.matches)
    }
  }
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme-mode']
  })
  media.addEventListener('change', applyAuto)
  applyAuto()
  return () => {
    observer.disconnect()
    media.removeEventListener('change', applyAuto)
  }
}
const subscribeExternalAppearance = () => () => undefined
const getRootDark = () => document.documentElement.classList.contains('dark')
const getRootAppearance = () => {
  const mode = document.documentElement.getAttribute('data-theme-mode')
  return `${mode === 'auto' ? 'auto' : getRootDark() ? 'dark' : 'light'}:${getRootDark()}`
}
const getServerAppearance = () => 'light:false'
const setRootThemeMode = (mode: ThemeMode) => {
  document.documentElement.setAttribute('data-theme-mode', mode)
  document.documentElement.classList.toggle(
    'dark',
    mode === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : mode === 'dark'
  )
}
const setRootDark = (dark: boolean) => {
  setRootThemeMode(dark ? 'dark' : 'light')
}

export const AppearanceProvider = ({
  appearance,
  children
}: {
  appearance?: AppearanceAdapter
  children: ReactNode
}) => {
  const snapshot = useSyncExternalStore(
    appearance ? subscribeExternalAppearance : subscribeRootAppearance,
    getRootAppearance,
    getServerAppearance
  )
  const [mode, dark] = snapshot.split(':')
  const value = useMemo<AppearanceAdapter>(
    () =>
      appearance ?? {
        isDark: dark === 'true',
        setDark: setRootDark,
        themeMode:
          mode === 'auto' ? 'auto' : dark === 'true' ? 'dark' : 'light',
        setThemeMode: setRootThemeMode
      },
    [appearance, mode, dark]
  )
  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  )
}

export const useAppearance = () => {
  const appearance = useContext(AppearanceContext)
  if (!appearance)
    throw new Error('Appearance tiles must be rendered inside ControlCenter')
  return appearance
}

export const AppearanceToggle = ({ label }: { label?: string }) => {
  const { isDark, setDark } = useAppearance()
  const Icon = isDark ? Moon : Sun
  return (
    <ActionTile
      label={label ?? `Switch to ${isDark ? 'light' : 'dark'} mode`}
      compact
      icon={<Icon size={20} />}
      onPress={() => setDark(!isDark)}
    />
  )
}

export const AppearanceTile = ({
  onOpen,
  label = 'Appearance'
}: {
  label?: string
  onOpen: () => void
}) => {
  const { isDark } = useAppearance()
  const Icon = isDark ? Moon : Sun
  return (
    <ActionTile
      label={label}
      description={isDark ? 'Dark' : 'Light'}
      icon={<Icon size={16} />}
      onPress={onOpen}
    />
  )
}

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
] as const

export const AppearanceSettings = () => {
  const { isDark, themeMode, setDark, setThemeMode } = useAppearance()
  return (
    <Options
      value={themeMode ?? (isDark ? 'dark' : 'light')}
      options={
        setThemeMode ? [...options, { value: 'auto', label: 'Auto' }] : options
      }
      onChange={value => {
        if (
          setThemeMode &&
          (value === 'auto' || value === 'light' || value === 'dark')
        ) {
          setThemeMode(value)
        } else {
          setDark(value === 'dark')
        }
      }}
    />
  )
}

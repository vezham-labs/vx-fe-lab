import { type ReactNode, createContext, useContext, useMemo } from 'react'

export type AppMenuAction = {
  key: string
  label: string
  icon?: string
  shortcut?: string
}

export type AppMenuItem = {
  key: string
  label: string
  icon?: string
  groups: AppMenuAction[][]
}

type Props = {
  children: ReactNode
  items: AppMenuItem[]
  onAction: (action: AppMenuAction) => void
}

const AppMenuContext = createContext<Omit<Props, 'children'> | null>(null)

export const AppMenuProvider = ({ children, items, onAction }: Props) => {
  const value = useMemo(() => ({ items, onAction }), [items, onAction])
  return (
    <AppMenuContext.Provider value={value}>{children}</AppMenuContext.Provider>
  )
}

export const useAppMenu = () => useContext(AppMenuContext)

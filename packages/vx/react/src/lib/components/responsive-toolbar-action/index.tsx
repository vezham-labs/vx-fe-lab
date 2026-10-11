import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

type ResponsiveToolbarActionContextValue = {
  action: ReactNode
  setAction: (action: ReactNode) => void
}

const ResponsiveToolbarActionContext =
  createContext<ResponsiveToolbarActionContextValue>({
    action: null,
    setAction: () => undefined
  })

export const ResponsiveToolbarActionProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [action, setAction] = useState<ReactNode>(null)
  const value = useMemo(() => ({ action, setAction }), [action])

  return (
    <ResponsiveToolbarActionContext.Provider value={value}>
      {children}
    </ResponsiveToolbarActionContext.Provider>
  )
}

export const useResponsiveToolbarAction = () =>
  useContext(ResponsiveToolbarActionContext)

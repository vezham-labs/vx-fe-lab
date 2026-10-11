'use client'

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

export type User = {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
  isOnline?: boolean
}

const defaultUser: User = {
  id: '1',
  firstName: 'Arya',
  lastName: 'Chan',
  email: 'arya.chan@vcorp.com',
  avatar:
    'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg',
  isOnline: true
}

type UserContextType = {
  user: User | null
  setUser: (user: User) => void
  updateUser: (data: Partial<User>) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({
  children,
  initialUser = defaultUser
}: {
  children: ReactNode
  initialUser?: User | null
}) => {
  const [user, setUserState] = useState<User | null>(initialUser)

  const setUser = useCallback((user: User) => setUserState(user), [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUserState(prev => (prev ? { ...prev, ...data } : prev))
  }, [])

  const clearUser = useCallback(() => setUserState(null), [])
  const value = useMemo(
    () => ({ user, setUser, updateUser, clearUser }),
    [clearUser, setUser, updateUser, user]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used inside UserProvider')
  return context
}

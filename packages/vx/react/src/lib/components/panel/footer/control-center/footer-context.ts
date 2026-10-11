import { createContext } from 'react'

export const FooterControlCenterContext = createContext<{
  compact: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

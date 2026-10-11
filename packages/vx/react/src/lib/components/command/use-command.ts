import { createContext, useContext } from 'react'

interface CommandContextValue {
  isOpen: boolean
  openCommand: () => void
  closeCommand: () => void
  toggleCommand: () => void
}

export const CommandContext = createContext<CommandContextValue | null>(null)

export const useCommand = () => {
  const context = useContext(CommandContext)

  if (!context) {
    throw new Error('useCommand must be used within CommandProvider')
  }

  return context
}

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import type { AppNavigationItem } from '../../navigation'
import { CommandPaletteDialog } from './command-dialog'
import { CommandContext } from './use-command'

const CommandProvider = ({
  children,
  items
}: {
  children: ReactNode
  items: AppNavigationItem[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const openCommand = useCallback(() => setIsOpen(true), [])
  const closeCommand = useCallback(() => setIsOpen(false), [])
  const toggleCommand = useCallback(() => {
    setIsOpen(current => !current)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key.toLowerCase() !== 'k' ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return
      }

      event.preventDefault()
      openCommand()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openCommand])

  const value = useMemo(
    () => ({
      isOpen,
      openCommand,
      closeCommand,
      toggleCommand
    }),
    [closeCommand, isOpen, openCommand, toggleCommand]
  )

  return (
    <CommandContext.Provider value={value}>
      {children}
      <CommandPaletteDialog
        isOpen={isOpen}
        items={items}
        onAction={closeCommand}
        onOpenChange={setIsOpen}
      />
    </CommandContext.Provider>
  )
}

export { CommandProvider }

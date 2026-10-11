import { useNavigate } from '@tanstack/react-router'

import { Magnifier as MagnifierIcon } from '@vezham/icons-react'
import { Command } from '@vezham/react-pro-v3'

import type { AppNavigationItem } from '../../navigation'
import { AppIcon } from '../app-icon'

interface Props {
  isOpen: boolean
  items: AppNavigationItem[]
  onOpenChange: (isOpen: boolean) => void
  onAction?: () => void
}

type NavigationCommand = {
  id: string
  label: string
  description: string
  icon: string
  href: string
}

type ActionCommand = {
  id: string
  label: string
  description: string
  icon: string
  action: () => void
}

const DEFAULT_COMMAND_ICON = 'vx:status'

const actionCommands: ActionCommand[] = [
  {
    id: 'go-back',
    label: 'Back',
    description: 'Go to the previous page',
    icon: 'vx:arrow-left',
    action: () => window.history.back()
  },
  {
    id: 'go-forward',
    label: 'Forward',
    description: 'Go to the next page',
    icon: 'vx:arrow-right',
    action: () => window.history.forward()
  },
  {
    id: 'print-page',
    label: 'Print',
    description: 'Print the current page',
    icon: 'vx:printer',
    action: () => window.print()
  },
  {
    id: 'refresh-page',
    label: 'Refresh',
    description: 'Reload the current page',
    icon: 'vx:refresh',
    action: () => window.location.reload()
  }
]

const CommandPaletteDialog = ({
  isOpen,
  items,
  onOpenChange,
  onAction
}: Props) => {
  const navigate = useNavigate()
  const navigationCommands = createNavigationCommands(items)

  const closeCommand = () => {
    onAction?.()
  }

  const runNavigationCommand = (command: NavigationCommand) => {
    navigate({ to: command.href })
    closeCommand()
  }

  const runActionCommand = (command: ActionCommand) => {
    command.action()
    closeCommand()
  }

  return (
    <Command>
      <Command.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="z-80"
        variant="blur">
        <Command.Container size="lg">
          <Command.Dialog>
            <Command.Header>
              <Command.InputGroup>
                <Command.InputGroup.Prefix>
                  <MagnifierIcon size={18} aria-hidden="true" />
                </Command.InputGroup.Prefix>
                <Command.InputGroup.Input placeholder="Search commands..." />
                <Command.InputGroup.ClearButton aria-label="Clear search" />
              </Command.InputGroup>
            </Command.Header>

            <Command.List
              aria-label="Command palette"
              renderEmptyState={() => 'No commands found.'}>
              <Command.Group heading="Navigation">
                {navigationCommands.map(command => (
                  <Command.Item
                    key={command.id}
                    id={command.id}
                    textValue={`${command.label} ${command.description}`}
                    onAction={() => runNavigationCommand(command)}>
                    <CommandItemContent {...command} />
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Separator />

              <Command.Group heading="Actions">
                {actionCommands.map(command => (
                  <Command.Item
                    key={command.id}
                    id={command.id}
                    textValue={`${command.label} ${command.description}`}
                    onAction={() => runActionCommand(command)}>
                    <CommandItemContent {...command} />
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command.Dialog>
        </Command.Container>
      </Command.Backdrop>
    </Command>
  )
}

const createNavigationCommands = (
  items: AppNavigationItem[],
  section?: string
): NavigationCommand[] => {
  return items.flatMap(item => {
    const children = item.submenu ?? item.children
    const command = item.href
      ? [
          {
            id: `navigate-${item.key}`,
            label: item.title,
            description: section ? `${section} - ${item.href}` : item.href,
            icon: item.icon ?? DEFAULT_COMMAND_ICON,
            href: item.href
          }
        ]
      : []

    return [
      ...command,
      ...createNavigationCommands(children ?? [], section ?? item.title)
    ]
  })
}

const CommandItemContent = ({
  label,
  description,
  icon
}: {
  label: string
  description: string
  icon: string
}) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="bg-default-100 text-default-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        <AppIcon icon={icon} size={18} aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground block truncate text-sm leading-5 font-medium">
          {label}
        </span>
        <span className="text-muted block truncate text-xs leading-4">
          {description}
        </span>
      </div>
    </div>
  )
}

export { CommandPaletteDialog }

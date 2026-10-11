import { detectPlatform } from '@tanstack/react-hotkeys'
import { type ComponentProps, useSyncExternalStore } from 'react'

import { Button, Tooltip, cn } from '@vezham/react-v3'

type ShortcutKeyProps = {
  className?: string
  shortcut: string
}

type ShortcutTooltipLabelProps = ShortcutKeyProps & {
  label: string
}

const shortcutGroupClassName =
  'inline-flex min-h-6 items-center gap-1 rounded-lg '

const keycapClassName =
  'inline-flex min-h-5 min-w-5 items-center justify-center rounded-md bg-surface-tertiary px-1.5 text-sm leading-none text-muted hover:text-foreground'

const subscribeToPlatform = () => () => undefined
const getModifierKey = () => (detectPlatform() === 'mac' ? '⌘' : 'Ctrl')
const getServerModifierKey = () => 'Ctrl/⌘'

const ShortcutKey = ({ className, shortcut }: ShortcutKeyProps) => {
  const modifierKey = useSyncExternalStore(
    subscribeToPlatform,
    getModifierKey,
    getServerModifierKey
  )
  const keys = shortcut
    .split(/\s+/)
    .filter(Boolean)
    .map(key => (key === 'Mod' ? modifierKey : key))

  return (
    <span
      aria-label={keys.join(' ')}
      className={cn(shortcutGroupClassName, className)}>
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className={keycapClassName}>
          {key}
        </span>
      ))}
    </span>
  )
}

const ShortcutTooltipLabel = ({
  className,
  label,
  shortcut
}: ShortcutTooltipLabelProps) => {
  return (
    <span
      className={cn('flex items-center gap-2 whitespace-nowrap', className)}>
      <span>{label}</span>
      <ShortcutKey shortcut={shortcut} />
    </span>
  )
}

type ShortcutButtonProps = ComponentProps<typeof Button> & {
  label: string
  shortcut: string
}

const ShortcutButton = ({
  label,
  shortcut,
  children,
  ...props
}: ShortcutButtonProps) => (
  <Tooltip delay={0}>
    <Button isIconOnly variant="ghost" size="sm" {...props} aria-label={label}>
      {children}
    </Button>
    <Tooltip.Content>
      <ShortcutTooltipLabel label={label} shortcut={shortcut} />
    </Tooltip.Content>
  </Tooltip>
)

export { ShortcutButton, ShortcutKey, ShortcutTooltipLabel }

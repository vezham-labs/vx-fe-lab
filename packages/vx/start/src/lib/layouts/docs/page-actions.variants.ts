import { tv } from '@vezham/react-v3'

export const pageActionsVariants = tv({
  slots: {
    root: 'flex flex-wrap items-center justify-end gap-2',
    chevron: 'text-muted transition-transform',
    icon: 'mt-0.5 shrink-0',
    itemContent: 'flex min-w-0 flex-1 flex-col',
    description: 'text-muted text-xs',
    externalIcon: 'text-muted',
    error: 'text-danger w-full text-sm'
  },
  variants: { open: { true: { chevron: 'rotate-180' } } },
  defaultVariants: { open: false }
})

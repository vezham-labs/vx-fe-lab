import { type VariantProps, tv } from '@vezham/react-v3'

const tva = tv({
  slots: {
    grid: 'relative grid w-full min-w-0 grid-cols-4 gap-2 outline-none data-[empty]:block @min-[24rem]/info-panel:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] [&_.react-aria-DropIndicator]:absolute [&_.react-aria-DropIndicator]:size-0 [&_.react-aria-DropIndicator]:overflow-hidden',
    item: 'group bg-default/50 hover:bg-default data-[selected]:bg-accent/10 relative flex min-w-0 items-center justify-center rounded-lg outline-none data-[focus-visible]:ring-2',
    itemDragging:
      'bg-accent/5 ring-accent/40 cursor-grabbing ring-1 ring-inset [&_[data-slot=favorite-tile-content]]:opacity-0',
    itemDropTarget: 'bg-accent-soft ring-accent ring-2 ring-inset',
    dragButton:
      'focus:outline-focus sr-only focus:not-sr-only focus:absolute focus:inset-0 focus:z-10 focus:rounded-lg focus:outline-2',
    backgroundImage: 'absolute inset-0 h-full w-full object-cover',
    backgroundFallback: 'absolute inset-0 bg-gradient-to-br',
    overlay:
      'absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent',
    avatarContainer:
      'pointer-events-none flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit]',
    avatar: 'h-full w-full rounded-lg',
    avatarFallback: 'text-muted bg-transparent text-xs font-medium',
    avatarIcon: 'text-warning',
    content: 'absolute right-0 bottom-0 left-0',
    name: 'line-clamp-2 leading-tight text-white',
    emptyState: 'col-span-full w-full'
  },
  variants: {
    variant: {
      default: {
        item: 'data-[focus-visible]:ring-focus',
        itemDropTarget: 'ring-accent',
        backgroundFallback: 'from-default-200 to-default-300',
        avatarFallback: 'bg-transparent'
      },
      subtle: {
        item: 'bg-default/30 data-[focus-visible]:ring-focus',
        itemDropTarget: 'ring-accent',
        backgroundFallback: 'from-default-100 to-default-300',
        avatarFallback: 'bg-transparent'
      },
      glass: {
        item: 'data-[focus-visible]:ring-focus bg-white/10 hover:bg-white/20',
        itemDropTarget: 'ring-accent',
        backgroundFallback: 'from-white/30 to-white/10',
        avatarFallback: 'bg-transparent'
      }
    },
    size: {
      sm: {
        grid: '[--favorite-tile-height:2.5rem]',
        item: 'h-10',
        content: 'p-1.5',
        name: 'text-[10px]',
        avatarContainer: ''
      },
      md: {
        grid: '[--favorite-tile-height:3rem]',
        item: 'h-12',
        content: 'p-2',
        name: 'text-xs',
        avatarContainer: ''
      },
      lg: {
        grid: '[--favorite-tile-height:3.5rem]',
        item: 'h-14',
        content: 'p-2.5',
        name: 'text-sm',
        avatarContainer: ''
      }
    },
    isInteractive: {
      true: {
        item: 'cursor-pointer data-[dragging]:cursor-grabbing'
      },
      false: {
        item: 'cursor-default'
      }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    isInteractive: true
  }
})

type tvProps = VariantProps<typeof tva>
type tvSlots = keyof ReturnType<typeof tva>

export { tva }
export type { tvProps, tvSlots }

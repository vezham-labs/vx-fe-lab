import { type VariantProps, tv } from '@vezham/react-v3'

const tva = tv({
  slots: {
    base: 'flex h-full flex-col overflow-hidden',
    scroll: 'flex min-h-0 flex-1 flex-col overflow-y-auto',
    container: 'flex flex-col',
    align: 'flex flex-col items-center',
    item: 'cursor-pointer',
    icon_wrapper: 'flex h-[28px] w-[28px] items-center justify-center',
    icon: 'text-muted transition-colors',
    tooltip_trigger: 'flex h-[28px] w-[28px] items-center justify-center',
    tooltip_content: '',
    label: 'text-muted w-full truncate text-center text-sm transition-colors'
  },
  variants: {
    variant: {
      default: {
        base: '',
        icon: 'text-muted',
        label: 'text-muted'
      },
      primary: {
        icon: 'text-primary',
        label: 'text-primary font-medium'
      },
      muted: {
        icon: 'text-muted-foreground',
        label: 'text-muted-foreground'
      }
    },
    size: {
      sm: {
        icon_wrapper: 'h-[24px] w-[24px]',
        icon: 'h-5 w-5',
        label: 'text-xs'
      },
      md: {
        icon_wrapper: 'h-[28px] w-[28px]',
        icon: 'h-5 w-5',
        label: 'text-sm'
      },
      lg: {
        icon_wrapper: 'h-[32px] w-[32px]',
        icon: 'h-5 w-5',
        label: 'text-base'
      }
    },
    spacing: {
      compact: {
        container: 'gap-2',
        item: 'mb-0'
      },
      normal: {
        container: 'gap-2',
        item: 'mb-1'
      },
      spacious: {
        container: 'gap-6',
        item: 'mb-2'
      }
    },
    collapsed: {
      true: {
        container: 'gap-2',
        label: 'hidden'
      },
      false: {
        label: 'block'
      }
    },
    itemRadius: {
      none: { item: 'rounded-none' },
      sm: { item: 'rounded-sm' },
      md: { item: 'rounded-md' },
      lg: { item: 'rounded-lg' },
      full: { item: 'rounded-full' }
    }
  },
  compoundVariants: [
    {
      variant: 'default',
      class: {
        icon: 'data-[active=true]:text-foreground',
        label:
          'data-[active=true]:text-foreground data-[active=true]:font-medium'
      }
    },
    {
      variant: 'primary',
      class: {
        icon: 'data-[active=true]:text-primary',
        label: 'data-[active=true]:text-primary data-[active=true]:font-medium'
      }
    },
    {
      variant: 'muted',
      class: {
        icon: 'data-[active=true]:text-foreground',
        label:
          'data-[active=true]:text-foreground data-[active=true]:font-medium'
      }
    },
    {
      collapsed: true,
      spacing: 'normal',
      class: {
        container: 'gap-3'
      }
    },
    {
      class: {
        item: 'hover:bg-default/20'
      }
    },
    {
      collapsed: true,
      size: 'sm',
      class: {
        icon_wrapper: 'h-[20px] w-[20px]'
      }
    },
    {
      collapsed: true,
      size: 'md',
      class: {
        icon_wrapper: 'h-[24px] w-[24px]'
      }
    },
    {
      collapsed: true,
      size: 'lg',
      class: {
        icon_wrapper: 'h-[28px] w-[28px]'
      }
    }
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    spacing: 'normal',
    collapsed: false,
    itemRadius: 'md'
  }
})

type tvProps = VariantProps<typeof tva>
type tvSlots = keyof ReturnType<typeof tva>

export { tva }
export type { tvProps, tvSlots }

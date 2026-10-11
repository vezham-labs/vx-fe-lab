import { VariantProps, tv } from '@vezham/react-v3'

const tva = tv({
  slots: {
    // vx-bot/INFO: Main Drawer slots
    drawer_base:
      'z-80 max-w-[384px] rounded-none border-none bg-transparent shadow-none md:translate-x-[106px]',
    drawer_wrapper:
      'z-80 duration-180 ease-out data-[exiting=true]:duration-150 data-[exiting=true]:ease-out',
    drawer_content:
      'w-full border-0 bg-transparent p-0 shadow-none [--drawer-enter-duration:180ms] [--drawer-enter-ease:cubic-bezier(0,0,0.58,1)] [--drawer-exit-duration:150ms] [--drawer-exit-ease:cubic-bezier(0,0,0.58,1)]',

    // vx-bot/INFO: Header slots
    drawer_header: 'flex shrink-0 flex-row items-center justify-between gap-2',
    header_title:
      'text-foreground min-w-0 flex-1 truncate text-base font-semibold',
    close_button: 'static shrink-0',

    // vx-bot/INFO: Body slots
    drawer_body: 'flex min-h-0 flex-1 flex-col overflow-hidden',
    scroll_shadow: 'min-h-0 flex-1 overflow-y-auto overscroll-contain',
    empty_state:
      'flex min-h-[320px] flex-col items-center justify-center text-center',
    empty_state_icon: 'text-muted',

    // vx-bot/INFO: Footer slots
    drawer_footer: 'flex shrink-0 items-center justify-center',
    chip: 'rounded-full'
  },
  variants: {
    variant: {
      default: {
        drawer_content: 'bg-black/5',
        drawer_header: 'text-white/90',
        header_title: '',
        chip: ''
      },
      dark: {
        drawer_content: 'bg-surface/80',
        drawer_header: 'text-white/70',
        header_title: '',
        chip: ''
      },
      light: {
        drawer_content: 'bg-surface/80',
        drawer_header: 'text-black/90',
        header_title: '',
        chip: ''
      },
      glass: {
        drawer_content: 'bg-surface/60 backdrop-blur-xl',
        drawer_header: 'text-white',
        header_title: '',
        chip: ''
      }
    },
    placement: {
      left: {
        drawer_base: 'max-w-[384px] md:translate-x-[106px]'
      },
      right: {
        drawer_base: 'max-w-[384px] md:-translate-x-[106px]'
      },
      top: {
        drawer_base: 'max-h-[384px] max-w-full md:translate-y-[106px]'
      },
      bottom: {
        drawer_base: 'max-h-[384px] max-w-full md:-translate-y-[106px]'
      }
    },
    size: {
      sm: {
        drawer_base: 'max-w-[320px] md:translate-x-[80px]',
        drawer_header: 'p-3',
        header_title: 'text-base',
        drawer_body: 'p-3',
        drawer_footer: 'p-3'
      },
      md: {
        drawer_base: 'max-w-[384px] md:translate-x-[106px]',
        drawer_header: 'p-4',
        header_title: 'text-base',
        drawer_body: 'p-4',
        drawer_footer: 'p-4'
      },
      lg: {
        drawer_base: 'max-w-[560px] md:translate-x-[133px]',
        drawer_header: 'p-5',
        header_title: 'text-xl',
        drawer_body: 'p-5',
        drawer_footer: 'p-5'
      }
    },
    blur: {
      none: {
        drawer_content: 'backdrop-blur-none'
      },
      sm: {
        drawer_content: 'backdrop-blur-sm'
      },
      md: {
        drawer_content: 'backdrop-blur-md'
      },
      lg: {
        drawer_content: 'backdrop-blur-lg'
      },
      xl: {
        drawer_content: 'backdrop-blur-xl'
      }
    },
    border: {
      none: {
        drawer_content: 'border-none'
      },
      subtle: {
        drawer_content: 'border border-white/10'
      },
      prominent: {
        drawer_content: 'border-2 border-white/20'
      }
    }
  },
  compoundVariants: [
    {
      placement: 'left',
      class: {
        drawer_base: 'left-0 rounded-r-none'
      }
    },
    {
      placement: 'right',
      class: {
        drawer_base: 'right-0 rounded-l-none'
      }
    },
    {
      placement: 'top',
      class: {
        drawer_base: 'top-0 rounded-b-none'
      }
    },
    {
      placement: 'bottom',
      class: {
        drawer_base: 'bottom-0 rounded-t-none'
      }
    },
    {
      variant: 'glass',
      blur: 'xl',
      class: {
        drawer_content: 'bg-white/20'
      }
    }
  ],
  defaultVariants: {
    variant: 'default',
    placement: 'left',
    size: 'md',
    blur: 'lg',
    border: 'none'
  }
})

type tvProps = VariantProps<typeof tva>
type tvSlots = keyof ReturnType<typeof tva>

export { tva }
export type { tvProps, tvSlots }

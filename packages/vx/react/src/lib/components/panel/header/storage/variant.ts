import { VariantProps, tv } from '@vezham/react-v3'

const tva = tv({
  slots: {
    tabs: 'w-fit max-w-full',
    tabs_list_container: 'w-fit max-w-full rounded-full',
    tabs_list: 'flex min-w-max flex-nowrap *:whitespace-nowrap',
    tab_archive: '',
    tab_trash: '',
    tab_indicator: '',

    container: 'flex min-h-0 flex-1 flex-col',

    search_input: 'w-full',
    search_input_wrapper: '',
    search_icon: 'text-muted',

    actions_bar: 'text-muted mt-2 flex justify-end',
    actions_bar_with_gap: 'text-muted mt-2 flex justify-end gap-2',

    clear_all_button: '',
    restore_all_button: '',

    empty_container:
      'flex h-full min-h-[320px] flex-col items-center justify-center gap-4 text-center',
    empty_icon: 'text-muted',
    empty_title: 'text-xl font-semibold',
    empty_description: 'text-muted max-w-[220px]',

    items_container: 'space-y-4 pb-6',
    date_group: '',
    date_header: 'mb-2 flex items-center gap-2',
    date_label: 'text-muted text-xs font-medium',
    date_divider: 'bg-separator h-px flex-1',
    items_list: 'space-y-1',

    item: 'group hover:bg-default focus-within:bg-default relative flex w-full items-center gap-2 rounded-2xl px-2 py-2',
    item_favicon: 'size-4 shrink-0 rounded-sm object-contain',
    item_fallback_icon: 'text-muted shrink-0',
    item_content: 'flex min-w-0 flex-1 flex-col gap-0.5',
    item_title: 'block truncate text-sm leading-5 font-medium',
    item_url: 'text-muted block truncate text-xs leading-4',

    item_actions:
      'hidden shrink-0 items-center gap-1 group-focus-within:flex group-hover:flex',

    unarchive_button:
      'rounded-md p-1.5 transition-colors hover:bg-transparent data-[hovered=true]:bg-transparent',
    restore_button:
      'rounded-md p-1.5 transition-colors hover:bg-transparent data-[hovered=true]:bg-transparent',
    delete_button:
      'text-muted hover:text-danger focus-visible:text-danger rounded-md p-1.5 transition-colors hover:bg-transparent data-[hovered=true]:bg-transparent',
    delete_permanent_button:
      'text-muted hover:text-danger focus-visible:text-danger rounded-md p-1.5 transition-colors hover:bg-transparent data-[hovered=true]:bg-transparent',

    action_icon: '',
    action_icon_success: 'text-success',
    action_icon_danger: 'text-inherit',
    action_icon_default: 'text-muted'
  },
  variants: {
    variant: {
      default: {
        search_input_wrapper: '',
        item: 'hover:bg-default'
      },
      dark: {
        search_input_wrapper: '',
        item: 'hover:bg-default'
      },
      light: {
        search_input_wrapper: '',
        item: 'hover:bg-default'
      },
      glass: {
        search_input_wrapper: 'bg-white/10',
        item: 'hover:bg-white/20'
      }
    },
    size: {
      sm: {
        empty_icon: 'w-12',
        empty_title: 'text-lg',
        empty_description: 'max-w-[180px] text-xs',
        item: 'px-1 py-1.5',
        item_title: 'text-xs',
        item_url: 'text-[10px]',
        item_actions: 'gap-0.5',
        unarchive_button: 'p-1',
        delete_button: 'p-1'
      },
      md: {
        empty_icon: 'w-16',
        empty_title: 'text-xl',
        empty_description: 'max-w-[220px] text-sm',
        item: 'px-2 py-2',
        item_title: 'text-sm',
        item_url: 'text-xs',
        item_actions: 'gap-1',
        unarchive_button: 'p-1.5',
        delete_button: 'p-1.5'
      },
      lg: {
        empty_icon: 'w-20',
        empty_title: 'text-2xl',
        empty_description: 'max-w-[280px] text-base',
        item: 'px-3 py-2.5',
        item_title: 'text-base',
        item_url: 'text-sm',
        item_actions: 'gap-1.5',
        unarchive_button: 'p-2',
        delete_button: 'p-2'
      }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

type tvProps = VariantProps<typeof tva>
type tvSlots = keyof ReturnType<typeof tva>

export { tva }
export type { tvProps, tvSlots }

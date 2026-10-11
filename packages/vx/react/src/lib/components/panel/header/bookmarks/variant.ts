import { VariantProps, tv } from '@vezham/react-v3'

const tva = tv({
  slots: {
    search_container: 'mt-6',
    search_input: 'w-full',
    search_input_wrapper: 'bg-default-100/50',
    search_icon: 'text-default-400',

    scroll_shadow: 'h-full',

    empty_container:
      'flex h-[60vh] flex-col items-center justify-center gap-4 text-center',
    empty_icon: 'text-default-400',
    empty_title: 'text-xl font-semibold',
    empty_description: 'text-default-500 max-w-[220px]',

    content_container: 'space-y-2 pb-6 @min-[24rem]/info-panel:space-y-6',

    section: '',
    section_header: 'my-3 flex items-center gap-2',
    section_icon: '',
    section_title: 'text-default-500 text-sm tracking-wider uppercase',

    // vx-bot/INFO: Grid 1: Flex wrap (multiple rows)
    favorites_grid: 'flex flex-wrap gap-3',
    favorite_item:
      'group relative flex aspect-square w-[calc(30%-5px)] cursor-grab flex-col overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] active:cursor-grabbing',

    // vx-bot/INFO: Grid 2: Horizontal scroll (single row)
    favorites_grid2: 'flex flex-nowrap gap-3 overflow-x-auto pb-2',
    favorite_item2:
      'group relative flex aspect-square w-[120px] shrink-0 cursor-grab flex-col overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] active:cursor-grabbing',

    favorite_background_image: 'absolute inset-0 h-full w-full object-cover',
    favorite_background_gradient:
      'from-default-200 to-default-300 absolute inset-0 bg-gradient-to-br',
    favorite_overlay:
      'absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent',
    favorite_avatar_container: 'absolute top-2 left-2',
    favorite_avatar: 'ring-2 ring-white/20',
    favorite_avatar_icon: 'text-warning',
    favorite_avatar_fallback: 'bg-default-500 text-white',
    favorite_content: 'absolute right-0 bottom-0 left-0 p-2',
    favorite_name: 'line-clamp-2 text-xs leading-tight text-white',

    bookmarks_list: 'space-y-1',
    bookmark_item:
      'hover:bg-default-100 flex w-full cursor-grab items-center gap-3 rounded-lg py-2 transition-colors active:cursor-grabbing',
    bookmark_avatar: 'shrink-0',
    bookmark_avatar_fallback: 'bg-default-500 text-white',
    bookmark_content: 'flex-1 text-left',
    bookmark_name: 'text-sm text-black',
    bookmark_url: 'text-default-500 text-xs',
    bookmark_arrow: 'text-default-400',
    bookmark_delete_button: 'opacity-0 group-hover:opacity-100',
    file_tree:
      '[&_[data-slot=file-tree-drag-handle]:focus-visible]:outline-focus! [&_[data-slot=file-tree-item]:hover]:bg-default! [&_[data-slot=file-tree-item][data-drop-target]]:bg-accent-soft! [&_[data-slot=file-tree-item][data-drop-target]]:outline-accent/40! [&_.react-aria-DropIndicator[data-drop-target]]:bg-accent! max-h-[calc(100vh-96px)] w-full min-w-0 gap-0.5 p-0 [--file-tree-chevron-offset:0px]! [--file-tree-indent:1rem] [--file-tree-item-px:0rem] data-[empty]:block! data-[empty]:min-h-0! data-[empty]:py-0! data-[empty]:text-left! data-[empty]:not-italic! [&_.react-aria-DropIndicator[data-drop-target]]:h-0.5! [&_.react-aria-DropIndicator[data-drop-target]]:rounded-full! [&_.react-aria-DropIndicator[data-drop-target]]:outline-none! [&_[data-slot=file-tree-drag-handle]]:pointer-events-none! [&_[data-slot=file-tree-drag-handle]]:absolute! [&_[data-slot=file-tree-drag-handle]]:end-8! [&_[data-slot=file-tree-drag-handle]]:size-7! [&_[data-slot=file-tree-drag-handle]]:rounded-md! [&_[data-slot=file-tree-drag-handle]]:opacity-0! [&_[data-slot=file-tree-drag-handle]]:transition-none! [&_[data-slot=file-tree-drag-handle]_svg]:size-4! [&_[data-slot=file-tree-drag-handle]:focus-visible]:opacity-100! [&_[data-slot=file-tree-drag-handle]:focus-visible]:outline-2! [&_[data-slot=file-tree-drag-handle]:hover]:bg-transparent! [&_[data-slot=file-tree-drag-handle]:hover]:opacity-100! [&_[data-slot=file-tree-icon]]:h-4 [&_[data-slot=file-tree-icon]]:w-4 [&_[data-slot=file-tree-item-content]]:min-h-7 [&_[data-slot=file-tree-item-content]]:min-w-0 [&_[data-slot=file-tree-item-content]]:gap-2 [&_[data-slot=file-tree-item-content]]:rounded-md [&_[data-slot=file-tree-item-content]]:pe-1 [&_[data-slot=file-tree-item]]:ring-inset [&_[data-slot=file-tree-item]:has(:focus-visible)_[data-slot=file-tree-drag-handle]]:pointer-events-auto! [&_[data-slot=file-tree-item]:has(:focus-visible)_[data-slot=file-tree-drag-handle]]:opacity-60! [&_[data-slot=file-tree-item]:hover_[data-slot=file-tree-drag-handle]]:pointer-events-auto! [&_[data-slot=file-tree-item]:hover_[data-slot=file-tree-drag-handle]]:opacity-60! [&_[data-slot=file-tree-item][data-drop-target]]:outline-1! [&_[data-slot=file-tree-item][data-focus-visible]_[data-slot=file-tree-drag-handle]]:pointer-events-auto! [&_[data-slot=file-tree-item][data-focus-visible]_[data-slot=file-tree-drag-handle]]:opacity-60! [&_[data-slot=file-tree-label]]:flex [&_[data-slot=file-tree-label]]:min-w-0 [&_[data-slot=file-tree-label]]:flex-1 [&_[slot=chevron]]:cursor-pointer! [&_[slot=chevron]:hover]:bg-transparent! [@media(hover:none)]:[&_[data-slot=file-tree-drag-handle]]:pointer-events-auto! [@media(hover:none)]:[&_[data-slot=file-tree-drag-handle]]:opacity-60!',
    bookmark_tree_empty_state: 'w-full',

    folder_section: 'mt-6',
    folder_accordion: 'px-0',
    folder_item: 'border-default-200 border-b px-0',
    folder_heading: '',
    folder_trigger: 'cursor-grab py-2 active:cursor-grabbing',
    folder_trigger_content: 'flex items-center gap-2',
    folder_icon: '',
    folder_name: 'text-black',
    folder_count: 'text-default-400 text-xs',
    folder_indicator: '',
    folder_panel: '',
    folder_body: 'space-y-1 px-0 pb-2'
  },
  variants: {
    variant: {
      default: {
        search_input_wrapper: 'bg-default-100/50',
        bookmark_item: 'hover:bg-default-100',
        folder_item: 'border-default-200'
      },
      dark: {
        search_input_wrapper: 'bg-default-800/50',
        bookmark_item: 'hover:bg-default-800',
        folder_item: 'border-default-700'
      },
      light: {
        search_input_wrapper: 'bg-default-50/50',
        bookmark_item: 'hover:bg-default-50',
        folder_item: 'border-default-100'
      },
      glass: {
        search_input_wrapper: 'bg-white/10',
        bookmark_item: 'hover:bg-white/20',
        folder_item: 'border-white/20'
      }
    },
    size: {
      sm: {
        empty_icon: 'w-12',
        empty_title: 'text-lg',
        empty_description: 'max-w-[180px] text-xs',
        favorite_item: 'w-[calc(23%-5px)]',
        favorite_item2: 'w-[100px]',
        favorite_name: 'text-[10px]',
        bookmark_name: 'text-xs',
        bookmark_url: 'text-[10px]',
        folder_name: 'text-sm'
      },
      md: {
        empty_icon: 'w-16',
        empty_title: 'text-xl',
        empty_description: 'max-w-[220px] text-sm',
        favorite_item: 'w-[calc(23%-5px)]',
        favorite_item2: 'w-[120px]',
        favorite_name: 'text-xs',
        bookmark_name: 'text-sm',
        bookmark_url: 'text-xs',
        folder_name: ''
      },
      lg: {
        empty_icon: 'w-20',
        empty_title: 'text-2xl',
        empty_description: 'max-w-[280px] text-base',
        favorite_item: 'w-[calc(23%-5px)]',
        favorite_item2: 'w-[140px]',
        favorite_name: 'text-sm',
        bookmark_name: 'text-base',
        bookmark_url: 'text-sm',
        folder_name: 'text-lg'
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

import { tv } from '@vezham/react-v3'

export const controlCenterVariants = tv({
  slots: {
    surface:
      'border-border/70 dark:border-border/80 relative w-72 overflow-hidden rounded-[1.75rem] border p-2 shadow-2xl ring-1 ring-white/15 backdrop-blur-2xl',
    triggerIcon: 'text-muted',
    backdrop: 'bg-overlay/10 z-80 backdrop-blur-xs',
    sheetContent: 'mx-auto max-h-[85dvh] w-full max-w-72',
    sheetHeader: 'px-6 pt-0 pb-2',
    sheetHeading: 'text-base font-semibold',
    content:
      'relative flex max-h-[min(40rem,calc(100dvh-8rem))] min-h-0 flex-col overflow-hidden',
    edgeHighlight:
      'pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/55 to-transparent dark:via-white/25',
    surfaceHighlight:
      'pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white/15 to-transparent dark:from-white/8',
    panelHeader: 'flex items-center gap-2 px-1 pt-1 pb-2',
    panelTitle: 'text-sm font-semibold capitalize',
    panelBody: 'p-1',
    home: 'grid grid-cols-4 items-center gap-x-2 gap-y-3',
    tileContainer: 'min-w-0',
    optionsList: 'flex flex-col gap-1',
    colorSettings: 'flex flex-col gap-3',
    colorLabel: 'text-muted text-xs',
    colorPicker: 'gap-3',
    colorOption: 'min-h-11 min-w-11',
    viewport: 'min-h-0 flex-1 overflow-y-auto overscroll-contain',
    previewNotice: 'text-muted mb-3 px-2 pt-1 text-xs',
    previewSettings: 'flex flex-col gap-4',
    previewToggle: 'flex w-full items-center justify-between gap-3 text-sm',
    previewHint: 'text-muted text-xs',
    previewTile: 'bg-default-hover flex flex-col gap-3 rounded-2xl p-3',
    previewHeader: 'flex items-center gap-2 [&>button]:ms-auto',
    previewTitle: 'text-sm font-medium',
    mediaControls: 'flex items-center justify-center gap-2',
    connectionIcon: 'text-muted'
  },
  variants: {
    active: { true: { connectionIcon: 'text-accent' }, false: {} },
    span: {
      compact: {
        tileContainer:
          'col-span-1 aspect-square w-full overflow-hidden [&>button]:size-full [&>button>span>span:last-child]:hidden'
      },
      standard: { tileContainer: 'col-span-2 min-w-0 [&>button]:w-full' },
      wide: { tileContainer: 'col-span-3 min-w-0 [&>button]:w-full' },
      full: { tileContainer: 'col-span-4 min-w-0 [&>button]:w-full' }
    },
    presentation: {
      popover: { surface: 'bg-transparent' },
      sheet: {
        surface:
          'bg-surface/75 dark:bg-surface/65 flex max-h-[85dvh] w-full flex-col rounded-b-none p-0',
        content:
          'max-h-[min(40rem,calc(85dvh-7rem))] px-6 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))]'
      }
    }
  },
  defaultVariants: { presentation: 'popover' }
})

export const controlCenterTileVariants = tv({
  slots: {
    button: 'bg-default-hover hover:bg-surface rounded-full',
    content: 'flex min-w-0 items-center gap-2',
    icon: 'bg-surface flex size-10 shrink-0 items-center justify-center rounded-full border shadow-sm',
    text: 'flex min-w-0 flex-col',
    title: 'truncate text-sm font-medium',
    description: 'text-muted truncate text-xs'
  },
  variants: {
    selected: {
      true: {
        button: 'bg-accent/10',
        icon: 'bg-accent text-accent-foreground'
      },
      false: {}
    },
    compact: {
      true: { button: 'size-14 shrink-0' },
      false: {
        button:
          'h-auto min-h-14 items-center justify-between px-3 py-2.5 text-start'
      }
    }
  },
  defaultVariants: { compact: false }
})

export const optionTileVariants = tv({
  base: 'h-auto w-full justify-start rounded-lg px-3 py-2 text-start text-sm font-normal transition-colors',
  variants: {
    selected: {
      true: 'bg-primary/10 text-primary',
      false: 'hover:bg-surface text-muted hover:text-foreground'
    }
  },
  defaultVariants: { selected: false }
})

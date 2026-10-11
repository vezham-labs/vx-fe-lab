import { cn } from '@vezham/react-v3'

export const getNavbarContainerClasses = ({
  bgColorClass = '',
  isDarkMode = false
}: {
  bgColorClass?: string
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'pointer-events-none fixed bottom-0 z-75 flex w-full md:hidden',
      'pt-4 pr-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-3',
      bgColorClass,
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getNavbarMenuContainerClasses = ({
  isDarkMode = false
}: {
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'pointer-events-auto flex inline-flex items-center gap-4 rounded-full p-2 px-4 shadow-xl',
      isDarkMode
        ? 'bg-white/5 dark:backdrop-blur-md'
        : 'bg-white backdrop-blur-md'
    ) ?? ''
  )
}

export const getNavbarButtonClasses = ({
  isSelected = false,
  textColorClass = 'text-gray-500',
  isDarkMode = false
}: {
  isSelected?: boolean
  textColorClass?: string
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'flex flex-col items-center gap-2 text-xs font-medium transition-colors duration-200 focus:outline-none',
      isSelected
        ? isDarkMode
          ? 'text-foreground font-medium'
          : 'text-foreground font-medium'
        : textColorClass,
      'hover:text-foreground'
    ) ?? ''
  )
}

export const getNavbarIconClasses = ({
  isSelected = false,
  isDarkMode = false
}: {
  isSelected?: boolean
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      isSelected
        ? isDarkMode
          ? 'text-foreground'
          : 'text-foreground'
        : isDarkMode
          ? 'text-muted'
          : 'text-muted',
      'group-hover:text-foreground'
    ) ?? ''
  )
}

export const getSearchButtonClasses = ({
  isDarkMode = false,
  hasPrimaryAction = false
}: {
  isDarkMode?: boolean
  hasPrimaryAction?: boolean
}): string => {
  return (
    cn(
      'pointer-events-auto fixed right-3 flex h-11 w-11 items-center justify-center rounded-full shadow-xl',
      hasPrimaryAction
        ? 'bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.25rem)]'
        : 'bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+0.5rem)]',
      isDarkMode
        ? 'bg-white/5 text-gray-300 hover:bg-white/20 dark:backdrop-blur-md'
        : 'hover:bg-default/20 bg-white text-gray-500 backdrop-blur-md'
    ) ?? ''
  )
}

export const getDrawerButtonClasses = ({
  isSelected = false,
  isDarkMode = false
}: {
  isSelected?: boolean
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'h-auto min-h-11 w-full min-w-0 justify-start rounded-lg px-3 py-3 text-start text-sm transition-none',
      isSelected
        ? 'bg-accent/10 text-accent font-semibold'
        : isDarkMode
          ? 'text-gray-400'
          : 'text-gray-500'
    ) ?? ''
  )
}

export const getDrawerListClasses = (): string => {
  return cn('flex min-w-0 flex-col gap-1') ?? ''
}

export const getDrawerItemInnerClasses = (buttonTextColor: string): string => {
  return cn('flex w-full min-w-0 items-center gap-3', buttonTextColor) ?? ''
}

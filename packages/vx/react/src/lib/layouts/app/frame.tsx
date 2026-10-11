import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Surface, cn } from '@vezham/react-v3'

export type AppFrameProps = {
  children: ReactNode
  contentClassName?: string
  navigation?: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

export const AppFrame = ({
  children,
  className,
  contentClassName,
  navigation,
  ...props
}: AppFrameProps) => {
  return (
    <Surface
      variant="transparent"
      data-vx="app-layout"
      className={cn(
        'bg-background flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden md:flex-row',
        className
      )}
      {...props}>
      {navigation}
      <main
        data-slot="app-layout-content"
        className={cn(
          'min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-18 pb-20 transition-transform duration-300 ease-out md:p-0',
          contentClassName
        )}>
        {children}
      </main>
    </Surface>
  )
}

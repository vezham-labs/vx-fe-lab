import type { ReactElement, ReactNode } from 'react'

import { Sheet } from '@vezham/react-pro-v3'

type Props = {
  title: string
  hideTitle?: boolean
  isDarkMode?: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger?: ReactElement<{ onPress?: () => void }>
  children: ReactNode
}

export const MenuSheet = ({
  title,
  hideTitle = false,
  isDarkMode = false,
  isOpen,
  onOpenChange,
  trigger,
  children
}: Props) => (
  <Sheet
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    placement="bottom"
    isHandleOnly
    shouldAutoFocus>
    {trigger && <Sheet.Trigger>{trigger}</Sheet.Trigger>}
    <Sheet.Backdrop
      variant="blur"
      className="bg-overlay/10 z-80 backdrop-blur-xs">
      <Sheet.Content className="mx-auto max-h-[85dvh] w-full max-w-sm">
        <Sheet.Dialog
          className={`bg-surface/90 border-border relative flex max-h-[85dvh] flex-col overflow-hidden rounded-t-[1.75rem] border shadow-2xl backdrop-blur-2xl ${isDarkMode ? 'dark' : ''}`}>
          <Sheet.Handle />
          <Sheet.CloseTrigger aria-label={`Close ${title}`} />
          {hideTitle ? (
            <Sheet.Heading className="sr-only">{title}</Sheet.Heading>
          ) : (
            <Sheet.Header className="px-4 pt-0 pb-2">
              <Sheet.Heading className="text-base font-semibold">
                {title}
              </Sheet.Heading>
            </Sheet.Header>
          )}
          <Sheet.Body
            className={`max-h-[calc(85dvh-6rem)] min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] ${hideTitle ? 'pt-6' : 'pt-2'}`}>
            {children}
          </Sheet.Body>
        </Sheet.Dialog>
      </Sheet.Content>
    </Sheet.Backdrop>
  </Sheet>
)

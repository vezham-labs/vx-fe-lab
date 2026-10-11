import type { ComponentProps, ReactNode } from 'react'

import { ScrollShadow } from '@vezham/react-v3'

export const StorageHistoryShell = ({
  search,
  actions,
  containerProps,
  children
}: {
  search: ReactNode
  actions?: ReactNode
  containerProps: ComponentProps<'div'>
  children: ReactNode
}) => (
  <div className="flex min-h-0 flex-1 flex-col">
    <div className="shrink-0 px-1 pt-1 pb-3">
      {search}
      {actions}
    </div>
    <div {...containerProps}>
      <ScrollShadow hideScrollBar className="h-full">
        {children}
      </ScrollShadow>
    </div>
  </div>
)

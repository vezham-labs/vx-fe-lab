import type { ReactNode } from 'react'

import { Drawer } from '@vezham/react-v3'

export const FooterDrawerFrame = ({
  isOpen,
  onClose,
  backdrop,
  placement,
  wrapperClassName,
  contentClassName,
  dialogClassName,
  children
}: {
  isOpen: boolean
  onClose: () => void
  backdrop: 'transparent' | 'blur' | 'opaque'
  placement: 'left' | 'right' | 'top' | 'bottom'
  wrapperClassName: string
  contentClassName: string
  dialogClassName: string
  children: ReactNode
}) => (
  <Drawer.Backdrop
    isOpen={isOpen}
    onOpenChange={open => !open && onClose()}
    variant={backdrop}
    className={wrapperClassName}>
    <Drawer.Content placement={placement} className={contentClassName}>
      <Drawer.Dialog className={dialogClassName}>{children}</Drawer.Dialog>
    </Drawer.Content>
  </Drawer.Backdrop>
)

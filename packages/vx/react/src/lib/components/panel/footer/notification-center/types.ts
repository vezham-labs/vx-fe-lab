import { type ComponentPropsWithRef, type ElementType, ReactNode } from 'react'

import { createFooterDrawerAccessors } from '../drawer-accessors'
import { tvProps, tvSlots, tva } from './variant'

interface Props extends tvProps, Omit<ComponentPropsWithRef<'div'>, 'title'> {
  as?: ElementType
  classNames?: Partial<Record<tvSlots, string>>
  isOpen: boolean
  onClose: () => void
  backdrop?: 'transparent' | 'blur' | 'opaque'
  placement?: 'left' | 'right' | 'top' | 'bottom'
  title?: ReactNode
  onEdit?: () => void
  isEmpty?: boolean
}

const useProps = (originalProps: Props) => {
  const {
    variant,
    size,
    blur,
    border,
    as,
    id,
    ref,
    children,
    className,
    classNames,
    isOpen,
    onClose,
    backdrop = 'transparent',
    placement = 'left',
    title = 'Notification Center',
    onEdit,
    isEmpty = false,
    ...otherProps
  } = originalProps

  const Component = as || 'div'
  const domRef = ref
  const slots = tva({ variant, placement, size, blur, border })

  const {
    getDrawerBaseProps,
    getDrawerWrapperProps,
    getDrawerContentProps,
    getDrawerHeaderProps,
    closeButtonClassName,
    getEmptyStateProps,
    getEmptyStateIconProps
  } = createFooterDrawerAccessors({
    slots,
    classNames,
    className,
    id,
    domRef,
    otherProps
  })

  const getHeaderTitleProps = () => ({
    className: slots.header_title({ class: classNames?.header_title }),
    children: title
  })

  const getDrawerBodyProps = () => ({
    className: slots.drawer_body({ class: classNames?.drawer_body })
  })

  const getScrollShadowProps = () => ({
    className: slots.scroll_shadow({ class: classNames?.scroll_shadow }),
    hideScrollBar: true
  })

  const getDrawerFooterProps = () => ({
    className: slots.drawer_footer({ class: classNames?.drawer_footer })
  })

  const getEditButtonProps = () => ({
    className: slots.chip({ class: classNames?.chip })
  })

  return {
    Component,
    domRef,
    slots,
    classNames,
    children,
    getDrawerBaseProps,
    getDrawerWrapperProps,
    getDrawerContentProps,
    getDrawerHeaderProps,
    getHeaderTitleProps,
    closeButtonClassName,
    getDrawerBodyProps,
    getScrollShadowProps,
    getEmptyStateProps,
    getEmptyStateIconProps,
    getDrawerFooterProps,
    getEditButtonProps,
    isOpen,
    onClose,
    backdrop,
    placement,
    title,
    onEdit,
    isEmpty
  }
}

export { useProps }
export type { Props }

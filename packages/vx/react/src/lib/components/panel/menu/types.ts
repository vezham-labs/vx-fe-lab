import { type ComponentPropsWithRef, type ElementType, ReactNode } from 'react'

import { cn } from '@vezham/react-v3'

import { tvProps, tvSlots, tva } from './variant'

type SubMenuItem = {
  key: string
  title: string
  href?: string
  icon?: string
  iconActive?: string
  endContent?: ReactNode
  submenu?: SubMenuItem[]
}

type MenuItem = {
  key: string
  title: string
  href?: string
  icon?: string
  iconActive?: string
  endContent?: ReactNode
  submenu?: MenuItem[]
}

export type SubmenuState = {
  isOpen: boolean
  items: MenuItem[]
  title: string
}

interface Props
  extends tvProps, Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  as?: ElementType
  classNames?: Partial<Record<tvSlots, string>>
  items: MenuItem[]
  selectedKey?: string
  onSelect?: (key: string) => void
  collapsed?: boolean
  onSubmenuChange?: (state: SubmenuState) => void
}

const useProps = (originalProps: Props) => {
  const {
    variant,
    size,
    spacing,
    itemRadius,
    as,
    id,
    ref,
    children,
    className,
    classNames,
    items,
    selectedKey,
    onSelect,
    collapsed = false,
    onSubmenuChange,
    ...otherProps
  } = originalProps

  const Component = as || 'div'
  const domRef = ref
  const slots = tva({ variant, size, spacing, collapsed, itemRadius })

  const getBaseProps = () => ({
    id,
    ref: domRef,
    className: slots.base({ class: cn(classNames?.base, className) }),
    ...otherProps
  })

  const getScrollProps = () => ({
    hideScrollBar: true,
    orientation: 'vertical' as const,
    className: slots.scroll({ class: classNames?.scroll })
  })

  const getContainerProps = () => ({
    className: slots.container({ class: classNames?.container })
  })

  const getAlignProps = () => ({
    className: slots.align({ class: classNames?.align })
  })

  const getItemProps = ({
    item,
    isActive
  }: {
    item: MenuItem
    isActive: boolean
  }) => ({
    className: slots.item({
      class: classNames?.item
    }),
    'data-active': isActive,
    'data-key': item.key
  })

  const getIconWrapperProps = () => ({
    className: slots.icon_wrapper({ class: classNames?.icon_wrapper })
  })

  const getIconProps = ({ isActive }: { isActive: boolean }) => ({
    className: slots.icon({
      class: classNames?.icon
    }),
    'data-active': isActive
  })

  const getTooltipTriggerProps = () => ({
    className: slots.tooltip_trigger({ class: classNames?.tooltip_trigger })
  })

  const getTooltipContentProps = () => ({
    placement: 'right' as const,
    className: slots.tooltip_content({ class: classNames?.tooltip_content })
  })

  const getLabelProps = ({ isActive }: { isActive: boolean }) => ({
    className: slots.label({
      class: classNames?.label
    }),
    'data-active': isActive
  })

  return {
    Component,
    domRef,
    slots,
    classNames,
    children,
    getBaseProps,
    getScrollProps,
    getContainerProps,
    getItemProps,
    getIconWrapperProps,
    getIconProps,
    getTooltipTriggerProps,
    getTooltipContentProps,
    getLabelProps,
    getAlignProps,
    items,
    selectedKey,
    collapsed,
    onSelect,
    onSubmenuChange
  }
}

export { useProps }
export type { Props, MenuItem, SubMenuItem }

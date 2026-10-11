import { cn } from '@vezham/react-v3'

type Slot = (options: { class?: string }) => string
type DrawerSlots = {
  drawer_base: Slot
  drawer_wrapper: Slot
  drawer_content: Slot
  drawer_header: Slot
  close_button: Slot
  empty_state: Slot
  empty_state_icon: Slot
}
type DrawerClassNames = Partial<Record<keyof DrawerSlots, string>>

export const createFooterDrawerAccessors = <Ref, OtherProps extends object>({
  slots,
  classNames,
  className,
  id,
  domRef,
  otherProps
}: {
  slots: DrawerSlots
  classNames?: DrawerClassNames
  className?: string
  id?: string
  domRef: Ref
  otherProps: OtherProps
}) => ({
  getDrawerBaseProps: () => ({
    ...otherProps,
    id,
    ref: domRef,
    className: slots.drawer_base({
      class: cn(classNames?.drawer_base, className)
    })
  }),
  getDrawerWrapperProps: () => ({
    className: slots.drawer_wrapper({ class: classNames?.drawer_wrapper })
  }),
  getDrawerContentProps: () => ({
    className: slots.drawer_content({ class: classNames?.drawer_content })
  }),
  getDrawerHeaderProps: () => ({
    className: slots.drawer_header({ class: classNames?.drawer_header })
  }),
  closeButtonClassName: slots.close_button({
    class: classNames?.close_button
  }),
  getEmptyStateProps: () => ({
    className: slots.empty_state({ class: classNames?.empty_state })
  }),
  getEmptyStateIconProps: () => ({
    size: 64,
    className: slots.empty_state_icon({ class: classNames?.empty_state_icon })
  })
})

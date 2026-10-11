import { useNavigate } from '@tanstack/react-router'
import { forwardRef } from 'react'

import { EmptyState } from '@vezham/react-pro-v3/empty-state'
import {
  Button,
  CloseButton,
  Drawer,
  ScrollShadow,
  useMediaQuery
} from '@vezham/react-v3'

import { useSettingsNavigation } from '../../../../pages/settings/navigation'
import { InfoPanelSheet } from '../../info-panel/sheet'
import { ACCOUNT_BUBBLE_MEDIA_QUERY } from '../../responsive'
import { FooterDrawerFrame } from '../drawer-frame'
import { Props, useProps } from './types'
import { WidgetTiles, useWidgetTiles } from './widget-tiles'

const NotificationDrawer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    Component,
    getDrawerBaseProps,
    getDrawerWrapperProps,
    getDrawerContentProps,
    getDrawerHeaderProps,
    getHeaderTitleProps,
    closeButtonClassName,
    getDrawerBodyProps,
    getScrollShadowProps,
    getDrawerFooterProps,
    getEditButtonProps,
    isOpen,
    onClose,
    backdrop,
    placement,
    title,
    onEdit,
    isEmpty
  } = useProps({
    ...props,
    ref
  })
  const drawerBaseProps = getDrawerBaseProps()
  const navigate = useNavigate()

  const compact = useMediaQuery(ACCOUNT_BUBBLE_MEDIA_QUERY, {
    initializeWithValue: false
  })

  const openSettings = useSettingsNavigation()
  const { visibleTiles } = useWidgetTiles()
  const showEmptyState = isEmpty || visibleTiles.length === 0

  const content = (
    <ScrollShadow {...getScrollShadowProps()}>
      {showEmptyState ? (
        <EmptyState size="sm" className="py-12">
          <EmptyState.Header>
            <EmptyState.Title>No widgets yet</EmptyState.Title>
            <EmptyState.Description>
              Add widgets to personalize your Notification Center.
            </EmptyState.Description>
          </EmptyState.Header>
        </EmptyState>
      ) : (
        <WidgetTiles />
      )}
    </ScrollShadow>
  )
  const handleEdit = () => {
    if (openSettings) {
      onClose()
      openSettings('Edit Widgets')
    } else if (onEdit) {
      onEdit()
    } else {
      onClose()
      navigate({ to: '/widgets' })
    }
  }

  const editButton = (
    <Button
      variant="secondary"
      size="sm"
      {...getEditButtonProps()}
      onPress={handleEdit}>
      Edit Widgets
    </Button>
  )

  if (compact) {
    return (
      <InfoPanelSheet
        isOpen={isOpen}
        heading={title}
        panel={{
          title: typeof title === 'string' ? title : 'Notification Center',
          scrollable: false,
          content: (
            <div className="flex h-full min-h-0 flex-col">
              {content}
              {editButton && (
                <div className="flex shrink-0 justify-center pt-3">
                  {editButton}
                </div>
              )}
            </div>
          )
        }}
        onClose={onClose}
      />
    )
  }

  return (
    <Component {...drawerBaseProps}>
      <FooterDrawerFrame
        isOpen={isOpen}
        onClose={onClose}
        backdrop={backdrop}
        placement={placement}
        wrapperClassName={getDrawerWrapperProps().className}
        contentClassName={`${drawerBaseProps.className} overflow-hidden`}
        dialogClassName={getDrawerContentProps().className}>
        <Drawer.Header {...getDrawerHeaderProps()}>
          <Drawer.Heading {...getHeaderTitleProps()} />
          <CloseButton
            aria-label="Close Notification Center"
            className={closeButtonClassName}
            onPress={onClose}
          />
        </Drawer.Header>

        <Drawer.Body {...getDrawerBodyProps()}>{content}</Drawer.Body>

        {editButton && (
          <Drawer.Footer {...getDrawerFooterProps()}>
            {editButton}
          </Drawer.Footer>
        )}
      </FooterDrawerFrame>
    </Component>
  )
})

NotificationDrawer.displayName = 'NotificationDrawer'

export { NotificationDrawer }

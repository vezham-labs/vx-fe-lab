import { type ReactNode, useMemo, useState } from 'react'

import {
  Bell as BellIcon,
  MenuDots as MenuDotsIcon,
  Settings as SettingsIcon,
  VezhamTamizhi
} from '@vezham/icons-react'
import {
  Badge,
  Button,
  Dropdown,
  Separator,
  Surface,
  Tooltip,
  useMediaQuery
} from '@vezham/react-v3'

import { useUser } from '../../../store/users/useUserStore'
import { ACCOUNT_BUBBLE_MEDIA_QUERY } from '../responsive'
import { DefaultControlCenter } from './control-center/default'
import { FooterControlCenterContext } from './control-center/footer-context'
import type { FooterActionsProps } from './types'
import { UserMenu } from './user-menu'

type Props = {
  label: string
  onPress?: () => void
  children: ReactNode
}

const FooterAction = ({ children, label, onPress }: Props) => {
  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger className="size-5 leading-none">
        <Button
          aria-label={label}
          isIconOnly
          variant="ghost"
          size="sm"
          className="text-muted hover:text-foreground h-5 w-5"
          onPress={onPress}>
          {children}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right">{label}</Tooltip.Content>
    </Tooltip>
  )
}

const CompactActions = ({
  showAI,
  showControlCenter,
  onControlCenter,
  showNotifications,
  notificationCount,
  onAI,
  onNotificationsClick
}: Omit<FooterActionsProps, 'user' | 'showUserInfo' | 'onUserClick'> & {
  onControlCenter: () => void
}) => {
  if (!showAI && !showNotifications && !showControlCenter) return null

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Open footer actions"
        className="button button--ghost flex h-10 w-10 items-center justify-center rounded-full">
        <MenuDotsIcon size={20} aria-hidden="true" />
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Footer actions">
          {showControlCenter ? (
            <Dropdown.Item onPress={onControlCenter}>
              <SettingsIcon size={20} aria-hidden="true" />
              Control center
            </Dropdown.Item>
          ) : null}
          {showNotifications ? (
            <Dropdown.Item onPress={onNotificationsClick}>
              <BellIcon size={20} aria-hidden="true" />
              <span className="flex-1">Notifications</span>
              {notificationCount && notificationCount > 0 ? (
                <Badge
                  content={String(notificationCount)}
                  color="danger"
                  size="sm"
                />
              ) : null}
            </Dropdown.Item>
          ) : null}
          {showAI ? (
            <Dropdown.Item onPress={onAI}>
              <VezhamTamizhi size={20} aria-hidden="true" />
              Tamizhi AI
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

const Footer = ({
  user,
  showAI = false,
  showControlCenter = false,
  controlCenter,
  showNotifications = false,
  showUserInfo = true,
  notificationCount = 0,
  onAI,
  onNotificationsClick,
  onUserClick,
  toolbarAction,
  className
}: FooterActionsProps) => {
  const { clearUser } = useUser()
  const compact = useMediaQuery(ACCOUNT_BUBBLE_MEDIA_QUERY, {
    initializeWithValue: false
  })
  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  const controlCenterContext = useMemo(
    () => ({
      compact,
      isOpen: controlCenterOpen,
      onOpenChange: setControlCenterOpen
    }),
    [compact, controlCenterOpen]
  )

  return (
    <>
      <Separator className="hidden md:block" />
      <Surface
        variant="transparent"
        className={`flex items-center justify-center gap-2 md:flex-col md:gap-3 ${className ?? ''}`}>
        <div className="hidden md:contents">
          {showAI ? (
            <FooterAction label="Tamizhi AI" onPress={onAI}>
              <VezhamTamizhi size={20} aria-hidden="true" />
            </FooterAction>
          ) : null}

          {showNotifications ? (
            <div className="relative">
              <FooterAction
                label="Notifications"
                onPress={onNotificationsClick}>
                <BellIcon size={20} aria-hidden="true" />
              </FooterAction>
              {notificationCount > 0 ? (
                <span className="bg-danger text-danger-foreground pointer-events-none absolute -top-1 -right-1 min-w-4 rounded-full px-1 text-center text-[10px] leading-4">
                  {notificationCount}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {showControlCenter && (
          <FooterControlCenterContext.Provider value={controlCenterContext}>
            {controlCenter ?? <DefaultControlCenter placement="right bottom" />}
          </FooterControlCenterContext.Provider>
        )}

        <div className="md:hidden">
          <CompactActions
            showControlCenter={showControlCenter}
            onControlCenter={() => setControlCenterOpen(true)}
            showAI={showAI}
            showNotifications={showNotifications}
            notificationCount={notificationCount}
            onAI={onAI}
            onNotificationsClick={onNotificationsClick}
          />
        </div>

        {showUserInfo ? (
          <UserMenu
            user={user}
            onProfile={() => onUserClick?.(user, 'profiles')}
            onPreferences={() => onUserClick?.(user, 'account')}
            onLogout={clearUser}
          />
        ) : null}

        {toolbarAction && (
          <Surface variant="transparent" className="md:hidden">
            {toolbarAction}
          </Surface>
        )}
      </Surface>
    </>
  )
}

export { Footer }

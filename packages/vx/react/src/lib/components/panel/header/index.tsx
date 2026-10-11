import { type ReactElement, useCallback, useState } from 'react'

import {
  AltArrowDown as AltArrowDownIcon,
  Archive as ArchiveIcon,
  Bookmark as BookmarkIcon,
  Magnifier as MagnifierIcon,
  SidebarMinimalistic as SidebarMinimalisticIcon
} from '@vezham/icons-react'
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  Separator,
  Surface,
  Tooltip,
  useMediaQuery
} from '@vezham/react-v3'

import { AppIcon } from '../../app-icon'
import { useAppMenu } from '../../app-menu'
import { useCommand } from '../../command'
import { ShortcutKey, ShortcutTooltipLabel } from '../../shortcut-key'
import { useInfoPanel } from '../info-panel'
import { APPLICATION_MENU_SHEET_MEDIA_QUERY } from '../responsive'
import {
  type ApplicationMenuProps,
  ApplicationMenuSheet
} from './application-menu-sheet'
import { BookmarksTrigger } from './bookmarks'
import { StorageTrigger } from './storage'
import { HeaderActionsProps } from './types'

const Header = ({
  users,
  showSearch = false,
  showBookamarks = false,
  showStorage = false,
  onAvatarClick,
  onSearchClick,
  isDockHidden = false,
  onToggleDock,
  isSidebarOpen = false,
  onToggleSidebar,
  extraActions,
  className,
  compact = false,
  hideSeparator = false,
  showMenuUtilities = true
}: HeaderActionsProps) => {
  const [open, setOpen] = useState(false)

  const { openCommand } = useCommand()
  const showHistoryNavigation = useMediaQuery('(max-width: 1023px)', {
    initializeWithValue: false
  })
  const onToggleNavigation = onToggleSidebar ?? onToggleDock
  const navigationLabel = onToggleSidebar
    ? isSidebarOpen
      ? 'Hide Sidebar'
      : 'Show Sidebar'
    : isDockHidden
      ? 'Show Dock'
      : 'Hide Dock'

  const handleSearch = useCallback(() => {
    onSearchClick?.()
    openCommand()
  }, [onSearchClick, openCommand])

  const handleMenuSearch = useCallback(() => {
    handleSearch()
    setOpen(false)
  }, [handleSearch])

  if (compact) {
    return (
      <Surface
        variant="transparent"
        className={`flex items-center ${className ?? ''}`}
        data-vx="header">
        <div
          role="group"
          aria-label="Application controls"
          data-hovered={open || undefined}
          className="button button--ghost flex h-8 items-center gap-0 px-1 transition-transform duration-300">
          <button
            type="button"
            aria-label="Application"
            className="flex h-full items-center bg-transparent p-0"
            onClick={() => onAvatarClick?.(users)}>
            <HeaderAvatar user={users} />
          </button>

          <HeaderApplicationMenu
            isOpen={open}
            onOpenChange={setOpen}
            onClose={() => setOpen(false)}
            onSearch={handleMenuSearch}
            navigationLabel={navigationLabel}
            onToggleNavigation={onToggleNavigation}
            showHistoryNavigation={showHistoryNavigation}
            showMenuUtilities={showMenuUtilities}
            showBookamarks={showBookamarks}
            showStorage={showStorage}>
            <Button
              variant="ghost"
              isIconOnly
              aria-label="Open application menu"
              size="sm"
              className="h-6 w-6 min-w-0 p-0">
              <span className="sr-only">Application menu</span>
              <AltArrowDownIcon
                size={8}
                className="text-muted-foreground"
                aria-hidden="true"
              />
            </Button>
          </HeaderApplicationMenu>
        </div>

        {onToggleNavigation && (
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Button
                aria-label={navigationLabel}
                aria-keyshortcuts="Meta+S"
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-muted hover:text-foreground"
                onPress={onToggleNavigation}>
                <SidebarMinimalisticIcon
                  size={16}
                  className="size-4"
                  aria-hidden="true"
                />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right">
              <ShortcutTooltipLabel label={navigationLabel} shortcut="⌘ S" />
            </Tooltip.Content>
          </Tooltip>
        )}
      </Surface>
    )
  }

  return (
    <>
      <Surface
        variant="transparent"
        className={`flex flex-row items-center gap-1 md:flex-col md:gap-3 ${className ?? ''}`}
        data-vx="header">
        <HeaderApplicationMenu
          isOpen={open}
          onOpenChange={setOpen}
          onClose={() => setOpen(false)}
          onSearch={handleMenuSearch}
          navigationLabel={navigationLabel}
          onToggleNavigation={onToggleNavigation}
          showHistoryNavigation={showHistoryNavigation}
          showMenuUtilities={showMenuUtilities}
          showBookamarks={false}
          showStorage={false}>
          <Button
            variant="ghost"
            className="flex h-10 items-center gap-2 px-2 transition-transform duration-300"
            aria-label="Open application menu"
            onPress={() => onAvatarClick?.(users)}>
            <HeaderAvatar user={users} />
            <span className="sr-only">Application menu</span>
            <AltArrowDownIcon
              size={8}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </HeaderApplicationMenu>

        {showSearch && (
          <Tooltip delay={0}>
            <Tooltip.Trigger className="size-5 leading-none">
              <button
                type="button"
                aria-label="Open command palette"
                className="inline-flex size-5 items-center justify-center bg-transparent p-0"
                onClick={handleSearch}>
                <MagnifierIcon
                  className="text-muted cursor-pointer"
                  size={20}
                  aria-hidden="true"
                />
              </button>
            </Tooltip.Trigger>

            <Tooltip.Content placement="right">
              <ShortcutTooltipLabel label="Search" shortcut="Mod K" />
            </Tooltip.Content>
          </Tooltip>
        )}
        {showBookamarks && <BookmarksTrigger />}
        {showStorage && <StorageTrigger />}
        {extraActions}
      </Surface>

      {!hideSeparator && <Separator className="hidden md:block" />}
    </>
  )
}

const HeaderAvatar = ({ user }: { user: HeaderActionsProps['users'] }) => (
  <Avatar className="h-5 w-5">
    {user.avatar && <Avatar.Image src={user.avatar} alt={user.name} />}
    <Avatar.Fallback>{user.name?.[0]?.toUpperCase()}</Avatar.Fallback>
  </Avatar>
)

const HeaderApplicationMenu = ({
  children,
  isOpen,
  onOpenChange,
  ...props
}: ApplicationMenuProps & {
  children: ReactElement<{ onPress?: () => void }>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const small = useMediaQuery(APPLICATION_MENU_SHEET_MEDIA_QUERY, {
    initializeWithValue: false
  })
  if (small)
    return (
      <ApplicationMenuSheet
        {...props}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        trigger={children}
      />
    )
  return (
    <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <HeaderApplicationMenuContent {...props} />
    </Dropdown>
  )
}

const HeaderApplicationMenuContent = ({
  onClose,
  onSearch,
  navigationLabel,
  onToggleNavigation,
  showHistoryNavigation,
  showMenuUtilities,
  showBookamarks,
  showStorage
}: ApplicationMenuProps) => {
  const appMenu = useAppMenu()
  return (
    <Dropdown.Popover>
      <Dropdown.Menu aria-label="Application menu">
        <Dropdown.Item id="home" textValue="Back to home" onPress={onClose}>
          <Label>Back to home</Label>
        </Dropdown.Item>
        {showHistoryNavigation && (
          <>
            <Dropdown.Item
              id="back"
              textValue="Back"
              aria-keyshortcuts="Meta+ArrowLeft"
              onPress={() => {
                onClose()
                window.history.back()
              }}>
              <AppIcon icon="vx:arrow-left" size={18} aria-hidden="true" />
              <Label>Back</Label>
              <ShortcutKey className="ms-auto" shortcut="⌘ ←" />
            </Dropdown.Item>
            <Dropdown.Item
              id="forward"
              textValue="Forward"
              aria-keyshortcuts="Meta+ArrowRight"
              onPress={() => {
                onClose()
                window.history.forward()
              }}>
              <AppIcon icon="vx:arrow-right" size={18} aria-hidden="true" />
              <Label>Forward</Label>
              <ShortcutKey className="ms-auto" shortcut="⌘ →" />
            </Dropdown.Item>
          </>
        )}
        {!showMenuUtilities && <Separator />}
        {showMenuUtilities && onToggleNavigation && (
          <Dropdown.Item
            id="toggle-navigation"
            textValue={navigationLabel}
            aria-keyshortcuts="Meta+S"
            onPress={() => {
              onClose()
              onToggleNavigation()
            }}>
            <SidebarMinimalisticIcon size={18} aria-hidden="true" />
            <Label>{navigationLabel}</Label>
            <ShortcutKey className="ms-auto" shortcut="⌘ S" />
          </Dropdown.Item>
        )}
        {showMenuUtilities && (
          <>
            <Separator />
            <Dropdown.Item
              id="search"
              textValue="Search"
              aria-label="Open command palette"
              onPress={onSearch}>
              <AppIcon icon="vx:search" size={18} aria-hidden="true" />
              <Label>Search</Label>
              <ShortcutKey className="ms-auto" shortcut="Mod K" />
            </Dropdown.Item>
          </>
        )}
        {(showBookamarks || showStorage) && (
          <HeaderPanelMenuItems
            showBookamarks={showBookamarks}
            showStorage={showStorage}
            onClose={onClose}
          />
        )}
        {(showMenuUtilities || showBookamarks || showStorage) && <Separator />}
        {appMenu?.items.map(menu => (
          <Dropdown.SubmenuTrigger key={menu.key}>
            <Dropdown.Item id={menu.key} textValue={menu.label}>
              {menu.icon && (
                <AppIcon icon={menu.icon} size={18} aria-hidden="true" />
              )}
              <Label>{menu.label}</Label>
              <Dropdown.SubmenuIndicator />
            </Dropdown.Item>
            <Dropdown.Popover placement="right top">
              <Dropdown.Menu aria-label={menu.label}>
                {menu.groups.flatMap((group, index) => [
                  ...(index
                    ? [<Separator key={`${menu.key}-separator-${index}`} />]
                    : []),
                  ...group.map(action => (
                    <Dropdown.Item
                      key={action.key}
                      id={action.key}
                      textValue={action.label}
                      onPress={() => {
                        onClose()
                        appMenu.onAction(action)
                      }}>
                      {action.icon && (
                        <AppIcon
                          icon={action.icon}
                          size={18}
                          aria-hidden="true"
                        />
                      )}
                      <Label>{action.label}</Label>
                      {action.shortcut && (
                        <ShortcutKey
                          className="ms-auto"
                          shortcut={action.shortcut}
                        />
                      )}
                    </Dropdown.Item>
                  ))
                ])}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
        ))}
      </Dropdown.Menu>
    </Dropdown.Popover>
  )
}

const HeaderPanelMenuItems = ({
  showBookamarks,
  showStorage,
  onClose
}: {
  showBookamarks: boolean
  showStorage: boolean
  onClose: () => void
}) => {
  const { toggleInfoPanel, activeInfoPanel, isOpen } = useInfoPanel()

  return (
    <>
      {showBookamarks && (
        <Dropdown.Item
          id="bookmarks"
          textValue="Bookmarks"
          aria-label="Bookmarks"
          aria-keyshortcuts="Meta+Shift+B Control+Shift+B"
          onPress={() => {
            onClose()
            toggleInfoPanel('bookmarks')
          }}>
          <BookmarkIcon
            size={18}
            weight={
              isOpen && activeInfoPanel === 'bookmarks' ? 'filled' : 'outline'
            }
            aria-hidden="true"
          />
          <Label>Bookmarks</Label>
          <ShortcutKey className="ms-auto" shortcut="Mod ⇧ B" />
        </Dropdown.Item>
      )}
      {showStorage && (
        <Dropdown.Item
          id="storage"
          textValue="Storage"
          aria-label="Storage"
          aria-keyshortcuts="Meta+Shift+S Control+Shift+S"
          onPress={() => {
            onClose()
            toggleInfoPanel('storage')
          }}>
          <ArchiveIcon size={18} aria-hidden="true" />
          <Label>Storage</Label>
          <ShortcutKey className="ms-auto" shortcut="Mod ⇧ S" />
        </Dropdown.Item>
      )}
    </>
  )
}

export { Header }

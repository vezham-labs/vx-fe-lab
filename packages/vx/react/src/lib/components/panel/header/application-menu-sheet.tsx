import { type ReactElement, useState } from 'react'

import {
  AltArrowLeft,
  AltArrowRight,
  Archive,
  Bookmark,
  SidebarMinimalistic
} from '@vezham/icons-react'
import { Button, Label, Separator } from '@vezham/react-v3'

import { AppIcon } from '../../app-icon'
import { useAppMenu } from '../../app-menu'
import { MenuSheet } from '../../menu/sheet'
import { ShortcutKey } from '../../shortcut-key'
import { useInfoPanel } from '../info-panel'

export type ApplicationMenuProps = {
  onClose: () => void
  onSearch: () => void
  navigationLabel: string
  onToggleNavigation?: () => void
  showHistoryNavigation: boolean
  showMenuUtilities: boolean
  showBookamarks: boolean
  showStorage: boolean
}

type Props = ApplicationMenuProps & {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactElement<{ onPress?: () => void }>
}

const actionClass =
  'h-auto min-h-11 w-full justify-start gap-3 rounded-lg px-3 py-2 text-start'

export const ApplicationMenuSheet = ({
  isOpen,
  onOpenChange,
  trigger,
  onClose,
  onSearch,
  navigationLabel,
  onToggleNavigation,
  showHistoryNavigation,
  showMenuUtilities,
  showBookamarks,
  showStorage
}: Props) => {
  const appMenu = useAppMenu()
  const { toggleInfoPanel, activeInfoPanel, isOpen: panelOpen } = useInfoPanel()
  const [menuKey, setMenuKey] = useState<string | null>(null)
  const menu = appMenu?.items.find(item => item.key === menuKey)
  const close = () => {
    setMenuKey(null)
    onClose()
  }
  const changeOpen = (open: boolean) => {
    if (!open) setMenuKey(null)
    onOpenChange(open)
  }
  return (
    <MenuSheet
      title="Application menu"
      hideTitle
      isOpen={isOpen}
      onOpenChange={changeOpen}
      trigger={trigger}>
      <div key={menuKey ?? 'home'} className="flex flex-col gap-1">
        {menu ? (
          <>
            <Button
              variant="ghost"
              className={actionClass}
              aria-label="Back to application menu"
              onPress={() => setMenuKey(null)}>
              <AltArrowLeft size={18} aria-hidden="true" />
              {menu.label}
            </Button>
            {menu.groups.map((group, index) => (
              <div
                key={group.map(action => action.key).join(':')}
                className="flex flex-col gap-1">
                {index > 0 && <Separator className="my-1" />}
                {group.map(action => (
                  <Button
                    key={action.key}
                    aria-label={action.label}
                    variant="ghost"
                    className={actionClass}
                    onPress={() => {
                      close()
                      appMenu?.onAction(action)
                    }}>
                    {action.icon && (
                      <AppIcon
                        icon={action.icon}
                        size={18}
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex-1">{action.label}</span>
                    {action.shortcut && (
                      <ShortcutKey
                        className="ms-auto"
                        shortcut={action.shortcut}
                      />
                    )}
                  </Button>
                ))}
              </div>
            ))}
          </>
        ) : (
          <>
            <Button variant="ghost" className={actionClass} onPress={close}>
              Back to home
            </Button>
            {showHistoryNavigation && (
              <>
                <Button
                  variant="ghost"
                  className={actionClass}
                  aria-label="Back"
                  aria-keyshortcuts="Meta+ArrowLeft"
                  onPress={() => {
                    close()
                    window.history.back()
                  }}>
                  <AltArrowLeft size={18} aria-hidden="true" />
                  <Label className="flex-1">Back</Label>
                  <ShortcutKey shortcut="⌘ ←" />
                </Button>
                <Button
                  variant="ghost"
                  className={actionClass}
                  aria-label="Forward"
                  aria-keyshortcuts="Meta+ArrowRight"
                  onPress={() => {
                    close()
                    window.history.forward()
                  }}>
                  <AltArrowRight size={18} aria-hidden="true" />
                  <Label className="flex-1">Forward</Label>
                  <ShortcutKey shortcut="⌘ →" />
                </Button>
              </>
            )}
            {showMenuUtilities && onToggleNavigation && (
              <Button
                variant="ghost"
                className={actionClass}
                aria-label={navigationLabel}
                aria-keyshortcuts="Meta+S"
                onPress={() => {
                  close()
                  onToggleNavigation()
                }}>
                <SidebarMinimalistic size={18} aria-hidden="true" />
                <span className="flex-1">{navigationLabel}</span>
                <ShortcutKey shortcut="⌘ S" />
              </Button>
            )}
            {showMenuUtilities && (
              <>
                <Separator className="my-1" />
                <Button
                  variant="ghost"
                  className={actionClass}
                  aria-label="Open command palette"
                  onPress={() => {
                    setMenuKey(null)
                    onSearch()
                  }}>
                  <AppIcon icon="vx:search" size={18} aria-hidden="true" />
                  <span className="flex-1">Search</span>
                  <ShortcutKey shortcut="Mod K" />
                </Button>
              </>
            )}
            {showBookamarks && (
              <Button
                variant="ghost"
                className={actionClass}
                aria-label="Bookmarks"
                aria-keyshortcuts="Meta+Shift+B Control+Shift+B"
                onPress={() => {
                  close()
                  toggleInfoPanel('bookmarks')
                }}>
                <Bookmark
                  size={18}
                  weight={
                    panelOpen && activeInfoPanel === 'bookmarks'
                      ? 'filled'
                      : 'outline'
                  }
                  aria-hidden="true"
                />
                <span className="flex-1">Bookmarks</span>
                <ShortcutKey shortcut="Mod ⇧ B" />
              </Button>
            )}
            {showStorage && (
              <Button
                variant="ghost"
                className={actionClass}
                aria-label="Storage"
                aria-keyshortcuts="Meta+Shift+S Control+Shift+S"
                onPress={() => {
                  close()
                  toggleInfoPanel('storage')
                }}>
                <Archive size={18} aria-hidden="true" />
                <span className="flex-1">Storage</span>
                <ShortcutKey shortcut="Mod ⇧ S" />
              </Button>
            )}
            <Separator className="my-1" />
            {appMenu?.items.map(item => (
              <Button
                key={item.key}
                variant="ghost"
                className={actionClass}
                onPress={() => setMenuKey(item.key)}>
                {item.icon && (
                  <AppIcon icon={item.icon} size={18} aria-hidden="true" />
                )}
                <span className="flex-1">{item.label}</span>
                <AltArrowRight size={18} aria-hidden="true" />
              </Button>
            ))}
          </>
        )}
      </div>
    </MenuSheet>
  )
}

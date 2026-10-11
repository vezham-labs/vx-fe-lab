import { useEffect, useEffectEvent } from 'react'

import { Button } from '@vezham/react-v3'

import { AppIcon } from '../app-icon'
import { MenuSheet } from './sheet'
import { MenuDrawerProps } from './types'
import {
  getDrawerButtonClasses,
  getDrawerItemInnerClasses,
  getDrawerListClasses
} from './variant'

const MenuDrawer = ({
  items,
  selectedKey,
  onItemSelect,
  isOpen,
  onClose,
  isDarkMode = false,
  buttonTextColor
}: MenuDrawerProps) => {
  const closeOnResize = useEffectEvent(() => {
    if (isOpen) onClose()
  })

  useEffect(() => {
    const handleResize = () => closeOnResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <MenuSheet
      title="More navigation"
      hideTitle
      isDarkMode={isDarkMode}
      isOpen={isOpen}
      onOpenChange={open => !open && onClose()}>
      <ul className={getDrawerListClasses()}>
        {items.map(item => (
          <li key={item.key} className="min-w-0">
            <Button
              variant="ghost"
              aria-current={selectedKey === item.key ? 'page' : undefined}
              onPress={() => {
                onItemSelect(item)
                onClose()
              }}
              className={getDrawerButtonClasses({
                isSelected: selectedKey === item.key,
                isDarkMode
              })}>
              <div className={getDrawerItemInnerClasses(buttonTextColor ?? '')}>
                {item.icon && (
                  <AppIcon
                    icon={
                      selectedKey === item.key
                        ? item.iconActive || item.icon
                        : item.icon
                    }
                    className="h-5 w-5 shrink-0"
                    size="1em"
                    aria-hidden="true"
                  />
                )}
                <span className="min-w-0 flex-1 wrap-anywhere whitespace-normal">
                  {item.title}
                </span>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </MenuSheet>
  )
}

export { MenuDrawer }

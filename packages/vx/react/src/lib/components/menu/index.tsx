'use client'

import { useLocation, useNavigate } from '@tanstack/react-router'
import React, { useEffect, useMemo, useState } from 'react'

import {
  Magnifier as MagnifierIcon,
  MenuDots as MenuDotsIcon
} from '@vezham/icons-react'
import { Button, useOverlayState } from '@vezham/react-v3'

import { getSelectedMenuKey } from '../../navigation'
import { AppIcon } from '../app-icon'
import { MenuDrawer } from './drawer'
import { BottomNavbarProps, SidebarItem, SidebarItemType } from './types'
import {
  getNavbarButtonClasses,
  getNavbarContainerClasses,
  getNavbarIconClasses,
  getNavbarMenuContainerClasses,
  getSearchButtonClasses
} from './variant'

const flattenMenuItems = (menuItems: SidebarItem[] = []): SidebarItem[] => {
  const flatList: SidebarItem[] = []

  menuItems.forEach(item => {
    if (item.type === SidebarItemType.Nest && Array.isArray(item.items)) {
      flatList.push({ ...item })
      item.items.forEach(child => {
        flatList.push({ ...child })
      })
    } else {
      flatList.push(item)
    }
  })

  return flatList
}

const EMPTY_ITEMS: SidebarItem[] = []

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  items = EMPTY_ITEMS,
  onSelect,
  isDarkMode = false,
  bgColorClass,
  showSearch = false,
  hasPrimaryAction = false,
  onSearch,
  textColorClass,
  buttonTextColor
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const flatItems = useMemo(() => flattenMenuItems(items), [items])
  const activeKey = getSelectedMenuKey(location.pathname, flatItems) ?? ''

  const { isOpen, open: onOpen, close: onClose } = useOverlayState()
  const [mainVisibleCount, setMainVisibleCount] = useState(flatItems.length)

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      let visibleCount = 7

      if (screenWidth < 767) {
        if (screenWidth < 700) visibleCount = Math.min(flatItems.length, 6)
        if (screenWidth < 650) visibleCount = Math.min(flatItems.length, 5)
        if (screenWidth < 540) visibleCount = Math.min(flatItems.length, 4)
        if (screenWidth < 460) visibleCount = Math.min(flatItems.length, 3)
        if (screenWidth < 380) visibleCount = Math.min(flatItems.length, 2)
        if (screenWidth < 300) visibleCount = 1
      }

      setMainVisibleCount(visibleCount)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [flatItems.length])

  const showMoreButton = mainVisibleCount < flatItems.length

  const mainItems = useMemo(() => {
    const count = showMoreButton ? mainVisibleCount : flatItems.length
    return flatItems.slice(0, count)
  }, [flatItems, mainVisibleCount, showMoreButton])

  const moreItems = useMemo(() => {
    return showMoreButton ? flatItems.slice(mainVisibleCount) : []
  }, [flatItems, mainVisibleCount, showMoreButton])

  const handleItemSelect = (item: SidebarItem) => {
    onSelect?.(item.key)

    if (item.href) {
      navigate({ to: item.href })
    }
  }

  if (flatItems.length === 0) return null

  return (
    <>
      <div
        className={`${getNavbarContainerClasses({
          bgColorClass,
          isDarkMode
        })} cursor-pointer justify-between`}>
        <div className={getNavbarMenuContainerClasses({ isDarkMode })}>
          {mainItems.map(item => {
            const isActive = activeKey === item.key

            const iconName = isActive ? item.iconActive || item.icon : item.icon

            return (
              <button
                type="button"
                key={item.key}
                onClick={() => handleItemSelect(item)}
                className={getNavbarButtonClasses({
                  isSelected: isActive,
                  isDarkMode,
                  textColorClass
                })}>
                {iconName && (
                  <AppIcon
                    size={20}
                    icon={iconName}
                    className={getNavbarIconClasses({
                      isSelected: isActive,
                      isDarkMode
                    })}
                    aria-hidden="true"
                  />
                )}

                {item.title}
              </button>
            )
          })}

          {showMoreButton && (
            <button
              type="button"
              onClick={onOpen}
              className={getNavbarButtonClasses({
                isDarkMode,
                textColorClass
              })}>
              <MenuDotsIcon
                size={20}
                className={getNavbarIconClasses({ isDarkMode })}
                aria-hidden="true"
              />
              More
            </button>
          )}
        </div>

        {showSearch && (
          <Button
            aria-label="Search"
            className={getSearchButtonClasses({ isDarkMode, hasPrimaryAction })}
            variant="ghost"
            onPress={onSearch}>
            <MagnifierIcon
              className="m-auto h-5 w-5"
              size="1em"
              aria-hidden="true"
            />
          </Button>
        )}
      </div>

      <MenuDrawer
        items={moreItems}
        selectedKey={activeKey}
        onItemSelect={handleItemSelect}
        isOpen={isOpen}
        onClose={onClose}
        isDarkMode={isDarkMode}
        buttonTextColor={buttonTextColor}
      />
    </>
  )
}

export { BottomNavbar }

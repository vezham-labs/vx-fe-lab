import { useNavigate } from '@tanstack/react-router'
import { forwardRef, useState } from 'react'

import { Drawer, ScrollShadow, Tooltip, cn } from '@vezham/react-v3'

import { AppIcon } from '../../app-icon'
import { type MenuItem, Props, useProps } from './types'

const Menu = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const navigate = useNavigate()
  const {
    Component,
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
    onSelect
  } = useProps({
    ...props,
    ref
  })

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentSubmenu, setCurrentSubmenu] = useState<MenuItem[]>([])
  const [currentTitle, setCurrentTitle] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      setCurrentSubmenu(item.submenu)
      setCurrentTitle(item.title)
      setExpandedItems(new Set())
      setDrawerOpen(true)
    } else if (item.href) {
      onSelect?.(item.key)
      navigate({ to: item.href })
    }
  }

  const handlePressItem = (item: MenuItem) => {
    handleItemClick(item)
  }

  const handleDrawerItemClick = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      toggleExpandInDrawer(item.key)
    } else if (item.href) {
      onSelect?.(item.key)
      navigate({ to: item.href })
      setDrawerOpen(false)
    }
  }

  const toggleExpandInDrawer = (key: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedItems(newExpanded)
  }

  const renderSubMenuItem = (item: MenuItem, depth: number) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isExpanded = expandedItems.has(item.key)
    const paddingLeft = 12 + depth * 16

    return (
      <div key={item.key}>
        <button
          type="button"
          onClick={() => handleDrawerItemClick(item)}
          className={cn(
            'flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent px-4 py-2.5 text-left transition-all duration-200',
            'hover:bg-default-100',
            !hasSubmenu &&
              selectedKey === item.key &&
              'bg-primary/10 text-primary'
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}>
          {item.icon && (
            <AppIcon
              icon={item.icon}
              size={18}
              className="text-default-600"
              aria-hidden="true"
            />
          )}
          <span className="flex-1 text-sm font-medium">{item.title}</span>
          {hasSubmenu && (
            <AppIcon
              icon={isExpanded ? 'vx:chevron-down' : 'vx:chevron-right'}
              size={16}
              className="text-default-400 transition-transform duration-200"
              aria-hidden="true"
            />
          )}
        </button>

        {hasSubmenu && isExpanded && (
          <div className="mt-1 ml-4">
            {item.submenu?.map(subItem =>
              renderSubMenuItem(subItem, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Component {...getBaseProps()}>
        <ScrollShadow {...getScrollProps()}>
          <div {...getContainerProps()}>
            {items.map(item => {
              const isActive = selectedKey === item.key
              const iconName = isActive
                ? item.iconActive || item.icon
                : item.icon
              const iconProps = getIconProps({ isActive }) as {
                className?: string
                'data-active'?: boolean
              }

              return (
                <div key={item.key} {...getItemProps({ item, isActive })}>
                  <div {...getAlignProps()}>
                    <Tooltip delay={0}>
                      <Tooltip.Trigger {...getTooltipTriggerProps()}>
                        <button
                          type="button"
                          {...getIconWrapperProps()}
                          onClick={() => handlePressItem(item)}>
                          {iconName ? (
                            <AppIcon
                              icon={iconName}
                              size={20}
                              className={iconProps.className}
                              data-active={iconProps['data-active']}
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      </Tooltip.Trigger>

                      {collapsed && (
                        <Tooltip.Content {...getTooltipContentProps()}>
                          {item.title}
                        </Tooltip.Content>
                      )}
                    </Tooltip>

                    {!collapsed && (
                      <button
                        type="button"
                        {...getLabelProps({ isActive })}
                        onClick={() => handlePressItem(item)}>
                        {item.title}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollShadow>
      </Component>

      <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content placement="left">
          <Drawer.Dialog className="bg-black/5 backdrop-blur-sm md:translate-x-[106px]">
            <Drawer.CloseTrigger />
            <div className="border-default-200 flex items-center justify-between border-b p-4">
              <Drawer.Header className="text-lg font-semibold">
                {currentTitle}
              </Drawer.Header>
            </div>
            <Drawer.Body className="p-2">
              <div className="space-y-1">
                {currentSubmenu.map(item => renderSubMenuItem(item, 0))}
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>
    </>
  )
})

Menu.displayName = 'Menu'

export { Menu }

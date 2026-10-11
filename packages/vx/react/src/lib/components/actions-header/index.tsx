'use client'

import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import {
  Magnifier as MagnifierIcon,
  MenuDots as MenuDotsIcon
} from '@vezham/icons-react'
import {
  Button,
  Dropdown,
  InputGroup,
  Label,
  Tabs,
  TextField,
  Typography
} from '@vezham/react-v3'

import { AppIcon } from '../app-icon'
import { ShortcutKey } from '../shortcut-key'

export interface ActionItem {
  key: string
  label: string
  icon?: string
  shortcut?: string
  onAction?: (pageKey: string) => void
  isVisible?: (pageKey: string) => boolean
}

export interface TabItem {
  key: string
  title: string
  href: string
  icon?: string
  isDisabled?: boolean
}

export interface DynamicHeaderProps {
  tabs: TabItem[]
  activeTab: string
  rightActions?: ActionItem[]
  showSearch?: boolean
  onSearch?: (value: string, pageKey: string) => void
  leftActions?: ActionItem[]
}

const EMPTY_ACTIONS: ActionItem[] = []

const DynamicHeader = ({
  tabs,
  activeTab,

  rightActions = EMPTY_ACTIONS,
  showSearch = true,
  onSearch,
  leftActions = EMPTY_ACTIONS
}: DynamicHeaderProps) => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const handleSearch = (val: string) => {
    setSearch(val)
    onSearch?.(val, activeTab)
  }

  const visibleRightActions = useMemo(() => {
    return rightActions.filter(a => !a.isVisible || a.isVisible(activeTab))
  }, [rightActions, activeTab])

  const visibleLeftActions = useMemo(() => {
    return leftActions.filter(a => !a.isVisible || a.isVisible(activeTab))
  }, [leftActions, activeTab])

  const createAction = visibleRightActions.find(
    a =>
      a.key === 'add' ||
      a.key === 'create' ||
      a.label.toLowerCase().includes('create') ||
      a.label.toLowerCase().includes('add')
  )

  const otherActions = visibleRightActions.filter(a => a !== createAction)

  return (
    <div className="bg-background flex w-full flex-col gap-3 px-4 py-3">
      <div className="flex gap-3">
        <div className="flex min-w-[120px] flex-shrink-0 items-center gap-2">
          {visibleLeftActions.map(action => (
            <Button
              key={action.key}
              onPress={() => action.onAction?.(activeTab)}
              size="sm"
              variant="ghost">
              {action.icon && (
                <AppIcon icon={action.icon} size="1em" aria-hidden="true" />
              )}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex w-[275px] overflow-x-auto rounded-full p-1 sm:max-w-[300px]">
            <Tabs selectedKey={activeTab}>
              <Tabs.List className="flex gap-1">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.key

                  return (
                    <Tabs.Tab
                      key={tab.key}
                      onClick={() => {
                        if (tab.href) {
                          navigate({ to: tab.href })
                        }
                      }}
                      className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap transition-all ${
                        isActive
                          ? 'text-foreground bg-white'
                          : 'text-muted-foreground'
                      } `}>
                      {tab.icon && (
                        <AppIcon
                          icon={tab.icon}
                          className="h-4 w-4"
                          size="1em"
                          aria-hidden="true"
                        />
                      )}
                      <Typography.Heading>{tab.title}</Typography.Heading>
                    </Tabs.Tab>
                  )
                })}
              </Tabs.List>
            </Tabs>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <TextField className="w-full max-w-[280px]" name="email">
              <InputGroup>
                <InputGroup.Prefix>
                  <MagnifierIcon
                    className="text-muted-foreground h-4 w-4"
                    size="1em"
                    aria-hidden="true"
                  />
                </InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full max-w-[280px]"
                  placeholder="Search"
                  value={search}
                  onChange={event => handleSearch(event.target.value)}
                />
              </InputGroup>
            </TextField>
          )}

          {otherActions.length > 0 && (
            <Dropdown>
              <Button aria-label="More actions" isIconOnly variant="ghost">
                <MenuDotsIcon
                  size="1em"
                  style={{ transform: 'rotate(90deg)' }}
                  aria-hidden="true"
                />
              </Button>

              <Dropdown.Popover>
                <Dropdown.Menu>
                  {otherActions.map(action => (
                    <Dropdown.Item
                      key={action.key}
                      onPress={() => action.onAction?.(activeTab)}>
                      <Label className="flex items-center gap-2">
                        {action.icon && (
                          <AppIcon
                            icon={action.icon}
                            size="1em"
                            aria-hidden="true"
                          />
                        )}
                        {action.label}
                      </Label>

                      {action.shortcut && (
                        <ShortcutKey
                          className="ms-auto"
                          shortcut={action.shortcut}
                        />
                      )}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

          {createAction && (
            <Button onPress={() => createAction.onAction?.(activeTab)}>
              {createAction.icon && (
                <AppIcon
                  icon={createAction.icon}
                  size="1em"
                  aria-hidden="true"
                />
              )}
              {createAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { DynamicHeader }

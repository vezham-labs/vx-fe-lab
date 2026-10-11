'use client'

import { useState } from 'react'

import { Button, ScrollShadow } from '@vezham/react-v3'

import { useUser } from '../../../../store/users/useUserStore'
import { AppIcon } from '../../../app-icon'
import { SidebarItem, settingsSidebar } from './data'

type Props = {
  active: string
  onSelect: (id: string) => void
}

const SettingsSidebar = ({ active, onSelect }: Props) => {
  const [openGroups, setOpenGroups] = useState<string[]>([])
  const { user } = useUser()

  const names = user ? `${user.firstName} ${user.lastName}` : 'Guest'
  const avatar = user?.avatar

  const toggleGroup = (id: string) => {
    setOpenGroups(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children?.length
    const isOpen =
      openGroups.includes(item.id) ||
      Boolean(item.children?.some(child => child.id === active))

    const isChildActive =
      item.children?.some(c => c.id === active) || active.startsWith(item.id)

    if (item.id === 'profiles') {
      const initials = names
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

      return (
        <div key={item.id} className="px-2">
          <button
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center gap-4 rounded-xl p-2 px-2 ${
              active === item.id ? 'bg-default-100' : 'hover:bg-default-50'
            }`}>
            {avatar ? (
              <img
                alt={names}
                src={avatar}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white">
                {initials}
              </div>
            )}

            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{names}</span>
              <span className="text-default-500 text-xs">Edit Profile</span>
            </div>
          </button>
        </div>
      )
    }

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          onPress={() => {
            if (hasChildren) {
              toggleGroup(item.id)
            }

            onSelect(item.id)

            const el = document.getElementById(item.id)
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
            active === item.id || isChildActive
              ? 'bg-default-100 font-medium'
              : 'hover:bg-default-50'
          }`}
          style={{ paddingLeft: 12 + level * 16 }}>
          <div className="flex items-center gap-2">
            {item.icon && (
              <AppIcon icon={item.icon} size={18} aria-hidden="true" />
            )}

            <span
              className={`${
                active === item.id
                  ? 'text-foreground font-medium'
                  : isChildActive
                    ? 'text-foreground'
                    : level > 0
                      ? 'text-default-400'
                      : 'text-default-600'
              }`}>
              {item.label}
            </span>
          </div>

          {hasChildren && (
            <AppIcon
              icon={isOpen ? 'vx:chevron-down' : 'vx:chevron-right'}
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>

        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <ScrollShadow className="w-[240px] pr-2">
      <div className="space-y-6">
        {settingsSidebar.map(section => (
          <div key={section.title}>
            {section.title && (
              <p className="text-default-500 mb-2 px-3 text-xs font-semibold">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map(item => renderItem(item))}
            </div>
          </div>
        ))}
      </div>
    </ScrollShadow>
  )
}

const findItemById = (id: string) => {
  for (const section of settingsSidebar) {
    for (const item of section.items) {
      if (item.id === id) return item
      if (item.children) {
        const found = item.children.find(c => c.id === id)
        if (found) return found
      }
    }
  }

  return undefined
}

export { SettingsSidebar, findItemById }

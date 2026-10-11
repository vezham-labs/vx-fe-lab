import { type ReactNode, useState } from 'react'

import {
  AltArrowLeft,
  AltArrowRight,
  CheckRead,
  Logout2 as LogoutIcon,
  Settings as SettingsIcon
} from '@vezham/icons-react'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Separator,
  Tooltip,
  useMediaQuery
} from '@vezham/react-v3'

import { MenuSheet } from '../../menu/sheet'
import {
  ACCOUNT_BUBBLE_MEDIA_QUERY,
  APPLICATION_MENU_SHEET_MEDIA_QUERY
} from '../responsive'
import {
  DEFAULT_STATUS_OPTION,
  STATUS_OPTIONS,
  STATUS_TIMING_OPTIONS,
  SUGGESTED_STATUS_OPTIONS,
  isColorStatus
} from './data'
import type {
  StatusTimingOption,
  SuggestedStatusOption,
  UserInfo,
  UserStatus,
  UserStatusOption
} from './types'

type Props = {
  user: UserInfo
  onLogout: () => void
  onProfile?: () => void
  onPreferences?: () => void
}

const StatusVisual = ({ status }: { status: UserStatusOption }) => {
  if (isColorStatus(status.id)) {
    return <span className={`h-2 w-2 rounded-full ${status.color ?? ''}`} />
  }

  return <span className="text-xs">{status.icon}</span>
}

const useAccountSections = (user: UserInfo) => {
  const [userStatus, setUserStatus] = useState<UserStatus>('active')
  const [selectedStatus, setSelectedStatus] = useState<SuggestedStatusOption>()
  const [selectedTiming, setSelectedTiming] = useState<StatusTimingOption>()

  const currentStatus =
    STATUS_OPTIONS.find(status => status.id === userStatus) ??
    DEFAULT_STATUS_OPTION

  const tooltipText = selectedStatus
    ? `${selectedStatus.emoji} ${selectedStatus.label}${
        selectedTiming ? ` • ${selectedTiming.label}` : ''
      }`
    : `${user.name} - ${currentStatus.icon} ${currentStatus.label}`

  type Section = {
    id: string
    title: string
    label: string
    selected?: string
    options: { id: string; label: string; visual?: ReactNode }[]
    onSelect: (key: string) => void
  }
  const accountSections: Section[] = [
    {
      id: 'availability',
      title: 'Availability',
      label: currentStatus.label,
      selected: userStatus,
      options: STATUS_OPTIONS.map(status => ({
        id: status.id,
        label: status.label,
        visual: <StatusVisual status={status} />
      })),
      onSelect: key => {
        const status = STATUS_OPTIONS.find(option => option.id === key)
        if (status) setUserStatus(status.id)
      }
    },
    {
      id: 'custom-status',
      title: 'Custom status',
      label: selectedStatus
        ? `${selectedStatus.emoji} ${selectedStatus.label}`
        : 'Update your status',
      selected: selectedStatus?.id,
      options: [
        ...SUGGESTED_STATUS_OPTIONS.map(status => ({
          id: status.id,
          label: `${status.emoji} ${status.label}`
        })),
        { id: 'clear', label: 'Clear status' }
      ],
      onSelect: key => {
        if (key === 'clear') {
          setSelectedStatus(undefined)
          setSelectedTiming(undefined)
          return
        }
        const status = SUGGESTED_STATUS_OPTIONS.find(
          option => option.id === key
        )
        if (status) {
          setSelectedStatus(status)
          setSelectedTiming(STATUS_TIMING_OPTIONS[0])
        }
      }
    },
    ...(selectedStatus
      ? [
          {
            id: 'duration',
            title: 'Status duration',
            label: selectedTiming?.label ?? 'Select duration',
            selected: selectedTiming?.id,
            options: STATUS_TIMING_OPTIONS.map(timing => ({
              id: timing.id,
              label: timing.label
            })),
            onSelect: (key: string) => {
              const timing = STATUS_TIMING_OPTIONS.find(
                option => option.id === key
              )
              if (timing) setSelectedTiming(timing)
            }
          }
        ]
      : [])
  ]
  return { currentStatus, tooltipText, accountSections }
}

const UserMenu = ({ user, onLogout, onProfile, onPreferences }: Props) => {
  const small = useMediaQuery(APPLICATION_MENU_SHEET_MEDIA_QUERY, {
    initializeWithValue: false
  })
  const bubble = useMediaQuery(ACCOUNT_BUBBLE_MEDIA_QUERY, {
    initializeWithValue: false
  })
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState<string | null>(null)
  const { currentStatus, tooltipText, accountSections } =
    useAccountSections(user)
  const activeSection = accountSections.find(item => item.id === section)
  const changeOpen = (value: boolean) => {
    setOpen(value)
    if (!value) setSection(null)
  }
  const Trigger = small ? Button : Dropdown.Trigger
  const content = (
    <>
      <button
        type="button"
        className="hover:bg-default-100 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
        onClick={() => {
          setOpen(false)
          onProfile?.()
        }}>
        <Avatar size="sm">
          {user.avatar ? (
            <Avatar.Image src={user.avatar} alt={user.name} />
          ) : null}
          <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
        </Avatar>
        <span>
          <span className="block font-medium">{user.name}</span>
          <span className="text-muted flex items-center gap-1 text-xs">
            <StatusVisual status={currentStatus} />
            {currentStatus.label}
          </span>
        </span>
      </button>

      <Separator />

      {small ? (
        <div className="flex flex-col gap-1 p-2">
          {accountSections.map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className="h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-start"
              onPress={() => setSection(item.id)}>
              <span className="min-w-0 flex-1 truncate text-start">
                {item.label}
              </span>
              <AltArrowRight size={16} aria-hidden="true" />
            </Button>
          ))}
          <Separator />
          <Button
            variant="ghost"
            className="h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-start"
            onPress={() => {
              setOpen(false)
              onPreferences?.()
            }}>
            <SettingsIcon size={18} aria-hidden="true" />
            Preferences
          </Button>
          <Button
            variant="ghost"
            className="text-danger h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-start"
            onPress={() => {
              setOpen(false)
              onLogout()
            }}>
            <LogoutIcon size={18} aria-hidden="true" />
            Logout
          </Button>
        </div>
      ) : (
        <Dropdown.Menu aria-label="Account actions">
          {accountSections.map(item => (
            <Dropdown.SubmenuTrigger key={item.id}>
              <Dropdown.Item id={item.id} textValue={item.label}>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <Dropdown.SubmenuIndicator />
              </Dropdown.Item>
              <Dropdown.Popover className="z-90 w-64 max-w-[calc(100vw-2rem)]">
                <Dropdown.Menu
                  aria-label={item.title}
                  selectionMode="single"
                  selectedKeys={item.selected ? [item.selected] : []}
                  onAction={key => item.onSelect(String(key))}>
                  {item.options.map(option => (
                    <Dropdown.Item
                      key={option.id}
                      id={option.id}
                      textValue={option.label}
                      className={option.id === 'clear' ? 'text-danger' : ''}>
                      {option.visual}
                      <span className="min-w-0 flex-1">{option.label}</span>
                      <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.SubmenuTrigger>
          ))}
          <Separator />
          <Dropdown.Item
            id="preferences"
            onAction={() => {
              setOpen(false)
              onPreferences?.()
            }}>
            <SettingsIcon size={18} aria-hidden="true" />
            Preferences
          </Dropdown.Item>
          <Dropdown.Item
            id="logout"
            variant="danger"
            onAction={() => {
              setOpen(false)
              onLogout()
            }}>
            <LogoutIcon size={18} aria-hidden="true" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
    </>
  )
  const trigger = (
    <Tooltip delay={0}>
      <Tooltip.Trigger>
        <Trigger
          onPress={small ? () => setOpen(true) : undefined}
          aria-label={`Open ${user.name || 'user'} menu`}
          className={`button button--ghost relative flex h-12 w-12 items-center justify-center ${bubble ? 'rounded-full' : 'rounded-xl'}`}>
          <Badge.Anchor>
            <Avatar size="sm" className="h-6 w-6 rounded-md">
              {user.avatar ? (
                <Avatar.Image src={user.avatar} alt={user.name} />
              ) : null}
              <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
            </Avatar>
            <Badge
              placement="bottom-right"
              size="sm"
              className="border-background flex items-center justify-center border">
              <StatusVisual status={currentStatus} />
            </Badge>
          </Badge.Anchor>
        </Trigger>
      </Tooltip.Trigger>
      <Tooltip.Content placement={bubble ? 'bottom' : 'right'}>
        {tooltipText}
      </Tooltip.Content>
    </Tooltip>
  )

  return small ? (
    <>
      {trigger}
      <MenuSheet
        title="Account"
        hideTitle
        isOpen={open}
        onOpenChange={changeOpen}>
        {activeSection ? (
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-start"
              onPress={() => setSection(null)}
              aria-label="Back to account menu">
              <AltArrowLeft size={18} aria-hidden="true" />
              {activeSection.title}
            </Button>
            {activeSection.options.map(option => (
              <Button
                key={option.id}
                variant="ghost"
                className={`h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-start ${option.id === 'clear' ? 'text-danger' : ''}`}
                aria-pressed={activeSection.selected === option.id}
                onPress={() => {
                  activeSection.onSelect(option.id)
                  setSection(null)
                }}>
                {option.visual}
                <span className="min-w-0 flex-1 text-start">
                  {option.label}
                </span>
                {activeSection.selected === option.id && (
                  <CheckRead size={16} aria-hidden="true" />
                )}
              </Button>
            ))}
          </div>
        ) : (
          content
        )}
      </MenuSheet>
    </>
  ) : (
    <Dropdown isOpen={open} onOpenChange={changeOpen}>
      {trigger}
      <Dropdown.Popover
        placement={bubble ? 'bottom end' : 'right'}
        offset={8}
        className="w-72 max-w-[calc(100vw-2rem)]">
        {content}
      </Dropdown.Popover>
    </Dropdown>
  )
}

export { UserMenu }

import { useNavigate, useSearch } from '@tanstack/react-router'
import { useId, useState } from 'react'

import {
  AltArrowLeft,
  Bell,
  Settings,
  Sun,
  UserRounded
} from '@vezham/icons-react'
import { Avatar, Button, Drawer, Input, TextField } from '@vezham/react-v3'

import { AppIcon } from '../../components/app-icon'
import { TileContent } from '../../components/panel/footer/control-center'
import { AppearanceProvider } from '../../components/panel/footer/control-center/appearance'
import { resolveTiles } from '../../components/panel/footer/control-center/configured'
import { useTileEditor } from '../../components/panel/footer/control-center/editor'
import { PreviewProvider } from '../../components/panel/footer/control-center/preview'
import type { ControlCenterConfig } from '../../components/panel/footer/control-center/types'
import { useWidgetTiles } from '../../components/panel/footer/notification-center/widget-tiles'
import { ShortcutButton } from '../../components/shortcut-key'
import {
  useSidebarShortcut,
  useWorkspaceNavigation
} from '../../components/workspace-navigation'
import { useUser } from '../../store/users/useUserStore'
import type { SettingsSection } from './navigation'
import { SettingsContent } from './settings-content'
import { TileGallery } from './tile-gallery'

const sections = [
  { title: 'General', icon: Settings, keywords: 'language' },
  {
    title: 'Appearance',
    icon: Sun,
    keywords: 'theme light dark system'
  },
  {
    title: 'Notifications',
    icon: Bell,
    keywords: 'sounds badges'
  },
  {
    title: 'Account',
    icon: UserRounded,
    keywords: 'profile name email'
  },
  {
    title: 'Edit Widgets',
    icon: Settings,
    keywords: 'notification center tiles'
  },
  { title: 'Edit Controls', icon: Settings, keywords: 'control center tiles' }
] as const

export const validateSearch = (
  search: Record<string, unknown>
): { section: SettingsSection } => ({
  section: sections.some(section => section.title === search.section)
    ? (search.section as SettingsSection)
    : 'General'
})

export const SettingsRoute = ({
  controlCenter
}: {
  controlCenter?: ControlCenterConfig
}) => {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const { section } = validateSearch(search)
  return (
    <SettingsPage
      section={section}
      onSectionChange={next =>
        navigate({ to: '/settings', search: { section: next } })
      }
      controlCenter={controlCenter}
      onBack={() => navigate({ to: '/' })}
    />
  )
}

const categoryFor = (type: string) => {
  if (type.includes('appearance') || type.includes('theme')) return 'Appearance'
  if (
    [
      'preview-wifi',
      'preview-bluetooth',
      'preview-airdrop',
      'preview-mirroring'
    ].includes(type)
  )
    return 'Connectivity'
  if (type === 'preview-display') return 'Display & Brightness'
  if (type === 'preview-media' || type === 'preview-sound')
    return 'Sound & Media'
  return 'General'
}

const SettingsGallery = ({
  active,
  controlCenter,
  onDone
}: {
  active: SettingsSection
  controlCenter?: ControlCenterConfig
  onDone: () => void
}) => {
  const widgets = useWidgetTiles()
  const controls = useTileEditor(
    controlCenter ? resolveTiles(controlCenter, () => undefined) : []
  )
  if (active === 'Edit Widgets') {
    return (
      <TileGallery
        key="widgets"
        title="Edit Widgets"
        kind="widgets"
        editor={widgets.editor}
        tiles={widgets.orderedTiles.map(tile => ({
          ...tile,
          shape: tile.size,
          category: `${tile.size[0].toUpperCase()}${tile.size.slice(1)}`
        }))}
        onDone={onDone}
      />
    )
  }
  return (
    <AppearanceProvider>
      <PreviewProvider enabled>
        <TileGallery
          key="controls"
          title="Edit Controls"
          kind="controls"
          editor={controls.editor}
          tiles={controls.orderedTiles.map(tile => ({
            id: tile.id,
            label:
              controls.editor.items.find(item => item.id === tile.id)?.label ??
              tile.id,
            shape: tile.span,
            category: categoryFor(
              controlCenter?.tiles.find(item => item.id === tile.id)?.type ?? ''
            ),
            preview: (
              <TileContent entry={tile} context={{}} onOpen={() => undefined} />
            )
          }))}
          onDone={onDone}
        />
      </PreviewProvider>
    </AppearanceProvider>
  )
}

export const SettingsPage = ({
  onBack,
  section = 'General',
  onSectionChange,
  controlCenter
}: {
  onBack?: () => void
  section?: SettingsSection
  onSectionChange?: (section: SettingsSection) => void
  controlCenter?: ControlCenterConfig
}) => {
  const [localActive, setActive] = useState<SettingsSection>(section)
  const active = onSectionChange ? section : localActive
  const [query, setQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const sidebarId = useId()
  const { isNavigationCollapsed, toggleNavigation } = useWorkspaceNavigation()
  const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 768px)').matches) toggleNavigation()
    else setIsDrawerOpen(open => !open)
  }
  useSidebarShortcut(
    toggleSidebar,
    active !== 'Edit Widgets' && active !== 'Edit Controls'
  )
  const { user } = useUser()
  const visibleSections = sections.filter(section =>
    `${section.title} ${section.keywords}`
      .toLowerCase()
      .includes(query.toLowerCase().trim())
  )
  const openSection = (section: (typeof sections)[number]['title']) => {
    setActive(section)
    onSectionChange?.(section)
    setIsDrawerOpen(false)
  }

  if (active === 'Edit Widgets' || active === 'Edit Controls') {
    return (
      <SettingsGallery
        active={active}
        controlCenter={controlCenter}
        onDone={() => openSection('General')}
      />
    )
  }

  const sidebar = (
    <div className="px-4 py-2">
      {onBack && (
        <Button
          variant="ghost"
          className="mb-4 w-full justify-start gap-3 px-3 text-sm"
          onPress={onBack}>
          <AltArrowLeft size={18} />
          Back to app
        </Button>
      )}
      <h1 className="mb-4 px-3 text-lg font-semibold">Settings</h1>
      <TextField
        aria-label="Search settings"
        value={query}
        onChange={setQuery}
        className="mx-3 mb-4">
        <Input
          placeholder="Search settings"
          type="search"
          variant="secondary"
        />
      </TextField>
      <Button
        variant="ghost"
        className="mb-4 h-auto w-full justify-start gap-3 rounded-lg px-3 py-2 text-left"
        onPress={() => openSection('Account')}
        aria-label="Account profile">
        <Avatar className="size-11 shrink-0">
          <Avatar.Image src={user?.avatar ?? undefined} />
          <Avatar.Fallback>
            {user?.firstName?.slice(0, 1) || 'U'}
          </Avatar.Fallback>
        </Avatar>
        <span className="min-w-0">
          <span className="block truncate font-semibold">
            {[user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
              'Your account'}
          </span>
          <span className="text-muted block text-xs font-normal">
            Account settings
          </span>
        </span>
      </Button>
      <p className="text-muted mb-2 px-3 text-xs font-medium">App settings</p>
      <nav aria-label="Settings sections" className="space-y-1">
        {visibleSections.map(({ title, icon: Icon }) => (
          <Button
            key={title}
            variant="ghost"
            className={`h-auto min-h-0 w-full justify-start gap-3 rounded-full px-3 py-2 text-sm leading-5 ${active === title ? 'bg-surface-secondary text-foreground font-bold' : 'text-muted hover:bg-surface-secondary font-normal'}`}
            aria-current={active === title ? 'page' : undefined}
            onPress={() => openSection(title)}>
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            {title}
          </Button>
        ))}
        {visibleSections.length === 0 && (
          <p role="status" className="text-muted p-2 text-sm">
            No settings found.
          </p>
        )}
      </nav>
    </div>
  )
  return (
    <div className="h-full min-h-0 w-full">
      <div className="bg-background flex h-full min-h-0 overflow-hidden">
        {!isNavigationCollapsed && (
          <aside
            id={sidebarId}
            className="hidden h-full w-56 shrink-0 overflow-y-auto md:ml-24 md:block">
            {sidebar}
          </aside>
        )}

        <section
          aria-label={`${active} settings`}
          className="h-full min-w-0 flex-1 overflow-y-auto p-5 md:px-10 md:py-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <ShortcutButton
                label={isNavigationCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
                shortcut="⌘ S"
                aria-keyshortcuts="Meta+S"
                aria-controls={sidebarId}
                aria-expanded={!isNavigationCollapsed}
                className="hidden md:inline-flex"
                onPress={toggleNavigation}>
                <AppIcon icon="vx:sidebar" size={18} aria-hidden="true" />
              </ShortcutButton>
              <Button
                variant="ghost"
                size="sm"
                isIconOnly
                aria-label="Show Sidebar"
                aria-expanded={isDrawerOpen}
                className="md:hidden"
                onPress={() => setIsDrawerOpen(true)}>
                <AppIcon icon="vx:sidebar" size={18} aria-hidden="true" />
              </Button>
              <h2 className="text-xl font-semibold">{active}</h2>
            </div>
            <SettingsContent active={active} />
          </div>
        </section>
      </div>
      <Drawer.Backdrop isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content placement="left">
          <Drawer.Dialog className="bg-background w-[min(20rem,calc(100vw-2rem))]">
            <Drawer.Header>
              <Drawer.Heading>Settings</Drawer.Heading>
              <Drawer.CloseTrigger aria-label="Hide Sidebar" />
            </Drawer.Header>
            <Drawer.Body className="p-0">{sidebar}</Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </div>
  )
}

export { SettingsNavigationContext } from './navigation'
export type { SettingsSection } from './navigation'

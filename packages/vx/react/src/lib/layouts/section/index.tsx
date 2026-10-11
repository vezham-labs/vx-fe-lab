import { useHotkey } from '@tanstack/react-hotkeys'
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'

import { Drawer, Surface, Tabs, useMediaQuery } from '@vezham/react-v3'

import { AppIcon } from '../../components/app-icon'
import { ShortcutButton } from '../../components/shortcut-key'
import {
  useSidebarShortcut,
  useWorkspaceNavigation
} from '../../components/workspace-navigation'
import { type AppNavigationItem, getSelectedMenuKey } from '../../navigation'
import { useSectionPreferences } from './preferences'
import { SectionSidebar } from './sidebar'
import { useSectionSidebarState } from './sidebar-state'
import type { SectionSort } from './sort-menu'
import {
  type SectionAction,
  SectionActiveFilters,
  type SectionFilterKey,
  type SectionSearch,
  SectionToolbar,
  type SectionViewAction,
  type SectionViewMode
} from './toolbar'

export type SectionLayoutProps = {
  title: string
  sectionKey?: string
  navigationLabel?: string
  sidebarItems?: AppNavigationItem[]
  tabs: AppNavigationItem[]
  toolbar?: ReactNode
  search?: SectionSearch
  sync?: boolean
  filter?: boolean
  sort?: boolean
  onSortChange?: (value: SectionSort) => void
  view?: SectionViewAction[]
  onSync?: () => void
  menuActions?: SectionAction[]
  primaryAction?: SectionAction
  children: ReactNode
}

const EMPTY_SIDEBAR_ITEMS: AppNavigationItem[] = []
const EMPTY_MENU_ACTIONS: SectionAction[] = []
const EMPTY_VIEW_ACTIONS: SectionViewAction[] = []

const matchesPath = (pathname: string, href?: string) =>
  Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)))

const CompactTabs = ({
  title,
  displayTabs,
  search,
  primaryAction
}: {
  title: string
  displayTabs: AppNavigationItem[]
  search?: SectionSearch
  primaryAction?: SectionAction
}) => (
  <>
    {displayTabs.length > 0 && (
      <Tabs.ListContainer
        key={JSON.stringify(displayTabs.map(tab => tab.key))}
        className={`scrollbar-hide order-2 mb-3 w-fit min-w-0 self-center overflow-x-auto rounded-full ${
          search && primaryAction
            ? 'max-w-[calc(100%-9rem)]'
            : 'max-w-[calc(100%-1.5rem)]'
        }`}>
        <Tabs.List
          aria-label={`${title} tabs`}
          className="flex min-w-max flex-nowrap *:whitespace-nowrap">
          {displayTabs.map(tab => (
            <Tabs.Tab key={tab.key} id={tab.key} className="whitespace-nowrap">
              {tab.title}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    )}
  </>
)

const SectionPanels = ({
  displayTabs,
  selectedTab,
  children
}: {
  displayTabs: AppNavigationItem[]
  selectedTab?: AppNavigationItem
  children: ReactNode
}) => (
  <>
    {displayTabs.length === 0 && children}
    {displayTabs.map(tab => (
      <Tabs.Panel key={tab.key} id={tab.key} className="m-0 p-0">
        {tab.key === selectedTab?.key && children}
      </Tabs.Panel>
    ))}
  </>
)

const SectionBody = ({
  hasSidebar,
  isNavigationCollapsed,
  sidebarId,
  sidebar,
  filter,
  selectedFilters,
  setSelectedFilters,
  displayTabs,
  selectedTab,
  children
}: {
  hasSidebar: boolean
  isNavigationCollapsed: boolean
  sidebarId: string
  sidebar: ReactNode
  filter: boolean
  selectedFilters: SectionFilterKey[]
  setSelectedFilters: (filters: SectionFilterKey[]) => void
  displayTabs: AppNavigationItem[]
  selectedTab?: AppNavigationItem
  children: ReactNode
}) => (
  <div className="order-1 flex min-h-0 min-w-0 flex-1">
    {hasSidebar && !isNavigationCollapsed && (
      <aside
        id={sidebarId}
        className="hidden w-56 shrink-0 overflow-y-auto md:block">
        {sidebar}
      </aside>
    )}
    <main
      className={`flex min-w-0 flex-1 flex-col gap-2 overflow-auto p-4 ${
        filter && selectedFilters.length > 0 ? 'pt-2' : ''
      }`}>
      {filter && (
        <SectionActiveFilters
          selectedFilters={selectedFilters}
          onSelectedFiltersChange={setSelectedFilters}
        />
      )}
      <Surface className="relative min-h-0 flex-1 rounded-lg p-4 sm:p-5">
        <SectionPanels displayTabs={displayTabs} selectedTab={selectedTab}>
          {children}
        </SectionPanels>
      </Surface>
    </main>
  </div>
)

const SectionLayout = ({
  title,
  sectionKey,
  navigationLabel = `${title} sections`,
  sidebarItems = EMPTY_SIDEBAR_ITEMS,
  tabs,
  toolbar,
  search,
  sync = true,
  filter = false,
  sort = false,
  onSortChange,
  view = EMPTY_VIEW_ACTIONS,
  onSync,
  menuActions = EMPTY_MENU_ACTIONS,
  primaryAction,
  children
}: SectionLayoutProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const router = useRouter()
  const { isNavigationCollapsed, toggleNavigation, registerMobileSidebar } =
    useWorkspaceNavigation()
  const isCompactToolbar = useMediaQuery('(max-width: 767px)')
  const {
    expandedKeys: expandedSidebarKeys,
    setExpandedKeys: setExpandedSidebarKeys
  } = useSectionSidebarState(sidebarItems, pathname)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const stateScope =
    sectionKey ??
    getSelectedMenuKey(pathname, sidebarItems) ??
    (tabs.length > 0 ? JSON.stringify(tabs.map(tab => tab.key)) : title)
  const { selectedFilters, setSelectedFilters, sortValue, handleSortChange } =
    useSectionPreferences(stateScope, onSortChange)
  const [viewMode, setViewMode] = useState<SectionViewMode>('grid')
  const searchInput = useRef<HTMLInputElement>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const displayTabs = sidebarItems.some(
    item =>
      item.childrenDisplay === 'sidebar' && getSelectedMenuKey(pathname, [item])
  )
    ? []
    : tabs
  const selectedTab =
    displayTabs.find(tab => matchesPath(pathname, tab.href)) ?? displayTabs[0]
  const hasSidebar = sidebarItems.length > 0
  const toggleMobileSidebar = useCallback(
    () => setIsDrawerOpen(open => !open),
    []
  )
  const handleSync = useCallback(() => onSync?.(), [onSync])
  useEffect(() => {
    if (hasSidebar) {
      return registerMobileSidebar({
        isOpen: isDrawerOpen,
        onToggle: toggleMobileSidebar
      })
    }
    return undefined
  }, [hasSidebar, isDrawerOpen, registerMobileSidebar, toggleMobileSidebar])
  const sidebarId = useId()
  const toggleSidebar = () => {
    if (hasSidebar && !window.matchMedia('(min-width: 768px)').matches) {
      toggleMobileSidebar()
    } else {
      toggleNavigation()
    }
  }
  useSidebarShortcut(toggleSidebar)
  useHotkey('Meta+ArrowLeft', () => router.history.back())
  useHotkey('Meta+ArrowRight', () => router.history.forward())
  useHotkey(
    'Meta+R',
    () => {
      onSync?.()
    },
    { enabled: sync && Boolean(onSync) }
  )
  const sidebar = (
    <SectionSidebar
      items={sidebarItems}
      pathname={pathname}
      label={navigationLabel}
      expandedKeys={expandedSidebarKeys}
      onExpandedChange={setExpandedSidebarKeys}
      onNavigate={() => setIsDrawerOpen(false)}
    />
  )

  const content = (
    <>
      <SectionToolbar
        title={title}
        isNavigationCollapsed={isNavigationCollapsed}
        sync={sync}
        filter={filter}
        sort={sort}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        view={view}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={setSelectedFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        tabs={isCompactToolbar ? [] : displayTabs}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        search={
          search
            ? {
                ...search,
                inputRef: searchInput,
                isOpen: isSearchOpen,
                onOpenChange: setIsSearchOpen
              }
            : undefined
        }
        menuActions={menuActions}
        primaryAction={primaryAction}
        toolbar={toolbar}
        onSync={handleSync}
        navigationControls={
          <>
            {!isNavigationCollapsed && (
              <ShortcutButton
                className="h-9 w-9 min-w-9 p-0"
                label="Hide Sidebar"
                shortcut="⌘ S"
                aria-keyshortcuts="Meta+S"
                aria-controls={sidebarId}
                aria-expanded
                onPress={toggleNavigation}>
                <AppIcon icon="vx:sidebar" size={18} aria-hidden="true" />
              </ShortcutButton>
            )}
            <ShortcutButton
              className="hidden h-9 w-9 min-w-9 p-0 lg:inline-flex"
              label="Back"
              shortcut="⌘ ←"
              aria-keyshortcuts="Meta+ArrowLeft"
              onPress={() => router.history.back()}>
              <AppIcon icon="vx:arrow-left" size={18} aria-hidden="true" />
            </ShortcutButton>
            <ShortcutButton
              className="hidden h-9 w-9 min-w-9 p-0 lg:inline-flex"
              label="Forward"
              shortcut="⌘ →"
              aria-keyshortcuts="Meta+ArrowRight"
              onPress={() => router.history.forward()}>
              <AppIcon icon="vx:arrow-right" size={18} aria-hidden="true" />
            </ShortcutButton>
          </>
        }
      />
      {isCompactToolbar && (
        <CompactTabs
          title={title}
          displayTabs={displayTabs}
          search={search}
          primaryAction={primaryAction}
        />
      )}
      <SectionBody
        hasSidebar={hasSidebar}
        isNavigationCollapsed={isNavigationCollapsed}
        sidebarId={sidebarId}
        sidebar={sidebar}
        filter={filter}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        displayTabs={displayTabs}
        selectedTab={selectedTab}>
        {children}
      </SectionBody>
    </>
  )

  return (
    <div className="bg-background flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <Tabs
        selectedKey={selectedTab?.key ?? null}
        onSelectionChange={key => {
          const tab = displayTabs.find(item => item.key === key)
          if (tab?.href) void navigate({ to: tab.href })
        }}
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-0">
        {content}
      </Tabs>

      {hasSidebar && (
        <Drawer.Backdrop isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Drawer.Content placement="left">
            <Drawer.Dialog className="bg-background w-[min(20rem,calc(100vw-2rem))]">
              <Drawer.Header>
                <Drawer.Heading>{title}</Drawer.Heading>
                <Drawer.CloseTrigger aria-label="Hide Sidebar" />
              </Drawer.Header>
              <Drawer.Body>{sidebar}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      )}
    </div>
  )
}

export type {
  SectionAction,
  SectionFilterKey,
  SectionSearch,
  SectionViewAction,
  SectionViewMode
} from './toolbar'
export { SectionLayout }

export type { SectionSort } from './sort-menu'

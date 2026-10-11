import {
  type AppNavigationItem,
  getNavigationPageKey,
  getSelectedMenuKey
} from './navigation'

const items: AppNavigationItem[] = [
  { key: 'home', title: 'Home', href: '/' },
  {
    key: 'tabs',
    title: 'Tabs',
    href: '/tabs/overview',
    children: [
      { key: 'overview', title: 'Overview', href: '/tabs/overview' },
      { key: 'activity', title: 'Activity', href: '/tabs/activity' }
    ]
  },
  {
    key: 'workspace',
    title: 'Workspace',
    href: '/workspace/projects/overview',
    children: [
      {
        key: 'team',
        title: 'Team',
        children: [
          { key: 'roles', title: 'Roles', href: '/workspace/team/roles' }
        ]
      }
    ]
  }
]

describe('menu selection', () => {
  it.each([
    ['/', 'home'],
    ['/tabs/overview', 'tabs'],
    ['/tabs/activity', 'tabs'],
    ['/workspace/team/roles', 'workspace'],
    ['/workspace/team/roles/editor', 'workspace'],
    ['/tabs/activity-other', undefined],
    ['/hello-world', undefined],
    ['/unknown', undefined]
  ])('selects the owning menu for %s', (pathname, key) => {
    expect(getSelectedMenuKey(pathname, items)).toBe(key)
  })

  it('selects the most specific match across menus', () => {
    expect(
      getSelectedMenuKey('/tabs/activity', [
        { key: 'general', title: 'General', href: '/tabs' },
        ...items
      ])
    ).toBe('tabs')
  })

  it('matches submenu and nested item destinations', () => {
    expect(
      getSelectedMenuKey('/settings/profile', [
        {
          key: 'settings',
          title: 'Settings',
          submenu: [
            {
              key: 'account',
              title: 'Account',
              items: [
                {
                  key: 'profile',
                  title: 'Profile',
                  href: '/settings/profile'
                }
              ]
            }
          ]
        }
      ])
    ).toBe('settings')
  })
})

describe('application menu action scope', () => {
  it.each([
    ['/', 'home'],
    ['/tabs/overview', 'overview'],
    ['/tabs/activity', 'activity'],
    ['/workspace/team/roles/editor', 'roles'],
    ['/tabs/activity-other', ''],
    ['/unknown', '']
  ])('uses the deepest matching page for %s', (pathname, key) => {
    expect(getNavigationPageKey(items, pathname)).toBe(key)
  })
})

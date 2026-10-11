import type { AppNavigationItem } from './navigation'
import { getNavigationToolbar } from './navigation-toolbar'

const items: AppNavigationItem[] = [
  {
    key: 'academic',
    title: 'Academic',
    href: '/academic/classes',
    toolbar: {
      search: { label: 'Search', placeholder: 'Find records' },
      sync: true,
      filter: true,
      sort: true,
      view: [
        { key: 'grid', label: 'Grid view', icon: 'vx:grid' },
        { key: 'list', label: 'List view', icon: 'vx:list' }
      ],
      menuActions: [{ key: 'print', label: 'Print', icon: 'vx:printer' }],
      primaryAction: { key: 'create', label: 'Create', icon: 'vx:plus' }
    },
    children: [
      {
        key: 'classes',
        title: 'Classes',
        href: '/academic/classes',
        toolbar: {
          primaryAction: { key: 'create', label: 'Add Class', icon: 'vx:plus' }
        }
      },
      {
        key: 'exam',
        title: 'Exam',
        children: [
          {
            key: 'attendance',
            title: 'Attendance',
            href: '/academic/exam/attendance',
            toolbar: {
              primaryAction: false,
              search: false,
              sync: false,
              filter: false,
              sort: false,
              view: [],
              menuActions: []
            }
          }
        ]
      }
    ]
  }
]

describe('navigation toolbar', () => {
  it('resolves enabled search to its default label and placeholder', () => {
    expect(
      getNavigationToolbar(
        [
          {
            key: 'home',
            title: 'Home',
            href: '/',
            toolbar: { search: true }
          }
        ],
        '/'
      ).search
    ).toEqual({ label: 'Search content', placeholder: 'Search' })
  })
  it('inherits defaults and applies the leaf override when parent and leaf share a URL', () => {
    const toolbar = getNavigationToolbar(items, '/academic/classes')
    expect(toolbar.primaryAction).toMatchObject({ label: 'Add Class' })
    expect(toolbar.search).toEqual({
      label: 'Search',
      placeholder: 'Find records'
    })
    expect(toolbar.sync).toBe(true)
    expect(toolbar.filter).toBe(true)
    expect(toolbar.sort).toBe(true)
    expect(toolbar.view).toEqual([
      { key: 'grid', label: 'Grid view', icon: 'vx:grid' },
      { key: 'list', label: 'List view', icon: 'vx:list' }
    ])
    expect(toolbar.menuActions).toHaveLength(1)
  })

  it('supports disabling inherited controls and clearing menus through href-less groups', () => {
    expect(getNavigationToolbar(items, '/academic/exam/attendance')).toEqual({
      search: false,
      sync: false,
      filter: false,
      sort: false,
      view: [],
      menuActions: [],
      primaryAction: false
    })
  })

  it('matches nested destinations without matching similarly named paths', () => {
    expect(
      getNavigationToolbar(items, '/academic/classes/123').primaryAction
    ).toMatchObject({ label: 'Add Class' })
    expect(getNavigationToolbar(items, '/academic/classes-other')).toEqual({})
  })
})

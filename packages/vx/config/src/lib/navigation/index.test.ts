import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { runInNewContext } from 'node:vm'
import { ModuleKind, transpile } from 'typescript'
import { afterEach, describe, expect, it } from 'vitest'
import { stringify } from 'yaml'

import { getNavigationFiles } from './index'

const roots: string[] = []
const project = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'vx-nav-'))
  roots.push(root)
  return root
}
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true })
})

describe('navigation generation', () => {
  it('preserves child display modes and rejects unsupported values', () => {
    const root = project()
    const file = path.join(root, 'vx.nav.yaml')
    writeFileSync(
      file,
      stringify({
        navigation: [
          { key: 'exams', title: 'Exams', childrenDisplay: 'sidebar' },
          { key: 'classes', title: 'Classes', childrenDisplay: 'tabs' }
        ]
      })
    )
    expect(getNavigationFiles(root)[0].content).toContain(
      '"childrenDisplay": "sidebar"'
    )
    expect(getNavigationFiles(root)[0].content).toContain(
      '"childrenDisplay": "tabs"'
    )
    writeFileSync(
      file,
      stringify({
        navigation: [{ key: 'exams', title: 'Exams', childrenDisplay: 'auto' }]
      })
    )
    expect(() => getNavigationFiles(root)).toThrow(
      'childrenDisplay must be tabs or sidebar'
    )
  })

  it('rejects the old top-level items key', () => {
    const root = project()
    writeFileSync(path.join(root, 'vx.nav.yaml'), stringify({ items: [] }))
    expect(() => getNavigationFiles(root)).toThrow('must contain navigation')
  })

  it('looks up children, returns an empty list for leaves, and rejects missing keys', () => {
    const root = project()
    const children = [{ key: 'classes', title: 'Classes' }]
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({
        navigation: [
          { key: 'school', title: 'School', children },
          { key: 'home', title: 'Home' }
        ]
      })
    )
    const [file] = getNavigationFiles(root)
    const exports: {
      getNavigationChildren?: (key: string) => unknown
      navigationItems?: { key: string; children?: typeof children }[]
    } = {}
    runInNewContext(transpile(file.content, { module: ModuleKind.CommonJS }), {
      exports
    })
    const lookup = exports.getNavigationChildren
    if (!lookup) throw new Error('Generated navigation lookup was not exported')
    expect(lookup('school')).toEqual(children)
    const updatedChildren = [{ key: 'teachers', title: 'Teachers' }]
    const school = exports.navigationItems?.[0]
    if (!school) throw new Error('Generated navigation items were not exported')
    school.children = updatedChildren
    expect(lookup('school')).toBe(updatedChildren)
    expect(lookup('home')).toEqual([])
    expect(() => lookup('missing')).toThrow('Unknown navigation key: missing')
    expect(() => lookup('toString')).toThrow('Unknown navigation key: toString')
  })
  it('generates app menu metadata without executable behavior', () => {
    const root = project()
    const appMenu = [
      {
        key: 'file',
        label: 'File',
        groups: [
          [
            {
              key: 'file.new',
              label: 'New…',
              icon: 'vx:plus',
              shortcut: 'Mod N'
            }
          ]
        ]
      }
    ]
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: [], appMenu })
    )
    const exports: { appMenu?: unknown } = {}
    runInNewContext(
      transpile(getNavigationFiles(root)[0].content, {
        module: ModuleKind.CommonJS
      }),
      { exports }
    )
    expect(exports.appMenu).toEqual(appMenu)
  })

  it.each([
    null,
    [{ key: 'file', label: 'File', groups: [] }],
    [
      {
        key: 'file',
        label: 'File',
        groups: [[{ key: 'file.new', label: 'New', onPress: 'callback' }]]
      }
    ],
    [
      {
        key: 'file',
        label: 'File',
        groups: [
          [{ key: 'file.new', label: 'New' }],
          [{ key: 'file.new', label: 'Again' }]
        ]
      }
    ],
    [
      {
        key: 'file',
        label: 'File',
        groups: [[{ key: 'file.new', label: 'New', shortcut: 42 }]]
      }
    ]
  ])('rejects invalid app menus: %j', appMenu => {
    const root = project()
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: [], appMenu })
    )
    expect(() => getNavigationFiles(root)).toThrow()
  })

  it('is optional for apps without shell navigation', () => {
    expect(getNavigationFiles(project())).toEqual([])
  })

  it('accepts boolean search settings', () => {
    const root = project()
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({
        navigation: [
          { key: 'home', title: 'Home', toolbar: { search: true } },
          { key: 'other', title: 'Other', toolbar: { search: false } }
        ]
      })
    )
    const content = getNavigationFiles(root)[0].content
    expect(content).toContain('"search": true')
    expect(content).toContain('"search": false')
  })

  it('preserves serializable toolbar defaults and page overrides', () => {
    const root = project()
    const toolbar = {
      search: { label: 'Find', placeholder: 'Search records' },
      sync: true,
      filter: true,
      sort: true,
      view: [
        { key: 'grid', label: 'Grid view', icon: 'vx:grid' },
        { key: 'list', label: 'List view', icon: 'vx:list' }
      ],
      menuActions: [
        {
          key: 'export',
          label: 'Export',
          icon: 'vx:download',
          children: [{ key: 'export-pdf', label: 'PDF', icon: 'vx:file-text' }]
        }
      ],
      primaryAction: { key: 'create', label: 'Add', icon: 'vx:plus' }
    }
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({
        navigation: [
          {
            key: 'school',
            title: 'School',
            toolbar,
            children: [
              {
                key: 'attendance',
                title: 'Attendance',
                toolbar: { primaryAction: false }
              }
            ]
          }
        ]
      })
    )
    const exports: {
      navigationItems?: {
        toolbar: typeof toolbar
        children: { toolbar: { primaryAction: false } }[]
      }[]
    } = {}
    runInNewContext(
      transpile(getNavigationFiles(root)[0].content, {
        module: ModuleKind.CommonJS
      }),
      { exports }
    )
    expect(exports.navigationItems?.[0].toolbar).toEqual(toolbar)
    expect(exports.navigationItems?.[0].children[0].toolbar.primaryAction).toBe(
      false
    )
  })

  it('accepts disabling an individual view action', () => {
    const root = project()
    const toolbar = {
      view: [
        {
          key: 'list',
          label: 'Filter',
          icon: 'vx:sort-descending',
          enabled: false
        },
        { key: 'grid', label: 'Grid view', icon: 'vx:grid' }
      ]
    }
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: [{ key: 'home', title: 'Home', toolbar }] })
    )

    expect(getNavigationFiles(root)[0].content).toContain('"enabled": false')
  })

  it.each([
    { search: 'yes' },
    { sync: 'yes' },
    { filter: 'yes' },
    { sort: 'yes' },
    { view: 'yes' },
    { view: [{ key: 'list', label: 'Filter' }] },
    { view: [{ key: 'other', label: 'Other', icon: 'vx:other' }] },
    {
      view: [
        { key: 'grid', label: 'Grid', icon: 'vx:grid' },
        { key: 'grid', label: 'Another grid', icon: 'vx:grid' }
      ]
    },
    {
      view: [
        {
          key: 'list',
          label: 'Filter',
          icon: 'vx:sort-descending',
          enabled: 'false'
        }
      ]
    },
    { primaryAction: { key: 'create' } },
    {
      menuActions: [
        {
          key: 'print',
          label: 'Print',
          icon: 'vx:printer',
          onAction: 'callback'
        }
      ]
    },
    {
      menuActions: [
        { key: 'print', label: 'Print', icon: 'vx:printer' },
        { key: 'print', label: 'Again', icon: 'vx:printer' }
      ]
    },
    { primaryAction: null }
  ])('rejects invalid toolbar configuration: %j', toolbar => {
    const root = project()
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: [{ key: 'home', title: 'Home', toolbar }] })
    )
    expect(() => getNavigationFiles(root)).toThrow()
  })

  it('preserves ordered nested navigation and emits a typed module', () => {
    const root = project()
    const items = [
      {
        key: 'school',
        title: 'School',
        href: '/school',
        children: [
          {
            key: 'classes',
            title: 'Classes',
            href: '/school/classes',
            icon: 'vx:book'
          }
        ]
      }
    ]
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: items })
    )
    const [file] = getNavigationFiles(root)
    expect(file.path).toBe(path.join(root, 'src/generated/navigation.ts'))
    expect(file.content).toContain(JSON.stringify(items, null, 2))
    expect(file.content).toContain('satisfies AppNavigationItem[]')
  })

  it.each([
    [
      { key: 'home', title: 'Home' },
      { key: 'home', title: 'Duplicate' }
    ],
    [{ key: 'home', title: 'Home', children: [{ key: 'missing-title' }] }],
    [{ key: 'home', title: 'Home', onPress: 'callback' }],
    [{ key: 'home', title: 'Home', href: 42 }]
  ])('rejects invalid navigation before writing output: %j', (...items) => {
    const root = project()
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: items })
    )
    expect(() => getNavigationFiles(root)).toThrow()
  })
})

describe('control center configuration', () => {
  it.each(['true', 1, null])(
    'rejects a non-boolean editControls value: %j',
    editControls => {
      const root = project()
      writeFileSync(
        path.join(root, 'vx.nav.yaml'),
        stringify({
          navigation: [],
          controlCenter: { tiles: [], editControls }
        })
      )
      expect(() => getNavigationFiles(root)).toThrow(
        'editControls must be a boolean'
      )
    }
  )
  it('generates the configured tile order and custom action keys', () => {
    const root = project()
    const controlCenter = {
      editControls: true,
      tiles: [
        { id: 'language', type: 'language', span: 'wide' },
        { id: 'direction-toggle', type: 'direction-toggle', span: 'compact' },
        {
          id: 'workspace',
          type: 'custom',
          span: 'full',
          action: 'workspace.open'
        }
      ]
    }
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: [], controlCenter })
    )
    const [file] = getNavigationFiles(root)
    const generated = {
      exports: {} as { controlCenter?: typeof controlCenter }
    }
    runInNewContext(
      transpile(file.content, { module: ModuleKind.CommonJS }),
      generated
    )
    expect(generated.exports.controlCenter).toEqual(controlCenter)
  })

  it.each([
    [{ id: 'one', type: 'unknown', span: 'wide' }],
    [{ id: 'one', type: 'theme', span: 'tiny' }],
    [{ id: 'one', type: 'edit-controls', span: 'full' }],
    [
      {
        id: 'edit-controls',
        type: 'custom',
        action: 'custom.edit',
        span: 'full'
      }
    ],
    [{ id: 'one', type: 'custom', span: 'wide' }],
    [{ id: 'one', type: 'theme', span: 'wide', action: 'bad' }],
    [{ id: 'one', type: 'theme', span: 'wide', surprise: true }],
    [{ id: 'one', type: 'theme', span: 'wide', title: 'Old heading' }],
    [
      { id: 'one', type: 'theme', span: 'wide' },
      { id: 'one', type: 'theme', span: 'wide' }
    ]
  ])('rejects invalid tiles %j', (...tiles) => {
    const root = project()
    writeFileSync(
      path.join(root, 'vx.nav.yaml'),
      stringify({ navigation: [], controlCenter: { tiles } })
    )
    expect(() => getNavigationFiles(root)).toThrow()
  })
})

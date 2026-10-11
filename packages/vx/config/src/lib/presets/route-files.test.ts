import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { expandFilesystemRoute, routePathFromFile } from './route-files.ts'

const routesDir = path.resolve('src/routes')
const options = {
  emptyRoutePath: '/',
  rootRouteSegments: new Set(['__root', '__root__']),
  stripLazySuffix: true
}

describe('routePathFromFile', () => {
  it.each([
    ['index.lazy.tsx', '/'],
    ['guide/index.lazy.tsx', '/guide'],
    ['guide/index.tsx', '/guide'],
    ['guide/route.lazy.tsx', '/guide'],
    ['(group)/guide.lazy.tsx', '/guide'],
    ['guide/{$slug}.tsx', undefined],
    ['guide/$.tsx', undefined],
    ['guide/notes.mdx', undefined],
    ['guide/feed[.]xml.ts', '/guide/feed.xml']
  ])('resolves %s to %s', (file, expected) => {
    expect(
      routePathFromFile(routesDir, path.join(routesDir, file), options)
    ).toBe(expected)
  })
})

describe('expandFilesystemRoute', () => {
  it('expands only static files within the requested route root', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'vx-routes-'))
    try {
      for (const file of [
        'guide/index.lazy.tsx',
        'guide/start.tsx',
        'guide/$.tsx',
        'guides/index.tsx'
      ]) {
        const target = path.join(root, 'src/routes', file)
        mkdirSync(path.dirname(target), { recursive: true })
        writeFileSync(target, '')
      }
      expect(
        expandFilesystemRoute(
          root,
          { path: '/guide/**', source: 'routes' },
          options
        )
      ).toEqual(['/guide', '/guide/start'])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('leaves exact paths and docs globs to their own handlers', () => {
    expect(
      expandFilesystemRoute('.', { path: '/guide', source: 'routes' }, options)
    ).toEqual([])
    expect(
      expandFilesystemRoute('.', { path: '/guide/**', source: 'docs' }, options)
    ).toEqual([])
  })

  it('rejects a shared output file for a route glob', () => {
    expect(() =>
      expandFilesystemRoute(
        '.',
        {
          path: '/guide/**',
          source: 'routes',
          prerender: { outputPath: '/shared.html' }
        },
        options
      )
    ).toThrow('Unsupported prerender outputPath')
  })
})

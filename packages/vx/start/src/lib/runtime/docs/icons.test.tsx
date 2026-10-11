import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { loader } from '@vezham/docs-core/source'

import { docsIconsPlugin } from './icons'

describe('docs icon plugin', () => {
  it('applies page and folder frontmatter while preserving existing elements', () => {
    const existing = createElement('span', null, 'Custom icon')
    const files = [
      {
        type: 'page' as const,
        path: 'guide/index.mdx',
        data: {
          title: 'Guide',
          icon: 'Book',
          iconColor: 'red',
          iconWeight: 'filled',
          iconAlt: 'Read guide'
        }
      },
      {
        type: 'meta' as const,
        path: 'guide/meta.json',
        data: {
          title: 'Guides',
          icon: 'Folder',
          iconColor: 'blue',
          iconWeight: 'duotone',
          iconAlt: 'Guides folder'
        }
      },
      {
        type: 'page' as const,
        path: 'custom.mdx',
        data: { title: 'Custom' }
      }
    ]
    const source = loader({
      baseUrl: '/docs',
      source: { files },
      plugins: [
        {
          name: 'test:custom-icon',
          transformPageTree: {
            file(node) {
              if (node.name === 'Custom') node.icon = existing
              return node
            }
          }
        },
        docsIconsPlugin()
      ]
    })
    const tree = source.getPageTree()
    const folder = tree.children.find(node => node.type === 'folder')
    expect(folder?.type).toBe('folder')
    if (folder?.type !== 'folder') throw new Error('Expected guide folder')
    expect(
      renderToStaticMarkup(createElement('div', null, folder.icon))
    ).toContain('aria-label="Guides folder"')
    expect(
      renderToStaticMarkup(createElement('div', null, folder.icon))
    ).toContain('color:blue')
    const page =
      folder.index ?? folder.children.find(node => node.type === 'page')
    const markup = renderToStaticMarkup(createElement('div', null, page?.icon))
    expect(markup).toContain('aria-label="Read guide"')
    expect(markup).toContain('data-vx-icon-weight="filled"')
    expect(markup).toContain('color:red')
    const custom = tree.children.find(
      node => node.type === 'page' && node.name === 'Custom'
    )
    expect(custom?.icon).toBe(existing)
  })
})

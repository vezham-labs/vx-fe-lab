import { expect, it } from 'vitest'

import { DEFAULT_FOLDER_ICON } from './folder-modal/variants'
import { bookmarksToTreeItems, treeItemsToBookmarks } from './tree-data'
import type { BookmarkItem } from './types'

it('keeps folder hierarchy and metadata unchanged across repeated store round trips', () => {
  const data: BookmarkItem[] = [
    { id: 'root', name: 'Hello World', url: '/hello-world' },
    { id: 'doc', name: 'Docs', url: '/docs', folder: 'Development/Guides' }
  ]
  const tree = bookmarksToTreeItems(data)
  tree.push({
    id: 'empty-folder',
    title: 'Empty',
    kind: 'folder',
    color: 'blue',
    visualType: 'emoji',
    emoji: '📁',
    icon: DEFAULT_FOLDER_ICON,
    children: []
  })
  let saved = treeItemsToBookmarks(tree)
  for (let index = 0; index < 5; index++) {
    const rebuilt = bookmarksToTreeItems(saved)
    const next = treeItemsToBookmarks(rebuilt)
    expect(next).toEqual(saved)
    saved = next
  }
})

it('uses the structural parent for nested bookmarks with saved absolute folder paths', () => {
  const tree = bookmarksToTreeItems([
    {
      id: 'folder',
      name: 'Development',
      kind: 'folder',
      children: [
        {
          id: 'doc',
          name: 'Docs',
          url: '/docs',
          folder: 'Development',
          folderPath: ['Development']
        }
      ]
    }
  ])
  expect(tree[0].children?.map(item => item.title)).toEqual(['Docs'])
  expect(tree[0].children?.[0].kind).toBe('bookmark')
})

import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { docsPathFromMdx } from './mdx-path.ts'

const docsDir = path.resolve('content/docs')
const i18n = { defaultLanguage: 'en', languages: ['en', 'cn'] }

describe('docsPathFromMdx', () => {
  it.each([
    ['index.mdx', 'en', '/docs', '/docs/index.md'],
    ['index.cn.mdx', 'cn', '/docs', '/docs/index.md'],
    ['guide/index.mdx', 'en', '/docs/guide', '/docs/guide.md'],
    ['(group)/guide.cn.mdx', 'cn', '/docs/guide', '/docs/guide.md'],
    [
      '(group)/guide/start.mdx',
      'en',
      '/docs/guide/start',
      '/docs/guide/start.md'
    ],
    ['release.v2.mdx', 'en', '/docs/release.v2', '/docs/release.v2.md']
  ])(
    'resolves %s consistently for prerendering and OG images',
    (file, locale, routePath, markdownPath) => {
      expect(
        docsPathFromMdx(docsDir, '/docs', i18n, path.join(docsDir, file))
      ).toEqual({
        locale,
        routePath,
        markdownPath
      })
    }
  )

  it('ignores metadata files', () => {
    expect(
      docsPathFromMdx(docsDir, '/docs', i18n, path.join(docsDir, 'meta.json'))
    ).toBeUndefined()
  })
})

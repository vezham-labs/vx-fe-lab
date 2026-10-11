import { deserializePageTree } from '@vezham/docs-core/source/client'

import { createStaticDocsRuntime } from './index'

const setup = () => {
  const preload = vi.fn(async () => undefined)
  const docs = {
    toDocsSource: () => ({
      files: [
        {
          type: 'page' as const,
          path: 'index.mdx',
          data: { title: 'Overview', description: 'Documentation' }
        }
      ]
    }),
    getPage: () => ({ preload })
  }
  const runtime = createStaticDocsRuntime({
    docs,
    docsRoute: '/docs',
    i18n: { defaultLanguage: 'en', languages: ['en'] },
    head: {
      appName: 'Example',
      openGraphImage: '/og/image.png',
      siteDescription: 'Example documentation',
      siteUrl: 'https://example.com'
    }
  })

  return {
    preload,
    ...runtime
  }
}

describe('docs page runtime', () => {
  it('supports a source-only runtime without page configuration', () => {
    const runtime = createStaticDocsRuntime({
      docs: { toDocsSource: () => ({ files: [] }) },
      i18n: { defaultLanguage: 'en', languages: ['en'] }
    })

    expect(runtime.i18n.defaultLanguage).toBe('en')
    expect(runtime.source.getPages()).toEqual([])
    expect(runtime).not.toHaveProperty('createDocsLoader')
  })

  it('loads and preloads the index page from empty route params', async () => {
    const { createDocsLoader, preload } = setup()
    const page = await createDocsLoader()({ params: {} })

    expect(page).toMatchObject({
      title: 'Overview',
      locale: 'en',
      routePath: '/docs',
      markdownUrl: '/docs/index.md'
    })
    expect(preload).toHaveBeenCalledOnce()
  })

  it.each(['docs', 'notebook', 'flux', 'glass', 'home'])(
    'keeps the %s preview tree within its alias without changing the markdown endpoint',
    async shell => {
      const { createDocsLoader } = setup()
      const page = await createDocsLoader(`/ui-${shell}`)({ params: {} })

      expect(page.routePath).toBe(`/ui-${shell}`)
      expect(page.markdownUrl).toBe('/docs/index.md')
      expect(deserializePageTree(page.pageTree).children).toEqual([
        expect.objectContaining({ type: 'page', url: `/ui-${shell}` })
      ])
      const original = await createDocsLoader()({ params: {} })
      expect(deserializePageTree(original.pageTree).children).toEqual([
        expect.objectContaining({ type: 'page', url: '/docs' })
      ])
    }
  )

  it('rejects unsupported locales and missing pages', () => {
    const { getDocsPage } = setup()

    expect(() => getDocsPage({ lang: 'invalid', slugs: [] })).toThrow()
    expect(() => getDocsPage({ slugs: ['missing'] })).toThrow()
  })

  it('provides no page metadata before loader data is available', () => {
    expect(setup().getDocsRouteHead()).toEqual({})
  })
})

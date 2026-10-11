import { notFound } from '@tanstack/react-router'

import type { Item, Node, Root } from '@vezham/docs-core/page-tree'
import type { StaticSource } from '@vezham/docs-core/source'

import { type DocsRouteHeadOptions, getDocsRouteHead } from './head'
import {
  isOptionalLocaleParam,
  localizeRouteBase,
  normalizeLocale
} from './i18n'
import {
  decodeMarkdownUrl,
  defaultDocsRoute,
  encodeMarkdownUrl,
  replaceDocsRouteBase
} from './routes'
import { type createStaticDocsRuntimeBase } from './runtime'

export type DocsPageInput = {
  lang?: string
  pathFormat?: 'slug' | 'markdown-url'
  slugs: string[]
}

export const createDocsPageRuntime = <
  Docs extends StaticSource,
  const Languages extends readonly string[]
>({
  docs,
  runtime,
  head
}: {
  docs: { getPage: (path: string) => { preload: () => unknown } | undefined }
  runtime: ReturnType<typeof createStaticDocsRuntimeBase<Docs, Languages>>
  head: Omit<DocsRouteHeadOptions, 'defaultLanguage' | 'languages'>
}) => {
  const { i18n, source, preloadOpenAPIPage } = runtime
  const docsRoute = head.docsRoute ?? defaultDocsRoute

  const getDocsPage = ({ lang, pathFormat, slugs }: DocsPageInput) => {
    if (!isOptionalLocaleParam(i18n, lang)) {
      throw notFound()
    }

    const locale = normalizeLocale(i18n, lang)
    const resolvedSlugs =
      pathFormat === 'markdown-url' ? decodeMarkdownUrl(slugs) : slugs
    const page = source.getPage(resolvedSlugs, locale)

    if (!page) {
      throw notFound()
    }

    return { locale, page }
  }

  const loadDocsPage = async ({
    slugs,
    lang,
    routeBase = docsRoute
  }: {
    slugs: string[]
    lang?: string
    routeBase?: string
  }) => {
    const { locale, page } = getDocsPage({ slugs, lang })
    const resolvedRouteBase = localizeRouteBase({
      defaultLanguage: i18n.defaultLanguage,
      lang,
      languages: i18n.languages,
      routeBase
    })
    const remapPage = (item: Item): Item => ({
      ...item,
      url: replaceDocsRouteBase({
        docsRoute,
        languages: i18n.languages,
        pagePath: item.url,
        routeBase: resolvedRouteBase
      })
    })
    const remapNode = (node: Node): Node => {
      if (node.type === 'page') return remapPage(node)
      if (node.type !== 'folder') return node
      return {
        ...node,
        index: node.index ? remapPage(node.index) : undefined,
        children: node.children.map(remapNode)
      }
    }
    const remapTree = (tree: Root): Root => ({
      ...tree,
      $id: `${tree.$id ?? locale}:${resolvedRouteBase}`,
      children: tree.children.map(remapNode),
      fallback: tree.fallback ? remapTree(tree.fallback) : undefined
    })
    const data = {
      locale,
      title: page.data.title,
      description: page.data.description,
      routePath: replaceDocsRouteBase({
        docsRoute,
        languages: i18n.languages,
        pagePath: page.url,
        routeBase: resolvedRouteBase
      }),
      path: page.path,
      markdownUrl: encodeMarkdownUrl(
        page.slugs,
        page.locale,
        docsRoute,
        i18n.defaultLanguage
      ),
      pageTree: await source.serializePageTree(
        routeBase === docsRoute
          ? source.getPageTree(locale)
          : remapTree(source.getPageTree(locale))
      ),
      openapiData: await preloadOpenAPIPage(page)
    }

    await docs.getPage(data.path)?.preload()
    return data
  }

  return {
    getDocsPage,
    loadDocsPage,
    getDocsRouteHead: (data?: Awaited<ReturnType<typeof loadDocsPage>>) =>
      getDocsRouteHead(data, {
        ...head,
        defaultLanguage: i18n.defaultLanguage,
        languages: i18n.languages
      }),
    createDocsLoader:
      (routeBase = docsRoute) =>
      ({ params }: { params: { lang?: string; _splat?: string } }) =>
        loadDocsPage({
          slugs: params._splat?.split('/') ?? [],
          lang: params.lang,
          routeBase
        })
  }
}

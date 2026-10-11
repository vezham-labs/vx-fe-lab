import type { I18nConfig } from '@vezham/docs-core/i18n'
import {
  type SearchAPI,
  createFromSource
} from '@vezham/docs-core/search/server'
import { type StaticSource, llms, loader } from '@vezham/docs-core/source'

import { type DocsI18nInput, createDocsI18n } from './i18n'
import { docsIconsPlugin } from './icons'
import {
  type DocsOpenAPIPlugin,
  type DocsOpenAPIPreloader,
  type DocsOpenAPIRuntime,
  type OpenAPISourceFiles,
  createOpenAPIFromSources,
  getDocsLLMText,
  getOpenAPIDocumentId
} from './openapi'
import { defaultDocsRoute } from './routes'

export type DocsCollectionSource<Docs extends StaticSource = StaticSource> = {
  toDocsSource: () => Docs
}

export const createStaticDocsSource = <Docs extends StaticSource>(
  source: DocsCollectionSource<Docs>
) => {
  return source.toDocsSource()
}

export type CreateStaticDocsRuntimeOptions<
  Docs extends StaticSource,
  Languages extends readonly string[]
> = {
  docs: DocsCollectionSource<Docs>
  docsRoute?: string
  i18n: DocsI18nInput<Languages>
  openapiDir?: string
  openapiFiles?: OpenAPISourceFiles
  rootDocument?: string
  rootDocumentId?: string
}

export const createStaticDocsRuntimeBase = <
  Docs extends StaticSource,
  const Languages extends readonly string[]
>({
  docs,
  docsRoute,
  i18n: i18nConfig,
  openapiDir,
  openapiFiles,
  rootDocument,
  rootDocumentId
}: CreateStaticDocsRuntimeOptions<Docs, Languages>) => {
  const i18n = createDocsI18n(i18nConfig)
  const openapi = createOpenAPIFromSources({
    files: openapiFiles,
    openapiDir,
    rootDocument,
    rootDocumentId
  })

  return {
    i18n,
    ...createDocsRuntime({
      docs: createStaticDocsSource(docs),
      docsRoute,
      i18n,
      openapi
    })
  }
}

export const createDocsSource = <
  Docs extends StaticSource,
  I18n extends I18nConfig
>({
  docs,
  docsRoute = defaultDocsRoute,
  i18n,
  openapi
}: {
  docs: Docs
  docsRoute?: string
  i18n: I18n
  openapi: DocsOpenAPIPlugin
}) => {
  return loader(
    {
      docs
    },
    {
      baseUrl: docsRoute,
      i18n,
      plugins: [docsIconsPlugin(), openapi.loaderPlugin()]
    }
  )
}

export const createDocsRuntime = <
  Docs extends StaticSource,
  I18n extends I18nConfig
>({
  docs,
  docsRoute,
  i18n,
  openapi
}: {
  docs: Docs
  docsRoute?: string
  i18n: I18n
  openapi: DocsOpenAPIPlugin & DocsOpenAPIRuntime & DocsOpenAPIPreloader
}) => {
  const source = createDocsSource({ docs, docsRoute, i18n, openapi })

  return {
    source,
    preloadOpenAPIPage: (page: (typeof source)['$inferPage']) =>
      getOpenAPIDocumentId(page)
        ? openapi.preloadOpenAPIPage(page as never)
        : undefined,
    getLLMText: (page: (typeof source)['$inferPage']) =>
      getDocsLLMText(page, openapi)
  }
}

export const getDocsLLMSIndex = (source: unknown) => {
  return llms(source as Parameters<typeof llms>[0]).index()
}

export const createSearchServer = (source: unknown): SearchAPI => {
  return createFromSource(source as Parameters<typeof createFromSource>[0])
}

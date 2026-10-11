import type { StaticSource } from '@vezham/docs-core/source'

import { type DocsRouteHeadOptions } from './head'
import { createDocsPageRuntime } from './pages'
import {
  type CreateStaticDocsRuntimeOptions,
  createStaticDocsRuntimeBase
} from './runtime'

type PageOptions = {
  docs: { getPage: (path: string) => { preload: () => unknown } | undefined }
  head: Omit<
    DocsRouteHeadOptions,
    'defaultLanguage' | 'languages' | 'docsRoute'
  >
}

export function createStaticDocsRuntime<
  Docs extends StaticSource,
  const Languages extends readonly string[]
>(
  options: CreateStaticDocsRuntimeOptions<Docs, Languages> & PageOptions
): ReturnType<typeof createStaticDocsRuntimeBase<Docs, Languages>> &
  ReturnType<typeof createDocsPageRuntime<Docs, Languages>>

export function createStaticDocsRuntime<
  Docs extends StaticSource,
  const Languages extends readonly string[]
>(
  options: CreateStaticDocsRuntimeOptions<Docs, Languages>
): ReturnType<typeof createStaticDocsRuntimeBase<Docs, Languages>>

export function createStaticDocsRuntime<
  Docs extends StaticSource,
  const Languages extends readonly string[]
>(
  options: CreateStaticDocsRuntimeOptions<Docs, Languages> &
    ({ head?: never } | PageOptions)
) {
  const runtime = createStaticDocsRuntimeBase(options)

  if (!options.head) {
    return runtime
  }

  return {
    ...runtime,
    ...createDocsPageRuntime({
      docs: options.docs,
      runtime,
      head: { ...options.head, docsRoute: options.docsRoute }
    })
  }
}

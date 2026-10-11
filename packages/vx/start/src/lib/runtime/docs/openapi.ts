import { parse } from 'yaml'

import { type OpenAPIOptions, createOpenAPI } from '@vezham/docs-openapi/server'

type OpenAPIDocument = Exclude<
  NonNullable<OpenAPIOptions['input']>,
  string[]
>[string]

export type DocsOpenAPIPlugin = {
  loaderPlugin: () => ReturnType<
    ReturnType<typeof createOpenAPI>['loaderPlugin']
  >
}

export type DocsOpenAPIRuntime = {
  getSchema: (documentId: string) => Promise<unknown>
}

export type DocsOpenAPIPreloader = {
  preloadOpenAPIPage: (page: never) => Promise<unknown>
}

export type OpenAPISourceFiles = Record<string, string>

export type CreateOpenAPIFromSourcesOptions = {
  files?: OpenAPISourceFiles
  openapiDir?: string
  rootDocument?: string
  rootDocumentId?: string
}

export type DocsPageLike = {
  data: {
    _openapi?: {
      preload?: unknown
    }
    description?: string
    getText?: (mode: 'processed' | 'raw') => Promise<string>
    title?: string
  }
  locale?: string
  slugs?: string[]
  url: string
}

const slash = (value: string) => {
  return value.split('\\').join('/')
}

export const parseOpenAPIDocument = (
  filePath: string,
  source: string
): OpenAPIDocument => {
  return (
    filePath.endsWith('.json') ? JSON.parse(source) : parse(source)
  ) as OpenAPIDocument
}

export const openAPIDocumentIdFromPath = (
  filePath: string,
  openapiDir = 'openapi'
) => {
  const segments = slash(filePath).split('/')
  const openapiDirIndex = segments.lastIndexOf(openapiDir)
  const relativePath =
    openapiDirIndex === -1
      ? slash(filePath)
      : segments.slice(openapiDirIndex + 1).join('/')

  const idSegments = relativePath.replace(/\.(?:json|yaml|yml)$/, '').split('/')

  if (idSegments[idSegments.length - 1] === 'index') {
    idSegments.pop()
  }

  return idSegments.length === 0 ? 'openapi' : idSegments.join('/')
}

export const createOpenAPIFromSources = ({
  files = {},
  openapiDir,
  rootDocument,
  rootDocumentId = 'openapi'
}: CreateOpenAPIFromSourcesOptions) => {
  const input = {
    ...(rootDocument
      ? {
          [rootDocumentId]: parseOpenAPIDocument(
            'openapi/index.yaml',
            rootDocument
          )
        }
      : {}),
    ...Object.fromEntries(
      Object.entries(files).map(([filePath, source]) => [
        openAPIDocumentIdFromPath(filePath, openapiDir),
        parseOpenAPIDocument(filePath, source)
      ])
    )
  }

  return createOpenAPI({ input })
}

export const getOpenAPIDocumentId = (page: DocsPageLike) => {
  const preload = page.data._openapi?.preload

  return Array.isArray(preload) && typeof preload[0] === 'string'
    ? preload[0]
    : undefined
}

export const preloadDocsOpenAPIPage = async <Page extends DocsPageLike>(
  page: Page,
  openapi: {
    preloadOpenAPIPage: (page: Page) => Promise<unknown>
  }
) => {
  return getOpenAPIDocumentId(page)
    ? openapi.preloadOpenAPIPage(page)
    : undefined
}

export const getDocsLLMText = async (
  page: DocsPageLike,
  openapi?: Pick<DocsOpenAPIRuntime, 'getSchema'>
) => {
  const documentId = getOpenAPIDocumentId(page)

  if (documentId && openapi) {
    return JSON.stringify(await openapi.getSchema(documentId), null, 2)
  }

  if (!page.data.getText) {
    throw new Error(`Cannot render LLM text for ${page.url}`)
  }

  const processed = await page.data.getText('processed')

  return `# ${page.data.title ?? 'Untitled'} (${page.url})

${processed}`
}

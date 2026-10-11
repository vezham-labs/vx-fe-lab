import { Link } from '@tanstack/react-router'
import type { ComponentProps, ComponentType, ReactNode } from 'react'
import { Suspense, use } from 'react'

import {
  type SerializedPageTree,
  useDocsLoader
} from '@vezham/docs-core/source/client'

import {
  DocsLayout,
  type DocsLayoutProps,
  DocsPage
} from '../../../layouts/docs'
import { getMDXComponents } from '../../../mdx'
import { OpenAPIPage } from '../openapi'

type OpenAPIPageComponentProps = ComponentProps<typeof OpenAPIPage>
type Toc = ComponentProps<typeof DocsPage>['toc']

type MDXComponent = ComponentType<{
  components?: ReturnType<typeof getMDXComponents>
}>

type DocsSourcePage = {
  body: MDXComponent
  description?: ReactNode
  load: () => Promise<{ toc: Toc }>
  title?: ReactNode
}

export type DocsRoutePageData<Locale extends string = string> = {
  locale: Locale
  markdownUrl: string
  openapiData?: unknown
  pageTree: SerializedPageTree
  path: string
}

export type DocsRoutePageSource = {
  getPage: (path: string) => DocsSourcePage | undefined
}

type LoadedDocsRoutePageData<Locale extends string> = Omit<
  DocsRoutePageData<Locale>,
  'pageTree'
> & {
  pageTree: DocsLayoutProps['tree']
}

export type DocsRoutePageProps<Locale extends string = string> = {
  data: DocsRoutePageData<Locale>
  docs: DocsRoutePageSource
  getLayoutOptions: (
    locale: Locale
  ) => Omit<DocsLayoutProps, 'children' | 'shell' | 'tree'>
  shell?: DocsLayoutProps['shell']
}

const Content = ({
  docs,
  markdownUrl,
  openapiData,
  path,
  shell
}: {
  docs: DocsRoutePageSource
  markdownUrl: string
  openapiData: unknown
  path: string
  shell: DocsLayoutProps['shell']
}) => {
  const page = docs.getPage(path)

  if (!page) {
    throw new Error(`unknown page: ${path}`)
  }

  const { toc } = use(page.load())
  const MDX = page.body
  const components = getMDXComponents(
    openapiData
      ? {
          APIPage: props => (
            <OpenAPIPage
              {...({ ...openapiData, ...props } as OpenAPIPageComponentProps)}
            />
          ),
          OpenAPIPage: props => (
            <OpenAPIPage
              {...({ ...openapiData, ...props } as OpenAPIPageComponentProps)}
            />
          )
        }
      : undefined
  )

  if (openapiData) {
    return (
      <DocsPage full shell={shell} toc={toc}>
        <MDX components={components} />
      </DocsPage>
    )
  }

  return (
    <DocsPage
      description={page.description}
      markdownUrl={markdownUrl}
      shell={shell}
      title={page.title}
      toc={toc}>
      <MDX components={components} />
    </DocsPage>
  )
}

export const DocsRoutePage = <Locale extends string = string>({
  data,
  docs,
  getLayoutOptions,
  shell = 'docs'
}: DocsRoutePageProps<Locale>) => {
  const page = useDocsLoader(data) as LoadedDocsRoutePageData<Locale>
  const content = (
    <>
      <Link to={page.markdownUrl} hidden />
      <Suspense>
        <Content
          docs={docs}
          path={page.path}
          markdownUrl={page.markdownUrl}
          openapiData={page.openapiData}
          shell={shell}
        />
      </Suspense>
    </>
  )

  return (
    <DocsLayout
      {...getLayoutOptions(page.locale)}
      shell={shell}
      tree={page.pageTree}>
      {content}
    </DocsLayout>
  )
}

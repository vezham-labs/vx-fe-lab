import type { ComponentProps, ReactNode } from 'react'

import { DocsLayout as DocsLayoutPrimitive } from '@vezham/docs-react/layouts/docs'
import { DocsLayout as NotebookLayoutPrimitive } from '@vezham/docs-react/layouts/notebook'

import { layouts } from './layouts'
import { DocsPageContent, type DocsPageToc, getPageComponents } from './pages'

export type DocsShell = 'docs' | 'flux' | 'glass' | 'home' | 'notebook'

export type DocsLayoutProps = {
  children: ReactNode
  shell?: DocsShell
} & Omit<
  ComponentProps<typeof DocsLayoutPrimitive>,
  'children' | 'sidebar' | 'tabs' | 'tabMode'
> &
  Omit<
    ComponentProps<typeof NotebookLayoutPrimitive>,
    'children' | 'tabs' | 'tabMode'
  > &
  Pick<ComponentProps<typeof NotebookLayoutPrimitive>, 'tabs'> & {
    tabMode?:
      | ComponentProps<typeof DocsLayoutPrimitive>['tabMode']
      | ComponentProps<typeof NotebookLayoutPrimitive>['tabMode']
  }

export const DocsLayout = ({ shell = 'docs', ...props }: DocsLayoutProps) => {
  return layouts[shell](props)
}

export type DocsPageProps = {
  children: ReactNode
  description?: ReactNode
  full?: boolean
  markdownUrl?: string
  shell?: DocsShell
  title?: ReactNode
  toc: DocsPageToc
}

export const DocsPage = ({
  full,
  shell = 'docs',
  toc,
  ...props
}: DocsPageProps) => {
  const { Page, Body, Description, Title } = getPageComponents(shell)
  const content = full ? (
    <Body>{props.children}</Body>
  ) : (
    <DocsPageContent
      {...props}
      Body={Body}
      Description={Description}
      Title={Title}
    />
  )

  if (shell === 'home') {
    return (
      <article
        className={`mx-auto flex w-full min-w-0 flex-col gap-4 px-6 py-10 ${full ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {content}
      </article>
    )
  }

  return (
    <Page full={full} toc={toc}>
      {content}
    </Page>
  )
}

export const DocsLayoutShell = DocsLayout
export const DocsPageShell = DocsPage

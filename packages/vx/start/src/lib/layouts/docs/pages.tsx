import type { ComponentProps, ReactNode } from 'react'

import {
  DocsBody,
  DocsDescription,
  DocsPage as DocsPagePrimitive,
  DocsTitle
} from '@vezham/docs-react/layouts/docs/page'
import * as FluxPage from '@vezham/docs-react/layouts/flux/page'
import * as GlassPage from '@vezham/docs-react/layouts/glass/page'
import {
  DocsBody as NotebookDocsBody,
  DocsDescription as NotebookDocsDescription,
  DocsPage as NotebookDocsPage,
  DocsTitle as NotebookDocsTitle
} from '@vezham/docs-react/layouts/notebook/page'

import type { DocsShell } from './index'
import { PageActions } from './page-actions'

export type DocsPageToc = ComponentProps<typeof DocsPagePrimitive>['toc']

const pages = {
  docs: {
    Page: DocsPagePrimitive,
    Body: DocsBody,
    Description: DocsDescription,
    Title: DocsTitle
  },
  notebook: {
    Page: NotebookDocsPage,
    Body: NotebookDocsBody,
    Description: NotebookDocsDescription,
    Title: NotebookDocsTitle
  },
  flux: {
    Page: FluxPage.DocsPage,
    Body: FluxPage.DocsBody,
    Description: FluxPage.DocsDescription,
    Title: FluxPage.DocsTitle
  },
  glass: {
    Page: GlassPage.DocsPage,
    Body: GlassPage.DocsBody,
    Description: GlassPage.DocsDescription,
    Title: GlassPage.DocsTitle
  }
}

type PageComponents = (typeof pages)[keyof typeof pages]

type Props = {
  children: ReactNode
  description?: ReactNode
  markdownUrl?: string
  title?: ReactNode
} & Pick<PageComponents, 'Body' | 'Description' | 'Title'>

export const getPageComponents = (shell: DocsShell) => {
  return pages[shell === 'home' ? 'docs' : shell]
}

export const DocsPageContent = ({
  children,
  description,
  markdownUrl,
  title,
  Body,
  Description,
  Title
}: Props) => (
  <>
    {title || markdownUrl ? (
      <div className="flex flex-col items-start gap-3 lg:flex-row lg:justify-between lg:gap-4">
        {title ? <Title>{title}</Title> : <span />}
        {markdownUrl ? <PageActions markdownUrl={markdownUrl} /> : null}
      </div>
    ) : null}
    {description ? <Description>{description}</Description> : null}
    <Body>{children}</Body>
  </>
)

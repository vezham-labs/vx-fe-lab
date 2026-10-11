import { createElement } from 'react'
import type { ReactNode } from 'react'

import { DocsLayout as DocsLayoutPrimitive } from '@vezham/docs-react/layouts/docs'
import { DocsLayout as FluxLayoutPrimitive } from '@vezham/docs-react/layouts/flux'
import { GlassLayout } from '@vezham/docs-react/layouts/glass'
import { HomeLayout } from '@vezham/docs-react/layouts/home'
import { DocsLayout as NotebookLayoutPrimitive } from '@vezham/docs-react/layouts/notebook'

import type { DocsLayoutProps, DocsShell } from './index'

type Props = Omit<DocsLayoutProps, 'shell'>

const getLayoutInputs = (props: Props) => {
  const {
    tree,
    nav,
    links,
    githubUrl,
    i18n,
    themeSwitch,
    searchToggle,
    tabMode,
    ...layoutProps
  } = props
  return {
    children: props.children,
    tree,
    base: { nav, links, githubUrl, i18n, themeSwitch, searchToggle },
    layoutProps,
    tabMode
  }
}

const HomeDocsLayout = (props: Props) => {
  const { base, children } = getLayoutInputs(props)
  return <HomeLayout {...base}>{children}</HomeLayout>
}

const GlassDocsLayout = (props: Props) => {
  const { base, children, tree } = getLayoutInputs(props)
  return (
    <GlassLayout {...base} tree={tree} tabs={{ transform: option => option }}>
      {children}
    </GlassLayout>
  )
}

const FluxDocsLayout = (props: Props) => {
  const { base, children, tree } = getLayoutInputs(props)
  return (
    <FluxLayoutPrimitive
      {...base}
      tree={tree}
      containerProps={{ className: '[&>[data-layout-main]]:w-full' }}>
      {children}
    </FluxLayoutPrimitive>
  )
}

const NotebookDocsLayout = (props: Props) => {
  const { base, children, layoutProps, tabMode, tree } = getLayoutInputs(props)
  const notebookTabMode =
    tabMode === 'top' ? 'navbar' : tabMode === 'auto' ? 'sidebar' : tabMode

  return (
    <NotebookLayoutPrimitive
      {...base}
      {...layoutProps}
      tree={tree}
      tabMode={notebookTabMode}>
      {children}
    </NotebookLayoutPrimitive>
  )
}

const StandardDocsLayout = (props: Props) => {
  const { base, children, layoutProps, tabMode, tree } = getLayoutInputs(props)
  const { sidebar, ...docsLayoutProps } = layoutProps
  const { banner, footer, ...sidebarProps } = sidebar ?? {}
  const docsTabMode =
    tabMode === 'navbar' ? 'top' : tabMode === 'sidebar' ? 'auto' : tabMode

  return (
    <DocsLayoutPrimitive
      {...base}
      {...docsLayoutProps}
      sidebar={
        sidebar && {
          ...sidebarProps,
          banner: typeof banner === 'function' ? createElement(banner) : banner,
          footer: typeof footer === 'function' ? createElement(footer) : footer
        }
      }
      tree={tree}
      tabMode={docsTabMode}>
      {children}
    </DocsLayoutPrimitive>
  )
}

export const layouts: Record<DocsShell, (props: Props) => ReactNode> = {
  docs: StandardDocsLayout,
  flux: FluxDocsLayout,
  glass: GlassDocsLayout,
  home: HomeDocsLayout,
  notebook: NotebookDocsLayout
}

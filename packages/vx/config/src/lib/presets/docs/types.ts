export type DocsStaticPaths = {
  defaultDocsStaticPaths: string[]
  docsShellStaticPaths: string[]
  docsStaticPathsByLocale: Record<string, string[]>
  openApiStaticPaths: string[]
}

export type DocsPrerenderPage = {
  path: string
  prerender?: {
    outputPath: string
  }
}

export type RouteOg =
  | boolean
  | {
      image?: string
    }

export type RouteConfig = {
  og?: RouteOg
  path: string
  prerender?:
    | boolean
    | {
        outputPath?: string
      }
  source?: 'docs' | 'routes'
}

export type RouteInput = RouteConfig | string

export type DocsPrerenderPagesOptions = {
  extraPages?: Array<DocsPrerenderPage | string>
  includeDocsRoot?: boolean
  includeLocalizedDocsRoots?: boolean
  routes?: RouteInput[]
}

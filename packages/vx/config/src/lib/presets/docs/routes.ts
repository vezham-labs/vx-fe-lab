import path from 'node:path'

import { unique, walkFiles } from '../files.ts'
import {
  expandFilesystemRoute,
  normalizeRoute,
  routeRootFromGlob
} from '../route-files.ts'
import {
  type DocsConfig,
  type I18nConfig,
  loadVxDocsConfig,
  resolveDocsConfig
} from './config.ts'
import { docsPathFromMdx } from './mdx-path.ts'
import {
  type DocsPrerenderPage,
  type DocsPrerenderPagesOptions,
  type DocsStaticPaths,
  type RouteConfig,
  type RouteInput
} from './types.ts'

const docsRouteFileOptions = {
  rootRouteSegments: new Set(['__root__'])
}

const getNonDefaultLanguages = (i18n: I18nConfig) => {
  return i18n.languages.filter(lang => lang !== i18n.defaultLanguage)
}

const getDocsStaticPathsForLocale = (
  docsDir: string,
  docsRoute: string,
  i18n: I18nConfig,
  locale: string
) => {
  return unique(
    walkFiles(docsDir)
      .map(filePath => docsPathFromMdx(docsDir, docsRoute, i18n, filePath))
      .filter(entry => entry?.locale === locale)
      .flatMap(entry => (entry ? [entry.routePath, entry.markdownPath] : []))
  )
}

export const getDocsStaticPaths = (
  projectRoot: string,
  config: DocsConfig = {},
  i18n: I18nConfig
): DocsStaticPaths => {
  const resolved = resolveDocsConfig(config)
  const docsDir = path.resolve(projectRoot, resolved.docsDir)
  const defaultDocsStaticPaths = getDocsStaticPathsForLocale(
    docsDir,
    resolved.docsRoute,
    i18n,
    i18n.defaultLanguage
  )
  const openApiStaticPaths = defaultDocsStaticPaths.filter(pagePath =>
    pagePath.startsWith(`${resolved.docsRoute}/openapi/`)
  )
  const docsShellStaticPaths = defaultDocsStaticPaths.filter(
    pagePath => !pagePath.endsWith('.md')
  )
  const docsStaticPathsByLocale = Object.fromEntries(
    i18n.languages.map(lang => [
      lang,
      unique([
        ...getDocsStaticPathsForLocale(docsDir, resolved.docsRoute, i18n, lang),
        ...openApiStaticPaths
      ])
    ])
  )

  return {
    defaultDocsStaticPaths,
    docsShellStaticPaths,
    docsStaticPathsByLocale,
    openApiStaticPaths
  }
}

const shouldWritePrerenderIndex = (pagePath: string) => {
  return path.extname(pagePath) === '' && !pagePath.startsWith('/api/')
}

const isDocsShellPath = (pagePath: string) => {
  return !pagePath.endsWith('.md')
}

const createDocsPrerenderPage = (pagePath: string): DocsPrerenderPage => {
  return {
    path: pagePath,
    prerender: shouldWritePrerenderIndex(pagePath)
      ? {
          outputPath: `${pagePath}/index.html`
        }
      : undefined
  }
}

const normalizeDocsPrerenderPage = (
  page: DocsPrerenderPage | string
): DocsPrerenderPage => {
  return typeof page === 'string' ? createDocsPrerenderPage(page) : page
}

const replaceDocsRoute = (
  pagePath: string,
  docsRoute: string,
  nextRoute: string
) => {
  if (pagePath === docsRoute) {
    return nextRoute
  }

  return pagePath.startsWith(`${docsRoute}/`)
    ? `${nextRoute}${pagePath.slice(docsRoute.length)}`
    : pagePath
}

const shouldPrerenderRoute = (route: RouteConfig) => {
  return route.prerender !== false
}

const docsMirrorRouteFromRoute = (route: RouteConfig) => {
  const routeRoot = routeRootFromGlob(route.path)

  return routeRoot && route.source === 'docs' ? routeRoot : undefined
}

const createFilesystemRoutePrerenderPages = (
  projectRoot: string,
  route: RouteConfig
) => {
  return expandFilesystemRoute(projectRoot, route, docsRouteFileOptions).map(
    pagePath => createDocsPrerenderPageFromRoute({ ...route, path: pagePath })
  )
}

const shouldGenerateDocsRouteOg = (route: RouteConfig) => {
  const hasDocsMirrorGlob = docsMirrorRouteFromRoute(route) !== undefined

  if (typeof route.og === 'object') {
    return false
  }

  return route.og ?? hasDocsMirrorGlob
}

const assertSupportedRoute = (route: RouteConfig) => {
  const routeRoot = routeRootFromGlob(route.path)

  if (!routeRoot || route.source === 'docs' || route.source === 'routes') {
    return
  }

  throw new Error(
    `Unsupported route source "${route.source ?? 'none'}" for glob route "${route.path}". Use source "docs", source "routes", or provide an exact path.`
  )
}

const createDocsPrerenderPageFromRoute = (
  route: RouteConfig
): DocsPrerenderPage => {
  if (typeof route.prerender === 'object' && route.prerender.outputPath) {
    return {
      path: route.path,
      prerender: {
        outputPath: route.prerender.outputPath
      }
    }
  }

  return createDocsPrerenderPage(route.path)
}

export const getDocsMirrorRoutes = (routes: RouteInput[]) => {
  return unique(
    routes
      .map(normalizeRoute)
      .filter(shouldGenerateDocsRouteOg)
      .map(docsMirrorRouteFromRoute)
      .filter(route => route !== undefined)
  )
}

const uniquePrerenderPages = (pages: DocsPrerenderPage[]) => {
  return [...new Map(pages.map(page => [page.path, page])).values()]
}

export const getDocsPrerenderPages = (
  projectRoot: string,
  config: DocsConfig = {},
  i18n: I18nConfig,
  {
    extraPages = [],
    includeDocsRoot = true,
    includeLocalizedDocsRoots = true,
    routes = []
  }: DocsPrerenderPagesOptions = {}
) => {
  const resolved = resolveDocsConfig(config)
  const {
    defaultDocsStaticPaths,
    docsShellStaticPaths,
    docsStaticPathsByLocale
  } = getDocsStaticPaths(projectRoot, config, i18n)
  const routeEntries = routes.map(normalizeRoute).filter(shouldPrerenderRoute)

  for (const route of routeEntries) {
    assertSupportedRoute(route)
  }

  const globDocsRoutes = unique([
    ...routeEntries.flatMap(route => {
      const docsRoute = docsMirrorRouteFromRoute(route)

      return docsRoute ? [docsRoute] : []
    })
  ])
  const staticRoutes = routeEntries.filter(
    route => !routeRootFromGlob(route.path)
  )

  return uniquePrerenderPages([
    ...(includeDocsRoot ? [createDocsPrerenderPage(resolved.docsRoute)] : []),
    ...defaultDocsStaticPaths.map(createDocsPrerenderPage),
    ...globDocsRoutes.flatMap(route =>
      docsShellStaticPaths.map(pagePath =>
        createDocsPrerenderPage(
          replaceDocsRoute(pagePath, resolved.docsRoute, route)
        )
      )
    ),
    ...getNonDefaultLanguages(i18n).flatMap(lang =>
      globDocsRoutes.flatMap(route =>
        docsStaticPathsByLocale[lang]
          .filter(isDocsShellPath)
          .map(pagePath =>
            createDocsPrerenderPage(
              `/${lang}${replaceDocsRoute(pagePath, resolved.docsRoute, route)}`
            )
          )
      )
    ),
    ...getNonDefaultLanguages(i18n).flatMap(lang => [
      ...(includeLocalizedDocsRoots
        ? [
            createDocsPrerenderPage(`/${lang}`),
            createDocsPrerenderPage(`/${lang}${resolved.docsRoute}`)
          ]
        : []),
      ...docsStaticPathsByLocale[lang].map(pagePath =>
        createDocsPrerenderPage(`/${lang}${pagePath}`)
      )
    ]),
    ...routeEntries.flatMap(route =>
      createFilesystemRoutePrerenderPages(projectRoot, route)
    ),
    ...staticRoutes.map(createDocsPrerenderPageFromRoute),
    ...extraPages.map(normalizeDocsPrerenderPage)
  ])
}

export const getPrerenderPages = (
  projectRoot = process.cwd(),
  options: DocsPrerenderPagesOptions = {}
) => {
  const { docs, i18n, routes } = loadVxDocsConfig(projectRoot)

  return getDocsPrerenderPages(projectRoot, docs, i18n, {
    ...options,
    routes: [...routes, ...(options.routes ?? [])]
  })
}

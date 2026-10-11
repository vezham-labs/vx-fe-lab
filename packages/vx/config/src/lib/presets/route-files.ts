import path from 'node:path'

import { slash, unique, walkFiles, withoutExtension } from './files.ts'

type RouteFileOptions = {
  emptyRoutePath?: string
  rootRouteSegments: ReadonlySet<string>
  stripLazySuffix?: boolean
}

type RouteLike = {
  path: string
}

type FilesystemRoute = RouteLike & {
  source?: string
  prerender?: boolean | { outputPath?: string }
}

const routeFileExtensions = new Set(['.js', '.jsx', '.ts', '.tsx'])

const decodeRouteSegment = (segment: string) => {
  return segment.split('[.]').join('.')
}

const isPathlessRouteSegment = (segment: string) => {
  return segment.startsWith('(') && segment.endsWith(')')
}

const isDynamicRouteSegment = (segment: string) => {
  return segment === '$' || segment.includes('$') || segment.includes('{')
}

export const routeRootFromGlob = (pagePath: string) => {
  const globSuffix = '/**'

  return pagePath.endsWith(globSuffix)
    ? pagePath.slice(0, -globSuffix.length)
    : undefined
}

export const normalizeRoute = <Route extends RouteLike>(
  route: Route | string
) => {
  return typeof route === 'string' ? { path: route } : route
}

export const routePathFromFile = (
  routesDir: string,
  filePath: string,
  { emptyRoutePath, rootRouteSegments, stripLazySuffix }: RouteFileOptions
) => {
  if (!routeFileExtensions.has(path.extname(filePath))) {
    return
  }

  const segments = withoutExtension(slash(path.relative(routesDir, filePath)))
    .split('/')
    .filter(segment => !rootRouteSegments.has(segment))

  if (stripLazySuffix && segments[segments.length - 1]?.endsWith('.lazy')) {
    const index = segments.length - 1

    segments[index] = segments[index].slice(0, -'.lazy'.length)
  }

  const lastSegment = segments[segments.length - 1]
  if (lastSegment === 'index' || lastSegment === 'route') {
    segments.pop()
  }

  const routeSegments = segments
    .filter(segment => !isPathlessRouteSegment(segment))
    .map(decodeRouteSegment)

  if (routeSegments.some(isDynamicRouteSegment)) {
    return
  }

  return routeSegments.length === 0
    ? emptyRoutePath
    : `/${routeSegments.join('/')}`
}

const getStaticFilesystemRoutes = (
  projectRoot: string,
  routeRoot: string,
  options: RouteFileOptions
) => {
  const routesDir = path.join(projectRoot, 'src/routes')

  return unique(
    walkFiles(routesDir)
      .map(filePath => routePathFromFile(routesDir, filePath, options))
      .filter(routePath => routePath !== undefined)
      .filter(
        routePath =>
          routePath === routeRoot || routePath.startsWith(`${routeRoot}/`)
      )
      .sort((left, right) => left.localeCompare(right))
  )
}

export const expandFilesystemRoute = (
  projectRoot: string,
  route: FilesystemRoute,
  options: RouteFileOptions
) => {
  const routeRoot = routeRootFromGlob(route.path)

  if (!routeRoot || route.source !== 'routes') return []

  if (typeof route.prerender === 'object' && route.prerender.outputPath) {
    throw new Error(
      `Unsupported prerender outputPath for filesystem route glob "${route.path}". Use exact paths for custom output paths.`
    )
  }

  return getStaticFilesystemRoutes(projectRoot, routeRoot, options)
}

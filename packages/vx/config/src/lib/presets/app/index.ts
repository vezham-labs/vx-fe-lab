import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { mergeConfig } from 'vite'
import type { ConfigEnv } from 'vite'

import {
  type ViteConfig,
  type ViteConfigOverrides,
  createViteConfig,
  getViteConfig
} from '@vx/config/vite'

import { readYamlConfig } from '../../yaml-config.ts'
import { unique, walkFiles } from '../files.ts'
import {
  expandFilesystemRoute,
  normalizeRoute,
  routePathFromFile,
  routeRootFromGlob
} from '../route-files.ts'

type TsConfigWithPaths = {
  compilerOptions?: {
    paths?: Record<string, string[]>
  }
}

const trimTrailingWildcard = (value: string) =>
  value.endsWith('/*') ? value.slice(0, -2) : value

const getTsConfigPathAliases = (projectRoot = process.cwd()) => {
  const tsconfigFile = path.resolve(projectRoot, 'tsconfig.app.json')

  if (!fs.existsSync(tsconfigFile)) {
    return {}
  }

  try {
    const tsconfig = JSON.parse(
      fs.readFileSync(tsconfigFile, 'utf8')
    ) as TsConfigWithPaths
    const paths = tsconfig.compilerOptions?.paths ?? {}

    return Object.fromEntries(
      Object.entries(paths)
        .map(([alias, values]) => {
          const value = values[0]

          if (!value) {
            return null
          }

          return [
            trimTrailingWildcard(alias),
            path.resolve(projectRoot, trimTrailingWildcard(value))
          ]
        })
        .filter(entry => entry !== null)
    )
  } catch {
    return {}
  }
}

const getServerConfig = () => {
  const { env } = process
  const hostname = env.CI ? 'localhost' : env.HOST_NAME || 'localhost'

  return {
    port: Number(env.PORT),
    host: hostname
  }
}

const getPreviewConfig = () => {
  const { env } = process
  const hostname = env.CI ? 'localhost' : env.HOST_NAME || 'localhost'
  const configuredPort = Number(env.PRE_PORT) || Number(env.PORT)

  return {
    port: env.TSS_PRERENDERING === 'true' ? 0 : configuredPort || undefined,
    host: hostname
  }
}

const getReactPackageDir = (projectRoot = process.cwd()) => {
  const requireFromProject = createRequire(
    path.join(projectRoot, 'package.json')
  )

  return path.dirname(requireFromProject.resolve('react/package.json'))
}

const getViteDefaults = (projectRoot = process.cwd()): ViteConfig => ({
  ...getViteConfig(projectRoot),
  envPrefix: ['V_'],
  server: getServerConfig(),
  resolve: {
    alias: getTsConfigPathAliases(projectRoot),
    tsconfigPaths: true
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})

const getPreviewOverride = (env: ConfigEnv): ViteConfig => ({
  preview:
    process.env.TSS_PRERENDERING === 'true'
      ? {
          host: 'localhost',
          port: 0
        }
      : env.command === 'build'
        ? undefined
        : getPreviewConfig()
})

const getResolveOverride = (
  env: ConfigEnv,
  projectRoot = process.cwd()
): ViteConfig => ({
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias:
      env.command === 'build'
        ? {
            'react/jsx-dev-runtime': path.join(
              getReactPackageDir(projectRoot),
              'cjs/react-jsx-dev-runtime.development.js'
            )
          }
        : undefined
  }
})

export const defineConfig = (overrides: ViteConfigOverrides = {}) =>
  createViteConfig(
    (projectRoot, env) =>
      mergeConfig(
        mergeConfig(getViteDefaults(projectRoot), getPreviewOverride(env)),
        getResolveOverride(env, projectRoot)
      ) as ViteConfig,
    overrides
  )

export type PrerenderPage = {
  path: string
  prerender?: {
    outputPath: string
  }
}

export type RouteConfig = {
  path: string
  prerender?:
    | boolean
    | {
        outputPath?: string
      }
  source?: 'routes'
}

export type RouteInput = RouteConfig | string

type VxAppConfig = {
  routes?: RouteInput[]
}

export type PrerenderPagesOptions = {
  routes?: RouteInput[]
}

const uniquePrerenderPages = (pages: PrerenderPage[]) => {
  return [...new Map(pages.map(page => [page.path, page])).values()]
}

const appRouteFileOptions = {
  emptyRoutePath: '/',
  rootRouteSegments: new Set(['__root', '__root__']),
  stripLazySuffix: true
}

const getStaticPageRoutes = (projectRoot: string) => {
  const routesDir = path.join(projectRoot, 'src/routes')

  return unique(
    walkFiles(routesDir)
      .filter(filePath => ['.jsx', '.tsx'].includes(path.extname(filePath)))
      .map(filePath =>
        routePathFromFile(routesDir, filePath, appRouteFileOptions)
      )
      .filter(routePath => routePath !== undefined)
      .filter(routePath => !routePath.startsWith('/api/'))
      .sort((left, right) => left.localeCompare(right))
  )
}

const createPrerenderPage = (route: RouteConfig): PrerenderPage => {
  if (typeof route.prerender === 'object' && route.prerender.outputPath) {
    return {
      path: route.path,
      prerender: {
        outputPath: route.prerender.outputPath
      }
    }
  }

  const shouldWriteIndex =
    route.path !== '/' &&
    path.extname(route.path) === '' &&
    !route.path.startsWith('/api/')

  return {
    path: route.path,
    prerender: shouldWriteIndex
      ? {
          outputPath: `${route.path}/index.html`
        }
      : undefined
  }
}

const createFilesystemRoutePrerenderPages = (
  projectRoot: string,
  route: RouteConfig
) => {
  return expandFilesystemRoute(projectRoot, route, appRouteFileOptions).map(
    pagePath => createPrerenderPage({ ...route, path: pagePath })
  )
}

const assertSupportedRoute = (route: RouteConfig) => {
  if (!routeRootFromGlob(route.path) || route.source === 'routes') {
    return
  }

  throw new Error(
    `Unsupported route source "${route.source ?? 'none'}" for glob route "${route.path}". Use source "routes" or provide an exact path.`
  )
}

export const getPrerenderPages = (
  projectRoot = process.cwd(),
  { routes: extraRoutes = [] }: PrerenderPagesOptions = {}
) => {
  const configFile = path.join(projectRoot, 'vx.app.yaml')
  const config = readYamlConfig<VxAppConfig>(configFile)
  const routes = [...(config.routes ?? []), ...extraRoutes]
  const routeEntries: RouteConfig[] = routes.map(normalizeRoute)

  for (const route of routeEntries) {
    assertSupportedRoute(route)
  }

  return uniquePrerenderPages([
    createPrerenderPage({ path: '/' }),
    ...getStaticPageRoutes(projectRoot).map(pagePath =>
      createPrerenderPage({ path: pagePath })
    ),
    ...routeEntries.flatMap(route =>
      route.prerender === false
        ? []
        : createFilesystemRoutePrerenderPages(projectRoot, route)
    ),
    ...routeEntries
      .filter(route => !routeRootFromGlob(route.path))
      .filter(route => route.prerender !== false)
      .map(createPrerenderPage)
  ])
}

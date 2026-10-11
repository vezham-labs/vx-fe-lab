import path from 'node:path'

import { normalizePath, resolveProjectPath } from './paths.ts'
import { cdnRewrites } from './presets.ts'
import type {
  DeployFile,
  DeployPreset,
  FirebaseConfig,
  FirebaseDeployPreset,
  FirebaseDeployPresetName,
  FirebaseHeader,
  FirebaseHeaderOptions,
  FirebaseRedirect,
  VxAppConfig,
  VxDeployConfig
} from './types.ts'

const cacheHeader = (source: string, value: string): FirebaseHeader => ({
  source,
  headers: [
    {
      key: 'Cache-Control',
      value
    }
  ]
})

const unique = <T>(values: T[]) => [...new Set(values)]

const firebaseDeployPresets: Record<
  FirebaseDeployPresetName,
  FirebaseDeployPreset
> = {
  cdn: {
    public: 'dist',
    rewrites: cdnRewrites
  },
  // vx-bot/NOTE: SPA clients require this fallback so deep links reach the client router.
  spa: {
    public: 'dist',
    fallback: '/index.html'
  },
  'start-spa': {
    public: '.output/public',
    fallback: '/_shell.html'
  }
}

const defaultFirebaseDeployPreset: FirebaseDeployPreset =
  firebaseDeployPresets['start-spa']

const getFirebaseDeployPreset = (preset?: DeployPreset) => {
  if (!preset) {
    return defaultFirebaseDeployPreset
  }

  if (preset === 'next' || preset === 'tanstack-start') {
    throw new Error(`The "${preset}" deploy preset supports Vercel only`)
  }

  return firebaseDeployPresets[preset]
}

const getDefaultFirebaseHeaders = (
  appConfig: VxAppConfig,
  options: FirebaseHeaderOptions = {},
  fallback?: string
) => {
  const {
    app = true,
    docs = Boolean(appConfig.docs),
    routes = true,
    static: staticAssets = true
  } = options
  const docsRoute = appConfig.docs?.docsRoute ?? '/docs'
  const localizedDocsRoutes = (appConfig.i18n?.languages ?? [])
    .filter(language => language !== appConfig.i18n?.defaultLanguage)
    .flatMap(language => {
      const localizedDocsRoute = `/${language}${docsRoute}`

      return [localizedDocsRoute, `${localizedDocsRoute.replace(/\/$/, '')}/**`]
    })
  const routeSources = unique(
    [
      ...(app ? ['/'] : []),
      ...(docs
        ? [
            docsRoute,
            `${docsRoute.replace(/\/$/, '')}/**`,
            ...localizedDocsRoutes
          ]
        : []),
      ...(routes
        ? (appConfig.routes ?? [])
            .map(route => route.path)
            .filter(route => route.startsWith('/api'))
        : [])
    ].filter(Boolean)
  )

  return [
    ...(staticAssets
      ? [
          cacheHeader('/sw.js', 'no-cache,no-store,must-revalidate'),
          cacheHeader('/manifest.webmanifest', 'public,max-age=300'),
          ...(fallback ? [cacheHeader(fallback, 'public,max-age=300')] : []),
          cacheHeader('/assets/**', 'public,max-age=31536000,immutable'),
          cacheHeader('**/*.@(html|json|txt|md)', 'public,max-age=300')
        ]
      : []),
    ...routeSources.map(source => cacheHeader(source, 'public,max-age=300'))
  ]
}

const getDefaultLanguageRedirects = (
  appConfig: VxAppConfig
): FirebaseRedirect[] => {
  const defaultLanguage = appConfig.i18n?.defaultLanguage

  return defaultLanguage
    ? [
        {
          source: `/${defaultLanguage}`,
          destination: '/',
          type: 301
        },
        {
          source: `/${defaultLanguage}/:path*`,
          destination: '/:path',
          type: 301
        }
      ]
    : []
}

const resolveFirebasePublicDir = (
  workspaceRoot: string,
  projectRoot: string,
  publicDir = '.output/public'
) => {
  const resolvedPublicDir = path.isAbsolute(publicDir)
    ? publicDir
    : path.join(projectRoot, publicDir)

  return normalizePath(path.relative(workspaceRoot, resolvedPublicDir))
}

const getFirebaseConfig = (
  workspaceRoot: string,
  projectRoot: string,
  appConfig: VxAppConfig,
  deployConfig: VxDeployConfig
): FirebaseConfig => {
  const firebase = deployConfig.firebase ?? {}
  const preset = getFirebaseDeployPreset(deployConfig.preset)
  const headers =
    firebase.headers === false
      ? undefined
      : Array.isArray(firebase.headers)
        ? firebase.headers
        : getDefaultFirebaseHeaders(
            appConfig,
            firebase.headers,
            preset.fallback
          )
  const redirects = [
    ...(firebase.redirects ?? []),
    ...(deployConfig.redirectDefaultLanguage
      ? getDefaultLanguageRedirects(appConfig)
      : [])
  ]
  const rewrites =
    firebase.rewrites === false
      ? undefined
      : (firebase.rewrites ??
        preset.rewrites ??
        (preset.fallback
          ? [
              {
                source: '**',
                destination: preset.fallback
              }
            ]
          : undefined))

  return {
    hosting: {
      public: resolveFirebasePublicDir(
        workspaceRoot,
        projectRoot,
        firebase.public ?? preset.public
      ),
      ignore: firebase.ignore ?? [
        'firebase.json',
        '**/.*',
        '**/node_modules/**',
        '**/*.d.ts',
        '**/*.d.ts.map',
        '**/*.tsbuildinfo'
      ],
      cleanUrls: firebase.cleanUrls ?? true,
      ...(headers ? { headers } : {}),
      ...(redirects.length > 0 ? { redirects } : {}),
      ...(rewrites ? { rewrites } : {})
    }
  }
}

export const getFirebaseDeployFile = (
  workspaceRoot: string,
  projectRoot: string,
  appConfig: VxAppConfig,
  deployConfig: VxDeployConfig
): DeployFile => {
  const projectPath = resolveProjectPath(workspaceRoot, projectRoot)

  return {
    path: path.join(workspaceRoot, 'vx/deploy/firebase', `${projectPath}.json`),
    content: `${JSON.stringify(
      getFirebaseConfig(workspaceRoot, projectRoot, appConfig, deployConfig),
      null,
      2
    )}\n`
  }
}

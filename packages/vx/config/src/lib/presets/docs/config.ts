import path from 'node:path'

import { type I18nConfig, resolveI18n } from '../../i18n.ts'
import { readYamlConfig } from '../../yaml-config.ts'
import { type RouteInput } from './types.ts'

export type { I18nConfig } from '../../i18n.ts'

export type OgConfig = {
  logo?: string
  site?: string
  theme?: 'dark' | 'light'
}

export type DocsConfig = {
  docsRoute?: string
  og?: OgConfig
}

export type VxDocsConfig = {
  docs?: DocsConfig
  i18n?: I18nConfig
  og?: OgConfig
  routes?: RouteInput[]
}

const defaultContentDir = 'content/docs'

const defaultDocsRoute = '/docs'

const defaultOpenApiDir = 'openapi'

const docsImageRoute = (docsRoute: string) => {
  return `/og${docsRoute}`
}

export const resolveDocsConfig = (config: DocsConfig = {}) => {
  const docsRoute = config.docsRoute ?? defaultDocsRoute

  return {
    docsDir: defaultContentDir,
    docsRoute,
    docsImageRoute: docsImageRoute(docsRoute),
    openapiDir: defaultOpenApiDir,
    ogOutputDir: `public${docsImageRoute(docsRoute)}`
  }
}

export const loadVxDocsConfig = (projectRoot = process.cwd()) => {
  const configFile = path.join(projectRoot, 'vx.app.yaml')
  const config = readYamlConfig<VxDocsConfig>(configFile)

  return {
    config,
    configFile,
    docs: {
      ...config.docs,
      og: {
        ...config.og,
        ...config.docs?.og
      }
    },
    i18n: resolveI18n(config.i18n),
    routes: config.routes ?? []
  }
}

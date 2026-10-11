// vx-bot/NOTE: Keep the public preset API explicit while implementations stay separate.
/* eslint-disable @vx-lint/wildcard-barrel */
export {
  type DocsMdxMacroImportAliasOptions,
  type DocsMdxOptions,
  docsMdx,
  docsMdxMacroImportAlias,
  defineConfig
} from './vite.ts'
export {
  type OgConfig,
  type DocsConfig,
  type I18nConfig,
  type VxDocsConfig,
  resolveDocsConfig,
  loadVxDocsConfig
} from './config.ts'
export { generateDocs } from './openapi.ts'
export { generateDocsOgImages } from './og.ts'
export {
  type DocsStaticPaths,
  type DocsPrerenderPage,
  type RouteOg,
  type RouteConfig,
  type RouteInput,
  type DocsPrerenderPagesOptions
} from './types.ts'
export {
  getDocsStaticPaths,
  getDocsPrerenderPages,
  getPrerenderPages
} from './routes.ts'

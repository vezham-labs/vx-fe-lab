import path from 'node:path'
import { type Plugin, type TransformResult, mergeConfig } from 'vite'

import { docsMdx as createDocsMdx } from '@vezham/docs-mdx/vite'

import { defineConfig as defineAppConfig } from '@vx/config/presets/app'
import type { ViteConfig, ViteConfigOverrides } from '@vx/config/vite'

import { slash } from '../files.ts'

const docsMdxMacroImport = '@vezham/docs-mdx/macro'

const docsMdxRuntimeMacroImport = '@vx-oss/docs-mdx/macro'

const docsMdxGeneratedRuntimeImport = '@vx-oss/docs-mdx/runtime/macro'

const docsMdxRuntimeImport = '@vezham/docs-mdx/runtime/macro'

const docsMdxMacroImportPattern =
  /@vezham\/docs-mdx\/macro|@vx-oss\/docs-mdx\/macro/

const docsMdxMacroInclude = [
  '**/*.js',
  '**/*.jsx',
  '**/*.mjs',
  '**/*.ts',
  '**/*.tsx',
  '**/*.mts'
]

const moduleFilePattern = /\.[cm]?[jt]sx?($|\?)/

const nodeModulesPattern = /[\\/]node_modules[\\/]/

export type DocsMdxMacroImportAliasOptions = {
  rewriteContentBase?: boolean
}

export type DocsMdxOptions = NonNullable<Parameters<typeof createDocsMdx>[0]>

export const docsMdx = (options: DocsMdxOptions = {}) => {
  return createDocsMdx({
    ...options,
    macro:
      options.macro === false
        ? false
        : {
            include: docsMdxMacroInclude,
            ...options.macro
          }
  })
}

export const docsMdxMacroImportAlias = (
  options: DocsMdxMacroImportAliasOptions = {}
): Plugin => {
  return {
    name: '@vx/config:docs-mdx-macro-import-alias',
    enforce: 'pre',
    configResolved(config) {
      const contentDir = options.rewriteContentBase
        ? slash(path.resolve(config.root, 'content'))
        : undefined

      for (const plugin of config.plugins) {
        if (plugin.name !== '@vx-oss/docs-mdx:macro') {
          continue
        }

        const transform =
          typeof plugin.transform === 'object' ? plugin.transform : undefined

        if (!transform?.filter || typeof transform.filter !== 'object') {
          continue
        }

        if (typeof transform.handler !== 'function') {
          continue
        }

        const macroHandler = transform.handler as (
          this: unknown,
          code: string,
          id: string
        ) => unknown | Promise<unknown>

        plugin.transform = {
          order: 'pre',
          async handler(this: unknown, code, id) {
            if (
              !moduleFilePattern.test(id) ||
              nodeModulesPattern.test(id) ||
              !docsMdxMacroImportPattern.test(code)
            ) {
              return null
            }

            const result = await macroHandler.call(
              this,
              code.replaceAll(docsMdxMacroImport, docsMdxRuntimeMacroImport),
              id
            )

            return rewriteMacroOutput(result, contentDir)
          }
        }
      }
    }
  }
}

const rewriteMacroOutput = (
  result: unknown,
  contentDir: string | undefined
): TransformResult => {
  if (typeof result === 'string') {
    return rewriteMacroOutputCode(
      result,
      contentDir
    ) as unknown as TransformResult
  }

  if (
    typeof result === 'object' &&
    result !== null &&
    'code' in result &&
    typeof result.code === 'string'
  ) {
    return {
      ...result,
      code: rewriteMacroOutputCode(result.code, contentDir)
    } as TransformResult
  }

  return result as TransformResult
}

const rewriteMacroOutputCode = (
  code: string,
  contentDir: string | undefined
) => {
  const rewrittenCode = code.replaceAll(
    docsMdxGeneratedRuntimeImport,
    docsMdxRuntimeImport
  )

  if (!contentDir) {
    return rewrittenCode
  }

  return rewrittenCode.replaceAll(
    '"base": "./../../content/',
    `"base": "${contentDir}/`
  )
}

const docsViteDefaults: ViteConfig = {
  plugins: [docsMdxMacroImportAlias()],
  resolve: {
    alias: {
      '@vx-oss/docs-mdx/macro': '@vezham/docs-mdx/macro'
    },
    dedupe: ['@vezham/docs-core', '@vezham/docs-react']
  }
}

export const defineConfig = (overrides: ViteConfigOverrides = {}) =>
  defineAppConfig(async env => {
    const resolvedOverrides =
      typeof overrides === 'function' ? await overrides(env) : overrides

    return mergeConfig(docsViteDefaults, resolvedOverrides) as ViteConfig
  })

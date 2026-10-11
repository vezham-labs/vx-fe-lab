import path from 'node:path'
import type { Plugin } from 'vite'

import { docsMdx, docsMdxMacroImportAlias } from '../../../presets/docs/vite.ts'

const slash = (value: string) => value.split(path.sep).join('/')

const projectRootImportAlias = (): Plugin => {
  return {
    name: '@vx/config:vitest-project-root-import-alias',
    enforce: 'pre',
    resolveId(source) {
      if (!source.startsWith('/openapi/')) {
        return null
      }

      const [filePath, query] = source.split('?', 2)
      const resolvedPath = slash(path.resolve(process.cwd(), filePath.slice(1)))

      return query ? `${resolvedPath}?${query}` : resolvedPath
    },
    transform(code) {
      if (!code.includes('/openapi/')) {
        return null
      }

      return code
        .replaceAll(
          '"/openapi/',
          `"${slash(path.resolve(process.cwd(), 'openapi'))}/`
        )
        .replaceAll(
          "'/openapi/",
          `'${slash(path.resolve(process.cwd(), 'openapi'))}/`
        )
    }
  }
}

export const docsTestPlugins = () => [
  projectRootImportAlias(),
  docsMdxMacroImportAlias({ rewriteContentBase: true }),
  docsMdx()
]

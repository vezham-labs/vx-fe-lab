import path from 'node:path'

import { slash } from '../files.ts'
import type { I18nConfig } from './config.ts'

export const docsPathFromMdx = (
  docsDir: string,
  docsRoute: string,
  i18n: I18nConfig,
  filePath: string
) => {
  const relativePath = slash(path.relative(docsDir, filePath))
  if (!relativePath.endsWith('.mdx')) return

  const localizedLanguage = i18n.languages.find(
    lang =>
      lang !== i18n.defaultLanguage && relativePath.endsWith(`.${lang}.mdx`)
  )
  const suffix = localizedLanguage ? `.${localizedLanguage}.mdx` : '.mdx'
  const segments = relativePath
    .slice(0, -suffix.length)
    .split('/')
    .filter(segment => !(segment.startsWith('(') && segment.endsWith(')')))

  if (segments[segments.length - 1] === 'index') segments.pop()

  const routePath = segments.length
    ? `${docsRoute}/${segments.join('/')}`
    : docsRoute

  return {
    locale: localizedLanguage ?? i18n.defaultLanguage,
    markdownPath: segments.length ? `${routePath}.md` : `${docsRoute}/index.md`,
    routePath
  }
}

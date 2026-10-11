import { escapeHtml, generatedNotice } from './render.ts'
import { getTanStackHead } from './tanstack.ts'
import type { VxConfig } from './types.ts'

type HtmlAttributeValue = boolean | string | undefined

const indexMetadataStartMarker = '<!-- VX_METADATA_START -->'

const indexMetadataEndMarker = '<!-- VX_METADATA_END -->'

const isDefined = <T>(value: T | undefined): value is T => value !== undefined

const normalizeHtmlAttributeName = (name: string) =>
  name === 'charSet' ? 'charset' : name

const renderHtmlAttribute = ([name, value]: [string, HtmlAttributeValue]) => {
  if (value === undefined) {
    return undefined
  }

  if (value === true) {
    return name
  }

  if (value === false) {
    return undefined
  }

  return `${normalizeHtmlAttributeName(name)}="${escapeHtml(value)}"`
}

const renderHtmlTag = (
  tag: string,
  attributes: Record<string, HtmlAttributeValue>,
  indent = '    '
) => {
  const renderedAttributes = Object.entries(attributes)
    .map(renderHtmlAttribute)
    .filter(isDefined)
  const inlineTag = `${indent}<${tag} ${renderedAttributes.join(' ')} />`

  if (inlineTag.length <= 80) {
    return inlineTag
  }

  return `${indent}<${tag}\n${renderedAttributes
    .map(attribute => `${indent}  ${attribute}`)
    .join('\n')} />`
}

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getIndexHtmlMetadataBlock = (
  config: VxConfig,
  projectRoot = process.cwd()
) => {
  const head = getTanStackHead(config, projectRoot)
  const [charsetMeta, ...meta] = head.meta
  const renderHeadMetaEntry = (
    entry: Record<string, HtmlAttributeValue>
  ): string => {
    if (typeof entry.title === 'string') {
      return `    <title>${escapeHtml(entry.title)}</title>`
    }

    return renderHtmlTag('meta', entry)
  }
  const note = (label: string) => `    <!-- wjdlz/NOTE: ${label} -->`
  const isMetaName = (
    entry: Record<string, HtmlAttributeValue>,
    names: string[]
  ) => typeof entry.name === 'string' && names.includes(entry.name)
  const webMeta = meta.filter(
    entry =>
      entry.title ||
      isMetaName(entry, ['viewport', 'author', 'keywords', 'description'])
  )
  const themeMeta = meta.filter(entry =>
    isMetaName(entry, ['theme-color', 'background-color'])
  )
  const mobileMeta = meta.filter(entry =>
    isMetaName(entry, ['mobile-web-app-capable'])
  )
  const appleMeta = meta.filter(
    entry => typeof entry.name === 'string' && entry.name.startsWith('apple-')
  )
  const microsoftMeta = meta.filter(entry =>
    isMetaName(entry, [
      'application-name',
      'msapplication-config',
      'msapplication-starturl'
    ])
  )
  const openGraphMeta = meta.filter(
    entry =>
      typeof entry.property === 'string' && entry.property.startsWith('og:')
  )
  const twitterMeta = meta.filter(
    entry => typeof entry.name === 'string' && entry.name.startsWith('twitter:')
  )
  const pwaLinks = head.links.filter(
    link =>
      link.rel === 'manifest' ||
      link.rel === 'icon' ||
      link.rel === 'shortcut icon' ||
      link.rel === 'mask-icon'
  )
  const appleLinks = head.links.filter(
    link => typeof link.rel === 'string' && link.rel.startsWith('apple-touch-')
  )
  const lines = [
    `    ${indexMetadataStartMarker}`,
    `    <!-- ${generatedNotice} -->`,
    note('WEB'),
    ...(charsetMeta ? [renderHeadMetaEntry(charsetMeta)] : []),
    renderHtmlTag('meta', {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge'
    }),
    ...webMeta.map(renderHeadMetaEntry),
    '',
    note('PWA::THEME'),
    ...themeMeta.map(renderHeadMetaEntry),
    ...pwaLinks.map(link => renderHtmlTag('link', link)),
    '',
    note('PWA::MOBILE'),
    ...mobileMeta.map(renderHeadMetaEntry),
    '',
    note('APPLE'),
    ...appleMeta.map(renderHeadMetaEntry),
    ...appleLinks.map(link => renderHtmlTag('link', link)),
    '',
    note('MICROSOFT'),
    ...microsoftMeta.map(renderHeadMetaEntry),
    '',
    note('META'),
    ...openGraphMeta.map(renderHeadMetaEntry),
    '',
    note('TWITTER'),
    ...twitterMeta.map(renderHeadMetaEntry),
    `    ${indexMetadataEndMarker}`
  ]

  return lines.join('\n')
}

const getPreservedIndexHeadContent = (headContent: string) =>
  headContent
    .split('\n')
    .filter(line => {
      const trimmedLine = line.trim()

      return (
        trimmedLine.startsWith('<base ') || trimmedLine.startsWith('<script ')
      )
    })
    .join('\n')

export const syncIndexHtmlContent = (
  content: string,
  config: VxConfig,
  projectRoot = process.cwd()
) => {
  const metadataBlock = getIndexHtmlMetadataBlock(config, projectRoot)
  const headPattern = /(<head>\n)([\s\S]*?)(\n\s*<\/head>)/
  const headMatch = content.match(headPattern)

  if (!headMatch) {
    throw new Error('Unable to sync Vx metadata because index.html has no head')
  }

  const [, headStart, headContent, headEnd] = headMatch
  const existingBlockPattern = new RegExp(
    `${escapeRegex(`    ${indexMetadataStartMarker}`)}[\\s\\S]*?${escapeRegex(
      `    ${indexMetadataEndMarker}`
    )}`
  )
  const preservedHeadContent = getPreservedIndexHeadContent(
    headContent.replace(existingBlockPattern, '')
  )
  const nextHeadContent = [preservedHeadContent, metadataBlock]
    .filter(Boolean)
    .join('\n\n')

  return content.replace(
    headPattern,
    `${headStart}${nextHeadContent}${headEnd}`
  )
}

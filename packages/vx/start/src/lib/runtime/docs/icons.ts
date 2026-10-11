import { type CSSProperties, type ReactNode, createElement } from 'react'

import type { LoaderPlugin } from '@vezham/docs-core/source'
import { metaSchema, pageSchema } from '@vezham/docs-core/source/schema'

export const defaultDocsIconAssetBaseUrl =
  'https://cdn.jsdelivr.net/npm/@vezham/icons@1.0.7/dist/cdn/icons'

export type DocsIconName = string

export type DocsIconWeight = 'outline' | 'filled' | 'duotone'

export type DocsIconAlt = string | ((iconName: DocsIconName) => string)

export type DocsIconFrontmatter = {
  iconAlt?: string
  iconColor?: CSSProperties['color']
  iconWeight?: DocsIconWeight
}

export type DocsIconResolverOptions = {
  alt?: DocsIconAlt
  assetBaseUrl?: string
  color?: CSSProperties['color']
  defaultIcon?: DocsIconName
  size?: number | string
  weight?: DocsIconWeight
}

export const docsPageSchema = pageSchema.extend({
  iconAlt: pageSchema.shape.description,
  iconColor: pageSchema.shape.description,
  iconWeight: pageSchema.shape.description
}) as unknown as typeof pageSchema

export const docsMetaSchema = metaSchema.extend({
  iconAlt: metaSchema.shape.description,
  iconColor: metaSchema.shape.description,
  iconWeight: metaSchema.shape.description
}) as unknown as typeof metaSchema

const toKebabIconName = (value: string) => {
  return value
    .replace(/_/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export const toDocsIconName = (value: string) => {
  return toKebabIconName(value)
}

const isDocsIconWeight = (value: unknown): value is DocsIconWeight => {
  return value === 'outline' || value === 'filled' || value === 'duotone'
}

const getDocsIconAlt = (
  alt: DocsIconAlt | undefined,
  iconName: DocsIconName
) => {
  return typeof alt === 'function' ? alt(iconName) : alt
}

const getDocsIconAssetUrl = (
  iconName: string,
  weight: DocsIconWeight | undefined,
  assetBaseUrl: string
) => {
  const suffix = weight === 'filled' || weight === 'duotone' ? `-${weight}` : ''

  return `${assetBaseUrl.replace(/\/$/, '')}/${iconName}${suffix}.svg`
}

export const createDocsIconResolver = ({
  alt,
  assetBaseUrl = defaultDocsIconAssetBaseUrl,
  color,
  defaultIcon,
  size = 16,
  weight
}: DocsIconResolverOptions = {}) => {
  return (icon?: string): ReactNode => {
    const iconName = icon ?? defaultIcon

    if (iconName === undefined) {
      return
    }

    const normalizedIconName = toDocsIconName(iconName)
    const iconSize = typeof size === 'number' ? `${size}px` : size
    const iconUrl = getDocsIconAssetUrl(
      normalizedIconName,
      weight,
      assetBaseUrl
    )
    const altText = getDocsIconAlt(alt, normalizedIconName)
    const style = {
      WebkitMask: `url("${iconUrl}") center / contain no-repeat`,
      backgroundColor: 'currentColor',
      color,
      display: 'inline-block',
      flexShrink: 0,
      height: iconSize,
      mask: `url("${iconUrl}") center / contain no-repeat`,
      verticalAlign: 'middle',
      width: iconSize
    } satisfies CSSProperties

    return createElement('span', {
      ...(altText
        ? { 'aria-label': altText, role: 'img' }
        : { 'aria-hidden': true }),
      'data-vx-icon': normalizedIconName,
      'data-vx-icon-weight': weight,
      style
    })
  }
}

const getString = (value: unknown) => {
  return typeof value === 'string' ? value : undefined
}

const getDocsIconFrontmatter = (data: unknown): DocsIconFrontmatter => {
  if (!data || typeof data !== 'object') {
    return {}
  }

  const frontmatter = data as Record<string, unknown>
  const iconWeight = frontmatter.iconWeight

  return {
    iconAlt: getString(frontmatter.iconAlt),
    iconColor: getString(frontmatter.iconColor),
    iconWeight: isDocsIconWeight(iconWeight) ? iconWeight : undefined
  }
}

const createFrontmatterDocsIconResolver = (
  frontmatter: DocsIconFrontmatter,
  options: DocsIconResolverOptions
) => {
  return createDocsIconResolver({
    ...options,
    alt: frontmatter.iconAlt ?? options.alt,
    color: frontmatter.iconColor ?? options.color,
    weight: frontmatter.iconWeight ?? options.weight
  })
}

const resolveDocsNodeIcon = <Node extends { icon?: ReactNode }>(
  node: Node,
  options: DocsIconResolverOptions,
  frontmatter: DocsIconFrontmatter = {}
): Node => {
  if (node.icon === undefined || typeof node.icon === 'string') {
    node.icon = createFrontmatterDocsIconResolver(
      frontmatter,
      options
    )(node.icon)
  }

  return node
}

export const docsIconsPlugin = (
  options: DocsIconResolverOptions = {}
): LoaderPlugin => ({
  name: 'vezham:docs-icons',
  transformPageTree: {
    file(node, filePath) {
      const file = filePath ? this.storage.read(filePath) : undefined
      return resolveDocsNodeIcon(
        node,
        options,
        file?.format === 'page' ? getDocsIconFrontmatter(file.data) : undefined
      )
    },
    folder(node, _folderPath, metaPath) {
      const file = metaPath ? this.storage.read(metaPath) : undefined
      return resolveDocsNodeIcon(
        node,
        options,
        file?.format === 'meta' ? getDocsIconFrontmatter(file.data) : undefined
      )
    },
    separator(node) {
      return resolveDocsNodeIcon(node, options)
    }
  }
})

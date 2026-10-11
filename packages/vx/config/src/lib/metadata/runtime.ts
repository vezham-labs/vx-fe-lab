import path from 'node:path'

import { resolveI18n } from '../i18n.ts'
import {
  type VxConfig,
  type VxIcon,
  type VxIconSource,
  type VxStartupImage,
  type VxStartupImageSource
} from './types.ts'

export const lowerFirst = (value: string) =>
  value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value

const normalizePath = (value: string) => value.split(path.sep).join('/')

export const getProjectAssetBaseUrl = (projectRoot: string) =>
  `https://static.cdn.vezham.com/${normalizePath(path.relative(process.cwd(), projectRoot))}`

export const createVersionedAssetUrl = (baseUrl: string, version: string) => {
  const versionParam = `vx=${encodeURIComponent(version)}`

  return (assetPath: string) =>
    `${baseUrl.replace(/\/$/, '')}/${assetPath.replace(/^\//, '')}?${versionParam}`
}

export const getStaticAssetUrl = (assetPath: string, version: string) =>
  `https://static.cdn.vezham.com/${assetPath.replace(/^\//, '')}?vx=${encodeURIComponent(version)}`

export const toAssetUrl = (
  assetPath: string,
  versionedAssetUrl: (assetPath: string) => string
) =>
  /^https?:\/\//.test(assetPath) || assetPath.startsWith('/')
    ? assetPath
    : versionedAssetUrl(assetPath)

type SocialImageSource = 'default' | 'path' | 'url'

type ResolvedSocialImage = {
  source: SocialImageSource
  url: string
}

const resolveSocialImage = (image: string | undefined): ResolvedSocialImage => {
  const value = image?.trim()

  if (!value) {
    return {
      source: 'default',
      url: '/og/image.png'
    }
  }

  if (/^https?:\/\//i.test(value)) {
    return { source: 'url', url: value }
  }

  return {
    source: 'path',
    url: `/${value.replace(/^\/+/, '')}`
  }
}

const getStartupImageMedia = (image: VxStartupImage) => {
  if (image.media) {
    return image.media
  }

  const colorScheme = image.colorScheme
    ? `(prefers-color-scheme: ${image.colorScheme})`
    : undefined
  const width = image.width ? `(device-width: ${image.width}px)` : undefined
  const height = image.height ? `(device-height: ${image.height}px)` : undefined
  const pixelRatio = image.pixelRatio
    ? `(-webkit-device-pixel-ratio: ${image.pixelRatio})`
    : undefined

  return [colorScheme, width, height, pixelRatio].filter(Boolean).join(' and ')
}

const createStartupImagePath = (template: string, image: VxStartupImage) =>
  template
    .replaceAll('{colorScheme}', image.colorScheme ?? '')
    .replaceAll('{device}', image.device ?? '')
    .replaceAll('{width}', String(image.width ?? ''))
    .replaceAll('{height}', String(image.height ?? ''))
    .replaceAll('{pixelRatio}', String(image.pixelRatio ?? ''))

const normalizeStartupImages = (
  startupImages: VxStartupImageSource
): VxStartupImage[] => {
  if (Array.isArray(startupImages)) {
    return startupImages
  }

  return (startupImages.colorSchemes ?? ['light', 'dark']).flatMap(
    colorScheme =>
      startupImages.sizes.map(size => {
        const image = { ...size, colorScheme }
        const sourcePath = size.path ?? size.src ?? startupImages.path

        return {
          ...image,
          path: createStartupImagePath(sourcePath, image)
        }
      })
  )
}

export const normalizeIcons = (icons: VxIconSource): VxIcon[] => {
  if (Array.isArray(icons)) {
    return icons
  }

  return icons.sizes.map(size => ({
    src: icons.path.replaceAll('{size}', String(size)),
    sizes: `${size}x${size}`,
    type: icons.type
  }))
}

export const getRuntimeMetadata = (
  config: VxConfig,
  projectRoot = process.cwd()
) => {
  const { core, metadata, pwa } = config
  const { apple, microsoft } = metadata.platforms
  const { openGraph, twitter } = metadata.social
  const versionedAssetUrl = createVersionedAssetUrl(
    getProjectAssetBaseUrl(projectRoot),
    core.version
  )
  const title = metadata.title
  const description = lowerFirst(core.description)
  const lightThemeColor = metadata.theme.lightColor
  const darkThemeColor = metadata.theme.darkColor
  const lightBackgroundColor = metadata.theme.lightBackgroundColor
  const darkBackgroundColor = metadata.theme.darkBackgroundColor
  const faviconLight = versionedAssetUrl('favicon-light.png')
  const faviconDark = versionedAssetUrl('favicon-dark.png')
  const maskIcon = versionedAssetUrl('safari-pinned-tab.svg')
  const appleTouchIcon = versionedAssetUrl(apple.touchIcon)
  const openGraphImage = resolveSocialImage(openGraph.image)
  const twitterImage = resolveSocialImage(
    twitter.image?.trim() ? twitter.image : openGraph.image
  )
  const startupImages = normalizeStartupImages(apple.startupImages).map(
    image => ({
      media: getStartupImageMedia(image),
      url: toAssetUrl(image.path ?? image.src ?? '', versionedAssetUrl)
    })
  )

  return {
    ...resolveI18n(config.i18n),
    title,
    description,
    url: core.url,
    manifest: '/manifest.webmanifest',
    browserConfig: '/browserconfig.xml',
    startUrl: microsoft.startUrl ?? pwa.startUrl,
    author: core.publisher,
    keywords: metadata.keywords,
    theme: {
      lightColor: lightThemeColor,
      darkColor: darkThemeColor,
      lightBackgroundColor,
      darkBackgroundColor
    },
    mobileWebAppCapable: apple.mobileWebAppCapable,
    apple: {
      title: core.name,
      capable: apple.webAppCapable,
      touchIcon: appleTouchIcon,
      startupImages
    },
    icons: {
      faviconLight,
      faviconDark,
      maskIcon
    },
    microsoft: {
      applicationName: core.name,
      config: '/browserconfig.xml',
      startUrl: microsoft.startUrl
    },
    openGraph: {
      type: openGraph.type,
      title: core.name,
      description,
      image: openGraphImage.url,
      imageSource: openGraphImage.source,
      url: core.url
    },
    twitter: {
      creator: twitter.creator,
      site: twitter.site,
      title: core.name,
      description,
      image: twitterImage.url,
      url: core.url,
      card: twitter.card
    }
  }
}

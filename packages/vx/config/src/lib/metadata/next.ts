import { getRuntimeMetadata } from './runtime.ts'
import type { VxConfig } from './types.ts'

export const getNextMetadata = (
  config: VxConfig,
  projectRoot = process.cwd()
) => {
  const metadata = getRuntimeMetadata(config, projectRoot)

  return {
    metadataBase: metadata.url ? new URL(metadata.url) : undefined,
    title: metadata.title,
    description: metadata.description,
    applicationName: metadata.microsoft.applicationName,
    authors: metadata.author?.name
      ? [
          {
            name: metadata.author.name,
            url: metadata.author.url
          }
        ]
      : undefined,
    keywords: metadata.keywords,
    manifest: metadata.manifest,
    icons: {
      icon: [
        {
          url: metadata.icons.faviconLight,
          type: 'image/x-icon',
          media: '(prefers-color-scheme: light)'
        },
        {
          url: metadata.icons.faviconDark,
          type: 'image/x-icon',
          media: '(prefers-color-scheme: dark)'
        },
        {
          url: metadata.icons.maskIcon,
          type: 'image/svg+xml',
          media: '(prefers-color-scheme: light)',
          color: 'black'
        },
        {
          url: metadata.icons.maskIcon,
          type: 'image/svg+xml',
          media: '(prefers-color-scheme: dark)',
          color: 'white'
        }
      ],
      shortcut: [
        {
          url: metadata.icons.faviconLight,
          media: '(prefers-color-scheme: light)'
        },
        {
          url: metadata.icons.faviconDark,
          media: '(prefers-color-scheme: dark)'
        }
      ],
      apple: [{ url: metadata.apple.touchIcon }],
      other: [
        {
          rel: 'mask-icon',
          url: metadata.icons.maskIcon,
          media: '(prefers-color-scheme: light)',
          color: 'black'
        },
        {
          rel: 'mask-icon',
          url: metadata.icons.maskIcon,
          media: '(prefers-color-scheme: dark)',
          color: 'white'
        }
      ]
    },
    appleWebApp: {
      title: metadata.apple.title,
      capable: metadata.apple.capable,
      startupImage: metadata.apple.startupImages
    },
    openGraph: {
      type: metadata.openGraph.type,
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      images: [metadata.openGraph.image],
      url: metadata.openGraph.url
    },
    twitter: {
      creator: metadata.twitter.creator,
      site: metadata.twitter.site,
      title: metadata.twitter.title,
      description: metadata.twitter.description,
      images: [metadata.twitter.image],
      card: metadata.twitter.card
    },
    other: {
      'mobile-web-app-capable': metadata.mobileWebAppCapable ? 'yes' : 'no',
      'msapplication-config': metadata.microsoft.config,
      'msapplication-starturl': metadata.microsoft.startUrl,
      'twitter:url': metadata.twitter.url
    }
  }
}

export const getNextViewport = (
  config: VxConfig,
  projectRoot = process.cwd()
) => {
  const metadata = getRuntimeMetadata(config, projectRoot)

  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1.5,
    userScalable: true,
    themeColor: [
      {
        media: '(prefers-color-scheme: light)',
        color: metadata.theme.lightColor
      },
      {
        media: '(prefers-color-scheme: dark)',
        color: metadata.theme.darkColor
      }
    ]
  }
}

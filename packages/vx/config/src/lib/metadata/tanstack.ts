import { getRuntimeMetadata } from './runtime.ts'
import type { VxConfig } from './types.ts'

export const getTanStackHead = (
  config: VxConfig,
  projectRoot = process.cwd()
) => {
  const metadata = getRuntimeMetadata(config, projectRoot)

  return {
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=1, shrink-to-fit=no'
      },
      { name: 'author', content: metadata.author?.name ?? '' },
      { name: 'keywords', content: metadata.keywords.join(', ') },
      { title: metadata.title },
      { name: 'description', content: metadata.description },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: light)',
        content: metadata.theme.lightColor
      },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: dark)',
        content: metadata.theme.darkColor
      },
      {
        name: 'background-color',
        media: '(prefers-color-scheme: light)',
        content: metadata.theme.lightBackgroundColor
      },
      {
        name: 'background-color',
        media: '(prefers-color-scheme: dark)',
        content: metadata.theme.darkBackgroundColor
      },
      {
        name: 'mobile-web-app-capable',
        content: metadata.mobileWebAppCapable ? 'yes' : 'no'
      },
      { name: 'apple-mobile-web-app-title', content: metadata.apple.title },
      {
        name: 'apple-mobile-web-app-capable',
        content: metadata.apple.capable ? 'yes' : 'no'
      },
      {
        name: 'application-name',
        content: metadata.microsoft.applicationName
      },
      {
        name: 'msapplication-config',
        content: metadata.microsoft.config
      },
      {
        name: 'msapplication-starturl',
        content: metadata.microsoft.startUrl
      },
      { property: 'og:type', content: metadata.openGraph.type },
      { property: 'og:title', content: metadata.openGraph.title },
      { property: 'og:description', content: metadata.openGraph.description },
      { property: 'og:image', content: metadata.openGraph.image },
      { property: 'og:url', content: metadata.openGraph.url },
      { name: 'twitter:creator', content: metadata.twitter.creator },
      { name: 'twitter:site', content: metadata.twitter.site },
      { name: 'twitter:title', content: metadata.twitter.title },
      {
        name: 'twitter:description',
        content: metadata.twitter.description
      },
      { name: 'twitter:image', content: metadata.twitter.image },
      { name: 'twitter:url', content: metadata.twitter.url },
      { name: 'twitter:card', content: metadata.twitter.card }
    ],
    links: [
      { rel: 'manifest', href: metadata.manifest },
      {
        rel: 'icon',
        type: 'image/x-icon',
        media: '(prefers-color-scheme: light)',
        href: metadata.icons.faviconLight
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        media: '(prefers-color-scheme: dark)',
        href: metadata.icons.faviconDark
      },
      {
        rel: 'icon',
        media: '(prefers-color-scheme: light)',
        href: metadata.icons.faviconLight
      },
      {
        rel: 'icon',
        media: '(prefers-color-scheme: dark)',
        href: metadata.icons.faviconDark
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
        href: metadata.icons.maskIcon,
        color: 'black'
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
        href: metadata.icons.maskIcon,
        color: 'white'
      },
      {
        rel: 'shortcut icon',
        media: '(prefers-color-scheme: light)',
        href: metadata.icons.faviconLight
      },
      {
        rel: 'shortcut icon',
        media: '(prefers-color-scheme: dark)',
        href: metadata.icons.faviconDark
      },
      {
        rel: 'mask-icon',
        media: '(prefers-color-scheme: light)',
        href: metadata.icons.maskIcon,
        color: 'black'
      },
      {
        rel: 'mask-icon',
        media: '(prefers-color-scheme: dark)',
        href: metadata.icons.maskIcon,
        color: 'white'
      },
      {
        rel: 'apple-touch-icon',
        href: metadata.apple.touchIcon
      },
      ...metadata.apple.startupImages.map(image => ({
        rel: 'apple-touch-startup-image',
        media: image.media,
        href: image.url
      }))
    ]
  }
}

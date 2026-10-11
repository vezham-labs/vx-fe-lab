import {
  defaultDocsImageRoute,
  defaultDocsRoute,
  normalizeDocsRoutePath
} from './routes'

export type DocsRouteHeadData = {
  description?: string
  locale: string
  routePath: string
  title?: string
}

export type DocsRouteHeadOptions = {
  appName: string
  defaultLanguage: string
  docsImageRoute?: string
  docsRoute?: string
  languages: readonly string[]
  openGraphImage: string
  openGraphImageSource?: string
  siteDescription: string
  siteUrl: string
}

export const getDocsOgImagePath = ({
  docsImageRoute = defaultDocsImageRoute,
  docsRoute = defaultDocsRoute,
  languages,
  openGraphImage,
  openGraphImageSource,
  routePath
}: {
  docsImageRoute?: string
  docsRoute?: string
  languages: readonly string[]
  openGraphImage: string
  openGraphImageSource?: string
  routePath: string
}) => {
  const usesDefaultOgImage =
    openGraphImageSource === 'default' || openGraphImage === '/og/image.png'

  if (!usesDefaultOgImage) {
    return openGraphImage
  }

  const docsPath = normalizeDocsRoutePath({ docsRoute, languages, routePath })
  const docsImageRouteRoot = docsImageRoute.split('/').slice(0, -1).join('/')

  if (docsPath !== docsRoute && !docsPath.startsWith(`${docsRoute}/`)) {
    return `${docsImageRouteRoot}${docsPath}/image.png`
  }

  const suffix = docsPath === docsRoute ? '' : docsPath.slice(docsRoute.length)

  return `${docsImageRoute}${suffix}/image.png`
}

const absoluteSiteUrl = (pathname: string, siteUrl: string) => {
  return new URL(pathname, `${siteUrl}/`).toString()
}

export const getDocsRouteHead = (
  data: DocsRouteHeadData | undefined,
  {
    appName,
    defaultLanguage,
    docsImageRoute,
    docsRoute = defaultDocsRoute,
    languages,
    openGraphImage,
    openGraphImageSource,
    siteDescription,
    siteUrl
  }: DocsRouteHeadOptions
) => {
  if (!data) {
    return {}
  }

  const title = data.title ? `${data.title} | ${appName}` : appName
  const description = data.description ?? siteDescription
  const docsPath = normalizeDocsRoutePath({
    docsRoute,
    languages,
    routePath: data.routePath
  })
  const pageUrl =
    data.locale === defaultLanguage ? docsPath : `/${data.locale}${docsPath}`
  const imageUrl = getDocsOgImagePath({
    docsImageRoute,
    docsRoute,
    languages,
    openGraphImage,
    openGraphImageSource,
    routePath: docsPath
  })
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: absoluteSiteUrl(pageUrl, siteUrl) },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:url', content: absoluteSiteUrl(pageUrl, siteUrl) },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }
}

export const defaultDocsRoute = '/docs'

export const getDocsImageRoute = (docsRoute = defaultDocsRoute) => {
  return `/og${docsRoute}`
}

export const defaultDocsImageRoute = getDocsImageRoute()

export const encodeMarkdownUrl = (
  slugs: string[],
  locale?: string,
  docsRoute = defaultDocsRoute,
  defaultLocale?: string
) => {
  const segments = [...slugs]
  const localePrefix = locale && locale !== defaultLocale ? locale : undefined

  if (segments.length === 0) {
    segments.push('index.md')
  } else {
    segments[segments.length - 1] += '.md'
  }

  return (
    '/' +
    [localePrefix, ...docsRoute.split('/'), ...segments]
      .filter(Boolean)
      .join('/')
  )
}

export const decodeMarkdownUrl = (segments: string[]) => {
  if (segments.length === 0) {
    return []
  }

  const out = [...segments]
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '')

  if (out.length === 1 && out[0] === 'index') {
    out.pop()
  }

  return out
}

export const replaceDocsRouteBase = ({
  docsRoute = defaultDocsRoute,
  languages,
  pagePath,
  routeBase
}: {
  docsRoute?: string
  languages: readonly string[]
  pagePath: string
  routeBase: string
}) => {
  if (routeBase === docsRoute) {
    return pagePath
  }

  if (pagePath === docsRoute) {
    return routeBase
  }

  if (pagePath.startsWith(`${docsRoute}/`)) {
    return `${routeBase}${pagePath.slice(docsRoute.length)}`
  }

  for (const lang of languages) {
    const localizedDocsRoute = `/${lang}${docsRoute}`

    if (pagePath === localizedDocsRoute) {
      return routeBase
    }

    if (pagePath.startsWith(`${localizedDocsRoute}/`)) {
      return `${routeBase}${pagePath.slice(localizedDocsRoute.length)}`
    }
  }

  return pagePath
}

export const normalizeDocsRoutePath = ({
  docsRoute = defaultDocsRoute,
  languages,
  routePath
}: {
  docsRoute?: string
  languages: readonly string[]
  routePath: string
}) => {
  for (const lang of languages) {
    const localizedDocsRoute = `/${lang}${docsRoute}`

    if (routePath === localizedDocsRoute) {
      return docsRoute
    }

    if (routePath.startsWith(`${localizedDocsRoute}/`)) {
      return routePath.slice(`/${lang}`.length)
    }
  }

  return routePath
}

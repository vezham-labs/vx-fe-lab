import { type I18nConfig, defineI18n } from '@vezham/docs-core/i18n'

export type DocsI18nInput<Languages extends readonly string[]> = {
  defaultLanguage: Languages[number]
  hideLocale?: I18nConfig<Languages[number]>['hideLocale']
  languages: Languages
}

export const createDocsI18n = <const Languages extends readonly string[]>(
  config: DocsI18nInput<Languages>
) => {
  const { hideLocale = 'default-locale', languages, ...i18nConfig } = config

  return defineI18n({
    ...i18nConfig,
    hideLocale,
    languages: [...languages]
  })
}

export const normalizeLocale = <Locale extends string>(
  i18n: {
    defaultLanguage: Locale
    languages: readonly Locale[]
  },
  lang?: string
): Locale => {
  return i18n.languages.includes(lang as Locale)
    ? (lang as Locale)
    : i18n.defaultLanguage
}

export const isOptionalLocaleParam = <Locale extends string>(
  i18n: {
    languages: readonly Locale[]
  },
  lang?: string
): lang is Locale | undefined => {
  return !lang || i18n.languages.includes(lang as Locale)
}

export const isDefaultLocaleParam = <Locale extends string>(
  i18n: {
    defaultLanguage: Locale
  },
  lang?: string
): lang is Locale => {
  return lang === i18n.defaultLanguage
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const getDefaultLocaleRedirectHref = <Locale extends string>(
  i18n: {
    defaultLanguage: Locale
  },
  href: string
) => {
  const defaultLocalePattern = escapeRegExp(i18n.defaultLanguage)
  const defaultLocalePrefix = new RegExp(
    `^/${defaultLocalePattern}(?=/|\\?|#|$)`
  )

  if (!defaultLocalePrefix.test(href)) {
    return
  }

  return href.replace(defaultLocalePrefix, '') || '/'
}

export const localizedUrl = <Locale extends string>(
  i18n: {
    defaultLanguage: Locale
  },
  locale: Locale,
  path: string
) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return locale === i18n.defaultLanguage
    ? normalizedPath
    : `/${locale}${normalizedPath}`
}

export const localizedRouteParam = <Locale extends string>(
  i18n: {
    defaultLanguage: Locale
  },
  locale?: Locale
) => {
  return locale && locale !== i18n.defaultLanguage ? locale : undefined
}

export const localizeRouteBase = <Locale extends string>({
  defaultLanguage,
  lang,
  languages,
  routeBase
}: {
  defaultLanguage?: Locale
  lang?: string
  languages: readonly Locale[]
  routeBase: string
}) => {
  const locale = languages.find(language => language === lang)

  return locale && locale !== defaultLanguage
    ? `/${locale}${routeBase}`
    : routeBase
}

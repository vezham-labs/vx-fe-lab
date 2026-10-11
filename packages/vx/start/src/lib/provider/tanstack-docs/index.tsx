import { Outlet, notFound, redirect, useParams } from '@tanstack/react-router'

import type { I18nAPI } from '@vezham/docs-core/i18n'
import { openapiTranslations } from '@vezham/docs-openapi/i18n'
import { i18nProvider, uiTranslations } from '@vezham/docs-react/i18n'
import {
  RootProvider,
  type RootProviderProps
} from '@vezham/docs-react/provider/tanstack'

import {
  getDefaultLocaleRedirectHref,
  isOptionalLocaleParam,
  normalizeLocale
} from '../../runtime/docs'
import type { Props } from '../shared/types'
import { RootDocument } from '../tanstack'
import { createDocsTranslations, getLanguageDisplayName } from './i18n'
import { DocsSearchDialog } from './search'

type DocsConfigProps = Props & {
  rootProvider?: Omit<RootProviderProps, 'children'>
}

type DocsRootComponentOptions<Language extends string> = {
  i18n: I18nAPI<Language>
  translations?: Partial<Record<Language, Record<string, string>>>
}

const parseRouteLocale = <
  Language extends string,
  Params extends { lang?: string }
>(
  i18n: I18nAPI<Language>,
  params: Params
) => {
  return isOptionalLocaleParam(i18n, params.lang) ? params : false
}

const assertRouteLocale = <
  Language extends string,
  Params extends { lang?: string }
>(
  i18n: I18nAPI<Language>,
  params: Params,
  location: { href: string }
) => {
  if (!isOptionalLocaleParam(i18n, params.lang)) {
    throw notFound()
  }

  const redirectHref = getDefaultLocaleRedirectHref(i18n, location.href)

  if (redirectHref) {
    throw redirect({
      href: redirectHref,
      statusCode: 301
    })
  }
}

const redirectDefaultLocale = <Language extends string>(
  i18n: I18nAPI<Language>,
  location: { href: string }
) => {
  const redirectHref = getDefaultLocaleRedirectHref(i18n, location.href)

  if (redirectHref) {
    throw redirect({
      href: redirectHref,
      statusCode: 301
    })
  }
}

const defineConfig = ({ rootProvider, ...props }: DocsConfigProps = {}) => {
  const { search, ...rootProviderProps } = rootProvider ?? {}

  return (
    <RootDocument {...props} runtime="tanstack-docs">
      <RootProvider
        {...rootProviderProps}
        search={{ SearchDialog: DocsSearchDialog, ...search }}>
        <Outlet />
      </RootProvider>
    </RootDocument>
  )
}

const createRootComponent = <Language extends string>({
  i18n,
  translations: overrides
}: DocsRootComponentOptions<Language>) => {
  const translations = i18n
    .translations()
    .extend(uiTranslations())
    .extend(openapiTranslations())
    .add(createDocsTranslations(i18n, overrides))

  const DocsRootComponent = () => {
    const { lang = i18n.defaultLanguage } = useParams({ strict: false })
    const locale = normalizeLocale(i18n, lang)

    return defineConfig({
      lang: locale,
      rootProvider: {
        i18n: i18nProvider(translations, locale)
      }
    })
  }

  return DocsRootComponent
}

export {
  createRootComponent,
  defineConfig,
  DocsSearchDialog,
  assertRouteLocale,
  parseRouteLocale,
  redirectDefaultLocale,
  getLanguageDisplayName
}

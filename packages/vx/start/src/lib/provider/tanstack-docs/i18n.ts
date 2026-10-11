import type { I18nAPI } from '@vezham/docs-core/i18n'

const displayNameLanguageCode = (language: string) => {
  return language === 'cn' ? 'zh' : language
}

const displayNames = new Map<string, Intl.DisplayNames>()

const getDisplayNames = (languageCode: string) => {
  const cached = displayNames.get(languageCode)

  if (cached) return cached

  const formatter = new Intl.DisplayNames([languageCode], {
    type: 'language'
  })
  displayNames.set(languageCode, formatter)
  return formatter
}

export const getLanguageDisplayName = (language: string) => {
  const languageCode = displayNameLanguageCode(language)

  try {
    return getDisplayNames(languageCode).of(languageCode) ?? language
  } catch {
    return language
  }
}

export const createDocsTranslations = <Language extends string>(
  i18n: I18nAPI<Language>,
  overrides?: Partial<Record<Language, Record<string, string>>>
) => {
  const translations: Partial<Record<Language, Record<string, string>>> = {}

  for (const language of i18n.languages) {
    translations[language] = {
      displayName: getLanguageDisplayName(language),
      ...overrides?.[language]
    }
  }

  return translations
}

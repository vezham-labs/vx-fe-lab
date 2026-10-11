export type I18nConfig = {
  defaultLanguage: string
  languages: string[]
}

export const resolveI18n = (i18n?: I18nConfig): I18nConfig => {
  const defaultLanguage = i18n?.defaultLanguage ?? 'en'
  const configuredLanguages = i18n?.languages ?? []
  const languages = configuredLanguages.includes(defaultLanguage)
    ? configuredLanguages
    : [...configuredLanguages, defaultLanguage]

  return { defaultLanguage, languages }
}

import { useMemo } from 'react'

import { Translation } from '@vezham/icons-react'

import { useRootAttribute } from './document'
import { Options } from './options'
import { ActionTile } from './tile'
import type { ControlCenterI18n, LanguageAdapter } from './types'

type LanguageContext = { language: LanguageAdapter }

export const LanguageTile = ({
  language,
  onOpen,
  label = 'Language'
}: LanguageContext & { label?: string; onOpen: () => void }) => (
  <ActionTile
    label={label}
    description={
      language.options.find(option => option.value === language.value)?.label
    }
    icon={<Translation size={18} />}
    onPress={onOpen}
  />
)

export const LanguageSettings = ({ language }: LanguageContext) => (
  <Options {...language} />
)

const defaultI18n: ControlCenterI18n = {
  defaultLanguage: 'en',
  languages: ['en']
}

type DocumentLanguageContext = { i18n?: ControlCenterI18n }

const useDocumentLanguage = (i18n: ControlCenterI18n = defaultI18n) => {
  const language = useRootAttribute('lang', i18n.defaultLanguage)
  const options = useMemo(() => {
    const names = new Intl.DisplayNames([i18n.defaultLanguage], {
      type: 'language'
    })
    return i18n.languages.map(value => ({
      value,
      label: names.of(value) ?? value
    }))
  }, [i18n.defaultLanguage, i18n.languages])
  return { ...language, options }
}

export const DocumentLanguageTile = ({
  i18n,
  onOpen,
  label = 'Language'
}: DocumentLanguageContext & { label?: string; onOpen: () => void }) => {
  const language = useDocumentLanguage(i18n)
  return <LanguageTile language={language} label={label} onOpen={onOpen} />
}

export const DocumentLanguageSettings = ({ i18n }: DocumentLanguageContext) => {
  const language = useDocumentLanguage(i18n)
  return <LanguageSettings language={language} />
}

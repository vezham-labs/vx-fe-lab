import type { Framework } from '../framework.ts'
import type { I18nConfig } from '../i18n.ts'
import { type DocsConfig, type OgConfig } from '../presets/docs/config.ts'

export type VxConfig = {
  framework: Framework
  core: VxCoreConfig
  docs?: DocsConfig
  og?: OgConfig
  i18n?: I18nConfig
  branding: {
    themeColor: string
    backgroundColor: string
  }
  pwa: VxPwaConfig
  metadata: VxMetadataConfig
}

type VxCoreConfig = {
  id: string
  name: string
  shortName: string
  version: string
  description: string
  publisher: {
    name: string
    url: string
  }
  url: string
}

type VxPwaConfig = {
  display: string
  orientation: string
  scope: string
  startUrl: string
  categories: string[]
  icons: VxIconSource
  screenshots: VxImage[]
  shortcuts: VxShortcut[]
}

export type VxIcon = {
  src: string
  sizes: string
  type: string
}

type VxIconSet = {
  path: string
  sizes: number[]
  type: string
}

export type VxIconSource = VxIcon[] | VxIconSet

type VxImage = {
  src: string
  sizes: string
  type: string
}

type VxShortcut = {
  name: string
  shortName: string
  url: string
  icons: VxIconSource
}

type VxMetadataConfig = {
  title: string
  keywords: string[]
  theme: {
    lightColor: string
    darkColor: string
    lightBackgroundColor: string
    darkBackgroundColor: string
  }
  platforms: {
    apple: {
      mobileWebAppCapable: boolean
      webAppCapable: boolean
      touchIcon: string
      startupImages: VxStartupImageSource
    }
    microsoft: {
      startUrl: string
    }
  }
  social: {
    openGraph: {
      type: string
      image?: string
    }
    twitter: {
      creator: string
      site: string
      card: string
      image?: string
    }
  }
}

export type VxStartupImage = {
  colorScheme?: 'light' | 'dark'
  device?: string
  width?: number
  height?: number
  pixelRatio?: number
  path?: string
  media?: string
  src?: string
}

type VxStartupImageSet = {
  path: string
  colorSchemes?: Array<'light' | 'dark'>
  sizes: VxStartupImage[]
}

export type VxStartupImageSource = VxStartupImage[] | VxStartupImageSet

export type GenerateMetadataOptions = {
  projectRoot?: string
}

export type MetadataFile = {
  path: string
  content: string
}

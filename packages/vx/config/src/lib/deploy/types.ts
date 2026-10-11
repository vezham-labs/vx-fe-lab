export type HostingProvider = 'firebase' | 'vercel'

/**
 * Deployment shapes are provider-specific: static Firebase Hosting, or SSR on
 * Vercel. Choose the preset for the application runtime and routing model.
 */
export type DeployPreset =
  'cdn' | 'spa' | 'start-spa' | 'next' | 'tanstack-start'

export type FirebaseDeployPresetName = Exclude<
  DeployPreset,
  'next' | 'tanstack-start'
>

export type VxDeployConfig = {
  preset?: DeployPreset
  providers: HostingProvider[]
  redirectDefaultLanguage?: boolean
  firebase?: FirebaseDeployConfig
  vercel?: VercelDeployConfig
}

export type VxAppConfig = {
  docs?: {
    docsRoute?: string
  }
  i18n?: {
    defaultLanguage: string
    languages: string[]
  }
  routes?: RouteConfig[]
}

export type RouteConfig = {
  path: string
  source?: string
}

export type FirebaseDeployConfig = {
  cleanUrls?: boolean
  headers?: false | FirebaseHeader[] | FirebaseHeaderOptions
  ignore?: string[]
  public?: string
  redirects?: FirebaseRedirect[]
  rewrites?: false | FirebaseRewrite[]
}

export type FirebaseHeaderOptions = {
  app?: boolean
  docs?: boolean
  routes?: boolean
  static?: boolean
}

export type FirebaseHeader = {
  source: string
  headers: Array<{
    key: string
    value: string
  }>
}

export type FirebaseRedirect = {
  source: string
  destination: string
  type: number
}

export type FirebaseRewrite = {
  source: string
  destination: string
}

export type FirebaseConfig = {
  hosting: {
    public: string
    ignore: string[]
    cleanUrls?: boolean
    headers?: FirebaseHeader[]
    redirects?: FirebaseRedirect[]
    rewrites?: FirebaseRewrite[]
  }
}

export type VercelDeployConfig = {
  buildCommand?: string
}

export type VercelFramework = 'nextjs' | 'tanstack-start' | 'vite' | null

export type VercelConfig = {
  $schema: string
  buildCommand?: string
  framework: VercelFramework
  outputDirectory?: string
  rewrites?: FirebaseRewrite[]
}

export type FirebaseDeployPreset = {
  public: string
  fallback?: string
  rewrites?: FirebaseRewrite[]
}

export type VercelDeployPreset = {
  framework: VercelFramework
  outputDirectory?: string
  rewrites?: FirebaseRewrite[]
}

export type GenerateDeployConfigOptions = {
  projectRoot?: string
}

export type DeployFile = {
  path: string
  content: string
}

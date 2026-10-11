/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AxiosRequestConfig } from 'axios'
import type { ReactNode } from 'react'

import type { AppRuntime } from '@vx/devtools'

interface AxiosProps {
  onRequest?: (config: AxiosRequestConfig) => {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => {}
}

interface Props extends AxiosProps {
  id?: string
  lang?: string
  className?: string
  runtime?: AppRuntime
  // vx-bot/REF: classTarget?: string
  children?: ReactNode

  // wjdlz/INFO: app prefer
  strict?: boolean
  // vx-bot/REF: disableAnimation?: boolean
  // vx-bot/REF: vmode?: Vmode

  // wjdlz/INFO: app impl
  name?: string
  version?: string
  query?: boolean
  store?: boolean
  worker?: boolean
  axios?: boolean
}

interface ProviderEnv {
  APP_ID: string
  APP_NAME: string
  APP_VER: string
  APP_ENV: string
  __DEBUG__: boolean
  __DEV__: boolean
}

export type { Props, ProviderEnv }

export const NAMESPACE = '@vx/start'

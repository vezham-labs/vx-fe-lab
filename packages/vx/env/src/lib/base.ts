export type BaseApiMode = 'api' | 'mock' | 'local'
const environments = ['local', 'dev', 'qa', 'preview', 'production'] as const
const releaseChannels = ['canary', 'beta', 'stable'] as const

type Environment = (typeof environments)[number]
type ReleaseChannel = (typeof releaseChannels)[number]

type Props = {
  MODE?: string
  V_APP_ENV?: string
  V_RELEASE_CHANNEL?: string

  V_APP_ID?: string
  V_APP_NAME?: string
  V_APP_VER?: string

  V_IS_DEBUG?: string

  V_BASE_API_MODE?: BaseApiMode
  V_MOCK_LOCAL_API_URL?: string
  V_MOCK_API_URL?: string
  V_APP_API_URL?: string
}

const parseSetting = <T extends string>(
  name: string,
  value: string,
  allowed: readonly T[]
): T => {
  const setting = allowed.find(option => option === value)
  if (setting === undefined) {
    throw new Error(`${name} must be one of: ${allowed.join(', ')}`)
  }

  return setting
}

const requireSetting = (name: string, value: string | undefined): string => {
  if (value === undefined || value.trim() === '') {
    throw new Error(`${name} is required`)
  }

  return value
}

export const createEnv = (__ENV__: Props) => {
  // vx-bot/NOTE: A production build can run in any deployment environment.
  const __DEV__ = __ENV__.MODE === 'development'
  const __PRODUCTION__ = __ENV__.MODE === 'production'
  const APP_ENV: Environment = parseSetting(
    'V_APP_ENV',
    __ENV__.V_APP_ENV || 'local',
    environments
  )
  const RELEASE_CHANNEL: ReleaseChannel = parseSetting(
    'V_RELEASE_CHANNEL',
    __ENV__.V_RELEASE_CHANNEL || 'stable',
    releaseChannels
  )

  // vx-bot/NOTE: app config
  const APP_ID = requireSetting('V_APP_ID', __ENV__.V_APP_ID)
  const APP_NAME = requireSetting('V_APP_NAME', __ENV__.V_APP_NAME)
  const APP_VER = requireSetting('V_APP_VER', __ENV__.V_APP_VER)

  // vx-bot/NOTE: app config By env
  const __DEBUG__ = __ENV__.V_IS_DEBUG === 'true'

  // vx-bot/NOTE: app - server/api endpoint
  // const BaseApiMode: BaseApiMode = __ENV__.V_BASE_API_MODE || 'api'

  // vx-bot/NOTE: for ws debugger
  if (__DEV__ && __DEBUG__) console.table(__ENV__)

  // wjdlz/NOTE: for start
  return {
    // vx-bot/INFO: @vx/app-env
    __DEV__,
    __PRODUCTION__,
    APP_ENV,
    RELEASE_CHANNEL,

    // vx-bot/INFO: @vx/app
    APP_ID,
    APP_NAME,
    APP_VER,

    __DEBUG__

    // vx-bot/REF: BASE_API_MODE
  }
}

// wjdlz/NOTE: use-axios | getApiServerEndPoint | config: AxiosRequestConfig
// const defineServerEnv = () => {
//   if (BaseApiMode === 'local') {
//     return __ENV__.V_MOCK_LOCAL_API_URL
//   }

// vx-bot/TODO: Restore mode-aware API endpoint selection with the axios integration.
// if (BaseApiMode === 'mock') {
//   return __ENV__.V_MOCK_API_URL
// }
//
// Type expectation was needed because domain_type is handled in @vx/start.
// } else if (config.domain_type === IAM.DomainType.SANDBOX) {
//   return __ENV__.V_APP_SANDBOX_API_URL
// } else if (config.domain_type === IAM.DomainType.DC) {
//   return __ENV__.V_APP_DC_API_URL
// }
//
// if (BaseApiMode === 'api' || config.domain_type === IAM.DomainType.DEFAULT)
// return __ENV__.V_APP_API_URL
// }

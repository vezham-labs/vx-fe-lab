import { type BaseApiMode } from '../base'

export const configEnv = {
  MODE: process.env.NODE_ENV,
  V_APP_ENV: process.env.V_APP_ENV,
  V_RELEASE_CHANNEL: process.env.V_RELEASE_CHANNEL,

  V_APP_ID: process.env.V_APP_ID,
  V_APP_NAME: process.env.V_APP_NAME,
  V_APP_VER: process.env.V_APP_VER,

  V_IS_DEBUG: process.env.V_IS_DEBUG,

  V_BASE_API_MODE: process.env.V_BASE_API_MODE as BaseApiMode,
  V_MOCK_LOCAL_API_URL: process.env.V_MOCK_LOCAL_API_URL,
  V_MOCK_API_URL: process.env.V_MOCK_API_URL,
  V_APP_API_URL: process.env.V_APP_API_URL
}

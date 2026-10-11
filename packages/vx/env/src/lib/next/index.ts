import { createEnv } from '../base'
import { configEnv } from './env'

// wjdlz/NOTE: for adding the env in next.config.ts
export { configEnv }

const __ENV__ = createEnv(configEnv)

export const {
  __DEV__,
  __PRODUCTION__,
  APP_ENV,
  RELEASE_CHANNEL,

  APP_ID,
  APP_NAME,
  APP_VER,

  __DEBUG__

  // vx-bot/REF: BASE_API_MODE
} = __ENV__

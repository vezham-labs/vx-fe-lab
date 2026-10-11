import {
  APP_ENV,
  APP_ID,
  APP_NAME,
  APP_VER,
  __DEBUG__,
  __DEV__
} from '@vx/env/vite'

import { ClientDevtools } from '../shared/devtools'
import { createProvider } from '../shared/provider'

const Provider = createProvider({
  env: { APP_ID, APP_NAME, APP_VER, APP_ENV, __DEBUG__, __DEV__ },
  renderDevtools: ({ app, query }) => (
    <ClientDevtools app={app} query={query} env={__DEV__} />
  )
})

export { Provider }

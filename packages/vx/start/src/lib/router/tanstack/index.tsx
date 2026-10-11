import {
  type AnyRoute,
  Outlet,
  createRouter as createTanstackRouter
} from '@tanstack/react-router'

import { APP_ENV, APP_ID, APP_NAME, APP_VER, __DEV__ } from '@vx/env/vite'
import { ErrorPage, Loading, NotFound } from '@vx/template/components'

import { ClientDevtools } from '../../provider/shared/devtools'

export const RouterRoot = () => (
  <>
    <Outlet />
    <ClientDevtools
      app={{
        id: APP_ID,
        name: APP_NAME,
        version: APP_VER,
        environment: APP_ENV,
        runtime: 'vite'
      }}
      env={__DEV__}
    />
  </>
)

const DefaultNotFound = () => <NotFound app={APP_NAME} version={APP_VER} />

export const createRouter: typeof createTanstackRouter = options => {
  const notFoundComponent = options.defaultNotFoundComponent ?? DefaultNotFound
  const configureRoute = (route: AnyRoute) => {
    // vx-bot/NOTE: Resolve missing pages below the root so the application shell stays mounted.
    if (route !== options.routeTree && !route.options.notFoundComponent) {
      route.update({ notFoundComponent })
    }
    route.children?.forEach(configureRoute)
  }
  if (options.routeTree) configureRoute(options.routeTree)
  return createTanstackRouter({
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPendingComponent: Loading,
    defaultErrorComponent: ErrorPage,
    defaultNotFoundComponent: notFoundComponent,
    ...options
  })
}

// import { Loading, ErrorPage, NotFound } from '@vezham/templates'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { defineConfig } from '@vx/start'

import { routeTree } from '@src/routeTree.gen'

import './global.css'

// @vx/NOTE: Create a new router instance
const router = createRouter({
  scrollRestoration: true,
  routeTree
  // defaultPendingComponent: () => <Loading />,
  // defaultErrorComponent: () => <ErrorPage />,
  // defaultNotFoundComponent: () => <NotFound app={APP_NAME} />
})

// @vx/NOTE: Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

defineConfig({
  children: <RouterProvider router={router} />
})

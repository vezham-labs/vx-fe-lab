import { QueryClientContext } from '@tanstack/react-query'
import { Suspense, lazy, useContext, useSyncExternalStore } from 'react'

import type { DevtoolsApp } from '@vx/devtools'

const Devtools = lazy(() =>
  import('@vx/devtools').then(module => ({ default: module.Devtools }))
)

const emptySubscribe = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

interface Props {
  app: DevtoolsApp
  env: boolean
  router?: boolean
  query?: boolean
}

const ClientDevtools = ({ app, env, router, query }: Props) => {
  // vx-bot/NOTE: Standalone route devtools may run without a query provider.
  const queryClient = useContext(QueryClientContext)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  )

  if (!env || !mounted) return null

  return (
    <Suspense fallback={null}>
      <Devtools
        app={app}
        env={env}
        router={router}
        query={query ?? Boolean(queryClient)}
      />
    </Suspense>
  )
}

export { ClientDevtools }

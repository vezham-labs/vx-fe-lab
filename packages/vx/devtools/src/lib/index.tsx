import {
  TanStackDevtools,
  TanStackDevtoolsReactPlugin
} from '@tanstack/react-devtools'
import { hotkeysDevtoolsPlugin } from '@tanstack/react-hotkeys-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { DevtoolsPanel } from './devtools-panel'
import type { Props } from './types'

export type { AppRuntime, DevtoolsApp, Props } from './types'

export const Devtools = ({
  app,
  env = true,
  router = true,
  query = true
}: Props) => {
  if (!env) return null

  const plugins: TanStackDevtoolsReactPlugin[] = [
    {
      name: 'Vezham Devtools',
      render: (_element, { theme }) => <DevtoolsPanel app={app} theme={theme} />
    },
    hotkeysDevtoolsPlugin()
  ]

  if (query) {
    plugins.push({
      name: 'TanStack Query',
      render: <ReactQueryDevtoolsPanel />
    })
  }

  if (router) {
    plugins.push({
      name: 'TanStack Router',
      render: <TanStackRouterDevtoolsPanel />
    })
  }

  return (
    <TanStackDevtools
      // vx-bot/REF: config={{ position: 'top-right' }}
      plugins={plugins}
    />
  )
}

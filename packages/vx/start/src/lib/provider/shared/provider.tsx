import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FC, ReactNode } from 'react'
import { StrictMode, useState } from 'react'

import { VezhamProvider, cn } from '@vezham/react-v2'
import { Toast } from '@vezham/react-v3'
import { defineLogger } from '@vezham/use-logger'

import type { DevtoolsApp } from '@vx/devtools'

import type { Props, ProviderEnv } from './types'

const MINUTE = 1000 * 60

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * MINUTE
        // vx-bot/REF: gcTime: 60 * 24* MINUTE, // 24 hours
        // vx-bot/REF: retry: 0,
      }
    }
  })

interface CreateProviderProps {
  env: ProviderEnv
  renderDevtools?: (options: { app: DevtoolsApp; query: boolean }) => ReactNode
}

const createProvider = ({ env, renderDevtools }: CreateProviderProps) => {
  defineLogger(env)

  const Provider: FC<Props> = ({
    id = env.APP_ID,
    className = '',
    // vx-bot/REF: classTarget,
    children,

    strict = true,
    // vx-bot/REF: disableAnimation
    // vx-bot/REF: vmode,

    name = env.APP_NAME,
    runtime = 'vite',
    version = env.APP_VER,
    query = true
  }) => {
    // vx-bot/NOTE: Keep caches isolated between server renders and provider instances.
    const [queryClient] = useState(createQueryClient)
    const classList = cn('vx-app', className)
    const app = {
      environment: env.APP_ENV,
      id,
      name,
      runtime,
      version
    } satisfies DevtoolsApp
    let template = (
      <>
        <VezhamProvider>
          <div data-vx-app-version={version} className={classList}>
            {children}
          </div>
          <Toast.Provider />
          {/* vx-bot/TODO: Restore the theme provider with lockscreen, announcement,
            search spotlight, and portal support.
            <ThemeProvider classTarget={classTarget} vmode={vmode}>
              <Lockscreen />
              <NoInternetConnection />
              <div id="portal"></div>
            </ThemeProvider> */}
        </VezhamProvider>
        {renderDevtools?.({ app, query })}
      </>
    )

    if (query) {
      template = (
        <QueryClientProvider client={queryClient}>
          {template}
        </QueryClientProvider>
      )
    }

    if (strict) {
      template = <StrictMode>{template}</StrictMode>
    }

    return template
  }

  return Provider
}

export { createProvider }

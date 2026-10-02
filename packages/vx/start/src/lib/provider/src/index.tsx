// import { OverlayProvider } from '@react-aria/overlays'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, StrictMode, lazy } from 'react'
import ReactDOM from 'react-dom/client'

import { VezhamProvider, cn } from '@vezham/react-v2'
// import { Toaster } from 'sonner'

// import { initWorker } from '@vezham/contracts'
// import { Lockscreen, NoInternetConnection } from '@vezham/templates'
// import { ThemeProvider } from '@vezham/theme'
// import { defineAxios, defineStore } from '@vezham/hooks'
// import { startWorker as defineWorker } from '@vezham/shared-sw'
// import { cn } from '@vezham/system-utils'

import { useLogger } from '@vezham/use-logger'

import { APP_NAME, __DEV__ } from '@vx/system-utils'

import { Props } from './types'

const NAMESPACE = '@vx/start'

const MINUTE = 1000 * 60

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * MINUTE
      // gcTime: 60 * 24* MINUTE, // 24 hours
      // retry: 0,
    }
  }
})

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then(d => ({
    default: d.ReactQueryDevtools
  }))
)

const Provider: FC<Props> = ({
  className = '',
  children,
  classTarget,
  // vmode,
  strict = true,
  query = true
}) => {
  const classList = cn('vx-app', className)
  let template = (
    <VezhamProvider>
      {/* <ThemeProvider classTarget={classTarget} vmode={vmode}>
      <OverlayProvider>
        <Toaster />
        <Lockscreen />
        <NoInternetConnection /> */}
      {/* wjdlz/TODO: Banner / AlertBanner / Announcement / Search / Header / Container */}
      <div className={classList}>{children}</div>
      {/* <div id="portal"></div> */}
      {/* </OverlayProvider> */}
      {/* </ThemeProvider> */}
    </VezhamProvider>
  )

  if (query) {
    template = (
      <QueryClientProvider client={queryClient}>
        {__DEV__ ? <ReactQueryDevtools /> : null}
        {template}
      </QueryClientProvider>
    )
  }

  if (strict) {
    template = <StrictMode>{template}</StrictMode>
  }
  return template
}

// @vx/NOTE: defineLogger is handled by @vx/system-utils
const preConfig = ({ name, version, store = true }: Props) => {
  if (store) {
    // defineStore({ pretext: name, version })
  }
}

const config = ({ worker = true, axios = true, ...props }: Props) => {
  if (worker) {
    // defineWorker({})
  }
  if (axios) {
    // defineAxios(props)
  }
}

const defineConfig = ({ name = APP_NAME, ...props }: Props) => {
  const el = document.getElementById('root') as HTMLElement
  if (el && !el.getAttribute('vx-app-mounted')) {
    preConfig(props)

    const root = ReactDOM.createRoot(el)
    root.render(<Provider {...props} />)
    el.setAttribute('vx-app-mounted', name || '')

    config(props)
  } else {
    useLogger.log(NAMESPACE, '[provider] | root el is missing')
  }
}

export { Provider, defineConfig }

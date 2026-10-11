type AppRuntime = 'next' | 'tanstack' | 'tanstack-docs' | 'vite'

type DevtoolsApp = {
  id: string
  name: string
  version: string
  environment: string
  runtime: AppRuntime
}

interface Props {
  app: DevtoolsApp
  env: boolean
  router?: boolean
  query?: boolean
}

export type { AppRuntime, DevtoolsApp, Props }

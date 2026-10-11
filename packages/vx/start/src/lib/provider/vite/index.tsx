import ReactDOM from 'react-dom/client'

import { useLogger } from '@vezham/use-logger'

import { APP_ID, APP_NAME, APP_VER } from '@vx/env/vite'

import { config, preConfig } from '../shared/config'
import { ClientDevtools } from '../shared/devtools'
import { NAMESPACE, type Props } from '../shared/types'
import { Provider } from './provider'

const defineConfig = (props: Props) => {
  const options = {
    ...props,
    id: props.id || APP_ID,
    name: props.name || APP_NAME,
    version: props.version || APP_VER
  }

  const el = document.getElementById('root') as HTMLElement
  if (el && !el.getAttribute('data-vx-app')) {
    document.documentElement.lang = options.lang ?? 'en'
    preConfig(options)

    const root = ReactDOM.createRoot(el)
    root.render(<Provider {...options} runtime="vite" />)
    el.setAttribute('data-vx-app', options.name || '')

    config(options)
  } else {
    useLogger.log(NAMESPACE, '[provider] | root el is missing')
  }
}

export { ClientDevtools, defineConfig, Provider }

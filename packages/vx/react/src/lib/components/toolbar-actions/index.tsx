import {
  type ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

export type ToolbarActionEvent = {
  actionKey: string
  pageKey: string
  pathname: string
}

export type ToolbarActionHandler = (event: ToolbarActionEvent) => void

type Scope = { pageKey?: string; pathname?: string }
type Subscription = Scope & { actionKey: string; handler: ToolbarActionHandler }

export const createToolbarActions = () => {
  const subscriptions = new Map<string, Set<Subscription>>()
  const subscribe = (
    actionKey: string,
    handler: ToolbarActionHandler,
    scope: Scope = {}
  ) => {
    const subscription = { ...scope, actionKey, handler }
    const handlers = subscriptions.get(actionKey) ?? new Set<Subscription>()
    handlers.add(subscription)
    subscriptions.set(actionKey, handlers)
    return () => {
      handlers.delete(subscription)
      if (handlers.size === 0 && subscriptions.get(actionKey) === handlers)
        subscriptions.delete(actionKey)
    }
  }
  const emit = (event: ToolbarActionEvent) => {
    let selected: Subscription | undefined
    let priority = -1
    const handlers = subscriptions.get(event.actionKey)
    if (!handlers) return false
    for (const subscription of handlers) {
      if (subscription.pageKey && subscription.pageKey !== event.pageKey)
        continue
      if (subscription.pathname && subscription.pathname !== event.pathname)
        continue
      const specificity =
        Number(Boolean(subscription.pageKey)) +
        Number(Boolean(subscription.pathname))
      if (specificity >= priority) {
        selected = subscription
        priority = specificity
      }
    }
    selected?.handler(event)
    return Boolean(selected)
  }
  return { subscribe, emit }
}

export const ToolbarActionsContext = createContext<ReturnType<
  typeof createToolbarActions
> | null>(null)

export const ToolbarActionsProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [actions] = useState(createToolbarActions)
  return (
    <ToolbarActionsContext.Provider value={actions}>
      {children}
    </ToolbarActionsContext.Provider>
  )
}

export const useToolbarActions = () => {
  const actions = useContext(ToolbarActionsContext)
  if (!actions)
    throw new Error('Toolbar actions require ToolbarActionsProvider')
  return actions
}

export const useToolbarAction = (
  actionKey: string,
  handler: ToolbarActionHandler,
  { pageKey, pathname, enabled = true }: Scope & { enabled?: boolean } = {}
) => {
  const { subscribe } = useToolbarActions()
  const latestHandler = useRef(handler)
  useLayoutEffect(() => {
    latestHandler.current = handler
  }, [handler])
  useLayoutEffect(() => {
    if (enabled)
      return subscribe(actionKey, event => latestHandler.current(event), {
        pageKey,
        pathname
      })
    return undefined
  }, [actionKey, enabled, pageKey, pathname, subscribe])
}

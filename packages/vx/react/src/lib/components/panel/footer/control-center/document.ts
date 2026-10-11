import { useCallback, useSyncExternalStore } from 'react'

export const useRootAttribute = (
  attribute: 'dir' | 'lang' | 'data-vx-theme-color',
  fallback: string
) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const observer = new MutationObserver(onChange)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attribute]
      })
      return () => observer.disconnect()
    },
    [attribute]
  )
  const getSnapshot = useCallback(
    () => document.documentElement.getAttribute(attribute) || fallback,
    [attribute, fallback]
  )
  const getServerSnapshot = useCallback(() => fallback, [fallback])
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return {
    value,
    onChange: (next: string) => {
      document.documentElement.setAttribute(attribute, next)
    }
  }
}

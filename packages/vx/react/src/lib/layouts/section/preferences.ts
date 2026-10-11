import { useCallback, useEffect, useRef, useState } from 'react'

import { DEFAULT_SORT, type SectionSort } from './sort-menu'
import type { SectionFilterKey } from './toolbar'

export const useSectionPreferences = (
  scope: string,
  onSortChange?: (value: SectionSort) => void
) => {
  const [state, setState] = useState({
    scope,
    selectedFilters: [] as SectionFilterKey[],
    sortValue: DEFAULT_SORT
  })

  if (state.scope !== scope) {
    setState({ scope, selectedFilters: [], sortValue: DEFAULT_SORT })
  }

  const previousScope = useRef(scope)
  useEffect(() => {
    if (previousScope.current === scope) return
    previousScope.current = scope
    onSortChange?.(DEFAULT_SORT)
  }, [scope, onSortChange])

  const setSelectedFilters = useCallback(
    (selectedFilters: SectionFilterKey[]) => {
      setState(current => ({ ...current, selectedFilters }))
    },
    []
  )

  const handleSortChange = useCallback(
    (sortValue: SectionSort) => {
      setState(current => ({ ...current, sortValue }))
      onSortChange?.(sortValue)
    },
    [onSortChange]
  )

  return { ...state, setSelectedFilters, handleSortChange }
}

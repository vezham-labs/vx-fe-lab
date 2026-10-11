import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SectionLayout } from './index'
import type { SectionSort } from './sort-menu'
import type { SectionFilterKey } from './toolbar'

const route = vi.hoisted(() => ({ pathname: '/academic/classes/allclasses' }))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => route,
  useNavigate: () => vi.fn(),
  useRouter: () => ({ history: { back: vi.fn(), forward: vi.fn() } })
}))
vi.mock('../../components/workspace-navigation', () => ({
  useWorkspaceNavigation: () => ({
    isNavigationCollapsed: true,
    toggleNavigation: vi.fn(),
    registerMobileSidebar: vi.fn()
  }),
  useSidebarShortcut: vi.fn()
}))
vi.mock('./toolbar', () => ({
  SectionActiveFilters: () => null,
  SectionToolbar: ({
    selectedFilters,
    onSelectedFiltersChange,
    sortValue,
    onSortChange
  }: {
    selectedFilters: SectionFilterKey[]
    onSelectedFiltersChange: (value: SectionFilterKey[]) => void
    sortValue: SectionSort
    onSortChange: (value: SectionSort) => void
  }) => (
    <>
      <button onClick={() => onSelectedFiltersChange(['images'])}>
        Select Images
      </button>
      <button
        onClick={() =>
          onSortChange({ by: 'updated', direction: 'descending' })
        }>
        Sort by updated descending
      </button>
      <output aria-label="Filter selection">{selectedFilters.join(',')}</output>
      <output aria-label="Sort selection">
        {sortValue.by}:{sortValue.direction}
      </output>
    </>
  )
}))

describe('Section filter and sort scope', () => {
  it.each([true, false])(
    'retains selections within a section and resets on another section (explicit key: %s)',
    explicit => {
      const onSortChange = vi.fn()
      const sidebarItems = [
        { key: 'classes', title: 'Classes', href: '/academic/classes' },
        { key: 'classroom', title: 'Class Room', href: '/academic/classroom' }
      ]
      const content = (section: string) => (
        <SectionLayout
          title={section}
          sectionKey={explicit ? section : undefined}
          sidebarItems={sidebarItems}
          tabs={[]}
          filter
          sort
          onSortChange={onSortChange}>
          Page
        </SectionLayout>
      )
      route.pathname = '/academic/classes/allclasses'
      const { rerender } = render(content('classes'))
      fireEvent.click(screen.getByRole('button', { name: 'Select Images' }))
      fireEvent.click(
        screen.getByRole('button', { name: 'Sort by updated descending' })
      )
      onSortChange.mockClear()

      route.pathname = '/academic/classes/schedule'
      rerender(content('classes'))
      expect(screen.getByLabelText('Filter selection')).toHaveTextContent(
        'images'
      )
      expect(screen.getByLabelText('Sort selection')).toHaveTextContent(
        'updated:descending'
      )
      expect(onSortChange).not.toHaveBeenCalled()

      route.pathname = '/academic/classroom'
      rerender(content('classroom'))
      expect(screen.getByLabelText('Filter selection')).toBeEmptyDOMElement()
      expect(screen.getByLabelText('Sort selection')).toHaveTextContent(
        'name:ascending'
      )
      expect(onSortChange).toHaveBeenCalledExactlyOnceWith({
        by: 'name',
        direction: 'ascending'
      })

      route.pathname = '/academic/classes/allclasses'
      rerender(content('classes'))
      expect(screen.getByLabelText('Filter selection')).toBeEmptyDOMElement()
      expect(screen.getByLabelText('Sort selection')).toHaveTextContent(
        'name:ascending'
      )
    }
  )
})

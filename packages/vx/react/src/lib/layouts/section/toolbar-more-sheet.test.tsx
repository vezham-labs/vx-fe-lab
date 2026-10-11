import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_SORT, type SectionSort } from './sort-menu'
import type { SectionFilterKey } from './toolbar'
import { ToolbarMoreSheet } from './toolbar-more-sheet'

const Fixture = ({ onExport }: { onExport: () => void }) => {
  const [filters, setFilters] = useState<SectionFilterKey[]>([])
  const [sort, setSort] = useState<SectionSort>(DEFAULT_SORT)
  return (
    <ToolbarMoreSheet
      filterAction={{
        key: 'filter',
        label: 'Filter',
        icon: 'vx:sort-descending'
      }}
      filterGroups={[
        {
          label: 'File type',
          options: [{ key: 'images', label: 'Images', icon: 'vx:gallery' }]
        }
      ]}
      selectedFilters={filters}
      onToggleFilter={key =>
        setFilters(current =>
          current.includes(key)
            ? current.filter(item => item !== key)
            : [...current, key]
        )
      }
      sort
      sortValue={sort}
      onSortChange={setSort}
      sync={false}
      onSync={vi.fn()}
      viewModeActions={[]}
      onViewModeChange={vi.fn()}
      menuActions={[
        {
          key: 'export',
          label: 'Export',
          icon: 'vx:download',
          children: [
            {
              key: 'pdf',
              label: 'PDF',
              icon: 'vx:file-text',
              onAction: onExport
            }
          ]
        }
      ]}
    />
  )
}

describe('Toolbar More sheet', () => {
  it('keeps selections open, navigates back, and closes nested actions', async () => {
    const onExport = vi.fn()
    render(<Fixture onExport={onExport} />)
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Filter' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Images' }))
    expect(screen.getByRole('button', { name: 'Images' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Back to toolbar actions' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sort' }))
    fireEvent.click(screen.getByRole('button', { name: 'Created date' }))
    fireEvent.click(screen.getByRole('button', { name: 'Descending' }))
    expect(
      screen.getByRole('button', { name: 'Created date' })
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Descending' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Back to toolbar actions' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }))
    expect(screen.getByRole('button', { name: 'Images' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Back to toolbar actions' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Export' }))
    fireEvent.click(screen.getByRole('button', { name: 'PDF' }))
    expect(onExport).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    expect(await screen.findByRole('button', { name: 'Filter' })).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Back to toolbar actions' })
    ).toBeNull()
  })
})

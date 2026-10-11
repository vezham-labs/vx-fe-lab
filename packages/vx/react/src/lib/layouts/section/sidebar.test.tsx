import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { AppNavigationItem } from '../../navigation'
import { SectionSidebar } from './sidebar'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: ComponentProps<'a'> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  )
}))

const items: AppNavigationItem[] = [
  {
    key: 'exams',
    title: 'Examinations',
    href: '/academic/exams',
    childrenDisplay: 'sidebar',
    children: [
      { key: 'grades', title: 'Grades', href: '/academic/exams/grades' },
      { key: 'results', title: 'Results', href: '/academic/exams/results' }
    ]
  },
  {
    key: 'classes',
    title: 'Classes',
    href: '/academic/classes',
    children: [
      { key: 'all', title: 'All Classes', href: '/academic/classes/all' }
    ]
  }
]

describe('Section sidebar child pages', () => {
  it('expands the active group, highlights its page, and keeps default tab groups flat', () => {
    const onNavigate = vi.fn()
    const content = (pathname: string) => (
      <SectionSidebar
        items={items}
        pathname={pathname}
        label="Academic sections"
        onNavigate={onNavigate}
      />
    )
    const { rerender } = render(content('/academic/exams/grades'))
    expect(screen.getByRole('link', { name: 'Grades' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('link', { name: 'Results' })).not.toHaveAttribute(
      'aria-current'
    )
    expect(screen.queryByRole('link', { name: 'All Classes' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Examinations' }))
    expect(screen.queryByRole('link', { name: 'Grades' })).toBeNull()
    rerender(content('/academic/exams/results'))
    expect(screen.getByRole('link', { name: 'Results' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    fireEvent.click(screen.getByRole('link', { name: 'Grades' }))
    expect(onNavigate).toHaveBeenCalledOnce()
  })
})

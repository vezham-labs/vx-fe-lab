import { renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { useProps } from './types'

describe('panel menu props', () => {
  it('applies variants without forwarding them to the DOM', () => {
    const { result } = renderHook(() =>
      useProps({
        items: [],
        variant: 'muted',
        size: 'sm',
        spacing: 'compact',
        itemRadius: 'full',
        collapsed: true
      })
    )

    expect(
      result.current.getLabelProps({ isActive: false }).className
    ).toContain('hidden')
    expect(result.current.getIconWrapperProps().className).toContain('h-[20px]')
    expect(result.current.collapsed).toBe(true)

    const domProps = result.current.getBaseProps()
    for (const key of [
      'variant',
      'size',
      'spacing',
      'itemRadius',
      'collapsed',
      'items'
    ]) {
      expect(domProps).not.toHaveProperty(key)
    }
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'keeps menu icons at 20px for %s size',
    size => {
      const { result } = renderHook(() => useProps({ items: [], size }))

      expect(
        result.current.getIconProps({ isActive: false }).className
      ).toContain('h-5 w-5')
    }
  )

  it('preserves DOM props, refs, and slot class overrides', () => {
    const ref = createRef<HTMLDivElement>()
    const { result } = renderHook(() =>
      useProps({
        items: [],
        id: 'school-menu',
        ref,
        role: 'navigation',
        'aria-label': 'School navigation',
        className: 'custom-menu',
        classNames: { base: 'custom-base' }
      })
    )

    expect(result.current.getBaseProps()).toMatchObject({
      id: 'school-menu',
      ref,
      role: 'navigation',
      'aria-label': 'School navigation'
    })
    expect(result.current.getBaseProps().className).toContain('custom-menu')
    expect(result.current.getBaseProps().className).toContain('custom-base')
  })

  it('preserves callback refs and the expanded default', () => {
    const ref = () => undefined
    const { result } = renderHook(() => useProps({ items: [], ref }))

    expect(result.current.getBaseProps().ref).toBe(ref)
    expect(result.current.collapsed).toBe(false)
    expect(
      result.current.getLabelProps({ isActive: false }).className
    ).toContain('block')
  })
})

export type Framework = 'vite' | 'tanstack' | 'tanstack-docs' | 'next'

export const validateFramework = (value: unknown): Framework => {
  if (
    value === 'vite' ||
    value === 'tanstack' ||
    value === 'tanstack-docs' ||
    value === 'next'
  )
    return value
  throw new Error(
    'vx.app.yaml framework must be vite, tanstack, tanstack-docs, or next'
  )
}

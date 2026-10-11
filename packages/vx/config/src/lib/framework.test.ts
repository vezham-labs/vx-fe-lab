import { expect, it } from 'vitest'

import { validateFramework } from './framework.ts'

it.each(['vite', 'tanstack', 'tanstack-docs', 'next'])('accepts %s', value => {
  expect(validateFramework(value)).toBe(value)
})

it.each([undefined, null, '', 'unknown'])(
  'rejects invalid framework %s',
  value => {
    expect(() => validateFramework(value)).toThrow(
      'vx.app.yaml framework must be'
    )
  }
)

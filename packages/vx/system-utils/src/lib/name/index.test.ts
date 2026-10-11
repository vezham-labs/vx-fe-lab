import { describe, expect, it } from 'vitest'

import { getInitials } from './index'

describe('getInitials', () => {
  it.each([
    ['John Doe', 'JD'],
    ['Bob', 'B'],
    ['  Ada   Lovelace Byron  ', 'AL'],
    ['\tGrace\nHopper', 'GH'],
    ['  ', '']
  ])('returns the first two initials for %j', (name, expected) => {
    expect(getInitials(name)).toBe(expected)
  })
})

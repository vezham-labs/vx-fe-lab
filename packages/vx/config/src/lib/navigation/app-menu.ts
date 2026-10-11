const MENU_FIELDS = new Set(['key', 'label', 'icon', 'groups'])
const ACTION_FIELDS = new Set(['key', 'label', 'icon', 'shortcut'])

const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const validateEntry = (
  value: unknown,
  fields: ReadonlySet<string>,
  location: string,
  keys: Set<string>
) => {
  if (!object(value)) throw new Error(`${location} must be an object`)
  for (const field of Object.keys(value)) {
    if (!fields.has(field))
      throw new Error(`Unknown field: ${location}.${field}`)
  }
  for (const field of ['key', 'label', 'icon', 'shortcut']) {
    if (field === 'key' || field === 'label' || value[field] !== undefined) {
      if (typeof value[field] !== 'string' || !value[field].trim())
        throw new Error(`${location}.${field} must be a non-empty string`)
    }
  }
  const key = value.key as string
  if (keys.has(key))
    throw new Error(`Duplicate app menu key: ${location}.${key}`)
  keys.add(key)
  return value
}

export const validateAppMenu = (value: unknown, location: string) => {
  if (!Array.isArray(value)) throw new Error(`${location} must be an array`)
  const menuKeys = new Set<string>()
  const actionKeys = new Set<string>()
  for (const entry of value) {
    const menu = validateEntry(entry, MENU_FIELDS, location, menuKeys)
    if (!Array.isArray(menu.groups) || !menu.groups.length)
      throw new Error(
        `${location}.${menu.key}.groups must be a non-empty array`
      )
    for (const group of menu.groups) {
      if (!Array.isArray(group) || !group.length)
        throw new Error(
          `${location}.${menu.key} groups must be non-empty arrays`
        )
      for (const action of group)
        validateEntry(
          action,
          ACTION_FIELDS,
          `${location}.${menu.key}`,
          actionKeys
        )
    }
  }
}

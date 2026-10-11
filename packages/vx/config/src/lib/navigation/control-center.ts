const TYPES = new Set([
  'direction-toggle',
  'appearance-toggle',
  'appearance',
  'theme',
  'direction',
  'language',
  'preview-wifi',
  'preview-bluetooth',
  'preview-airdrop',
  'preview-focus',
  'preview-stage-manager',
  'preview-mirroring',
  'preview-media',
  'preview-display',
  'preview-sound',
  'custom'
])
const FIELDS = new Set([
  'id',
  'type',
  'span',
  'label',
  'description',
  'editable',
  'action'
])
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const validateControlCenter = (value: unknown, location: string) => {
  if (
    !object(value) ||
    Object.keys(value).some(key => !['tiles', 'editControls'].includes(key)) ||
    !Array.isArray(value.tiles)
  )
    throw new Error(`${location} must contain a tiles array`)
  if (
    value.editControls !== undefined &&
    typeof value.editControls !== 'boolean'
  )
    throw new Error(`${location}.editControls must be a boolean`)
  const ids = new Set<string>()
  for (const tile of value.tiles) {
    if (!object(tile)) throw new Error(`${location}.tiles must contain objects`)
    for (const [field, entry] of Object.entries(tile)) {
      if (!FIELDS.has(field))
        throw new Error(`Unknown field: ${location}.${field}`)
      if (field === 'editable') {
        if (typeof entry !== 'boolean')
          throw new Error(`${location}.editable must be a boolean`)
      } else if (typeof entry !== 'string' || !entry.trim()) {
        throw new Error(`${location}.${field} must be a non-empty string`)
      }
    }
    if (typeof tile.id !== 'string' || !tile.id.trim())
      throw new Error(`${location}.id is required`)
    if (tile.id === 'edit-controls')
      throw new Error(`${location}.edit-controls is a reserved built-in action`)
    if (ids.has(tile.id))
      throw new Error(`Duplicate control center tile id: ${tile.id}`)
    ids.add(tile.id)
    if (typeof tile.type !== 'string' || !TYPES.has(tile.type))
      throw new Error(`Unknown control center tile type: ${tile.type}`)
    if (!['compact', 'standard', 'wide', 'full'].includes(String(tile.span)))
      throw new Error(`${location}.${tile.id}.span is invalid`)
    if (tile.type === 'custom') {
      if (typeof tile.action !== 'string' || !tile.action.trim())
        throw new Error(`${location}.${tile.id}.action is required`)
    } else if (tile.action !== undefined)
      throw new Error(
        `${location}.${tile.id}.action is only supported for custom tiles`
      )
  }
}

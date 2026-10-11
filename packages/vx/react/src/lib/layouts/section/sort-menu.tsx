import { Dropdown, Label, Separator } from '@vezham/react-v3'

export type SectionSort = {
  by: 'name' | 'created' | 'updated'
  direction: 'ascending' | 'descending'
}

export const DEFAULT_SORT: SectionSort = {
  by: 'name',
  direction: 'ascending'
}

export const sortFields = [
  { key: 'name', label: 'Name' },
  { key: 'created', label: 'Created date' },
  { key: 'updated', label: 'Updated date' }
] as const

export const sortDirections = [
  { key: 'ascending', label: 'Ascending' },
  { key: 'descending', label: 'Descending' }
] as const

export const SortMenu = ({
  value,
  onChange
}: {
  value: SectionSort
  onChange?: (value: SectionSort) => void
}) => (
  <Dropdown.Menu
    aria-label="Sort options"
    selectionMode="multiple"
    selectedKeys={[value.by, value.direction]}>
    <Label className="text-muted px-3 pt-2">Sort by</Label>
    <Dropdown.Section aria-label="Sort by">
      {sortFields.map(option => (
        <Dropdown.Item
          key={option.key}
          id={option.key}
          textValue={option.label}
          shouldCloseOnSelect={false}
          onPress={() => onChange?.({ ...value, by: option.key })}>
          {option.label}
          <Dropdown.ItemIndicator />
        </Dropdown.Item>
      ))}
    </Dropdown.Section>
    <Separator />
    <Label className="text-muted px-3 pt-2">Direction</Label>
    <Dropdown.Section aria-label="Direction">
      {sortDirections.map(option => (
        <Dropdown.Item
          key={option.key}
          id={option.key}
          textValue={option.label}
          shouldCloseOnSelect={false}
          onPress={() => onChange?.({ ...value, direction: option.key })}>
          {option.label}
          <Dropdown.ItemIndicator />
        </Dropdown.Item>
      ))}
    </Dropdown.Section>
  </Dropdown.Menu>
)

import { CodeSquare, HandStars, ShieldWarning } from '@vezham/icons-react'
import { Dropdown } from '@vezham/react-v3'

import type { Conversation } from './conversation'

const permissions = [
  {
    label: 'Ask for approval',
    description: 'Always ask to edit external files and use the internet',
    Icon: HandStars
  },
  {
    label: 'Approve for me',
    description: 'Only ask for actions detected as potentially unsafe',
    Icon: CodeSquare
  },
  {
    label: 'Full access',
    description:
      'Unrestricted access to the internet and any file on your computer',
    Icon: ShieldWarning
  }
]

export const PermissionPicker = ({
  conversation: c
}: {
  conversation: Conversation
}) => (
  <Dropdown>
    <Dropdown.Trigger
      aria-label="Tool permissions"
      className="button button--ghost button--sm text-muted text-xs">
      {c.permissions}
    </Dropdown.Trigger>
    <Dropdown.Popover
      placement="top start"
      className="w-96 max-w-[calc(100vw-2rem)]">
      <Dropdown.Menu
        aria-label="Tool permissions"
        selectionMode="single"
        selectedKeys={[c.permissions]}
        onAction={key => c.setPermissions(String(key))}>
        {permissions.map(({ label, description, Icon }) => (
          <Dropdown.Item
            key={label}
            id={label}
            textValue={label}
            className={`gap-2 ps-2! pe-7 ${label === 'Full access' ? 'text-warning' : ''}`}>
            <Icon size={16} aria-hidden="true" className="shrink-0" />
            <span className="min-w-0 flex-1 py-1">
              <span className="block text-xs font-medium">{label}</span>
              <span
                className={`block text-xs whitespace-normal ${label === 'Full access' ? 'text-warning' : 'text-muted'}`}>
                {description}
              </span>
            </span>
            <Dropdown.ItemIndicator className="start-auto end-2" />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
      <p className="text-muted px-3 pt-1 pb-2 text-xs">
        Preview only · No files or internet access is granted.
      </p>
    </Dropdown.Popover>
  </Dropdown>
)

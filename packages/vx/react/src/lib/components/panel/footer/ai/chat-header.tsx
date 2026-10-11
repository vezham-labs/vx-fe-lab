import {
  AddCircle,
  AltArrowDown,
  Maximize,
  Minimize
} from '@vezham/icons-react'
import { Button, Dropdown } from '@vezham/react-v3'

import type { Conversation } from './conversation'

type Props = {
  conversation: Conversation
  expanded?: boolean
  onExpand?: () => void
}
export const ChatHeader = ({ conversation, expanded, onExpand }: Props) => (
  <nav
    aria-label="Chat navigation"
    className="flex min-w-0 shrink-0 items-center gap-1">
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Choose a chat"
        className="button button--ghost button--sm flex w-auto min-w-0 shrink flex-row flex-nowrap items-center justify-start gap-2">
        <span className="min-w-0 truncate text-start">
          {conversation.title}
        </span>
        <AltArrowDown className="shrink-0" size={14} aria-hidden="true" />
      </Dropdown.Trigger>
      <Dropdown.Popover className="w-72">
        <Dropdown.Menu
          aria-label="Recent chats"
          onAction={key => conversation.openChat(String(key))}>
          {conversation.threads.map(thread => (
            <Dropdown.Item
              key={thread.id}
              id={thread.id}
              textValue={thread.title}>
              <span className="min-w-0 truncate">{thread.title}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
    <Button
      size="sm"
      variant="ghost"
      className="shrink-0"
      aria-label="New chat"
      onPress={conversation.newChat}>
      <AddCircle size={18} aria-hidden="true" />
    </Button>
    {onExpand && (
      <Button
        size="sm"
        variant="ghost"
        className="ml-auto shrink-0"
        aria-label={expanded ? 'Collapse assistant' : 'Expand assistant'}
        onPress={onExpand}>
        {expanded ? (
          <Minimize size={18} aria-hidden="true" />
        ) : (
          <Maximize size={18} aria-hidden="true" />
        )}
      </Button>
    )}
  </nav>
)

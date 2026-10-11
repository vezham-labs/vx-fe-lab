import { useState } from 'react'

import { writeClipboardText } from '@vezham/docs-react/utils/clipboard'
import { BranchingPathsUp } from '@vezham/icons-react'
import { ChatMessageActions } from '@vezham/react-pro-v3'
import { Button } from '@vezham/react-v3'

import type { Conversation } from './conversation'

type Props = {
  message: Conversation['messages'][number]
  conversation: Conversation
}
export const MessageActions = ({ message, conversation }: Props) => {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  return (
    <>
      <ChatMessageActions>
        <ChatMessageActions.Copy
          aria-label="Copy response"
          tooltip="Copy"
          isCopied={copied}
          onPress={async () => {
            try {
              await writeClipboardText(message.text)
              setCopied(true)
              setError(false)
            } catch {
              setError(true)
            }
          }}
        />
        <ChatMessageActions.ThumbsUp
          aria-label="Good response"
          tooltip="Good response"
          aria-pressed={message.rating === 'up'}
          onPress={() => conversation.rate(message.id, 'up')}
        />
        <ChatMessageActions.ThumbsDown
          aria-label="Bad response"
          tooltip="Bad response"
          aria-pressed={message.rating === 'down'}
          onPress={() => conversation.rate(message.id, 'down')}
        />
        <ChatMessageActions.Regenerate
          aria-label="Regenerate response"
          tooltip="Regenerate"
          isDisabled={conversation.phase !== 'ready'}
          onPress={() => conversation.regenerate(message.id)}
        />
        <Button
          aria-label="Branch chat"
          isIconOnly
          size="sm"
          variant="ghost"
          isDisabled={conversation.phase !== 'ready'}
          onPress={() => conversation.branchChat(message.id)}>
          <BranchingPathsUp size={18} aria-hidden="true" />
        </Button>
      </ChatMessageActions>
      {error && (
        <p role="status" className="text-muted text-xs">
          Copy is unavailable in this browser.
        </p>
      )}
    </>
  )
}

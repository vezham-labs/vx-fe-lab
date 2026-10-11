import { useRef } from 'react'

import { AddCircle, Microphone } from '@vezham/icons-react'
import { ChatAttachment, PromptInput } from '@vezham/react-pro-v3'

import type { Conversation } from './conversation'
import { FastModeToggle, ModelPicker } from './model-picker'
import { PermissionPicker } from './permission-picker'

type Props = { conversation: Conversation }
export const Composer = ({ conversation: c }: Props) => {
  const fileInput = useRef<HTMLInputElement>(null)
  return (
    <PromptInput
      value={c.value}
      onValueChange={c.setValue}
      onSubmit={() => c.submit()}
      status={
        c.phase === 'ready'
          ? 'ready'
          : c.phase === 'streaming'
            ? 'streaming'
            : 'submitted'
      }
      onStop={c.stop}>
      <input
        ref={fileInput}
        type="file"
        multiple
        className="hidden"
        aria-label="Attach files"
        accept="image/*,.pdf,.txt,.md,.csv,.json"
        onChange={event => {
          c.addFiles(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
      <PromptInput.Shell>
        {c.attachments.length > 0 && (
          <PromptInput.Attachments className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
            {c.attachments.map(file => (
              <ChatAttachment
                key={file.id}
                name={file.name}
                mimeType={file.mimeType}
                size={file.size}>
                <ChatAttachment.Preview />
                <ChatAttachment.Remove
                  aria-label={`Remove ${file.name}`}
                  onPress={() => c.removeAttachment(file.id)}
                />
              </ChatAttachment>
            ))}
          </PromptInput.Attachments>
        )}
        <PromptInput.Content>
          <PromptInput.TextArea
            aria-label="Ask Tamizhi"
            placeholder="Ask Tamizhi…"
          />
        </PromptInput.Content>
        <PromptInput.Toolbar>
          <PromptInput.ToolbarStart>
            <PromptInput.Action
              aria-label="Attach files"
              tooltip="Attach files"
              onPress={() => fileInput.current?.click()}
              isDisabled={c.phase !== 'ready'}>
              <AddCircle size={18} aria-hidden="true" />
            </PromptInput.Action>
            <PromptInput.Action
              aria-label="Try voice preview"
              tooltip="Dictate · simulated"
              isDisabled={c.phase !== 'ready'}
              onPress={c.listen}>
              <Microphone size={18} aria-hidden="true" />
            </PromptInput.Action>
          </PromptInput.ToolbarStart>
          <PromptInput.ToolbarEnd>
            <ModelPicker conversation={c} />
            <PromptInput.Send
              aria-label={
                c.phase === 'ready' ? 'Send message' : 'Stop answering'
              }
              isDisabled={
                c.phase === 'ready' && !c.value.trim() && !c.attachments.length
              }
            />
          </PromptInput.ToolbarEnd>
        </PromptInput.Toolbar>
      </PromptInput.Shell>
      <div className="mt-2 flex flex-wrap gap-1">
        <FastModeToggle conversation={c} />
        <PermissionPicker conversation={c} />
      </div>
    </PromptInput>
  )
}

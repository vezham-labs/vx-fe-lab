import { AltArrowDown, VezhamTamizhi } from '@vezham/icons-react'
import {
  ChainOfThought,
  ChatAttachment,
  ChatConversation,
  ChatLoader,
  ChatMessage,
  PromptSuggestion,
  TextShimmer
} from '@vezham/react-pro-v3'
import { Button } from '@vezham/react-v3'

import { ChatHeader } from './chat-header'
import { Composer } from './composer'
import type { Conversation } from './conversation'
import { MessageActions } from './message-actions'
import { MockResult } from './mock-result'
import { useChatScroll } from './use-chat-scroll'

type Props = {
  conversation: Conversation
  compact?: boolean
  panel?: boolean
  expanded?: boolean
  onExpand?: () => void
  greeting?: string
  suggestions?: readonly string[]
}
export const AIContent = ({
  conversation: c,
  compact = false,
  panel = false,
  expanded,
  onExpand,
  greeting = 'How can Tamizhi help?',
  suggestions = [
    'Plan my day',
    'Explore my workspace',
    'Show a workspace summary',
    'Set my preferences'
  ]
}: Props) => {
  const { viewportRef, contentRef, showJump, onScroll, scrollToBottom } =
    useChatScroll(c)
  return (
    <div
      className={`flex min-h-0 flex-col gap-3 ${compact ? 'max-h-[calc(100dvh-10rem)] overflow-hidden' : panel ? 'h-full overflow-hidden' : 'h-[min(65dvh,32rem)]'}`}>
      <ChatHeader conversation={c} expanded={expanded} onExpand={onExpand} />
      <p className="text-muted shrink-0 px-1 text-xs">
        Preview · Replies, files, voice and permissions are simulated.
      </p>
      <div
        className={`relative min-h-0 flex-1 ${compact ? 'max-h-[35dvh]' : ''}`}>
        <ChatConversation
          ref={viewportRef}
          key={c.activeId}
          aria-label="Conversation with Tamizhi"
          initial="instant"
          resize="instant"
          onScroll={onScroll}
          className="h-full min-h-0">
          <ChatConversation.Content
            ref={contentRef}
            className="min-w-0 shrink-0 grow flex-col justify-end gap-4 px-1 py-2 text-sm [&>*]:shrink-0">
            {c.messages.length === 0 && (
              <div className="py-4">
                <h2 className="font-semibold">{greeting}</h2>
                <p className="text-muted mt-2">
                  Find your way around, plan your day, or explore a sample
                  result.
                </p>
              </div>
            )}
            {c.messages.length === 0 && (
              <PromptSuggestion>
                <PromptSuggestion.Items className="flex flex-col gap-2">
                  {(compact ? suggestions.slice(0, 2) : suggestions).map(
                    prompt => (
                      <PromptSuggestion.Item
                        key={prompt}
                        isDisabled={c.phase !== 'ready'}
                        onPress={() => c.submit(prompt)}
                        className="text-xs">
                        {prompt}
                      </PromptSuggestion.Item>
                    )
                  )}
                </PromptSuggestion.Items>
              </PromptSuggestion>
            )}
            {(compact ? c.messages.slice(-2) : c.messages).map(message =>
              message.role === 'user' ? (
                <ChatMessage.User key={message.id}>
                  <ChatMessage.Bubble>
                    <ChatMessage.Content className="wrap-anywhere">
                      {message.text}
                    </ChatMessage.Content>
                  </ChatMessage.Bubble>
                  {message.attachments?.map(file => (
                    <ChatAttachment
                      key={file.id}
                      name={file.name}
                      mimeType={file.mimeType}
                      size={file.size}>
                      <ChatAttachment.Preview />
                    </ChatAttachment>
                  ))}
                </ChatMessage.User>
              ) : (
                <ChatMessage.Assistant key={message.id}>
                  <ChatMessage.Body className="min-w-0">
                    <ChatMessage.Content
                      className={`wrap-anywhere ${compact ? 'line-clamp-3' : ''}`}>
                      {message.text}
                    </ChatMessage.Content>
                    {c.phase === 'ready' && (
                      <>
                        {!compact && (
                          <MockResult
                            prompt={
                              c.messages
                                .slice(0, c.messages.indexOf(message))
                                .reverse()
                                .find(item => item.role === 'user')?.text ?? ''
                            }
                          />
                        )}
                        <MessageActions message={message} conversation={c} />
                      </>
                    )}
                  </ChatMessage.Body>
                </ChatMessage.Assistant>
              )
            )}
            {c.phase !== 'ready' && (
              <div role="status">
                <div className="flex items-center gap-3 py-2">
                  <ChatLoader.Pulse aria-hidden="true" />
                  <TextShimmer>
                    {c.phase === 'listening'
                      ? 'Listening to a sample prompt…'
                      : c.phase === 'streaming'
                        ? 'Writing response…'
                        : 'Working on your request…'}
                  </TextShimmer>
                </div>
                <ChainOfThought isStreaming>
                  <ChainOfThought.Trigger>
                    Preview progress
                  </ChainOfThought.Trigger>
                  <ChainOfThought.Content>
                    <ChainOfThought.Steps>
                      <ChainOfThought.Step label="Read the prompt">
                        Using this mock conversation and attached file names.
                      </ChainOfThought.Step>
                      <ChainOfThought.Step label="Prepare a sample result">
                        Generating a simulated response with the {c.model}{' '}
                        preset.
                      </ChainOfThought.Step>
                    </ChainOfThought.Steps>
                  </ChainOfThought.Content>
                </ChainOfThought>
              </div>
            )}
          </ChatConversation.Content>
        </ChatConversation>
        {showJump && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <Button
              aria-label="Latest messages"
              isIconOnly
              size="sm"
              variant="secondary"
              className="pointer-events-auto shadow-sm"
              onPress={scrollToBottom}>
              <AltArrowDown size={18} aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
      <footer
        aria-label="Chat composer"
        className="flex shrink-0 flex-col gap-3">
        <Composer conversation={c} />
        <div className="text-muted flex flex-col items-center gap-1 text-center text-xs">
          <p>AI may make mistakes. Verify all outputs.</p>
          <a
            href="https://vezham.com/tamizhi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground inline-flex items-center gap-1">
            Powered by <VezhamTamizhi size={16} aria-hidden="true" />{' '}
            <span className="font-medium">Tamizhi</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

import type { Conversation } from './conversation'

export const useChatScroll = (conversation: Conversation) => {
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const followLatest = useRef(true)
  const previousThread = useRef(conversation.activeId)
  const previousMessage = useRef<number | undefined>(undefined)
  const [showJump, setShowJump] = useState(false)

  const scrollToBottom = useCallback(() => {
    const element = viewport.current
    if (!element) return
    followLatest.current = true
    element.scrollTop = element.scrollHeight
    setShowJump(false)
  }, [])

  const onScroll = useCallback(() => {
    const element = viewport.current
    if (!element) return
    const atBottom =
      element.scrollHeight - element.clientHeight - element.scrollTop <= 32
    followLatest.current = atBottom
    setShowJump(!atBottom)
  }, [])

  useLayoutEffect(() => {
    const last = conversation.messages.at(-1)
    if (
      previousThread.current !== conversation.activeId ||
      (last?.role === 'user' && last.id !== previousMessage.current)
    )
      followLatest.current = true
    previousThread.current = conversation.activeId
    previousMessage.current = last?.id
    if (followLatest.current) scrollToBottom()
  }, [conversation.activeId, conversation.messages, scrollToBottom])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (followLatest.current) scrollToBottom()
      else onScroll()
    })
    if (viewport.current) observer.observe(viewport.current)
    if (content.current) observer.observe(content.current)
    return () => observer.disconnect()
  }, [conversation.activeId, onScroll, scrollToBottom])

  return {
    viewportRef: viewport,
    contentRef: content,
    showJump,
    onScroll,
    scrollToBottom
  }
}

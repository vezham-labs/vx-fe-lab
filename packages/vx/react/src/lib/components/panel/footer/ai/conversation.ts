import { useCallback, useEffect, useRef, useState } from 'react'

type Attachment = {
  id: number
  name: string
  mimeType: string
  size: number
}
type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  attachments?: Attachment[]
  rating?: 'up' | 'down'
}
type Thread = { id: string; title: string; messages: Message[] }
type Phase = 'ready' | 'listening' | 'thinking' | 'streaming'

const initialMessages: Message[] = [
  { id: 0, role: 'user', text: 'What can you help me with?' },
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I’m Tamizhi. I can help you find your way around your workspace, plan your day, or turn notes into a summary. What would you like to do?'
  }
]

const replyTo = (prompt: string) => {
  if (/day|plan|schedule/i.test(prompt))
    return 'Start with your most important task, leave time for meetings, and finish with a short review. Share your priorities and we can build a simple plan together.'
  if (/workspace|find|search/i.test(prompt))
    return 'Try Search to find a page, Bookmarks for saved destinations, or Storage for your files. In this preview I can explain these controls; I haven’t opened or changed anything.'
  if (/summary|summarize|notes/i.test(prompt))
    return 'Paste your notes here and I’ll show a sample summary organized into key points, decisions, and next steps. This preview uses simulated replies.'
  return 'Let’s break that into a clear next step. You can ask me to plan your day, explore your workspace, or summarize notes. This is a sample reply for the assistant preview.'
}

export const useMockConversation = () => {
  const [threads, setThreads] = useState<Thread[]>([
    { id: 'welcome', title: 'New chat', messages: [] },
    { id: 'intro', title: 'Getting started', messages: initialMessages },
    {
      id: 'planning',
      title: 'Planning my day',
      messages: [
        { id: 10, role: 'user', text: 'Help me plan my day' },
        { id: 11, role: 'assistant', text: replyTo('Plan my day') }
      ]
    },
    {
      id: 'workspace',
      title: 'Exploring my workspace',
      messages: [
        { id: 20, role: 'user', text: 'Where can I find my files?' },
        { id: 21, role: 'assistant', text: replyTo('Explore workspace') }
      ]
    }
  ])
  const [activeId, setActiveId] = useState('welcome')
  const activeThread = threads.find(thread => thread.id === activeId)
  const messages = activeThread?.messages ?? []
  const setMessages = (update: (messages: Message[]) => Message[]) => {
    setThreads(current =>
      current.map(thread =>
        thread.id === activeId
          ? { ...thread, messages: update(thread.messages) }
          : thread
      )
    )
  }
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [model, setModel] = useState('Auto')
  const [fastMode, setFastMode] = useState(false)
  const [permissions, setPermissions] = useState('Ask for approval')
  const [phase, setPhase] = useState<Phase>('ready')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nextId = useRef(22)
  const nextThreadId = useRef(1)

  const stop = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    setPhase('ready')
  }, [])

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current)
    },
    []
  )

  const respond = (prompt: string, regenerateId?: number) => {
    const responseIndex = messages.findIndex(
      message => message.id === regenerateId
    )
    const userMessage: Message = {
      id: nextId.current++,
      role: 'user',
      text: prompt,
      attachments
    }
    setThreads(current =>
      current.map(thread =>
        thread.id === activeId
          ? {
              ...thread,
              title:
                thread.messages.length === 0
                  ? prompt.slice(0, 48)
                  : thread.title,
              messages:
                regenerateId === undefined
                  ? [...thread.messages, userMessage]
                  : thread.messages.filter(
                      message => message.id !== regenerateId
                    )
            }
          : thread
      )
    )
    setValue('')
    setAttachments([])
    setPhase('thinking')
    timer.current = setTimeout(() => {
      const id = nextId.current++
      const fullText = replyTo(prompt)
      let length = 0
      setMessages(current => {
        const updated = [...current]
        updated.splice(responseIndex < 0 ? updated.length : responseIndex, 0, {
          id,
          role: 'assistant',
          text: ''
        })
        return updated
      })
      setPhase('streaming')
      const stream = () => {
        length = Math.min(length + 28, fullText.length)
        setMessages(current =>
          current.map(message =>
            message.id === id
              ? { ...message, text: fullText.slice(0, length) }
              : message
          )
        )
        if (length < fullText.length) timer.current = setTimeout(stream, 50)
        else {
          timer.current = null
          setPhase('ready')
        }
      }
      stream()
    }, 900)
  }

  const submit = (prompt = value) => {
    if (phase !== 'ready' || (!prompt.trim() && attachments.length === 0))
      return
    respond(prompt.trim() || 'Summarize the attached files')
  }

  const listen = () => {
    if (phase !== 'ready') return
    setPhase('listening')
    timer.current = setTimeout(() => respond('Help me plan my day'), 1400)
  }

  const newChat = () => {
    stop()
    const thread: Thread = {
      id: `chat-${nextThreadId.current++}`,
      title: 'New chat',
      messages: []
    }
    setThreads(current => [thread, ...current])
    setActiveId(thread.id)
    setValue('')
    setAttachments([])
  }

  const openChat = (id: string) => {
    if (!threads.some(thread => thread.id === id)) return
    stop()
    setActiveId(id)
    setValue('')
    setAttachments([])
  }

  const branchChat = (id: number) => {
    const index = messages.findIndex(message => message.id === id)
    if (phase !== 'ready' || index < 0) return
    stop()
    const thread: Thread = {
      id: `chat-${nextThreadId.current++}`,
      title: `${activeThread?.title ?? 'Chat'} · Branch`,
      messages: messages.slice(0, index + 1).map(message => ({
        ...message,
        id: nextId.current++,
        attachments: message.attachments?.map(file => ({ ...file }))
      }))
    }
    setThreads(current => [thread, ...current])
    setActiveId(thread.id)
    setValue('')
    setAttachments([])
  }

  const regenerate = (id: number) => {
    if (phase !== 'ready') return
    const index = messages.findIndex(message => message.id === id)
    const prompt = messages
      .slice(0, index)
      .reverse()
      .find(message => message.role === 'user')?.text
    if (prompt) respond(prompt, id)
  }
  const rate = (id: number, rating: 'up' | 'down') =>
    setMessages(current =>
      current.map(message =>
        message.id === id
          ? {
              ...message,
              rating: message.rating === rating ? undefined : rating
            }
          : message
      )
    )
  const addFiles = (files: File[]) =>
    setAttachments(current => [
      ...current,
      ...files.map(file => ({
        id: nextId.current++,
        name: file.name,
        mimeType: file.type,
        size: file.size
      }))
    ])
  return {
    attachments,
    addFiles,
    removeAttachment: (id: number) =>
      setAttachments(current => current.filter(file => file.id !== id)),
    model,
    setModel,
    fastMode,
    setFastMode,
    permissions,
    setPermissions,
    regenerate,
    branchChat,
    rate,
    messages,
    value,
    setValue,
    phase,
    submit,
    listen,
    stop,
    newChat,
    openChat,
    activeId,
    title: activeThread?.title ?? 'New chat',
    threads: threads.map(thread => ({
      id: thread.id,
      title: thread.title,
      preview: thread.messages.at(-1)?.text ?? 'Start a conversation'
    }))
  }
}

export type Conversation = ReturnType<typeof useMockConversation>

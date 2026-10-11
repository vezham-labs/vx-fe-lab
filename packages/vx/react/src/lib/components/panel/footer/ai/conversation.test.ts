import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useMockConversation } from './conversation'

afterEach(() => vi.useRealTimers())

describe('Tamizhi preview conversation', () => {
  it('keeps the user prompt and cancels a pending reply when stopped', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    act(() => result.current.submit('Plan my day'))
    expect(result.current.messages.at(-1)?.text).toBe('Plan my day')
    expect(result.current.phase).toBe('thinking')
    act(() => result.current.stop())
    act(() => vi.runAllTimers())
    expect(result.current.phase).toBe('ready')
    expect(result.current.messages).toHaveLength(1)
  })

  it('simulates listening, adds a sample transcript, and answers it', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    act(() => result.current.listen())
    expect(result.current.phase).toBe('listening')
    act(() => vi.advanceTimersByTime(1400))
    expect(result.current.messages.at(-1)?.text).toBe('Help me plan my day')
    expect(result.current.phase).toBe('thinking')
    act(() => vi.advanceTimersByTime(900))
    expect(result.current.phase).toBe('streaming')
    act(() => vi.runAllTimers())
    expect(result.current.messages.at(-1)?.role).toBe('assistant')
    expect(result.current.phase).toBe('ready')
    expect(
      new Set(result.current.messages.map(message => message.id)).size
    ).toBe(2)
  })

  it('ignores empty prompts and cancels timers when unmounted', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(useMockConversation)
    act(() => result.current.submit('  '))
    expect(result.current.messages).toHaveLength(0)
    act(() => result.current.listen())
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('starts a new chat and restores an older conversation without losing messages', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    const originalId = result.current.activeId
    act(() => result.current.submit('Plan my day'))
    act(() => vi.runAllTimers())
    act(() => result.current.newChat())
    const newId = result.current.activeId
    expect(result.current.messages).toHaveLength(0)
    act(() => result.current.submit('Summarize my notes'))
    act(() => vi.runAllTimers())
    expect(result.current.title).toBe('Summarize my notes')
    act(() => result.current.openChat(originalId))
    expect(result.current.messages).toHaveLength(2)
    act(() => result.current.openChat(newId))
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].text).toBe('Summarize my notes')
  })

  it('cancels a pending reply when switching conversations', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    act(() => result.current.submit('Plan my day'))
    act(() => result.current.openChat('planning'))
    act(() => vi.runAllTimers())
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.phase).toBe('ready')
    act(() => result.current.openChat('welcome'))
    expect(result.current.messages).toHaveLength(1)
  })
  it('retains attachment metadata in the user message without uploading files', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    const file = new File(['sample notes'], 'notes.txt', { type: 'text/plain' })
    act(() => result.current.addFiles([file]))
    expect(result.current.attachments[0].name).toBe('notes.txt')
    act(() => result.current.submit())
    expect(result.current.attachments).toHaveLength(0)
    expect(result.current.messages[0].attachments?.[0].name).toBe('notes.txt')
    act(() => vi.runAllTimers())
    expect(result.current.phase).toBe('ready')
  })

  it('regenerates a reply without duplicating the user prompt and records feedback', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    act(() => result.current.submit('Plan my day'))
    act(() => vi.runAllTimers())
    const replyId = result.current.messages[1].id
    act(() => result.current.rate(replyId, 'up'))
    expect(result.current.messages[1].rating).toBe('up')
    act(() => result.current.regenerate(replyId))
    act(() => vi.runAllTimers())
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].id).not.toBe(replyId)
    const replacementId = result.current.messages[1].id
    act(() => result.current.submit('Explore my workspace'))
    act(() => vi.runAllTimers())
    const laterMessages = result.current.messages.slice(2)
    act(() => result.current.regenerate(replacementId))
    act(() => vi.runAllTimers())
    expect(result.current.messages).toHaveLength(4)
    expect(result.current.messages[1].text).toContain('important task')
    expect(result.current.messages.slice(2)).toEqual(laterMessages)
  })

  it('branches through a selected reply without changing the original thread', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    act(() => result.current.submit('Plan my day'))
    act(() => vi.runAllTimers())
    const originalId = result.current.activeId
    const branchPoint = result.current.messages[1].id
    act(() => result.current.submit('Explore my workspace'))
    act(() => vi.runAllTimers())
    const originalMessages = result.current.messages
    act(() => result.current.branchChat(branchPoint))
    expect(result.current.title).toContain('Branch')
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].id).not.toBe(branchPoint)
    act(() => result.current.submit('Continue the branch'))
    act(() => vi.runAllTimers())
    act(() => result.current.openChat(originalId))
    expect(result.current.messages).toEqual(originalMessages)
  })

  it('stops streaming with the partial response intact', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMockConversation)
    act(() => result.current.submit('Plan my day'))
    act(() => vi.advanceTimersByTime(950))
    const partial = result.current.messages[1].text
    act(() => result.current.stop())
    act(() => vi.runAllTimers())
    expect(result.current.messages[1].text).toBe(partial)
    expect(result.current.phase).toBe('ready')
  })
})

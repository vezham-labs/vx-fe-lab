import { fireEvent, render, screen } from '@testing-library/react'
import { StrictMode, useState } from 'react'

import {
  ToolbarActionsProvider,
  createToolbarActions,
  useToolbarAction,
  useToolbarActions
} from './index'

const event = {
  actionKey: 'create',
  pageKey: 'classes',
  pathname: '/academic/classes'
}

describe('toolbar action dispatcher', () => {
  it('keeps new subscriptions when an old cleanup runs again', () => {
    const actions = createToolbarActions()
    const cleanup = actions.subscribe('create', vi.fn())
    cleanup()
    const handler = vi.fn()
    actions.subscribe('create', handler)
    cleanup()
    actions.emit(event)
    expect(handler).toHaveBeenCalledExactlyOnceWith(event)
  })
  it('preserves registration priority when an older subscriber rerenders', () => {
    const older = vi.fn()
    const newer = vi.fn()
    const Older = ({ value }: { value: string }) => {
      useToolbarAction('create', () => older(value))
      return null
    }
    const Newer = () => {
      useToolbarAction('create', newer)
      const { emit } = useToolbarActions()
      return <button onClick={() => emit(event)}>Create</button>
    }
    const view = render(
      <ToolbarActionsProvider>
        <Older value="first" />
        <Newer />
      </ToolbarActionsProvider>
    )
    view.rerender(
      <ToolbarActionsProvider>
        <Older value="updated" />
        <Newer />
      </ToolbarActionsProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(newer).toHaveBeenCalledExactlyOnceWith(event)
    expect(older).not.toHaveBeenCalled()
  })

  it('updates scope and enabled state without leaking registrations in Strict Mode', () => {
    const handler = vi.fn()
    const fallback = vi.fn()
    const Fixture = ({
      pageKey,
      enabled
    }: {
      pageKey: string
      enabled: boolean
    }) => {
      const { emit } = useToolbarActions()
      useToolbarAction('create', fallback)
      useToolbarAction('create', handler, { pageKey, enabled })
      return <button onClick={() => emit(event)}>Create</button>
    }
    const renderFixture = (pageKey: string, enabled: boolean) => (
      <StrictMode>
        <ToolbarActionsProvider>
          <Fixture pageKey={pageKey} enabled={enabled} />
        </ToolbarActionsProvider>
      </StrictMode>
    )
    const view = render(renderFixture('classes', true))
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(handler).toHaveBeenCalledOnce()
    view.rerender(renderFixture('other', true))
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    view.rerender(renderFixture('classes', false))
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(handler).toHaveBeenCalledOnce()
    expect(fallback).toHaveBeenCalledTimes(2)
  })
  it('invokes one scoped handler before the fallback regardless of registration order', () => {
    const actions = createToolbarActions()
    const page = vi.fn()
    const fallback = vi.fn()
    const unsubscribe = actions.subscribe('create', page, {
      pageKey: 'classes'
    })
    actions.subscribe('create', fallback)
    actions.emit(event)
    expect(page).toHaveBeenCalledExactlyOnceWith(event)
    expect(fallback).not.toHaveBeenCalled()
    unsubscribe()
    actions.emit(event)
    expect(fallback).toHaveBeenCalledExactlyOnceWith(event)
  })

  it('filters scopes and isolates dispatcher instances', () => {
    const first = createToolbarActions()
    const second = createToolbarActions()
    const handler = vi.fn()
    first.subscribe('create', handler, {
      pageKey: 'classes',
      pathname: '/academic/classes'
    })
    expect(second.emit(event)).toBe(false)
    expect(first.emit({ ...event, pathname: '/other' })).toBe(false)
    expect(first.emit({ ...event, pageKey: 'other' })).toBe(false)
    expect(first.emit({ ...event, actionKey: 'sync' })).toBe(false)
    expect(handler).not.toHaveBeenCalled()
  })

  it('lets subscribers use current local state and cleans them up on unmount', () => {
    const fallback = vi.fn()
    const Page = () => {
      const [count, setCount] = useState(0)
      useToolbarAction('create', () => setCount(count + 1), {
        pageKey: 'classes'
      })
      return <output>{count}</output>
    }
    const Fixture = ({ show }: { show: boolean }) => {
      const { emit } = useToolbarActions()
      useToolbarAction('create', fallback)
      return (
        <>
          <button onClick={() => emit(event)}>Create</button>
          {show && <Page />}
        </>
      )
    }
    const view = render(
      <ToolbarActionsProvider>
        <Fixture show />
      </ToolbarActionsProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(screen.getByRole('status')).toHaveTextContent('2')
    expect(fallback).not.toHaveBeenCalled()
    view.rerender(
      <ToolbarActionsProvider>
        <Fixture show={false} />
      </ToolbarActionsProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(fallback).toHaveBeenCalledOnce()
  })
})

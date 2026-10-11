import { useEffect, useRef, useState } from 'react'

import { writeClipboardText } from '@vezham/docs-react/utils/clipboard'
import {
  AltArrowDown,
  ChatRound,
  ClipboardCheck,
  CodeFile,
  Copy,
  Cursor,
  FileText,
  SquareArrowUp
} from '@vezham/icons-react'
import { Button, ButtonGroup, Dropdown } from '@vezham/react-v3'

import { pageActionsVariants } from './page-actions.variants'

const styles = pageActionsVariants()

type PageAction = {
  description: string
  href: string
  icon: typeof FileText
  id: string
  title: string
}

const getPageActions = (markdownUrl: string): PageAction[] => {
  const pageUrl =
    typeof window === 'undefined'
      ? markdownUrl
      : new URL(markdownUrl, window.location.origin).href
  const prompt = `Read ${pageUrl}, I want to ask questions about this page.`

  return [
    {
      id: 'markdown',
      title: 'View as Markdown',
      description: 'View page as Markdown format',
      href: markdownUrl,
      icon: FileText
    },
    {
      id: 'cursor',
      title: 'Add to Cursor',
      description: 'Install MCP Server on Cursor',
      href: 'cursor://anysphere.cursor-deeplink/mcp/install?name=vezham-react&config=eyJjb21tYW5kIjoibnB4IC15IEBoZXJvdWkvcmVhY3QtbWNwQGxhdGVzdCJ9',
      icon: Cursor
    },
    {
      id: 'vscode',
      title: 'Add to VS Code',
      description: 'Install MCP Server on VS Code',
      href: 'vscode:mcp/install?%7B%22name%22%3A%22vezham-react%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40vezham%2Freact-mcp%40latest%22%5D%7D',
      icon: CodeFile
    },
    {
      id: 'chatgpt',
      title: 'Open in ChatGPT',
      description: 'Ask questions about this page',
      href: `https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q: prompt })}`,
      icon: ChatRound
    },
    {
      id: 'claude',
      title: 'Open in Claude',
      description: 'Ask questions about this page',
      href: `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`,
      icon: ChatRound
    }
  ]
}

export const PageActions = ({ markdownUrl }: { markdownUrl: string }) => {
  const [copiedAction, setCopiedAction] = useState<'markdown' | 'prompt'>()
  const [isLoading, setLoading] = useState<'markdown' | 'prompt'>()
  const [isOpen, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  useEffect(() => () => clearTimeout(copiedTimer.current), [])
  const actions = getPageActions(markdownUrl)
  const copy = async (action: 'markdown' | 'prompt') => {
    setLoading(action)
    setError(undefined)
    try {
      let text: string
      if (action === 'markdown') {
        const response = await fetch(markdownUrl)
        if (!response.ok) throw new Error('Unable to load Markdown')
        text = await response.text()
      } else {
        const pageUrl = new URL(markdownUrl, window.location.origin).href
        text = `Use this documentation page as context when helping me: ${pageUrl}`
      }
      await writeClipboardText(text)
      clearTimeout(copiedTimer.current)
      setCopiedAction(action)
      copiedTimer.current = setTimeout(() => setCopiedAction(undefined), 2000)
    } catch {
      setError('Unable to copy. Please try again.')
    } finally {
      setLoading(undefined)
    }
  }

  return (
    <div className={styles.root()}>
      <Button
        isDisabled={Boolean(isLoading)}
        size="md"
        variant="tertiary"
        onPress={() => copy('prompt')}>
        {copiedAction === 'prompt' ? (
          <ClipboardCheck size={16} />
        ) : (
          <ChatRound size={16} />
        )}
        {copiedAction === 'prompt' ? 'Copied' : 'Copy Prompt'}
      </Button>
      <ButtonGroup size="md" variant="tertiary">
        <Button
          isDisabled={Boolean(isLoading)}
          onPress={() => copy('markdown')}>
          {copiedAction === 'markdown' ? (
            <ClipboardCheck size={16} />
          ) : (
            <Copy size={16} />
          )}
          {copiedAction === 'markdown' ? 'Copied' : 'Copy Markdown'}
        </Button>
        <Dropdown isOpen={isOpen} onOpenChange={setOpen}>
          <Button
            aria-label="More page actions"
            isIconOnly
            size="md"
            variant="tertiary">
            <ButtonGroup.Separator />
            <AltArrowDown
              size={14}
              className={styles.chevron({ open: isOpen })}
            />
          </Button>
          <Dropdown.Popover placement="bottom end">
            <Dropdown.Menu aria-label="Page actions">
              {actions.map(action => {
                const Icon = action.icon
                const isAI = action.id === 'chatgpt' || action.id === 'claude'
                return (
                  <Dropdown.Item
                    key={action.id}
                    href={action.href}
                    id={action.id}
                    rel="noreferrer noopener"
                    target="_blank"
                    textValue={action.title}>
                    <Icon size={16} className={styles.icon()} />
                    <span className={styles.itemContent()}>
                      <span>{action.title}</span>
                      <span className={styles.description()}>
                        {action.description}
                      </span>
                    </span>
                    {isAI && (
                      <SquareArrowUp
                        size={14}
                        className={styles.externalIcon()}
                      />
                    )}
                  </Dropdown.Item>
                )
              })}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </ButtonGroup>
      {error && (
        <p role="alert" className={styles.error()}>
          {error}
        </p>
      )}
    </div>
  )
}

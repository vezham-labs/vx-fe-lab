import { type ReactNode, useState } from 'react'

import { Button, Card, Input, Label, TextField } from '@vezham/react-v3'

const ResultCard = ({
  title,
  description,
  children,
  footer
}: {
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
}) => (
  <Card className="my-3">
    <Card.Header>
      <Card.Title>{title}</Card.Title>
      {description && <Card.Description>{description}</Card.Description>}
    </Card.Header>
    {children && <Card.Content>{children}</Card.Content>}
    {footer && <Card.Footer>{footer}</Card.Footer>}
  </Card>
)

type Props = { prompt: string }
export const MockResult = ({ prompt }: Props) => {
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('My workspace')
  if (/preferences/i.test(prompt))
    return (
      <ResultCard title="Preferences preview">
        <form
          onSubmit={event => {
            event.preventDefault()
            setSaved(true)
          }}
          className="flex flex-col gap-3">
          <TextField>
            <Label>Workspace name</Label>
            <Input
              value={name}
              onChange={event => {
                setName(event.target.value)
                setSaved(false)
              }}
            />
          </TextField>
          <Button type="submit" size="sm">
            Save preview
          </Button>
          {saved && (
            <p role="status" className="text-muted text-xs">
              Saved “{name}” in this preview.
            </p>
          )}
        </form>
      </ResultCard>
    )
  if (/summary|chart|metrics/i.test(prompt))
    return (
      <ResultCard title="Workspace summary" description="Sample data">
        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted text-xs">Tasks</p>
            <p className="text-xl font-semibold">24</p>
          </div>
          <div>
            <p className="text-muted text-xs">Complete</p>
            <p className="text-xl font-semibold">75%</p>
          </div>
        </div>
        <table className="w-full text-start text-xs">
          <caption className="sr-only">Sample weekly completed tasks</caption>
          <thead>
            <tr>
              <th className="text-start">Week</th>
              <th className="text-end">Completed</th>
            </tr>
          </thead>
          <tbody>
            {[8, 12, 18].map((count, i) => (
              <tr key={count}>
                <td className="py-2">Week {i + 1}</td>
                <td className="text-end">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          role="img"
          aria-label="Sample task progress: 75 percent"
          className="bg-surface-secondary mt-2 h-2 overflow-hidden rounded-full">
          <div className="bg-accent h-full w-3/4" />
        </div>
      </ResultCard>
    )
  if (/workspace/i.test(prompt))
    return (
      <ResultCard
        title="Workspace guide"
        description="Search pages, save bookmarks, and explore Storage."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => setSaved(true)}>
              Preview next step
            </Button>
            {saved && (
              <p role="status" className="text-xs">
                Try Search from the application menu.
              </p>
            )}
          </>
        }
      />
    )
  return null
}

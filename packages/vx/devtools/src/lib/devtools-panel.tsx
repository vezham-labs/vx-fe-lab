import { Fragment } from 'react'

import { Card, Typography } from '@vezham/react-v3'

import type { DevtoolsApp } from './types'

interface Props {
  app: DevtoolsApp
  theme: 'dark' | 'light'
}

export const DevtoolsPanel = ({ app, theme }: Props) => (
  <Card className="m-4" data-theme={theme}>
    <Card.Header>
      <Card.Title>Application</Card.Title>
      <Card.Description>Runtime metadata</Card.Description>
    </Card.Header>
    <Card.Content>
      <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-3">
        {[
          ['🆔 Identity', app.id],
          ['🏷️ Name', app.name],
          ['🔖 Version', app.version],
          ['🌍 Environment', app.environment],
          ['⚙️ Runtime', app.runtime]
        ].map(([label, value]) => (
          <Fragment key={label}>
            <dt>
              <Typography color="muted" type="body-sm">
                {label}
              </Typography>
            </dt>
            <dd>
              <Typography type="code">{value}</Typography>
            </dd>
          </Fragment>
        ))}
      </dl>
    </Card.Content>
  </Card>
)

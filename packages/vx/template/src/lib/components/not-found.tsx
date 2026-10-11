'use client'

import { useSyncExternalStore } from 'react'

import { EmptyState, Typography, buttonVariants } from '@vezham/react-v3'

const getNotFoundImageSrc = (version: string) =>
  `https://static.cdn.vezham.com/vassets/no-internet.svg?vx=${encodeURIComponent(version)}`

const getPathname = () => window.location.pathname || '/'
const getServerPathname = () => ''
const subscribeToPathname = (onPathnameChange: () => void) => {
  window.addEventListener('popstate', onPathnameChange)

  return () => window.removeEventListener('popstate', onPathnameChange)
}

type Props = {
  app?: string
  version?: string
  homeUrl?: string
}

export const NotFound = ({ app = 'Vx', homeUrl = '/', version }: Props) => {
  const pathname = useSyncExternalStore(
    // vx-bot/INFO: Recheck on Back/Forward navigation via popstate.
    subscribeToPathname,
    // vx-bot/INFO: Read the browser pathname as the client snapshot.
    getPathname,
    // vx-bot/NOTE: Return '' during SSR and initial hydration to keep them consistent.
    getServerPathname
  )
  const imageSrc = version ? getNotFoundImageSrc(version) : undefined

  return (
    <main className="vx-not-found flex min-h-screen items-center justify-center p-6 text-left">
      <EmptyState className="w-full max-w-148 items-start gap-0 p-2 text-left">
        <div className="vx-not-found__content flex w-full max-w-144 flex-col items-start justify-center gap-3">
          {imageSrc ? (
            <img
              alt="Page not found"
              className="vx-not-found__image"
              src={imageSrc}
            />
          ) : null}
          <Typography.Heading
            className="vx-not-found__code text-muted"
            level={1}>
            404
          </Typography.Heading>
          <Typography.Heading className="vx-not-found__title" level={2}>
            Page not found
          </Typography.Heading>
          <Typography.Paragraph
            className="vx-not-found__description"
            color="muted">
            {app} could not find the page you requested
            <span
              className="vx-not-found__path font-semibold wrap-anywhere"
              data-vx-not-found-path>
              {pathname ? `: ${pathname}` : null}
            </span>
            .
          </Typography.Paragraph>
          <a
            className={`vx-not-found__home ${buttonVariants({ variant: 'secondary' })}`}
            href={homeUrl}>
            Back to Home
          </a>
        </div>
      </EmptyState>
    </main>
  )
}

/** @jsxRuntime automatic */
/** @jsxImportSource react */
import { renderToStaticMarkup } from 'react-dom/server'

import { VezhamLogo } from '@vezham/icons-react'

export type OgImageProps = {
  title: string
  description?: string
  site?: string
  logo?: string
  theme?: 'dark' | 'light'
}

// vx-bot/NOTE: ImageResponse renders these styles without loading the app's CSS.
export const OgImage = ({
  title,
  description,
  site = 'Vezham',
  logo,
  theme = 'light'
}: OgImageProps) => {
  const colors =
    theme === 'dark'
      ? {
          background: '#18181b',
          foreground: '#fafafa',
          muted: '#a1a1aa'
        }
      : {
          background: '#f5f5f5',
          foreground: '#18181b',
          muted: '#71717a'
        }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: colors.foreground,
        padding: 64,
        backgroundColor: colors.background
      }}>
      <p
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.1,
          margin: 0,
          lineClamp: 2
        }}>
        {title}
      </p>
      {description && (
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: 34,
            lineHeight: 1.4,
            color: colors.muted,
            margin: 0,
            marginTop: 24,
            lineClamp: 3
          }}>
          {description}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 'auto',
          paddingTop: 24,
          color: colors.foreground
        }}>
        {logo ? (
          <img
            alt=""
            width={48}
            height={48}
            src={logo}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <img
            alt="Vezham"
            width={48}
            height={48}
            src={`data:image/svg+xml;base64,${Buffer.from(
              renderToStaticMarkup(
                <VezhamLogo size={48} color={colors.foreground} />
              )
            ).toString('base64')}`}
          />
        )}
        {site && (
          <p
            style={{
              fontFamily: 'Jura',
              fontSize: 36,
              fontWeight: 600,
              margin: 0
            }}>
            {site}
          </p>
        )}
      </div>
    </div>
  )
}

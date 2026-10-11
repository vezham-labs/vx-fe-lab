import { ImageResponse } from '@vercel/og'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import type { ReactElement } from 'react'
import { parse } from 'yaml'

import { walkFiles } from '../files.ts'
import {
  type DocsConfig,
  type I18nConfig,
  resolveDocsConfig
} from './config.ts'
import { docsPathFromMdx } from './mdx-path.ts'
import type { OgImageProps } from './og-image'
import { createOgOutput } from './og-output.ts'
import { getDocsMirrorRoutes } from './routes.ts'
import { type RouteInput } from './types.ts'

type DocsOgMeta = {
  description: string
  routePath: string
  title: string
}

const uniqueByRoute = (entries: DocsOgMeta[]) => {
  const mapped = new Map<string, DocsOgMeta>()

  for (const entry of entries) {
    mapped.set(entry.routePath, entry)
  }

  return [...mapped.values()]
}

const titleFromPath = (pagePath: string) => {
  const segments = pagePath.split('/').filter(Boolean)
  const segment = segments[segments.length - 1] ?? 'Docs'

  return segment
    .split('-')
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const getMdxEntries = ({
  docsDir,
  docsRoute,
  ...i18n
}: I18nConfig & {
  docsRoute: string
  docsDir: string
}): DocsOgMeta[] => {
  return walkFiles(docsDir).flatMap(filePath => {
    const entry = docsPathFromMdx(docsDir, docsRoute, i18n, filePath)

    if (!entry || entry.locale !== i18n.defaultLanguage) {
      return []
    }

    const { routePath } = entry
    const frontmatter = fs
      .readFileSync(filePath, 'utf8')
      .match(/^---\n([\s\S]*?)\n---/)
    const meta = frontmatter
      ? (parse(frontmatter[1]) as Record<string, unknown>)
      : {}

    return [
      {
        description:
          typeof meta.description === 'string'
            ? meta.description
            : 'Documentation',
        routePath,
        title:
          typeof meta.title === 'string' ? meta.title : titleFromPath(routePath)
      }
    ]
  })
}

const getDocsOgOutputPaths = ({
  docsRoute,
  entryRoutePath,
  mirrorRoutes,
  outputDir
}: {
  docsRoute: string
  entryRoutePath: string
  mirrorRoutes: string[]
  outputDir: string
}) => {
  const suffix =
    entryRoutePath === docsRoute ? '' : entryRoutePath.slice(docsRoute.length)
  const outputRoot = path.dirname(outputDir)
  const outputPaths = [
    path.join(outputDir, `${suffix}/image.png`.replace(/^\//, ''))
  ]

  if (entryRoutePath === docsRoute) {
    outputPaths.push(path.join(outputRoot, 'image.png'))
  }

  for (const mirrorRoute of mirrorRoutes) {
    outputPaths.push(
      path.join(
        outputRoot,
        mirrorRoute,
        `${suffix}/image.png`.replace(/^\//, '')
      )
    )
  }

  return outputPaths
}

export const generateDocsOgImages = async (
  projectRoot: string,
  config: DocsConfig,
  i18n: I18nConfig,
  {
    routes = [],
    renderImage
  }: {
    routes?: RouteInput[]
    renderImage?: (props: OgImageProps) => ReactElement
  } = {}
) => {
  let render = renderImage
  if (!render) {
    const { OgImage } = await import('./og-image')
    render = OgImage
  }
  const resolved = resolveDocsConfig(config)
  const resolvedDocsDir = path.resolve(projectRoot, resolved.docsDir)
  const resolvedOutputDir = path.resolve(projectRoot, resolved.ogOutputDir)
  const mirrorRoutes = getDocsMirrorRoutes(routes).filter(
    route => route !== resolved.docsRoute
  )
  const entries = uniqueByRoute(
    getMdxEntries({
      ...i18n,
      docsDir: resolvedDocsDir,
      docsRoute: resolved.docsRoute
    })
  )
  const require = createRequire(import.meta.url)
  const juraFont = fs.readFileSync(
    require.resolve('@fontsource/jura/files/jura-latin-600-normal.woff')
  )
  const interRegular = fs.readFileSync(
    require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff')
  )
  const interBold = fs.readFileSync(
    require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff')
  )
  const logo = resolveDocsOgLogo(projectRoot, config.og?.logo)

  const output = createOgOutput(projectRoot)

  const generatedImageCounts = await Promise.all(
    entries.map(async entry => {
      const outputPaths = getDocsOgOutputPaths({
        docsRoute: resolved.docsRoute,
        entryRoutePath: entry.routePath,
        mirrorRoutes,
        outputDir: resolvedOutputDir
      })
      const response = new ImageResponse(
        render({
          ...config.og,
          description: entry.description,
          logo,
          title: entry.title
        }),
        {
          fonts: [
            { data: interRegular, name: 'Inter', weight: 400 },
            { data: interBold, name: 'Inter', weight: 700 },
            { data: juraFont, name: 'Jura', weight: 600 }
          ],
          height: 630,
          width: 1200
        }
      )
      const image = Buffer.from(await response.arrayBuffer())

      output.add(outputPaths, image)

      return outputPaths.length
    })
  )

  output.finish()

  return generatedImageCounts.reduce((total, count) => total + count, 0)
}

const resolveDocsOgLogo = (projectRoot: string, logo?: string) => {
  if (!logo || /^(data:|https?:)/.test(logo)) {
    return logo
  }

  const filePath = path.resolve(projectRoot, 'public', logo.replace(/^\//, ''))

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing docs OG logo: ${filePath}`)
  }

  const extension = path.extname(filePath).slice(1) || 'svg+xml'
  const mimeType = extension === 'svg' ? 'image/svg+xml' : `image/${extension}`

  return `data:${mimeType};base64,${fs.readFileSync(filePath).toString('base64')}`
}

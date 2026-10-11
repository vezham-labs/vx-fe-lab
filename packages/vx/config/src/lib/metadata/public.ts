import path from 'node:path'

import {
  generatedNotice,
  renderMetadataTemplate,
  stringifyManifest
} from './render.ts'
import {
  createVersionedAssetUrl,
  getProjectAssetBaseUrl,
  getStaticAssetUrl,
  lowerFirst,
  normalizeIcons,
  toAssetUrl
} from './runtime.ts'
import type { MetadataFile, VxConfig } from './types.ts'

const createManifest = (
  config: VxConfig,
  versionedAssetUrl: (asset: string) => string
) => {
  const { core, pwa } = config
  return {
    manifest_version: 1,
    version: core.version,
    id: core.id,
    name: core.name,
    short_name: core.shortName,
    description: lowerFirst(core.description),
    scope: pwa.scope,
    start_url: `${pwa.startUrl}?utm_source=homescreen&utm_medium=shortcut&pwa=true`,
    display: pwa.display,
    orientation: pwa.orientation,
    theme_color: config.branding.themeColor,
    background_color: config.branding.backgroundColor,
    categories: pwa.categories,
    icons: normalizeIcons(pwa.icons).map(icon => ({
      src: toAssetUrl(icon.src, versionedAssetUrl),
      sizes: icon.sizes,
      type: icon.type
    })),
    screenshots: pwa.screenshots.map(screenshot => ({
      src: toAssetUrl(screenshot.src, versionedAssetUrl),
      type: screenshot.type,
      sizes: screenshot.sizes
    })),
    shortcuts: pwa.shortcuts.map(shortcut => ({
      name: shortcut.name,
      short_name: shortcut.shortName,
      url: `${shortcut.url}?utm_source=jumplist&utm_medium=shortcut&pwa=true`,
      icons: normalizeIcons(shortcut.icons).map(icon => ({
        src: toAssetUrl(icon.src, versionedAssetUrl),
        sizes: icon.sizes,
        type: icon.type
      }))
    }))
  }
}

const renderBrowserConfig = (versionedAssetUrl: (asset: string) => string) => {
  return `<?xml version="1.0" encoding="utf-8" ?>
<!-- ${generatedNotice} -->
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo
        src="${versionedAssetUrl('icons/icon-square-70x70.png')}" />
      <square150x150logo
        src="${versionedAssetUrl('icons/icon-square-150x150.png')}" />
      <wide310x150logo
        src="${versionedAssetUrl('icons/icon-square-310x150.png')}" />
      <square310x310logo
        src="${versionedAssetUrl('icons/icon-square-310x310.png')}" />
      <tilecolor>transparent</tilecolor>
    </tile>
  </msapplication>
</browserconfig>
`
}

export const getPublicMetadataFiles = (
  config: VxConfig,
  projectRoot: string
): MetadataFile[] => {
  const { core } = config
  const publicDir = path.resolve(projectRoot, 'public')
  const versionedAssetUrl = createVersionedAssetUrl(
    getProjectAssetBaseUrl(projectRoot),
    core.version
  )
  const offlinePage = renderMetadataTemplate('offline.html', {
    generatedNotice,
    author: core.publisher.name,
    appName: core.name,
    imageUrl: getStaticAssetUrl('vassets/no-internet.svg', core.version)
  })
  const notFoundPage = renderMetadataTemplate('not-found.html', {
    generatedNotice,
    author: core.publisher.name,
    appName: core.name,
    imageUrl: getStaticAssetUrl('vassets/no-internet.svg', core.version)
  })

  return [
    {
      path: path.join(publicDir, 'manifest.webmanifest'),
      content: `${stringifyManifest(createManifest(config, versionedAssetUrl))}\n`
    },
    {
      path: path.join(publicDir, 'browserconfig.xml'),
      content: renderBrowserConfig(versionedAssetUrl)
    },
    {
      path: path.join(publicDir, 'robots.txt'),
      content: `# ${generatedNotice}\n# https://www.robotstxt.org/robotstxt.html\nUser-agent: *\nDisallow:\n`
    },
    {
      path: path.join(publicDir, 'sw.js'),
      content: `/* ${generatedNotice} */\n/* global importScripts */\nimportScripts('https://static.cdn.vezham.com/workers/sw.js?vx=${core.version}')\n`
    },
    {
      path: path.join(publicDir, 'offline.html'),
      content: offlinePage
    },
    {
      path: path.join(publicDir, '404.html'),
      content: notFoundPage
    }
  ]
}

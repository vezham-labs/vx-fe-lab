import { type VxConfig } from './types.ts'

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}

const getLocalHostName = (url: string) =>
  getDomain(url).replace(/\.vezham\.app$/, '.vezham.local')

export const getVxEnv = ({ core }: VxConfig) => ({
  HOST_NAME: getLocalHostName(core.url),
  V_APP_ID: core.id,
  V_APP_NAME: core.name,
  V_APP_VER: core.version
})

export const syncEnvContent = (
  content: string,
  values: Record<string, string>
): string => {
  const lines = content ? content.replace(/\n$/, '').split('\n') : []
  const synced = new Set<string>()
  const envLinePattern = /^([A-Z][A-Z0-9_]*)=/
  const nextLines = lines.map(line => {
    const key = line.match(envLinePattern)?.[1]

    if (!key || !(key in values)) {
      return line
    }

    synced.add(key)

    return `${key}=${values[key]}`
  })
  const missingLines = Object.entries(values)
    .filter(([key]) => !synced.has(key))
    .map(([key, value]) => `${key}=${value}`)

  if (missingLines.length > 0) {
    const prePortIndex = nextLines.findIndex(line =>
      line.startsWith('PRE_PORT=')
    )
    const portIndex = nextLines.findIndex(line => line.startsWith('PORT='))
    const insertIndex =
      prePortIndex >= 0 ? prePortIndex + 1 : portIndex >= 0 ? portIndex + 1 : 0

    nextLines.splice(insertIndex, 0, ...missingLines)
  }

  return `${nextLines.join('\n')}\n`
}

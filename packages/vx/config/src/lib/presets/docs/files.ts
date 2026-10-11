import fs from 'node:fs'
import path from 'node:path'

export const generatedDirectories = (dir: string): string[] => {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (!entry.isDirectory()) {
      return []
    }

    const entryPath = path.join(dir, entry.name)

    return entry.name === '(generated)'
      ? [entryPath]
      : generatedDirectories(entryPath)
  })
}

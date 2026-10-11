import fs from 'node:fs'
import path from 'node:path'

export const unique = <T>(values: T[]) => {
  return [...new Set(values)]
}

export const slash = (value: string) => {
  return value.split(path.sep).join('/')
}

export const walkFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(dir, entry.name)

    return entry.isDirectory() ? walkFiles(entryPath) : [entryPath]
  })
}

export const withoutExtension = (filePath: string) => {
  return filePath.slice(0, -path.extname(filePath).length)
}

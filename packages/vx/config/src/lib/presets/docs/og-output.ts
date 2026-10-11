import fs from 'node:fs'
import path from 'node:path'

export const createOgOutput = (projectRoot: string) => {
  const root = path.resolve(projectRoot, 'public/og')
  const manifest = path.join(root, '.vx-generated.json')
  const previous: unknown = fs.existsSync(manifest)
    ? JSON.parse(fs.readFileSync(manifest, 'utf8'))
    : []

  const resolveFile = (file: string) => {
    const resolved = path.resolve(root, file)
    const relative = path.relative(root, resolved)
    if (
      !relative ||
      relative === '..' ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative) ||
      path.extname(resolved) !== '.png'
    ) {
      throw new Error(`Invalid generated OG image path: ${file}`)
    }
    return resolved
  }

  if (
    !Array.isArray(previous) ||
    !previous.every(file => typeof file === 'string')
  ) {
    throw new Error(`Invalid OG output manifest: ${manifest}`)
  }
  const previousFiles = previous.map(resolveFile)
  const generated = new Map<string, Buffer>()

  return {
    add(files: string[], image: Buffer) {
      const resolvedFiles = files.map(resolveFile)
      for (const file of resolvedFiles) {
        generated.set(file, image)
      }
    },
    finish() {
      for (const [file, image] of generated) {
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, image)
      }
      // vx-bot/NOTE: Remove only previously generated images after rendering succeeds.
      for (const file of previousFiles) {
        if (!generated.has(file)) fs.rmSync(file, { force: true })
      }
      fs.mkdirSync(root, { recursive: true })
      fs.writeFileSync(
        manifest,
        `${JSON.stringify([...generated.keys()].map(file => path.relative(root, file).split(path.sep).join('/')).sort(), null, 2)}\n`
      )
    }
  }
}

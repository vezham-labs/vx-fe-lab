import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { createOgOutput } from './og-output.ts'

const roots: string[] = []
const createRoot = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'vx-og-output-'))
  roots.push(root)
  return root
}
const image = Buffer.from('generated image')

afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true })
})

describe('OG output ownership', () => {
  it('removes stale docs, mirror, and root images while retaining authored files', () => {
    const root = createRoot()
    const outputRoot = path.join(root, 'public/og')
    const first = createOgOutput(root)
    first.add(
      ['docs/old/image.png', 'mirror/old/image.png', 'image.png'],
      image
    )
    first.finish()
    writeFileSync(path.join(outputRoot, 'custom.png'), 'authored')

    const second = createOgOutput(root)
    second.add([path.join(outputRoot, 'guide/new/image.png')], image)
    second.finish()

    for (const file of [
      'docs/old/image.png',
      'mirror/old/image.png',
      'image.png'
    ]) {
      expect(existsSync(path.join(outputRoot, file))).toBe(false)
    }
    expect(readFileSync(path.join(outputRoot, 'custom.png'), 'utf8')).toBe(
      'authored'
    )
    expect(readFileSync(path.join(outputRoot, 'guide/new/image.png'))).toEqual(
      image
    )
  })

  it('preserves prior outputs if a generation run does not finish', () => {
    const root = createRoot()
    const first = createOgOutput(root)
    first.add(['docs/old/image.png'], image)
    first.finish()
    const second = createOgOutput(root)
    second.add(['docs/new/image.png'], image)
    expect(existsSync(path.join(root, 'public/og/docs/new/image.png'))).toBe(
      false
    )
    expect(existsSync(path.join(root, 'public/og/docs/old/image.png'))).toBe(
      true
    )
  })

  it('cleans owned outputs when the collection becomes empty', () => {
    const root = createRoot()
    const first = createOgOutput(root)
    first.add(['docs/image.png'], image)
    first.finish()
    createOgOutput(root).finish()
    expect(existsSync(path.join(root, 'public/og/docs/image.png'))).toBe(false)
  })

  it('rejects output and manifest paths outside the owned directory', () => {
    const root = createRoot()
    expect(() => createOgOutput(root).add(['../keep.png'], image)).toThrow(
      'Invalid generated OG image path'
    )
    mkdirSync(path.join(root, 'public/og'), { recursive: true })
    writeFileSync(
      path.join(root, 'public/og/.vx-generated.json'),
      JSON.stringify(['../keep.png'])
    )
    expect(() => createOgOutput(root)).toThrow(
      'Invalid generated OG image path'
    )
  })
})

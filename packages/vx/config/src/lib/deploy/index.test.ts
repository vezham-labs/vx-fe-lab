import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { stringify } from 'yaml'

import { generateDeployConfig } from './index'

const workspaces: string[] = []

const createProject = (deployConfig: object) => {
  const workspaceRoot = mkdtempSync(path.join(tmpdir(), 'vx-deploy-'))
  const projectRoot = path.join(workspaceRoot, 'apps', 'example')

  workspaces.push(workspaceRoot)
  mkdirSync(projectRoot, { recursive: true })
  writeFileSync(path.join(workspaceRoot, 'nx.json'), '{}')
  writeFileSync(
    path.join(projectRoot, 'vx.app.yaml'),
    stringify({ core: { id: 'example' } })
  )
  writeFileSync(
    path.join(projectRoot, 'vx.deploy.yaml'),
    stringify(deployConfig)
  )

  return { projectRoot, workspaceRoot }
}

afterEach(() => {
  for (const workspace of workspaces.splice(0)) {
    rmSync(workspace, { force: true, recursive: true })
  }
})

describe('generateDeployConfig', () => {
  it('generates an SPA Firebase Hosting configuration', () => {
    const { projectRoot, workspaceRoot } = createProject({
      preset: 'spa',
      providers: ['firebase']
    })

    const files = generateDeployConfig({ projectRoot })
    const output = path.join(
      workspaceRoot,
      'vx/deploy/firebase/apps/example.json'
    )

    expect(files).toEqual([output])
    expect(JSON.parse(readFileSync(output, 'utf8'))).toMatchObject({
      hosting: {
        public: 'apps/example/dist',
        rewrites: [{ source: '**', destination: '/index.html' }]
      }
    })
  })

  it('generates a Vercel configuration from the runtime preset', () => {
    const { projectRoot, workspaceRoot } = createProject({
      preset: 'tanstack-start',
      providers: ['vercel']
    })

    const files = generateDeployConfig({ projectRoot })
    const output = path.join(
      workspaceRoot,
      'vx/deploy/vercel/apps/example.json'
    )

    expect(files).toEqual([output])
    expect(JSON.parse(readFileSync(output, 'utf8'))).toEqual({
      $schema: 'https://openapi.vercel.sh/vercel.json',
      framework: 'tanstack-start'
    })
  })

  it('generates provider configuration for one static preset', () => {
    const { projectRoot, workspaceRoot } = createProject({
      preset: 'spa',
      providers: ['firebase', 'vercel']
    })

    const files = generateDeployConfig({ projectRoot })
    const vercelOutput = path.join(
      workspaceRoot,
      'vx/deploy/vercel/apps/example.json'
    )

    expect(files).toHaveLength(2)
    expect(JSON.parse(readFileSync(vercelOutput, 'utf8'))).toMatchObject({
      framework: 'vite',
      outputDirectory: 'dist',
      rewrites: [{ source: '/(.*)', destination: '/index.html' }]
    })
  })
})

import path from 'node:path'

import { resolveProjectPath } from './paths.ts'
import { cdnRewrites } from './presets.ts'
import type {
  DeployFile,
  DeployPreset,
  VercelConfig,
  VercelDeployPreset,
  VxDeployConfig
} from './types.ts'

const vercelDeployPresets: Record<DeployPreset, VercelDeployPreset> = {
  cdn: {
    framework: 'vite',
    outputDirectory: 'dist',
    rewrites: cdnRewrites
  },
  spa: {
    framework: 'vite',
    outputDirectory: 'dist',
    rewrites: [{ source: '/(.*)', destination: '/index.html' }]
  },
  'start-spa': {
    framework: null,
    outputDirectory: '.output/public',
    rewrites: [{ source: '/(.*)', destination: '/_shell.html' }]
  },
  next: { framework: 'nextjs' },
  'tanstack-start': { framework: 'tanstack-start' }
}

export const getVercelDeployFile = (
  workspaceRoot: string,
  projectRoot: string,
  deployConfig: VxDeployConfig
): DeployFile => {
  const projectPath = resolveProjectPath(workspaceRoot, projectRoot)
  const vercel = deployConfig.vercel ?? {}
  const preset = deployConfig.preset
    ? vercelDeployPresets[deployConfig.preset]
    : vercelDeployPresets['start-spa']

  const config: VercelConfig = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: preset.framework,
    ...(preset.outputDirectory
      ? { outputDirectory: preset.outputDirectory }
      : {}),
    ...(preset.rewrites ? { rewrites: preset.rewrites } : {}),
    ...(vercel.buildCommand ? { buildCommand: vercel.buildCommand } : {})
  }

  return {
    path: path.join(workspaceRoot, 'vx/deploy/vercel', `${projectPath}.json`),
    content: `${JSON.stringify(config, null, 2)}\n`
  }
}

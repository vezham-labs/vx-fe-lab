import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { readYamlConfig } from '../yaml-config.ts'
import { getFirebaseDeployFile } from './firebase.ts'
import type {
  DeployFile,
  GenerateDeployConfigOptions,
  VxAppConfig,
  VxDeployConfig
} from './types.ts'
import { getVercelDeployFile } from './vercel.ts'

export type { GenerateDeployConfigOptions } from './types.ts'

const writeDeployFile = ({ path: file, content }: DeployFile) => {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, content)
}

const findWorkspaceRoot = (projectRoot: string) => {
  let currentDir = path.resolve(projectRoot)

  while (true) {
    if (existsSync(path.join(currentDir, 'nx.json'))) {
      return currentDir
    }

    const parentDir = path.dirname(currentDir)

    if (parentDir === currentDir) {
      return process.cwd()
    }

    currentDir = parentDir
  }
}

const loadYamlConfig = <T>(projectRoot: string, fileName: string) => {
  const configFile = path.resolve(projectRoot, fileName)

  return existsSync(configFile) ? readYamlConfig<T>(configFile) : undefined
}

const getDeployFiles = (
  appConfig: VxAppConfig,
  deployConfig: VxDeployConfig,
  projectRoot: string
): DeployFile[] => {
  const workspaceRoot = findWorkspaceRoot(projectRoot)

  return deployConfig.providers.map(provider => {
    if (provider === 'firebase') {
      return getFirebaseDeployFile(
        workspaceRoot,
        projectRoot,
        appConfig,
        deployConfig
      )
    }

    if (provider === 'vercel') {
      return getVercelDeployFile(workspaceRoot, projectRoot, deployConfig)
    }

    throw new Error(`Unsupported deploy provider "${provider}"`)
  })
}

export const generateDeployConfig = (
  options: GenerateDeployConfigOptions = {}
) => {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd())
  const appConfig = loadYamlConfig<VxAppConfig>(projectRoot, 'vx.app.yaml')
  const deployConfig = loadYamlConfig<VxDeployConfig>(
    projectRoot,
    'vx.deploy.yaml'
  )

  if (!appConfig || !deployConfig) {
    return []
  }

  const files = getDeployFiles(appConfig, deployConfig, projectRoot)

  for (const file of files) {
    writeDeployFile(file)
  }

  return files.map(file => file.path)
}

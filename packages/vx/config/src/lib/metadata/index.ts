import {
  existsSync,
  mkdirSync,
  readFileSync,
  watch,
  writeFileSync
} from 'node:fs'
import path from 'node:path'

import { validateFramework } from '../framework.ts'
import { getNavigationFiles } from '../navigation/index.ts'
import { readYamlConfig } from '../yaml-config.ts'
import { getVxEnv, syncEnvContent } from './env.ts'
import { syncIndexHtmlContent } from './html.ts'
import { getPublicMetadataFiles } from './public.ts'
import { getGeneratedMetadataModule } from './render.ts'
import {
  type GenerateMetadataOptions,
  type MetadataFile,
  type VxConfig
} from './types.ts'

const writeMetadataFile = ({ path: file, content }: MetadataFile) => {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, content)
}

export const loadVxAppConfig = (projectRoot = process.cwd()) => {
  const configFile = path.resolve(projectRoot, 'vx.app.yaml')

  if (!existsSync(configFile)) {
    throw new Error(`Missing vx.app.yaml at ${configFile}`)
  }

  const config = readYamlConfig<VxConfig>(configFile)
  validateFramework(config.framework)
  return config
}

export const getMetadataFiles = (
  config: VxConfig,
  projectRoot = process.cwd()
): MetadataFile[] => {
  const indexFile = path.resolve(projectRoot, 'index.html')
  const envFile = path.resolve(projectRoot, '.env')

  return [
    ...getNavigationFiles(projectRoot),
    ...getPublicMetadataFiles(config, projectRoot),
    ...(existsSync(indexFile)
      ? [
          {
            path: indexFile,
            content: syncIndexHtmlContent(
              readFileSync(indexFile, 'utf8'),
              config,
              projectRoot
            )
          }
        ]
      : []),
    {
      path: path.join(projectRoot, 'src/generated/vx.ts'),
      content: getGeneratedMetadataModule(config, projectRoot)
    },
    {
      path: envFile,
      content: syncEnvContent(
        existsSync(envFile) ? readFileSync(envFile, 'utf8') : '',
        getVxEnv(config)
      )
    }
  ]
}

export const generateMetadata = (options: GenerateMetadataOptions = {}) => {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd())
  const files = getMetadataFiles(loadVxAppConfig(projectRoot), projectRoot)

  for (const file of files) {
    writeMetadataFile(file)
  }

  return files.map(file => file.path)
}

export const watchMetadata = (options: GenerateMetadataOptions = {}) => {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd())
  const configFile = path.join(projectRoot, 'vx.app.yaml')
  const regenerate = () => {
    const files = generateMetadata(options)

    console.log(`Generated ${files.length} metadata files from ${configFile}`)
  }

  regenerate()

  return watch(projectRoot, { persistent: true }, (_event, filename) => {
    if (filename === 'vx.app.yaml' || filename === 'vx.nav.yaml') regenerate()
  })
}

// vx-bot/NOTE: Preserve the public options type at the metadata entry point.
export type { GenerateMetadataOptions } from './types.ts'

import fs from 'node:fs'
import path from 'node:path'

import * as OpenAPI from '@vezham/docs-openapi'
import { createOpenAPI } from '@vezham/docs-openapi/server'

import { slash, walkFiles, withoutExtension } from '../files.ts'
import {
  type DocsConfig,
  type I18nConfig,
  resolveDocsConfig
} from './config.ts'
import { generatedDirectories } from './files.ts'

type OpenAPISpec = {
  documentId: string
  inputPath: string
  outputDir: string
}

const openapiExtensions = new Set(['.json', '.yaml', '.yml'])

const openAPISpecIdFromRelativePath = (relativePath: string) => {
  const relativeWithoutExtension = withoutExtension(slash(relativePath))
  const segments = relativeWithoutExtension.split('/')

  if (segments[segments.length - 1] === 'index') {
    segments.pop()
  }

  return segments.length === 0 ? 'openapi' : segments.join('/')
}

const assertGeneratedOutput = (docsDir: string, outputDir: string) => {
  const relativePath = path.relative(docsDir, outputDir)

  if (
    relativePath === '' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.basename(outputDir) !== '(generated)' ||
    !relativePath.startsWith(`openapi${path.sep}`)
  ) {
    throw new Error(
      `Refusing to clear unexpected generated docs dir: ${outputDir}`
    )
  }
}

const discoverOpenAPISpecs = (
  projectRoot: string,
  docsDir: string,
  openapiDirName: string
): OpenAPISpec[] => {
  const specs: OpenAPISpec[] = []
  const openapiDir = path.join(projectRoot, openapiDirName)
  const folderSpecs = walkFiles(openapiDir)
    .filter(filePath => openapiExtensions.has(path.extname(filePath)))
    .sort((left, right) => left.localeCompare(right))

  for (const inputPath of folderSpecs) {
    const relativePath = path.relative(openapiDir, inputPath)
    const documentId = openAPISpecIdFromRelativePath(relativePath)
    const outputSegments = documentId === 'openapi' ? [] : documentId.split('/')

    specs.push({
      documentId,
      inputPath,
      outputDir: path.join(docsDir, 'openapi', ...outputSegments, '(generated)')
    })
  }

  const documentIds = new Set<string>()

  for (const spec of specs) {
    if (documentIds.has(spec.documentId)) {
      throw new Error(`Duplicate OpenAPI document id: ${spec.documentId}`)
    }

    documentIds.add(spec.documentId)
  }

  return specs
}

const pageNameFromMdx = (fileName: string, languages: string[]) => {
  const withoutMdx = fileName.slice(0, -'.mdx'.length)

  for (const language of languages) {
    const suffix = `.${language}`

    if (withoutMdx.endsWith(suffix)) {
      return withoutMdx.slice(0, -suffix.length)
    }
  }

  return withoutMdx
}

const pagesInDirectory = (dir: string, languages: string[]) => {
  const files = new Set<string>()
  const directories: string[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.add(pageNameFromMdx(entry.name, languages))
    }

    if (entry.isDirectory()) {
      directories.push(
        entry.name === '(generated)' ? `...${entry.name}` : entry.name
      )
    }
  }

  return [
    ...[...files].sort((left, right) => {
      if (left === 'index') return -1
      if (right === 'index') return 1

      return left.localeCompare(right)
    }),
    ...directories.sort((left, right) => left.localeCompare(right))
  ]
}

const synchronizeMetaFiles = (
  docsDir: string,
  outputDirectories: string[],
  languages: string[]
) => {
  const metaFiles = new Set(
    walkFiles(docsDir).filter(
      filePath => path.basename(filePath) === 'meta.json'
    )
  )

  for (const outputDirectory of outputDirectories) {
    metaFiles.add(path.join(path.dirname(outputDirectory), 'meta.json'))
  }

  for (const metaFile of [...metaFiles].sort()) {
    const metaDirectory = path.dirname(metaFile)
    const pages = pagesInDirectory(metaDirectory, languages)

    if (pages.length === 0) {
      continue
    }

    const existingContent = fs.existsSync(metaFile)
      ? fs.readFileSync(metaFile, 'utf8')
      : undefined
    const existing = existingContent
      ? (JSON.parse(existingContent) as Record<string, unknown>)
      : {}
    const content = `${JSON.stringify({ ...existing, pages }, null, 2)}\n`

    if (existingContent !== content) {
      fs.writeFileSync(metaFile, content)
    }
  }
}

export const generateDocs = async (
  projectRoot: string,
  config: DocsConfig,
  i18n: I18nConfig
) => {
  const resolved = resolveDocsConfig(config)
  const docsDir = path.resolve(projectRoot, resolved.docsDir)
  const specs = discoverOpenAPISpecs(projectRoot, docsDir, resolved.openapiDir)
  const generatedRoot = path.join(docsDir, 'openapi')

  fs.mkdirSync(docsDir, { recursive: true })

  for (const outputDir of generatedDirectories(generatedRoot)) {
    assertGeneratedOutput(docsDir, outputDir)
    fs.rmSync(outputDir, { force: true, recursive: true })
  }

  await Promise.all(
    specs.map(async spec => {
      assertGeneratedOutput(docsDir, spec.outputDir)

      await OpenAPI.generateFiles({
        input: createOpenAPI({
          input: {
            [spec.documentId]: spec.inputPath
          }
        }),
        groupBy: 'tag',
        meta: true,
        output: spec.outputDir
      })
    })
  )

  synchronizeMetaFiles(
    docsDir,
    specs.map(spec => spec.outputDir),
    i18n.languages
  )

  return specs.length
}

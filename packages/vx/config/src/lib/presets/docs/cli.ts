import {
  generateDocs,
  generateDocsOgImages,
  loadVxDocsConfig
} from './index.ts'

const [, , command = 'generate', projectRoot = process.cwd()] = process.argv
const { docs, i18n, routes } = loadVxDocsConfig(projectRoot)

if (command === 'generate' || command === 'content') {
  const count = await generateDocs(projectRoot, docs, i18n)

  console.log(`Generated documentation for ${count} OpenAPI specifications`)
} else if (command === 'og') {
  const count = await generateDocsOgImages(projectRoot, docs, i18n, { routes })

  console.log(`Generated ${count} OG images for ${projectRoot}`)
} else {
  console.error(
    `Unknown docs command "${command}". Use "generate", "content", or "og".`
  )
  process.exitCode = 1
}

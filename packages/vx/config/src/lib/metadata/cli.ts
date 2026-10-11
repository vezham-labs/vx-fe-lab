import { generateMetadata, watchMetadata } from './index.ts'

const [, , command = 'generate', projectRoot = process.cwd()] = process.argv

if (command === 'generate') {
  const files = generateMetadata({ projectRoot })

  console.log(`Generated ${files.length} metadata files for ${projectRoot}`)
} else if (command === 'watch') {
  watchMetadata({ projectRoot })
} else {
  console.error(
    `Unknown public command "${command}". Use "generate" or "watch".`
  )
  process.exitCode = 1
}

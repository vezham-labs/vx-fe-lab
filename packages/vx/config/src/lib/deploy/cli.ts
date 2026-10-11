import { generateDeployConfig } from './index'

const [, , command = 'generate', projectRoot = process.cwd()] = process.argv

if (command === 'generate') {
  const files = generateDeployConfig({ projectRoot })

  console.log(`Generated ${files.length} deploy files for ${projectRoot}`)
} else {
  console.error(`Unknown deploy command "${command}". Use "generate".`)
  process.exitCode = 1
}

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import type { ConfigEnv, UserConfig, UserConfigExport } from 'vite'

const findWorkspaceRoot = (startDir = process.cwd()) => {
  let currentDir = path.resolve(startDir)

  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir
    }

    currentDir = path.dirname(currentDir)
  }

  return path.resolve(startDir)
}

export const getProjectPackageName = (projectRoot = process.cwd()) => {
  const packageJsonFile = path.resolve(projectRoot, 'package.json')

  if (!existsSync(packageJsonFile)) {
    return path.basename(projectRoot)
  }

  try {
    return JSON.parse(readFileSync(packageJsonFile, 'utf8')).name as string
  } catch {
    return path.basename(projectRoot)
  }
}

export const getViteCacheDir = (projectRoot = process.cwd()) =>
  path.resolve(
    findWorkspaceRoot(projectRoot),
    'node_modules/.vite',
    getProjectPackageName(projectRoot)
  )

export type ViteConfig = UserConfig & {
  test?: Record<string, unknown>
}

export type ViteConfigFactory = (
  env: ConfigEnv
) => ViteConfig | Promise<ViteConfig>

export type ViteConfigOverrides = ViteConfig | ViteConfigFactory

export const getViteConfig = (projectRoot = process.cwd()): ViteConfig => ({
  root: projectRoot,
  cacheDir: getViteCacheDir(projectRoot),
  test: {}
})

export const createViteConfig = (
  getDefaults: (projectRoot: string, env: ConfigEnv) => ViteConfig,
  overrides: ViteConfigOverrides = {}
): UserConfigExport =>
  defineViteConfig(async env => {
    const resolvedOverrides =
      typeof overrides === 'function' ? await overrides(env) : overrides
    const projectRoot = path.resolve(
      String(resolvedOverrides.root ?? process.cwd())
    )

    return mergeConfig(
      getDefaults(projectRoot, env),
      resolvedOverrides
    ) as ViteConfig
  })

export const defineConfig = (overrides: ViteConfigOverrides = {}) =>
  createViteConfig(getViteConfig, overrides)

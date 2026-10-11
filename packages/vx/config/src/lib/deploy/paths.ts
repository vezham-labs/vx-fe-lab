import path from 'node:path'

export const normalizePath = (value: string) => value.split(path.sep).join('/')

export const resolveProjectPath = (
  workspaceRoot: string,
  projectRoot: string
) => normalizePath(path.relative(workspaceRoot, projectRoot))

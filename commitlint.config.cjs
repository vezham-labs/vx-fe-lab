const { createProjectGraphAsync } = require('@nx/devkit')

const maxScopes = 3
const scopeDelimiter = ','
const standaloneScopes = new Set(['repo', 'workspace'])

const types = [
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'docs',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
  'deps',
  'release',
  'i18n',
  'mocks',
  'stories'
]

module.exports = async () => {
  const graph = await createProjectGraphAsync()

  // wjdlz/NOTE: Normalize scoped Nx project names
  // eg: feat(@vx/start): ... -> feat(start): ...
  const scopes = [
    'workspace',
    'repo',
    'vx',
    'agents',
    'apps',
    'e2e',
    ...Array.from(
      new Set(
        Object.keys(graph.nodes).map(name => name.replace(/^@[^/]+\//, ''))
      )
    ).sort()
  ]

  const validateScopes = parsed => {
    if (!parsed.scope) return [true]

    const commitScopes = parsed.scope.split(scopeDelimiter)
    const invalidScopes = commitScopes.filter(scope => !scopes.includes(scope))

    if (invalidScopes.length > 0) {
      return [
        false,
        `scope must only use configured values: ${invalidScopes.join(', ')}`
      ]
    }

    if (commitScopes.length > maxScopes) {
      return [false, `scope must contain at most ${maxScopes} values`]
    }

    if (new Set(commitScopes).size !== commitScopes.length) {
      return [false, 'scope values must be unique']
    }

    if (
      commitScopes.length > 1 &&
      commitScopes.some(scope => standaloneScopes.has(scope))
    ) {
      return [false, 'repo and workspace scopes must be used alone']
    }

    const sortedScopes = [...commitScopes].sort()

    if (commitScopes.some((scope, index) => scope !== sortedScopes[index])) {
      return [false, 'scope values must be sorted alphabetically']
    }

    return [true]
  }

  return {
    extends: ['@commitlint/config-conventional'],
    plugins: ['commitlint-plugin-function-rules'],
    helpUrl:
      'https://storybook.vezham.com/?path=/docs/guidelines-contribution--overview#commit-convention',
    rules: {
      'type-enum': [2, 'always', types],
      'scope-enum': [0],
      'function-rules/scope-enum': [2, 'always', validateScopes],
      'scope-case': [
        2,
        'always',
        { cases: ['lower-case'], delimiters: [scopeDelimiter] }
      ],
      'scope-delimiter-style': [2, 'always', [scopeDelimiter]],
      'scope-empty': [2, 'never'],
      'header-max-length': [2, 'always', 120],
      'subject-case': [2, 'never', []],
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [2, 'always'],
      'body-max-length': [2, 'always', 2500],
      'body-max-line-length': [2, 'always', 2500],
      'footer-max-line-length': [2, 'always', 250]
    }
  }
}

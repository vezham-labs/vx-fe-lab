# Release Versioning

This handbook documents how Vx app and package versions are managed.

## Version Shape

Use SemVer with a yearly major release line:

```text
27.0.0-alpha.1
27.0.0-beta.1
27.0.0
27.1.0
27.1.1
28.0.0-alpha.1
```

- Major: yearly/platform generation.
- Minor: feature release train inside that generation.
- Patch: fixes, chores, refactors, docs, tests, and maintenance releases.
- Prerelease: alpha, beta, or rc artifact trains.

## Runtime Flags

Keep artifact version and runtime behavior separate.

```env
V_APP_VER=27.0.0-alpha.1
V_APP_ENV=production
V_RELEASE_CHANNEL=stable
```

- `V_APP_VER` identifies the artifact.
- `V_APP_ENV` identifies deployment: `local`, `dev`, `qa`, `preview`, or `production`.
- `V_RELEASE_CHANNEL` selects the independent runtime channel: `canary`, `beta`, or `stable`.

`V_APP_ID`, `V_APP_NAME`, and `V_APP_VER` are required by `@vx/env`.
Metadata generation supplies identity and version from `vx.app.yaml`.
`V_APP_ENV` defaults to `local` when absent or empty, independently of build mode.
Reference app configs omit it; deployments must explicitly set and validate their
target environment.

Do not infer the release channel from the version string. A beta rollout can run
a stable artifact, and a production deployment can temporarily run a prerelease
artifact. Use `RELEASE_CHANNEL === 'beta'` for beta-channel behavior.
`V_RELEASE_CHANNEL` is the only release-channel input; when absent or empty,
it defaults to `stable`.

## App Version Sync

Main apps keep these files in sync:

```text
<apps-category>/<app>/package.json
<apps-category>/<app>/vx.app.yaml
<apps-category>/<app>/.env
```

`<apps-category>` can be any app category generated or managed by
`@vx-cli/react`, such as `apps_internals`, `apps_cdns`, `apps`, or another
workspace app grouping.

The source release step is `nx release`. The workspace config uses a custom
version action:

```json
"versionActions": "./vx/tools/release/version-actions.cjs"
```

That action extends Nx's JavaScript release behavior:

- Nx updates `package.json`.
- Vx additionally updates `vx.app.yaml` at `core.version` when the project
  has a Vx config file.
- `metadata:generate` then syncs `.env` keys such as `V_APP_VER` from
  `vx.app.yaml`.

## Release Commands

Use explicit major bumps for yearly generation changes:

```sh
pnpm nx release version major
```

Use conventional commits for normal minor/patch releases:

```sh
pnpm nx release version
```

Use prerelease commands for alpha or beta trains:

```sh
pnpm nx release version prerelease --preid alpha
pnpm nx release version prerelease --preid beta
```

Preview changes before writing files:

```sh
pnpm nx release version prerelease --preid alpha --dry-run
```

## Conventional Commits

Use `<type>(<scope>): <subject>` for every commit header. Scope rules:

- Use the normalized Nx project name for a project-specific change, such as
  `start` for `@vx/start`.
- For changes affecting two or three projects, use distinct comma-separated
  scopes without spaces and sort them alphabetically, such as
  `fix(env,start): use generated app version`.
- Use no more than three scopes. Use `repo` or `workspace` alone for broader
  changes; never combine either one with another scope.

The release config maps commit types like this:

- `feat`: minor
- `fix`: patch
- `build`: none
- `release`: none
- all other allowed commitlint types: patch

Current patch-default types:

- `chore`
- `ci`
- `deps`
- `docs`
- `i18n`
- `mocks`
- `perf`
- `refactor`
- `revert`
- `stories`
- `style`
- `test`

Yearly major bumps should be intentional release commands, not ordinary commit
types.

## Support Apps

Mock and e2e apps use stable workspace ids:

```env
V_APP_ID=play-start-mock
V_APP_ID=play-start-e2e
```

They do not need `V_APP_NAME`; the id is enough for logs, health responses, and
test tooling.

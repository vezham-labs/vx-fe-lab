# @vx/env

Shared environment configuration for Vite and Next applications.

```env
V_APP_ENV=production
V_RELEASE_CHANNEL=beta
V_APP_ID=vezham-example
V_APP_NAME=Vezham Example
V_APP_VER=27.0.0
```

```ts
import { APP_ENV, RELEASE_CHANNEL } from '@vx/env/vite'

// Use @vx/env/next in Next applications.
```

`V_APP_ENV` accepts `local`, `dev`, `qa`, `preview`, or `production` and defaults
to `local` when absent or empty.
`V_APP_ID`, `V_APP_NAME`, and `V_APP_VER` are required. App metadata generation
supplies these three values from `vx.app.yaml` core identity and version.
Missing, empty, or whitespace-only required values throw during initialization.
`V_RELEASE_CHANNEL` independently accepts `canary`, `beta`, or `stable`.
Invalid non-empty values throw during initialization. Neither setting is inferred
from the artifact version.

Vite reads these settings from `import.meta.env` using the workspace's `V_`
prefix. Next reads them from `process.env`. In `next.config.ts`, import
`configEnv` from `@vx/env/next/config` to expose public configuration without
initializing the runtime module during Nx project discovery. Application code
imports the validated values from `@vx/env/next`.

## Defaults

The release channel defaults to `stable` when absent or empty. Set
`V_RELEASE_CHANNEL=beta` or `canary` explicitly for those channels.

Set `V_APP_ENV=dev`, `V_APP_ENV=qa`, or `V_APP_ENV=preview` for the corresponding
deployment. Local `.env` files can omit `V_APP_ENV`, including for local
production builds: the default is always `local`, independent of build mode.
Deployment pipelines must set `V_APP_ENV` to their target environment before
building, and before starting a server when its configuration is read at runtime.
Metadata generation preserves this deployment-owned setting. A deployment that
omits it also resolves to `local`, so deployment configuration should validate it.
There is no `unknown` environment or placeholder app identity/version.

`__DEV__` and `__PRODUCTION__` describe build mode (`MODE` in Vite,
`NODE_ENV` in Next), independently of deployment. Use `APP_ENV` to choose
deployment behavior. A production build can run in `dev`, `qa`, or `preview`.
Compare `APP_ENV` directly with `qa` or `preview` for deployment-specific behavior,
and `RELEASE_CHANNEL` with `beta` for beta-channel behavior.

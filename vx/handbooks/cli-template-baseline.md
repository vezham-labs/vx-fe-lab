# CLI App Template Baseline

The internal apps are reference implementations and test beds for future CLI app
creation. The current repository is the reviewed baseline. Keep adding test apps
or scenarios when they help evaluate a framework, hosting preset, or shared Vx
feature; a playground app does not need to be as small as the app the CLI creates.

`vx-fe-kit-next` is the source workspace; changes flow from it into
`vx-fe-kit-next-template`. Implement shared code, exports, and audit configuration
in the source before carrying them into the workspace-only template. When removing
reference apps from the template, also remove their TypeScript project references.
Keep the root Next.js dependency in `devDependencies` in both workspaces. The
current Nx build and start commands use the full workspace installation. A Next
app deployed with a production-only installation must declare `next` as its own
runtime dependency.

## Agreed boundaries

- Keep static shell navigation and toolbar settings in `vx.nav.yaml`; see the
  [Navigation handbook](./navigation.md) for generation and custom code boundaries.

- The CLI will copy only the files required by the selected app type. Do not
  copy an entire playground directory and then remove demos.
- Keep reusable runtime and generation behavior in `@vx/start` and
  `@vx/config`. Keep app identity, route intent, and hosting choices in each
  app's `vx.app.yaml` and `vx.deploy.yaml`.
- Author app and deploy configuration in YAML. Keep JSON Schema definitions
  and generated provider artifacts in their existing JSON format. Use one
  YAML source per config; no legacy JSON input fallback is required.
- Use [`@vx/system-utils`](./system-utils.md) for shared app-agnostic utilities
  instead of duplicating them in generated apps.
- Keep the reusable application shell in `@vx/react`, including layouts,
  menus, panels, shell providers, and their state. This package is the internal
  boundary for React code intended to move to `@vezham/react`. Each app owns
  its routes and passes its navigation metadata to the shared shell.
- Do not change another `@vx/*` package as part of extracting app-common code
  unless the user explicitly approves that package change.
- Keep demo pages, sample API routes, stories, fixture content, mocks, and E2E
  projects in the playground when they test behavior. Exclude them from CLI
  output unless the user explicitly selects the corresponding feature.
- Pass generated `vxI18n` to the shared Control Center as `context={{ i18n: vxI18n }}`.
  `@vx/react` owns language option labels and document-language behavior; do not
  copy option mapping or hardcoded language lists into app wrappers.
- Generated files are outputs, not templates to edit by hand. Generate them from
  the app config and source content in the created app.
- No compatibility layer for earlier Vx app templates is required.
- Use `V_APP_ENV` for deployment selection, including `qa` and `preview`,
  without legacy boolean environment flags. Build mode remains independent.
- Require `V_APP_ID`, `V_APP_NAME`, and `V_APP_VER` at runtime.
  Default absent or empty `V_APP_ENV` to `local` independently of build mode.
  Reference app `.env` files omit it; deployments explicitly set and validate
  their target environment. Metadata generation supplies identity
  and version from `vx.app.yaml` and preserves the deployment setting. Do not
  infer deployment from build mode or substitute placeholder identity/version.
- Next app configs import `configEnv` from `@vx/env/next/config` so Nx can
  inspect configuration before runtime environment validation. Application code
  uses `@vx/env/next` for validated settings.
- Use `V_RELEASE_CHANNEL` (`canary`, `beta`, or `stable`) as the only release-channel
  input in app templates. It defaults to `stable`; compare the channel directly for conditional behavior.

## Demo and School OS baselines

Both `apps/demo` and `apps/school-os` are CLI app template reference applications.
Demo exercises shared features and testing scenarios; School OS supplies the
product-scale baseline. Use their shared conventions for newly generated apps,
while selecting only the files and features required by the chosen app type.
Treat School OS as a clean starting point, not as an upgrade target for an earlier
implementation.

Apply these rules whenever reviewing, migrating, or optimizing either app:

- Optimize for the current stack and generated output. Do not add aliases,
  shims, deprecated APIs, legacy identifiers, or migration-only branches unless
  a user explicitly requests an upgrade path.
- Use `@vezham/react-v3`, `@vezham/react-pro-v3`, and
  `@vezham/icons-react`. Removed Vezham implementations and the previous
  Iconify, Lucide, Solar, MDI, and Gravity UI dependencies are not compatibility
  requirements.
- Import fixed icons directly from `@vezham/icons-react`. Use `AppIcon` only
  when an icon is selected from serializable data or runtime configuration.
  Data-driven icon identifiers use semantic `vx:*` names, such as `vx:home`,
  `vx:star-filled`, and `vx:sort-ascending`. The `AppIcon` registry is their
  source of truth; do not accept identifiers named after a removed icon set.
- Use TanStack Router for destinations inside the application, including
  root-relative and same-origin URLs. Open cross-origin URLs as external links.
- Keep same-directory imports relative. Use the aliases declared in
  the app's `tsconfig.app.json` when importing across source directories.
- Compare older applications or archived source only to recover intended
  behavior. Reimplement that behavior with the current baseline instead of
  preserving the old implementation.
- Port tests that protect template behavior, and run validation through the
  corresponding app's Nx targets. A historical test or implementation is not itself a
  compatibility contract.
- Declare dependencies in the app or package that consumes them. When multiple
  workspace packages need the same version, keep that version in the pnpm
  catalog and reference it from each package manifest. Keep CLI-generated mock
  app manifests aligned with their template source rather than cataloging their
  dependencies only in the generated examples.
- Keep workspace audit suppressions scoped to real framework entry points or
  verified false positives. Remove unused app exports rather than copying
  app-specific `ignoreExports` entries into the CLI template.

Keep this section focused on durable template decisions. When a review changes
one of these decisions, update this handbook in the same change. Do not record
temporary debugging state, local paths, command output, or a transcript of the
review.

The current reference apps cover a basic TanStack app
(`apps_internals/playground-app`), a CDN-oriented Vite app
(`apps_internals/playground-cdn`), a docs app
(`apps_internals/playground-docs`), and additional playground, TanStack Start,
and Next.js scenarios. These are examples to evaluate, not a fixed list of
files for the CLI to copy.

## Evaluating another test app

1. State the scenario it tests and which existing reference app is closest.
   Add only the app-specific files needed to exercise that scenario.
2. Check whether any new behavior belongs in the shared package rather than
   the app. Keep framework entry points and config consistent with the existing
   reference apps where their behavior is the same.
3. Identify the minimum files and options a newly created app would need. Mark
   tests, fixtures, and demonstrations as playground-only when defining the CLI
   file selection.
4. Validate the app through its Nx build, typecheck, lint, and relevant tests;
   use E2E coverage when browser or hydration behavior matters. Follow the
   workspace [quality rules](./coding-standards/rules/quality.md) and
   [audit handbook](./audits.md).
5. Review generated metadata, deployment config, and docs/OG outputs where the
   scenario uses them. See [Vx config](./vx-config.md) and
   [deployment](./deploy.md) for their source-of-truth rules.

The shared Vite provider still contains placeholder `preConfig` and `config`
hooks with no active store, worker, or Axios setup. They are not a blocker for
new test apps, but do not expose those placeholder options as supported CLI
features without implementing or removing them.

Control Center configuration uses one optional `label` override for the tile,
detail panel heading, and editor entry. Built-in names are supplied by React;
`title` is not accepted in YAML or configured tile registrations.

Settings route entries use `SettingsRoute` and `validateSearch` from
`@vx/react/pages/settings`. React owns section validation, query navigation, and
Back to app behavior; applications supply their generated Control Center config.

App root routes use `AppLayout` from `@vx/react/layouts/app`. It renders explicit
children when supplied, otherwise the router outlet. Optional `settings` enables
Settings navigation and layout switching and requires an app-owned `/settings`
route. Pass generated Control Center configuration as `controlCenter` and language
configuration as `i18n`; `controlCenterSlot` overrides the rendered control.
These features are independent. Shared providers stay mounted across layouts.
Root route metadata and document setup remain in the application.

Apps can set `controlCenter.editControls: true` in `vx.nav.yaml` to show the
Settings link for editing controls. It requires `AppLayout settings` and an
app-owned `/settings` route. Docs omit this option. Control Center has no inline
editor; hiding, reordering, and resetting controls happen in Settings.

`createRouter` from `@vx/start/router/tanstack` supplies default not-found
boundaries below the root so unknown pages keep the application shell and panels
mounted. App catch-all routes only throw `notFound()`; they do not repeat the
shared `NotFound` component or app identity props. An explicit route
`notFoundComponent` or router `defaultNotFoundComponent` overrides the shared view.

See [App layout](./ui/app-layout.md) for the shared props and app route examples.

Keep the filename `vx.nav.yaml`. Its required top-level `navigation` array
defines visible destinations; `items` is not accepted as a legacy alias. Generated
React exports retain the name `navigationItems`.

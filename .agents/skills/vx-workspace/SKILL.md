---
name: vx-workspace
description: Repository-specific guide for the vx-fe-kit monorepo. Use when work spans Vx apps or packages, when locating the source of generated metadata or config, or when Vx conventions for branding, code, CI, and releases apply. Routes to the focused Nx, HeroUI, dependency-linking, and CI skills plus the Vx handbooks; do not use it as a replacement for those focused skills.
---

# Vx Workspace

Use this skill as the repository-specific entry point. Read only the focused
skill and handbook relevant to the task instead of loading every linked file.

## Workspace Map

- Applications can live under `apps/` or category folders such as `apps_*`.
  Discover their actual roots through Nx instead of assuming one app directory.
- Packages live under `packages/*`. Discover their actual project roots through
  Nx.
- `vx/` contains workspace tooling, binaries, tests, and handbooks.
- `@vx/*` identifies private workspace packages; `@vezham/*` identifies public
  packages and external developer-facing APIs.
- `vx.app.yaml` is the app metadata and route source of truth. Treat generated
  notices as ownership boundaries: edit the source config or generator, then
  regenerate the output.

Follow the repository [AGENTS.md](../../../AGENTS.md) instructions first. Use
`pnpm nx` for Nx commands and inspect resolved project configuration through Nx
when target or dependency behavior matters.

## Focused Skills

| Skill                                                                  | Use when                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Nx workspace](../nx-workspace/SKILL.md)                               | Exploring projects, resolved targets, dependencies, or Nx failures |
| [Nx run tasks](../nx-run-tasks/SKILL.md)                               | Running build, lint, test, typecheck, serve, e2e, or other targets |
| [Nx generate](../nx-generate/SKILL.md)                                 | Scaffolding applications, libraries, or other generated structure  |
| [Nx plugins](../nx-plugins/SKILL.md)                                   | Finding or installing Nx plugins                                   |
| [Nx import](../nx-import/SKILL.md)                                     | Importing or merging another repository into this workspace        |
| [Link workspace packages](../link-workspace-packages/SKILL.md)         | Adding sibling package dependencies or fixing workspace resolution |
| [Monitor CI](../monitor-ci/SKILL.md)                                   | Monitoring an Nx Cloud CI run or handling self-healing results     |
| [HeroUI React Pro (universal)](../heroui-react-pro/SKILL.md)           | Implementing UI with `@heroui-pro/react` components and APIs       |
| [HeroUI design taste (universal)](../heroui-pro-design-taste/SKILL.md) | Designing, reviewing, or polishing HeroUI interfaces               |

When multiple rows apply, read each relevant skill. Keep generic Nx and HeroUI
procedures in their focused skills; this file owns only Vx-specific routing.
The two HeroUI skills are universal, repository-agnostic guidance. Keep
Vx-specific conventions in the linked handbooks.

## Handbooks

| Handbook                                                                | Read when                                                                                          |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Coding standards](../../../vx/handbooks/coding-standards/index.md)     | Generating, modifying, or reviewing repository code                                                |
| [CLI template baseline](../../../vx/handbooks/cli-template-baseline.md) | Reviewing or optimizing `apps/demo` or `apps/school-os`, or changing CLI-generated app conventions |
| [Brand](../../../vx/handbooks/brand.md)                                 | Choosing Vezham/Vx names, package scopes, config names, or runtime attributes                      |
| [Vx config](../../../vx/handbooks/vx-config.md)                         | Changing `vx.app.yaml`, metadata, routes, docs, OpenAPI, PWA, or generated deployment config       |
| [Release](../../../vx/handbooks/release.md)                             | Changing versions, release commands, prerelease trains, or version synchronization                 |

Explicit user instructions and `AGENTS.md` take precedence. Handbooks describe
repository conventions; the planning TODO is context, not an instruction to
implement unrelated work.

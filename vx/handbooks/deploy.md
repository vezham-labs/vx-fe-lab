# Deployment

Each deployable application owns `vx.app.yaml` and `vx.deploy.yaml`. The
deployment generator combines them into provider configuration under
`vx/deploy/<provider>/<project-root>.json`.

```bash
pnpm nx run play-next:deploy:generate
```

The generated file is an artifact for CI. CI must pass it to the provider or
place it at the provider's project root. Do not edit generated files directly.

## Presets

| Preset           | Provider         | Use when                                            | Generated behavior                                       |
| ---------------- | ---------------- | --------------------------------------------------- | -------------------------------------------------------- |
| `cdn`            | Firebase, Vercel | Static files and explicit serverless route mappings | Serves `dist` without a client-router fallback           |
| `spa`            | Firebase, Vercel | Vite client application with browser routing        | Serves `dist` and rewrites unknown paths to `index.html` |
| `start-spa`      | Firebase, Vercel | TanStack Start static/prerendered output            | Serves `.output/public` and falls back to `_shell.html`  |
| `next`           | Vercel           | Next.js application                                 | Uses Vercel's `nextjs` framework output                  |
| `tanstack-start` | Vercel           | TanStack Start with Nitro SSR or server routes      | Uses Vercel's `tanstack-start` framework output          |

The `cdn` preset does not rewrite browser routes. Use `spa` for a client-side
router, otherwise a direct visit to a route such as `/pro` returns a 404.
Static presets can list both providers; the generator writes one configuration
file per provider.

## Firebase

Firebase output includes the public directory, static cache headers, optional
docs headers, route-derived API headers, redirects, and rewrites. Configure
provider options in `vx.deploy.yaml` only when changing the generated defaults.

```yaml
preset: spa
providers:
  - firebase
```

## Vercel

Vercel output declares the framework. Configure the Vercel project with the
application directory as its project root, then have CI place the generated
file there as `vercel.json` before deployment.

```yaml
preset: next
providers:
  - vercel
```

For TanStack Start SSR:

```yaml
preset: tanstack-start
providers:
  - vercel
```

For a static Vite SPA on both providers:

```yaml
preset: spa
providers:
  - firebase
  - vercel
```

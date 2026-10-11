# YAML configuration

Use `.yaml` for `vx.app.yaml`, `vx.deploy.yaml`, and `vx.nav.yaml`. Keep
schemas as JSON. Indent with two spaces; quote string values such as hex colors.
Keep callbacks and state in app code.

Link the editor schema with a first-line comment:

```yaml
# yaml-language-server: $schema=../../vx/schemas/vx.nav.json
```

## Anchors and aliases

`&name` names a value; `*name` reuses it later in the same file:

```yaml
navigation:
  - key: academic
    title: Academic
    toolbar: &sectionToolbar
      sync: true
  - key: operations
    title: Operations
    toolbar: *sectionToolbar
```

Aliases reuse the entire value; they do not merge overrides. Generated
TypeScript contains resolved objects. Treat configuration as read-only.

Navigation inheritance is separate: children inherit parent toolbar settings
through `getNavigationToolbar`. For example, `primaryAction: false` disables
an inherited Add action. See [Navigation](./navigation.md) for the full contract.

Edit YAML sources, then run the app's `metadata:generate` or `deploy:generate`
Nx target. Never edit generated outputs. See [Vx config](./vx-config.md) and
[Deployment](./deploy.md) for details.

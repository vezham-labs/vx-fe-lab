# Naming Rules

- Use clear, descriptive names.
- Avoid abbreviations unless widely understood.
- Use `kebab-case` for files and folders.
- Use `PascalCase` for React components and types.
- Use `camelCase` for variables, functions, and hooks.
- Use `UPPER_SNAKE_CASE` for constants and environment variables.

## Callback Props

- Use `onPress` for callback props that pass through to Vezham UI or React Aria
  pressable components.
- Preserve `onClick` when passing through to native elements or APIs that expose
  that event.
- Name higher-level callbacks by intent, such as `onSave`, `onDelete`,
  `onSelect`, or `onNavigate`.
- Preserve distinct interaction names such as `onChange`, `onSubmit`, and
  `onOpenChange`; do not rename every callback to `onPress`.

## Component Props Types

- Use `Props` for a single private component props type or interface in a file.
- Export props with a descriptive name, such as `PageProps` or `ButtonProps`.
- Internal `types.ts` modules may export `Props` for use within their folder
  and subfolders. Keep that generic name out of package entry points and shared
  public barrels; expose a descriptive alias if it becomes public.
- The lint configuration allows this convention in `src/lib` and app component
  and page directories using `allowExportedProps`. It does not trace consumers
  or transitive re-exports; review that boundary when moving or exposing types.
- Keep distinct descriptive names when a file needs multiple props types.
- Keep descriptive local names such as `CreateProviderProps` or `DocsConfigProps`
  when `Props` is already imported for the base or primary component.
- The lint check recognizes locally declared `Props` and names ending in `Props`;
  it does not rename imported or inferred types.

import path from 'node:path'
import ts from 'typescript'

const unwrap = node => {
  while (
    node &&
    (ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node))
  )
    node = node.expression
  return node
}

const getSlotObject = (initializer, bindings) => {
  const node = unwrap(initializer)
  if (!node || !ts.isCallExpression(node)) return node
  if (
    bindings.has('Object') ||
    node.expression.getText() !== 'Object.assign' ||
    node.arguments.length !== 2 ||
    !ts.isIdentifier(node.arguments[0])
  )
    return undefined
  return unwrap(node.arguments[1])
}

const getSlotBinding = property => {
  if (!property.name || !ts.isIdentifier(property.name)) return undefined
  if (ts.isShorthandPropertyAssignment(property)) return property.name
  if (!ts.isPropertyAssignment(property)) return undefined
  const value = unwrap(property.initializer)
  return value && ts.isIdentifier(value) ? value : undefined
}

const getSlots = (initializer, bindings) => {
  const node = getSlotObject(initializer, bindings)
  if (!node || !ts.isObjectLiteralExpression(node)) return []
  const slots = []
  const names = new Set()
  for (const property of node.properties) {
    const value = getSlotBinding(property)
    if (!value) return []
    if (names.has(property.name.text)) return []
    names.add(property.name.text)
    slots.push([property.name.text, value.text])
  }
  return slots
}

const collectImports = (statement, imports) => {
  const clause = statement.importClause
  if (!clause || clause.isTypeOnly) return
  const source = statement.moduleSpecifier.text
  if (clause.name) imports.set(clause.name.text, { source, name: 'default' })
  const named = clause.namedBindings
  if (named && ts.isNamedImports(named)) {
    for (const item of named.elements) {
      if (item.isTypeOnly) continue
      imports.set(item.name.text, {
        source,
        name: (item.propertyName ?? item.name).text
      })
    }
  } else if (named) imports.set(named.name.text, { source, name: '*' })
}

const collectDeclarations = (statement, symbol, initializers, exports) => {
  const exported = statement.modifiers?.some(
    m => m.kind === ts.SyntaxKind.ExportKeyword
  )
  if (ts.isVariableStatement(statement)) {
    const constant = !!(statement.declarationList.flags & ts.NodeFlags.Const)
    for (const decl of statement.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue
      const value = symbol(decl.name.text)
      value.mutable = !constant
      if (constant) initializers.set(decl.name.text, decl.initializer)
      if (exported) exports.set(decl.name.text, value)
    }
    return
  }
  if (!statement.name || !ts.isIdentifier(statement.name)) return
  const value = symbol(statement.name.text)
  const defaultExport = statement.modifiers?.some(
    m => m.kind === ts.SyntaxKind.DefaultKeyword
  )
  if (
    exported &&
    !defaultExport &&
    (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement))
  )
    exports.set(statement.name.text, value)
}

const collectNamedExports = (clause, source, imported, symbol, exports) => {
  for (const item of clause.elements) {
    if (item.isTypeOnly) continue
    const local = (item.propertyName ?? item.name).text
    exports.set(item.name.text, source ? imported.get(local) : symbol(local))
  }
}

const collectStarExports = (imported, stars) => {
  for (const [name, value] of imported) {
    if (name === 'default') continue
    const ambiguous = stars.has(name) && stars.get(name)?.id !== value?.id
    stars.set(name, ambiguous ? undefined : value)
  }
}

// vx-bot/NOTE: Inspect source syntax without importing/evaluating application or dependency code.
export const createCompoundResolver = filename => {
  const config = ts.findConfigFile(path.dirname(filename), ts.sys.fileExists)
  const options = config
    ? ts.getParsedCommandLineOfConfigFile(
        config,
        {},
        {
          ...ts.sys,
          readDirectory: () => [],
          onUnRecoverableConfigFileDiagnostic: () => undefined
        }
      )?.options
    : {}
  const modules = new Map()
  const active = new Set()
  const resolve = (source, importer) => {
    const resolved = ts.resolveModuleName(
      source,
      importer,
      {
        ...options,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        allowJs: true
      },
      ts.sys
    ).resolvedModule?.resolvedFileName
    if (!resolved) return undefined
    if (/\.d\.[cm]?ts$/.test(resolved)) {
      const implementation = resolved.replace(
        /\.d\.(ts|mts|cts)$/,
        (_, ext) => ({ ts: '.js', mts: '.mjs', cts: '.cjs' })[ext]
      )
      return ts.sys.fileExists(implementation) ? implementation : undefined
    }
    return resolved
  }
  const inspect = file => {
    if (!file || active.has(file) || active.size > 12 || modules.size > 512)
      return new Map()
    if (modules.has(file)) return modules.get(file)
    const source = ts.sys.readFile(file)
    if (!source) return new Map()
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
    if (tree.parseDiagnostics.length) return new Map()
    active.add(file)
    const bindings = new Map()
    const imports = new Map()
    const initializers = new Map()
    const exports = new Map()
    const stars = new Map()
    const symbol = name => {
      if (!bindings.has(name)) {
        const imported = imports.get(name)
        const value = imported?.source.startsWith('.')
          ? inspect(resolve(imported.source, file)).get(imported.name)
          : undefined
        bindings.set(name, value ?? { id: `${file}#${name}`, slots: [] })
      }
      return bindings.get(name)
    }
    for (const statement of tree.statements) {
      if (ts.isImportDeclaration(statement)) collectImports(statement, imports)
      collectDeclarations(statement, symbol, initializers, exports)
    }
    for (const [name, initializer] of initializers) {
      symbol(name).slots = getSlots(
        initializer,
        new Set([...bindings.keys(), ...imports.keys()])
      ).map(([slot, local]) => [slot, symbol(local).id])
    }
    for (const statement of tree.statements) {
      if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue
      const source = statement.moduleSpecifier?.text
      // vx-bot/NOTE: Follow local barrels only; avoid recursively traversing unrelated dependency graphs.
      const imported = source?.startsWith('.')
        ? inspect(resolve(source, file))
        : new Map()
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        collectNamedExports(
          statement.exportClause,
          source,
          imported,
          symbol,
          exports
        )
      } else if (!statement.exportClause) collectStarExports(imported, stars)
    }
    const result = new Map([...stars, ...exports])
    active.delete(file)
    modules.set(file, result)
    return result
  }
  return source => {
    const exported = inspect(resolve(source, filename))
    const replacements = new Map()
    for (const [root, compound] of exported) {
      if (!/^[A-Z]\w*$/.test(root)) continue
      for (const [slot, id] of compound?.slots ?? []) {
        if (!/^[A-Z]\w*$/.test(slot)) continue
        for (const [name, value] of exported) {
          if (
            name !== root &&
            value?.id === id &&
            !value.mutable &&
            !value.slots.length
          )
            replacements.set(name, `${root}.${slot}`)
        }
      }
    }
    return replacements
  }
}

import { createCompoundResolver } from './compound-exports.mjs'

export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      compound:
        'Use {{replacement}} instead of {{name}} to follow Vx compound-component notation.'
    }
  },
  create: context => {
    const resolve = createCompoundResolver(context.physicalFilename)
    const sources = new Map()
    const report = (node, source, name) => {
      if (typeof source !== 'string' || !/^[A-Z]\w*$/.test(name)) return
      if (!sources.has(source)) sources.set(source, resolve(source))
      const replacement = sources.get(source).get(name)
      if (replacement)
        context.report({
          node,
          messageId: 'compound',
          data: { name, replacement }
        })
    }
    const checkNamespace = (node, object, name) => {
      if (!['Identifier', 'JSXIdentifier'].includes(object?.type)) return
      let scope = context.sourceCode.getScope(node)
      let variable
      while (scope && !variable) {
        variable = scope.set.get(object.name)
        scope = scope.upper
      }
      const def = variable?.defs.find(d => d.type === 'ImportBinding')
      if (def?.node.type === 'ImportNamespaceSpecifier') {
        report(node, def.parent.source.value, name)
      }
    }
    return {
      ImportDeclaration: node => {
        if (node.importKind === 'type') return
        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.importKind !== 'type'
          ) {
            report(
              specifier,
              node.source.value,
              specifier.imported.name ?? specifier.imported.value
            )
          }
        }
      },
      ExportNamedDeclaration: node => {
        if (!node.source || node.exportKind === 'type') return
        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ExportSpecifier' &&
            specifier.exportKind !== 'type'
          ) {
            report(
              specifier,
              node.source.value,
              specifier.local.name ?? specifier.local.value
            )
          }
        }
      },
      JSXOpeningElement: node => {
        if (node.name.type === 'JSXMemberExpression') {
          checkNamespace(node, node.name.object, node.name.property.name)
        }
      },
      MemberExpression: node => {
        const name = node.computed ? node.property.value : node.property.name
        if (typeof name === 'string') checkNamespace(node, node.object, name)
      }
    }
  }
}

const vxUiSources = new Set([
  '@vezham/react-v3',
  '@vezham/react-v3/button',
  '@vezham/react-v3/table'
])

const hasAccessibleName = attributes =>
  attributes.some(
    attribute =>
      attribute.type === 'JSXAttribute' &&
      ['aria-label', 'aria-labelledby'].includes(attribute.name.name)
  )

const hasSpread = attributes =>
  attributes.some(attribute => attribute.type === 'JSXSpreadAttribute')

const isIconOnly = attributes =>
  attributes.some(
    attribute =>
      attribute.type === 'JSXAttribute' &&
      attribute.name.name === 'isIconOnly' &&
      !(
        attribute.value?.type === 'JSXExpressionContainer' &&
        attribute.value.expression.value === false
      )
  )

const importedComponent = (context, node, name) => {
  let scope = context.sourceCode.getScope(node)
  let variable
  while (scope && !variable) {
    variable = scope.set.get(name)
    scope = scope.upper
  }
  const definition = variable?.defs.find(def => def.type === 'ImportBinding')
  if (!definition || !vxUiSources.has(definition.parent.source.value)) return
  return definition.node
}

const isNamedImport = (specifier, name) =>
  specifier?.type === 'ImportSpecifier' && specifier.imported.name === name

const isNamespaceImport = specifier =>
  specifier?.type === 'ImportNamespaceSpecifier'

export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      iconOnly:
        'Give an icon-only Vezham UI Button an aria-label or aria-labelledby attribute.',
      tableContent:
        'Give Vezham UI Table.Content an aria-label or aria-labelledby attribute.'
    }
  },
  create: context => ({
    JSXOpeningElement: node => {
      if (hasAccessibleName(node.attributes) || hasSpread(node.attributes))
        return
      if (node.name.type === 'JSXIdentifier') {
        const specifier = importedComponent(context, node, node.name.name)
        if (isNamedImport(specifier, 'Button') && isIconOnly(node.attributes)) {
          context.report({ node, messageId: 'iconOnly' })
        }
        return
      }
      if (node.name.type !== 'JSXMemberExpression') return
      const object = node.name.object
      if (object.type === 'JSXIdentifier') {
        const specifier = importedComponent(context, node, object.name)
        if (
          isNamespaceImport(specifier) &&
          node.name.property.name === 'Button' &&
          isIconOnly(node.attributes)
        ) {
          context.report({ node, messageId: 'iconOnly' })
        }
        if (
          isNamedImport(specifier, 'Table') &&
          node.name.property.name === 'Content'
        ) {
          context.report({ node, messageId: 'tableContent' })
        }
        return
      }
      if (
        object.type === 'JSXMemberExpression' &&
        object.object.type === 'JSXIdentifier' &&
        isNamespaceImport(
          importedComponent(context, node, object.object.name)
        ) &&
        object.property.name === 'Table' &&
        node.name.property.name === 'Content'
      ) {
        context.report({ node, messageId: 'tableContent' })
      }
    }
  })
}

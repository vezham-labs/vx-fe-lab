export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      onPress:
        'Use onPress for Vezham UI Button. Review MouseEvent-specific code before changing the handler.'
    }
  },
  create: context => ({
    JSXAttribute: node => {
      if (node.name.name !== 'onClick') return
      const name = node.parent.name
      const identifier = name.type === 'JSXIdentifier' ? name : name.object
      if (identifier?.type !== 'JSXIdentifier') return
      let scope = context.sourceCode.getScope(node)
      let variable
      while (scope && !variable) {
        variable = scope.set.get(identifier.name)
        scope = scope.upper
      }
      const definition = variable?.defs.find(
        def => def.type === 'ImportBinding'
      )
      if (!definition) return
      const source = definition.parent.source.value
      if (!['@vezham/react-v3', '@vezham/react-v3/button'].includes(source))
        return
      const specifier = definition.node
      const isButton =
        name.type === 'JSXIdentifier'
          ? specifier.type === 'ImportSpecifier' &&
            specifier.imported.name === 'Button'
          : specifier.type === 'ImportNamespaceSpecifier' &&
            name.property.name === 'Button'
      if (isButton) context.report({ node, messageId: 'onPress' })
    }
  })
}

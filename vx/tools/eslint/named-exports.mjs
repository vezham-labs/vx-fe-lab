export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      named:
        'Use a named export for reusable source code and update its consumers. Default exports are reserved for framework and tooling entry points.'
    }
  },
  create: context => ({
    ExportDefaultDeclaration: node =>
      context.report({ node, messageId: 'named' }),
    ExportNamedDeclaration: node => {
      for (const specifier of node.specifiers) {
        if (
          (specifier.exported.name ?? specifier.exported.value) === 'default'
        ) {
          context.report({ node: specifier, messageId: 'named' })
        }
      }
    }
  })
}

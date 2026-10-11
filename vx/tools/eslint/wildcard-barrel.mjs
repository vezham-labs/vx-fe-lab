export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      wildcard:
        'Prefer export * for this internal barrel. Check name collisions and unintended exports before changing it.'
    }
  },
  create: context => ({
    Program: node => {
      if (
        !node.body.length ||
        !node.body.every(
          item =>
            ['ExportNamedDeclaration', 'ExportAllDeclaration'].includes(
              item.type
            ) && item.source
        )
      )
        return
      for (const item of node.body) {
        if (item.type !== 'ExportNamedDeclaration' || !item.specifiers.length)
          continue
        if (
          item.specifiers.some(
            specifier =>
              specifier.local?.name === 'default' ||
              specifier.local?.name !== specifier.exported?.name
          )
        )
          continue
        context.report({ node: item, messageId: 'wildcard' })
      }
    }
  })
}

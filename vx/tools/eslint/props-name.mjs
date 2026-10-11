export default {
  meta: {
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: { allowExportedProps: { type: 'boolean' } },
        additionalProperties: false
      }
    ],
    messages: {
      private: 'Use Props for the single private props type in this file.',
      public:
        'Use a descriptive exported props name, such as PageProps or ButtonProps.'
    }
  },
  create: context => ({
    Program: program => {
      const exports = new Map()
      const declarations = []
      const hasImportedProps = program.body.some(statement =>
        statement.type === 'ImportDeclaration'
          ? statement.specifiers.some(
              specifier => specifier.local.name === 'Props'
            )
          : statement.type === 'TSImportEqualsDeclaration' &&
            statement.id.name === 'Props'
      )
      const addExport = (local, name) =>
        exports.set(local, [...(exports.get(local) ?? []), name])
      for (const statement of program.body) {
        const node =
          statement.type === 'ExportNamedDeclaration'
            ? statement.declaration
            : statement
        if (
          ['TSTypeAliasDeclaration', 'TSInterfaceDeclaration'].includes(
            node?.type
          ) &&
          /^(?:Props|[A-Z]\w*Props)$/.test(node.id.name)
        ) {
          declarations.push(node)
          if (statement.type === 'ExportNamedDeclaration')
            addExport(node.id.name, node.id.name)
        }
        if (statement.type === 'ExportNamedDeclaration' && !statement.source) {
          for (const specifier of statement.specifiers) {
            addExport(
              specifier.local.name,
              specifier.exported.name ?? specifier.exported.value
            )
          }
        }
      }
      for (const node of declarations) {
        const exported = exports.get(node.id.name)
        if (
          exported?.some(
            name =>
              !(name === 'Props' && context.options[0]?.allowExportedProps) &&
              !/^[A-Z]\w*Props$/.test(name)
          )
        )
          context.report({ node: node.id, messageId: 'public' })
        else if (
          !exported &&
          !hasImportedProps &&
          declarations.length === 1 &&
          node.id.name !== 'Props'
        ) {
          context.report({ node: node.id, messageId: 'private' })
        }
      }
    }
  })
}

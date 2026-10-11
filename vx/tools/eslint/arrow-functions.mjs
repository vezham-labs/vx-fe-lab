const needsFunctionBinding = (node, source) => {
  const visit = current => {
    if (
      current !== node &&
      [
        'FunctionDeclaration',
        'FunctionExpression',
        'ClassDeclaration',
        'ClassExpression'
      ].includes(current.type)
    )
      return false
    if (
      ['ThisExpression', 'Super', 'MetaProperty'].includes(current.type) ||
      (current.type === 'Identifier' && current.name === 'arguments')
    )
      return true
    return (source.visitorKeys[current.type] ?? []).some(key => {
      const child = current[key]
      return Array.isArray(child)
        ? child.some(item => item && visit(item))
        : child && visit(child)
    })
  }
  return visit(node)
}

const convertToArrow = (node, source, fixer) => {
  const edits = [
    fixer.replaceTextRange(
      [node.range[0], node.id.range[1]],
      `const ${node.id.name} = ${node.async ? 'async ' : ''}`
    ),
    fixer.insertTextBefore(node.body, '=> '),
    fixer.insertTextAfter(node, ';')
  ]
  const parameters = node.typeParameters?.params
  if (
    parameters?.length === 1 &&
    !parameters[0].constraint &&
    !parameters[0].default
  ) {
    const closing = source.getLastToken(node.typeParameters)
    if (source.getTokenBefore(closing).value !== ',') {
      edits.push(fixer.insertTextBefore(closing, ','))
    }
  }
  return edits
}

// vx-bot/NOTE: Autofix simple declarations; preserve cases needing runtime or API review.
export default {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      fixableArrow: 'Prefer a named arrow function. Run with --fix to convert.',
      preferArrow:
        'Prefer a named arrow function. Review initialization order and callers before converting.'
    }
  },
  create: context => ({
    FunctionDeclaration: node => {
      if (!node.body || node.generator || node.declare) return
      const source = context.sourceCode
      if (needsFunctionBinding(node, source)) return
      const variable = source
        .getDeclaredVariables(node)
        .find(item => item.name === node.id?.name)
      if (variable?.defs.some(def => def.node !== node)) return // vx-bot/NOTE: Overloads/merged declarations.
      if (
        variable?.references.some(
          ref =>
            ref.identifier.range[0] < node.range[0] ||
            ref.identifier.parent?.type === 'NewExpression' ||
            (ref.identifier.parent?.type === 'MemberExpression' &&
              ref.identifier.parent.property?.name === 'prototype')
        )
      )
        return
      const exported = node.parent.type === 'ExportNamedDeclaration'
      const topLevel =
        node.parent.type === 'Program' ||
        (exported && node.parent.parent.type === 'Program')
      const exportedHook = exported && /^use[A-Z0-9]/.test(node.id?.name ?? '')
      const directCallsOnly = variable?.references.every(
        ref =>
          !ref.isWrite() &&
          ref.identifier.parent?.type === 'CallExpression' &&
          ref.identifier.parent.callee === ref.identifier
      )
      const headerComments = source
        .getCommentsInside(node)
        .some(comment => comment.range[0] < node.body.range[0])
      const canFix =
        node.id &&
        topLevel &&
        (!exported || exportedHook) &&
        directCallsOnly &&
        !headerComments &&
        !node.returnType?.typeAnnotation?.asserts

      context.report({
        node,
        messageId: canFix ? 'fixableArrow' : 'preferArrow',
        fix: canFix ? fixer => convertToArrow(node, source, fixer) : null
      })
    }
  })
}

const structured =
  /^@?[\w-]+\/(INFO|NOTE|TODO|FIXME|HACK|REF)(?:\([^\n)]+\))?:\s+\S/
const directive =
  /^(?:eslint(?:-disable|-enable|\s)|global[s]?\s|exported\s|prettier-ignore\b|@ts-(?:check|nocheck|ignore|expect-error)\b|(?:istanbul|c8|v8)\s+ignore\b|[#@]__PURE__|[#@]\s*source(?:Mapping)?URL=|\/\s*<reference\b)/

export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      style:
        'Use <author>/INFO|NOTE|TODO|FIXME|HACK|REF: followed by an explanation. Use vx-bot for new agent-authored comments.'
    }
  },
  create: context => ({
    Program: () => {
      let previous
      for (const comment of context.sourceCode.getAllComments()) {
        const value = comment.value.trim()
        const yamlComment = context.sourceCode.text[comment.range[0]] === '#'
        const lineComment = comment.type === 'Line' || yamlComment
        const continuation =
          previous?.valid &&
          lineComment &&
          previous.lineComment &&
          comment.loc.start.line === previous.comment.loc.end.line + 1 &&
          comment.loc.start.column === previous.comment.loc.start.column
        const exempt =
          comment.type === 'Shebang' ||
          (comment.type === 'Block' &&
            !yamlComment &&
            /^\*/.test(comment.value)) ||
          (yamlComment && /^(?:-\s+|[\w-]+:\s*(?:\S|$))/.test(value)) ||
          /@license|@preserve|SPDX-License-Identifier:|^Copyright\b/i.test(
            value
          ) ||
          directive.test(value)
        const agentPrefix = /^(?:codex|claude|copilot|chatgpt|agent)\//i.test(
          value
        )
        const valid =
          (structured.test(value) && !agentPrefix) ||
          (continuation && !agentPrefix)
        if (value && !exempt && !valid)
          context.report({ node: comment, messageId: 'style' })
        previous = { comment, lineComment, valid }
      }
    }
  })
}

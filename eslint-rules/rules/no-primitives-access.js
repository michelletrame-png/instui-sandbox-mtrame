// useComputedTheme() returns { primitives, semantics, sharedTokens, components }.
// 'primitives' is the raw color palette (grey12, blue45, etc.) and is not meant
// for application code — use sharedTokens for semantic, theme-aware values instead.

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid accessing primitives from useComputedTheme() — use sharedTokens for semantic token values',
    },
    messages: {
      noPrimitives:
        'Avoid using primitives.{{ prop }} directly. Use sharedTokens from useComputedTheme() instead — primitives are raw palette values that do not adapt to theme intent.',
    },
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (node.object?.type === 'Identifier' && node.object.name === 'primitives') {
          const prop = node.property?.name ?? node.property?.value ?? '...'
          context.report({ node, messageId: 'noPrimitives', data: { prop } })
        }
      },
    }
  },
}

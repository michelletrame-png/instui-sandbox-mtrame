/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use sharedTokens from useComputedTheme() instead of hardcoded hex colors',
    },
    messages: {
      noHex: 'Avoid hardcoded hex "{{ value }}". Use a sharedTokens value from useComputedTheme() instead.',
    },
  },
  create(context) {
    function checkValue(node) {
      if (node.type === 'Literal' && typeof node.value === 'string' && /#[0-9a-fA-F]{3,8}\b/.test(node.value)) {
        context.report({ node, messageId: 'noHex', data: { value: node.value } })
      }
    }

    function walkObjectExpression(node) {
      if (!node || node.type !== 'ObjectExpression') return
      for (const prop of node.properties) {
        if (prop.type === 'Property') checkValue(prop.value)
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return
        if (!node.value) return
        // style={{ ... }}
        if (node.value.type === 'JSXExpressionContainer') {
          walkObjectExpression(node.value.expression)
        }
      },
    }
  },
}

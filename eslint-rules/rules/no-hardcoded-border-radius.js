const CSS_LENGTH = /\d+(\.\d+)?(px|rem|em|vw|vh|%)/

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use sharedTokens.borderRadius values instead of hardcoded CSS lengths',
    },
    messages: {
      noProp: 'Avoid hardcoded borderRadius "{{ value }}". Use sharedTokens.borderRadius from useComputedTheme() — e.g. sharedTokens.borderRadius.card.md',
      noStyle: 'Avoid hardcoded borderRadius in style prop. Use sharedTokens.borderRadius from useComputedTheme() instead.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'borderRadius') {
          // borderRadius="1rem" — string literal with units
          if (node.value?.type === 'Literal' && CSS_LENGTH.test(String(node.value.value))) {
            context.report({ node, messageId: 'noProp', data: { value: node.value.value } })
          }
          // borderRadius={8} — numeric literal
          if (
            node.value?.type === 'JSXExpressionContainer' &&
            node.value.expression?.type === 'Literal' &&
            typeof node.value.expression.value === 'number'
          ) {
            context.report({ node, messageId: 'noProp', data: { value: node.value.expression.value } })
          }
        }

        // style={{ borderRadius: ... }} with any literal value
        if (node.name.name === 'style' && node.value?.type === 'JSXExpressionContainer') {
          const expr = node.value.expression
          if (expr.type !== 'ObjectExpression') return
          for (const prop of expr.properties) {
            if (prop.type === 'Property' && prop.key?.name === 'borderRadius' && prop.value?.type === 'Literal') {
              context.report({ node: prop, messageId: 'noStyle' })
            }
          }
        }
      },
    }
  },
}

// Border values in style props should use View's borderWidth/borderColor props
// wired to sharedTokens.stroke values instead of inline CSS.
const BORDER_PROPS = new Set([
  'border', 'borderTop', 'borderBottom', 'borderLeft', 'borderRight',
  'borderInline', 'borderBlock',
  'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor',
  'borderWidth', 'borderStyle',
  'outline',
])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use View borderWidth/borderColor props with sharedTokens.stroke instead of inline border styles',
    },
    messages: {
      noStyleBorder:
        'Avoid inline "{{ prop }}" style. Use View borderWidth + borderColor props with sharedTokens.stroke from useComputedTheme() instead.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return
        if (node.value?.type !== 'JSXExpressionContainer') return
        const expr = node.value.expression
        if (expr.type !== 'ObjectExpression') return

        for (const prop of expr.properties) {
          if (prop.type !== 'Property') continue
          const propName = prop.key?.name ?? prop.key?.value
          if (!BORDER_PROPS.has(propName)) continue
          if (prop.value?.type !== 'Literal') continue
          context.report({ node: prop, messageId: 'noStyleBorder', data: { prop: propName } })
        }
      },
    }
  },
}

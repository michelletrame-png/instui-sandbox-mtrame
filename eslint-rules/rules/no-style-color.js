// Any literal color value in a style prop should come from sharedTokens instead.
// 'inherit', 'currentColor', and 'transparent' are allowed — they don't hardcode a color.
const ALLOWED = new Set(['inherit', 'currentColor', 'transparent', 'initial', 'unset'])

const COLOR_PROPS = new Set([
  'color', 'backgroundColor', 'background',
  'fill', 'stroke', 'caretColor', 'outlineColor', 'textDecorationColor',
])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid hardcoded color values in style props — use sharedTokens from useComputedTheme()',
    },
    messages: {
      noStyleColor:
        'Avoid hardcoded "{{ prop }}" in style prop. Use a sharedTokens value from useComputedTheme() instead.',
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
          if (!COLOR_PROPS.has(propName)) continue
          if (prop.value?.type !== 'Literal') continue
          if (ALLOWED.has(prop.value.value)) continue
          context.report({ node: prop, messageId: 'noStyleColor', data: { prop: propName } })
        }
      },
    }
  },
}

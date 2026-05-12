/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Avoid using · or | as inline text dividers. Use a single descriptive string, or compose items with <InlineList delimiter="pipe"> from @instructure/ui-list/latest.',
    },
    messages: {
      textDivider:
        'Text "{{ text }}" uses an inline divider character (· or |). ' +
        'Prefer a single descriptive string, or place each segment in its own ' +
        '<InlineList.Item> inside <InlineList delimiter="pipe"> (ui-list/latest).',
    },
  },
  create(context) {
    // Middle dot (· U+00B7), bullet (• U+2022), pipe with surrounding spaces, slash with surrounding spaces
    const DIVIDER_RE = /[·•]| \| | \/ /

    function checkString(value, reportNode) {
      if (DIVIDER_RE.test(value)) {
        context.report({
          node: reportNode,
          messageId: 'textDivider',
          data: { text: value.trim().replace(/\s+/g, ' ').slice(0, 60) },
        })
      }
    }

    return {
      // Catches bare JSX text: <Text>Published · Biology 101</Text>
      JSXText(node) {
        checkString(node.value, node)
      },

      // Catches string literals in JSX expressions: <Text>{"Published · Biology 101"}</Text>
      JSXExpressionContainer(node) {
        const expr = node.expression
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
          checkString(expr.value, node)
        }
      },
    }
  },
}

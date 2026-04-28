// Catches theme-name comparisons used to branch on color values.
// e.g. themeKey === 'dark' ? '#333' : '#fff'
// The correct approach is useComputedTheme() → sharedTokens, which resolves
// to the right value for any theme automatically.
const THEME_NAMES = new Set(['dark', 'light', 'canvas', 'canvasHighContrast'])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid branching on theme names to pick colors — use useComputedTheme() sharedTokens instead',
    },
    messages: {
      noThemeDetection:
        'Avoid comparing against theme name "{{ name }}". Use sharedTokens from useComputedTheme() — it resolves the correct value for any theme automatically.',
    },
  },
  create(context) {
    return {
      BinaryExpression(node) {
        if (node.operator !== '===' && node.operator !== '!==') return
        const leftVal = node.left.type === 'Literal' ? node.left.value : null
        const rightVal = node.right.type === 'Literal' ? node.right.value : null
        const match = (leftVal && THEME_NAMES.has(leftVal)) ? leftVal
          : (rightVal && THEME_NAMES.has(rightVal)) ? rightVal
          : null
        if (match) {
          context.report({ node, messageId: 'noThemeDetection', data: { name: match } })
        }
      },
    }
  },
}

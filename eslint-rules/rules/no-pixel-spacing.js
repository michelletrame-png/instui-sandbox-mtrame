// View, Flex, and Grid spacing props accept InstUI token names ("small", "medium", etc.)
// or CSS shorthand of those tokens — not raw CSS lengths like "16px" or "1rem".
// Raw values bypass the spacing scale and break at theme boundaries.
const CSS_LENGTH = /\b\d+(\.\d+)?(px|rem|em|vw|vh|%)/
const SPACING_PROPS = new Set(['padding', 'margin', 'gap', 'colSpacing', 'rowSpacing'])
const INSTUI_COMPONENTS = new Set(['View', 'Flex', 'Grid'])

function isFlexItem(node) {
  return node.type === 'JSXMemberExpression' &&
    node.object?.name === 'Flex' && node.property?.name === 'Item'
}
function isGridChild(node) {
  return node.type === 'JSXMemberExpression' &&
    (node.object?.name === 'Grid') && (node.property?.name === 'Row' || node.property?.name === 'Col')
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use InstUI spacing tokens instead of raw CSS lengths in View/Flex/Grid spacing props',
    },
    messages: {
      noPixelSpacing:
        'Avoid raw CSS length "{{ value }}" in {{ prop }} prop. Use an InstUI spacing token (e.g. "small", "medium", "large") instead.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const propName = node.name?.name
        if (!SPACING_PROPS.has(propName)) return

        const parent = node.parent
        const elementName = parent?.name
        const isTargetComponent =
          (elementName?.type === 'JSXIdentifier' && INSTUI_COMPONENTS.has(elementName.name)) ||
          isFlexItem(elementName) ||
          isGridChild(elementName)

        if (!isTargetComponent) return

        const value = node.value?.type === 'Literal' ? node.value.value : null
        if (value && CSS_LENGTH.test(String(value))) {
          context.report({ node, messageId: 'noPixelSpacing', data: { value, prop: propName } })
        }
      },
    }
  },
}

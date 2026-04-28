// Flex.Item adds overflow: hidden as a side effect. If you don't need any of
// its specific layout behaviors, make the element a direct child of Flex instead —
// CSS gap still applies, and you avoid the implicit overflow clipping.
const BEHAVIOR_PROPS = new Set([
  'shouldGrow', 'shouldShrink', 'align', 'order', 'size',
  'overflowX', 'overflowY', 'padding', 'margin', 'textAlign',
])

function isFlexItem(node) {
  return node.type === 'JSXMemberExpression' &&
    node.object?.name === 'Flex' && node.property?.name === 'Item'
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Remove Flex.Item when none of its layout behaviors are needed — direct Flex children receive gap spacing without the implicit overflow: hidden',
    },
    messages: {
      noBehavior:
        'This Flex.Item has no layout behavior props (shouldGrow, shouldShrink, align, etc.). Remove it and make the child a direct Flex child — gap still applies and you avoid implicit overflow: hidden.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (!isFlexItem(node.name)) return
        const hasBehavior = node.attributes.some(
          a => a.type === 'JSXAttribute' && BEHAVIOR_PROPS.has(a.name?.name)
        )
        if (!hasBehavior) {
          context.report({ node, messageId: 'noBehavior' })
        }
      },
    }
  },
}

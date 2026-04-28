// Flex.Item applies overflow: hidden by default, which clips box shadows,
// focus rings, and borderRadius paint that extends beyond the item boundary.
// If a direct child View has shadow or borderRadius, either add
// overflowX/Y="visible" to Flex.Item, or make the View a direct Flex child.

function isFlexItem(node) {
  return node.type === 'JSXMemberExpression' &&
    node.object?.name === 'Flex' && node.property?.name === 'Item'
}

function hasAttr(openingElement, name) {
  return openingElement.attributes.some(
    a => a.type === 'JSXAttribute' && a.name?.name === name
  )
}

function hasOverflowVisible(openingElement) {
  return openingElement.attributes.some(a => {
    if (a.type !== 'JSXAttribute') return false
    if (a.name?.name !== 'overflowX' && a.name?.name !== 'overflowY') return false
    return a.value?.value === 'visible' ||
      (a.value?.type === 'JSXExpressionContainer' && a.value?.expression?.value === 'visible')
  })
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Flex.Item clips shadows and focus rings — add overflowX/Y="visible" or make the View a direct Flex child',
    },
    messages: {
      shadowClip:
        'Flex.Item applies overflow: hidden and will clip the shadow or borderRadius on its child View. Either add overflowX="visible" (or overflowY) to Flex.Item, or make the View a direct child of Flex.',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        if (!isFlexItem(node.openingElement.name)) return
        if (hasOverflowVisible(node.openingElement)) return

        for (const child of node.children) {
          if (child.type !== 'JSXElement') continue
          const childName = child.openingElement.name
          if (childName.type !== 'JSXIdentifier') continue
          if (childName.name !== 'View') continue

          if (hasAttr(child.openingElement, 'shadow') || hasAttr(child.openingElement, 'borderRadius')) {
            context.report({ node: node.openingElement, messageId: 'shadowClip' })
            break
          }
        }
      },
    }
  },
}

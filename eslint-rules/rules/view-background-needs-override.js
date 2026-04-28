// background="primary" and background="secondary" on View map to legacy theme slots
// that render the wrong color unless themeOverride wires them to a semantic sharedTokens value.
// Other values (transparent, primary-inverse, brand, etc.) don't need an override.
const SLOTS_REQUIRING_OVERRIDE = new Set(['primary', 'secondary'])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'View with background="primary|secondary" requires a matching themeOverride to use semantic color tokens',
    },
    messages: {
      missingOverride:
        '<View background="{{ value }}"> needs a themeOverride prop — e.g. themeOverride={{ background{{ Slot }}: sharedTokens.background.containerColor }}',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = node.name.name ?? node.name.property?.name
        if (name !== 'View') return

        const bgAttr = node.attributes.find(
          a => a.type === 'JSXAttribute' && a.name?.name === 'background'
        )
        if (!bgAttr) return

        const value =
          bgAttr.value?.type === 'Literal'
            ? bgAttr.value.value
            : bgAttr.value?.type === 'JSXExpressionContainer' && bgAttr.value.expression?.type === 'Literal'
              ? bgAttr.value.expression.value
              : null

        if (!value || !SLOTS_REQUIRING_OVERRIDE.has(value)) return

        const hasOverride = node.attributes.some(
          a => a.type === 'JSXAttribute' && a.name?.name === 'themeOverride'
        )
        if (!hasOverride) {
          const slot = value.charAt(0).toUpperCase() + value.slice(1)
          context.report({ node: bgAttr, messageId: 'missingOverride', data: { value, Slot: slot } })
        }
      },
    }
  },
}

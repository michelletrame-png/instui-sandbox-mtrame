// <div style={{ display: 'flex' }}> should be <Flex>
// <div style={{ padding/margin: ... }}> should be <View padding="...">
// Native divs with layout styles bypass InstUI spacing tokens and theming.
const LAYOUT_PROPS = new Set(['display', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'gap'])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use <Flex> or <View> instead of <div> with inline layout styles',
    },
    messages: {
      useFlex: 'Use <Flex> instead of <div style={{ display: "flex" }}>.',
      useView: 'Use <View padding="..."> instead of <div style={{ {{ prop }}: ... }}>. View accepts InstUI spacing tokens.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== 'div' && node.name.name !== 'span') return

        const styleAttr = node.attributes.find(
          a => a.type === 'JSXAttribute' && a.name?.name === 'style'
        )
        if (!styleAttr || styleAttr.value?.type !== 'JSXExpressionContainer') return
        const expr = styleAttr.value.expression
        if (expr.type !== 'ObjectExpression') return

        for (const prop of expr.properties) {
          if (prop.type !== 'Property') continue
          const name = prop.key?.name ?? prop.key?.value
          if (!LAYOUT_PROPS.has(name)) continue

          if (name === 'display' && prop.value?.value === 'flex') {
            context.report({ node: styleAttr, messageId: 'useFlex' })
          } else if (name !== 'display') {
            context.report({ node: prop, messageId: 'useView', data: { prop: name } })
          }
        }
      },
    }
  },
}

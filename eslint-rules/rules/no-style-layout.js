// Layout properties in a style prop should use InstUI component props instead.
// View, Flex, and Grid expose padding, margin, width, height, display, etc. as
// first-class props that accept token-aware values. Using style={{}} bypasses
// the token system and breaks at theme/density boundaries.
//
// Scope: all JSX elements except <div>/<span> (covered by no-raw-div-layout)
// and SVG primitives (which have no InstUI equivalent).

const LAYOUT_PROPS = new Set([
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'paddingInline', 'paddingBlock',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginInline', 'marginBlock',
  'gap', 'rowGap', 'columnGap',
  'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
  'display', 'flexDirection', 'flexWrap', 'flex', 'flexGrow', 'flexShrink', 'flexBasis',
  'alignItems', 'alignContent', 'alignSelf', 'justifyContent', 'justifyItems', 'justifySelf',
  'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow', 'gridArea',
  'overflow', 'overflowX', 'overflowY',
])

// no-raw-div-layout already covers these
const SKIP_TAGS = new Set(['div', 'span'])

const SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse',
  'g', 'defs', 'use', 'text', 'tspan', 'textPath', 'clipPath', 'mask', 'pattern',
  'linearGradient', 'radialGradient', 'stop', 'filter', 'image', 'symbol',
  'feBlend', 'feColorMatrix', 'feComposite', 'feGaussianBlur', 'feMerge',
])

// Media and embed elements have no InstUI prop equivalents for fine-grained
// sizing and display control — inline styles are legitimate here.
const MEDIA_TAGS = new Set(['img', 'video', 'audio', 'canvas', 'iframe', 'embed', 'object'])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use InstUI component props (View, Flex, Grid) instead of inline layout styles',
    },
    messages: {
      noStyleLayout:
        'Avoid inline "{{ prop }}" style. Use the equivalent prop on View, Flex, or Grid — these accept InstUI token-aware values.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return
        if (node.value?.type !== 'JSXExpressionContainer') return
        const expr = node.value.expression
        if (expr.type !== 'ObjectExpression') return

        const elementName = node.parent?.name
        const tag = elementName?.type === 'JSXIdentifier' ? elementName.name : null
        if (tag && (SKIP_TAGS.has(tag) || SVG_TAGS.has(tag) || MEDIA_TAGS.has(tag))) return

        for (const prop of expr.properties) {
          if (prop.type !== 'Property') continue
          const propName = prop.key?.name ?? prop.key?.value
          if (LAYOUT_PROPS.has(propName)) {
            context.report({ node: prop, messageId: 'noStyleLayout', data: { prop: propName } })
          }
        }
      },
    }
  },
}

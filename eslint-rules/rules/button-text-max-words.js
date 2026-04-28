/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Button component text must be 4 words or fewer',
    },
    messages: {
      tooManyWords:
        'Button text "{{ text }}" has {{ count }} words. Button labels must be 4 words or fewer.',
    },
  },
  create(context) {
    // Collect all text content under a Button JSX element, then count words.
    function isButtonElement(node) {
      return (
        node.type === 'JSXOpeningElement' &&
        node.name.type === 'JSXIdentifier' &&
        node.name.name === 'Button'
      )
    }

    // Recursively extract plain string content from JSX children.
    function extractText(children) {
      let text = ''
      for (const child of children) {
        if (child.type === 'JSXText') {
          text += child.value
        } else if (child.type === 'JSXExpressionContainer') {
          const expr = child.expression
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            text += expr.value
          } else if (expr.type === 'TemplateLiteral' && expr.quasis.length > 0) {
            // Only count the static parts of template literals.
            text += expr.quasis.map((q) => q.value.cooked ?? '').join(' ')
          }
        } else if (child.type === 'JSXElement' && child.children) {
          text += extractText(child.children)
        }
      }
      return text
    }

    function countWords(str) {
      return str.trim().split(/\s+/).filter(Boolean).length
    }

    return {
      JSXElement(node) {
        if (!isButtonElement(node.openingElement)) return

        const text = extractText(node.children)
        const trimmed = text.trim()
        if (!trimmed) return

        const count = countWords(trimmed)
        if (count > 4) {
          context.report({
            node,
            messageId: 'tooManyWords',
            data: { text: trimmed.replace(/\s+/g, ' '), count },
          })
        }
      },
    }
  },
}

// Native HTML interactive and semantic elements should use their InstUI equivalents,
// which handle theming, accessibility attributes, and design system consistency.
//
// Covered elements and their InstUI replacements:
//   <button>  → <Button> from @instructure/ui-buttons
//   <a>       → <Link> from @instructure/ui-link
//   <h1>–<h6> → <Heading level="h1"> from @instructure/ui-heading

const REPLACEMENTS = {
  button: 'Button',
  a: 'Link',
  h1: 'Heading level="h1"',
  h2: 'Heading level="h2"',
  h3: 'Heading level="h3"',
  h4: 'Heading level="h4"',
  h5: 'Heading level="h5"',
  h6: 'Heading level="h6"',
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use InstUI components instead of bare HTML interactive and semantic elements',
    },
    messages: {
      useInstUI:
        'Use <{{ replacement }}> instead of <{{ tag }}>. The InstUI component handles theming, focus management, and design system consistency.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const tag = node.name.type === 'JSXIdentifier' ? node.name.name : null
        if (!tag) return
        const replacement = REPLACEMENTS[tag]
        if (!replacement) return
        context.report({ node, messageId: 'useInstUI', data: { tag, replacement } })
      },
    }
  },
}

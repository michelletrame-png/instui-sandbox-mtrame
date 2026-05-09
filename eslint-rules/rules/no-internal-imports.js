// @instructure packages expose a public API via the package root or named subpath
// exports (e.g. @instructure/ui-view/latest). Importing from internal build
// artifacts (/src/, /lib/, /es/, /cjs/) couples code to the package's private
// structure and breaks across major versions.
//
// Also blocks @instructure/ui-core, the v5-era legacy package superseded by
// the individual @instructure/ui-* packages in v7+.

const LEGACY_PACKAGES = new Set([
  '@instructure/ui-core',
])

const INTERNAL_PATH_RE = /\/(src|lib|es|cjs)\//

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid importing from deprecated InstUI packages or internal package paths',
    },
    messages: {
      legacyPackage:
        '"{{ source }}" is a legacy InstUI package. Import the equivalent component from @instructure/ui or a current @instructure/ui-* package.',
      internalPath:
        '"{{ source }}" imports from an internal build path. Use the package root or a named subpath export (e.g. @instructure/ui-view/latest) instead.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (typeof source !== 'string' || !source.startsWith('@instructure/')) return

        const packageName = source.split('/').slice(0, 2).join('/')

        if (LEGACY_PACKAGES.has(packageName)) {
          context.report({ node, messageId: 'legacyPackage', data: { source } })
          return
        }

        if (INTERNAL_PATH_RE.test(source)) {
          context.report({ node, messageId: 'internalPath', data: { source } })
        }
      },
    }
  },
}

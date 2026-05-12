# Plan: InstUI Claude Plugin

A drop-in Claude plugin for any project using InstUI that makes the coding agent
code in InstUI correctly — proactively, not just when asked.

---

## Goal

Any InstUI project installs this plugin and gets:
- An agent that looks up real prop types before writing components
- Automatic copy review when TSX files are edited
- ESLint enforcement of InstUI structural rules
- An audit skill that checks any file for token misuse, a11y issues, and copy quality

No sandbox required. No sandbox concepts leak in.

---

## How marketplace repos work

A Claude plugin is a GitHub repository with a `.claude-plugin/plugin.json` manifest at
its root. Consuming projects reference it in their `.claude/settings.json`:

```json
{
  "plugins": [
    {
      "repo": "instructure/instui-claude-plugin",
      "version": "11.7"
    }
  ]
}
```

Claude Code fetches the plugin at the referenced version (git tag or branch) and makes
its skills, agents, and settings available in the session. Skills appear in the skill
list, agents are available as sub-agents, and any settings the plugin declares are
merged into the session context.

Versioning follows the same convention as the npm package — `11.7` alongside
`@instructure/ui@11.7`. When the InstUI team cuts a release, they tag the plugin repo
at the matching version. Consuming projects pin to a version and upgrade on their own
schedule.

This is the distribution model: the plugin lives at a public GitHub URL, projects
reference it by repo + version, and Claude Code handles the rest. No install script,
no copy-paste, no local files to maintain.

### Plugin chaining

As of Claude Code v2.1.110, plugins can declare dependencies on other plugins via the
`dependencies` array in `.claude-plugin/plugin.json`:

```json
{
  "name": "instui-sandbox",
  "version": "1.0",
  "dependencies": [
    {
      "repo": "instructure/instui-claude-plugin",
      "version": "11.7"
    }
  ]
}
```

When a user installs the sandbox plugin, Claude Code automatically installs the instui
plugin as well. A designer runs one command and gets both — they never need to know the
instui plugin exists separately.

The dependency direction is sandbox → instui plugin (the sandbox depends on the instui
plugin, not the other way around). The instui plugin has no knowledge of the sandbox.

The one exception today is **hooks** — hook entries in `settings.json` require a merge
step into the consuming project's own settings and aren't automatically inherited from
the plugin. See open decisions below.

---

## What's in scope

### Skills (prompt bundles)
- `instui-get-component` — looks up real prop types, sizes, colors from installed package
- `instui-get-tokens` — semantic token reference
- `instui-get-icons` — icon search by purpose
- `instui-reference-layout` — layout component patterns
- `instui-reference-tokens` — token usage guidance
- `instui-reference-menus` — menu/dropdown patterns
- `instui-reference-animation` — motion/transition guidance
- `instui-ux-copy` — copy review + write, with Instructure style guide bundled as reference
- `instui-audit` — generalized audit skill (see below)

### Sub-agent
- `design-auditor` — checks token semantics, a11y patterns, copy hygiene in any TSX
  file or directory. Uses `sharedTokens` from `@instructure/emotion` (`useComputedTheme`)
  which is a published InstUI API, not sandbox-specific.

### Hooks
- PostToolUse on `*.tsx` → triggers `instui-ux-copy` review on human-visible strings

### ESLint rules (companion npm package)
- `no-bare-html` — catches raw HTML elements that should be InstUI components
- `no-internal-imports` — enforces public InstUI API surface
- `no-style-layout` — catches inline styles for layout (should use InstUI layout components)

---

## What's out of scope

These stay in the sandbox and are not included:

- `sandbox-eval`, `sandbox-audit`, `sandbox-design`, `sandbox-init`, `sandbox-publish`,
  `sandbox-push`, `sandbox-update` — all sandbox lifecycle
- Spec frame / registry structure checks in the auditor
- `SpecSheet`, `SpecEmbedFrame`, `AgentShell`, `AgentPrompt`, `AgentChip` components

---

## Rewrites required

### `instui-audit` (from `sandbox-audit`)
Small rewrite. Remove the path-resolution logic that reads from `src/registry.ts` and
resolves `src/designs/<id>/index.tsx`. Replace with: accept any file path or directory
as input. Delegate to `design-auditor` unchanged.

### `design-auditor`
Minor rewrite. Remove:
- Spec frame structural checks (frame shape, FrameCtx, registry awareness)
- Any assumption that the audit target is a sandbox prototype

Keep as-is (already general):
- Token semantic checks via `sharedTokens` from `@instructure/emotion`
- A11y checks (screenReaderLabel, interactive element patterns)
- Copy hygiene (placeholder detection, style guide violations)

---

## Plugin structure

```
instui-plugin/
  .claude-plugin/
    plugin.json                      # manifest: name, version, dependencies

  skills/
    instui-get-component/
      SKILL.md
    instui-get-tokens/
      SKILL.md
    instui-get-icons/
      SKILL.md
      references/
        instui-icons-directory.md
        legacy-icons-directory.md
    instui-reference-layout/
      SKILL.md
      references/
        flex-props-full.md
        view-props-full.md
        spacing-tokens.md
        responsive-patterns.md
    instui-reference-tokens/
      SKILL.md
      references/
        semantics-color.md
        shared-tokens.md
    instui-reference-menus/
      SKILL.md
    instui-reference-animation/
      SKILL.md
    instui-ux-copy/
      SKILL.md
      references/
        style-guide.md               # Instructure UX Writing Style Guide
    instui-audit/
      SKILL.md

  agents/
    design-auditor.md

  settings.json                      # PostToolUse hook on *.tsx

  templates/
    CanvasPage.tsx                   # full Canvas-shell page, desktop + mobile
    Blank.tsx                        # minimal starting point

  references/
    code/
      theming.tsx                    # useComputedTheme / sharedTokens patterns
      surfaces.tsx                   # card/surface hierarchy and token pairings
      layout.tsx                     # Flex/View composition
      forms.tsx                      # form patterns

  eslint/                            # source for companion npm package
    no-bare-html.js
    no-internal-imports.js
    no-style-layout.js
```

---

## Templates vs. reference code

Both live in the plugin but serve different purposes.

**Templates** (`templates/`) are full working page structures the agent scaffolds a new
page from. `CanvasPage.tsx` is the canonical example — correct `sharedTokens` pairings,
correct heading variants (`titlePageDesktop`, `titleCardLarge`), responsive mobile/desktop
split, correct `SideNavBar` usage. When an engineer starts a new page, the agent reads
the relevant template and uses it as a starting point.

**Reference code** (`references/code/`) is smaller and more targeted — focused snippets
for specific patterns: how to pair tokens on a surface, how to compose a form, how to
use `useComputedTheme`. These are what the agent consults when writing a specific
pattern inside an existing page, not when scaffolding from scratch.

Both are owned and versioned by the InstUI team. When they add a new page shell or
document a new stable pattern, it goes here. Scope reference code to **stable patterns**
(token usage, surface hierarchy, theming) rather than frequently-changing component
prop usage, which would mislead the agent if stale.

---

## Ownership model

The plugin is maintained by the **InstUI team**, not the sandbox.

- When InstUI ships a new version, the team updates reference code, templates, component
  skills, and ESLint rules as part of that release
- Consuming projects pin to a plugin version the same way they pin to an InstUI package
  version — `instui-plugin@11.7` alongside `@instructure/ui@11.7`
- This sandbox's responsibility: reference the plugin by version, build design workflow
  tooling on top of it, never track InstUI API changes directly

This keeps the sandbox focused on design workflows (prototyping, specs, handoff) and
offloads InstUI correctness maintenance to the team that owns the source of truth.

---

## Open decisions

**1. Hook delivery**
Hooks aren't automatically inherited from the plugin today — they require a merge into
the consuming project's `.claude/settings.json`. Options:
- Ship an install skill (`/instui-plugin-install`) that writes hook entries on first use
- Document manual addition in PLUGIN.md
- Wait for native plugin hook inheritance in Claude Code

**2. ESLint packaging**
Publish as `@instructure/eslint-plugin-instui` npm package, or bundle the rule files
inside the plugin directory and document manual eslint config wiring. npm package is
cleaner for consuming projects but adds a publishing step to the InstUI release process.

**3. Plugin config for InstUI version**
The `instui-get-component` skill reads from the installed npm package — no config
needed. But if we want to enforce a minimum version or document compatibility, add an
`instui-plugin-config.md` to the consuming project.

---

## Relationship to sandbox

The sandbox depends on the plugin, not the other way around.

- Sandbox references the plugin in `.claude/settings.json` and gets all quality
  enforcement for free
- `sandbox-audit` delegates its InstUI checks to the plugin's `design-auditor`
- Sandbox-specific checks (frame structure, registry) live only in sandbox skills

This keeps the dependency direction clean and lets the plugin evolve independently.

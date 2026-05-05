# InstUI Prototypes — Agent Guide

This is a prototyping sandbox for building UI concepts with **Instructure UI (InstUI) v11**, using its modern token-based theming system. The purpose of this repo is to let designers and developers rapidly prototype Canvas LMS UI ideas as working React components, guided by automated conventions so the output is always idiomatic InstUI.

---

## What this environment provides

### 1. Reference code

`src/references/` contains fully-built example pages that demonstrate correct patterns at scale:

- **`canvas-page/`** — Full Canvas LMS page layout: SideNavBar, breadcrumb, page header, tabs, cards, responsive mobile layout with a tray-based nav drawer.
- **`kitchen-sink/`** — Dense component showcase with a custom sidebar, demonstrating a wide range of InstUI components wired up to the theming system.

These are not prototypes — they are **authoritative examples**. When in doubt about how to structure a layout or wire up theming, read these first.

### 2. Skills

`/.claude/skills/` contains agent skills that are loaded automatically by Claude Code. Each skill documents a specific domain of InstUI usage:

| Skill | Description |
|---|---|
| `instui-tokens` | Token hierarchy, `useComputedTheme()`, `sharedTokens` reference, `themeOverride` patterns |
| `instui-layout` | `View`, `Flex`, `Grid` — spacing tokens, layout patterns, anti-patterns |
| `instui-icons` | `*InstUIIcon` system — props, color tokens, size tokens, color inheritance rules |
| `instui-animation` | `Transition` component, animation types, `DrawerLayout` push panels, theme timing tokens |
| `get-tokens` | Dynamically look up available keys and values for any token layer (sharedTokens, semantics, components, primitives) |
| `get-component` | Look up available props, sizes, colors, and configurations for any InstUI component |
| `get-icons` | Search for the right icon by keyword — finds matching `*InstUIIcon` names from Lucide and custom sets |
| `send-to-paper` | Translate an InstUI React prototype into a Paper MCP design — token resolution, font mapping, component CSS, icon SVG extraction, Paper layout rules |
| `send-to-pencil` | Translate an InstUI React prototype into a Pencil MCP design (.pen file) — token → hex resolution, Lucide icon mapping, gradient direction, cross-batch ID management, component → .pen schema |
| `send-to-figma` | Translate an InstUI React prototype into a Figma design — maps `sharedTokens.*` to Figma variables, InstUI text scales to Figma text styles, and InstUI components to components from the **InstUI Component Library - Beta** |
| `sandbox-init` | How to check the environment and start the dev server |
| `sandbox-prototypes` | Create and delete prototypes; picks the right template |
| `deploy` | Fork setup, GitHub Pages configuration, upstream sync, and static prototype exports with fixed shareable URLs |

Skills are the agent's primary reference for InstUI API decisions. They encode hard-won knowledge about non-obvious behavior — icon color inheritance, `Flex.Item` overflow clipping, `background` + `themeOverride` wiring — that isn't obvious from the InstUI docs alone.

### 3. ESLint rules

`eslint-rules/` is a local ESLint plugin (`instui/`) with rules that catch common InstUI mistakes at write time:

- **`instui/no-hardcoded-hex`** — warns when a hardcoded hex color appears in a `style` prop. Use `sharedTokens` instead.
- **`instui/view-background-needs-override`** — warns when `<View background="primary">` or `<View background="secondary">` is used without a `themeOverride`. Without it, the background will be the wrong color in non-default themes.
- **`instui/no-theme-name-detection`** — warns when code branches on a theme name string (e.g. `isDark ? '#hex' : '#hex'`). Use `useComputedTheme()` tokens instead.

These fire as **warnings**, not errors. They are guidance for authors, not hard blockers.

---

## How prototypes work

Each prototype lives in its own directory under `src/prototypes/<name>/` and exports a default React component with this signature:

```tsx
export default function MyPrototype({ isDark, onToggleTheme }: PrototypeProps) { ... }
```

Items are registered in `src/registry.ts` with two separate fields:

- **`category`** — determines which home page tab the item appears in: `'Spec'` | `'Prototype'` | `'Template'` | `'Reference'`
- **`status`** — optional, only applies to Specs and Prototypes: `'WIP'` | `'In Review'` | `'Complete'` | `'Archived'`

```ts
{
  id: 'my-prototype',
  title: 'My Prototype',
  path: '/my-prototype',
  createdAt: '2026-04-28',
  category: 'Prototype',
  status: 'WIP',
  component: lazy(() => import('./prototypes/my-prototype')),
}
```

Templates and References omit `status`. Source files for each category live in their own directory:

| Category | Source directory |
|---|---|
| `Spec` / `Prototype` | `src/prototypes/<id>/` |
| `Template` | `src/templates/` |
| `Reference` | `src/references/<id>/` |

An optional **`viewMode`** field controls how the framework presents the component at runtime:

- `'spec'` — the framework wraps the component in `InfiniteCanvas` (pan/zoom canvas with nav bar, back button to `/`, and theme toggle). The component only needs to return `SpecSheet` content — no InfiniteCanvas import required. `Spec` entries default to this if `viewMode` is omitted.
- `'prototype'` — the component renders as-is, responsible for its own full-page layout. All other categories default to this.

The app handles routing, theme switching, and lazy loading automatically. A prototype only needs to render its own UI — it receives `isDark` and `onToggleTheme` as props.

---

## Theming conventions

All prototypes must use InstUI's token system — no hardcoded colors, no raw hex values in JSX.

The canonical pattern for a page root:

```tsx
const { sharedTokens } = useComputedTheme()

<View
  as="div"
  minHeight="100vh"
  display="block"
  background="secondary"
  themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
>
```

And for a card surface:

```tsx
<View
  background="primary"
  themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
  borderRadius={sharedTokens.borderRadius.card.md}
  shadow="resting"
  padding="medium"
>
```

`background="primary"` without `themeOverride` is a lint warning and will produce wrong colors in dark/rebrand themes. Always pair them.

---

## UX Writing

`/.claude/skills/` includes two UX writing skills backed by the Instructure style guide at `.claude/skills/ux-writing/references/style-guide.md`.

| Skill | When to use |
|---|---|
| `uxcopy-check` | Reviewing or auditing existing copy — errors, labels, tooltips, empty states |
| `uxcopy-write` | Generating new copy for a UI pattern; accepts a Figma URL or plain description |

The PostToolUse hook detects human-visible strings in prototype TSX files and reminds you to invoke `uxcopy-check` when it fires. Wait for that prompt — do not invoke `uxcopy-check` proactively. Invoke `sandbox-eval` only when the user explicitly asks for a session quality report.

All AI-generated copy must be reviewed by a human writer before shipping to production.

---

## Adding a new prototype

1. Create `src/prototypes/<name>/index.tsx` — export a default component with `PrototypeProps`
2. Add an entry to `src/registry.ts`
3. The route, home page listing, and lazy loading are handled automatically

Use `src/prototypes/hello-world/index.tsx` as the minimal starting template.

---

## Agent process guidelines

### Spec frame files: flat and in sync

**One frame per file. One code export per file. The code string must match the rendered content exactly.**

Frame files (under `src/designs/<name>/frames/` or `src/prototypes/<name>/frames/`) follow three invariants:

1. **Flat JSX only** — no custom sub-components inside a frame function. Only InstUI components used as components. The sole exception is a component with `useState` (e.g. a toggling panel), which must live in its own file with `/* eslint-disable react-refresh/only-export-components */`.

2. **One frame per file** — each file exports exactly one frame function and its companion `*Code` string. Bundling multiple frames in one file makes it easy for the code export and the render to drift apart.

3. **Code export = rendered content** — the `code` string exported alongside a frame must be a faithful JSX representation of what the frame function renders. Same props, same structure, same copy, same animation wrappers. When you modify a frame, always update its `code` export in the same edit. The "InstUI Source" button in the spec viewer shows this string to engineers — silent drift between the preview and the source handoff is the failure mode to prevent.

When auditing or reviewing frame files: read both the function body and its `*Code` export and confirm they match. Do not skip the sync check.

---

### Atomic multi-location edits

When adding a prop to a component, **always update the signature, its usage inside the component, and all call sites in a single edit.** The PostToolUse TypeScript hook runs after every edit — an intermediate state where a prop is declared but not passed at the call site will produce type errors that block the next edit.

Example: adding `isMobile: boolean` to a component requires three changes in one pass:
1. The function signature: `{ isMobile, sharedTokens }`
2. The prop used inside the function body
3. Every call site: `<MyComponent isMobile={isMobile} ... />`

If the call site is far from the component definition, use Grep to locate it before editing so all three changes land in one shot.

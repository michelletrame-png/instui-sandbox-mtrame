# InstUI Prototypes — Agent Guide

Prototyping sandbox for Canvas LMS UI concepts using **Instructure UI (InstUI) v11** with token-based theming.

---

## Reference code

`src/references/` contains authoritative canonical examples — read these when in doubt about layout or theming patterns. **Do not use `src/designs/` as a pattern reference;** those are user prototypes with variable quality.

## Skills

`/.claude/skills/` contains agent skills loaded on demand by Claude Code. They are the primary authority for InstUI decisions — theming, tokens, layout, icons, component APIs, and more. Invoke the relevant skill before writing any component or token usage for the first time in a session.

## ESLint rules

`eslint-rules/` enforces three common InstUI mistakes as warnings:

- `instui/no-hardcoded-hex` — use `sharedTokens` instead of hex values in `style` props
- `instui/view-background-needs-override` — `<View background="primary/secondary">` must include a matching `themeOverride`
- `instui/no-theme-name-detection` — use `useComputedTheme()` tokens instead of branching on theme name strings

---

## How prototypes work

Each prototype lives in `src/designs/<name>/` and exports a default component:

```tsx
export default function MyPrototype({ isDark, onToggleTheme }: PrototypeProps) { ... }
```

Register it in `src/registry.ts`:

```ts
{
  id: 'my-prototype',
  title: 'My Prototype',
  path: '/my-prototype',
  createdAt: '2026-04-28',
  category: 'Prototype',
  status: 'WIP',
  component: lazy(() => import('./designs/my-prototype')),
}
```

| Category | Source directory | `status` |
|---|---|---|
| `Spec` / `Prototype` | `src/designs/<id>/` | Required |
| `Template` | `src/templates/` | Omit |
| `Reference` | `src/references/<id>/` | Omit |

`viewMode: 'spec'` wraps the component in InfiniteCanvas (pan/zoom). All other categories default to `'prototype'` (full-page, self-contained layout). The app handles routing, theme switching, and lazy loading. Use `src/designs/hello-world/index.tsx` as the minimal starting template.

---

## Theming

No hardcoded colors or raw hex values in JSX. All colors come from `useComputedTheme()` tokens. See `instui-reference-tokens` for canonical patterns including View backgrounds and `themeOverride` wiring.

## UX Writing

The PostToolUse hook detects human-visible strings in prototype TSX files and triggers `instui-ux-copy` in Review mode automatically. Do not invoke `instui-ux-copy` proactively — wait for the hook prompt.

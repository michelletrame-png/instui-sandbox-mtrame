---
name: instui-reference-icons
description: >
  Authoritative guide for using icons in Instructure UI (InstUI) v11.7.2.
  Invoke this skill when working with any icon components from @instructure/ui-icons,
  choosing between legacy Icon* and new *InstUIIcon systems, setting icon color or size,
  handling accessible icon labels, building icon buttons, or understanding why CSS color
  on a parent element does not affect icon fill. The two icon systems have different
  naming conventions, size tokens, and color tokens — do not mix them up.
---

# Instructure UI Icons Skill

> Quick-nav: [Two Icon Systems](#two-icon-systems) · [Import](#import) · [Props Reference](#props-reference) · [Color Tokens](#color-tokens) · [Size Tokens](#size-tokens) · [Accessibility](#accessibility) · [IconPropsProvider](#iconpropsprovider) · [Anti-Patterns](#anti-patterns)

> Directories: [InstUIIcon directory (1935)](references/instui-icons-directory.md)

---

## Preference Rule

**Always prefer `*InstUIIcon` (Lucide-based) over legacy `Icon*` for new work.** The only exception is Canvas-branded icons (`IconCanvasLogoSolid`, `IconCanvasLogoLine`) and other InstUI-specific glyphs that have no `*InstUIIcon` equivalent — check the [legacy directory](references/legacy-icons-directory.md) if you need a Canvas LMS-specific icon.

```tsx
// Preferred
import { SettingsInstUIIcon } from '@instructure/ui-icons'

// Legacy — only use when no *InstUIIcon equivalent exists
import { IconSettingsSolid } from '@instructure/ui-icons'
```

Before using a legacy icon, search the [InstUIIcon directory](references/instui-icons-directory.md) for an equivalent. The naming maps roughly: `IconSettingsSolid` → `SettingsInstUIIcon`, `IconTrashLine` → `TrashInstUIIcon` (Lucide names sometimes differ — always verify in the directory).

---

## Two Icon Systems

`@instructure/ui-icons` ships two distinct icon families. **Use `*InstUIIcon` for new work** — they are Lucide-based, support semantic size tokens, and auto-scale stroke width.

Use `*InstUIIcon` for all new work. The only exception is Canvas-branded glyphs (`IconCanvasLogoSolid`, `IconCanvasLogoLine`) and Instructure/Mastery product icons that have no `*InstUIIcon` equivalent.

---

## Import

All icons come from the same package:

```tsx
// New-style (preferred for new work)
import { SettingsInstUIIcon, LayoutDashboardInstUIIcon } from '@instructure/ui-icons'

// Legacy (for Canvas-brand icons like the Canvas logo)
import { IconCanvasLogoSolid, IconCanvasLogoLine } from '@instructure/ui-icons'

// Context provider (for setting icon defaults across a subtree)
import { IconPropsProvider } from '@instructure/ui-icons'
```

---

## Props Reference

Both systems share the same core props (from `SVGIconProps`):

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | See [Color Tokens](#color-tokens) | `undefined` (inherits theme default) | Semantic color token |
| `size` | See [Size Tokens](#size-tokens) | `undefined` | Semantic size token |
| `rotate` | `'0' \| '90' \| '180' \| '270'` | `'0'` | Clockwise rotation |
| `bidirectional` | `boolean` | `true` | Flips horizontally in RTL layouts |
| `inline` | `boolean` | `true` | `display: inline-block` vs `block` |
| `title` | `string` | — | Adds `aria-label` + `role="img"` — use for standalone meaningful icons |
| `elementRef` | `(el: Element \| null) => void` | — | Ref callback |

---

## Color Tokens

**Critical:** InstUI icons use emotion-based theming internally. Setting CSS `color` on a parent element does **not** affect icon fill. Color must be passed as a prop directly.

Two tokens apply to icons on colored surfaces — choose based on context:

- `color="inverseColor"` — icon sits on a **brand/selection** surface (e.g. selected nav item, logo container with `brandColor` background)
- `color="onColor"` — icon sits **on** a colored gradient or themed surface (e.g. the AI gradient header, any surface using `aiTopGradientColor`/`aiBottomGradientColor`)

For legacy `IconCanvasLogoSolid`, use `color="primary-inverse"` (the legacy token it accepts).

```tsx
// Selected nav item — brand background
<LayoutDashboardInstUIIcon color="inverseColor" />

// AI gradient header — themed surface
<IgniteaiLogoInstUIIcon color="onColor" />

// Legacy Canvas logo on dark background
<IconCanvasLogoSolid color="primary-inverse" />

// Wrong — CSS color prop is ignored by icon's emotion styles
<span style={{ color: 'white' }}><SettingsInstUIIcon /></span>
```

### Injecting color onto icon elements passed as ReactNode

When an icon is passed as a `ReactNode` prop and you need to apply a color based on context (e.g. a selected nav item), use `cloneElement`. Use `inverseColor` for `*InstUIIcon`; use `primary-inverse` only for legacy `Icon*` components.

```tsx
import { isValidElement, cloneElement } from 'react'

const coloredIcon = isSelected && isValidElement(icon)
  ? cloneElement(icon as React.ReactElement<{ color?: string }>, { color: 'inverseColor' })
  : icon
```

---

## Size Tokens

| Token | Size |
|---|---|
| `'xs'` | 0.75rem (12px) |
| `'sm'` | 1rem (16px) |
| `'md'` | 1.25rem (20px) |
| `'lg'` | 1.5rem (24px) |
| `'xl'` | 2rem (32px) |
| `'2xl'` | 2.25rem (36px) |
| `'illu-sm'` | 3rem (48px) |
| `'illu-md'` | 5rem (80px) |
| `'illu-lg'` | 10rem (160px) |

No `size` prop → icon renders at whatever its container/context sets via CSS font-size.

---

## Accessibility

Icons are **decorative by default** — rendered with `aria-hidden="true" role="presentation"`. No additional markup needed when the icon is paired with visible text.

For **standalone meaningful icons** (no accompanying label), add `title`:

```tsx
// Decorative (paired with text label) — no title needed
<Button renderIcon={<SettingsInstUIIcon />}>Settings</Button>

// Standalone meaningful icon — needs title
<SettingsInstUIIcon title="Open settings" />

// Icon button — use screenReaderLabel on IconButton, not title on the icon
<IconButton screenReaderLabel="Open settings">
  <SettingsInstUIIcon />
</IconButton>
```

---

## `IconPropsProvider`

Sets default `size` and `color` for all `*InstUIIcon` descendants in a subtree. Useful for icon lists, nav items, or any component that renders many icons at the same size/color:

```tsx
import { IconPropsProvider } from '@instructure/ui-icons'

// All InstUIIcons inside inherit size="sm" and color="primary"
<IconPropsProvider size="sm" color="primary">
  <SettingsInstUIIcon />
  <LayoutDashboardInstUIIcon />
  <BookOpenInstUIIcon />
</IconPropsProvider>
```

Individual icon props override the context:

```tsx
<IconPropsProvider size="sm" color="primary">
  <SettingsInstUIIcon />                        // size="sm", color="primary"
  <LayoutDashboardInstUIIcon color="primary-inverse" />  // size="sm", color overridden
</IconPropsProvider>
```

---

## Common Icon Names

A selection of commonly used icons in this project:

### Navigation
`LayoutDashboardInstUIIcon` · `BookOpenInstUIIcon` · `CalendarDaysInstUIIcon` · `InboxInstUIIcon` · `CircleHelpInstUIIcon` · `SettingsInstUIIcon`

### Actions
`PlusInstUIIcon` · `XInstUIIcon` · `AlignJustifyInstUIIcon` · `EllipsisVerticalInstUIIcon` · `ChevronRightInstUIIcon` · `Share2InstUIIcon` · `UploadInstUIIcon` · `ClockInstUIIcon`

### Status / UI
`CircleUserInstUIIcon` · `SunInstUIIcon` · `MoonInstUIIcon`

### AI
`IgniteaiLogoInstUIIcon`

### Canvas brand (legacy)
`IconCanvasLogoSolid` · `IconCanvasLogoLine`

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| `<span style={{ color: 'white' }}><SettingsInstUIIcon /></span>` | Pass `color="inverseColor"` directly as a prop |
| `<SettingsInstUIIcon color="white" />` | Use semantic token: `color="inverseColor"` |
| `<SettingsInstUIIcon color="primary-inverse" />` | `primary-inverse` is a legacy token — use `color="inverseColor"` on `*InstUIIcon` |
| Mix `*InstUIIcon` size tokens with legacy `Icon*` (e.g. `size="xs"` on `IconSettingsSolid`) | Check which system the icon belongs to |
| Use `title` prop on icons inside `<IconButton>` | Use `screenReaderLabel` on `IconButton` instead |
| Add `aria-hidden` manually | It's applied automatically when `title` is absent |
| `import { SettingsInstUIIcon } from 'lucide-react'` | Always import from `@instructure/ui-icons` — the wrapper applies InstUI theming |

---
name: instui-theming
description: >
  Authoritative guide for theming in Instructure UI (InstUI) v11.x.
  Invoke this skill whenever working with InstUISettingsProvider, theme tokens,
  component themeOverride props, custom themes, dark/high-contrast mode, or any
  question about how colors, spacing tokens, or component styles are controlled
  in an InstUI codebase. InstUI theming diverges significantly from plain CSS
  variables or MUI/Chakra theming patterns — do NOT default to CSS custom
  properties or className overrides without checking this skill first.
---

# Instructure UI Theming Skill

> Quick-nav: [Mental Model](#mental-model) · [Provider Setup](#provider-setup) · [Available Themes](#available-themes) · [Token Hierarchy](#token-hierarchy) · [themeOverride Prop](#themeoverride-prop) · [Custom Themes](#custom-themes) · [Merge Logic](#merge-logic) · [withStyle HOC](#withstyle-hoc) · [Anti-Patterns](#anti-patterns)

---

## Mental Model

InstUI theming is **provider-based, token-driven, and emotion.js-powered**. The core shift from conventional CSS theming:

| Conventional CSS | InstUI |
|---|---|
| CSS custom properties (`--color-brand`) | Token objects accessed via theme context |
| `className` overrides or `style={{}}` | `themeOverride` prop on each component |
| Theme via CSS file swap | `InstUISettingsProvider` wraps the tree |
| One global stylesheet | Per-component styles computed by `withStyle` HOC |
| Raw hex values in JSX | Semantic token paths (`theme.colors.backgroundBrand`) |

**Never use** inline `style={{ color: '#0770A3' }}` or CSS overrides to change component appearance when `themeOverride` or a theme token exists for it.

---

## Provider Setup

Wrap your app (or any subtree) with `InstUISettingsProvider` from `@instructure/emotion`:

```tsx
import { canvas } from '@instructure/ui-themes'
import { InstUISettingsProvider } from '@instructure/emotion'

function App() {
  return (
    <InstUISettingsProvider theme={canvas}>
      {/* all InstUI components here are themed */}
    </InstUISettingsProvider>
  )
}
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `theme` | `ThemeOrOverride` | Full theme object, partial override, or `(ancestorTheme) => override` function |
| `dir` | `'ltr' \| 'rtl'` | Text direction for bidirectional layout support |

If no `theme` is provided, defaults to `canvas`.

**Import path:**
```tsx
import { InstUISettingsProvider } from '@instructure/emotion'
// or
import { InstUISettingsProvider } from '@instructure/ui/v11_7'
```

---

## Available Themes

All exported from `@instructure/ui-themes`:

| Import | Key | Description |
|---|---|---|
| `canvas` | `'canvas'` | Default theme, WCAG 2.1 AA compliant |
| `canvasHighContrast` | `'canvas-high-contrast'` | Enhanced contrast for accessibility |
| `light` | `'light'` | Newer rebrand light theme |
| `dark` | `'dark'` | Newer rebrand dark theme |

```tsx
import { canvas, canvasHighContrast, light, dark } from '@instructure/ui-themes'
```

**Switching themes at runtime:**

```tsx
const [theme, setTheme] = useState(canvas)

<InstUISettingsProvider theme={theme}>
  <Button onClick={() => setTheme(canvasHighContrast)}>High Contrast</Button>
</InstUISettingsProvider>
```

---

## Token Hierarchy

Every theme has three levels of tokens, from most general to most specific:

### Level 1: SharedTokens (same across all themes)

Accessed via `theme.newTheme.sharedTokens`. These never vary by theme.

```ts
sharedTokens.spacing.general.spaceSm        // "0.5rem"
sharedTokens.spacing.general.spaceMd        // "1rem"
sharedTokens.borderRadius.md               // "0.25rem"
sharedTokens.borderRadius.full             // "9999px"
sharedTokens.boxShadow.elevation1["0"]     // { color, x, y, blur, spread }
sharedTokens.boxShadow.elevation2["0"]     // elevated cards/modals
sharedTokens.focusOutline.width            // focus ring thickness
sharedTokens.focusOutline.offset           // focus ring offset
```

### Level 2: Semantic tokens (theme-specific)

Accessed via `theme.newTheme.semantics` (**not** `theme.semantics` — that path doesn't exist). These change between `canvas`, `dark`, etc.

```ts
// Hierarchical path: category → context → state
theme.newTheme.semantics.color.background.interactive.action.primary.base
theme.newTheme.semantics.color.background.interactive.action.primary.hover
theme.newTheme.semantics.color.background.interactive.action.primary.active
theme.newTheme.semantics.color.background.interactive.action.primary.disabled
theme.newTheme.semantics.color.text.interactive.action.primary.hover
theme.newTheme.semantics.color.stroke.interactive.action.secondary.disabled
```

#### Key semantic token: page background

```ts
theme.newTheme.semantics.color.background.page
```

| Theme | Value |
|---|---|
| `canvas` | `#ffffff` |
| `canvasHighContrast` | `#ffffff` |
| `light` | `#F2F4F5` |
| `dark` | `#1C222B` |

**This token has no equivalent `background` prop value on `View`** — the component token `backgroundPrimary` and `backgroundSecondary` do not map to it consistently across all themes. See the [Page Background Pattern](#page-background-pattern) below for how to apply it.

### Level 3: Component tokens (per-component, theme-specific)

Accessed via `theme.newTheme.components['ComponentId']`. These are what `themeOverride` maps to.

```ts
// Example: BaseButton tokens
theme.newTheme.components['BaseButton'].primaryBackground
theme.newTheme.components['BaseButton'].primaryHoverBackground
theme.newTheme.components['BaseButton'].primaryColor
theme.newTheme.components['BaseButton'].secondaryBackground
theme.newTheme.components['BaseButton'].secondaryDisabledTextColor
```

### Legacy BaseTheme tokens (still widely used)

The top-level `BaseTheme` properties are still the primary way to access design tokens in most components:

```ts
theme.colors.backgroundBrand        // primary brand background
theme.colors.backgroundDanger       // danger/error background
theme.colors.textBrand              // brand text color
theme.colors.textDanger             // danger text color
theme.spacing.medium                // "1rem"
theme.spacing.large                 // "1.5rem"
theme.typography.fontSizeSmall      // "0.875rem"
theme.typography.fontSizeMedium     // "1rem"
theme.borders.radiusMedium          // border radius token
theme.shadows.depth2                // box shadow value
```

---

## `themeOverride` Prop

Any component built with `withStyle` (which is all InstUI components) accepts `themeOverride`. This is the primary way to customize individual component instances.

### Object form — static overrides:

```tsx
<Button themeOverride={{ primaryBackground: '#c00', primaryColor: '#fff' }} />

<Alert themeOverride={{ warningIconBackground: '#fff3cd' }} />

<TextInput themeOverride={{ borderColor: '#0770A3' }} />
```

### Function form — computed from context:

Receives `(componentTheme, currentTheme)` — use this when the override should reference other theme tokens:

```tsx
<Button
  themeOverride={(componentTheme, currentTheme) => ({
    primaryBackground: currentTheme.colors.backgroundBrand,
    primaryHoverBackground: componentTheme.primaryBackground,  // relative to itself
  })}
/>
```

### Priority order (highest wins):

1. Component `themeOverride` prop
2. Global component overrides via provider's `componentOverrides`
3. Base component theme from `theme.newTheme.components[id]`

### Finding component token names:

Token names are specific to each component. To discover them, look at the component's type definition or source:

```bash
# Find available tokens for a component, e.g. Button:
grep -r "primaryBackground\|primaryColor\|hoverBackground" \
  node_modules/@instructure/ui-buttons/es/BaseButton/theme.js
```

Or check `theme.newTheme.components['BaseButton']` at runtime to see all keys.

---

## Custom Themes

### Method 1: Partial override object (deep-merged with `canvas`)

```tsx
<InstUISettingsProvider theme={{
  colors: {
    backgroundBrand: '#bf2109',
    textBrand: '#bf2109',
  }
}}>
  <App />
</InstUISettingsProvider>
```

### Method 2: Spread an existing theme and override specific values

```tsx
import { canvas } from '@instructure/ui-themes'

const brandedTheme = {
  ...canvas,
  colors: {
    ...canvas.colors,
    contrasts: {
      ...canvas.colors.contrasts,
      blue4570: '#0044aa',
    },
  },
}

<InstUISettingsProvider theme={brandedTheme}>
  <App />
</InstUISettingsProvider>
```

### Method 3: Function form (receives ancestor theme)

```tsx
<InstUISettingsProvider theme={(base) => ({
  ...base,
  colors: {
    ...base.colors,
    backgroundBrand: '#c00',
  },
})}>
  <App />
</InstUISettingsProvider>
```

### Nesting providers

Providers can be nested — inner provider inherits and overrides the outer:

```tsx
<InstUISettingsProvider theme={canvas}>
  <App />
  <InstUISettingsProvider theme={{ colors: { backgroundBrand: '#c00' } }}>
    {/* This subtree has canvas + brand color override */}
    <BrandedSection />
  </InstUISettingsProvider>
</InstUISettingsProvider>
```

---

## Merge Logic

From `@instructure/emotion/src/getTheme.ts`:

1. No ancestor in context → defaults to `canvas`
2. `theme` is a function → called with ancestor: `theme(ancestorTheme)`
3. Result has all required `BaseTheme` keys → used as-is (full theme replacement)
4. Otherwise → **deep merged** (`mergeDeep`) on top of the ancestor

This means partial objects only override what you specify — everything else falls through from the ancestor theme.

---

## `withStyle` HOC

This is the internal mechanism that makes all InstUI components theme-aware. You'll encounter it if you're building custom components that should integrate with the theme system.

```ts
import { withStyle } from '@instructure/emotion'

// generateStyles receives: (componentTheme, props, sharedTokens, extraArgs?)
const generateStyles = (componentTheme, props, sharedTokens) => ({
  root: {
    backgroundColor: componentTheme.background,
    padding: sharedTokens.spacing.general.spaceMd,
    borderRadius: sharedTokens.borderRadius.md,
  },
  label: {
    color: componentTheme.color,
    fontSize: '1rem',
  },
})

// Component receives: styles, makeStyles, themeOverride
function MyComponent({ styles, makeStyles, children }) {
  return <div css={styles.root}>{children}</div>
}

export default withStyle(generateStyles)(MyComponent)
```

The wrapped component receives:
- `styles` — computed CSS-in-JS object from `generateStyles`
- `makeStyles` — call to recompute styles (pass in lifecycle methods if props change)
- `themeOverride` — forwarded into theme computation automatically

---

## Page Background Pattern

`theme.newTheme.semantics.color.background.page` is the correct token for the page/canvas background, but there is no View `background` prop that maps to it across all four themes. Apply it at the app-root level where the theme object is already in scope:

```tsx
// App.tsx — theme object is already available, no useTheme() needed
const currentTheme = THEMES[themeKey].theme
const pageBackground = (currentTheme as any).newTheme?.semantics?.color?.background?.page ?? '#ffffff'

return (
  <InstUISettingsProvider theme={currentTheme}>
    <div style={{ backgroundColor: pageBackground, minHeight: '100vh' }}>
      <YourApp />
    </div>
  </InstUISettingsProvider>
)
```

If you need to read it inside a component that doesn't have the theme in scope, use `useTheme()`:

```tsx
import { useTheme } from '@instructure/emotion'

function PageWrapper({ children }) {
  const theme = useTheme() as any
  const pageBackground = theme.newTheme?.semantics?.color?.background?.page
  return <div style={{ backgroundColor: pageBackground }}>{children}</div>
}
```

**Why not `themeOverride` on View?** The View component's `backgroundPrimary` and `backgroundSecondary` component tokens don't align with `semantics.color.background.page` in all themes:

| Theme | backgroundPrimary | backgroundSecondary | semantics.page |
|---|---|---|---|
| canvas | `#ffffff` | `#F2F4F5` | `#ffffff` |
| canvasHighContrast | `#ffffff` | `#F2F4F5` | `#ffffff` |
| light | `#ffffff` | `#F2F4F5` | **`#F2F4F5`** |
| dark | `#273540` | `#273540` | **`#1C222B`** |

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| `style={{ color: '#0770A3' }}` on InstUI components | `themeOverride={{ primaryColor: '#0770A3' }}` |
| CSS class overrides targeting InstUI internals | `themeOverride` prop |
| Hardcoding hex values that match theme colors | Reference `currentTheme.colors.*` in `themeOverride` function |
| Creating a new theme from scratch | Spread an existing theme and override specifics |
| Wrapping each component separately with a provider | Nest a single provider around a subtree |
| Modifying `node_modules/@instructure/ui-themes` | Custom theme objects passed to provider |
| Using `!important` in CSS to override component styles | Proper `themeOverride` prop or provider-level `componentOverrides` |

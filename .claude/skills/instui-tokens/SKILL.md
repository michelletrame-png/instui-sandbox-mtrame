---
name: instui-tokens
description: >
  Authoritative guide for theming and tokens in Instructure UI (InstUI) v11.7.2.
  Invoke this skill whenever working with InstUISettingsProvider, theme tokens,
  useComputedTheme, component themeOverride props, custom themes, dark/high-contrast
  mode, or any question about how colors, spacing, border radius, or component styles
  are controlled in an InstUI codebase. InstUI theming diverges significantly from
  plain CSS variables or MUI/Chakra theming patterns — do NOT default to CSS custom
  properties or className overrides without checking this skill first.
---

# Instructure UI Tokens & Theming Skill

> Quick-nav: [Mental Model](#mental-model) · [Provider Setup](#provider-setup) · [Available Themes](#available-themes) · [Token Hierarchy](#token-hierarchy) · [useComputedTheme](#usecomputedtheme) · [sharedTokens Reference](#sharedtokens-reference) · [themeOverride Prop](#themeoverride-prop) · [Custom Themes](#custom-themes) · [Anti-Patterns](#anti-patterns)

---

## Mental Model

InstUI theming is **provider-based, token-driven, and emotion.js-powered**. The core shift from conventional CSS theming:

| Conventional CSS | InstUI |
|---|---|
| CSS custom properties (`--color-brand`) | Token objects accessed via `useComputedTheme()` |
| `className` overrides or `style={{}}` | `themeOverride` prop on each component |
| Theme via CSS file swap | `InstUISettingsProvider` wraps the tree |
| One global stylesheet | Per-component styles computed at render time |
| Raw hex values in JSX | Token paths (`sharedTokens.stroke.mutedColor`) |

**Never use** inline `style={{ color: '#hex' }}` or detect the current theme by name to pick hardcoded values. `useComputedTheme()` gives you the right token value for the active theme automatically.

---

## Provider Setup

Wrap your app (or any subtree) with `InstUISettingsProvider` from `@instructure/ui/latest`:

```tsx
import { canvas } from '@instructure/ui-themes'
import { InstUISettingsProvider } from '@instructure/ui/latest'

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

---

## Available Themes

All exported from `@instructure/ui-themes`:

| Import | Description |
|---|---|
| `canvas` | Default Canvas LMS theme |
| `canvasHighContrast` | High contrast accessibility theme |
| `light` | Rebrand light theme |
| `dark` | Rebrand dark theme |

```tsx
import { canvas, canvasHighContrast, light, dark } from '@instructure/ui-themes'
```

**Switching themes at runtime:**

```tsx
const [theme, setTheme] = useState(light)

<InstUISettingsProvider theme={theme}>
  <Button onClick={() => setTheme(dark)}>Dark Mode</Button>
</InstUISettingsProvider>
```

---

## Token Hierarchy

Every theme resolves three layers of tokens. Each layer depends on the previous:

```
primitives → semantics → sharedTokens + components
```

**Primitives** — raw color palette (e.g. `grey12`, `blue45`). Not for direct use in application code.

**Semantics** — maps primitives to intent (e.g. `color.stroke.muted`, `color.background.page`). Values change per theme.

**SharedTokens** — pre-computed values for spacing, border radius, shadows, and strokes, derived from semantics. These are what application code should use.

**Components** — per-component tokens (e.g. button colors, input border colors). These are what `themeOverride` maps to.

Use `useComputedTheme()` to access all layers — see below.

---

## `useComputedTheme`

`useComputedTheme` is the primary hook for reading token values inside components. It evaluates all token layers for the currently active theme and returns the computed values — no theme detection by name, no `as any` casting.

```tsx
import { useComputedTheme } from '@instructure/emotion'

function MyComponent() {
  const { sharedTokens, semantics, primitives, components } = useComputedTheme()
  // ...
}
```

### Return shape

```ts
{
  primitives,   // raw palette — avoid in application code
  semantics,    // computed semantic color mappings
  sharedTokens, // computed tokens for spacing, radius, stroke, background, shadows
  components    // computed per-component token objects
}
```

---

## sharedTokens Reference

Complete reference sourced from `@instructure/ui-themes/src/themes/newThemeTokens/light/sharedTokens.ts`. Shape is identical across all themes — values differ.

---

### `sharedTokens.background`

Surface and fill colors for UI elements.

| Token | Use for |
|---|---|
| `pageColor` | Page/canvas background — outermost surface |
| `baseColor` | Component base — white in light themes, dark in dark themes |
| `containerColor` | Card and container surface — sits on top of page |
| `mutedColor` | Muted/subdued surface — selected rows, hover states |
| `brandColor` | Brand-colored surface — always the brand accent (dark navy by default) |
| `onColor` | Content placed ON brand surfaces — white text/icons on brand bg |
| `inverseColor` | Inverse of base — dark on light, light on dark |
| `successColor` | Success state surface |
| `errorColor` | Error/danger state surface |
| `infoColor` | Info state surface |
| `warningColor` | Warning state surface |
| `aiTopGradientColor` | AI gradient — top/start color |
| `aiBottomGradientColor` | AI gradient — bottom/end color |
| `aiTextColor` | AI-specific text color |

**Accent backgrounds** — for tags, badges, category chips:

`accentAsh` · `accentAurora` · `accentBlue` · `accentGreen` · `accentGrey` · `accentHoney` · `accentOrange` · `accentPlum` · `accentRed` · `accentSea` · `accentSky` · `accentStone` · `accentViolet`

---

### `sharedTokens.stroke`

Border and divider colors.

| Token | Use for |
|---|---|
| `baseColor` | Default border color |
| `mutedColor` | Muted border — image containers, dividers |
| `strongColor` | High-emphasis border |
| `brandColor` | Brand-colored border |
| `successColor` | Success state border |
| `errorColor` | Error/danger state border |
| `warningColor` | Warning state border |
| `infoColor` | Info state border |
| `visualSeparator` | Dividers and section separators |
| `aiTopGradientColor` | AI gradient border — start |
| `aiBottomGradientColor` | AI gradient border — end |

**Accent strokes** — same set as background accents:

`accentAsh` · `accentAurora` · `accentBlue` · `accentGreen` · `accentGrey` · `accentHoney` · `accentOrange` · `accentPlum` · `accentRed` · `accentSea` · `accentSky` · `accentStone` · `accentViolet`

---

### `sharedTokens.strokeWidth`

| Token | Description |
|---|---|
| `sm` | Thin border (default component border) |
| `md` | Medium border |
| `lg` | Thick border |

---

### `sharedTokens.borderRadius`

Pass directly to `View`'s `borderRadius` prop — no hardcoded rem values.

**General scale:**

| Token | Notes |
|---|---|
| `xs` | Extra small |
| `sm` | Small |
| `md` | Medium |
| `lg` | Large |
| `xl` | Extra large |
| `xxl` | Extra extra large |
| `full` | Pill / fully rounded (`"999rem"`) |

**Card-specific:**

| Token | Use for |
|---|---|
| `card.sm` | Small card (fixed `"0.75rem"`) |
| `card.md` | Standard card |
| `card.lg` | Large card or modal |
| `card.nestedContainer.sm` | Element inside a card — image, icon box |
| `card.nestedContainer.md` | Medium nested container inside a card |
| `card.nestedContainer.lg` | Large nested container inside a card |

---

### `sharedTokens.spacing`

**General scale** (`sharedTokens.spacing.general.*`):

| Token | Approximate value |
|---|---|
| `spaceNone` | `0rem` |
| `space2xs` | ~0.25rem |
| `spaceXs` | ~0.5rem |
| `spaceSm` | ~0.75rem |
| `spaceMd` | ~1rem |
| `spaceLg` | ~1.5rem |
| `spaceXl` | ~2rem |
| `space2xl` | ~3rem |

**Gap tokens** (`sharedTokens.spacing.gap.*`):

| Token | Use for |
|---|---|
| `sections` | Gap between major page sections |
| `buttons` | Gap between buttons in a row |
| `cards.sm` | Gap between small cards |
| `cards.md` | Gap between standard cards |
| `cards.lg` | Gap between large cards |
| `cards.nestedContainers.sm` | Gap between items inside a card — small |
| `cards.nestedContainers.md` | Gap between items inside a card — medium |
| `cards.nestedContainers.lg` | Gap between items inside a card — large |
| `inputs.horizontal` | Horizontal gap between input elements |
| `inputs.vertical` | Vertical gap between input elements |

**Padding tokens** (`sharedTokens.spacing.padding.card.*`):

| Token | Use for |
|---|---|
| `card.sm` | Padding for a small/compact card |
| `card.md` | Padding for a standard card |
| `card.lg` | Padding for a large card |

---

### `sharedTokens.focusOutline`

Focus ring styles — use with `View`'s focus props or component `themeOverride`.

| Token | Description |
|---|---|
| `offset` | Outer offset of focus ring |
| `inset` | Inset amount (`0rem`) |
| `width` | Ring stroke width |
| `infoColor` | Default focus ring color (blue) |
| `onColor` | Focus ring for elements on brand/dark surfaces |
| `successColor` | Focus ring for success contexts |
| `dangerColor` | Focus ring for destructive contexts |
| `style` | Ring style (`"solid"`) |

---

### `sharedTokens.boxShadow`

Structured shadow descriptor objects used internally by InstUI. **Do not use directly** — use `View`'s `shadow` prop instead:

| `shadow` prop value | Elevation |
|---|---|
| `"resting"` | elevation1 |
| `"above"` | elevation2 |
| `"topmost"` | elevation3 |

---

## Wiring Tokens to View

The `View` component's `background` prop selects a **slot** (`primary`, `secondary`, etc.) that maps to a legacy token. Use `themeOverride` to wire that slot to the correct `sharedTokens` value.

### Page background

```tsx
<View
  as="div"
  height="100vh"
  overflowX="hidden"
  overflowY="hidden"
  background="secondary"
  themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
  display="block"
>
```

### Card / container surface

```tsx
<View
  background="primary"
  themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
  shadow="resting"
  borderRadius={sharedTokens.borderRadius.card.md}
  padding="medium"
>
```

### Brand-colored surface with legible content

Use `sharedTokens.background.onColor` for any text or icon placed on a `brandColor` background — it's always the correct contrasting color regardless of theme. **Do not use `baseColor` here** — it is wrong in dark themes.

```tsx
<View
  background="primary"
  themeOverride={{ backgroundPrimary: sharedTokens.background.brandColor }}
  borderRadius={sharedTokens.borderRadius.card.nestedContainer.sm}
  padding="x-small"
>
  <CanvasLogoIcon color={sharedTokens.background.onColor} />
</View>
```

InstUI icon components use their own internal color system — CSS `color` on a parent element does **not** affect their fill. Pass `color="primary-inverse"` directly as a prop (which maps to `onColor` internally):

```tsx
// Wrong — CSS color is ignored by InstUI icons
<span style={{ color: sharedTokens.background.onColor }}><SettingsInstUIIcon /></span>

// Right — inject via prop
cloneElement(icon as ReactElement<{ color?: string }>, { color: 'primary-inverse' })
```

---

## `themeOverride` Prop

Any InstUI component accepts `themeOverride`. This is the primary way to customize individual component instances without wrapping them in a new provider.

### Object form — static overrides:

```tsx
<SideNavBar.Item themeOverride={{ contentPadding: '1rem 0' }} />

<Tabs.Panel themeOverride={{ defaultOverflowY: 'visible' }} />
```

### Function form — computed from context:

Receives `(componentTheme, currentTheme)`. Use this when the override should reference other token values:

```tsx
<Button
  themeOverride={(componentTheme, currentTheme) => ({
    primaryBackground: currentTheme.colors.backgroundBrand,
    primaryHoverBackground: componentTheme.primaryBackground,
  })}
/>
```

### Priority order (highest wins):

1. Component `themeOverride` prop
2. Global component overrides via provider's `componentOverrides`
3. Base component theme

### Finding component token names:

```bash
grep -r "primaryBackground\|primaryColor" \
  node_modules/@instructure/ui-buttons/es/BaseButton/theme.js
```

Or inspect `components['BaseButton']` from `useComputedTheme()` at runtime.

---

## Custom Themes

### Partial override object (merged onto canvas):

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

### Spread an existing theme and override specifics:

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
```

### Function form (receives ancestor theme):

```tsx
<InstUISettingsProvider theme={(base) => ({
  ...base,
  colors: { ...base.colors, backgroundBrand: '#c00' },
})}>
  <App />
</InstUISettingsProvider>
```

### Nesting providers:

```tsx
<InstUISettingsProvider theme={canvas}>
  <App />
  <InstUISettingsProvider theme={{ colors: { backgroundBrand: '#c00' } }}>
    <BrandedSection />  {/* canvas + brand color override */}
  </InstUISettingsProvider>
</InstUISettingsProvider>
```

---

## Merge Logic

1. No ancestor in context → defaults to `canvas`
2. `theme` is a function → called with ancestor: `theme(ancestorTheme)`
3. Result has all required `BaseTheme` keys → used as-is (full replacement)
4. Otherwise → **deep merged** onto the ancestor

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Detect theme by name to pick colors: `isDark ? '#3F515E' : '#E8EAEC'` | `useComputedTheme()` → `sharedTokens.stroke.mutedColor` |
| Hardcode hex values that match theme colors | Use token paths from `sharedTokens` |
| `borderRadius="1rem"` hardcoded on View | `borderRadius={sharedTokens.borderRadius.card.md}` |
| `background="secondary"` without themeOverride | Add `themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}` |
| `background="primary"` without themeOverride on a card | Add `themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}` |
| `style={{ borderRadius: 8 }}` inside a themed component | `sharedTokens.borderRadius.card.nestedContainer.sm` |
| `style={{ color: '#0770A3' }}` on InstUI components | `themeOverride={{ primaryColor: '#0770A3' }}` |
| `style={{ color: token }}` on parent, expecting icon to inherit | InstUI icons ignore CSS color — pass `color="primary-inverse"` as a prop |
| `sharedTokens.background.baseColor` for content on brand surfaces | Use `sharedTokens.background.onColor` — baseColor is wrong in dark themes |
| CSS class overrides targeting InstUI internals | `themeOverride` prop |
| Creating a new theme from scratch | Spread an existing theme and override specifics |
| `!important` in CSS to override component styles | `themeOverride` prop or provider-level `componentOverrides` |

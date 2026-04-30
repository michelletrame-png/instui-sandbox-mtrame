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

> Quick-nav: [Mental Model](#mental-model) · [Provider Setup](#provider-setup) · [Available Themes](#available-themes) · [Token Hierarchy](#token-hierarchy) · [useComputedTheme](#usecomputedtheme) · [sharedTokens Reference](#sharedtokens-reference) · [semantics Reference](#semantics-reference) · [themeOverride Prop](#themeoverride-prop) · [Custom Themes](#custom-themes) · [Anti-Patterns](#anti-patterns)

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
  semantics,    // full color system: text, icon, interactive state colors
  sharedTokens, // pre-computed tokens for surfaces, spacing, radius, stroke, shadows
  components    // per-component computed tokens — two uses: (1) inspect token names to feed into themeOverride, (2) read animation timing (components['Transition'].duration)
}
```

### Which one to use

| Situation | Use |
|---|---|
| Page/card/container backgrounds | `sharedTokens.background.*` |
| Border colors, dividers | `sharedTokens.stroke.*` |
| Spacing, padding, gap values | `sharedTokens.spacing.*` |
| Border radius | `sharedTokens.borderRadius.*` |
| Text color on a standard surface | `Text color="primary"` / `"secondary"` props (no token needed) |
| Text color on a brand/AI/colored surface | `semantics.color.text.onColor` (or `Text color="primary-inverse"`) |
| Icon color on a standard surface | handled by the icon component internally |
| Icon color on a brand/AI/colored surface | `semantics.color.icon.onColor` via `style={{ color }}` on a wrapper span |
| `IconButton` / `Button` color on a colored surface | `themeOverride={{ secondaryColor: semantics.color.icon.onColor }}` |
| Component-level customization | `components['ComponentName'].*` or look up token names from the theme file |

---

## sharedTokens Reference

Complete reference sourced from `@instructure/ui-themes/src/themes/newThemeTokens/light/sharedTokens.ts`. Shape is identical across all themes — values differ.

> **Valid top-level keys** — the only paths that exist on `sharedTokens`:
> `background` · `stroke` · `strokeWidth` · `borderRadius` · `spacing` · `focusOutline` · `boxShadow` · `legacy`
>
> Paths like `sharedTokens.border.*` or `sharedTokens.color.*` do **not** exist. For border/divider colors use `sharedTokens.stroke.*`. When in doubt, invoke `get-tokens` to verify a path before writing it.

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

| Token | Value | Component prop equivalent |
|---|---|---|
| `spaceNone` | `0rem` | `none` |
| `space2xs` | `0.125rem` | `xxx-small` |
| `spaceXs` | `0.25rem` | — (no named equivalent) |
| `spaceSm` | `0.5rem` | `x-small` |
| `spaceMd` | `0.75rem` | `small` |
| `spaceLg` | `1rem` | `mediumSmall` ← don't skip this |
| `spaceXl` | `1.5rem` | `medium` |
| `space2xl` | `2rem` | — (between `medium` and `large`) |

The `sharedTokens.spacing.general` scale (accessed via `useComputedTheme`) and the component prop scale (`margin`, `padding`, `gap`) are **different scales** with different step values. The key callout: `spaceLg` (1rem) maps to the prop value `mediumSmall` — and `mediumSmall` is a real, required step. Use it whenever `small` (12px / `spaceMd`) is too tight and `medium` (24px / `spaceXl`) is too loose.

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

Use `semantics.color.icon.onColor` / `semantics.color.text.onColor` for any text or icon placed on a brand or AI-gradient background — these resolve to white in all themes. **Do not use `baseColor` or `onColor` from `sharedTokens.background` for text/icons** — the background `onColor` token is for surface fills, not foreground color.

---

## semantics Reference

`semantics` is the full color system underneath `sharedTokens`. Reach for it when you need **text colors, icon colors, or interactive-state colors** that `sharedTokens` doesn't expose directly. The most common case is rendering content on a colored (brand, AI gradient, inverse) surface.

```tsx
const { sharedTokens, semantics } = useComputedTheme()
```

### `semantics.color.text`

| Path | Use for |
|---|---|
| `semantics.color.text.base` | Default body text |
| `semantics.color.text.muted` | Secondary / subdued text |
| `semantics.color.text.inverse` | Text on dark/brand surfaces — white in all themes |
| `semantics.color.text.onColor` | Text on colored surfaces — white in all themes |
| `semantics.color.text.aiColor` | AI-themed accent text |

For text on standard surfaces, use `Text`'s `color` prop directly (`"primary"`, `"secondary"`) — no token needed. Only reach for `semantics.color.text.*` when you need to pass a raw color value (e.g. into `style={{}}` or a component's `themeOverride`).

For on-color text in InstUI `Text` / `Heading` components, use `color="primary-inverse"` — it maps to `semantics.color.text.inverse` internally:

```tsx
<Text color="primary-inverse">Title on dark background</Text>
```

### `semantics.color.icon`

| Path | Use for |
|---|---|
| `semantics.color.icon.base` | Default icon color |
| `semantics.color.icon.muted` | Muted/subdued icon |
| `semantics.color.icon.inverse` | Icon on dark/brand surfaces — white |
| `semantics.color.icon.onColor` | Icon on colored surfaces — white in all themes |

**How to apply icon color on a colored surface:**

The `*InstUIIcon` system resolves color through its own `color` prop — **not** via CSS inheritance from a parent element. Pass `color` directly as a prop using one of the named token keys:

```tsx
<IgniteaiLogoInstUIIcon color="onColor" size="sm" />
```

Valid `color` prop values (map to `componentTheme` tokens):

| Value | Use for |
|---|---|
| `"onColor"` | Icon on brand/AI/colored surfaces — white in all themes |
| `"inverseColor"` | Inverted icon — also white in all themes |
| `"baseColor"` | Default icon color |
| `"mutedColor"` | Muted/subdued icon |
| `"ai"` | AI gradient (violet → sea) — the IgniteAI sparkle appearance |

A `Flex as="span" style={{ color: ... }}` wrapper does **not** affect `*InstUIIcon` icons. The icon component reads its `color` prop internally and passes it to the SVG paths as an attribute — CSS `color` on a parent is ignored.

For `IconButton` or `Button` on a colored surface, override the component's color token via `themeOverride`:

```tsx
<IconButton
  color="secondary"
  withBackground={false}
  withBorder={false}
  renderIcon={<XInstUIIcon />}
  themeOverride={{
    secondaryColor: semantics.color.icon.onColor,
    secondaryHoverBackground: semantics.color.icon.onColor,
  } as object}
/>
```

### AI gradient surface — complete pattern

The canonical pattern for a header on an AI-colored surface (matches the `ai-primary` button gradient):

```tsx
const { sharedTokens, semantics } = useComputedTheme()

<View
  as="div"
  background="primary"
  themeOverride={{
    backgroundPrimary: `linear-gradient(to bottom, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`
  }}
  borderRadius={`${sharedTokens.borderRadius.card.md} ${sharedTokens.borderRadius.card.md} 0 0`}
  padding="small medium"
  display="block"
>
  <Flex alignItems="center" justifyItems="space-between">
    <Flex alignItems="center" gap="x-small">
      <Flex as="span" style={{ color: semantics.color.icon.onColor }}>
        <IgniteaiLogoInstUIIcon />
      </Flex>
      <Text color="primary-inverse" weight="bold">Panel Title</Text>
    </Flex>
    <IconButton
      color="secondary"
      withBackground={false}
      withBorder={false}
      renderIcon={<XInstUIIcon />}
      screenReaderLabel="Close"
      themeOverride={{
        secondaryColor: semantics.color.icon.onColor,
        secondaryHoverTextColor: semantics.color.icon.onColor,
      } as object}
      onClick={onClose}
    />
  </Flex>
</View>
```

Notes:
- `themeOverride` on `View` accepts gradient strings in `backgroundPrimary` — standard CSS background values work
- The `borderRadius` CSS shorthand `"Xrem Xrem 0 0"` rounds only the top corners (use this when the header sits at the top of a card)
- `as object` cast on `themeOverride` is required when TypeScript doesn't know the component's token shape

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
  node_modules/@instructure/ui-buttons/es/BaseButton/v1/theme.js
```

Or inspect `components['BaseButton']` from `useComputedTheme()` at runtime.

---

## Custom Themes

For prototypes, prefer switching between the four provided themes rather than creating custom ones. When you do need to customize, use `themeOverride` on individual components — it's the modern, surgical approach:

```tsx
// Override a single component instance
<Button themeOverride={{ primaryBackground: '#bf2109' }} />

// Override all instances of a component in a subtree
<InstUISettingsProvider theme={light}>
  <App />
</InstUISettingsProvider>
```

### Nesting providers to scope a theme:

```tsx
<InstUISettingsProvider theme={light}>
  <App />
  <InstUISettingsProvider theme={dark}>
    <DarkPanel />  {/* dark theme scoped to this subtree */}
  </InstUISettingsProvider>
</InstUISettingsProvider>
```

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Detect theme by name to pick colors: `isDark ? '#3F515E' : '#E8EAEC'` | `useComputedTheme()` → `sharedTokens.stroke.mutedColor` |
| Hardcode hex values that match theme colors | Use token paths from `sharedTokens` or `semantics` |
| `borderRadius="1rem"` hardcoded on View | `borderRadius={sharedTokens.borderRadius.card.md}` |
| `background="secondary"` without themeOverride | Add `themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}` |
| `background="primary"` without themeOverride on a card | Add `themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}` |
| `style={{ borderRadius: 8 }}` inside a themed component | `sharedTokens.borderRadius.card.nestedContainer.sm` |
| `style={{ color: '#0770A3' }}` on InstUI components | `themeOverride={{ primaryColor: token }}` or `semantics.color.*` token |
| `style={{ color: token }}` on parent of any InstUI icon | **Neither** icon system inherits CSS color from a parent wrapper. Legacy `Icon*Solid` icons take a `color` prop mapped to their own token system. New `*InstUIIcon` icons also take a `color` prop (e.g. `color="onColor"`). CSS wrappers are silently ignored. |
| `sharedTokens.background.onColor` for text/icon color on colored surfaces | Use `semantics.color.text.onColor` / `semantics.color.icon.onColor` — the background `onColor` is for surface fills, not foreground color |
| CSS class overrides targeting InstUI internals | `themeOverride` prop |
| Creating a new theme from scratch | Spread an existing theme and override specifics |
| `!important` in CSS to override component styles | `themeOverride` prop or provider-level `componentOverrides` |

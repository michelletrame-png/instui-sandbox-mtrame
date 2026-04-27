---
name: instui-theming
description: >
  Authoritative guide for theming in Instructure UI (InstUI) v11.7.2.
  Invoke this skill whenever working with InstUISettingsProvider, theme tokens,
  useComputedTheme, component themeOverride props, custom themes, dark/high-contrast
  mode, or any question about how colors, spacing, border radius, or component styles
  are controlled in an InstUI codebase. InstUI theming diverges significantly from
  plain CSS variables or MUI/Chakra theming patterns — do NOT default to CSS custom
  properties or className overrides without checking this skill first.
---

# Instructure UI Theming Skill

> Quick-nav: [Mental Model](#mental-model) · [Provider Setup](#provider-setup) · [Available Themes](#available-themes) · [Token Hierarchy](#token-hierarchy) · [useComputedTheme](#usecomputedtheme) · [themeOverride Prop](#themeoverride-prop) · [Custom Themes](#custom-themes) · [Merge Logic](#merge-logic) · [Anti-Patterns](#anti-patterns)

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

### Common sharedTokens paths

**Stroke (border colors):**
```ts
sharedTokens.stroke.mutedColor    // muted border — e.g. image containers, dividers
sharedTokens.stroke.baseColor     // default border color
sharedTokens.stroke.strongColor   // high-emphasis border
sharedTokens.stroke.brandColor    // brand-colored border
sharedTokens.stroke.errorColor    // error/danger border
```

**Background:**
```ts
sharedTokens.background.pageColor       // page/canvas background
sharedTokens.background.baseColor       // component base (white in light themes)
sharedTokens.background.containerColor  // card/container surface
sharedTokens.background.mutedColor      // muted surface
sharedTokens.background.inverseColor    // inverse (dark on light, light on dark)
```

**Border radius:**
```ts
sharedTokens.borderRadius.card.sm    // small card corner radius
sharedTokens.borderRadius.card.md    // standard card corner radius
sharedTokens.borderRadius.card.lg    // large card corner radius
sharedTokens.borderRadius.card.nestedContainer.sm  // element inside a card
sharedTokens.borderRadius.card.nestedContainer.md  // element inside a card
sharedTokens.borderRadius.xs         // extra small (inputs, chips)
sharedTokens.borderRadius.sm         // small
sharedTokens.borderRadius.md         // medium
sharedTokens.borderRadius.lg         // large
sharedTokens.borderRadius.full       // pill / fully rounded ("999rem")
```

**Spacing:**
```ts
sharedTokens.spacing.general.spaceXs   // "0.5rem"
sharedTokens.spacing.general.spaceSm   // "0.75rem"
sharedTokens.spacing.general.spaceMd   // "1rem"
sharedTokens.spacing.general.spaceLg   // "1.5rem"
sharedTokens.spacing.general.space2xl  // "3rem"
sharedTokens.spacing.gap.cards.md      // gap between card-level elements
sharedTokens.spacing.padding.card.sm   // padding for a small card
sharedTokens.spacing.padding.card.md   // padding for a standard card
```

### Example: theme-aware image container

```tsx
function PandaCard() {
  const { sharedTokens } = useComputedTheme()

  return (
    <div style={{
      borderRadius: sharedTokens.borderRadius.card.nestedContainer.sm,
      overflow: 'hidden',
      border: `1px solid ${sharedTokens.stroke.mutedColor}`,
    }}>
      <img src="/panda.png" alt="Panda" />
    </div>
  )
}
```

This produces the correct border color and radius for whichever theme is active — no conditionals on theme name required.

---

## Wiring Tokens to View

The `View` component's `background` prop selects a **slot** (`primary`, `secondary`, etc.) that maps to a legacy token. Use `themeOverride` to wire that slot to the correct `sharedTokens` value. This is the canonical pattern for applying semantic colors to surfaces.

### Page background

The outermost surface in a component tree. Owns `height="100vh"` and overflow control.

```tsx
const { sharedTokens } = useComputedTheme()

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

Any card, panel, or elevated surface that sits on top of the page.

```tsx
<View
  background="primary"
  themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
  shadow="resting"
  borderRadius={sharedTokens.borderRadius.card.md}
  padding="medium"
>
```

### Border radius

Pass `sharedTokens` values directly as the `borderRadius` prop — no hardcoded rem values:

```tsx
borderRadius={sharedTokens.borderRadius.card.sm}   // small card
borderRadius={sharedTokens.borderRadius.card.md}   // standard card
borderRadius={sharedTokens.borderRadius.card.lg}   // large card
borderRadius={sharedTokens.borderRadius.card.nestedContainer.sm}  // element inside a card
borderRadius={sharedTokens.borderRadius.full}      // pill
```

**The rule:** `background` picks the slot, `themeOverride` wires the semantic value into it, `borderRadius` receives the token value directly.

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
# Find available tokens for a component, e.g. Button:
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

Partial objects only override what you specify — everything else falls through from the ancestor.

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Detect theme by name to pick colors: `isDark ? '#3F515E' : '#E8EAEC'` | `useComputedTheme()` → `sharedTokens.stroke.mutedColor` |
| Hardcode hex values that match theme colors | Use token paths from `sharedTokens` or `semantics` |
| `(theme as any).newTheme?.semantics?.color?.background?.page` | `useComputedTheme()` → `sharedTokens.background.pageColor` |
| `borderRadius="1rem"` hardcoded on View | `borderRadius={sharedTokens.borderRadius.card.md}` |
| `background="secondary"` without themeOverride | Add `themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}` |
| `background="primary"` without themeOverride on a card | Add `themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}` |
| `style={{ borderRadius: 8 }}` inside a themed component | `sharedTokens.borderRadius.card.nestedContainer.sm` |
| `style={{ color: '#0770A3' }}` on InstUI components | `themeOverride={{ primaryColor: '#0770A3' }}` |
| CSS class overrides targeting InstUI internals | `themeOverride` prop |
| Creating a new theme from scratch | Spread an existing theme and override specifics |
| Wrapping each component separately with a provider | Nest a single provider around a subtree |
| `!important` in CSS to override component styles | `themeOverride` prop or provider-level `componentOverrides` |

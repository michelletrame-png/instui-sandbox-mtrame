---
name: instui-reference-tokens
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

> Quick-nav: [Mental Model](#mental-model) · [Provider Setup](#provider-setup) · [Available Themes](#available-themes) · [Token Hierarchy](#token-hierarchy) · [useComputedTheme](#usecomputedtheme) · [sharedTokens](#sharedtokens) · [semantics](#semantics) · [Wiring to View](#wiring-tokens-to-view) · [themeOverride Prop](#themeoverride-prop) · [Custom Themes](#custom-themes) · [Anti-Patterns](#anti-patterns)

> Token tables: [shared-tokens.md](references/shared-tokens.md) · [semantics-color.md](references/semantics-color.md)

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

**Switching at runtime:**

```tsx
const [theme, setTheme] = useState(light)
<InstUISettingsProvider theme={theme}>
  <Button onClick={() => setTheme(dark)}>Dark Mode</Button>
</InstUISettingsProvider>
```

---

## Token Hierarchy

```
primitives → semantics → sharedTokens + components
```

- **Primitives** — raw color palette (`grey12`, `blue45`). Never use directly in app code.
- **Semantics** — maps primitives to intent (`color.stroke.muted`, `color.background.page`). Values change per theme.
- **SharedTokens** — pre-computed values for spacing, radius, shadows, strokes. What app code should use.
- **Components** — per-component tokens. What `themeOverride` maps to.

---

## `useComputedTheme`

```tsx
import { useComputedTheme } from '@instructure/emotion'

const { sharedTokens, semantics, primitives, components } = useComputedTheme()
```

### Which one to use

| Situation | Use |
|---|---|
| Page/card/container backgrounds | `sharedTokens.background.*` |
| Border colors, dividers | `sharedTokens.stroke.*` |
| Spacing, padding, gap values | `sharedTokens.spacing.*` |
| Border radius | `sharedTokens.borderRadius.*` |
| Text color on a standard surface | `Text color="primary"` / `"secondary"` props — no token needed |
| Text color on a brand/AI/colored surface | `semantics.color.text.onColor` (or `Text color="primary-inverse"`) |
| Icon color on a colored surface | `color="onColor"` prop on the icon component directly |
| `IconButton` / `Button` on a colored surface | `themeOverride={{ secondaryColor: semantics.color.icon.onColor }}` |
| Component-level customization | `themeOverride` prop with component token keys |
| Animation timing | `components['Transition'].duration` |

---

## sharedTokens

> Full tables: [shared-tokens.md](references/shared-tokens.md)

**Valid top-level keys** — the only paths that exist:
`background` · `stroke` · `strokeWidth` · `borderRadius` · `spacing` · `focusOutline` · `boxShadow` · `legacy`

Paths like `sharedTokens.border.*` or `sharedTokens.color.*` do **not** exist.

**Most-used tokens at a glance:**

| Group | Common tokens |
|---|---|
| `background` | `pageColor`, `containerColor`, `mutedColor`, `brandColor`, `aiTopGradientColor`, `aiBottomGradientColor` |
| `stroke` | `baseColor`, `mutedColor`, `visualSeparator`, `brandColor` |
| `borderRadius` | `card.sm/md/lg`, `card.nestedContainer.sm/md/lg`, `full` |
| `spacing` | `general.spaceXs`–`general.space2xl`, `gap.cards.*`, `gap.sections`, `gap.buttons`, `padding.card.*` |
| `boxShadow` | Don't use directly — use `View shadow="resting|above|topmost"` |

When in doubt about a token name, check [shared-tokens.md](references/shared-tokens.md) or invoke `instui-get-tokens`.

---

## semantics

> Full tables: [semantics-color.md](references/semantics-color.md)

Reach for `semantics` when you need text colors, icon colors, or interactive-state colors that `sharedTokens` doesn't expose. The critical paths:

| Token | Use for |
|---|---|
| `semantics.color.text.onColor` | Text on brand/AI/colored surfaces — white in all themes |
| `semantics.color.text.inverse` | Text on dark/brand surfaces — white in all themes |
| `semantics.color.icon.onColor` | Icon on brand/AI/colored surfaces — white in all themes |
| `semantics.color.icon.inverse` | Icon on dark/brand surfaces — white in all themes |

**Critical:** `*InstUIIcon` icons do not inherit CSS color from a parent. Pass `color="onColor"` as a prop directly.

---

## Wiring Tokens to View

The `View` component's `background` prop selects a slot that maps to a legacy token. Always pair with `themeOverride` to wire it to the correct `sharedTokens` value.

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

### AI gradient surface — complete pattern

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
      <IgniteaiLogoInstUIIcon color="onColor" />
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
- `themeOverride` on `View` accepts gradient strings in `backgroundPrimary`
- `borderRadius` shorthand `"Xrem Xrem 0 0"` rounds only the top corners
- `as object` cast on `themeOverride` is required when TypeScript doesn't know the component's token shape

---

## `themeOverride` Prop

Any InstUI component accepts `themeOverride`. Primary way to customize individual instances.

### Object form — static overrides:

```tsx
<SideNavBar.Item themeOverride={{ contentPadding: '1rem 0' }} />
<Tabs.Panel themeOverride={{ defaultOverflowY: 'visible' }} />
```

### Function form — computed from context:

```tsx
<Button
  themeOverride={(componentTheme, currentTheme) => ({
    primaryBackground: currentTheme.colors.backgroundBrand,
    primaryHoverBackground: componentTheme.primaryBackground,
  })}
/>
```

### Finding component token names:

Read the component's theme file, or inspect `components['ComponentName']` from `useComputedTheme()` at runtime. See `instui-get-tokens` for component token lookup.

---

## Custom Themes

For prototypes, prefer switching between the four provided themes. When customizing, use `themeOverride` on individual components.

### Nesting providers to scope a theme:

```tsx
<InstUISettingsProvider theme={light}>
  <App />
  <InstUISettingsProvider theme={dark}>
    <DarkPanel />
  </InstUISettingsProvider>
</InstUISettingsProvider>
```

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| `isDark ? '#3F515E' : '#E8EAEC'` | `useComputedTheme()` → `sharedTokens.stroke.mutedColor` |
| Hardcode hex values that match theme colors | Use token paths from `sharedTokens` or `semantics` |
| `borderRadius="1rem"` hardcoded on View | `borderRadius={sharedTokens.borderRadius.card.md}` |
| `background="secondary"` without themeOverride | Add `themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}` |
| `background="primary"` without themeOverride on a card | Add `themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}` |
| `style={{ borderRadius: 8 }}` inside a themed component | `sharedTokens.borderRadius.card.nestedContainer.sm` |
| `style={{ color: '#0770A3' }}` on InstUI components | `themeOverride={{ primaryColor: token }}` or `semantics.color.*` token |
| `style={{ color: token }}` on parent of any `*InstUIIcon` | Pass `color="onColor"` directly as a prop — CSS color on parents is silently ignored |
| `sharedTokens.background.onColor` for text/icon color | Use `semantics.color.text.onColor` / `semantics.color.icon.onColor` — the background `onColor` is for surface fills |
| CSS class overrides targeting InstUI internals | `themeOverride` prop |
| Creating a new theme from scratch | Spread an existing theme and override specifics |
| `!important` in CSS to override component styles | `themeOverride` prop or provider-level `componentOverrides` |

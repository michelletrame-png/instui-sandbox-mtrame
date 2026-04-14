# View — Full Prop Reference

Package: `@instructure/ui-view` (v11.x)
Import: `import { View } from '@instructure/ui'`

## All Props

### Structural

| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | HTML element string | `"span"` | **Always set explicitly.** Use semantic elements. |
| `display` | `"auto" \| "block" \| "inline-block" \| "inline" \| "flex" \| "inline-flex" \| "contents" \| "inherit" \| "initial" \| "revert" \| "revert-layer" \| "unset"` | `"auto"` | |
| `position` | `"static" \| "relative" \| "absolute" \| "fixed" \| "sticky"` | `"static"` | |
| `width` | CSS string | — | e.g. `"100%"`, `"300px"`, `"fit-content"` |
| `height` | CSS string | — | |
| `minWidth` | CSS string | — | |
| `minHeight` | CSS string | — | |
| `maxWidth` | CSS string | — | |
| `maxHeight` | CSS string | — | |

### Spacing (token strings)

All accept spacing tokens: `"none"` `"xxx-small"` `"xx-small"` `"x-small"` `"small"` `"medium-small"` `"medium"` `"large"` `"x-large"` `"xx-large"` — plus CSS shorthand with tokens.

| Prop | Notes |
|---|---|
| `padding` | All sides, or shorthand |
| `margin` | All sides, shorthand, or `"0 auto"` for centering |
| `insetBlockStart` | Logical CSS (top in LTR) |
| `insetBlockEnd` | Logical CSS (bottom in LTR) |
| `insetInlineStart` | Logical CSS (left in LTR) |
| `insetInlineEnd` | Logical CSS (right in LTR) |

### Background

| Value | Description |
|---|---|
| `"primary"` | Default page/card background |
| `"secondary"` | Slightly muted, secondary panels |
| `"primary-inverse"` | Dark/inverted (nav, overlay) |
| `"secondary-inverse"` | Darker inverted surface |
| `"brand"` | Brand-colored surface |
| `"info"` | Info tint |
| `"alert"` | Warning/alert tint |
| `"success"` | Success tint |
| `"danger"` | Danger/error tint |
| `"transparent"` | Explicit transparent |

### Borders

| Prop | Values |
|---|---|
| `borderWidth` | `"none"` `"small"` `"medium"` `"large"` — shorthand supported |
| `borderColor` | `"primary"` `"secondary"` `"brand"` `"info"` `"success"` `"warning"` `"alert"` `"danger"` `"transparent"` — **`"default"` and `"inverse"` do not exist and render black** |
| `borderRadius` | `"none"` `"small"` `"medium"` `"large"` `"circle"` `"pill"` — or raw CSS string (see below) |
| `borderStyle` | (defaults to solid; rarely need to override) |

#### borderRadius Named Tokens → Resolved Values (all themes)

The named tokens resolve via `sharedTokens.legacy` and are **identical across canvas, light, and dark themes**:

| Prop value | px | rem |
|---|---|---|
| `"none"` | 0px | 0 |
| `"small"` | **2px** | 0.125rem |
| `"medium"` | **4px** | 0.25rem |
| `"large"` | **8px** | 0.5rem |
| `"circle"` | 50% | — |
| `"pill"` | 999em | — |

#### Translating Figma border radius values (light/dark themes)

The new `light`/`dark` themes define larger semantic border radius values for containers and cards that **have no named View prop token**. The `borderRadius` prop accepts raw CSS pass-throughs, so use rem values directly:

| Figma design value | Semantic token | `borderRadius` prop to use |
|---|---|---|
| 2px | `borderRadius.xs` | `"small"` |
| 4px | `borderRadius.sm` | `"medium"` |
| 8px | `borderRadius.md` / `container.sm` | `"large"` |
| 12px | `borderRadius.lg` / `card.sm` | `"0.75rem"` |
| 16px | `borderRadius.xl` / `container.md` | `"1rem"` |
| 24px | `borderRadius.xxl` / `container.lg` | `"1.5rem"` |
| 32px | `borderRadius.container.xl` | `"2rem"` |

```tsx
// Card with 12px radius (common in light/dark theme Figma designs)
<View as="div" background="primary" borderRadius="0.75rem" shadow="resting">

// Modal/container with 16px radius
<View as="div" background="primary" borderRadius="1rem">
```

### Shadow

| Value | Use |
|---|---|
| `"none"` | No shadow |
| `"resting"` | Cards at rest |
| `"above"` | Modals, dropdowns |
| `"topmost"` | Tooltips, popovers |

### Overflow

| Prop | Values |
|---|---|
| `overflowX` | `"auto" \| "hidden" \| "visible" \| "scroll"` |
| `overflowY` | same |

### Focus / Accessibility

| Prop | Notes |
|---|---|
| `withFocusOutline` | Shows focus ring; use when View is interactive |
| `focusColor` | `"info" \| "inverse" \| "error"` |
| `focusPosition` | `"offset" \| "inset"` |
| `shouldAnimateFocus` | boolean |
| `tabIndex` | number |
| `role` | ARIA role string |

### Ref / Debug

| Prop | Notes |
|---|---|
| `elementRef` | Callback ref `(el) => void` |
| `withVisualDebug` | Shows colored outlines for debugging layout |

---

## Shorthand Margin Centering

```tsx
// Horizontally center a fixed/max-width container
<View as="div" maxWidth="960px" margin="0 auto" padding="large">
  {content}
</View>
```

## Full-Bleed Section

```tsx
<View as="section" background="secondary" padding="x-large large">
  <View as="div" maxWidth="1200px" margin="0 auto">
    {content}
  </View>
</View>
```

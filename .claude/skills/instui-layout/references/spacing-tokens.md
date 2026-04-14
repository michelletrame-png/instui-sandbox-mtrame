# Spacing Tokens — Full Reference

All spacing props in InstUI (`padding`, `margin`, `gap`, `colSpacing`, `rowSpacing`) accept these named tokens.
Actual pixel values are theme-controlled via `@instructure/canvas-theme` or custom theme overrides.

---

## Token Scale

Exact pixel values for canvas-theme (base font size 16px). These are authoritative and **identical across canvas, light, and dark themes** — all three share the same `sharedThemeTokens/spacing.js` values.

| Token String | rem | px | Use case |
|---|---|---|---|
| `"none"` / `"0"` | 0rem | **0px** | Explicit reset; `"0"` used in shorthand `"0 auto"` |
| `"xxx-small"` | 0.125rem | **2px** | Hairline gaps, icon nudges |
| `"xx-small"` | 0.375rem | **6px** | Dense/compact UI, tight chips |
| `"x-small"` | 0.5rem | **8px** | Tight gaps within components, icon+label |
| `"small"` | 0.75rem | **12px** | Default inner padding, gap between related items |
| `"medium-small"` | 1rem | **16px** | Slightly looser inner padding |
| `"medium"` | 1.5rem | **24px** | Standard section padding, card padding |
| `"large"` | 2.25rem | **36px** | Between cards/sections, generous breathing room |
| `"x-large"` | 3rem | **48px** | Major layout divisions |
| `"xx-large"` | 3.75rem | **60px** | Full-page outer padding on large screens |

> **Important**: Pixel values assume the default 16px root font size and are theme-controlled. If precise pixel control is required, override via `InstUISettingsProvider` — don't use `style={{}}`.

---

## Shorthand Rules

Follows CSS shorthand convention, but using token names:

```
"medium"              → all 4 sides: medium
"medium small"        → vertical: medium, horizontal: small
"large medium small"  → top: large, h: medium, bottom: small
"large medium small none" → top right bottom left
```

Special CSS values allowed inline:
```
"0 auto"   → vertical: 0, horizontal: auto (centering)
"auto"     → auto margin
```

---

## Usage Guidelines

### Gestalt Proximity
- **Tight relationship** (icon + its label, label + its input): `x-small` or `xx-small`
- **Same component group** (form fields in a section): `small`
- **Between components** (cards in a grid): `medium`
- **Between page sections**: `large`
- **Page outer padding**: `large` or `x-large`

### Mobile vs Desktop
Tokens stay the same across breakpoints unless you use `Responsive` to swap prop values:

```tsx
<Responsive
  query={{ mobile: { maxWidth: '600px' }, desktop: { minWidth: '601px' } }}
  props={{
    mobile: { padding: 'small' },
    desktop: { padding: 'large' }
  }}
  render={(props) => <View as="div" padding={props.padding}>{children}</View>}
/>
```

### Never Hard-Code

```tsx
// ❌
<View style={{ padding: '24px' }}>
<View style={{ marginBottom: '16px' }}>

// ✅
<View padding="medium">
<View margin="0 0 small">
```

### Theme Overrides (when token values must change)

```tsx
import { InstUISettingsProvider } from '@instructure/ui'
import { theme } from '@instructure/canvas-theme'

<InstUISettingsProvider theme={{
  ...theme,
  spacing: {
    ...theme.spacing,
    large: '2rem'   // override just one token
  }
}}>
  <App />
</InstUISettingsProvider>
```

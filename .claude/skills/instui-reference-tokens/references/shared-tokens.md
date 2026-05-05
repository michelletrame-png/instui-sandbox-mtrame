# sharedTokens Reference

Full token tables for `useComputedTheme().sharedTokens`. Shape is identical across all themes — values differ.

**Valid top-level keys:** `background` · `stroke` · `strokeWidth` · `borderRadius` · `spacing` · `focusOutline` · `boxShadow` · `legacy`

Paths like `sharedTokens.border.*` or `sharedTokens.color.*` do **not** exist. For border/divider colors use `sharedTokens.stroke.*`.

---

## `sharedTokens.background`

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

## `sharedTokens.stroke`

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

## `sharedTokens.strokeWidth`

| Token | Description |
|---|---|
| `sm` | Thin border (default component border) |
| `md` | Medium border |
| `lg` | Thick border |

---

## `sharedTokens.borderRadius`

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

## `sharedTokens.spacing`

**General scale** (`sharedTokens.spacing.general.*`):

| Token | Value | Component prop equivalent |
|---|---|---|
| `spaceNone` | `0rem` | `none` |
| `space2xs` | `0.125rem` | `xxx-small` |
| `spaceXs` | `0.25rem` | — |
| `spaceSm` | `0.5rem` | `x-small` |
| `spaceMd` | `0.75rem` | `small` |
| `spaceLg` | `1rem` | `mediumSmall` ← don't skip this |
| `spaceXl` | `1.5rem` | `medium` |
| `space2xl` | `2rem` | — (between `medium` and `large`) |

The `sharedTokens.spacing.general` scale and the component prop scale (`margin`, `padding`, `gap`) are **different scales**. Key callout: `spaceLg` (1rem) = prop value `mediumSmall`.

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

## `sharedTokens.focusOutline`

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

## `sharedTokens.boxShadow`

Do not use directly — use `View`'s `shadow` prop instead:

| `shadow` prop value | Elevation |
|---|---|
| `"resting"` | elevation1 |
| `"above"` | elevation2 |
| `"topmost"` | elevation3 |

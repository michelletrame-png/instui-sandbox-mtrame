---
name: instui-layout
description: >
  Authoritative guide for building layouts with Instructure UI (InstUI) v11.x in React.
  Invoke this skill whenever working on any UI layout, component composition, spacing,
  surface styling, or responsive design in an InstUI codebase — even if the user just
  says "build a page", "add a sidebar", "make this responsive", or "lay this out".
  InstUI layout diverges significantly from plain CSS/Tailwind/MUI conventions;
  do NOT default to raw CSS, inline styles, or non-InstUI layout patterns without
  checking this skill first.
---

# Instructure UI Layout Skill

> Quick-nav: [Mental Model](#mental-model) · [View](#view) · [Flex](#flex) · [Grid](#grid) · [Spacing](#spacing) · [Surfaces](#surfaces) · [Icons](#icons) · [Responsive](#responsive) · [Patterns](#patterns) · [Anti-Patterns](#anti-patterns)

---

## Mental Model

InstUI layout is **prop-driven, token-based, and theme-aware**. The core shift from conventional CSS:

| Conventional CSS | InstUI |
|---|---|
| Raw `px`/`rem` values | Named spacing tokens (`"small"`, `"medium"`) |
| Inline `style={{}}` or className utilities | Props on `View` / `Flex` |
| CSS `div > div` nesting | `<View as="div">` with semantic `as` prop |
| Custom box model via CSS | `View` is the universal box primitive |
| Flexbox via CSS class | `<Flex>` + `<Flex.Item>` |
| CSS Grid via class | `<Grid>` + `<Grid.Col>` |
| `margin: auto` centering | `margin="0 auto"` on `View` or `Flex` justification |

**Never use** `style={{padding: '16px'}}`, Tailwind classes, or raw CSS for layout when InstUI provides a prop for it.

### Import Style

Prefer per-package `/latest` imports over the `@instructure/ui` barrel. This is the pattern used in official Figma Code Connect examples:

```tsx
// ✅ Preferred — per-package /latest imports
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Text } from '@instructure/ui-text/latest'

// Also acceptable for sandboxes/prototypes
import { View, Flex, Heading } from '@instructure/ui/v11_7'
```

---

## View

**Package:** `@instructure/ui-view` (re-exported from `@instructure/ui`)

`View` is InstUI's box-model primitive — the equivalent of a styled `div` with theme-token props. Use it for any element that needs spacing, borders, backgrounds, or display control but is **not** a flex/grid container.

### Key Props

```tsx
<View
  as="div"                        // HTML element: div, span, section, article, etc.
  display="block"                 // block | inline-block | inline | flex | auto
  padding="medium"                // spacing token — see Spacing section
  margin="small 0"                // spacing token — supports shorthand
  background="primary"            // surface token — see Surfaces section
  borderWidth="small"             // none | small | medium | large
  borderColor="primary"           // primary | secondary | brand | info | success | warning | alert | danger | transparent
  borderRadius="medium"           // none | small | medium | large | circle | pill
  shadow="resting"                // none | resting | above | topmost
  width="100%"                    // CSS width value (use sparingly — prefer Flex.Item grow)
  maxWidth="1200px"               // CSS max-width
  height="auto"
  overflowX="hidden"
  overflowY="auto"
  position="relative"             // static | relative | absolute | fixed | sticky
  insetBlockStart="0"             // logical property (top)
  elementRef={myRef}
>
  {children}
</View>
```

### `as` Prop — Semantic HTML

Always set `as` to the correct semantic element:

```tsx
<View as="section">…</View>   // page sections
<View as="article">…</View>   // standalone content
<View as="header">…</View>    // page/section headers
<View as="main">…</View>      // main content area
<View as="aside">…</View>     // sidebars
<View as="span" display="inline-block">…</View>  // inline surfaces
```

Default `as="span"` renders inline. **Always explicitly set `as="div"` for block layout.**

### `display` Prop

- `block` — full-width block (most common for layout)
- `inline-block` — inline but respects dimensions (adds `verticalAlign: middle`)
- `inline` — inline flow
- `flex` — turns View into a flex container (prefer explicit `<Flex>` instead for readability)
- `inline-flex` — inline flex (adds `verticalAlign: middle`)
- `auto` — inherits from context

### Width, Height, and Max/Min Constraints

`View` accepts raw CSS values (strings) for `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, and `maxHeight`. These are **not** token-based — pass CSS strings directly.

```tsx
<View width="100%" />
<View maxWidth="1200px" />
<View minWidth="320px" maxWidth="60rem" />
<View width="50%" minWidth="200px" />
```

**Critical: the `maxWidth: 100%` default**

Every `View` has `maxWidth: 100%` baked into its base styles. This means:
- `width="100%"` alone will not cause overflow — it's already capped.
- If you set `width` to a fixed value like `"800px"` on a small viewport, it will be silently constrained to the container width because of the base `maxWidth: 100%`.
- The user-supplied `maxWidth` prop **overrides** this base via a high-specificity CSS rule, so `maxWidth="800px"` works correctly and doesn't fight the base style.

**Centering a constrained container:**

```tsx
// ✅ Correct pattern — constrain width and center with margin
<View as="main" maxWidth="1200px" margin="0 auto">
  {content}
</View>

// ✅ Also works for narrower content columns
<View as="div" maxWidth="40rem" margin="0 auto" padding="medium">
  {content}
</View>

// ❌ Doesn't center — margin auto only works on block elements
<View as="span" display="inline-block" maxWidth="600px" margin="0 auto">
```

**Width on `inline-block` and `inline-flex`:**

`inline-block` and `inline-flex` add `verticalAlign: middle` but don't set a width. You must set `width` explicitly or the element will shrink to content width:

```tsx
// ✅ Explicit width on inline-block
<View display="inline-block" width="200px" padding="small">

// ✅ Let it shrink-wrap (fine for badges, chips)
<View display="inline-block" padding="small">
```

**`width` vs `Flex.Item size`:**

Avoid setting `width` directly on children inside a `Flex` — use `Flex.Item size` (flex-basis) instead, which participates correctly in the flex algorithm:

```tsx
// ❌ width on Flex children ignores flex distribution
<Flex>
  <Flex.Item><View width="300px">Sidebar</View></Flex.Item>
</Flex>

// ✅ Use size on Flex.Item
<Flex>
  <Flex.Item size="300px">Sidebar</Flex.Item>
  <Flex.Item shouldGrow shouldShrink>Main</Flex.Item>
</Flex>
```

**Percentage widths in a Grid:**

`Grid.Col` uses the 12-column system — don't set `width` on `Grid.Col` children. Use the `width` prop on `Grid.Col` itself with breakpoint objects:

```tsx
// ❌ Don't set width on content inside Grid.Col
<Grid.Col><View width="50%">…</View></Grid.Col>

// ✅ Control column width via Grid.Col's width prop
<Grid.Col width={{ small: 12, medium: 6 }}>…</Grid.Col>
```

### When to Use View vs Flex

| Use `View` when… | Use `Flex` when… |
|---|---|
| Single element, no children to distribute | Distributing multiple children along an axis |
| Wrapping content with a surface/border/shadow | Aligning icon + text, button groups, nav items |
| Semantic container (section, article, aside) | Side-by-side or stacked layouts |
| Applying padding/margin to a single node | Controlling spacing *between* children |

---

## Flex

**Package:** `@instructure/ui-flex`

`Flex` is InstUI's flexbox container. Always pair with `Flex.Item` for child elements.

### Basic Usage

```tsx
import { Flex } from '@instructure/ui'

// Row (default)
<Flex gap="small" alignItems="center" justifyItems="space-between">
  <Flex.Item>Left content</Flex.Item>
  <Flex.Item shouldGrow shouldShrink>Middle (fills space)</Flex.Item>
  <Flex.Item>Right content</Flex.Item>
</Flex>

// Column
<Flex direction="column" gap="medium">
  <Flex.Item>Item 1</Flex.Item>
  <Flex.Item>Item 2</Flex.Item>
</Flex>
```

### Flex Props

```tsx
<Flex
  direction="row"                 // row | column | row-reverse | column-reverse
  gap="small"                     // spacing token — space between items (v11+ preferred over margin on items)
  alignItems="center"             // center | start | end | stretch | baseline
  justifyItems="start"            // start | end | center | space-between | space-around
  wrap="wrap"                     // wrap | no-wrap (default) | wrap-reverse
  display="flex"                  // flex | inline-flex
  as="div"                        // semantic element
  padding="medium"                // Flex itself can accept View spacing props
  margin="0 auto"
  width="100%"
>
```

### Flex.Item Props

```tsx
<Flex.Item
  shouldGrow                      // flex-grow: 1 (fills available space)
  shouldShrink                    // flex-shrink: 1
  size="200px"                    // flex-basis (CSS value)
  align="center"                  // override alignItems for this item
  overflowX="hidden"
  overflowY="hidden"
  padding="small"                 // item-level padding
>
```

### Shadow clipping inside Flex

> **Critical:** `Flex.Item` applies `overflow: hidden` in its base styles. Any child with `shadow="resting"` (or any box-shadow) will be clipped at the `Flex.Item` boundary.

**Fix:** place shadowed `View` cards as **direct children of `<Flex>`** — no `<Flex.Item>` wrapper. CSS `gap` applies to all direct flex children, so spacing still works:

```tsx
// ✅ Shadow unclipped — View is a direct flex child
<Flex direction="column" gap="large">
  <View as="div" shadow="resting" borderRadius="1rem" padding="medium">Card A</View>
  <View as="div" shadow="resting" borderRadius="1rem" padding="medium">Card B</View>
</Flex>

// ✅ Same for mapped cards — key goes on the component, not a wrapping Flex.Item
<Flex direction="column" gap="medium">
  {items.map(item => (
    <MyCard key={item.id} item={item} />   // MyCard renders a shadowed View
  ))}
</Flex>

// ❌ Shadow clipped — Flex.Item overflow:hidden cuts it off
<Flex direction="column" gap="large">
  <Flex.Item>
    <View as="div" shadow="resting" padding="medium">Card</View>
  </Flex.Item>
</Flex>
```

`Flex.Item` is still appropriate for non-shadowed content (form rows, text blocks, icon+label pairs) and for items that need `shouldGrow`, `shouldShrink`, or `size` flex-basis control.

### gap vs margin on Flex.Item

In v11, **prefer `gap` on the `Flex` container** over `margin` on individual `Flex.Item`s:

```tsx
// ✅ Preferred (v11+)
<Flex gap="small">
  <Flex.Item>A</Flex.Item>
  <Flex.Item>B</Flex.Item>
</Flex>

// ❌ Older pattern (still works, but verbose)
<Flex>
  <Flex.Item margin="0 small 0 0">A</Flex.Item>
  <Flex.Item>B</Flex.Item>
</Flex>
```

---

## Grid

**Package:** `@instructure/ui-grid`

Use `Grid` for multi-column page layouts where column counts should respond to viewport. Prefer `Flex` for simpler 1D layouts.

```tsx
import { Grid } from '@instructure/ui'

<Grid colSpacing="medium" rowSpacing="large">
  <Grid.Row>
    <Grid.Col width={{ small: 12, medium: 8, large: 9 }}>
      Main content
    </Grid.Col>
    <Grid.Col width={{ small: 12, medium: 4, large: 3 }}>
      Sidebar
    </Grid.Col>
  </Grid.Row>
</Grid>
```

### Grid vs Flex Decision

- **Grid**: 2D layouts, multi-column page structure, sidebar + content patterns
- **Flex**: 1D distribution, toolbars, icon+text pairs, button groups, stacked forms

Grid uses a **12-column system**. `width` prop accepts an object of breakpoints (see Responsive section).

---

## Spacing

InstUI uses **named token strings** for all spacing props (`padding`, `margin`, `gap`, `colSpacing`, `rowSpacing`).

### Token Scale (canvas-theme exact values)

The following table lists the **exact** pixel values for the canvas-theme (base font size 16px). These are authoritative — the previous skill had errors in this table.

| Token (prop string) | Theme key | rem | px | Use for |
|---|---|---|---|---|
| `"none"` / `"0"` | — | 0rem | **0px** | Explicit zero |
| `"xxx-small"` | `xxxSmall` | 0.125rem | **2px** | Hairline gaps, icon nudges |
| `"xx-small"` | `xxSmall` | 0.375rem | **6px** | Dense UI, compact lists |
| `"x-small"` | `xSmall` | 0.5rem | **8px** | Tight gaps within components |
| `"small"` | `small` | 0.75rem | **12px** | Default inner padding, gaps between related items |
| `"medium-small"` | `mediumSmall` | 1rem | **16px** | Slightly looser inner padding |
| `"medium"` | `medium` | 1.5rem | **24px** | Standard section padding, card padding |
| `"large"` | `large` | 2.25rem | **36px** | Between cards/sections, generous breathing room |
| `"x-large"` | `xLarge` | 3rem | **48px** | Major layout divisions |
| `"xx-large"` | `xxLarge` | 3.75rem | **60px** | Full-page outer padding on large screens |

> **Important**: Prop strings use `kebab-case` (e.g. `"x-small"`, `"xx-large"`). Theme keys use `camelCase` (e.g. `xSmall`, `xxLarge`). Use the prop strings in JSX.

> **Note**: Pixel values are theme-controlled and can be overridden via `InstUISettingsProvider`. Never hard-code pixel values in layout — always use tokens. Actual rendered px assumes the default 16px root font size.

### Component-Specific Spacing Aliases (canvas-theme)

These named aliases exist in the theme for specific component contexts. They are **not** valid prop values — they are internal theme references only, listed here for reference when inspecting computed styles:

| Alias | rem | px | Context |
|---|---|---|---|
| `paddingCardLarge` | 1.5rem | 24px | Large card padding (= `medium`) |
| `paddingCardMedium` | 1rem | 16px | Medium card padding (= `medium-small`) |
| `paddingCardSmall` | 0.75rem | 12px | Small card padding (= `small`) |
| `buttons` / `tags` | 0.75rem | 12px | Button/tag padding (= `small`) |

### Shorthand Syntax

Spacing props accept CSS-style shorthand with token names:

```tsx
padding="medium"                  // all sides
padding="medium small"            // vertical | horizontal
padding="large medium small"      // top | horizontal | bottom
padding="large medium small none" // top | right | bottom | left

margin="0 auto"                   // center horizontally (0 is valid)
margin="large 0 none"
```

### Spacing Philosophy

- **Related elements**: use `x-small` or `small`
- **Component internal padding**: `small` to `medium`
- **Between cards/sections**: `medium` to `large`
- **Page-level outer padding**: `large` to `x-large`
- **Never use arbitrary pixel values** in layout props — override theme tokens if custom values are truly needed

---

## Surfaces

`View`'s `background` prop applies theme-aware surface colors. These ensure proper contrast across themes (including high-contrast mode).

### Background Tokens

```tsx
background="primary"       // white in all themes except dark (#273540)
background="secondary"     // slightly off-white (#F2F4F5) in canvas/light; same as primary in dark
background="primary-inverse" // dark surface (nav bars, overlays)
background="brand"         // brand-colored surface (use sparingly)
background="info"          // informational tint
background="alert"         // warning tint
background="success"       // success tint
background="danger"        // danger/error tint
```

**Actual component token values per theme** (from `theme.newTheme.components['View']`):

| Theme | `backgroundPrimary` | `backgroundSecondary` |
|---|---|---|
| canvas | `#ffffff` | `#F2F4F5` |
| canvasHighContrast | `#ffffff` | `#F2F4F5` |
| light | `#ffffff` | `#F2F4F5` |
| dark | `#273540` | `#273540` |

**Page background caveat:** Neither `background="primary"` nor `background="secondary"` maps to the semantic page token (`theme.newTheme.semantics.color.background.page`) across all themes. That token gives `#F2F4F5` in light and `#1C222B` in dark — values that don't correspond to any single `background` prop. Apply it at the app-root wrapper level instead (see instui-theming skill → Page Background Pattern).

### Shadow Tokens

```tsx
shadow="none"              // no shadow
shadow="resting"           // cards at rest  — 1px blur, 2–3px spread (subtle lift)
shadow="above"             // modals, dropdowns — 3px/6px blur (more prominent)
shadow="topmost"           // tooltips, popovers — 6–7px / 10–28px blur (strongest)
```

> `resting` and `card` share the same value. `topmost` and `cardHover` share the same value.

### Border Tokens

```tsx
borderWidth="none"         // 0px
borderWidth="small"        // 1px  (0.0625rem)
borderWidth="medium"       // 2px  (0.125rem)
borderWidth="large"        // 4px  (0.25rem)

borderColor="primary"      // standard subtle border (grey, ~#E8EAEC in light theme) — USE THIS as the default
borderColor="secondary"    // slightly darker border
borderColor="brand"        // brand accent border
borderColor="info"         // info state
borderColor="success"
borderColor="warning"
borderColor="alert"
borderColor="danger"
borderColor="transparent"  // explicit transparent

// ⚠️ "default" and "inverse" are NOT valid borderColor values — they have no theme token
// and will fall back to the browser default (black). Always use "primary" for a standard border.

borderRadius="none"        // 0px
borderRadius="small"       // 2px  (0.125rem)
borderRadius="medium"      // 4px  (0.25rem)
borderRadius="large"       // 8px  (0.5rem)
borderRadius="circle"      // 50% (avatars, icons)
borderRadius="pill"        // fully rounded ends (tags, badges)

// Named tokens stop at 8px — same in canvas, light, and dark themes.
// For Figma designs using light/dark themes, containers often use larger radii.
// Pass raw CSS rem values directly (the prop accepts CSS pass-throughs):
borderRadius="0.75rem"     // 12px — light/dark card (borderRadius.lg / card.sm)
borderRadius="1rem"        // 16px — light/dark container.md
borderRadius="1.5rem"      // 24px — light/dark container.lg
```

### Card Pattern

> **Critical pitfall:** `borderRadius="medium"` is always 4px. On Canvas this is correct, but on rebrand themes (light/dark) cards use `1rem` (16px) radius *and no border at all* — shadow only. Always treat the full surface recipe (radius + border presence) as a single theme-dependent unit.

#### Full card surface recipe per theme family

| Theme | `borderRadius` | `borderWidth` | `borderColor` | `shadow` |
|---|---|---|---|---|
| `canvas` / `canvasHighContrast` | `"0.25rem"` (4px) | `"small"` (1px) | `"primary"` | `"resting"` |
| `light` / `dark` (rebrand) | `"1rem"` (16px) | `"none"` | `"transparent"` | `"resting"` |

#### Recommended: compute the surface as a unit

Define a helper that returns all three props together so you can't accidentally apply mismatched values:

```tsx
type ThemeKey = 'light' | 'canvas' | 'dark' | 'canvasHighContrast'

interface CardSurface {
  borderRadius: string
  borderWidth: 'none' | 'small'
  borderColor: 'primary' | 'transparent'
}

function cardSurfaceFor(themeKey: ThemeKey): CardSurface {
  const isRebrand = themeKey === 'light' || themeKey === 'dark'
  return {
    borderRadius: isRebrand ? '1rem' : '0.25rem',
    borderWidth: isRebrand ? 'none' : 'small',
    borderColor: isRebrand ? 'transparent' : 'primary',
  }
}

// Usage — spread once, applies all three props correctly for the active theme:
const card = cardSurfaceFor(themeKey)

<View
  as="div"
  background="primary"
  shadow="resting"
  padding="medium"
  borderRadius={card.borderRadius}
  borderWidth={card.borderWidth}
  borderColor={card.borderColor}
>
  {content}
</View>
```

If theme names follow a string convention rather than explicit keys, detect rebrand the same way:

```tsx
const isRebrand = themeName.includes('v11') || themeName === 'Light' || themeName === 'Dark'
const isDark = themeName.includes('Dark')
```

#### Theme-fixed examples (when you're not supporting multiple themes)

```tsx
// Canvas-only card (border + shadow)
<View
  as="div"
  background="primary"
  borderWidth="small"
  borderColor="primary"
  borderRadius="0.25rem"
  shadow="resting"
  padding="medium"
>
  {content}
</View>

// Rebrand-only card (shadow only, no border, larger radius)
<View
  as="div"
  background="primary"
  borderRadius="1rem"
  shadow="resting"
  padding="medium"
>
  {content}
</View>
```

### Theme-Adaptive Raw CSS Colors

When styling native elements (e.g. `<img>`, `<div>`) that can't use InstUI props, compute theme-aware colors from theme metadata:

```tsx
// Muted stroke color for borders on native elements
const strokeMuted = isDark
  ? '#3F515E'
  : isHighContrast ? '#9EA6AD' : '#E8EAEC'

<div style={{ border: `1px solid ${strokeMuted}` }}>
  <img src="/photo.png" style={{ width: '100%' }} />
</div>
```

---

## Typography Tokens

These are the values behind InstUI's `Text` and `Heading` size props — useful when debugging computed font sizes or writing `themeOverride`.

> **Theme note**: canvas-theme and the new light/dark themes share most font sizes but differ at the larger end. Light/dark use 20px where canvas uses 22px (`fontSizeLarge`), and 40px where canvas uses 38px (`fontSizeXXLarge`).

### Font Sizes

| Token key | canvas-theme | light/dark theme | Usage |
|---|---|---|---|
| `fontSizeXSmall` | **12px** (0.75rem) | **12px** | Captions, legends |
| `fontSizeSmall` | **14px** (0.875rem) | **14px** | Secondary/supporting text |
| `fontSizeMedium` | **16px** (1rem) | **16px** | Body text (base) |
| `fontSizeLarge` | **22px** (1.375rem) | **20px** (1.25rem) | Subheadings |
| `fontSizeXLarge` | **28px** (1.75rem) | **28px** | Section headings |
| `fontSizeXXLarge` | **38px** (2.375rem) | **40px** (2.5rem) | Page titles |

### Title Aliases

| Token key | rem | px | Context |
|---|---|---|---|
| `titlePageDesktop` | 2.25rem | **36px** | H1 on desktop |
| `titlePageMobile` | 2rem | **32px** | H1 on mobile |
| `titleSection` | 1.75rem | **28px** | H2 section title |
| `titleModule` | 1.5rem | **24px** | H3 module title |
| `titleCardLarge` | 1.5rem | **24px** | Card heading (large) |
| `titleCardRegular` | 1.25rem | **20px** | Card heading (regular) |
| `titleCardMini` | 1rem | **16px** | Card heading (mini) |

### Font Weights

| Token | Value |
|---|---|
| `fontWeightLight` / `weightRegular` | 300 / 400 |
| `fontWeightNormal` | 400 |
| `fontWeightBold` / `weightImportant` | 700 |

### Letter Spacing

| Token | rem | px |
|---|---|---|
| `letterSpacingNormal` | 0 | 0px |
| `letterSpacingCondensed` | -0.0625rem | -1px |
| `letterSpacingExpanded` | 0.0625rem | 1px |

### Line Heights

| Token | Value |
|---|---|
| `lineHeight` | 1.5 (default body) |
| `lineHeightFit` | 1.125 |
| `lineHeightCondensed` | 1.25 |
| `lineHeightDouble` | 2 |

---

## Breakpoints (canvas-theme exact values)

Breakpoints use `em` units (relative to the root font size of 16px):

| Token | em | px | Notes |
|---|---|---|---|
| `xxSmall` | 8em | **128px** | Rarely targeted |
| `xSmall` | 16em | **256px** | Very small mobile |
| `small` | 30em | **480px** | Mobile |
| `medium` / `tablet` | 48em | **768px** | Tablet |
| `large` | 62em | **992px** | Small desktop |
| `desktop` | 64em | **1024px** | Desktop |
| `xLarge` | 75em | **1200px** | Wide desktop |
| `maxWidth` | 61.9375em | **991px** | Grid max-width |

Use these in `Responsive` query props:

```tsx
query={{
  mobile:  { maxWidth: '767px' },   // below tablet
  tablet:  { minWidth: '768px', maxWidth: '991px' },
  desktop: { minWidth: '992px' }
}}
```

---

## Form Input Heights (canvas-theme exact values)

| Size | rem | px |
|---|---|---|
| `inputHeightSmall` | 1.75rem | **28px** |
| `inputHeightMedium` | 2.375rem | **38px** |
| `inputHeightLarge` | 3rem | **48px** |

These drive the `size` prop on `TextInput`, `Select`, and similar form components.

---

## Icons

**Package:** `@instructure/ui-icons`

There are two icon systems in InstUI. Check which version is installed before using either.

### Legacy icons (v11.7.1 and earlier)

Named `IconXxxLine` / `IconXxxSolid`. Size tokens are `'x-small' | 'small' | 'medium' | 'large' | 'x-large'` (deprecated in later versions). Color is a legacy token string or a hex cast.

```tsx
import { IconAnnouncementLine } from '@instructure/ui-icons'
<IconAnnouncementLine size="small" color="primary" />
```

### Lucide icons (v11.7.2-snapshot-46+)

Named `XxxInstUIIcon` — Lucide icons wrapped with InstUI's icon system. These are the **preferred** icons going forward.

```tsx
import { MegaphoneInstUIIcon, SparklesInstUIIcon } from '@instructure/ui-icons'
```

**New size tokens** (use these, not the legacy strings):

| Prop value | Notes |
|---|---|
| `"xs"` | Extra small |
| `"sm"` | Small — fits in a 2.5rem icon container |
| `"md"` | Medium (default) |
| `"lg"` | Large |
| `"xl"` | Extra large |
| `"2xl"` | 2× extra large |
| `"illu-sm/md/lg"` | Illustration sizes |

**Semantic color tokens** (selected):

```tsx
color="baseColor"       // default foreground
color="mutedColor"      // secondary/muted
color="ai"              // AI gradient (purple → blue)
color="accentRedColor"
color="accentBlueColor"
color="accentGreenColor"
color="accentOrangeColor"
color="accentVioletColor"
color="accentSkyColor"
color="inherit"         // inherits CSS currentColor from parent — see pattern below
```

### Colored icon container pattern

When placing a Lucide icon inside a tinted container (e.g. category cards), drive the icon color via CSS `currentColor` rather than casting types:

```tsx
// ✅ Set color on the container, use color="inherit" on the icon
<div style={{
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '0.375rem',
  background: `${iconColor}1A`,   // icon hex + ~10% alpha for tinted bg
  color: iconColor,               // sets CSS currentColor
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <MegaphoneInstUIIcon size="sm" color="inherit" />
</div>

// ❌ Don't cast color as never to bypass types
<MegaphoneInstUIIcon color={iconColor as never} />
```

The `${iconColor}1A` alpha pattern (hex + `1A` = ~10% opacity) produces a tinted background that automatically stays visually coherent with the icon color across themes.

---

## Responsive

**Package:** `@instructure/ui-responsive`

### Responsive Component

For component-level responsiveness (not viewport-level), use `Responsive`:

```tsx
import { Responsive } from '@instructure/ui'

<Responsive
  query={{
    small: { maxWidth: '767px' },
    medium: { minWidth: '768px', maxWidth: '1023px' },
    large: { minWidth: '1024px' }
  }}
  props={{
    small: { direction: 'column', padding: 'small' },
    medium: { direction: 'row', padding: 'medium' },
    large: { direction: 'row', padding: 'large' }
  }}
  render={(props) => (
    <Flex direction={props.direction} padding={props.padding}>
      {children}
    </Flex>
  )}
/>
```

### Grid Responsive Columns

```tsx
<Grid.Col width={{ small: 12, medium: 6, large: 4 }}>
  {/* 
    small:  full width (12/12)
    medium: half width (6/12)
    large:  third width (4/12)
  */}
</Grid.Col>
```

### DrawerLayout (Sidebar Pattern)

For collapsible sidebar + content layouts:

```tsx
import { DrawerLayout } from '@instructure/ui'

<DrawerLayout>
  <DrawerLayout.Tray
    id="sidebar-tray"
    open={sidebarOpen}
    placement="start"
    label="Navigation"
  >
    <View as="div" padding="medium" width="16rem">
      {sidebarContent}
    </View>
  </DrawerLayout.Tray>
  <DrawerLayout.Content label="Main content">
    <View as="main" padding="large">
      {mainContent}
    </View>
  </DrawerLayout.Content>
</DrawerLayout>
```

---

## Patterns

### Page Shell

```tsx
<View as="div" minHeight="100vh" background="secondary">
  {/* Top Nav */}
  <View as="header" background="primary-inverse" padding="0 large">
    <Flex alignItems="center" height="3.5rem">
      <Flex.Item shouldGrow><Logo /></Flex.Item>
      <Flex.Item><NavActions /></Flex.Item>
    </Flex>
  </View>

  {/* Page Body */}
  <View as="main" padding="large" maxWidth="1200px" margin="0 auto">
    {content}
  </View>
</View>
```

### Two-Column Layout

```tsx
<Grid colSpacing="large">
  <Grid.Row>
    <Grid.Col width={{ small: 12, large: 8 }}>
      <View as="article" padding="medium">{mainContent}</View>
    </Grid.Col>
    <Grid.Col width={{ small: 12, large: 4 }}>
      <View as="aside" padding="medium">{sidebar}</View>
    </Grid.Col>
  </Grid.Row>
</Grid>
```

### Toolbar / Action Bar

```tsx
<Flex gap="x-small" alignItems="center" padding="small 0">
  <Flex.Item shouldGrow>
    <Heading level="h2">{title}</Heading>
  </Flex.Item>
  <Flex.Item>
    <Button onClick={onSecondary}>Cancel</Button>
  </Flex.Item>
  <Flex.Item>
    <Button color="primary" onClick={onPrimary}>Save</Button>
  </Flex.Item>
</Flex>
```

### Form Layout (Stacked)

```tsx
<View as="div" padding="medium">
  <Flex direction="column" gap="medium">
    <Flex.Item><TextInput label="Name" /></Flex.Item>
    <Flex.Item><TextInput label="Email" /></Flex.Item>
    <Flex.Item>
      <Flex gap="small" justifyItems="end">
        <Flex.Item><Button>Cancel</Button></Flex.Item>
        <Flex.Item><Button color="primary">Submit</Button></Flex.Item>
      </Flex>
    </Flex.Item>
  </Flex>
</View>
```

### Heading Usage

`Heading` accepts a `margin` prop with spacing tokens directly (no wrapper `View` needed). Use `level` for content hierarchy — `h1` for page titles, `h3` for card titles. In modal dialogs, omit `level` to match the official InstUI example.

```tsx
// Page title
<Heading level="h1" margin="0 0 small 0">Page title</Heading>

// Supporting text beneath heading
<Text color="secondary" size="large">Subtitle or description.</Text>

// Card title
<Heading level="h3">Card title</Heading>

// Modal title — no level
<Heading>Dialog title</Heading>
```

### Text Usage

`Text` accepts `as`, `size`, `weight`, and `color` props. Use `as="div"` when you need block-level rendering:

```tsx
// Block-level text (name/label pattern)
<Text weight="bold" size="small" as="div">{name}</Text>
<Text color="secondary" size="x-small" as="div">{subtitle}</Text>

// Inline secondary text
<Text color="secondary" size="small">Supporting info</Text>

// size tokens: "x-small" | "small" | "medium" (default) | "large" | "x-large"
// color tokens: "primary" (default) | "secondary" | "brand" | "success" | "warning" | "danger" | "error"
```

### Button Patterns

```tsx
// Primary action
<Button color="primary">Submit</Button>

// Secondary action
<Button color="secondary">Cancel</Button>

// Full-width button (fills container)
<Button color="primary" display="block">Register</Button>
<Button color="secondary" display="block">Back</Button>

// Button with icon
<Button color="secondary" renderIcon={<Share2InstUIIcon />}>Share</Button>
```

### SimpleSelect Subcomponent Pattern

Use `SimpleSelect.Option` (subcomponent) rather than importing `SimpleSelectOption` separately:

```tsx
<SimpleSelect renderLabel="Theme" value={value} onChange={handler} width="15rem">
  {options.map((opt) => (
    <SimpleSelect.Option key={opt.id} id={opt.id} value={opt.value}>
      {opt.label}
    </SimpleSelect.Option>
  ))}
</SimpleSelect>
```

### Icon + Label Pair

```tsx
<Flex gap="x-small" alignItems="center" display="inline-flex">
  <Flex.Item><IconCheckSolid /></Flex.Item>
  <Flex.Item><Text>Completed</Text></Flex.Item>
</Flex>
```

### Modal with CloseButton

`Modal.Header` has no built-in close button prop — `allowedProps` is only `['children', 'variant', 'spacing']`. Place `CloseButton` as the **first child** of `Modal.Header` before the heading content. It self-positions via `placement="end"` and does not need a Flex wrapper.

```tsx
<Modal
  open={open}
  onDismiss={onClose}        // handles backdrop click and Escape key
  size="medium"
  label="Dialog title"
  shouldCloseOnDocumentClick
>
  <Modal.Header>
    <CloseButton
      placement="end"
      offset="small"
      screenReaderLabel="Close"
      onClick={onClose}
    />
    <Heading>Dialog title</Heading>
    {/* No level or variant — matches official InstUI example */}
  </Modal.Header>
  <Modal.Body padding="medium">
    {content}
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={onClose} margin="0 x-small 0 0">Cancel</Button>
    <Button color="primary" onClick={onSubmit}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

To add an icon beside the heading, wrap only the icon + heading in a `Flex` — not the `CloseButton`:

```tsx
<Modal.Header>
  <CloseButton placement="end" offset="small" screenReaderLabel="Close" onClick={onClose} />
  <Flex alignItems="center" gap="x-small">
    <Flex.Item><SparklesInstUIIcon size="sm" color="ai" /></Flex.Item>
    <Flex.Item><Heading>Prompt builder</Heading></Flex.Item>
  </Flex>
</Modal.Header>
```

**Anti-pattern** — wrapping `CloseButton` inside the Flex causes layout issues and is unnecessary:

```tsx
// ❌ Don't include CloseButton inside a Flex with the heading
<Modal.Header>
  <Flex alignItems="center">
    <Flex.Item><SparklesIcon /></Flex.Item>
    <Flex.Item shouldGrow><Heading>Title</Heading></Flex.Item>
    <Flex.Item><CloseButton … /></Flex.Item>  {/* ❌ */}
  </Flex>
</Modal.Header>

// ✅ CloseButton first, then heading content
<Modal.Header>
  <CloseButton placement="end" offset="small" screenReaderLabel="Close" onClick={onClose} />
  <Heading>Title</Heading>
</Modal.Header>
```

---

## Anti-Patterns

```tsx
// ❌ Raw pixel spacing
<View style={{ padding: '16px', margin: '8px 0' }}>

// ✅ Token-based
<View padding="medium" margin="x-small 0">


// ❌ Omitting `as` on block elements
<View padding="medium">  // renders as <span> by default!

// ✅
<View as="div" padding="medium">


// ❌ Using Flex for everything (including single-element padding wrappers)
<Flex><Flex.Item><Card /></Flex.Item></Flex>

// ✅ View for single elements
<View as="div" margin="medium 0"><Card /></View>


// ❌ Nested Flex.Items directly without Flex parent
<Flex.Item>…</Flex.Item>  // must be inside <Flex>


// ❌ Using margin on Flex.Items when gap is available (v11+)
<Flex>
  <Flex.Item margin="0 small 0 0">A</Flex.Item>
  <Flex.Item margin="0 small 0 0">B</Flex.Item>
</Flex>

// ✅
<Flex gap="small">
  <Flex.Item>A</Flex.Item>
  <Flex.Item>B</Flex.Item>
</Flex>


// ❌ Bypassing theme with Tailwind or MUI sx props
<div className="p-4 flex gap-2">

// ✅ Stay in InstUI primitives
<Flex as="div" gap="small" padding="medium">


// ❌ Hard-coding hex/rgb colors in background or border
<View style={{ backgroundColor: '#fff', border: '1px solid #ccc' }}>

// ✅
<View background="primary" borderWidth="small" borderColor="primary">
```

---

## Reference Files

For deeper detail on specific topics, read the appropriate reference file:

- `references/view-props-full.md` — Complete View prop matrix with all accepted values
- `references/flex-props-full.md` — Complete Flex/Flex.Item prop matrix
- `references/spacing-tokens.md` — Full spacing token table with pixel approximations per theme
- `references/responsive-patterns.md` — Advanced Responsive usage and DrawerLayout patterns

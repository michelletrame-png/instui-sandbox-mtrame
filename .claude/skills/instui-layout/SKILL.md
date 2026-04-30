---
name: instui-layout
description: >
  Authoritative guide for layout components in Instructure UI (InstUI) v11.x.
  Invoke this skill when working with View, Flex, or Grid components, laying out
  pages or UI sections, handling spacing/padding/margin, building responsive
  column layouts, or any question about positioning, overflow, or alignment in
  an InstUI codebase. InstUI layout diverges from plain CSS flexbox/grid — use
  these components and their spacing tokens instead of raw style props.
---

# Instructure UI Layout Skill

> Quick-nav: [Mental Model](#mental-model) · [Spacing Tokens](#spacing-tokens) · [View](#view) · [Flex](#flex) · [Grid](#grid) · [Common Patterns](#common-patterns) · [Anti-Patterns](#anti-patterns)

> Reference files (full prop tables): [view-props-full.md](references/view-props-full.md) · [flex-props-full.md](references/flex-props-full.md) · [spacing-tokens.md](references/spacing-tokens.md) · [responsive-patterns.md](references/responsive-patterns.md)

---

## Mental Model

| Component | Use when… |
|---|---|
| `View` | You need a styled container: background, border, shadow, padding, overflow, positioning. The single-component equivalent of a `<div>` or `<span>` with InstUI tokens applied. |
| `Flex` | You need to align/distribute children along one axis — rows or columns. Wraps CSS flexbox with InstUI spacing tokens and `Flex.Item` for fine-grained child control. |
| `Grid` | You need a multi-column responsive layout on a 12-column grid. Rows and columns that reflow at breakpoints. Rarely needed — use `Flex` for simpler one-axis layouts. |

**Import paths** (always use `/latest`):

```tsx
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Grid } from '@instructure/ui-grid/latest'
```

Or from the umbrella package:

```tsx
import { View, Flex, Grid } from '@instructure/ui/latest'
```

---

## Spacing Tokens

All `margin`, `padding`, `gap`, `colSpacing`, and `rowSpacing` props accept these token values or CSS shorthand combining them:

| Token | Value |
|---|---|
| `0` / `none` | 0 |
| `xxx-small` | 0.125rem (2px) |
| `xx-small` | 0.375rem (6px) |
| `x-small` | 0.5rem (8px) |
| `small` | 0.75rem (12px) |
| `mediumSmall` | 1rem (16px) — use this, don't skip to `medium` |
| `medium` | 1.5rem (24px) |
| `large` | 2.25rem (36px) |
| `x-large` | 3rem (48px) |
| `xx-large` | 3.75rem (60px) |
| `auto` | auto (margins only) |

**CSS shorthand** — combine tokens with spaces just like CSS margin/padding shorthand:

```tsx
// top right bottom left
padding="small medium large x-small"

// top + bottom | left + right
margin="medium auto"

// all sides
padding="small"

// top | left+right | bottom
margin="0 auto small"
```

> Full token reference: [spacing-tokens.md](references/spacing-tokens.md)

---

## View

`View` is the foundational layout primitive. Use it for any container that needs background colors, borders, shadows, overflow control, or positioned layout.

### Key props

| Prop | Type | Notes |
|---|---|---|
| `as` | `AsElementType` | HTML element to render (`'div'`, `'span'`, `'section'`, etc.) — defaults to `span` |
| `display` | `'auto' \| 'block' \| 'inline-block' \| 'flex' \| 'inline-flex' \| 'contents' \| …` | CSS display |
| `background` | `'transparent' \| 'primary' \| 'secondary' \| 'primary-inverse' \| 'brand' \| 'info' \| 'alert' \| 'success' \| 'danger' \| 'warning'` | Semantic background using theme tokens |
| `padding` | `Spacing` | CSS shorthand with spacing tokens |
| `margin` | `Spacing` | CSS shorthand with spacing tokens |
| `borderWidth` | `BorderWidth` | CSS shorthand (`'small'`, `'medium'`, `'large'`, or `'0'`) |
| `borderRadius` | `BorderRadii` | Token or raw CSS (`'small' \| 'medium' \| 'large' \| 'circle' \| 'pill'` or `'1.5rem'`) |
| `borderColor` | `'primary' \| 'secondary' \| 'brand' \| 'info' \| 'success' \| 'warning' \| 'alert' \| 'danger' \| 'transparent'` | Semantic border color |
| `shadow` | `'resting' \| 'above' \| 'topmost'` | Box shadow using theme tokens |
| `width` / `height` | `string \| number` | Raw CSS values (`'100%'`, `'100vh'`, `300`) |
| `minWidth` / `maxWidth` | `string \| number` | Raw CSS values |
| `minHeight` / `maxHeight` | `string \| number` | Raw CSS values |
| `overflowX` / `overflowY` | `'auto' \| 'hidden' \| 'visible'` | Overflow control |
| `position` | `'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'` | CSS position |
| `insetBlockStart` | `string` | CSS `top` (logical property) |
| `insetBlockEnd` | `string` | CSS `bottom` |
| `insetInlineStart` | `string` | CSS `left` in LTR, `right` in RTL |
| `insetInlineEnd` | `string` | CSS `right` in LTR |
| `textAlign` | `'start' \| 'center' \| 'end'` | Text alignment using logical values |
| `cursor` | `string` | CSS cursor |
| `withVisualDebug` | `boolean` | Renders a dotted outline for debugging layout |
| `withFocusOutline` | `boolean` | Shows focus ring (for focusable containers) |
| `focusColor` | `'info' \| 'inverse' \| 'success' \| 'danger'` | Focus ring color |
| `focusPosition` | `'offset' \| 'inset'` | Focus ring position |

### Examples

```tsx
// Page root container
<View as="div" height="100vh" overflowX="hidden" overflowY="hidden">
  <App />
</View>

// Card
<View
  as="div"
  background="primary"
  shadow="resting"
  borderRadius="1.5rem"
  padding="medium"
>
  <Heading level="h2">Card Title</Heading>
</View>

// Bordered section
<View
  as="section"
  borderWidth="small"
  borderColor="primary"
  borderRadius="medium"
  padding="medium"
>
  <Text>Content</Text>
</View>

// Absolute positioned overlay
<View
  as="div"
  position="absolute"
  insetBlockStart="0"
  insetInlineStart="0"
  width="100%"
  height="100%"
  background="primary-inverse"
/>
```

> Full prop table: [view-props-full.md](references/view-props-full.md)

---

## Flex

`Flex` wraps CSS flexbox. Use `Flex.Item` for direct children that need individual alignment or grow/shrink behavior.

### Flex props

| Prop | Type | Notes |
|---|---|---|
| `as` | `AsElementType` | Element to render, defaults to `div` |
| `display` | `'flex' \| 'inline-flex'` | Defaults to `flex` |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | Flex direction |
| `alignItems` | `'center' \| 'start' \| 'end' \| 'stretch'` | Cross-axis alignment |
| `justifyItems` | `'center' \| 'start' \| 'end' \| 'space-around' \| 'space-between'` | Main-axis distribution |
| `wrap` | `'wrap' \| 'no-wrap' \| 'wrap-reverse'` | Flex wrap |
| `gap` | `Spacing` | Spacing between items — accepts shorthand like `margin`/`padding` |
| `margin` | `Spacing` | CSS shorthand with spacing tokens |
| `padding` | `Spacing` | CSS shorthand with spacing tokens |
| `width` / `height` | `string \| number` | Raw CSS values |
| `withVisualDebug` | `boolean` | Dotted outline on all children |

### Flex.Item props

| Prop | Type | Notes |
|---|---|---|
| `shouldGrow` | `boolean` | Item fills remaining space (`flex-grow: 1`) |
| `shouldShrink` | `boolean` | Item shrinks below its `size` (`flex-shrink: 1`) |
| `size` | `string` | Base size — width in `row` direction, height in `column` |
| `align` | `'center' \| 'start' \| 'end' \| 'stretch'` | Overrides parent `alignItems` for this item |
| `order` | `number` | CSS flex `order` property |
| `overflowX` / `overflowY` | `'auto' \| 'hidden' \| 'visible'` | Overflow on this item |
| `margin` | `Spacing` | Margin for this item |
| `padding` | `Spacing` | Padding for this item |
| `textAlign` | `'start' \| 'center' \| 'end'` | Text alignment |
| `withVisualDebug` | `boolean` | Dashed outline on this item |

### Examples

```tsx
// Horizontal row with space-between header
<Flex justifyItems="space-between" alignItems="center" margin="0 0 large 0">
  <Flex.Item>
    <Heading level="h1">Page Title</Heading>
  </Flex.Item>
  <Flex.Item>
    <Button>Action</Button>
  </Flex.Item>
</Flex>

// Sidebar + content layout (full height)
<Flex height="100%" width="100%" gap="small">
  <Flex.Item>
    <SideNavBar />
  </Flex.Item>
  <Flex.Item shouldGrow shouldShrink overflowY="auto">
    <MainContent />
  </Flex.Item>
</Flex>

// Vertical column of cards
<Flex direction="column" gap="medium" padding="medium">
  <Flex.Item>
    <Card />
  </Flex.Item>
  <Flex.Item>
    <Card />
  </Flex.Item>
</Flex>

// Centered content
<Flex justifyItems="center" alignItems="center" height="100vh">
  <Flex.Item>
    <LoginForm />
  </Flex.Item>
</Flex>

// Item pinned to end of row
<Flex>
  <Flex.Item shouldGrow shouldShrink>
    <SearchInput />
  </Flex.Item>
  <Flex.Item align="end">
    <Button>Submit</Button>
  </Flex.Item>
</Flex>
```

> Full prop tables: [flex-props-full.md](references/flex-props-full.md)

---

## Grid

`Grid` provides a 12-column responsive layout system. Structure is always `Grid > Grid.Row > Grid.Col`.

### Grid props

| Prop | Type | Notes |
|---|---|---|
| `colSpacing` | `'none' \| 'small' \| 'medium' \| 'large'` | Horizontal gutter between columns |
| `rowSpacing` | `'none' \| 'small' \| 'medium' \| 'large'` | Vertical gutter between rows |
| `hAlign` | `'start' \| 'center' \| 'end' \| 'space-around' \| 'space-between'` | Horizontal alignment of columns |
| `vAlign` | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | Vertical alignment within rows |
| `startAt` | `'small' \| 'medium' \| 'large' \| 'x-large' \| null` | Breakpoint below which columns stack |
| `visualDebug` | `boolean` | Shows column outlines |

### Grid.Row props

Inherits `colSpacing`, `rowSpacing`, `hAlign`, `vAlign`, `startAt`, `visualDebug` from `Grid`. Also:

| Prop | Type | Notes |
|---|---|---|
| `isLastRow` | `boolean` | Suppresses bottom row spacing |

### Grid.Col props

| Prop | Type | Notes |
|---|---|---|
| `width` | `number \| 'auto' \| { small?, medium?, large?, xLarge? }` | Column width in 12-unit grid or responsive object |
| `offset` | `number \| 'auto' \| { small?, medium?, large?, xLarge? }` | Left offset in 12-unit grid or responsive object |
| `textAlign` | `'start' \| 'end' \| 'center' \| 'inherit'` | Text alignment within column |
| `hAlign` / `vAlign` | same as Grid | Override alignment for this column |
| `isLastCol` | `boolean` | Suppresses right column spacing |
| `elementRef` | `(el: HTMLSpanElement \| null) => void` | Ref callback |

### Breakpoints

| Token | Min-width |
|---|---|
| `small` | 480px (30em) |
| `medium` | 768px (48em) |
| `large` | 992px (62em) |
| `x-large` | 1200px (75em) |

### Examples

```tsx
// Basic two-column layout
<Grid colSpacing="medium" rowSpacing="small">
  <Grid.Row>
    <Grid.Col width={8}>
      <MainContent />
    </Grid.Col>
    <Grid.Col width={4}>
      <Sidebar />
    </Grid.Col>
  </Grid.Row>
</Grid>

// Responsive: 3 columns → 1 column below medium
<Grid startAt="medium" colSpacing="medium">
  <Grid.Row>
    <Grid.Col width={{ small: 12, medium: 4 }}>
      <Card />
    </Grid.Col>
    <Grid.Col width={{ small: 12, medium: 4 }}>
      <Card />
    </Grid.Col>
    <Grid.Col width={{ small: 12, medium: 4 }}>
      <Card />
    </Grid.Col>
  </Grid.Row>
</Grid>

// Centered column with offset
<Grid>
  <Grid.Row>
    <Grid.Col width={6} offset={3}>
      <CenteredForm />
    </Grid.Col>
  </Grid.Row>
</Grid>

// Multiple rows
<Grid colSpacing="small" rowSpacing="medium">
  <Grid.Row>
    <Grid.Col width={12}><PageHeader /></Grid.Col>
  </Grid.Row>
  <Grid.Row>
    <Grid.Col width={3}><Nav /></Grid.Col>
    <Grid.Col width={9}><Content /></Grid.Col>
  </Grid.Row>
  <Grid.Row isLastRow>
    <Grid.Col width={12}><Footer /></Grid.Col>
  </Grid.Row>
</Grid>
```

> Responsive patterns: [responsive-patterns.md](references/responsive-patterns.md)

---

## Common Patterns

### Full-height app shell with sidebar

```tsx
<View as="div" height="100vh" overflowX="hidden" overflowY="hidden">
  <Flex height="100%" width="100%" gap="small">
    <Flex.Item>
      <SideNavBar />
    </Flex.Item>
    <Flex.Item shouldGrow shouldShrink overflowY="auto">
      <Flex direction="column" height="100vh" padding="medium" gap="medium">
        {/* scrollable content area */}
      </Flex>
    </Flex.Item>
  </Flex>
</View>
```

### Card

```tsx
<View
  as="div"
  background="primary"
  shadow="resting"
  borderRadius="medium"
  padding="medium"
>
  <Heading level="h2">Title</Heading>
  <Text>Body content</Text>
</View>
```

### Page header with actions

```tsx
<Flex justifyItems="space-between" alignItems="center" margin="0 0 large 0">
  <Flex.Item>
    <Heading level="h1">Page Title</Heading>
  </Flex.Item>
  <Flex.Item>
    <Flex gap="small">
      <Flex.Item><Button>Secondary</Button></Flex.Item>
      <Flex.Item><Button color="primary">Primary</Button></Flex.Item>
    </Flex>
  </Flex.Item>
</Flex>
```

### Scrollable inner panel

```tsx
<Flex direction="column" height="100%">
  <Flex.Item>
    <PageHeader />       {/* fixed height */}
  </Flex.Item>
  <Flex.Item shouldGrow shouldShrink overflowY="auto">
    <ContentList />      {/* scrolls independently */}
  </Flex.Item>
</Flex>
```

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| `<div style={{ display: 'flex', gap: '1rem' }}>` | `<Flex gap="medium">` |
| `<div style={{ padding: '16px' }}>` | `<View padding="medium">` |
| Raw pixel values in `margin`/`padding` props: `padding="16px"` | Use spacing tokens: `padding="medium"` |
| Nesting `View` inside `Flex` just to get padding on a flex item | Use `Flex.Item` with `padding` prop directly |
| Using `Grid` for simple side-by-side layouts | Use `Flex` — Grid is for 12-col responsive layouts |
| Omitting `shouldShrink` on a `Flex.Item` that should not overflow its container | Add `shouldShrink` whenever `shouldGrow` is set and overflow matters |
| `<Flex.Item style={{ flexGrow: 1 }}>` | `<Flex.Item shouldGrow>` |
| `width={{ small: ..., medium: ... }}` on `Grid.Col` without setting `startAt` on `Grid` | Set `startAt` on the parent `Grid` to control the stacking breakpoint |
| Mixing raw CSS shorthand pixels with token names: `padding="16px small"` | Use consistent token shorthand: `padding="medium small"` |
| Wrapping a shadowed `View` in `<Flex.Item>` in a column layout | Place it as a **direct child of `<Flex>`** — column-direction `Flex.Item` defaults to `overflow: auto` which can clip box shadows |
| Using `<Flex.Item>` when no grow/shrink/align behavior is needed | Make the element a direct child of `<Flex>` — `gap` applies to all direct children, so spacing still works |

## Flex.Item overflow behavior

`Flex.Item` does **not** apply `overflow: hidden` in its base styles. Its overflow defaults are:

- **Row direction:** `overflowY="visible"` (default — shadows and focus rings paint freely)
- **Column direction:** `overflowY="auto"` (default — can clip shadows that extend beyond the item boundary)

If you're in a column layout and a shadowed `View` is being clipped, override explicitly:

```tsx
// Fix clipping in a column layout
<Flex.Item overflowY="visible">
  <View shadow="resting">...</View>
</Flex.Item>
```

**Preferred pattern:** Only use `Flex.Item` when you actually need `shouldGrow`, `shouldShrink`, `align`, or `order`. Elements that don't need those props should be direct children of `<Flex>` — CSS `gap` applies to all direct flex children regardless.

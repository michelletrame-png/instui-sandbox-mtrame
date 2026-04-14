# Flex / Flex.Item — Full Prop Reference

Package: `@instructure/ui-flex` (v11.x)
Import: `import { Flex } from '@instructure/ui'`

---

## Flex Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | HTML element | `"div"` | Semantic element for the container |
| `direction` | `"row" \| "column" \| "row-reverse" \| "column-reverse"` | `"row"` | |
| `gap` | spacing token | — | Space between all items. **Preferred over item margins in v11.** |
| `alignItems` | `"center" \| "start" \| "end" \| "stretch" \| "baseline"` | `"stretch"` | Cross-axis alignment |
| `justifyItems` | `"start" \| "end" \| "center" \| "space-between" \| "space-around"` | `"start"` | Main-axis distribution |
| `wrap` | `"wrap" \| "no-wrap" \| "wrap-reverse"` | `"no-wrap"` | Whether items wrap |
| `display` | `"flex" \| "inline-flex"` | `"flex"` | |
| `padding` | spacing token | — | Flex container can also accept View spacing props |
| `margin` | spacing token or `"0 auto"` | — | |
| `width` | CSS string | — | |
| `height` | CSS string | — | |
| `maxWidth` | CSS string | — | |
| `minWidth` | CSS string | — | |
| `elementRef` | callback ref | — | |
| `withVisualDebug` | boolean | false | Color outlines for debugging |

---

## Flex.Item Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | HTML element | `"div"` | |
| `shouldGrow` | boolean | false | `flex-grow: 1` — fills remaining space |
| `shouldShrink` | boolean | false | `flex-shrink: 1` — shrinks below natural size |
| `size` | CSS string | — | `flex-basis` — e.g. `"200px"`, `"25%"`, `"auto"` |
| `align` | `"center" \| "start" \| "end" \| "stretch" \| "baseline"` | — | Overrides container `alignItems` for this item |
| `padding` | spacing token | — | |
| `margin` | spacing token | — | Avoid when `gap` on container covers it |
| `overflowX` | `"auto" \| "hidden" \| "visible"` | — | Needed when item has truncated text |
| `overflowY` | same | — | |
| `elementRef` | callback ref | — | |

---

## Common Patterns

### Centered Content, Fixed Sidebar

```tsx
<Flex height="100vh">
  <Flex.Item size="260px" shouldShrink={false}>
    <Nav />
  </Flex.Item>
  <Flex.Item shouldGrow shouldShrink overflowY="auto">
    <View as="main" padding="large">{content}</View>
  </Flex.Item>
</Flex>
```

### Aligned Actions Row

```tsx
<Flex gap="small" alignItems="center" justifyItems="end">
  <Flex.Item><Button>Secondary</Button></Flex.Item>
  <Flex.Item><Button color="primary">Primary</Button></Flex.Item>
</Flex>
```

### Stretchy Middle Column

```tsx
<Flex gap="medium" alignItems="start">
  <Flex.Item size="180px">Left panel</Flex.Item>
  <Flex.Item shouldGrow shouldShrink overflowX="hidden">
    Main content — fills all remaining width
  </Flex.Item>
  <Flex.Item size="240px">Right panel</Flex.Item>
</Flex>
```

### Vertical Stack with Dividers

```tsx
<Flex direction="column" gap="medium">
  <Flex.Item>
    <View borderWidth="0 0 small" borderColor="default" padding="0 0 medium">
      Section 1
    </View>
  </Flex.Item>
  <Flex.Item>Section 2</Flex.Item>
</Flex>
```

---

## gap Token Values

`gap` accepts the same tokens as all spacing props:

`"none"` `"xxx-small"` `"xx-small"` `"x-small"` `"small"` `"medium-small"` `"medium"` `"large"` `"x-large"` `"xx-large"`

Use `gap="x-small"` for tight toolbars, `gap="small"` for form fields, `gap="medium"` for card grids, `gap="large"` for page sections.

# Flex — Full Prop Reference

`import { Flex } from '@instructure/ui-flex/latest'`

Use `Flex.Item` for direct children that need individual grow/shrink/align behavior. Plain markup children are valid but won't support those per-item controls.

---

## Flex Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `AsElementType` | `'div'` | HTML element to render. |
| `elementRef` | `(el: Element \| null) => void` | — | Ref callback. |
| `children` | `Renderable` | — | Should be `Flex.Item` elements (or any markup). |
| `display` | `'flex' \| 'inline-flex'` | `'flex'` | CSS display value. |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | `'row'` | Flex direction. |
| `alignItems` | `'center' \| 'start' \| 'end' \| 'stretch'` | `'stretch'` | Cross-axis alignment for all items. Overridden per-item by `Flex.Item align`. |
| `justifyItems` | `'center' \| 'start' \| 'end' \| 'space-around' \| 'space-between'` | `'start'` | Main-axis distribution of items. |
| `wrap` | `'wrap' \| 'no-wrap' \| 'wrap-reverse'` | `'no-wrap'` | Flex wrap behavior. |
| `gap` | `Spacing` | — | Spacing between items. Single token only (not shorthand). |
| `margin` | `Spacing` | — | CSS shorthand using spacing tokens. |
| `padding` | `Spacing` | — | CSS shorthand using spacing tokens. |
| `width` | `string \| number` | — | CSS width. |
| `height` | `string \| number` | — | CSS height. |
| `textAlign` | `'start' \| 'center' \| 'end'` | — | Text alignment within the flex container. |
| `withVisualDebug` | `boolean` | `false` | Renders dotted outlines around all children. |
| `themeOverride` | `object \| fn` | — | Component token overrides. |

---

## Flex.Item Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `AsElementType` | `'div'` | HTML element to render. |
| `elementRef` | `(el: Element \| null) => void` | — | Ref callback. |
| `children` | `React.ReactNode` | — | Content. |
| `shouldGrow` | `boolean` | `false` | Sets `flex-grow: 1` — item expands to fill remaining space. |
| `shouldShrink` | `boolean` | `false` | Sets `flex-shrink: 1` — item can shrink below its `size`. Pair with `shouldGrow` when overflow matters. |
| `size` | `string` | — | Base size: CSS width in `row` direction, CSS height in `column` direction (sets `flex-basis`). |
| `align` | `'center' \| 'start' \| 'end' \| 'stretch'` | — | Overrides parent `alignItems` for this item only (`align-self`). |
| `order` | `number` | — | CSS `order` property — changes visual order without reordering the DOM. |
| `margin` | `Spacing` | — | Margin for this item. |
| `padding` | `Spacing` | — | Padding for this item. |
| `overflowX` | `'auto' \| 'hidden' \| 'visible'` | — | Horizontal overflow on this item. |
| `overflowY` | `'auto' \| 'hidden' \| 'visible'` | — | Vertical overflow. Use `overflowY="auto"` for scrollable panels. |
| `textAlign` | `'start' \| 'center' \| 'end'` | — | Text alignment. |
| `withVisualDebug` | `boolean` | `false` | Dashed outline on this item. |
| `themeOverride` | `object \| fn` | — | Component token overrides. |

---

## shouldGrow / shouldShrink Decision Guide

| Scenario | shouldGrow | shouldShrink |
|---|---|---|
| Fixed-size sidebar, content fills rest | `false` / `false` on sidebar, `true` / `true` on content | |
| All items share space equally | `true` on each | optional |
| Item must not overflow its container | pair with `true` | always set both together |
| Fixed-width header/footer in column | `false` / `false` | |
| Item fills all remaining vertical space | `true` | set if content could overflow |

**Rule of thumb:** when you set `shouldGrow`, also set `shouldShrink` if the item's content might be taller/wider than the remaining space.

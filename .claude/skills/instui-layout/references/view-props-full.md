# View — Full Prop Reference

`import { View } from '@instructure/ui-view/latest'`

## Core / Element

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `AsElementType` | `'span'` | HTML element to render. Use `'div'` for block-level containers. |
| `elementRef` | `(el: HTMLElement \| null) => void` | — | Ref callback for the root element. |
| `children` | `React.ReactNode` | — | Content. |

## Display & Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `display` | `'auto' \| 'inline' \| 'block' \| 'inline-block' \| 'flex' \| 'inline-flex' \| 'contents' \| 'inherit' \| 'initial' \| 'revert' \| 'revert-layer' \| 'unset'` | `'auto'` | CSS display property. |
| `width` | `string \| number` | — | CSS width. Accepts `'100%'`, `'100vw'`, `300`, etc. |
| `height` | `string \| number` | — | CSS height. Accepts `'100%'`, `'100vh'`, etc. |
| `minWidth` | `string \| number` | — | CSS min-width. |
| `maxWidth` | `string \| number` | — | CSS max-width. |
| `minHeight` | `string \| number` | — | CSS min-height. |
| `maxHeight` | `string \| number` | — | CSS max-height. |
| `overflowX` | `'auto' \| 'hidden' \| 'visible'` | — | Horizontal overflow. |
| `overflowY` | `'auto' \| 'hidden' \| 'visible'` | — | Vertical overflow. |
| `overscrollBehavior` | `'auto' \| 'contain' \| 'none'` | — | CSS overscroll-behavior. |

## Spacing

| Prop | Type | Description |
|---|---|---|
| `padding` | `Spacing` | CSS shorthand using spacing tokens. |
| `margin` | `Spacing` | CSS shorthand using spacing tokens. |

## Background & Visual

| Prop | Type | Description |
|---|---|---|
| `background` | `'transparent' \| 'primary' \| 'secondary' \| 'primary-inverse' \| 'brand' \| 'info' \| 'alert' \| 'success' \| 'danger' \| 'warning'` | Semantic background color via theme tokens. |
| `shadow` | `'resting' \| 'above' \| 'topmost'` | Box shadow via theme tokens. `resting` = card elevation, `above` = dropdown/overlay, `topmost` = modal. |
| `withVisualDebug` | `boolean` | Renders a dotted outline for debugging layout. |

## Border

| Prop | Type | Description |
|---|---|---|
| `borderWidth` | `BorderWidth` | CSS shorthand: accepts `'0'`, `'small'`, `'medium'`, `'large'` or combinations like `'small 0'`. |
| `borderColor` | `'primary' \| 'secondary' \| 'brand' \| 'info' \| 'success' \| 'warning' \| 'alert' \| 'danger' \| 'transparent'` | Semantic border color. |
| `borderRadius` | `BorderRadii` | Token (`'small' \| 'medium' \| 'large' \| 'circle' \| 'pill'`) or raw CSS length (`'1.5rem'`). Accepts shorthand for individual corners. |

## Text

| Prop | Type | Description |
|---|---|---|
| `textAlign` | `'start' \| 'center' \| 'end'` | Logical text alignment (maps to CSS `text-align`). |

## Positioning

| Prop | Type | Description |
|---|---|---|
| `position` | `'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'` | CSS position. |
| `insetBlockStart` | `string` | CSS `top` (logical — RTL-aware). |
| `insetBlockEnd` | `string` | CSS `bottom`. |
| `insetInlineStart` | `string` | CSS `left` in LTR, `right` in RTL. |
| `insetInlineEnd` | `string` | CSS `right` in LTR, `left` in RTL. |
| `stacking` | `Stacking` | z-index token: `'deepest' \| 'below' \| 'resting' \| 'above' \| 'topmost'`. |

## Focus / Interaction

| Prop | Type | Description |
|---|---|---|
| `withFocusOutline` | `boolean` | Shows a focus ring (for keyboard-focusable containers). |
| `focusPosition` | `'offset' \| 'inset'` | Whether the focus ring sits outside or inside the element. |
| `focusColor` | `'info' \| 'inverse' \| 'success' \| 'danger'` | Focus ring color token. |
| `focusWithin` | `boolean` | Shows focus ring when any descendant is focused (not just the View itself). |
| `shouldAnimateFocus` | `boolean` | Animates the focus ring transition. |
| `cursor` | `string` | CSS cursor value. |

## Internationalization

| Prop | Type | Description |
|---|---|---|
| `dir` | `'ltr' \| 'rtl'` | Text direction override for this subtree. |

## Theming

| Prop | Type | Description |
|---|---|---|
| `themeOverride` | `object \| (componentTheme, theme) => object` | Override View's component tokens. See instui-theming skill for full usage. |

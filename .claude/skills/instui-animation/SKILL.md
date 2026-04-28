---
name: instui-animation
description: >
  Authoritative guide for animation and transitions in Instructure UI (InstUI) v11.
  Invoke this skill when adding motion to components: panel slide-ins, fades, scale
  transitions, or any layout that needs to resize smoothly as a panel opens or closes.
  Covers the Transition component, DrawerLayout push behavior, theme timing tokens,
  and the critical rule about CSS transforms vs layout flow.
---

# Instructure UI Animation Skill

> Quick-nav: [Key Rule](#key-rule) · [Transition Component](#transition-component) · [Animation Types](#animation-types) · [Theme Tokens](#theme-tokens) · [DrawerLayout](#drawerlayout-push-panels) · [Anti-Patterns](#anti-patterns)

---

## Key Rule

**CSS `transform` does not affect layout flow.** The `Transition` component animates with `transform` + `opacity`. This means:

- The element takes up its full space in the DOM the moment it mounts — content snaps immediately.
- The *visual* animation (slide, fade) happens independently of layout.

If you need the surrounding layout to resize smoothly as a panel opens or closes, **use `DrawerLayout`** — not `Transition` alone. `DrawerLayout` measures the tray width and applies an animated `margin` to the content area, which *does* affect layout flow.

---

## Transition Component

`Transition` is the core animation primitive. It applies CSS classes to its child that map to `transform` + `opacity` keyframes defined globally via emotion.

```tsx
import { Transition } from '@instructure/ui-motion'
```

No `/latest` suffix — import directly from `@instructure/ui-motion`.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `in` | `boolean` | — | Drives the enter/exit state machine |
| `type` | See [Animation Types](#animation-types) | — | Which animation to apply |
| `transitionOnMount` | `boolean` | `false` | Animate in when the component first mounts |
| `unmountOnExit` | `boolean` | `false` | Remove from DOM after exit transition completes |
| `transitionEnter` | `boolean` | `true` | Enable enter transitions |
| `transitionExit` | `boolean` | `true` | Enable exit transitions |
| `onEnter` | `() => void` | — | Called when enter starts |
| `onEntering` | `() => void` | — | Called during entering |
| `onEntered` | `(type) => void` | — | Called when enter completes |
| `onExit` | `() => void` | — | Called when exit starts |
| `onExiting` | `() => void` | — | Called during exiting |
| `onExited` | `(type) => void` | — | Called when exit completes — use this to unmount |
| `elementRef` | `(el) => void` | — | Ref callback |

### Child requirements

`Transition` applies CSS classes to its child via `React.cloneElement`. The child must accept a `className` prop. All InstUI components do. Raw `<div>` elements do too.

### Enter-only animation (mount + no exit)

When rendering conditionally (`{open && <Component />}`), React removes the element from the DOM immediately on close — there is no exit animation. To animate in only:

```tsx
{open && (
  <Transition in type="slide-right" transitionOnMount>
    <YourPanel />
  </Transition>
)}
```

### Enter + exit animation

Keep the element in the DOM and let `Transition` manage visibility. Use `unmountOnExit` to remove it after exit completes:

```tsx
<Transition
  in={open}
  type="slide-right"
  transitionOnMount
  unmountOnExit
  onExited={() => { /* optional cleanup */ }}
>
  <YourPanel />
</Transition>
```

---

## Animation Types

| Type | EXITED state | ENTERED state | Use for |
|---|---|---|---|
| `fade` | `opacity: 0.01` | `opacity: 1` | Tooltips, popovers, subtle reveals |
| `scale` | `scale(0.01)` + opacity 0 | `scale(1)` + opacity 1 | Modals, dialogs |
| `slide-right` | `translateX(100%)` | `translateX(0)` | Panels entering **from the right** |
| `slide-left` | `translateX(-100%)` | `translateX(0)` | Panels entering **from the left** |
| `slide-up` | `translateY(-100%)` | `translateY(0)` | Dropdowns, top sheets |
| `slide-down` | `translateY(100%)` | `translateY(0)` | Bottom sheets |

**Direction naming convention:** the name refers to where the element *originates*, not where it moves. `slide-right` means the element starts off the right edge and slides inward (leftward motion). This is consistent with InstUI's `Tray` component — a `placement="end"` tray uses `slide-right`.

---

## Theme Tokens

`Transition` reads timing from the active theme automatically. You do not need to set durations manually.

```ts
// Available via useComputedTheme() if needed
const { components } = useComputedTheme()
// components['Transition'].duration  → '300ms'
// components['Transition'].timing    → 'ease-in-out'
```

The global CSS applied by `Transition`:
```css
transition: opacity 300ms ease-in-out, transform 300ms ease-in-out !important;
```

The `!important` ensures the transition overrides any conflicting animation on the element.

---

## DrawerLayout — Push Panels

Use `DrawerLayout` when a panel should **push the main content aside** rather than overlay it. It measures the tray width after the transition enters and applies an animated `margin` to the content area — this is the only correct way to get smooth layout reflow.

```tsx
import { DrawerLayout } from '@instructure/ui-drawer-layout/latest'
```

### Structure

```tsx
<DrawerLayout minWidth="600px">

  <DrawerLayout.Tray
    open={panelOpen}
    placement="end"
    label="Panel label"
    border={false}
    shadow={false}
    themeOverride={{ background: sharedTokens.background.pageColor }}
    onDismiss={() => setPanelOpen(false)}
  >
    {/* Panel content */}
  </DrawerLayout.Tray>

  <DrawerLayout.Content label="Main content">
    <View as="div" height="100%" overflowY="auto" padding="large" display="block">
      {/* Main page content */}
    </View>
  </DrawerLayout.Content>

</DrawerLayout>
```

### How push works

1. Tray opens → slide-in transition runs (via `Transition` internally)
2. On `onEntered`, `DrawerLayout` measures the tray's rendered width
3. It applies `marginRight` (for `placement="end"`) to the `DrawerContent` equal to the tray width
4. The margin is CSS-animated, so the content area shrinks smoothly

On close, the margin animates back to 0 before the tray exits.

### DrawerLayout props

| Prop | Type | Default | Description |
|---|---|---|---|
| `minWidth` | `string` | `'30rem'` | Below this content width, tray switches to overlay mode |
| `onOverlayTrayChange` | `(overlaying: boolean) => void` | — | Called when push↔overlay mode switches |
| `children` | `DrawerTray + DrawerContent` | — | Must be exactly these two components |

### DrawerLayout.Tray props (key ones)

| Prop | Type | Notes |
|---|---|---|
| `open` | `boolean` | Controls open/close state |
| `placement` | `'start' \| 'end'` | `end` = right side |
| `label` | `string` | Required for a11y |
| `border` | `boolean` | Set `false` to remove default border |
| `shadow` | `boolean` | Set `false` to remove default shadow |
| `themeOverride` | `object` | Use `{ background: sharedTokens.background.pageColor }` to make tray background match the page so a styled card inside reads correctly |
| `onDismiss` | `() => void` | Called on Escape or document click (if enabled) |

### DrawerLayout.Content props

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required for a11y |
| `contentRef` | `(el) => void` | Ref to the content DOM element |
| `onSizeChange` | `({ width, height }) => void` | Called when content area dimensions change |

### Integrating with a flex shell

`DrawerLayout` renders with `height: 100%` built in. Wrap it in a `Flex.Item shouldGrow shouldShrink` and it will fill the available space:

```tsx
<Flex height="100vh" width="100%">
  <SideNavBar />  {/* or any fixed sidebar */}
  <Flex.Item shouldGrow shouldShrink>
    <DrawerLayout minWidth="600px">
      <DrawerLayout.Tray ...>...</DrawerLayout.Tray>
      <DrawerLayout.Content label="...">
        <View height="100%" overflowY="auto" padding="large">
          {/* page content */}
        </View>
      </DrawerLayout.Content>
    </DrawerLayout>
  </Flex.Item>
</Flex>
```

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Raw `@keyframes` + `style={{ animation: '...' }}` for slide-in | `<Transition type="slide-right" transitionOnMount>` |
| `{open && <Transition in type="...">}` expecting an exit animation | Use `<Transition in={open} unmountOnExit>` outside the conditional |
| `Transition` for a panel that should push content | Use `DrawerLayout` — `Transition` alone causes layout to snap |
| Setting `style={{ transform: 'translateX(...)' }}` to position the panel | `Transition` manages transforms — don't set them manually |
| Import from `@instructure/ui-motion/latest` | Import from `@instructure/ui-motion` directly — no `/latest` suffix |
| Import `DrawerContent` / `DrawerTray` separately and compose them manually | Use `DrawerLayout.Content` and `DrawerLayout.Tray` — the statics are available and the push behavior requires the parent `DrawerLayout` context |

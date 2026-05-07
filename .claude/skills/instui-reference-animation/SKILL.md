---
name: instui-reference-animation
description: >
  Authoritative guide for animation and transitions in Instructure UI (InstUI) v11.
  Invoke this skill when adding motion to components: panel slide-ins, fades, scale
  transitions, or any layout that needs to resize smoothly as a panel opens or closes.
  Covers the Transition component, DrawerLayout push behavior, theme timing tokens,
  and the critical rule about CSS transforms vs layout flow.
---

# Instructure UI Animation Skill

> Quick-nav: [Key Rule](#key-rule) · [Reduced Motion](#reduced-motion-first) · [Transition Component](#transition-component) · [Animation Types](#animation-types) · [Theme Tokens](#theme-tokens) · [Custom Keyframe Animations](#custom-keyframe-animations) · [DrawerLayout](#drawerlayout-push-panels) · [Anti-Patterns](#anti-patterns)

---

## Key Rule

**CSS `transform` does not affect layout flow.** The `Transition` component animates with `transform` + `opacity`. This means:

- The element takes up its full space in the DOM the moment it mounts — content snaps immediately.
- The *visual* animation (slide, fade) happens independently of layout.

If you need the surrounding layout to resize smoothly as a panel opens or closes, **use `DrawerLayout`** — not `Transition` alone. `DrawerLayout` measures the tray width and applies an animated `margin` to the content area, which *does* affect layout flow.

---

## Reduced Motion — First, Not Last

**This is not optional.** Prototype code is copied directly into production. Every animation pattern must include reduced-motion handling from the start.

### The constraint: `Transition` cannot be suppressed by CSS

`Transition` applies its CSS with `!important`. A `@media (prefers-reduced-motion: reduce)` rule without its own `!important` will lose. Emotion controls injection order, so fighting back with `!important` in a media query is non-deterministic. **For `Transition`-based animations, always use JS detection.**

### The constraint: custom `@keyframes` can use CSS

For animations injected via `Global`, you control the CSS — the media query approach works cleanly and is simpler than JS.

### The pattern — define this once per file, use everywhere

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

Module-level constant. No hook needed — the preference is set by the user at the OS level and doesn't change mid-session.

### `Transition` with reduced motion

```tsx
// ✅ Always wrap Transition in a reduced-motion guard
{prefersReducedMotion
  ? <YourPanel />
  : (
    <Transition in type="slide-right" transitionOnMount unmountOnExit>
      <YourPanel />
    </Transition>
  )
}
```

When `prefersReducedMotion` is true, the panel renders immediately with no animation. Never pass `Transition` to a user who has requested reduced motion — there is no CSS-only way to suppress it.

### Custom `@keyframes` with reduced motion

```tsx
// ✅ Wrap the keyframe rule itself in the media query
<Global styles={`
  @media (prefers-reduced-motion: no-preference) {
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  }
`} />
```

If the keyframe is never defined, applying it has no effect — the element renders at full opacity immediately. No JS needed.

### Staggered reveals with reduced motion

```tsx
// ✅ The helper returns empty styles when motion is reduced
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fadeIn = (i: number): React.CSSProperties =>
  prefersReducedMotion
    ? {}
    : { opacity: 0, animation: `fade-in 300ms ease-out ${i * 150}ms both` }

// Usage — the final state renders immediately for reduced-motion users
<div style={fadeIn(0)}><Text>{line1}</Text></div>
<div style={fadeIn(1)}><Text>{line2}</Text></div>
<div style={fadeIn(2)}><Button>Action</Button></div>
```

This is the correct pattern for staggered reveals. Do not make reduced motion an afterthought — write `fadeIn` this way from the start.

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

### Accessibility: what Transition gives you (and what it doesn't)

`Transition` sets `aria-hidden="true"` on the element when `in={false}` — screen readers won't read exiting content. That's the only accessibility feature it provides.

**What it does NOT do:**
- No `visibility: hidden` or `display: none` on exited elements — a fully exited element (opacity 0.01) still takes up space and can receive keyboard focus
- No focus management — no focus trap, no focus restoration
- No `inert` attribute

**Always use `unmountOnExit`** unless you have a specific reason to keep the element in the DOM. An opacity-0 element that keyboard users can tab into is a bug.

```tsx
// ✅ unmountOnExit removes the element from the DOM and from tab order after exit
<Transition in={open} type="slide-right" transitionOnMount unmountOnExit>
  <YourPanel />
</Transition>

// ❌ Without unmountOnExit, a hidden panel is still keyboard-reachable
<Transition in={open} type="slide-right" transitionOnMount>
  <YourPanel />
</Transition>
```

### Enter-only animation (mount + no exit)

When rendering conditionally (`{open && <Component />}`), React removes the element from the DOM immediately on close — there is no exit animation.

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
>
  <YourPanel />
</Transition>
```

### Full pattern with reduced motion

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Enter + exit, accessible
{prefersReducedMotion
  ? open && <YourPanel />
  : (
    <Transition in={open} type="slide-right" transitionOnMount unmountOnExit>
      <YourPanel />
    </Transition>
  )
}
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

The `!important` ensures the transition overrides any conflicting animation on the element — and is also why CSS-based reduced-motion suppression cannot work against `Transition`.

---

## Custom Keyframe Animations

Use custom `@keyframes` when `Transition`'s built-in types aren't enough:

| Use `Transition` | Use custom `@keyframes` |
|---|---|
| Simple fade, scale, or directional slide | Multi-step sequence (more than 2 keyframe stops) |
| Single element enter/exit | Staggered reveal across N elements |
| Exit animation needed (`unmountOnExit`) | Looping animations |
| Layout push behavior (use `DrawerLayout`) | Interaction-triggered re-fire (e.g. wave on hover) |

### Injecting keyframes: use `Global`, not `keyframes`

`@instructure/emotion` exports a `keyframes` utility. **Do not use it alone.** `keyframes` creates a named object but does not inject the `@keyframes` CSS rule into the document unless used inside emotion's CSS pipeline. Setting `el.style.animation` with the returned name will silently fail.

**Correct approach:** use `Global` from `@instructure/emotion` to inject the rule as a plain CSS string, wrapped in a reduced-motion media query.

```tsx
import { Global } from '@instructure/emotion'

// ✅ Always wrap in the media query — if the keyframe isn't defined,
// applying it is a no-op and the element renders at its final state immediately
<Global styles={`
  @media (prefers-reduced-motion: no-preference) {
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  }
`} />
```

`Global` goes through emotion's injection pipeline — SSR-safe, deduplicated, managed by the active emotion cache. It renders no DOM node.

### Staggered reveal — the full correct pattern

```tsx
import { Global } from '@instructure/emotion'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fadeIn = (i: number): React.CSSProperties =>
  prefersReducedMotion
    ? {}
    : { opacity: 0, animation: `fade-in 300ms ease-out ${i * 150}ms both` }

function AgentResponse() {
  return (
    <>
      <Global styles={`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `} />
      <div style={fadeIn(0)}><Text>Here's what I found…</Text></div>
      <div style={fadeIn(1)}><Text>Some details here.</Text></div>
      <div style={fadeIn(2)}><Button color="primary">Take action</Button></div>
    </>
  )
}
```

- `animation-fill-mode: both` keeps each element invisible during its delay and visible after completion
- `150ms` stagger between elements; adjust to taste
- `300ms ease-out` matches InstUI's `Transition` duration

### Re-triggering animations: use `elementRef` + direct DOM mutation

For user-triggered animations that need to re-fire (e.g. hover-to-wave), React state alone is insufficient — removing and re-adding a style in the same render cycle won't restart the animation.

```tsx
import { useRef } from 'react'
import { Global } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function WavingHand() {
  const handRef = useRef<HTMLElement | null>(null)

  function wave() {
    if (prefersReducedMotion) return
    const el = handRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetWidth            // force reflow — restarts the animation clock
    el.style.animation = 'wave 0.7s ease-in-out'
    el.addEventListener('animationend', () => { el.style.animation = '' }, { once: true })
  }

  return (
    <>
      <Global styles={`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes wave {
            0%   { transform: rotate(0deg); }
            20%  { transform: rotate(20deg); }
            40%  { transform: rotate(-15deg); }
            60%  { transform: rotate(18deg); }
            80%  { transform: rotate(-8deg); }
            100% { transform: rotate(0deg); }
          }
        }
      `} />
      <View
        as="span"
        display="inline-block"
        elementRef={(el) => { handRef.current = el as HTMLElement | null }}
        style={{ transformOrigin: 'bottom center' }}
        onMouseEnter={wave}
      >
        👋
      </View>
    </>
  )
}
```

- Check `prefersReducedMotion` at the top of the handler — return early if true
- `void el.offsetWidth` forces a reflow; this is the standard browser technique with no InstUI-specific alternative
- `style={{ transformOrigin: '...' }}` on `View` sets a persistent base style; the `animation` property is set and cleared directly without conflict

### Ellipsis cycling animation

```tsx
<Global styles={`
  @media (prefers-reduced-motion: no-preference) {
    @keyframes ellipsis-dot2 {
      0%, 33%   { opacity: 0; }
      34%, 100% { opacity: 1; }
    }
    @keyframes ellipsis-dot3 {
      0%, 66%   { opacity: 0; }
      67%, 100% { opacity: 1; }
    }
  }
`} />

<View as="span" display="inline-block">
  <Text weight="bold" color="secondary">.</Text>
  <span style={{ animation: 'ellipsis-dot2 0.9s linear infinite', opacity: 0 }}>
    <Text weight="bold" color="secondary">.</Text>
  </span>
  <span style={{ animation: 'ellipsis-dot3 0.9s linear infinite', opacity: 0 }}>
    <Text weight="bold" color="secondary">.</Text>
  </span>
</View>
```

When reduced motion is preferred, the keyframes are never defined and the dots render at `opacity: 0` permanently — so the ellipsis simply doesn't appear. If you need the ellipsis to always be visible (just static), conditionally omit the `opacity: 0` initial state:

```tsx
const dotStyle = (anim: string): React.CSSProperties =>
  prefersReducedMotion ? {} : { animation: anim, opacity: 0 }
```

---

## Animated SVGs

For loading states, prefer InstUI's `Spinner` — it owns its own animation and you don't need to manage any of this.

```tsx
import { Spinner } from '@instructure/ui-spinner/latest'
<Spinner renderTitle="Loading" size="medium" />
```

For custom inline SVG animations (path morphing, custom spinners, icon transitions):

- Apply animations via `Global` + `@keyframes`, same as above — not SMIL (`<animate>`, `<animateMotion>`). SMIL has inconsistent browser support and doesn't respect CSS reduced-motion without extra work.
- Wrap the keyframe in `@media (prefers-reduced-motion: no-preference)`.
- For a custom spinner that should stop (not just freeze) under reduced motion, add a fallback static state:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<Global styles={`
  @media (prefers-reduced-motion: no-preference) {
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
`} />

<svg
  style={prefersReducedMotion
    ? { opacity: 0.5 }  // static "pending" visual
    : { animation: 'spin 1s linear infinite' }
  }
>
  {/* ... */}
</svg>
```

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

`DrawerLayout` uses `Transition` internally, so its animation also cannot be suppressed by CSS media query. If reduced motion matters, the simplest approach is to render the tray open by default (no animation) when `prefersReducedMotion` is true — the push layout still works, it just snaps instead of animating.

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
| `themeOverride` | `object` | Use `{ background: sharedTokens.background.pageColor }` to match page background |
| `onDismiss` | `() => void` | Called on Escape or document click (if enabled) |

### DrawerLayout.Content props

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required for a11y |
| `contentRef` | `(el) => void` | Ref to the content DOM element |
| `onSizeChange` | `({ width, height }) => void` | Called when content area dimensions change |

### Integrating with a flex shell

```tsx
<Flex height="100vh" width="100%">
  <SideNavBar />
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
| Animation patterns without reduced-motion handling | Always include `prefersReducedMotion` guard — this code ships to production |
| `@media (prefers-reduced-motion: reduce)` CSS to suppress `Transition` | `Transition` uses `!important` — use JS detection and skip `Transition` entirely |
| `keyframes` from `@instructure/emotion` used alone with `el.style.animation` | Use `Global` to inject the `@keyframes` string — `keyframes` alone never puts the rule in the document |
| `Global` at module scope (outside the React tree) | `Global` must render inside the component tree so emotion's cache context is active |
| `<span className="my-anim">` with a raw `<style>` tag | `<View as="span" elementRef={...}>` + `<Global styles={...}>` |
| `{open && <Transition in type="...">}` expecting an exit animation | Use `<Transition in={open} unmountOnExit>` outside the conditional |
| `<Transition>` without `unmountOnExit` | Without it, a hidden element (opacity 0.01) is still keyboard-reachable |
| `Transition` for a panel that should push content | Use `DrawerLayout` — `Transition` alone causes layout to snap |
| Setting `style={{ transform: '...' }}` to position the panel | `Transition` manages transforms — don't set them manually |
| Import from `@instructure/ui-motion/latest` | Import from `@instructure/ui-motion` directly — no `/latest` suffix |
| SMIL animations (`<animate>`, `<animateMotion>`) in SVGs | CSS `@keyframes` via `Global` — consistent browser support, works with reduced-motion CSS guard |
| Custom spinner SVG animation without a static fallback | Show a static opacity-reduced state when `prefersReducedMotion` is true |

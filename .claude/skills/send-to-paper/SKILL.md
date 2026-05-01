---
name: send-to-paper
description: >
  Translates an InstUI React prototype into a Paper MCP design. Use when asked to
  recreate, mock up, or send an existing InstUI component or screen to Paper. Covers
  the full workflow: token resolution (via get-tokens), icon lookup (via get-icons),
  component-to-CSS mapping, and Paper layout rules.
---

# Send to Paper — InstUI → Paper Translation Guide

> Quick-nav: [Workflow](#workflow) · [Typography](#typography) · [Spacing](#spacing) · [Component Mappings](#component-mappings) · [Icons in Paper](#icons-in-paper) · [Paper Layout Rules](#paper-layout-rules) · [Anti-Patterns](#anti-patterns)

---

## Workflow

1. **Read the prototype TSX** — identify every InstUI component, token path, and prop used.
2. **Resolve tokens** — invoke the `get-tokens` skill for any token values you need. Do not guess or use hardcoded values from memory. Ask for background, stroke, borderRadius, spacing as a group at the start of each session.
3. **Check fonts** — call `get_font_family_info(["Atkinson Hyperlegible Next", "Inclusive Sans"])` once per session (both are available in this project).
4. **Find icon SVG paths** — invoke the `get-icons` skill to find the correct icon name, then read the SVG path data from the source file the skill points to.
5. **Create artboard** — set background to `background.pageColor` (resolved via get-tokens).
6. **Build incrementally** — one visual group per `write_html` call: window shell → header → body sections → input area.
7. **Screenshot and fix** — after each major section, screenshot and check against the [Review Checklist](#review-checklist).
8. **Size the window** — set the window to `height: fit-content` when done to eliminate dead scroll space in static designs.
9. **Call `finish_working_on_nodes`** when done.

---

## Typography

### Font Families

| Role | Family | Paper CSS |
|---|---|---|
| Body (`fontFamily.base`) | Atkinson Hyperlegible Next | `font-family: "Atkinson Hyperlegible Next", Helvetica, Arial, sans-serif` |
| Heading (`fontFamily.heading`) | Inclusive Sans | `font-family: "Inclusive Sans", Helvetica, Arial, sans-serif` |

Always pass the full stack. Never use Inter.

### Non-Obvious Type Scale Traps

These are the values most commonly guessed wrong — verify against `components/heading.js` via get-tokens if unsure:

| Level / Variant | Size | Weight | Trap |
|---|---|---|---|
| h2 / `titleSection` | 28px | **600** | Often guessed as 700 |
| h3 / `titleCardRegular` | 20px | 700 | — |
| h4 / `titleCardMini` | 16px | **700** | Often guessed as 600 |
| Body default | **16px** | 400 | Often guessed as 14px |
| Body small | 14px | 400 | — |
| Button | **16px** | **600** | Often guessed as 14px/400 |

**Line height:** 125% for headings.

---

## Spacing

InstUI prop values → CSS px (from `legacy.spacing` — what View/Flex component props resolve to):

| Prop value | px |
|---|---|
| `xxx-small` | 2px |
| `xx-small` | 6px |
| `x-small` | 8px |
| `small` | 12px |
| `mediumSmall` | 16px |
| `medium` | 24px |
| `large` | 36px |
| `x-large` | 48px |

---

## Component Mappings

These mappings encode the non-obvious translation traps — the things that are correct in InstUI but look wrong if you naively inspect CSS. Resolve any hex values using `get-tokens` rather than copying from memory.

### View (`borderColor="primary"`)

**Critical trap:** `borderColor="primary"` without a `themeOverride` resolves to `borderColorPrimary` = `stroke.mutedColor` (grey20) — NOT `stroke.baseColor` (grey70). This is the most common mistake when translating View borders.

| View prop | What it actually renders |
|---|---|
| `borderColor="primary"` (no override) | `stroke.mutedColor` — the subtle/muted border |
| `borderColor="primary"` + `themeOverride={{ borderColorPrimary: sharedTokens.stroke.baseColor }}` | `stroke.baseColor` — the standard visible border |
| `background="secondary"` + `themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}` | Page background color |
| `background="primary"` + `themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}` | White card surface |
| `shadow="resting"` | elevation1 shadow |

Use `get-tokens` to resolve the actual hex for `stroke.mutedColor`, `stroke.baseColor`, `background.pageColor`, `background.containerColor`.

### Button (`color="secondary"`)

```css
background: <background.secondary — navy30>;
border: 1px solid <same as bg — effectively invisible>;
color: <text.interactive.action.secondary.base — navy170>;
border-radius: 12px;             /* borderRadius.interactive.base */
height: 40px;                    /* size.interactive.height.md */
font-size: 16px;
font-weight: 600;
font-family: "Atkinson Hyperlegible Next", Helvetica, Arial, sans-serif;
```

**Trap:** secondary button border color = background color = invisible. Do not draw a visible border on secondary filled buttons.

### IconButton (`color="secondary" withBackground={false}`) — ghost variant

```css
background: transparent;
border: 1px solid <secondaryGhostBorderColor — navy30>;   /* VISIBLE on transparent bg */
color: <navy170>;
border-radius: 12px;
width: 32px; height: 32px;      /* size.interactive.height.sm */
```

**Trap:** ghost icon button border IS visible (it's navy30 on transparent — you can see it). This is the opposite of the filled secondary button.

### IconButton on gradient/brand surface (`color="primary-inverse" withBackground={false} withBorder={false}`)

```css
background: transparent;
border: none;
color: white;                   /* onColor */
```

### Pill (`color="info"`)

```css
background: white;               /* background.base — NOT blue10 */
border: 1px solid <stroke.infoColor — blue100>;
color: <text.info — blue110>;    /* NOT blue120 */
border-radius: 8px;              /* borderRadius.md — NOT 999rem */
height: 24px;
padding: 0 8px;                  /* spaceSm horizontal */
font-size: 12px;
font-weight: 600;
```

**Trap:** Pill background is always `background.base` (white), not the status tint (blue10, green10, etc.). The info color distinguishes only border and text, not fill. Border-radius is `borderRadius.md` = 8px — do not use 999rem/999px.

### AI Gradient Header

```css
background: linear-gradient(to bottom, <aiTopGradientColor> 0%, <aiBottomGradientColor> 100%);
/* or left-to-right: */
background: linear-gradient(to right, <aiTopGradientColor> 0%, <aiBottomGradientColor> 100%);
```

Content on AI gradient: text = white (`text.onColor`), icons = white (`icon.onColor`).

Resolve `aiTopGradientColor` and `aiBottomGradientColor` using `get-tokens`.

---

## Icons in Paper

InstUI icons cannot use CSS `currentColor` inheritance in Paper — they're rendered as static design nodes. **Always hardcode stroke/fill** using the resolved token value.

| InstUI prop | Paper SVG attribute |
|---|---|
| No `color` prop (default) | `stroke: <text.base hex>` — the parent text color, usually dark grey |
| `color="onColor"` | `stroke: white` or `fill: white` |
| `color="brand"` | `stroke: <icon.info — blue110>` — **legacy alias that maps to `infoColor`, NOT navy** |
| `color="muted"` | `stroke: <grey120 hex>` or `fill: <grey120 hex>` |

**Finding SVG paths:** invoke `get-icons` to identify the correct `*InstUIIcon` component name. The skill will point you to the source file. Lucide icons are stroke-based (`viewBox="0 0 24 24"`, `fill="none"`, `stroke-width="2"`). Custom icons (IgniteAI, AiInfo, Canvas product icons) are fill-based.

---

## Paper Layout Rules

Key constraints that differ from normal CSS:

- **No `margin`** — use `padding` and `gap` for all spacing.
- **`display: flex`** is the primary layout primitive. Use `flexDirection: "column"` for vertical stacks.
- **Font sizes in `px`** — always, not `rem` or `em`.
- **`height: fit-content`** — use on the window container when done building to eliminate dead scroll space in static designs.
- **`flex: 0 0 auto`** on body sections prevents stretching in static designs — avoids gap between content and a pinned input area.
- **`flex: 1`** creates visual dead space in static Paper designs if content doesn't fill the height. Prefer `flex: 0 0 auto` in Paper.
- Artboard height is a starting point — always adjust or switch to `fit-content` at the end.

---

## Review Checklist

After each major section, screenshot and check:

- [ ] **Border colors** — did `borderColor="primary"` have a `themeOverride`? No override = `stroke.mutedColor` (subtle). Override = `stroke.baseColor` (visible).
- [ ] **Font sizes** — h2=28px, h4=16px, body default=16px, small=14px. Do not use 12px for descriptions.
- [ ] **Font weights** — h2/h5/h6 headings=600, h3/h4 headings=700, body strong / buttons=600, body=400.
- [ ] **Icon colors** — no color prop means `text.base` (dark grey). `color="brand"` is a legacy alias → `icon.info` = blue110, NOT navy. Never use amber/warm tones unless the icon has an explicit color prop.
- [ ] **Pill** — background is always white (`background.base`), NOT a status tint. Border-radius is 8px (`borderRadius.md`), NOT 999rem. Text = `text.info` (blue110).
- [ ] **Button borders** — secondary filled button border = same as bg (invisible). Ghost/withBackground=false border = navy30 (visible).
- [ ] **Dead space below content** — if using `flex: 1` on body, switch to `flex: 0 0 auto` + `height: fit-content` on window.

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Guess token hex values | Invoke `get-tokens` — trace background, stroke, borderRadius as a group at session start |
| Copy token values from memory or the summary | Re-resolve via `get-tokens`; values differ between light/dark/high-contrast themes |
| Assume `borderColor="primary"` = visible grey border | It's `stroke.mutedColor` (subtle) by default — check for `themeOverride` in the source |
| Use amber/warm color for a default icon | No color prop = `currentColor` = `text.base` = dark grey |
| Use navy for `color="brand"` icons | `color="brand"` is a deprecated legacy alias → `icon.info` = blue110 (`#2871AF`) |
| Use blue10 fill or 999rem radius for Pill | Pill background is always white; border-radius is 8px (`borderRadius.md`) |
| Rely on CSS `color` inheritance for icons in Paper | Hardcode stroke/fill in Paper SVGs |
| Draw custom SVG shapes for icons | Use `get-icons` to find the icon name, then read real paths from the source file |
| Use `Inter` as the font | Atkinson Hyperlegible Next (body), Inclusive Sans (headings) |
| Use 14px for body/button text | Default body = 16px, buttons = 16px |
| Use 400 weight for buttons | Buttons use `fontWeight.body.strong` = 600 |
| Use `flex: 1` on body in a static Paper design | `flex: 0 0 auto` to avoid dead space below content |
| Use `margin` for spacing in Paper | `padding` and `gap` only |

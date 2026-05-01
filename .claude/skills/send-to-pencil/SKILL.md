---
name: send-to-pencil
description: >
  Translates an InstUI React prototype into a Pencil MCP design (.pen file).
  Use when asked to recreate, mock up, or send an existing InstUI component or
  screen to Pencil. Covers the full workflow: token resolution (via get-tokens),
  icon mapping to Lucide, component → .pen schema mapping, Pencil layout rules,
  and cross-batch ID management.
---

# Send to Pencil — InstUI → Pencil Translation Guide

> Quick-nav: [Workflow](#workflow) · [ID Management](#id-management) · [Auditing & Bulk Fixes](#auditing--bulk-fixes) · [Typography](#typography) · [Spacing](#spacing) · [Gradients](#gradients) · [Component Mappings](#component-mappings) · [Icons](#icons) · [Pencil Layout Rules](#pencil-layout-rules) · [Token Reference](#token-reference) · [Anti-Patterns](#anti-patterns)

---

## Workflow

1. **Read the prototype TSX** — identify every InstUI component, token path, and prop used.
2. **Get editor state** — call `get_editor_state({ include_schema: true })` once per session to load the .pen schema. Required before any read or write operations.
3. **Resolve tokens** — invoke the `get-tokens` skill for precise hex values. Never guess. Resolve `background`, `stroke`, `borderRadius`, and `spacing` as a group at session start. Key light-theme values are tabulated in the [Token Reference](#token-reference) section below as a starting point — always verify before use.
4. **Get variables** — call `get_variables()` to check if the file has design tokens already defined. If it does, use `$variable-name` references instead of hardcoded hex.
5. **Plan batches** — design the node tree on paper first. Each `batch_design` call is limited to **25 operations** and bindings do not survive across calls. Assign explicit `id` values to structural nodes you'll need to reference later — but verify the actual IDs via `snapshot_layout` after creation (see [ID Management](#id-management)).
6. **Build incrementally** — one logical section per `batch_design` call: window shell + header → body sections → input area. Use `placeholder: true` on the window frame throughout.
7. **Screenshot and fix** — after each batch, call `get_screenshot(windowNodeId)` and check against the [Review Checklist](#review-checklist).
8. **Audit fonts** — when the design is complete, call `search_all_unique_properties` on the window node for `fontFamily`. Fix any `Inter` or fallback stacks in one call with `replace_all_matching_properties` (see [Auditing & Bulk Fixes](#auditing--bulk-fixes)).
9. **Remove placeholder** — when all sections are done, `U(windowNodeId, { placeholder: false })`.

---

## ID Management

This is the most important Pencil-specific concern. **Bindings from one `batch_design` call are not available in the next.**

### The problem

```javascript
// Batch 1 — creates a frame with binding "content"
content=I(document, {type:"frame", layout:"vertical"})

// Batch 2 — FAILS: "content" binding does not exist here
I(content, {type:"text", content:"Hello"})  // ❌ "Can't find parent node with id 'content'"
```

### Solution A — Specify explicit `id` properties and verify them

Set an `id` on nodes you'll need to reference later:

```javascript
I(document, {id:"agent-content", type:"frame", layout:"vertical"})
```

**Critical:** The `id` you specify in the node properties is used as the actual node ID in the document. You can then reference `"agent-content"` directly in later batches.

However, **always verify** by calling `snapshot_layout` after your first batch. The tool may not honor your specified ID in all cases — confirm the actual ID before building on top of it.

### Solution B — Use `snapshot_layout` to find IDs

After batch 1, call `snapshot_layout` to get the actual node IDs in the document tree. Use those IDs as string literals in subsequent batches:

```javascript
// After batch 1, snapshot shows: {"id":"DdpvA", "children":[{"id":"duy1J",...}]}
// In batch 2, use the actual ID:
I("duy1J", {type:"text", content:"Hello"})  // ✓
```

### Placeholder removal

Since the window frame's ID is needed to remove `placeholder: true`, always note it after batch 1. Either:
- Use `snapshot_layout` on the document to find it, or
- Assign it an explicit `id` like `"agent-win"` and verify it was honored

---

## Auditing & Bulk Fixes

Two tools let you inspect and repair properties across the entire node tree without iterating by ID.

### `search_all_unique_properties`

Returns every unique value for the requested properties found anywhere in a subtree:

```javascript
search_all_unique_properties({
  filePath: "design.pen",
  parents: ["windowNodeId"],
  properties: ["fontFamily", "fontSize", "textColor", "fillColor", "strokeColor"]
})
// → { fontFamily: ["Inclusive Sans", "Atkinson Hyperlegible Next", "Inter"], ... }
```

**Always run this after building** to catch wrong fonts, stray colors, and unexpected sizes before handing the design to a reviewer.

### `replace_all_matching_properties`

Replaces every matching value in the subtree in a single call — no node IDs needed:

```javascript
replace_all_matching_properties({
  filePath: "design.pen",
  parents: ["windowNodeId"],
  properties: {
    fontFamily: [
      { from: "Inter",  to: "Atkinson Hyperlegible Next" },
      { from: "Atkinson Hyperlegible Next, Helvetica Neue, Helvetica, Arial, sans-serif",
        to: "Atkinson Hyperlegible Next" }
    ]
  }
})
```

### Standard font audit

Run this search after every design session and fix anything that isn't in the allowed set:

| Allowed | Wrong — replace with |
|---|---|
| `"Inclusive Sans"` | — |
| `"Atkinson Hyperlegible Next"` | — |
| `"Inter"` | `"Atkinson Hyperlegible Next"` |
| Any fallback stack (`"Atkinson Hyperlegible Next, Helvetica..."`) | `"Atkinson Hyperlegible Next"` |

**Why fallback stacks appear:** Pencil rejects multi-family strings silently and falls back to the system font. If a text node was created with a CSS-style font stack copied from code, it won't render correctly — the whole string must be stripped to the primary name.

---

## Typography

### Font Families

| Role | InstUI token | Pencil `fontFamily` value |
|---|---|---|
| Body (`fontFamily.base`) | Atkinson Hyperlegible Next | `"Atkinson Hyperlegible Next"` |
| Heading (`fontFamily.heading`) | Inclusive Sans | `"Inclusive Sans"` |

**Pencil trap:** Font fallback stacks (e.g. `"Atkinson Hyperlegible Next, Helvetica, Arial, sans-serif"`) are reported as invalid by Pencil's font validator. Use only the primary font name. If the font isn't installed on the system, Pencil silently falls back to the system default — the design still renders but won't match exactly.

Apply `fontFamily` per text node — there is no document-level font default.

### Type Scale

| InstUI level / variant | Size | Weight | Family |
|---|---|---|---|
| `Heading level="h2" variant="titleCardRegular"` | 20px | 700 | Inclusive Sans |
| `Heading level="h4"` / `titleCardMini` | 16px | 700 | Inclusive Sans |
| Body default (`<Text>`) | 16px | 400 | Atkinson Hyperlegible Next |
| Body small (`<Text size="small">`) | 14px | 400 | Atkinson Hyperlegible Next |
| Button label | 16px | 600 | Atkinson Hyperlegible Next |
| `<Pill>` label | 14px | 600 | Atkinson Hyperlegible Next |
| Small label (`<Text size="x-small">`) | 12px | 400 | Atkinson Hyperlegible Next |

**Trap:** Body default is 16px, not 14px. `<Text size="small">` is 14px, not 12px.

---

## Spacing

InstUI prop values → px (from `semantics.spacing` / `legacy.spacing`):

| Prop value | px | Pencil gap/padding |
|---|---|---|
| `xxx-small` | 2px | 2 |
| `xx-small` | 6px | 6 |
| `x-small` | 8px | 8 |
| `small` | 12px | 12 |
| `mediumSmall` | 16px | 16 |
| `medium` | 24px | 24 |
| `large` | 36px | 36 |
| `x-large` | 48px | 48 |

**Trap:** `gap="large"` = 36px, not 24px. `gap="medium"` = 24px. Easy to confuse.

Pencil padding accepts `[vertical, horizontal]` (2-value) or `[top, right, bottom, left]` (4-value). Example: `padding="large medium"` → `padding: [36, 24]`.

---

## Gradients

The Pencil gradient `rotation` value is **counterclockwise degrees from "up"** — the opposite convention from CSS degrees.

| CSS direction | CSS angle | Pencil rotation |
|---|---|---|
| `to bottom` | `180deg` | `0` |
| `to top` | `0deg` | `180` |
| `to right` | `90deg` | `270` |
| `to left` | `270deg` | `90` |

### AI gradient header (left-to-right)

The InstUI pattern `linear-gradient(to right, aiTopGradientColor 0%, aiBottomGradientColor 100%)` translates to:

```javascript
fill: {
  type: "gradient",
  gradientType: "linear",
  rotation: 270,   // "to right" in Pencil
  colors: [
    { color: "#9E58BD", position: 0 },    // aiTopGradientColor (violet100)
    { color: "#00828E", position: 1 }     // aiBottomGradientColor (sea100)
  ]
}
```

### AI gradient text ("Hello, Zoe!")

Same fill object applied directly to a `text` node:

```javascript
{
  type: "text",
  content: "Hello, Zoe!",
  fontSize: 22,
  fontWeight: "700",
  fill: {
    type: "gradient",
    gradientType: "linear",
    rotation: 270,
    colors: [
      { color: "#9E58BD", position: 0.2 },
      { color: "#00828E", position: 0.81 }
    ]
  }
}
```

---

## Component Mappings

Resolve all hex values via `get-tokens` — the table in [Token Reference](#token-reference) is a starting point, not a substitute.

### View card / container

```javascript
{
  type: "frame",
  cornerRadius: 24,          // borderRadius.card.lg — or 16 for card.md
  fill: "#FFFFFF",           // background.containerColor
  effect: { type: "shadow", shadowType: "outer", offset: {x:0, y:4}, blur:16, color:"#00000026" }
}
```

### View border — `borderColor="primary"`

**Critical trap:** `borderColor="primary"` without a `themeOverride` = `stroke.mutedColor` (#E8EAEC, nearly invisible). With `themeOverride={{ borderColorPrimary: sharedTokens.stroke.baseColor }}` = `stroke.baseColor` (#8D959F, visible grey).

Always check the source TSX for `themeOverride` before deciding the stroke color.

```javascript
// No themeOverride → subtle muted border
stroke: { align: "inside", thickness: 1, fill: "#E8EAEC" }

// With borderColorPrimary override → visible base border
stroke: { align: "inside", thickness: 1, fill: "#8D959F" }
```

### Button (`color="secondary"`)

```javascript
{
  type: "frame",
  layout: "horizontal",
  alignItems: "center",
  width: "fill_container",
  height: 40,                // size.interactive.height.md
  padding: [10, 16],
  cornerRadius: 12,          // borderRadius.interactive.base
  fill: "#D5E2F6",           // background.interactive.action.secondary.base (navy30)
  stroke: { align:"inside", thickness:1, fill:"#D5E2F6" }  // same as bg → invisible
}
// Child text:
{ type: "text", content: "Action", fontSize: 16, fontWeight: "600", fill: "#1D354F" }
```

**Trap:** Secondary button border = background color → invisible. Do not draw a grey border.

### Pill (`color="info"`)

```javascript
// Pill container
{
  type: "frame",
  layout: "horizontal",
  padding: [2, 8],
  cornerRadius: 8,           // borderRadius.md — NOT 999
  fill: "#FFFFFF",           // always white — NOT a blue tint
  stroke: { align:"inside", thickness:1, fill:"#2B7ABC" }  // stroke.infoColor (blue100)
}
// Pill text
{ type: "text", content: "Start here", fontSize: 14, fontWeight: "600", fill: "#2871AF" }  // text.info (blue110)
```

**Traps:**
- Pill background is always **white**, not a status tint (#EBF4FF etc.)
- Border radius is **8px** (`borderRadius.md`), not 999rem/px
- Text color is blue110 (`#2871AF`), not navy

### AI gradient header bar

```javascript
{
  type: "frame",
  layout: "horizontal",
  justifyContent: "space_between",
  alignItems: "center",
  width: "fill_container",
  padding: [12, 16],
  cornerRadius: [24, 24, 0, 0],   // rounds only top corners when at top of card
  fill: {
    type: "gradient", gradientType: "linear", rotation: 270,
    colors: [{ color: "#9E58BD", position: 0 }, { color: "#00828E", position: 1 }]
  }
}
// White icon inside: fill: "#FFFFFF"
// White text inside: fill: "#FFFFFF"
```

---

## Icons

**Use actual SVG path data** — not `icon_font`. Extract `d` attributes from the source files in `node_modules` and render them as Pencil `path` nodes. This ensures pixel-perfect fidelity rather than a Lucide glyph approximation.

### Finding path data

**Lucide icons** — read `node_modules/lucide-react/dist/esm/icons/{kebab-name}.js`. The `__iconNode` array contains `["path", {d:"..."}]` entries. Each entry is one subpath.

**Custom InstUI icons** — read `node_modules/@instructure/ui-icons/lib/generated/custom/index.js`. Search for `{IconName}Paths` to find the JSX definition. Custom icons use `fill: color` (fill-based) or `stroke: color, fill: "none"` (stroke-based).

### Combining multi-subpath icons

Most icons have 2–8 subpaths. Combine them into a single `geometry` d-string by joining with a space, using **absolute M** commands to start each subpath (convert any leading lowercase `m` to uppercase). If multiple subpaths share the same fill or stroke, a single `path` node with combined geometry renders identically to separate paths.

```javascript
// WandSparkles: 8 subpaths combined
{
  type: "path",
  width: 24, height: 24,
  viewBox: [0, 0, 24, 24],
  geometry: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72 M14 7 17 10 M5 6 5 10 M19 14 19 18 M10 2 10 4 M7 8 3 8 M21 16 17 16 M11 3 9 3",
  fill: "#FFFFFF00",      // transparent fill for stroke-only paths
  stroke: { fill: "#2871AF", thickness: 1.5, cap: "round", join: "round", align: "center" }
}
```

**Transparent fill trap:** `fill: "none"` is **invalid** in Pencil. For stroke-only paths, use `fill: "#FFFFFF00"` (white with 0 alpha = fully transparent).

**Stroke thickness:** Use `thickness: 1.5` for all Lucide icon paths, regardless of display size. Lucide SVGs use `stroke-width: 2` in a 24×24 coordinate space, but Pencil applies `thickness` in screen pixels (not scaled with the viewBox). At `thickness: 2`, icons render visually heavier than their web counterpart. `thickness: 1.5` matches the visual weight of the web rendering.

### Stroke vs fill icons

| Icon set | Rendering | Path `fill` | Path `stroke` |
|---|---|---|---|
| Lucide (all) | Stroke-based | `"#FFFFFF00"` | `{fill:"#hex",thickness:2,cap:"round",join:"round",align:"center"}` |
| `IgniteaiLogoInstUIIcon` | Fill-based (2 subpaths) | `"#hex"` | (omit) |
| `AiInfoInstUIIcon` | Stroke-based (1 path, circle+letters) | `"#FFFFFF00"` | `{fill:"#hex",thickness:2,...}` |

### Path data reference (verified from source)

| InstUI icon | Source file | Subpaths | Combined `d` |
|---|---|---|---|
| `IgniteaiLogoInstUIIcon` | `custom/index.js` line 503 | 2 fill | `M11.0621 2.53451C11.3843 1.66389 12.6157 1.66389 12.9379 2.53451L15.0815 8.32767C15.1828 8.60139 15.3986 8.8172 15.6723 8.91848L21.4655 11.0621C22.3361 11.3843 22.3361 12.6157 21.4655 12.9379L15.6723 15.0815C15.3986 15.1828 15.1828 15.3986 15.0815 15.6723L12.9379 21.4655C12.6157 22.3361 11.3843 22.3361 11.0621 21.4655L8.91849 15.6723C8.8172 15.3986 8.60139 15.1828 8.32767 15.0815L2.53451 12.9379C1.66389 12.6157 1.66389 11.3843 2.53451 11.0621L8.32767 8.91849C8.60139 8.8172 8.8172 8.60139 8.91848 8.32767L11.0621 2.53451Z M19.5311 1.26725C19.6922 0.831943 20.3078 0.831944 20.4689 1.26725L21.0804 2.91964L22.7327 3.53107C23.1681 3.69215 23.1681 4.30785 22.7327 4.46893L21.0804 5.08036L20.4689 6.73275C20.3078 7.16806 19.6922 7.16806 19.5311 6.73275L18.9196 5.08036L17.2673 4.46893C16.8319 4.30785 16.8319 3.69215 17.2673 3.53107L18.9196 2.91964L19.5311 1.26725Z` |
| `AiInfoInstUIIcon` | `custom/index.js` line 47 | 1 stroke | `M15.6215 9.09155V15.0597M7.25786 15.0598L9.19423 9.4645C9.24716 9.31141 9.34651 9.17864 9.47844 9.08467C9.61037 8.99069 9.76832 8.94019 9.9303 8.94019C10.0923 8.94019 10.2502 8.99069 10.3822 9.08467C10.5141 9.17864 10.6134 9.31141 10.6664 9.4645L12.6027 15.0598M7.79008 13.5327H12.0706M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z` |
| `HandInstUIIcon` | `lucide/hand.js` | 4 stroke | `M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2 M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2 M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15` |
| `WandSparklesInstUIIcon` | `lucide/wand-sparkles.js` | 8 stroke | `m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72 M14 7 17 10 M5 6 5 10 M19 14 19 18 M10 2 10 4 M7 8 3 8 M21 16 17 16 M11 3 9 3` |
| `LibraryInstUIIcon` | `lucide/library.js` | 4 stroke | `M16 6 20 20 M12 6 12 20 M8 8 8 20 M4 4 4 20` |
| `XInstUIIcon` | `lucide/x.js` | 2 stroke | `M18 6 6 18 M6 6 18 18` |
| `PlusInstUIIcon` | `lucide/plus.js` | 2 stroke | `M5 12 19 12 M12 5 12 19` |
| `ArrowUpInstUIIcon` | `lucide/arrow-up.js` | 2 stroke | `M5 12 12 5 19 12 M12 19 12 5` |

### Icon color mapping

**`color="brand"` trap:** This is a **deprecated legacy alias** that maps to `componentTheme.infoColor` → `semantics.color.icon.info` = blue110 = `#2871AF` — NOT navy. Verify by checking `node_modules/@instructure/ui-icons/lib/styles.js` line: `brand: componentTheme.infoColor`.

| InstUI `color` prop | Pencil path `stroke.fill` or `fill` | Token |
|---|---|---|
| (none / default) | `#273540` | `semantics.color.icon.base` (grey170) |
| `color="brand"` | `#2871AF` | `semantics.color.icon.info` (blue110) — legacy alias |
| `color="onColor"` | `#FFFFFF` | White — for icons on gradient/brand surfaces |
| `color="muted"` | `#576773` | `semantics.color.icon.muted` (grey120) |
| `color="info"` | `#2871AF` | `semantics.color.icon.info` (blue110) |

### Icon button frames

Icon buttons are frames containing a path node. Always check the source for `color`, `withBackground`, `withBorder`, and `size`.

**Primary filled** (`color="primary"`):
```javascript
// Frame
{ type:"frame", width:32, height:32, cornerRadius:12, layout:"horizontal", justifyContent:"center", alignItems:"center",
  fill:"#1D354F",   // semantics.color.interactive.action.primary.base (navy170)
  stroke:{ fill:"#1D354F", thickness:1, align:"inside" }  // invisible border
}
// Icon inside (white)
{ type:"path", ..., fill:"#FFFFFF00", stroke:{ fill:"#FFFFFF", thickness:2, cap:"round", join:"round", align:"center" } }
```

**Ghost** (`color="secondary" withBackground={false}`):
```javascript
// Frame
{ type:"frame", width:32, height:32, cornerRadius:12, layout:"horizontal", justifyContent:"center", alignItems:"center",
  fill:"#FFFFFF00",           // transparent
  stroke:{ fill:"#D5E2F6", thickness:1, align:"inside" }  // visible navy30 border
}
// Icon inside (navy170)
{ type:"path", ..., fill:"#FFFFFF00", stroke:{ fill:"#1D354F", thickness:2, cap:"round", join:"round", align:"center" } }
```

**On gradient** (`color="primary-inverse" withBackground={false} withBorder={false}`):
```javascript
// Frame (transparent, no border)
{ type:"frame", width:32, height:32, cornerRadius:12, layout:"horizontal", justifyContent:"center", alignItems:"center", fill:"#FFFFFF00" }
// Icon inside (white)
{ type:"path", ..., fill:"#FFFFFF00", stroke:{ fill:"#FFFFFF", thickness:2, cap:"round", join:"round", align:"center" } }
```

---

## Pencil Layout Rules

Key .pen schema rules that differ from CSS:

- **`fill_container`** is only valid when the parent has a flex layout. A `fill_container` child in a layout-none parent has zero size.
- **`fit_content(fallback)`** — use on containers that might be empty when created (e.g. `height:"fit_content(700)"`) so they have a visible size before children are added.
- **x/y coordinates are ignored** on children of flex-layout parents. Only set x/y when the parent has `layout: "none"` (absolute positioning).
- **Text has no default color** — always set `fill` on every text node or it will be invisible.
- **`textGrowth`** must be set before width or height has any effect on a text node:
  - `auto` (default): single line, auto-width, no wrapping — don't set width/height
  - `fixed-width`: set `width` (can be `fill_container`), height auto-calculated from content
  - `fixed-width-height`: set both `width` and `height`
- **Stroke color** is set via `stroke.fill`, not `stroke.color`:
  ```javascript
  stroke: { align: "inside", thickness: 1, fill: "#8D959F" }
  ```
- **Invisible border** = set `stroke.fill` to match the background:
  ```javascript
  stroke: { align: "inside", thickness: 1, fill: "#D5E2F6" }  // same as container bg
  ```
- **Frame fill must be a hex string** — `fill:"none"` is **invalid**. For transparent frames and stroke-only paths, use `fill:"#FFFFFF00"` (white with 0 alpha = fully transparent).
- **No `background` property on frames** — set transparency directly via `fill:"#FFFFFF00"`. `background` is not a recognized Pencil frame property.
- **No `border` property on frames** — use `stroke` instead. `border` is not a recognized Pencil frame property.
- **Frames default to horizontal layout** — specify `layout: "vertical"` explicitly for column stacks.
- **Max 25 operations per `batch_design` call** — split by logical section.

---

## Token Reference

Resolved values for the **light theme**. Always re-verify via `get-tokens` — values differ across themes.

### Backgrounds

| Token path | Hex | Use for |
|---|---|---|
| `background.pageColor` | `#F2F4F5` | Page/canvas background |
| `background.containerColor` | `#FFFFFF` | Card and panel surfaces |
| `background.mutedColor` | `#F2F4F5` | Selected rows, hover states |
| `background.aiTopGradientColor` | `#9E58BD` | AI gradient start (violet100) |
| `background.aiBottomGradientColor` | `#00828E` | AI gradient end (sea100) |
| `background.interactive.action.secondary.base` | `#D5E2F6` | Secondary button fill (navy30) |

### Strokes

| Token path | Hex | Use for |
|---|---|---|
| `stroke.mutedColor` | `#E8EAEC` | Default `borderColor="primary"` (grey20) |
| `stroke.baseColor` | `#8D959F` | Visible border with `borderColorPrimary` override (grey70) |
| `stroke.infoColor` | `#2B7ABC` | Pill info border, info-state borders (blue100) |

### Border Radius (px)

| Token | px | Use for |
|---|---|---|
| `borderRadius.card.sm` | 12px | Small card |
| `borderRadius.card.md` | 16px | Standard card, pill cards |
| `borderRadius.card.lg` | 24px | Large card, agent window |
| `borderRadius.md` | 8px | Pill badge (`<Pill>`) |
| `borderRadius.interactive.base` | 12px | Buttons, icon buttons |

### Text & Icon Colors

| Token | Hex | Use for |
|---|---|---|
| `semantics.color.text.base` | `#273540` | Default body text (grey170) |
| `semantics.color.text.muted` | `#576773` | Secondary/subdued text (grey120) |
| `semantics.color.text.info` | `#2871AF` | Info text, Pill text (blue110) |
| `semantics.color.text.onColor` | `#FFFFFF` | Text on gradient/brand surfaces |
| `semantics.color.icon.base` | `#273540` | Default icon color |
| `semantics.color.icon.brand` | `#1D354F` | `color="brand"` icons (navy170) |
| `semantics.color.icon.muted` | `#576773` | Muted icons (grey120) |
| `semantics.color.icon.onColor` | `#FFFFFF` | Icons on gradient/brand surfaces |
| `semantics.color.icon.info` | `#2871AF` | Info icons (blue110) |

### Interactive Sizes

| Token | px | Use for |
|---|---|---|
| `size.interactive.height.sm` | 32px | Small icon button |
| `size.interactive.height.md` | 40px | Default button height |
| `size.interactive.height.lg` | 48px | Large button |

---

## Review Checklist

After each major section, screenshot and verify:

- [ ] **Border colors** — does the source TSX have a `themeOverride` for `borderColorPrimary`? No = `#E8EAEC` (subtle). Yes = `#8D959F` (visible).
- [ ] **Font sizes** — body=16px, small=14px, h4=16px/700. Not 14px for body, not 12px for small.
- [ ] **Font weight** — body strong / buttons = 600, h3/h4 headings = 700, body = 400.
- [ ] **Gradient direction** — `to right` = Pencil `rotation: 270`. Verify visually that violet is on the left.
- [ ] **Pill** — white background (not blue tint), 8px corner radius, blue border `#2B7ABC`, blue text `#2871AF`.
- [ ] **Secondary buttons** — navy30 `#D5E2F6` fill, no visible border (stroke matches fill), 40px height.
- [ ] **Icon colors** — set explicitly via `stroke.fill` on each `path` node. `color="brand"` = `#2871AF` (blue110, legacy alias → info, NOT navy). Icons on gradient = white `#FFFFFF`.
- [ ] **Font audit** — run `search_all_unique_properties` for `fontFamily`. Only `"Inclusive Sans"` and `"Atkinson Hyperlegible Next"` should appear. Fix any `Inter` or fallback stacks with `replace_all_matching_properties`.
- [ ] **Text visibility** — every `text` node has an explicit `fill`. Invisible text = missing fill.
- [ ] **Wrapping text** — any text that should wrap has `textGrowth: "fixed-width"` and `width: "fill_container"`.
- [ ] **Placeholder** — `placeholder: false` is set on the window frame when done.

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Guess token hex values | Invoke `get-tokens` — resolve background, stroke, borderRadius as a group |
| Reuse binding names across `batch_design` calls | Each batch has independent bindings — use explicit node `id` or `snapshot_layout` to get real IDs |
| Assume specified `id` in properties = actual node ID | Always verify with `snapshot_layout` after the creation batch |
| Use font fallback stacks | Pencil rejects them — use only the primary font name: `"Inclusive Sans"`, `"Atkinson Hyperlegible Next"` |
| Skip font audit after building | Run `search_all_unique_properties` for `fontFamily` — Inter and font stacks are common and silent failures |
| Fix wrong fonts by iterating over node IDs | Use `replace_all_matching_properties` — one call fixes every instance in the tree |
| Use `icon_font` with a Lucide name for InstUI icons | Extract actual SVG path `d` strings from source — `path` nodes with real geometry |
| Use `fill:"none"` on a path or frame | `"none"` is invalid — use `fill:"#FFFFFF00"` for transparency |
| Use `background` property on a frame | Not a valid Pencil property — use `fill` directly on the frame |
| Use `border` property on a frame | Not a valid Pencil property — use `stroke:{fill,thickness,align}` |
| Assume `color="brand"` icons are navy | `color="brand"` is a legacy alias → `icon.info` = blue110 (`#2871AF`) — NOT navy |
| Leave `fill` off a text node | Text is invisible without `fill` — always set it |
| Set `width` or `height` on a text node without `textGrowth` | Set `textGrowth` first, then width/height |
| Use `fill_container` in a layout-none parent | `fill_container` requires a flex-layout parent |
| Use `rotation: 90` for `to right` gradient | `to right` = Pencil `rotation: 270` (counterclockwise from up) |
| Use a blue tint (#EBF4FF) for Pill background | Pill background is always white (`#FFFFFF`) |
| Use `stroke.baseColor` for pill card borders | Pill cards use `borderColor="primary"` without override = `stroke.mutedColor` (#E8EAEC) |
| Exceed 25 operations in a single `batch_design` call | Split by logical section — structure first, then content per section |

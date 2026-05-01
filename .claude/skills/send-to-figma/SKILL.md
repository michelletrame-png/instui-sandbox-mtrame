---
name: send-to-figma
description: >
  Translates an InstUI React prototype into a Figma design using the
  InstUI Component Library - Beta and its shared token variables.
  Use when asked to send, export, recreate, or mock up an InstUI screen in Figma.
  Covers the full mapping: InstUI sharedTokens → Figma variables, InstUI text
  scales → Figma text styles, and InstUI components → Figma library components.
---

# Send to Figma — InstUI → Figma Translation Guide

> Quick-nav: [Workflow](#workflow) · [Library & File](#library--file) · [Token Mapping](#token-mapping) · [Text Styles](#text-styles) · [Component Mapping](#component-mapping) · [Icons](#icons) · [Anti-Patterns](#anti-patterns)

---

## Workflow

1. **Load the figma-generate-design skill** — invoke `/figma:figma-generate-design` before calling any Figma generation tool. It provides required context for how `generate_figma_design` and `use_figma` work.
2. **Read the prototype TSX** — identify every InstUI component, `sharedTokens.*` path, and prop used.
3. **Map tokens** — use the [Token Mapping](#token-mapping) table to find the Figma variable name for each `sharedTokens.*` call. Figma variables live in the `Modes` collection of **InstUI Component Library - Beta**.
4. **Map text styles** — use the [Text Styles](#text-styles) table to find the Figma text style for each `Heading` level or `Text` variant.
5. **Map components** — use the [Component Mapping](#component-mapping) table to find the Figma component name. Reference components are always from **InstUI Component Library - Beta**.
6. **Generate the design** — call `generate_figma_design` or `use_figma` with the file key `C0XYCOvpyBgsV2rbLifzw7`, mapping props to the Figma component variants documented in the library.
7. **Verify fidelity** — call `get_screenshot` to compare the generated frame against the running prototype.

---

## Library & File

| Detail | Value |
|---|---|
| Library name | **InstUI Component Library - Beta** |
| Library key | `lk-f383239a22f1e64f5d3ced41b8c579b1c16358bbcb7b186bac427fe96768f4cda534e0b901f222cd4b550110a1e77fd82517acbfc03955b24577140a51a9c7e0` |
| Reference file key | `C0XYCOvpyBgsV2rbLifzw7` |
| Variable collection | `Modes` |

To search components or variables in the library:
```
search_design_system(query, fileKey="C0XYCOvpyBgsV2rbLifzw7", includeLibraryKeys=[<library key above>])
```

---

## Token Mapping

### Background (`sharedTokens.background.*`)

| InstUI token path | Figma variable name |
|---|---|
| `sharedTokens.background.pageColor` | `sharedTokens/background/pageColor` |
| `sharedTokens.background.baseColor` | `sharedTokens/background/baseColor` |
| `sharedTokens.background.onColor` | `sharedTokens/background/onColor` |
| `sharedTokens.background.inverseColor` | `sharedTokens/background/inverseColor` |
| `sharedTokens.background.infoColor` | `sharedTokens/background/infoColor` |
| `sharedTokens.background.errorColor` | `sharedTokens/background/errorColor` |
| `sharedTokens.background.aiTextColor` | `sharedTokens/background/aiTextColor` |

> **Trap:** `background.containerColor`, `background.mutedColor`, `background.brandColor`, and accent backgrounds (`accentAsh`, `accentSky`, etc.) exist in InstUI code but may not yet be in the Figma library. Use `search_design_system` to verify; fall back to the closest hex from `get-tokens` if the variable is absent.

### Stroke (`sharedTokens.stroke.*`)

| InstUI token path | Figma variable name |
|---|---|
| `sharedTokens.stroke.baseColor` | `sharedTokens/stroke/baseColor` |
| `sharedTokens.stroke.mutedColor` | `sharedTokens/stroke/mutedColor` |
| `sharedTokens.stroke.strongColor` | `sharedTokens/stroke/strongColor` |
| `sharedTokens.stroke.brandColor` | `sharedTokens/stroke/brandColor` |
| `sharedTokens.stroke.infoColor` | `sharedTokens/stroke/infoColor` |
| `sharedTokens.stroke.errorColor` | `sharedTokens/stroke/errorColor` |
| `sharedTokens.stroke.warningColor` | `sharedTokens/stroke/warningColor` |
| `sharedTokens.stroke.successColor` | `sharedTokens/stroke/successColor` |
| `sharedTokens.stroke.accentAsh` | `sharedTokens/stroke/accentAsh` |
| `sharedTokens.stroke.accentSky` | `sharedTokens/stroke/accentSky` |
| `sharedTokens.stroke.accentSea` | `sharedTokens/stroke/accentSea` |
| `sharedTokens.stroke.accentRed` | `sharedTokens/stroke/accentRed` |

### Stroke Width (`sharedTokens.strokeWidth.*`)

| InstUI token path | Figma variable name |
|---|---|
| `sharedTokens.strokeWidth.sm` | `sharedTokens/strokeWidth/sm` |
| `sharedTokens.strokeWidth.md` | `sharedTokens/strokeWidth/md` |
| `sharedTokens.strokeWidth.lg` | `sharedTokens/strokeWidth/lg` |

### Border Radius (`sharedTokens.borderRadius.*`)

| InstUI token path | Figma variable name |
|---|---|
| `sharedTokens.borderRadius.xs` | `sharedTokens/borderRadius/xs` |
| `sharedTokens.borderRadius.sm` | `sharedTokens/borderRadius/sm` |
| `sharedTokens.borderRadius.md` | `sharedTokens/borderRadius/md` |
| `sharedTokens.borderRadius.lg` | `sharedTokens/borderRadius/lg` |
| `sharedTokens.borderRadius.xl` | `sharedTokens/borderRadius/xl` |
| `sharedTokens.borderRadius.xxl` | `sharedTokens/borderRadius/xxl` |
| `sharedTokens.borderRadius.full` | `sharedTokens/borderRadius/full` |
| `sharedTokens.borderRadius.card.sm` | `sharedTokens/borderRadius/card/sm` |
| `sharedTokens.borderRadius.card.md` | `sharedTokens/borderRadius/card/md` |
| `sharedTokens.borderRadius.card.lg` | `sharedTokens/borderRadius/card/lg` |
| `sharedTokens.borderRadius.card.nestedContainer.sm` | `sharedTokens/borderRadius/card/nestedContainer/sm` |
| `sharedTokens.borderRadius.card.nestedContainer.md` | `sharedTokens/borderRadius/card/nestedContainer/md` |
| `sharedTokens.borderRadius.card.nestedContainer.lg` | `sharedTokens/borderRadius/card/nestedContainer/lg` |

### Spacing (`sharedTokens.spacing.*`)

| InstUI token path | Figma variable name |
|---|---|
| `sharedTokens.spacing.general.space2xs` | `sharedTokens/spacing/general/space2xs` |
| `sharedTokens.spacing.gap.sections` | `sharedTokens/spacing/gap/sections` |
| `sharedTokens.spacing.gap.buttons` | `sharedTokens/spacing/gap/buttons` |
| `sharedTokens.spacing.gap.cards.sm` | `sharedTokens/spacing/gap/cards/sm` |
| `sharedTokens.spacing.gap.cards.md` | `sharedTokens/spacing/gap/cards/md` |
| `sharedTokens.spacing.gap.cards.lg` | `sharedTokens/spacing/gap/cards/lg` |

### Box Shadow (`sharedTokens.boxShadow.*` / `View shadow` prop)

These are **Figma effect styles**, not variables.

| InstUI usage | Figma effect style | Description |
|---|---|---|
| `View shadow="resting"` | `sharedTokens/boxShadow/elevation1` | Elevated surfaces, nav, cards, inputs, buttons |
| `View shadow="above"` | `sharedTokens/boxShadow/elevation2` | Menus, popovers, dropdowns |
| `View shadow="topmost"` | `sharedTokens/boxShadow/elevation3` | Floating UI, tooltips, hover cards |
| `Modal`, `Tray`, panel overlays | `sharedTokens/boxShadow/elevation4` | Dialogs & panels |

### Typography Variables (`text/*`)

Used for custom typography nodes in Figma — not for applying text styles to components (use the text styles table below for that).

| InstUI token | Figma variable name |
|---|---|
| `fontFamily.base` | `text/fontFamily` |
| `fontFamily.monospace` | `text/fontFamilyMonospace` |
| `fontSize.xSmall` | `text/fontSizeXSmall` |
| `fontSize.small` | `text/fontSizeSmall` |
| `fontSize.medium` | `text/fontSizeMedium` |
| `fontSize.large` | `text/fontSizeLarge` |
| `fontSize.xLarge` | `text/fontSizeXLarge` |
| `fontSize.xxLarge` | `text/fontSizeXXLarge` |
| `fontWeight.light` | `text/fontWeightLight` |
| `fontWeight.normal` / `fontWeight.regular` | `text/fontWeightRegular` |
| `fontWeight.bold` | `text/fontWeightBold` |
| `fontWeight.body.strong` / `fontWeight.important` | `text/fontWeightImportant` |

---

## Text Styles

Apply these as Figma text styles (from **InstUI Component Library - Beta**) to text nodes.

### Heading styles

The `variant` prop on `Heading` directly names the Figma text style. When `variant` is absent, infer from `level`:

| InstUI usage | Figma text style |
|---|---|
| `Heading level="h1"` / `variant="titlePageDesktop"` | `heading/titlePageDesktop` |
| `Heading level="h1"` / `variant="titlePageMobile"` | `heading/titlePageMobile` |
| `Heading level="h2"` (no variant — default section heading) | `heading/titleSection` |
| `Heading level="h2"` / `variant="titleModule"` | `heading/titleModule` |
| `Heading level="h2"` / `variant="titleCardRegular"` | `heading/titleCardRegular` |
| `Heading level="h3"` / `variant="titleCardLarge"` | `heading/titleCardLarge` |
| `Heading level="h3"` / `variant="titleCardRegular"` | `heading/titleCardRegular` |
| `Heading level="h4"` (no variant — card section heading) | `heading/titleCardSection` |
| `Heading level="h5"` (no variant — card mini heading) | `heading/titleCardMini` |
| `Text weight="bold"` inline label | `heading/label` |
| `Text weight="bold"` inline label (inline) | `heading/labelInline` |

> **Trap:** `heading/titleCardMini` is NOT the default for `h4`. `h4` without a `variant` prop maps to `heading/titleCardSection`. Only use `titleCardMini` when `variant="titleCardMini"` is explicitly set.

### Body text styles

| InstUI usage | Figma text style |
|---|---|
| `Text` (default body) | `text/content` |
| `Text size="small"` | `text/contentSmall` |
| `Text weight="bold"` (important body text) | `text/contentImportant` |
| `Text` as a blockquote or citation | `text/contentQuote` |
| `Text` introducing a page | `text/descriptionPage` |
| `Text` introducing a section | `text/descriptionSection` |
| `Text` legend for charts/icons | `text/legend` |

---

## Component Mapping

All components below are from **InstUI Component Library - Beta**. Pass the component name to `search_design_system` to get current variant properties.

| InstUI component | Figma component name | Notes |
|---|---|---|
| `Button` | `Button` | Variants: Primary, Secondary, Tertiary, Success Primary/Secondary, Destructive Primary/Secondary |
| `IconButton` | `Icon Button` | See variant mapping table below — `withBackground` and `color` props together determine the Figma variant |
| `CloseButton` | `Close Button` | — |
| `ToggleButton` | `Toggle Button` | — |
| `RadioInput` | `Radio Input` | — |
| `Tag` | `Tag` | Small entity/input/filter chips |
| `ProgressBar` | `progressBar` | — |
| `Spinner` | `loader` | The spinning indeterminate loader |
| `Modal` | `Modal` | — |
| `DateInput` | `Date Input` | — |
| `SideNavBar` | `Side Navbar` | Primary in-app navigation |
| `Table` body | `tableBody` | — |
| `Card` | `Card` | Self-contained content container |

### Icon Button variant mapping

`color` and `withBackground` together determine the Figma variant. Use `setProperties({ "variant": "..." })`:

| InstUI props | Figma variant | Notes |
|---|---|---|
| `color="primary"` | `variant=primary` | Filled primary button |
| `color="secondary"` | `variant=secondary` | Outlined secondary |
| `color="secondary"` + `withBackground={false}` | `variant=tertiary` | Ghost — no background, no visible border |
| `color="primary-inverse"` (on light bg) | `variant=onColorPrimary` | Filled on-color button |
| `color="primary-inverse"` + `withBackground={false}` (on dark/color bg) | `variant=onColorSecondary` | Ghost on dark background — has border but no fill |
| `color="ai-primary"` | `variant=aiPrimary` | AI-branded primary |
| `color="ai-secondary"` | `variant=aiSecondary` | AI-branded secondary |

> **Trap:** `withBackground={false}` does NOT map to `secondary` — it maps to `tertiary` (on normal backgrounds) or `onColorSecondary` (on dark/gradient backgrounds). Using `secondary` adds a visible background fill that the code intentionally omits.

### Text color on dark/gradient backgrounds

When `Heading` or `Text` uses `color="primary-on"` (or appears on a dark/gradient background), bind the text fill to the `sharedTokens/background/onColor` variable:

```js
const onColorVar = await figma.variables.importVariableByKeyAsync("49262b39f1d0ff146af4bb278c3ff38e073967ed");
const newFill = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 1, g: 1, b: 1 } },
  'color',
  onColorVar
);
textNode.fills = [newFill];
```

> **Finding more components:** Run `search_design_system(query, fileKey="C0XYCOvpyBgsV2rbLifzw7", includeLibraryKeys=[...])` for any component not listed here. Restrict to the InstUI library key to avoid noise from community libraries.

---

## Icons

InstUI icon components (e.g. `SquarePenInstUIIcon`, `WandSparklesInstUIIcon`) map to kebab-case components in the Figma library (e.g. `square-pen`, `wand-sparkles`).

### Finding icon keys

Search by kebab-case name — strip the `InstUIIcon` suffix and convert to kebab-case:

```
search_design_system("square-pen", fileKey="C0XYCOvpyBgsV2rbLifzw7", includeLibraryKeys=[...])
// returns assetType: "component", componentKey: "..."
```

Import with `figma.importComponentByKeyAsync(key)`.

### Icon Button — swapping the icon (`icon#6587:0`)

`Icon Button` has an `INSTANCE_SWAP` property named `icon#6587:0`. After creating an Icon Button instance, set the icon like this:

```js
const iconComp = await figma.importComponentByKeyAsync(ICON_KEY);
iconButtonInstance.setProperties({ "icon#6587:0": iconComp.id });
```

**Never skip this step.** An Icon Button without a swapped icon shows a diamond placeholder.

To discover all valid icon keys for the swap, read `preferredValues` from the component set's property definition:

```js
const iconBtnSet = await figma.importComponentSetByKeyAsync(ICON_BUTTON_SET_KEY);
const propDef = iconBtnSet.componentPropertyDefinitions["icon#6587:0"];
const validKeys = propDef.preferredValues.map(v => v.key); // array of component keys
```

### Standalone icons (not inside Icon Button)

For icons used standalone (e.g. inside a pill card or container), import the raw icon component and create an instance directly — do **not** wrap in Icon Button:

```js
const wandSparkles = await figma.importComponentByKeyAsync("0a00c266aac4db770c4f7b7c74dfa831258c29e6");
const inst = wandSparkles.createInstance();
parentFrame.appendChild(inst);
```

### AI / IgniteAI Logo icon

The `IgniteaiLogoInstUIIcon` maps to the **AI Icon** component set in Figma. Import the specific size+color variant directly by component key:

| Usage context | Variant | Component key |
|---|---|---|
| On gradient/dark background | `size=md, color=onColor` | `00f5575c10aa0c458b093c123e202bc77223ea32` |
| On light background | `size=md, color=ignite` | `10381130da79d6935328f1c595a6c3837bb05a55` |

Search for other variants: `search_design_system("AI Icon", ...)` then inspect `componentPropertyDefinitions` for size/color options.

### Anti-patterns for icons

| Don't | Do instead |
|---|---|
| Use a Rectangle or Frame as an icon placeholder | Import and instance the actual icon component from the library |
| Leave Icon Button with default (diamond) icon | Always set `icon#6587:0` via `setProperties` after creating the instance |
| Use a blue/colored FRAME as a standalone icon | Import the raw icon component (`wand-sparkles`, `library`, etc.) by key |
| Guess icon names from the InstUI component name | Convert InstUI name to kebab-case and call `search_design_system` |

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Use raw hex values for fills or strokes | Apply the corresponding `sharedTokens/*` Figma variable |
| Use community library components (Material 3, iOS) | Use **InstUI Component Library - Beta** exclusively |
| Apply `elevation1`–`elevation4` as fills | They are **effect styles** (`sharedTokens/boxShadow/*`) — apply as effects, not fills |
| Guess Figma component variant names from InstUI prop names | Call `search_design_system` to read the actual variant properties |
| Apply text styles to component nodes | Text styles go on standalone text nodes; component styling is handled by the Figma component internally |
| Use `sharedTokens/background/baseColor` for the page canvas | Page backgrounds use `sharedTokens/background/pageColor` |
| Translate `shadow="resting"` to a drop shadow manually | Apply the `sharedTokens/boxShadow/elevation1` effect style |
| Skip loading figma-generate-design before calling `generate_figma_design` | Always load the skill first — it prevents common generation failures |

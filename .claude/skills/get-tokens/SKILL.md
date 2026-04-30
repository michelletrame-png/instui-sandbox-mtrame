---
name: get-tokens
description: >
  Dynamically explores available token keys and values for any layer of the InstUI v11.7.2
  theme system: sharedTokens, semantics, components, or primitives. Invoke when the user
  asks what token options are available — "what background colors exist", "what tokens can
  I override on Button", "show me all borderRadius values", "what does semantics.color.stroke
  contain", or any exploratory question about the token system. Do not invoke for questions
  about how to use tokens in code — use instui-tokens for that.
---

# InstUI Token Explorer

## The four token layers

| Layer | Accessed via | When to use |
|---|---|---|
| `sharedTokens` | `useComputedTheme().sharedTokens` | **Default** — cross-component surface/stroke/radius/spacing values for layouts and `themeOverride` |
| `semantics` | `useComputedTheme().semantics` | When `sharedTokens` doesn't have what you need — semantic intent values (action states, interactive states, typography scale) |
| `components` | `useComputedTheme().components` | Reading resolved component token values — usually not needed; use `themeOverride` prop instead |
| `primitives` | `useComputedTheme().primitives` | Raw color scales (grey10–grey180, navy10–navy180) — almost never use directly in app code |

---

## Exploring `sharedTokens`

**Structure file:** `node_modules/@instructure/ui-themes/types/themes/newThemeTokens/commonTypes.d.ts`

Top-level groups and their line numbers (use `offset` when reading):

| Group | Line | Description |
|---|---|---|
| `borderRadius` | 24 | Card, nested container, and flat radius presets |
| `legacy` | 43 | Legacy compat tokens — do not use in new code |
| `boxShadow` | 87 | Elevation presets — resting, above, overlay |
| `spacing` | 109 | Spacing scale — `general` (spaceXs–space2xl) and component sub-groups |
| `focusOutline` | 146 | Focus ring tokens |
| `background` | 156 | Surface colors — container, muted, brand, status, AI, accents |
| `stroke` | 186 | Border/outline colors — base, muted, strong, brand, status, accents |
| `strokeWidth` | 212 | Border widths — `sm`, `md`, `lg` |

**Values for the light theme:** `node_modules/@instructure/ui-themes/es/themes/newThemeTokens/light/sharedTokens.js`

For other themes replace `light` with `dark`, `legacyCanvas`, or `legacyCanvasHighContrast`.

---

## Exploring `semantics`

**Structure file:** `node_modules/@instructure/ui-themes/types/themes/newThemeTokens/light/semantics.d.ts` (732 lines)

Top-level groups:

| Group | Description |
|---|---|
| `color` | All semantic colors — `background`, `stroke`, `text`, `interactive` (input states, action states: primary/secondary/destructive/success/ai), `icon`, `focus`, `overlay`, `accent` |
| `dropShadow` | Shadow values |
| `size` | Component size scale |
| `spacing` | Spacing values |
| `borderRadius` | Semantic border radius values (xs, sm, md, lg, xl, xxl, container variants) |
| `borderWidth` | Border width values |
| `fontFamily` | Font stack values |
| `fontWeight` | Font weight scale |
| `lineHeight` | Line height scale |
| `fontSize` | Font size scale |
| `opacity` | Opacity values |

Read the file directly for the full nested structure — `semantics.color` alone spans hundreds of lines. Use `offset` and `limit` to read specific sections.

---

## Exploring component `themeOverride` tokens

Each InstUI component has its own token type. These are the keys you can pass to `themeOverride`.

**Type files:** `node_modules/@instructure/ui-themes/types/themes/newThemeTokens/componentTypes/{componentName}.d.ts`

Common components:

| Component | File |
|---|---|
| `Button` / `IconButton` | `baseButton.d.ts` |
| `View` | `view.d.ts` |
| `Heading` | `heading.d.ts` |
| `Text` | `text.d.ts` |
| `Tabs` / `Tabs.Panel` / `Tabs.Tab` | `tabs.d.ts`, `tabsPanel.d.ts`, `tabsTab.d.ts` |
| `TextInput` | `textInput.d.ts` |
| `SideNavBar` / `SideNavBar.Item` | `sideNavBar.d.ts`, `sideNavBarItem.d.ts` |
| `Tray` | `tray.d.ts` |
| `DrawerLayout.Content` / `.Tray` | `drawerLayoutContent.d.ts`, `drawerLayoutTray.d.ts` |
| `Modal` | `modal.d.ts` |
| `Spinner` | `spinner.d.ts` |
| `Pill` | `pill.d.ts` |
| `Badge` | `badge.d.ts` |
| `Avatar` | `avatar.d.ts` |
| `Link` | `link.d.ts` |

Read the component's type file directly — it lists every overridable token as a flat object with string values.

**Resolved values** (light theme): `node_modules/@instructure/ui-themes/es/themes/newThemeTokens/light/components/{componentName}.js`

---

## Exploring `primitives`

**File:** `node_modules/@instructure/ui-themes/types/themes/newThemeTokens/light/primitives.d.ts`

Contains raw color palettes: `white`, `transparent`, and named scales (`green`, `grey`, `navy`, `red`, `orange`, `blue`, `violet`, `sea`, `yellow`, plus opacity variants).

Each scale goes from `{color}10` (lightest) to `{color}180` (darkest) in 10-step increments.

Do not use `primitives` directly in application code — use `sharedTokens` or `semantics` instead.

---

## Step-by-step lookup

1. Identify which layer has what you need (table above)
2. Read the relevant type file to get the available keys
3. Read the corresponding `es/` JS source file for the light theme to see how values resolve
4. Format the response as a table with token names, semantics paths, and a usage example

### Usage example template

```tsx
const { sharedTokens, semantics } = useComputedTheme()

// sharedTokens — preferred for layout and surface work
<View
  background="primary"
  themeOverride={{ backgroundPrimary: sharedTokens.background.mutedColor }}
/>

// semantics — when sharedTokens doesn't cover the need
<div style={{ color: semantics.color.text.secondary }} />

// component themeOverride — to override a specific component token
<Button themeOverride={{ primaryBackground: sharedTokens.background.brandColor }} />
```

---
name: get-component
description: >
  Shows available props, sizes, colors, and configurations for any InstUI v11.7.2 component.
  Invoke when the user asks what options a component has — "what sizes does Button have",
  "what colors can I use on Pill", "what props does Tabs.Panel accept", "how do I configure
  SideNavBar". Reads the actual TypeScript prop types from the installed package.
---

# Get Component

## How to look up any component

All component prop types follow this path pattern:

```
node_modules/@instructure/ui-{package}/types/{Component}/v2/props.d.ts
```

Always use `v2` — it's the current version. Read the file directly with the Read tool.

---

## Package → component mapping

| Component(s) | Package | Props file path |
|---|---|---|
| `Button`, `IconButton`, `CondensedButton`, `CloseButton` | `ui-buttons` | `types/{Component}/v2/props.d.ts` |
| `View` | `ui-view` | `types/View/v2/props.d.ts` |
| `Flex`, `Flex.Item` | `ui-flex` | `types/Flex/v2/props.d.ts`, `types/Flex/v2/Item/props.d.ts` |
| `Grid`, `Grid.Row`, `Grid.Col` | `ui-grid` | `types/Grid/v2/props.d.ts`, etc. |
| `Heading` | `ui-heading` | `types/Heading/v2/props.d.ts` |
| `Text` | `ui-text` | `types/Text/v2/props.d.ts` |
| `Link` | `ui-link` | `types/Link/v2/props.d.ts` |
| `TextInput` | `ui-text-input` | `types/TextInput/v2/props.d.ts` |
| `TextArea` | `ui-text-area` | `types/TextArea/v2/props.d.ts` |
| `NumberInput` | `ui-number-input` | `types/NumberInput/v2/props.d.ts` |
| `RangeInput` | `ui-range-input` | `types/RangeInput/v2/props.d.ts` |
| `Checkbox` | `ui-checkbox` | `types/Checkbox/v2/props.d.ts` |
| `RadioInput`, `RadioInputGroup` | `ui-radio-input` | `types/RadioInput/v2/props.d.ts`, `types/RadioInputGroup/v2/props.d.ts` |
| `SimpleSelect`, `SimpleSelect.Option`, `SimpleSelect.Group` | `ui-simple-select` | `types/SimpleSelect/v2/props.d.ts`, etc. |
| `Tabs`, `Tabs.Panel`, `Tabs.Tab` | `ui-tabs` | `types/Tabs/v2/props.d.ts`, `types/Tabs/v2/Panel/props.d.ts`, `types/Tabs/v2/Tab/props.d.ts` |
| `Avatar` | `ui-avatar` | `types/Avatar/v2/props.d.ts` |
| `Badge` | `ui-badge` | `types/Badge/v2/props.d.ts` |
| `Pill` | `ui-pill` | `types/Pill/v2/props.d.ts` |
| `Spinner` | `ui-spinner` | `types/Spinner/v2/props.d.ts` |
| `Alert` | `ui-alerts` | `types/Alert/v2/props.d.ts` |
| `Breadcrumb`, `Breadcrumb.Link` | `ui-breadcrumb` | `types/Breadcrumb/v2/props.d.ts`, etc. |
| `SideNavBar`, `SideNavBar.Item` | `ui-side-nav-bar` | `types/SideNavBar/v2/props.d.ts`, etc. |
| `Tray` | `ui-tray` | `types/Tray/v2/props.d.ts` |
| `Modal`, `Modal.Header`, `Modal.Body`, `Modal.Footer` | `ui-modal` | `types/Modal/v2/props.d.ts`, etc. |
| `DrawerLayout`, `DrawerLayout.Content`, `DrawerLayout.Tray` | `ui-drawer-layout` | `types/DrawerLayout/v1/props.d.ts` *(v1 only)* |
| `Transition` | `ui-motion` | `types/Transition/v2/props.d.ts` |
| `FileDrop` | `ui-file-drop` | `types/FileDrop/v2/props.d.ts` |
| `ToggleDetails` | `ui-toggle-details` | `types/ToggleDetails/v2/props.d.ts` |
| `Pagination`, `Pagination.Page` | `ui-pagination` | `types/Pagination/v2/props.d.ts`, etc. |
| `Tag` | `ui-tag` | `types/Tag/v2/props.d.ts` |
| `Tooltip` | `ui-tooltip` | `types/Tooltip/v2/props.d.ts` |
| `Menu`, `Menu.Item`, `Menu.Group` | `ui-menu` | `types/Menu/v2/props.d.ts`, etc. |
| `Table`, `Table.Row`, `Table.Cell`, `Table.ColHeader` | `ui-table` | `types/Table/v2/props.d.ts`, etc. |
| `ScreenReaderContent` | `ui-a11y-content` | `types/ScreenReaderContent/v2/props.d.ts` |

---

## Step-by-step

1. Find the package from the table above
2. Read `node_modules/@instructure/{package}/types/{Component}/v2/props.d.ts`
3. If the file doesn't exist at `v2`, try `v1`
4. Parse the `*OwnProps` type — this is the component's public API
5. Format the output

---

## Output format

Return a prop reference table, then a usage example:

### Prop reference

| Prop | Type / Values | Required | Notes |
|---|---|---|---|
| `color` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'ai-primary' \| 'ai-secondary'` | No | |
| `size` | `'small' \| 'medium' \| 'large'` | No | Default: `medium` |
| `interaction` | `'enabled' \| 'disabled' \| 'readonly'` | No | |
| `display` | `'inline-block' \| 'block'` | No | |
| `withBackground` | `boolean` | No | `false` = transparent fill |
| `renderIcon` | `ReactNode` | No | Leading icon |
| `margin` | `Spacing` | No | CSS shorthand spacing |

Omit internal props (`elementRef`, `as`, `cursor`, `href`, `onClick`, `type`) unless the user asks for them — focus on the visual/behavioral configuration props that affect how the component looks and works.

### Usage example

Show a realistic usage of the most commonly varied props:

```tsx
<Button
  color="primary"
  size="medium"
  display="inline-block"
  renderIcon={<PlusInstUIIcon />}
>
  Add item
</Button>
```

---

## Sub-components

If the component has sub-components (`Tabs.Panel`, `Flex.Item`, `SideNavBar.Item`, etc.), read their props files too and include a section for each. The path pattern is:

```
types/{Component}/v2/{SubComponent}/props.d.ts
```

Or for direct sub-types like `Panel`:
```
types/Tabs/v2/Panel/props.d.ts
```

---

## Known behavioral gotchas

These are cases where the prop type is correct but the visual behavior is surprising.
Check this section when a prop appears valid but isn't producing the expected result.

### `Button` — `display="block"` does not center text-only labels

**Symptom:** `<Button display="block">Label</Button>` stretches full-width but the
label stays left-aligned even with `textAlign="center"`.

**Why:** The centering mechanism (`childrenLayout` span with `justifyContent: center`)
is only rendered when `renderIcon` is present. For text-only buttons it is skipped,
so `textAlign` has no visual effect.

**Fix:** Don't use `display="block"` on text-only buttons. Control width from the
outside with `Flex.Item shouldGrow={false}`:

```tsx
// ✅ natural width, stays at content size in a column Flex
<Flex.Item shouldGrow={false}>
  <Button size="small">Go to course</Button>
</Flex.Item>

// ❌ stretches full-width but label stays left-aligned
<Button size="small" display="block" textAlign="center">Go to course</Button>
```

### `Table` — always use `layout="stacked"` on mobile

Tables must switch to stacked layout on narrow viewports. The default `layout="auto"`
renders a horizontal table at all sizes, which overflows or requires horizontal
scrolling on mobile.

**Rule:** Always wire `layout` to the mobile breakpoint:

```tsx
<Table caption="..." layout={isMobile ? 'stacked' : 'auto'}>
```

The `stackedSortByLabel` prop on `Table.ColHeader` controls the label shown in the
stacked row header — always set it to a human-readable column name.

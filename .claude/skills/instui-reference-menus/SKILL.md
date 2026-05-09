---
name: instui-reference-menus
description: >
  Authoritative guide for menus in Instructure UI (InstUI) v11.x.
  Invoke this skill when building context menus, dropdown menus, overflow menus,
  or any triggered popover list of actions. Covers Menu, Menu.Item, Menu.Group,
  and Menu.Separator — including icon placement, flyout submenus, grouped
  sections, selection states (checkbox/radio), and inline static rendering for
  design spec frames.
---

# Instructure UI Menus Skill

> Quick-nav: [Mental Model](#mental-model) · [Menu](#menu) · [Menu.Item](#menuitem) · [Menu.Group](#menugroup) · [Menu.Separator](#menuseparator) · [Patterns](#patterns) · [Icon Placement](#icon-placement) · [Anti-Patterns](#anti-patterns)

---

## Mental Model

`Menu` is the single component for all list-of-actions UI. It covers two modes:

| Mode | How | When |
|---|---|---|
| **Triggered popover** | Pass a `trigger` prop — Menu renders a Popover anchored to the trigger | Overflow menus, "more actions" buttons, right-click context menus |
| **Inline (static)** | Omit `trigger` — Menu renders directly into the DOM flow | Design spec frames showing an open menu, testing layouts |

Sub-menus (flyout menus) are created by nesting a `<Menu type="flyout">` directly inside a `<Menu.Item type="flyout">`. The outer `Menu.Item` renders the flyout arrow; the inner `Menu` renders the sub-panel.

**Import path** (always use `/latest`):

```tsx
import { Menu } from '@instructure/ui-menu/latest'
```

---

## Menu

The root container. Handles popover positioning, keyboard navigation, and open/closed state.

### Key props

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Maps to `aria-label` on the menu element — always provide for accessibility |
| `trigger` | `ReactNode` | If provided, menu renders as a popover anchored to this element |
| `placement` | `PlacementPropValues` | Where to place the popover relative to trigger. Common values: `'bottom start'`, `'bottom end'`, `'top start'`, `'top end'`, `'end top'` |
| `defaultShow` | `boolean` | Open on initial render (uncontrolled) |
| `show` | `boolean` | Controlled open state — pair with `onToggle` |
| `onToggle` | `(show, menu) => void` | Fires when open state changes |
| `onSelect` | `(e, value, selected, item) => void` | Fires when any item is selected |
| `onDismiss` | `(event, documentClick) => void` | Fires when menu closes |
| `shouldHideOnSelect` | `boolean` | Close the menu when an item is selected (default: `true`) |
| `withArrow` | `boolean` | Render a pointing arrow toward the trigger |
| `offsetX` / `offsetY` | `string \| number` | Positional offset from the trigger |
| `maxHeight` | `string \| number` | Caps menu height — enables internal scrolling |
| `type` | `'flyout'` | Marks the menu as a flyout sub-menu (used when nesting inside `Menu.Item type="flyout"`) |
| `constrain` | `'window' \| 'scroll-parent' \| 'parent' \| 'none'` | Boundary for popover repositioning |
| `mountNode` | `element \| () => element` | Where to portal the popover (defaults to `document.body`) |

---

## Menu.Item

A single actionable row inside a menu.

### Key props

| Prop | Type | Notes |
|---|---|---|
| `children` | `ReactNode` | The item label — can contain any inline content including Flex with icons |
| `type` | `'button' \| 'checkbox' \| 'radio' \| 'flyout'` | Rendering mode. `'flyout'` adds a built-in right-pointing arrow. Default: `'button'` |
| `renderLabelInfo` | `ReactNode \| () => ReactNode` | Content rendered in the **right** info region (keyboard shortcuts, counts, metadata) |
| `value` | `string \| number` | Arbitrary value passed back in `onSelect` |
| `selected` | `boolean` | Controlled selected state (pair with `onSelect`) |
| `defaultSelected` | `boolean` | Selected on initial render (uncontrolled) |
| `disabled` | `boolean` | Prevents interaction |
| `href` | `string` | Renders as an anchor tag |
| `as` | `AsElementType` | Override the rendered element |

---

## Menu.Group

A labeled section that groups related items. Renders a non-interactive header above its children.

### Key props

| Prop | Type | Notes |
|---|---|---|
| `label` | `ReactNode` | **Required.** Rendered as the section header |
| `allowMultiple` | `boolean` | When `true`, multiple items can be selected simultaneously (checkbox behavior). Default: `false` (radio behavior) |
| `selected` | `(string \| number)[]` | Controlled selected items |
| `defaultSelected` | `(string \| number)[]` | Selected items on initial render |
| `onSelect` | `(e, updated, selected, item) => void` | Fires when a child item is selected |
| `disabled` | `boolean` | Disables all items in the group |

---

## Menu.Separator

A horizontal rule between items or groups. No props — renders purely as a visual divider.

```tsx
<Menu.Separator />
```

Use between unrelated action groups when `Menu.Group` section headers aren't appropriate.

---

## Patterns

### Triggered overflow menu

```tsx
<Menu
  label="Row actions"
  trigger={
    <IconButton screenReaderLabel="More options" renderIcon={<IconMoreLine />} />
  }
  placement="bottom end"
>
  <Menu.Item value="edit">Edit</Menu.Item>
  <Menu.Item value="duplicate">Duplicate</Menu.Item>
  <Menu.Separator />
  <Menu.Item value="delete">Delete</Menu.Item>
</Menu>
```

### Grouped menu with section headers

```tsx
<Menu label="Attach context">
  <Menu.Group label="Connectors">
    <Menu.Item type="flyout">
      <Flex alignItems="center" gap="small">
        <PlugInstUIIcon size="x-small" color="secondary" />
        <Text>Add a connector</Text>
      </Flex>
    </Menu.Item>
  </Menu.Group>
  <Menu.Group label="Attach">
    <Menu.Item>
      <Flex alignItems="center" gap="small">
        <CloudUploadInstUIIcon size="x-small" color="secondary" />
        <Text>Upload a file or photo</Text>
      </Flex>
    </Menu.Item>
    <Menu.Item>
      <Flex alignItems="center" gap="small">
        <FolderInstUIIcon size="x-small" color="secondary" />
        <Text>Select from my files</Text>
      </Flex>
    </Menu.Item>
  </Menu.Group>
</Menu>
```

### Flyout sub-menu (nested)

A flyout is created by nesting a `<Menu type="flyout">` inside a `<Menu.Item type="flyout">`. The outer item renders the arrow; the inner Menu renders the sub-panel.

```tsx
<Menu label="Format options">
  <Menu.Item type="flyout">
    <Flex alignItems="center" gap="small">
      <TextColorInstUIIcon size="x-small" color="secondary" />
      <Text>Text color</Text>
    </Flex>
    <Menu type="flyout" label="Text color options">
      <Menu.Item value="red">Red</Menu.Item>
      <Menu.Item value="blue">Blue</Menu.Item>
      <Menu.Item value="green">Green</Menu.Item>
    </Menu>
  </Menu.Item>
  <Menu.Item value="bold">Bold</Menu.Item>
</Menu>
```

### Radio selection group

`Menu.Group` defaults to radio behavior (single selection). Use `value` on each item for tracking.

```tsx
<Menu label="Sort by" onSelect={(e, value) => setSortBy(value)}>
  <Menu.Group label="Sort by" selected={[sortBy]}>
    <Menu.Item value="name">Name</Menu.Item>
    <Menu.Item value="date">Date modified</Menu.Item>
    <Menu.Item value="size">File size</Menu.Item>
  </Menu.Group>
</Menu>
```

### Checkbox selection group

Set `allowMultiple` for multi-select. Pass `selected` as an array of selected values.

```tsx
<Menu label="Columns to show">
  <Menu.Group label="Show columns" allowMultiple selected={visibleCols} onSelect={handleToggle}>
    <Menu.Item value="name">Name</Menu.Item>
    <Menu.Item value="email">Email</Menu.Item>
    <Menu.Item value="role">Role</Menu.Item>
    <Menu.Item value="lastLogin">Last login</Menu.Item>
  </Menu.Group>
</Menu>
```

### Static inline menu (design spec frames)

Omit `trigger` to render the menu inline in document flow — no popover, no portal. Use this in spec frames to show an open menu without interactivity.

```tsx
<Flex direction="column" gap="x-small">
  <Menu label="Attach context">
    <Menu.Group label="Connectors">
      <Menu.Item type="flyout">Add a connector</Menu.Item>
    </Menu.Group>
    <Menu.Group label="Attach">
      <Menu.Item>Upload a file or photo</Menu.Item>
      <Menu.Item>Select from my files</Menu.Item>
    </Menu.Group>
  </Menu>
  <InputCard />
</Flex>
```

### Right-side metadata with renderLabelInfo

`renderLabelInfo` renders on the **right** side of the item — use it for keyboard shortcuts, counts, or secondary metadata.

```tsx
<Menu label="Edit">
  <Menu.Item renderLabelInfo={<Text size="small" color="secondary">⌘Z</Text>}>Undo</Menu.Item>
  <Menu.Item renderLabelInfo={<Text size="small" color="secondary">⌘⇧Z</Text>}>Redo</Menu.Item>
  <Menu.Separator />
  <Menu.Item renderLabelInfo={<Text size="small" color="secondary">⌘X</Text>}>Cut</Menu.Item>
  <Menu.Item renderLabelInfo={<Text size="small" color="secondary">⌘C</Text>}>Copy</Menu.Item>
</Menu>
```

### Capped-height scrollable menu

Use `maxHeight` when the item list may overflow the viewport.

```tsx
<Menu label="Select course" maxHeight="300px" trigger={<Button>Select course</Button>}>
  {courses.map(c => <Menu.Item key={c.id} value={c.id}>{c.name}</Menu.Item>)}
</Menu>
```

---

## Icon Placement

`renderLabelInfo` is the **right** info region — not a left icon slot.

| Goal | How |
|---|---|
| Icon on the **left** of the label | Put an icon + text inside `children` using `Flex` |
| Content on the **right** (keyboard shortcuts, counts) | Use `renderLabelInfo` |
| Flyout arrow on the right | Use `type="flyout"` on `Menu.Item` — the arrow renders automatically, do NOT add `ChevronRightInstUIIcon` manually |

**Left icon pattern:**

```tsx
<Menu.Item>
  <Flex alignItems="center" gap="small">
    <FolderInstUIIcon size="x-small" color="secondary" />
    <Text>Select from my files</Text>
  </Flex>
</Menu.Item>
```

**Don't combine manual chevron with type="flyout"** — the component renders its own arrow:

```tsx
// ❌ Double arrow — component adds its own
<Menu.Item type="flyout" renderLabelInfo={<ChevronRightInstUIIcon />}>
  Open submenu
</Menu.Item>

// ✅ Just type="flyout" — arrow is automatic
<Menu.Item type="flyout">Open submenu</Menu.Item>
```

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Build a menu from `View` + `Flex` rows with manual padding | Use `Menu`, `Menu.Group`, `Menu.Item` — they handle keyboard nav, ARIA roles, hover/focus states |
| Add `ChevronRightInstUIIcon` to a `type="flyout"` item | `type="flyout"` renders the arrow automatically |
| Use `renderLabelInfo` to place an icon on the left | Put the icon in `children` using `Flex` — `renderLabelInfo` is always right-aligned |
| Render `<Menu>` without a `label` prop | Always set `label` — it becomes the `aria-label` |
| Nest `Menu.Group` inside `Menu.Group` | Groups don't nest — use a `Menu.Separator` between flat groups if headers aren't needed |
| Use `Menu.Separator` between every item | Only use it between meaningfully distinct groups — overuse creates visual clutter |
| Mount a triggered menu inside a `overflowY="hidden"` container without setting `mountNode` | Set `mountNode` to a DOM node outside the clipped ancestor, or use `constrain="window"` |
| Manually control `show` without providing `onToggle` | Pair `show` with `onToggle` or use uncontrolled `defaultShow` instead |

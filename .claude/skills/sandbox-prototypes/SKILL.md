---
name: sandbox-prototypes
description: >
  Manages user requests for creating and deleting prototypes in this InstUI
  sandbox. Invoke when the user asks to create a new prototype, add a prototype,
  delete or remove a prototype, or asks what templates are available.
---

# Sandbox Prototype Management

## Creating a prototype

**Before doing anything else, ask the user which template to start from.**

Present the available templates as a short list and wait for their answer before
creating any files:

> Which template would you like to start from?
>
> - **Blank** — Gray page background, nothing else. Start completely from scratch.
> - **Canvas Page** — Full Canvas LMS layout: collapsible SideNavBar, breadcrumb,
>   page header with primary action button, tabs, card content area. Responsive
>   mobile layout with a tray-based nav drawer and a SimpleSelect for tabs.
> - **Spec Sheet** — Infinite-canvas spec sheet for component handoff. Sections
>   with titled artboard frames of any size, auto-numbered (1.0, 1.1, 2.0…),
>   scrollable in both directions. Boards accept a `content` prop for live React
>   previews or show a dark placeholder slot by default.

Once the user picks a template, collect the prototype name if you don't already
have it (ask if not provided).

---

### Step 1 — Derive identifiers

From the prototype name, derive:

| Field | Rule | Example |
|---|---|---|
| `id` | kebab-case, lowercase | `my-feature` |
| `title` | Title Case as given | `My Feature` |
| `path` | `/` + id | `/my-feature` |
| `directory` | `src/prototypes/<id>/` | `src/prototypes/my-feature/` |
| `componentName` | PascalCase | `MyFeature` |

---

### Step 2 — Create the prototype file

Create `src/prototypes/<id>/index.tsx`.

**If the user chose Blank:**

Start from a minimal shell — just the gray page root and the `PrototypeProps`
signature. No navigation, no content, no placeholder copy.

```tsx
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import type { PrototypeProps } from '../../registry'

export default function <ComponentName>({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()

  return (
    <View
      as="div"
      minHeight="100vh"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
    >
    </View>
  )
}
```

**If the user chose Canvas Page:**

Copy the structure from `src/templates/CanvasPage.tsx` into the new file.
Update the component name, the breadcrumb labels, the page title, and the
placeholder content to match the prototype's purpose — do not keep the
biology-assignment placeholder text. Use the correct `PrototypeProps` import
path (`../../registry`) and make it a default export.

**If the user chose Spec Sheet:**

Import `SpecSheet`, `SpecSection`, and `SpecBoard` from
`../../templates/SpecSheet`. The default export wraps `SpecSheet` with sections
and boards suited to the prototype's purpose. Ask the user what screens/flows
they want to spec out if they haven't already described them. Each board's
`content` prop is optional — leave it undefined (shows a dark placeholder) until
the user is ready to wire in live components.

```tsx
import { InfiniteCanvas } from '../../templates/InfiniteCanvas'
import { SpecSheet } from '../../templates/SpecSheet'
import type { PrototypeProps } from '../../registry'

export default function <ComponentName>({ isDark, onToggleTheme }: PrototypeProps) {
  return (
    <InfiniteCanvas title="<Prototype title>" isDark={isDark} onToggleTheme={onToggleTheme}>
      <SpecSheet
        title="<Prototype title>"
        description="<What this spec covers>"
        sections={[
          {
            title: 'Desktop',
            description: 'Desktop browser at 1280px',
            boards: [
              { width: 1280, height: 800, caption: 'Default state' },
            ],
          },
        ]}
      />
    </InfiniteCanvas>
  )
}
```

---

### Step 3 — Register the prototype

Add an entry to `src/registry.ts`. Use `category` to control which home page
tab the item appears in, and `status` for its workflow state:

| Field | Values | Required |
|---|---|---|
| `category` | `'Spec'` \| `'Prototype'` \| `'Template'` \| `'Reference'` | Always |
| `status` | `'WIP'` \| `'In Review'` \| `'Complete'` \| `'Archived'` | Specs and Prototypes only |

New prototypes built from a template default to their natural category:
- Blank / Canvas Page → `category: 'Prototype'`, `status: 'WIP'`
- Spec Sheet → `category: 'Spec'`, `status: 'WIP'`

```ts
{
  id: '<id>',
  title: '<Title>',
  path: '/<id>',
  createdAt: '<today's date as YYYY-MM-DD>',
  category: 'Prototype',
  status: 'WIP',
  component: lazy(() => import('./prototypes/<id>')),
},
```

Also add `backTo="/"` to the `InfiniteCanvas` component when using the Spec
Sheet template, so the nav bar shows a back button to the home page.

Insert the new entry at the top of the `prototypes` array so it appears first
in the home page list.

---

## Deleting a prototype

1. Remove the entry from `src/registry.ts`
2. Delete the directory `src/prototypes/<id>/`

Confirm the id before deleting. If the prototype has a `status` of `Complete`,
warn the user before proceeding.

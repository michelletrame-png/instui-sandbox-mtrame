---
name: sandbox-design-spec
description: >
  Guides creation of spec sheets in this InstUI sandbox. Invoke when the user
  asks to create a new spec, add boards to a spec, or spec out a user flow,
  screen, or component for design handoff.
---

# Sandbox Spec Sheet Guide

Spec sheets are the primary handoff format in this sandbox. They document user
flows and screen states as a scrollable, pannable infinite canvas of labeled
artboard frames. Each board can carry live InstUI JSX, UX copy, and clean
InstUI source code — making them useful for:

- **User flow walkthroughs** — showing how a user moves through a sequence of
  screens
- **Design specifications** — annotating component states, edge cases, and
  layout constraints
- **Dev handoff** — attaching InstUI source (the "InstUI Source" button) so
  engineers see production-ready component code
- **Copy handoff** — attaching structured UX copy (the "UX Copy" button) so
  writers and PMs can review and export to a spreadsheet

---

## Structure

A spec is a `SpecSheet` component with one or more **sections**, each
containing one or more **boards**.

```
SpecSheet
  └── Section (e.g. "Desktop", "Mobile", "Component States")
        └── Board (e.g. "Agent Closed", "Empty State")
              ├── content   — live React preview (React.ReactNode)
              ├── code      — flat InstUI JSX string for dev handoff
              ├── copy      — CopyEntry[] for UX copy handoff
              ├── notes     — plain-text annotation shown below the board
              └── playable  — adds a Replay button that restarts animations
```

### Sections

Organize sections by viewport, feature area, or phase. Common patterns:

| Section title | Use when |
|---|---|
| `Desktop` | Full browser layouts |
| `Mobile` | Phone viewport layouts |
| `Component States` | Isolated component variants (default, hover, error…) |
| `Flow: [Name]` | A specific user journey broken into sequential steps |

Each section has a `title`, an optional `description`, and a `boards` array.
Board numbers are auto-generated as `section.board` (e.g. `1.0`, `1.1`, `2.0`).

### Standard board sizes

| Context | Width | Height |
|---|---|---|
| Desktop browser | `1440` | `800` |
| Mobile (iPhone) | `390` | `835` |
| Component / detail | any | any |

Boards can be any size — these are just the defaults for full-screen layouts.
Omit `height` entirely to let the board grow with its content (no clipping).

---

## Frame files

Each board's live content goes in its own file under `src/designs/<id>/frames/`.

**Frame files export plain functions, not React components.** They accept
`FrameCtx` and return `React.ReactNode`. Hooks stay in `index.tsx` only.

### Three invariants — enforce without exception

1. **One frame per file.** Each file exports exactly one frame function and its
   companion `*Code` string. Bundling multiple frames in one file makes it easy
   for the code export and the render to drift apart unnoticed.

2. **Flat JSX only.** No custom sub-components inside a frame function — only
   InstUI components used directly. The sole exception is a frame that needs
   `useState` (e.g. a toggling panel); in that case the component goes in its
   own file with `/* eslint-disable react-refresh/only-export-components */`.

3. **Code export must match the rendered content exactly.** The `*Code` string
   is what engineers see when they click "InstUI Source" in the spec viewer.
   It must be a faithful JSX representation of what the frame function renders —
   same props, same structure, same copy, same animation wrappers. **When you
   modify a frame, update its `*Code` export in the same edit.** Silent drift
   between the preview and the source handoff is the primary failure mode.

When reviewing or auditing frame files: read both the function body and its
`*Code` export and confirm they match before declaring the work done.

```tsx
// frames/desktop-agent-closed.tsx
import React from 'react'
import { View } from '@instructure/ui-view/latest'
import type { FrameCtx } from '../../../templates/SpecSheet'

export function desktopAgentClosed({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      width="100%"
      height="100%"
      padding="small"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
      overflowX="hidden"
      overflowY="hidden"
    >
      {/* flat InstUI JSX — no custom sub-components */}
    </View>
  )
}

export const desktopAgentClosedCode = `<View ...>...</View>`

export const desktopAgentClosedCopy: CopyEntry[] = [
  { label: 'Page title', text: 'Dashboard' },
  { label: 'AI button: screen reader label', text: 'Open AI assistant' },
]
```

`index.tsx` imports every frame, calls them with `ctx`, and passes the result
to `SpecSheet`:

```tsx
// index.tsx
import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet } from '../../templates/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { desktopAgentClosed, desktopAgentClosedCode, desktopAgentClosedCopy } from './frames/desktop-agent-closed'

export default function MySpec(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx = { sharedTokens }

  return (
    <SpecSheet
      title="My Spec"
      description="What this spec covers."
      sections={[
        {
          title: 'Desktop',
          description: 'Full browser at 1440×800',
          boards: [
            {
              width: 1440, height: 800, caption: 'Default state',
              notes: 'User arrives at the page for the first time.',
              content: desktopAgentClosed(ctx),
              code: desktopAgentClosedCode,
              copy: desktopAgentClosedCopy,
            },
          ],
        },
      ]}
    />
  )
}
```

### Rules for frame content

- **Flat JSX only.** No custom sub-components inside a frame. Only InstUI
  components rendered as components.
- **No hooks inside frames.** Compute everything from `sharedTokens` or from
  values derived at the top of the frame function.
- **One frame per file.** Keep files small — one board's content, its `code`
  string, and its `copy` array.
- **Use `width="100%" height="100%"` on the root View** inside each frame so
  it fills the artboard. The artboard wrapper handles clipping.

### Sidebar layout pattern

When a frame includes a SideNavBar, use this structure to place it cleanly
without height hacks:

```tsx
<View as="div" width="100%" height="100%" padding="small" background="secondary"
  themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
  display="block" overflowX="hidden" overflowY="hidden">
  <Flex height="100%" alignItems="start" gap="medium" padding="0">
    <View as="div" height="100%" display="block">
      <SideNavBar
        label="Main navigation"
        toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
        themeOverride={{ marginBottom: '0', margin: '0' } as object}
      >
        {/* nav items */}
      </SideNavBar>
    </View>
    {/* page content as Flex.Item shouldGrow shouldShrink */}
    {/* agent panel or right column as <View height="100%"> */}
  </Flex>
</View>
```

The `themeOverride={{ marginBottom: '0', margin: '0' } as object}` is required
to strip the SideNavBar's internal 0.75rem margin. `margin` is not in the
TypeScript type but exists at runtime in v2, so the cast is necessary.

---

## UX copy exports

Each `CopyEntry` has a `label` and a `text`. Labels should describe the
element's role in the UI, not just its position:

```ts
{ label: 'Page title', text: 'Dashboard' }
{ label: 'Empty state heading', text: 'No courses yet' }
{ label: 'Submit button', text: 'Save changes' }
{ label: 'Error: required field', text: 'This field is required.' }
```

The "UX Copy" modal in the spec viewer can export all entries to a
tab-separated format compatible with Google Sheets.

---

## Animations in frames

Frames can include CSS animations to demonstrate motion patterns — loading
states, sequential reveals, entrance sequences, etc.

### Injecting keyframes

Use `Global` from `@instructure/emotion` to inject `@keyframes` rules. This is
the only correct approach — the `keyframes` utility alone does not insert the
rule into the document.

```tsx
import { Global } from '@instructure/emotion'

// Inside the frame function's return:
<>
  <Global styles={`
    @keyframes my-animation {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `} />
  {/* rest of content */}
</>
```

`Global` must render inside the React tree, not at module scope.

### Sequential reveal pattern

For boards that show content appearing in stages (e.g. an agent response
building up), use a single `@keyframes agent-fade-in` with staggered
`animation-delay` on each element. This is simpler and more predictable than
separate keyframes per element.

```tsx
<Global styles={`
  @keyframes agent-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`} />
```

Then apply delays with a helper inline:

```tsx
const fadeIn = (i: number): React.CSSProperties => ({
  opacity: 0,
  animation: `agent-fade-in 300ms ease-out ${i * 150}ms both`,
})

// Each element gets its stagger index:
<div style={fadeIn(0)}><Text>{responseText}</Text></div>
<div style={fadeIn(1)}><Flex gap="xx-small">...actions...</Flex></div>
<div style={fadeIn(2)}><Button>Suggestion 1</Button></div>
<div style={fadeIn(3)}><Button>Suggestion 2</Button></div>
```

- `300ms ease-out` matches InstUI's Transition duration
- `150ms` stagger between elements feels natural; adjust to taste
- `animation-fill-mode: both` keeps each element invisible during its delay
  and visible after it completes — required when `opacity: 0` is the starting
  state

### Replay button

Add `playable: true` to a board to show a **Replay** button below it. Clicking
it remounts the board content (via a React key change), restarting all
`animation-delay` timers from zero. Use this for any board with entrance
animations so reviewers can re-watch without refreshing.

```tsx
{
  width: 420, height: 900,
  caption: 'Response reveal',
  content: myFrame(ctx),
  playable: true,
}
```

### Ellipsis cycling animation

For loading states with an animated `...` indicator, use two keyframes on the
second and third dots — each dot holds at `opacity: 0` for a portion of the
cycle then snaps to visible:

```tsx
<Global styles={`
  @keyframes agent-ellipsis-dot2 {
    0%, 33%   { opacity: 0; }
    34%, 100% { opacity: 1; }
  }
  @keyframes agent-ellipsis-dot3 {
    0%, 66%   { opacity: 0; }
    67%, 100% { opacity: 1; }
  }
`} />

<View as="span" display="inline-block">
  <Text weight="bold" color="secondary">.</Text>
  <span style={{ animation: 'agent-ellipsis-dot2 0.9s linear infinite', opacity: 0 }}>
    <Text weight="bold" color="secondary">.</Text>
  </span>
  <span style={{ animation: 'agent-ellipsis-dot3 0.9s linear infinite', opacity: 0 }}>
    <Text weight="bold" color="secondary">.</Text>
  </span>
</View>
```

### Helper functions in frame files

Frames are plain functions, not React components — local variables and helper
functions are fine. Use them to keep animation styles DRY:

```tsx
export function myFrame({ sharedTokens }: FrameCtx): React.ReactNode {
  const fadeIn = (i: number): React.CSSProperties => ({
    opacity: 0,
    animation: `agent-fade-in 300ms ease-out ${i * 150}ms both`,
  })
  return (
    <>
      <Global styles={`@keyframes agent-fade-in { from { opacity: 0; } to { opacity: 1; } }`} />
      ...
    </>
  )
}
```

No hooks — just plain JS in the function body.

---

## InstUI source exports

The `code` export is a flat JSX string — the same structure as the rendered
content but without runtime token references resolved. Use template literals
to show token paths:

```ts
export const myFrameCode = `<View
  background="secondary"
  themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
>
  ...
</View>`
```

---

## Reference implementation

**`src/designs/agent-screens/`** is the canonical example of a complete
spec sheet:

- 2 sections: Desktop (1440×800) and Mobile (390×835)
- 8 boards across both sections
- Frame files under `frames/` — one file per board
- Board 1.0 exports `code` (InstUI source) and `copy` (UX copy)
- Board 1.1 exports `code` only
- SideNavBar placed using the margin-override pattern above

Use it as a reference when building new specs.

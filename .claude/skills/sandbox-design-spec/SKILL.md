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
  ├── basePath       — repo-relative path to this spec's folder
  ├── frameSources   — Record<path, source> from import.meta.glob('./frames/*.tsx', { query: '?raw', ... })
  └── Section (e.g. "Desktop", "Mobile", "Component States")
        └── Board (e.g. "Agent Closed", "Empty State")
              ├── content   — live React preview (React.ReactNode)
              ├── frame     — key matching ./frames/<frame>.tsx for dev handoff
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

**The frame file IS the dev handoff.** When an engineer (or their coding
agent) clicks "InstUI Source" on a board, the SpecSheet emits a header with a
SHA-pinned permalink to the frame file in your sandbox repo, followed by the
frame's literal source. There is no parallel `*Code` string to maintain — the
file is the contract.

### Three invariants

1. **One frame per file.** Each file exports exactly one frame function (plus
   any companion `*Copy` array). Keep files small — one board, one file.

2. **Self-contained imports.** A frame may import from `@instructure/*`,
   `react`, `@instructure/emotion`, and the local `FrameCtx` type. Do **not**
   import from elsewhere in the sandbox (`../../components/...`, sibling
   designs, app utilities). The receiving agent reads only this file as the
   primary handoff; outside imports break the contract.

3. **No capitalized custom components inside the frame.** A `<MyStatusBadge />`
   tag introduces a name the receiving agent can't resolve from InstUI alone.
   Lowercase render functions (`function row(item) { return <Flex>...</Flex> }`,
   called as `{row(item)}`) are fine — they read as inline JS, not as a custom
   abstraction. Sub-components needed for `useState` are the one exception
   (covered below).

Helpers, `.map()`, data constants, and inline render functions are all
encouraged when they make the file clearer. The author writes the file the way
they actually want; the receiving agent reads the same file directly.

```tsx
// frames/desktop-agent-closed.tsx
import React from 'react'
import { View } from '@instructure/ui-view/latest'
import type { FrameCtx, CopyEntry } from '../../../components/SpecSheet'

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
      {/* InstUI JSX, helpers, .map() — anything self-contained */}
    </View>
  )
}

export const desktopAgentClosedCopy: CopyEntry[] = [
  { label: 'Page title', text: 'Dashboard' },
  { label: 'AI button: screen reader label', text: 'Open AI assistant' },
]
```

`index.tsx` imports every frame, exposes the raw sources via
`import.meta.glob`, and passes both into `SpecSheet`:

```tsx
// index.tsx
import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet } from '../../components/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { desktopAgentClosed, desktopAgentClosedCopy } from './frames/desktop-agent-closed'

const frameSources = import.meta.glob('./frames/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export default function MySpec(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx = { sharedTokens }

  return (
    <SpecSheet
      title="My Spec"
      description="What this spec covers."
      basePath="src/designs/my-spec"
      frameSources={frameSources}
      sections={[
        {
          title: 'Desktop',
          description: 'Full browser at 1440×800',
          boards: [
            {
              width: 1440, height: 800, caption: 'Default state',
              notes: 'User arrives at the page for the first time.',
              content: desktopAgentClosed(ctx),
              frame: 'desktop-agent-closed',
              copy: desktopAgentClosedCopy,
            },
          ],
        },
      ]}
    />
  )
}
```

The `frame` value matches the file name without extension —
`'desktop-agent-closed'` resolves to `./frames/desktop-agent-closed.tsx`.
`basePath` is the repo-relative path to the spec's folder; it's used to build
the GitHub permalink in the handoff header.

### Rules for frame content

- **Self-contained.** Imports come only from `@instructure/*`, `react`,
  `@instructure/emotion`, or the `FrameCtx`/`CopyEntry` types in
  `../../../components/SpecSheet`.
- **No capitalized custom components.** Use lowercase render functions for DRY
  patterns, not React sub-components. The exception is a stateful sub-component
  (covered in the next section).
- **No hooks inside frames.** Compute everything from `sharedTokens` or from
  values derived at the top of the frame function.
- **One frame per file.** Keep files small — one board's content plus its
  optional `*Copy` array.
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

## InstUI source handoff

When a board has `frame: 'name'`, clicking "InstUI Source" copies a payload
that combines a SHA-pinned permalink to the frame file with the frame's
literal source. Receiving coding agents read the source file directly from
your sandbox repo via `gh` or a raw URL — no parallel string to maintain.

The header looks like this:

```
// ─────────────────────────────────────────────────────────────────────
// InstUI Spec Sheet — Design Handoff
// ─────────────────────────────────────────────────────────────────────
// Spec:    My Spec
// Section: Desktop
// Board:   1.0 — Default state
// Source:  src/designs/my-spec/frames/desktop-default.tsx
// Repo:    org/sandbox @ a3f9e21
// Browse:  https://github.com/org/sandbox/blob/a3f9e21/src/designs/.../desktop-default.tsx
// Raw:     https://raw.githubusercontent.com/org/sandbox/a3f9e21/src/designs/.../desktop-default.tsx
//
// Read the source file before integrating — imports, helpers, and any
// cross-file references the snippet below relies on live in the file.
//
// Sibling boards in this section (read for full flow context):
//   1.1  frames/desktop-loading.tsx — Loading
//   1.2  frames/desktop-error.tsx — Error
// ─────────────────────────────────────────────────────────────────────
```

Followed by the literal contents of the frame file. The receiving agent's
expected workflow is to fetch the file at the pinned SHA, review siblings as
needed, and integrate. The snippet itself is a fallback — the file is the
contract.

If the sandbox has no remote configured yet, the header omits the URLs and
notes that `/sandbox-publish` will enable them. If the working tree is dirty
relative to the pinned SHA, the header includes a warning.

---

## Reference implementation

When a canonical spec exists under `src/designs/` it should be referenced
here. Until then, follow the patterns above and the SpecSheet template at
`src/components/SpecSheet.tsx`'s default export.

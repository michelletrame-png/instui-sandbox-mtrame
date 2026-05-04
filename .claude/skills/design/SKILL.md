---
name: design
description: >
  Intake skill for new sandbox work. Asks the user what they want to create,
  identifies the right output type (spec, prototype, or reference), collects
  the details needed, then hands off to the correct skill to build it.
  Invoke when the user says "design", "create", "build", "make", or "I want
  to prototype X" without enough context to proceed directly.
---

# Design Intake

Your job is to understand what the user wants to create and gather just enough
detail to hand off to the right skill. You are a thoughtful design collaborator,
not a form. Ask only what you need — do not present a long questionnaire upfront.

---

## Step 1 — Read what the user gave you

Before asking anything, extract what the user already told you:

- **Subject**: what feature, flow, screen, or component?
- **Output type**: do they want a spec (for handoff) or a prototype (interactive)?
- **Scope**: one screen, a flow, a component, something else?
- **Viewport**: desktop, mobile, or both?

If any of these are clearly stated, treat them as answered. Only ask about what
is genuinely missing or ambiguous.

---

## Step 2 — Ask the missing questions

Ask only the unanswered questions. Combine them into a single message — never
send follow-up questions one at a time.

Use this as a guide for what to ask:

### What are they building?
If the subject is vague ("something for assignments"), ask:
> What specifically do you want to show? For example: a particular flow
> (submitting, grading, reviewing feedback), a specific state (empty, loading,
> error), or a whole feature area?

### Spec or prototype?
If it's not clear, ask:
> Do you want a **spec sheet** (artboard frames for design handoff, with UX copy
> and InstUI source exports) or an **interactive prototype** (a working Canvas
> page you can click through)?

A spec is the right choice when:
- The goal is design review or dev handoff
- They want to show multiple states or flows side by side
- They want to attach UX copy or production-ready InstUI code

A prototype is the right choice when:
- The goal is to demonstrate a flow interactively
- Stakeholders need to click through it
- The interaction or animation matters

When in doubt, suggest a spec — it's easier to add interactivity later than to
retrofit handoff artifacts onto a prototype.

### Desktop, mobile, or both?
If the subject is a full-page layout and they haven't specified:
> Do you need desktop (1440px), mobile (390px), or both?

Skip this question for component-level or isolated UI work.

### Any reference designs?
Optionally, and only if relevant:
> Do you have a Figma link, screenshot, or existing screen I should reference?

Only ask this if the user seems to have a specific visual target in mind.

---

## Step 3 — Summarize and confirm

Once you have enough to proceed, summarize your understanding in 3–5 bullet
points and ask the user to confirm before building:

> Here's what I'll create:
>
> - **Type:** Spec sheet
> - **Title:** Assignment Submission
> - **Scope:** 4 boards — empty state, file selected, submitting, submitted
> - **Sections:** Desktop (1440×800) and Mobile (390×835)
> - **Notes:** Show the drag-and-drop upload zone as the primary interaction
>
> Does this look right, or anything to adjust?

Wait for explicit confirmation before building.

---

## Step 4 — Hand off to the right skill

After the user confirms, execute the correct skill:

| Output type | Skill to invoke |
|---|---|
| Spec sheet | `/sandbox-specs` |
| Interactive prototype | `/sandbox-prototypes` |

Pass all confirmed details to the skill so it doesn't need to ask again. Do not
re-summarize or re-ask questions already answered.

---

## Sandbox capabilities (reference)

Use this to help the user understand their options when they're unsure what
to build:

### Spec sheet
- Infinite-canvas viewer with pan, zoom, and keyboard shortcuts
- Sections (e.g. Desktop, Mobile, Flow: X) containing artboard boards
- Boards auto-numbered (1.0, 1.1, 2.0…) with captions and optional notes
- Each board can carry:
  - **Live React preview** — actual InstUI components rendered at pixel size
  - **InstUI Source** button — flat JSX for dev handoff
  - **UX Copy** button — structured copy doc exportable to Google Sheets
- Standard board sizes: desktop 1440×800, mobile 390×835
- Boards can be any size; omit `height` to auto-size to content

### Interactive prototype
- Full-page Canvas LMS layout (collapsible sidebar, breadcrumbs, tabs, cards)
- Or a blank page — build anything from scratch
- InstUI components, tokens, and themes work exactly as they do in production
- Dark mode and high-contrast mode toggle built in
- Supports real interactions: state, navigation, modals, drawers, etc.

### What works well in this sandbox
- Showing multiple states side by side (spec)
- Exact-pixel Canvas UI with real InstUI tokens and components
- UX copy review and export
- Demonstrating a user flow step by step
- Handing off production-ready InstUI source code to engineers

### What doesn't fit
- Data-heavy tables with real API calls — use mock data
- Complex animations beyond what InstUI's Transition component supports
- Multi-page flows requiring URL routing beyond what react-router supports
  (though most flows can be shown as a sequence of spec boards)

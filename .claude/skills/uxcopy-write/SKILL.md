---
name: uxcopy-write
description: >
  Generate on-brand UX copy for a specific UI pattern or Figma frame, following
  the Instructure style guide. Invoke when a designer needs copy for a new UI
  pattern — empty state, error message, tooltip, modal, button label — or is
  exploring options before a content review.
---

# Write Microcopy

## Before doing anything else

Read `.claude/references/style-guide.md` in full. The style guide is the source of truth — it wins over any other guidance.

## Instructions

1. Ask the user for:
   - The UI pattern type (empty state, error message, confirmation modal, tooltip, button label, notification, etc.)
   - A Figma frame link OR a plain description of the screen and what the user is trying to do
   - Any additional context: user's emotional state, where they are in the journey, space constraints

2. If a Figma URL is provided, use `mcp__figma__get_figma_data` to read the frame before writing. Look for existing placeholder text, layout constraints, and the component type to inform copy length.

3. Generate 3 copy options for each text element in the pattern.

4. For each option, note the tone being used: knowledgeable, encouraging, sincere, playful, or direct.

5. Flag any options that push toward the edge of the style guide so the writer can make a judgment call.

6. Return options in this format:

   **[Element name]**
   - Option A (tone: direct): [copy]
   - Option B (tone: encouraging): [copy]
   - Option C (tone: sincere): [copy]

## Examples

**Input:** Empty state for a gradebook with no assignments yet. Teacher is new to the platform.

**Output:**

**Header**
- Option A (tone: direct): No assignments yet
- Option B (tone: encouraging): Ready when you are
- Option C (tone: playful): A clean slate — let's fill it

**Body**
- Option A (tone: direct): Create your first assignment to get started.
- Option B (tone: encouraging): When you're ready to build your first assignment, we're here to help.
- Option C (tone: sincere): Every great course starts with a first step. Add an assignment when you're ready.

**CTA**
- Option A (tone: direct): Create assignment
- Option B (tone: direct): New assignment
- Option C (tone: direct): Add assignment

## After generating

Remind the user that all AI-generated copy must be reviewed by a human writer before shipping to production. If they want to check the final selection against the style guide, suggest running the `uxcopy-check` skill.

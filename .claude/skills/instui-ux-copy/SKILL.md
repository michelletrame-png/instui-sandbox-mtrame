---
name: instui-ux-copy
description: >
  Review or write UX copy following the Instructure style guide. Triggered
  automatically by the PostToolUse hook when human-visible strings are detected
  in a prototype TSX file — review those strings for style issues and
  placeholders. Invoke manually when the user asks to review existing copy or
  generate new copy for a UI pattern.
---

# UX Copy

## Before doing anything else

Read `references/style-guide.md` in full. The style guide is the source of truth — it wins over any other guidance.

---

## Mode: Review

**When to use:** PostToolUse hook fires after editing a TSX file, or the user asks to check or audit existing copy.

### Instructions

1. Accept the copy to review. It can be:
   - Strings flagged by the PostToolUse hook
   - Pasted directly by the user
   - Extracted from a prototype TSX file the user specifies

2. **First, scan for placeholder and lorem ipsum text.** Flag any string that is clearly not real copy — this is a hard block and must be reported before style issues. Placeholder patterns include:
   - Lorem ipsum (any Latin filler text)
   - Generic labels used as copy: "Page title", "Card title", "Tab item", "Content area", "Short card description", "Primary action", "Secondary action", "Header text", "Body text", "Label", "Description", "Placeholder"
   - Numbered stand-ins: "Option A", "Option B", "Item 1"
   - Anything that reads as a slot name rather than real content

   Report these as ❌ **Placeholder** with the exact string and location. Do not apply style guide checks to placeholder strings — they need real copy first.

3. For non-placeholder strings, check each area in order:
   - **Voice:** Is it clear, confident, and conversational?
   - **Tone:** Is it appropriate for the context and the user's emotional state?
   - **Plain language:** Under 25 words per sentence? 8th grade reading level? Simple words?
   - **Inclusive language:** Any terms from the avoid lists?
   - **Grammar and mechanics:** Capitalization (sentence case), contractions, punctuation, active voice, no semicolons, Oxford comma

4. Return a structured report:
   - ✅ What's working
   - ⚠️ Suggestions (could be better)
   - ❌ Violations (conflicts with the style guide)
   - ❌ Placeholder — strings that must be replaced before handoff

5. For every ⚠️ and ❌ style item, provide a specific rewrite — never flag without a fix. For ❌ Placeholder items, ask the user for context (UI pattern, user goal, emotional state) then generate real copy using the Write mode below.

### Examples

**Input:** "Are you sure you want to delete this item? This action cannot be undone."

**Output:**
- ⚠️ "Are you sure" is a weak opener — avoid confirmation question patterns
- ⚠️ "This action cannot be undone" is passive and wordy
- Suggested rewrite: "Delete this item? You won't be able to undo this."

---

**Input (from a TSX file):** `<Heading>Page title</Heading>`, `<Text>Short card description</Text>`, `<Button>Primary action</Button>`

**Output:**
- ❌ Placeholder: "Page title" — generic slot label. What is this page for?
- ❌ Placeholder: "Short card description" — generic slot label. What does this card contain?
- ❌ Placeholder: "Primary action" — generic slot label. What action does this button perform?

### After reviewing

If violations were found, offer to rewrite the affected strings in the TSX file. All AI-generated copy must be reviewed by a human writer before shipping to production — flag this if the copy is heading toward handoff.

---

## Mode: Write

**When to use:** The user needs copy for a new UI pattern, or placeholder strings were flagged in a review.

### Instructions

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

### Example

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

### After generating

Remind the user that all AI-generated copy must be reviewed by a human writer before shipping to production.

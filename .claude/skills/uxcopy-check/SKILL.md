---
name: uxcopy-check
description: >
  Review UX copy against the Instructure style guide for voice, tone, grammar, and
  mechanics. Triggered automatically by the PostToolUse hook when human-visible strings
  are detected in a prototype TSX file — do not invoke proactively. Invoke manually
  only when the user explicitly asks to review copy.
---

# Tone Check

## Before doing anything else

Read `.claude/references/style-guide.md` in full. The style guide is the source of truth — it wins over any other guidance.

## Instructions

1. Accept the copy to review. It can be:
   - Pasted directly by the user
   - Extracted from a prototype TSX file the user specifies
   - Strings flagged by the copy-detection hook

2. **First, scan for placeholder and lorem ipsum text.** Flag any string that is clearly not real copy — this is a hard block and must be reported before style issues. Placeholder patterns include:
   - Lorem ipsum (any Latin filler text)
   - Generic labels used as copy: "Page title", "Card title", "Tab item", "Content area", "Short card description", "Primary action", "Secondary action", "Header text", "Body text", "Label", "Description", "Placeholder"
   - Numbered stand-ins: "Option A", "Option B", "Item 1"
   - Anything that reads as a slot name rather than real content

   Report these as ❌ **Placeholder** with the exact string and the location. Do not apply style guide checks to placeholder strings — they need real copy first.

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

5. For every ⚠️ and ❌ style item, provide a specific rewrite — never flag without a fix. For ❌ Placeholder items, ask the user for context (UI pattern, user goal, emotional state) so you can generate real copy using the uxcopy-write skill.

## Examples

**Input:** "Are you sure you want to delete this item? This action cannot be undone."

**Output:**
- ⚠️ "Are you sure" is a weak opener — avoid confirmation question patterns
- ⚠️ "This action cannot be undone" is passive and wordy
- Suggested rewrite: "Delete this item? You won't be able to undo this."

---

**Input:** "Please click the button below to facilitate your request."

**Output:**
- ❌ "Please" — filler politeness word, not in our voice
- ❌ "click" — avoid self-evident verbs in CTAs
- ❌ "facilitate" — hidden verb; use simpler language
- ❌ "below" — avoid directional language
- Suggested rewrite: "Submit your request."

---

**Input (from a TSX file):** `<Heading>Page title</Heading>`, `<Text>Short card description</Text>`, `<Button>Primary action</Button>`

**Output:**
- ❌ Placeholder: "Page title" — generic slot label, not real copy. What is this page for?
- ❌ Placeholder: "Short card description" — generic slot label. What does this card contain?
- ❌ Placeholder: "Primary action" — generic slot label. What action does this button perform?
- To generate real copy for these, run the `uxcopy-write` skill or describe the UI pattern and user goal.

## After the review

If violations were found, offer to rewrite the affected strings in the TSX file. All AI-generated copy must be reviewed by a human writer before shipping to production — flag this to the user if the copy is heading toward handoff.

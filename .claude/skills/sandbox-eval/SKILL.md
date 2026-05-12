---
name: sandbox-eval
description: >
  Reviews the current conversation and produces a timestamped quality-evaluation
  report in .claude/evals/. Only invoke when the user explicitly requests it —
  never auto-invoke. Surfaces InstUI token errors, Instructure copy violations,
  and general design mistakes the agent made or had corrected by the user. Output
  is shared with the harness maintainer to improve skills, hooks, and reference code.
---

# InstUI Eval — Session Quality Report

This skill produces an honest, specific quality report for the current session.
Its purpose is harness improvement, not blame. Write findings that would let
someone who wasn't in this conversation understand what went wrong and how to
prevent it next time.

---

## Step 1 — Orient

Note the current date and time (use `date '+%Y-%m-%d %H:%M'` in bash). You'll
use this for the filename and report header.

Identify what was built in this session: which prototype(s), what features, what
the user asked for. One or two sentences — this is context for the reader, not a
summary of the whole chat.

---

## Step 2 — Scan the conversation

Read the full conversation history with fresh eyes. You are looking for signals
that the agent made a mistake or needed correction. These signals include:

**User corrections**
- The user saying "no", "that's wrong", "change that", "don't do that", "actually",
  "undo", "revert", or equivalent phrasing
- The user asking you to redo something you already did
- The user correcting a value (a color, a spacing size, a component choice, a
  label, a layout decision) after you wrote it

**ESLint failures**
- Hook output that contained an ESLint error or warning after an Edit or Write
- Cases where you added an `eslint-disable` comment to silence a rule
- Cases where a warning was noted and left unresolved

**Figma translation errors**
- A token path you used that didn't match what was in the Figma source
- A hardcoded hex or rgba value pulled from Figma that should have become a token
- A size, radius, or spacing value taken literally from Figma rather than mapped
  to the nearest InstUI token

**Design drift**
- Layout structure or spacing the user revised after seeing the rendered output
- Component choices the user asked to replace (e.g. custom `View`+`Flex` stack
  replaced with a native InstUI component that already existed)
- Theme handling that didn't respond correctly to dark/high-contrast mode

**Copy and content mistakes**
- Any text written that violated Instructure voice: passive voice, forbidden words
  (empowering, harnessing, unlocking, supercharging, transforming, game-changing,
  seamless, robust), jargon (synergy, leverage, pedagogical modality)
- Product names not in Title Case (Canvas, Mastery, Parchment, Instructure)
- Headline casing that wasn't sentence case
- Missing or wrong Oxford comma
- Numbers below 10 written as numerals, or 10+ written as words
- Placeholder text left in delivered output

---

## Step 3 — Categorize findings

Group every finding into one of three categories. A single incident can produce
findings in multiple categories if it involves, say, both a wrong token and a
copy error in the same component.

### Category A: InstUI Issues

Issues related to the component library itself:

- Wrong or missing token (e.g. used `sharedTokens.stroke.mutedColor` when the
  correct token was `sharedTokens.stroke.borderColor`)
- `<View background>` used without paired `themeOverride`
- Hardcoded hex in `style` prop or in a `themeOverride` value
- Theme branching on name string instead of `useComputedTheme()` tokens
- Wrong component selected for a pattern (custom layout when a native InstUI
  component existed and fit the need)
- Icon color not inherited correctly from parent (applies especially to the new
  `*InstUIIcon` system)
- Animation or transition implemented without the `Transition` component
- `Flex.Item` overflow not clipped when it should have been
- Figma spacing or radius taken literally instead of mapped to the token grid

For each finding, note:
- The file and approximate location (component name or line, if known)
- What you used vs. what you should have used
- Whether an ESLint rule covers this (if not, flag it as a gap)

### Category B: Copy & Content Issues

Issues related to Instructure's voice and content standards:

- Passive voice
- Forbidden words or jargon
- Product name capitalization or possessive misuse
- Wrong headline casing
- Oxford comma missing
- Number formatting violation
- Placeholder text in delivered output
- UI labels that were too long, too technical, or inconsistent with Canvas
  patterns

For each finding, quote the incorrect text as written, then show the corrected
version. Note where in the conversation the user flagged it (or if it wasn't
flagged but you can identify the violation in retrospect).

### Category C: General Design Issues

Everything else — structural, visual, or process issues:

- Layout decisions the user reversed (e.g. a sidebar width, a card layout, a
  spacing choice)
- Component hierarchy that required refactoring after initial delivery
- Features added beyond scope that the user had to remove
- Missing edge cases the user had to point out (empty states, responsive
  breakpoints, loading states)
- Accessibility gaps (missing `aria-label`, wrong heading hierarchy, unlabeled
  interactive elements)
- Cases where you didn't check the reference code before inventing a pattern

---

## Step 4 — Write the report

Create `.claude/evals/YYYY-MM-DD-HH-MM-session-eval.md` in the project root.
Use the actual timestamp from Step 1 — no placeholder text.

Use this structure:

```markdown
# Session Eval — YYYY-MM-DD HH:MM

## Session context
[One or two sentences: what was built, which prototype(s) were involved]

## InstUI issues
[Each finding as a sub-section. If none, write "None identified."]

### [Short title for the issue]
**What happened:** [One clear sentence describing the mistake]
**Evidence:** [Quote or paraphrase from the conversation that shows it happened]
**Root cause hypothesis:** [Why did the agent make this mistake? Missing skill
coverage? Wrong example in reference code? No ESLint rule? Ambiguous Figma
annotation?]
**Suggested fix:** [Specific, actionable: add a rule, update a skill section,
add a reference example, add a hook]

## Copy and content issues
[Each finding as a sub-section. If none, write "None identified."]

### [Short title]
**What was written:** `[exact incorrect text]`
**What it should be:** `[corrected version]`
**Which guideline:** [Name the specific rule it violated]
**Root cause hypothesis:** [Did the skill not cover this? Was there no hook to
catch it? Was it a Figma label taken literally?]
**Suggested fix:** [Specific action]

## General design issues
[Each finding as a sub-section. If none, write "None identified."]

### [Short title]
**What happened:** [One clear sentence]
**Evidence:** [Quote or paraphrase]
**Root cause hypothesis:** [Why? No reference example for this pattern?
Scope creep? Missed requirement?]
**Suggested fix:** [Specific action]

## Patterns and recommendations
[Step back from the individual findings. What themes emerge? If three findings
all trace back to the same missing skill coverage, say so. If there's a class of
Figma annotation the agent consistently misreads, name it. Write 3–6 bullets
that give the harness maintainer a prioritized action list.]

- **[Recommendation title]:** [One or two sentences — what to build and why it
  would prevent the findings above]

## Metadata
- **Date:** YYYY-MM-DD HH:MM
- **Prototype(s):** [list]
- **Skills invoked:** [list any skills explicitly loaded during the session]
- **ESLint failures:** [count, or "none"]
- **User corrections:** [count]
- **Figma source used:** [yes / no / partial]
```

---

## Step 5 — Be honest about zero findings

If a category has no real findings, write "None identified." Do not invent
findings or write vague observations to fill the section. A clean report is
valuable — it confirms the harness is working for this class of work.

If the session was too short to evaluate meaningfully (e.g. the user only asked
a question, no code was written), say so in the session context and skip the
category sections.

---

## Step 6 — Confirm and hand off

After writing the file, tell the user:

> Eval written to `.claude/evals/YYYY-MM-DD-HH-MM-session-eval.md`.
> [If there were findings:] Found [N] issue(s) across [categories with findings].
> [If clean:] No issues found — clean session.
>
> Share this file with your harness maintainer to help improve the skills and
> hooks for future sessions.

Do not summarize the findings verbally beyond the counts. The file is the
deliverable — the user will read it directly.

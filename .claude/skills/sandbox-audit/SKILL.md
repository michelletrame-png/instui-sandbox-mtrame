---
name: sandbox-audit
description: >
  Runs the design auditor on a prototype or spec in this sandbox. Invoke when
  the user asks to audit, review, or check a prototype for design quality,
  token correctness, accessibility, or copy hygiene. Also invoke when the user
  says "check my work" or "is this correct" about a prototype they just built.
---

# Sandbox Audit

## Step 1 — Identify the target

Determine which prototype or spec to audit:

1. If the user named a prototype in their request, use that.
2. If the conversation context makes it clear (e.g. they just built something),
   use that.
3. Otherwise, list the available prototypes from `src/registry.ts` and ask the
   user which one to audit.

Resolve the target to a file path:
- Prototype: `src/designs/<id>/index.tsx`
- Spec: `src/designs/<id>/index.tsx` plus all files in `src/designs/<id>/frames/`

## Step 2 — Run the auditor

Invoke the `design-auditor` sub-agent:

```
Agent({
  description: "Design audit",
  subagent_type: "design-auditor",
  prompt: "Audit <resolved file path(s)> and return a structured report."
})
```

## Step 3 — Present results

**If all checks pass (all ✓):**
Report clean to the user in one line.

**If there are ⚠ items:**
Show the user the full audit report. For each ⚠:
- If it is a clear mechanical fix (wrong token pairing, missing
  `screenReaderLabel`, stale placeholder text), ask the user whether to fix it.
- If it requires a design decision, describe the issue and what the correct
  pattern is, then let the user decide.

Do not auto-fix without asking — this skill is user-facing, not an internal
build step. The user should see and approve any changes.

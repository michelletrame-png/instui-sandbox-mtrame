---
name: sandbox-update
description: >
  Commits any local changes and pulls updates from the upstream
  instui-sandbox-base repo into your sandbox. Invoke when the user asks to
  update, pull updates, get the latest from upstream, or commit and update.
---

# Sandbox Update

Two things happen in order: local work gets committed, then upstream
improvements get merged in. Either step is skipped if there's nothing to do.

---

## Step 1 — Commit any local changes

```bash
git status --short
```

**Output is empty** → nothing to commit. Skip to Step 2.

**Output has changes** → use the AskUserQuestion tool to ask:

> You have uncommitted changes. Would you like me to commit them before
> pulling updates?
>
> [list the changed files]

If yes, use the AskUserQuestion tool to ask for a commit message or propose one based on the files. Then:

```bash
git add <relevant files>
git commit -m "<message>"
```

If no → leave local changes as-is and continue.

---

## Step 2 — Ensure upstream remote exists

```bash
git remote -v
```

If `upstream` is not listed:

```bash
git remote add upstream https://github.com/instructure/instui-sandbox-base.git
```

---

## Step 3 — Fetch and check for upstream changes

```bash
git fetch upstream
git log HEAD..upstream/main --oneline
```

If output is empty:
> Your sandbox is already up to date — no new changes from upstream.

Stop here.

---

## Step 4 — Show what's coming

Display the commit list and explain:

> There are [N] new commit(s) from upstream. These are improvements to the
> harness, templates, and reference code. Your own prototypes won't be
> affected.

---

## Step 5 — Merge

```bash
git merge upstream/main --no-edit
```

**On conflict:** Stop immediately. List the conflicting files and give specific guidance:

**`src/registry.ts`** → The most common conflict. Upstream may have added a new template or reference entry. Keep all of the user's existing prototype entries and incorporate upstream's new entries alongside them. This is a quick manual merge.

**`vite.config.ts` or other config files** → Keep the user's version for anything they customized; accept upstream's for anything they didn't touch.

Say:
> There are merge conflicts in [files]. Once you've resolved them, run:
> `git add <files> && git commit`

Never auto-resolve conflicts.

---

## Done

Tell the user:

> Your sandbox is up to date with the latest from upstream.

Never offer to push. Pushing is a separate action — use `/sandbox-publish` when ready.

---

## Anti-patterns

- **Never `git push --force`.**
- **Never auto-resolve merge conflicts.** Stop and explain.
- **Never push.** This skill only pulls — pushing is handled by `/sandbox-publish`.

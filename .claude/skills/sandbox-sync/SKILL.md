---
name: sandbox-sync
description: >
  Commits any local changes and pulls updates from the upstream
  instui-sandbox-base repo into your sandbox. Invoke when the user asks to
  sync, pull updates, get the latest from upstream, or commit and update.
---

# Sandbox Sync

Two things happen in order: local work gets committed, then upstream
improvements get merged in. Either step is skipped if there's nothing to do.

---

## Step 1 — Commit any local changes

```bash
git status --short
```

**Output is empty** → nothing to commit. Skip to Step 2.

**Output has changes** → tell the user what's pending and ask:

> You have uncommitted changes. Would you like me to commit them before
> pulling updates?
>
> [list the changed files]

If yes, ask for a commit message or propose one based on the files. Then:

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

**On conflict:** Stop immediately. List the conflicting files and say:

> There are merge conflicts that need to be resolved manually. This usually
> happens when you and upstream both edited the same file (like
> `src/registry.ts` or `vite.config.ts`).
>
> Keep your own changes and accept upstream's for anything you didn't touch.
> Once resolved, run `git add <files> && git commit` to finish the merge.

Never auto-resolve conflicts.

---

## Step 6 — Push

Check whether a personal remote is configured:

```bash
git remote get-url origin 2>/dev/null || echo ""
```

**Returns nothing, or returns `https://github.com/instructure/instui-sandbox-base.git`** → no personal repo set up yet. Tell the user:

> Merge complete! Your local sandbox is up to date.
>
> To push and redeploy, you'll need a GitHub repo first. Run `/sandbox-publish setup` to create one.

Stop here.

**Returns a different URL** → a personal repo is configured. Offer to push:

> Merge complete. Ready to push — this will redeploy your sandbox with the
> upstream updates. Shall I push?

Wait for approval, then:

```bash
git push
```

---

## Anti-patterns

- **Never `git push --force`.**
- **Never auto-resolve merge conflicts.** Stop and explain.
- **Never push without explicit user approval.**

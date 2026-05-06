---
name: sandbox-push
description: >
  Commits any local changes and pushes to the user's GitHub repo, triggering
  a GitHub Pages redeploy. Routes to sandbox-publish setup if no personal repo
  is configured yet. After pushing, checks for upstream updates and suggests
  /sandbox-update if any exist. Invoke when the user asks to push, deploy,
  publish changes, or update the live sandbox.
---

# Sandbox Push

Commit, push, then check for upstream updates.

---

## Step 1 — Check that a personal remote is configured

```bash
git remote get-url origin 2>/dev/null || echo ""
```

**Returns nothing, or returns `https://github.com/instructure/instui-sandbox-base.git`** → no personal repo set up yet. Tell the user:

> You don't have a GitHub repo set up yet. Let's do that first.

Stop here and invoke `/sandbox-publish setup`.

**Returns a different URL** → continue.

---

## Step 2 — Commit any local changes

```bash
git status --short
```

**Output is empty** → nothing to commit. Skip to Step 3.

**Output has changes** → tell the user what's pending and ask for a commit message or propose one based on the files. Then:

```bash
git add <relevant files>
git commit -m "<message>"
```

---

## Step 3 — Push

> Ready to push and redeploy. Shall I proceed?

Wait for approval, then:

```bash
git push
```

Tell the user:
> Pushed. The live sandbox will update in ~2 minutes at:
> **`<pagesUrl>/`**
>
> Track progress: `https://github.com/instructure/<repo>/actions`

If `deploy.json` exists, read `repo.pagesUrl` and `repo.name` for the URLs above.
If it doesn't exist, omit the Pages URL line and just confirm the push succeeded.

---

## Step 4 — Check for upstream updates

```bash
git fetch upstream 2>/dev/null
git log HEAD..upstream/main --oneline 2>/dev/null
```

**Output is empty or fetch fails** → no updates. Done.

**Output has commits** → tell the user:

> There are updates available from the base repo. Run `/sandbox-update` to merge them in.

---

## Anti-patterns

- **Never `git push --force`.**
- **Never push without explicit user approval.**
- **Never push if origin points to the base repo.** Route to `/sandbox-publish setup` instead.

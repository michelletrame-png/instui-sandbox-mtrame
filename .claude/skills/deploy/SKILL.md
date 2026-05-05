---
name: deploy
description: >
  Manages fork setup, GitHub Pages configuration, upstream sync, and static
  prototype exports with fixed shareable URLs. Invoke when the user asks to
  set up their fork, deploy a prototype, share a link to a prototype, sync
  updates from upstream, list deployed exports, or rename/delete static deploys.
---

# Deploy Skill

This skill manages everything related to deploying and sharing work from a
forked sandbox repo. It covers four workflows:

- **init** — first-time fork setup (GitHub Pages, base URL, config file)
- **sync** — pull latest updates from the upstream main repo
- **list** — show all static exports and their URLs
- **create / rename / delete** — manage static prototype exports

## Architecture reminder

```
instructure/instui-sandbox-base     ← upstream (no GH Pages, never deploys)
         ↓ fork
owner/repo-name
├── main branch                     ← source code
└── gh-pages branch                 ← built artifacts (CI only)
    ├── /                           ← live sandbox ("Drafts")
    └── /static/<id>/               ← frozen prototype snapshots
```

Static exports are full, standalone Vite builds — frozen snapshots at the
time of deployment, not redirects. Each has its own base URL and 404.html.

---

## Before every workflow: check for deploy.json

Read `.claude/deploy.json`.

**File does not exist:**
- If the user asked for `init`, proceed to the Init workflow.
- Otherwise say:
  > This sandbox hasn't been set up for deployment yet. Run `/deploy init`
  > first to connect your fork and configure GitHub Pages.
  Stop here.

**File exists:** Read `repo.owner`, `repo.name`, `repo.pagesUrl`, and
`static[]` from it. Use these throughout.

---

## Workflow: init

**Triggers:** "set up my fork", "configure GitHub Pages", "first-time setup"

### Step 1 — Confirm fork exists

Ask:
> Have you already forked `instructure/instui-sandbox-base` on GitHub?
> If so, what is your GitHub username and what did you name the repo?

Wait for the answer before proceeding.

### Step 2 — Derive and confirm config

| Field | Value |
|---|---|
| `repo.owner` | their GitHub username or org |
| `repo.name` | the repo name they gave |
| `repo.pagesUrl` | `https://<owner>.github.io/<repo-name>` |
| `upstream` | `instructure/instui-sandbox-base` |

Show a summary and ask them to confirm:
> Here's what I'll configure:
> - **Your repo:** `https://github.com/<owner>/<repo>`
> - **Pages URL:** `https://<owner>.github.io/<repo>`
> - **Upstream:** `instructure/instui-sandbox-base`
>
> Does this look right?

### Step 3 — Write deploy.json

Write `.claude/deploy.json`:

```json
{
  "repo": {
    "owner": "<owner>",
    "name": "<repo-name>",
    "pagesUrl": "https://<owner>.github.io/<repo-name>"
  },
  "upstream": "instructure/instui-sandbox-base",
  "static": []
}
```

### Step 4 — Verify vite.config.ts is parameterized

Read `vite.config.ts`. If `base` is still a hardcoded string (not using
`process.env.BASE_URL`), edit it:

```typescript
base: process.env.BASE_URL || '/instui-sandbox-base/',
```

If already parameterized, skip.

### Step 5 — Verify deploy.yml uses gh-pages --add

Read `.github/workflows/deploy.yml`. If it still uses `actions/deploy-pages`
(the old approach), rewrite it to the current version. The correct file is
already in the upstream repo — if the fork was created after the infrastructure
was committed, it will already be correct.

### Step 6 — Enable GitHub Pages on the fork

Tell the user:
> One more step: enable GitHub Pages on your fork.
>
> 1. Go to `https://github.com/<owner>/<repo>/settings/pages`
> 2. Under **Source**, select **Deploy from a branch**
> 3. Set branch to `gh-pages`, folder to `/ (root)`
> 4. Click **Save**
>
> The `gh-pages` branch will be created automatically on your first push.

### Step 7 — Commit and push

List what will be committed, then ask approval:
> Ready to commit:
> - `.claude/deploy.json` — your fork's deploy configuration
> - Any changes to `vite.config.ts` or workflow files (if updated above)
>
> Shall I commit and push? This will trigger your first GitHub Pages deploy.

**Wait for explicit approval.** Then:

```bash
git add .claude/deploy.json vite.config.ts .github/workflows/deploy.yml
git commit -m "chore: configure fork for GitHub Pages deployment"
git push
```

Tell the user:
> Done! Your sandbox will be live at:
> **`https://<owner>.github.io/<repo-name>/`**
>
> Check build progress: `https://github.com/<owner>/<repo-name>/actions`

---

## Workflow: sync

**Triggers:** "sync", "pull updates", "get latest", "update from upstream"

### Step 1 — Ensure upstream remote exists

```bash
git remote -v
```

If `upstream` is not listed:
```bash
git remote add upstream https://github.com/instructure/instui-sandbox-base.git
```

### Step 2 — Fetch and check

```bash
git fetch upstream
git log HEAD..upstream/main --oneline
```

If output is empty:
> Your fork is already up to date — no new changes from upstream.
Stop here.

### Step 3 — Show what's coming

Display the commit list and explain:
> There are [N] new commit(s) from upstream. These are improvements to the
> harness, templates, and reference code. Your own prototypes and static
> exports won't be affected.

### Step 4 — Merge

```bash
git merge upstream/main --no-edit
```

**On conflict:** Stop immediately. List the conflicting files and say:
> There are merge conflicts that need to be resolved manually. This usually
> happens when you and upstream both edited the same file (like `src/registry.ts`
> or `vite.config.ts`).
>
> Keep your own changes and accept upstream's for anything you didn't touch.
> Once resolved, run `git add <files> && git commit` to finish the merge.
Never auto-resolve conflicts.

### Step 5 — Push

> Merge complete. Ready to push — this will redeploy your sandbox with the
> upstream updates. Shall I push?

Wait for approval, then:
```bash
git push
```

---

## Workflow: list

**Triggers:** "list deploys", "show my links", "what have I deployed", "what's exported"

Read `static[]` from deploy.json. If empty:
> No static exports yet. Use `/deploy create` to export a prototype at a
> fixed shareable URL.

If entries exist, show as a table:

| Title | Prototype | URL | Deployed |
|---|---|---|---|
| Agent Patterns | `agent-patterns` | `https://...` | 2026-05-05 |

URL for each entry = `<repo.pagesUrl>/static/<id>/`

---

## Workflow: create

**Triggers:** "deploy [prototype]", "export [prototype]", "share [prototype]",
"create static export"

### Step 1 — Identify the prototype

If the user named a prototype, match it against `src/registry.ts` by `id`
or `title` (case-insensitive). If not named, read the registry and show a
list:
> Which prototype would you like to export?
> [list of id + title]

### Step 2 — Propose a deploy ID

Default: `<prototype-id>-v1`. If that already exists in deploy.json, suggest
`<prototype-id>-v2`, etc.

Confirm with the user:
> I'll create a static export of **[Title]** at:
> `<pagesUrl>/static/<proposed-id>/`
>
> Use a different ID?

### Step 3 — Update deploy.json

Append to `static[]`:

```json
{
  "id": "<id>",
  "prototypeId": "<prototype-id>",
  "prototypePath": "<path from registry>",
  "title": "<title from registry>",
  "deployedAt": "<current ISO timestamp>"
}
```

### Step 4 — Commit deploy.json

> Ready to commit the updated deploy.json and trigger the static build.
> This will kick off a CI job that builds the prototype snapshot and publishes
> it to your GH Pages. Shall I proceed?

Wait for approval, then:

```bash
git add .claude/deploy.json
git commit -m "deploy: add static export for <title> (<id>)"
git push
```

### Step 5 — Trigger the workflow

```bash
gh workflow run deploy-static.yml \
  -f deploy_id=<id> \
  -f prototype_path=<prototypePath>
```

Tell the user:
> Building now. Your export will be live in ~2 minutes at:
> **`<pagesUrl>/static/<id>/`**
>
> Track progress: `https://github.com/<owner>/<repo>/actions`

---

## Workflow: rename

**Triggers:** "rename [deploy]", "change the URL of [deploy]"

### Step 1 — Identify and confirm

Look up the deploy by `id` or `title` in deploy.json. Confirm the rename:
> Renaming will change the URL. Anyone with the old link will get a 404.
>
> Current URL: `<pagesUrl>/static/<old-id>/`
> New URL: `<pagesUrl>/static/<new-id>/`
>
> Proceed?

Wait for explicit confirmation.

### Step 2 — Update deploy.json

Change `id` from `<old-id>` to `<new-id>`.

### Step 3 — Commit and re-deploy

Wait for approval, then commit and push deploy.json, then trigger
`deploy-static.yml` with the new `deploy_id`.

Note to user:
> The old URL (`/static/<old-id>/`) will remain live on the `gh-pages` branch
> — it just won't appear in your deploy list. Let me know if you want to
> clean it up manually.

---

## Workflow: delete

**Triggers:** "delete [deploy]", "remove [deploy]"

### Step 1 — Confirm

> This removes **[Title]** from your deploy list. The URL will no longer be
> managed here, but the files remain on the `gh-pages` branch — so the link
> keeps working until manually removed.
>
> Remove it from the deploy list?

### Step 2 — Update deploy.json

Remove the entry from `static[]`.

### Step 3 — Commit

Wait for approval, then:
```bash
git add .claude/deploy.json
git commit -m "deploy: remove <id> from static exports"
git push
```

---

## Configuration reference

### `.claude/deploy.json` schema

| Field | Type | Description |
|---|---|---|
| `repo.owner` | string | GitHub username or org of the fork owner |
| `repo.name` | string | Repository name |
| `repo.pagesUrl` | string | Base Pages URL, no trailing slash |
| `upstream` | string | `owner/repo` of upstream source |
| `static[].id` | string | Kebab-case export ID; becomes the URL segment |
| `static[].prototypeId` | string | Registry `id` of the prototype |
| `static[].prototypePath` | string | Registry `path` (e.g. `/agent-patterns`) |
| `static[].title` | string | Human-readable title for list display |
| `static[].deployedAt` | string | ISO 8601 timestamp of last build |

This file is in `.gitignore` and is never pushed to the upstream repo.

---

## Anti-patterns

- **Never `git push --force`** under any circumstance.
- **Never auto-resolve merge conflicts.** Stop and explain.
- **Never push or trigger CI without explicit user approval.** Every workflow
  that commits, pushes, or calls `gh workflow run` must confirm first.
- **Never commit `.claude/deploy.json` to the upstream repo.** It is
  gitignored and fork-private.
- **Deleting an export from deploy.json does not remove it from the web.**
  Say so clearly — the `gh-pages` branch files persist. This is intentional.

---
name: sandbox-publish
description: >
  Sets up a GitHub repository and GitHub Pages for your sandbox, publishes
  the live sandbox, and manages static prototype exports with fixed shareable
  URLs. Invoke when the user asks to set up a repo, publish their sandbox,
  deploy a prototype, share a link, list exported prototypes, or
  rename/delete static exports.
---

# Sandbox Publish

This skill covers everything related to publishing work from the sandbox:

- **setup** — create the GitHub repo and configure GitHub Pages (one-time)
- **publish** — push the current main branch to redeploy the live sandbox
- **list** — show all static exports and their URLs
- **create** — build and deploy a frozen static snapshot of a prototype
- **rename / delete** — manage existing static exports

## Architecture

```
instructure/instui-sandbox-base     ← upstream (no GH Pages, never deploys)
         ↓ cloned
owner/repo-name
├── main branch                     ← source code
└── gh-pages branch                 ← built artifacts (CI only)
    ├── /                           ← live sandbox
    └── /static/<id>/               ← frozen prototype snapshots
```

Static exports are full, standalone Vite builds — frozen at the time of
deployment, not redirects. Each has its own base URL and 404.html.

---

## Before every workflow: check for deploy.json

Read `.claude/deploy.json`.

**File does not exist:**
- If the user asked for `setup`, proceed to the Setup workflow.
- Otherwise say:
  > This sandbox hasn't been published yet. Run `/sandbox-publish setup` first
  > to create a GitHub repository and configure GitHub Pages.
  Stop here.

**File exists:** Read `repo.owner`, `repo.name`, `repo.pagesUrl`, and
`static[]` from it. Use these throughout.

---

## Workflow: setup

**Triggers:** "set up my repo", "create a GitHub repo", "set up GitHub Pages",
"publish for the first time"

### Step 1 — Check if a GitHub repo already exists

```bash
git remote get-url origin 2>/dev/null
```

**Returns the upstream URL** (`github.com/instructure/instui-sandbox-base`)
or nothing → this is a local-only clone. Proceed to Step 2.

**Returns a different URL** (not the upstream) → the repo already exists.
Skip to Step 5 (write deploy.json).

> **Already have a repo?** If you or your team already created an Instructure
> repo for this sandbox, tell me its name (e.g. `instui-sandbox-ai-platform`)
> and I'll wire it up instead of creating a new one. Skip straight to Step 5.

### Step 2 — Choose a repo name

> Creating a GitHub repository is an important step — choose your name
> carefully, as it will be the permanent home for your sandbox.
>
> Repos are created **private** by default — only org members can see them.
>
> A good format is `instui-sandbox-<your-name-or-team>`
> (e.g. `instui-sandbox-ai-platform`).
>
> What would you like to name your repository?

Wait for confirmation of the name before proceeding.

### Step 3 — Create the GitHub repo

```bash
gh repo create instructure/<name> --private --source=. --remote=origin --push
```

This creates a private repo in the `instructure` org, sets it as `origin`, and
pushes the current `main` branch. If the user doesn't have permission to
create repos in the `instructure` org, `gh` will error — tell them to contact
#it on Slack.

Then add the upstream remote:

```bash
git remote add upstream https://github.com/instructure/instui-sandbox-base.git
```

### Step 4 — Derive and confirm config

| Field | Value |
|---|---|
| `repo.owner` | `instructure` |
| `repo.name` | the name they chose |
| `repo.pagesUrl` | `https://instructure.github.io/<name>` |
| `upstream` | `instructure/instui-sandbox-base` |

Confirm:
> Here's your sandbox configuration:
> - **Repo:** `https://github.com/instructure/<name>`
> - **Pages URL:** `https://instructure.github.io/<name>`
>
> Does this look right?

### Step 5 — Write deploy.json

Write `.claude/deploy.json`:

```json
{
  "repo": {
    "owner": "instructure",
    "name": "<name>",
    "pagesUrl": "https://instructure.github.io/<name>"
  },
  "upstream": "instructure/instui-sandbox-base",
  "static": []
}
```

### Step 6 — Verify vite.config.ts is parameterized

Read `vite.config.ts`. If `base` is a hardcoded string (not using
`process.env.BASE_URL`), edit it:

```typescript
base: process.env.BASE_URL || '/instui-sandbox-base/',
```

If already parameterized, skip.

### Step 7 — Enable GitHub Pages on the repo

Tell the user:
> One more step: enable GitHub Pages.
>
> 1. Go to `https://github.com/instructure/<name>/settings/pages`
> 2. Under **Source**, select **Deploy from a branch**
> 3. Set branch to `gh-pages`, folder to `/ (root)`
> 4. Click **Save**
>
> The `gh-pages` branch will be created automatically on your first push.

### Step 8 — Commit and push

If `deploy.json` or `vite.config.ts` were changed in Steps 5–6:

> Ready to commit and push these configuration changes. This will trigger
> your first GitHub Pages deploy. Shall I proceed?

Wait for approval, then:

```bash
git add .claude/deploy.json vite.config.ts
git commit -m "chore: configure sandbox for GitHub Pages deployment"
git push
```

Tell the user:
> Done! Your sandbox will be live at:
> **`https://instructure.github.io/<name>/`**
>
> Check build progress: `https://github.com/instructure/<name>/actions`

---

## Workflow: publish

**Triggers:** "publish my sandbox", "push my changes", "redeploy", "update the
live sandbox"

Commit any staged or unstaged changes, then push to trigger a GitHub Pages
rebuild.

### Step 1 — Check for local changes

```bash
git status --short
```

**Output has changes** → ask for a commit message or propose one, then:

```bash
git add <relevant files>
git commit -m "<message>"
```

**Output is empty** → nothing new to commit, just push.

### Step 2 — Push

> Ready to push and redeploy the live sandbox. Shall I proceed?

Wait for approval, then:

```bash
git push
```

Tell the user:
> Deploying now. The live sandbox will be updated in ~2 minutes at:
> **`<pagesUrl>/`**
>
> Track progress: `https://github.com/instructure/<repo>/actions`

---

## Workflow: list

**Triggers:** "list deploys", "show my links", "what have I exported",
"what's live"

Read `static[]` from deploy.json. If empty:
> No static exports yet. Use `/sandbox-publish create` to export a prototype
> at a fixed shareable URL.

If entries exist, show as a table:

| Title | Prototype | URL | Deployed |
|---|---|---|---|
| Agent Patterns | `agent-patterns` | `https://...` | 2026-05-05 |

URL for each entry = `<repo.pagesUrl>/static/<id>/`

---

## Workflow: create

**Triggers:** "export [prototype]", "deploy [prototype]", "share [prototype]",
"create static export"

### Step 1 — Identify the prototype

Match against `src/registry.ts` by `id` or `title` (case-insensitive). If
not named, show the list:
> Which prototype would you like to export?
> [list of id + title]

### Step 2 — Propose a deploy ID

Default: `<prototype-id>-v1`. Increment if that ID already exists.

Confirm:
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

### Step 4 — Commit and trigger

> Ready to commit and kick off the static build. This builds a frozen
> snapshot of **[Title]** and publishes it to GitHub Pages. Shall I proceed?

Wait for approval, then:

```bash
git add .claude/deploy.json
git commit -m "deploy: add static export for <title> (<id>)"
git push
```

Then trigger the build:

```bash
gh workflow run deploy-static.yml \
  -f deploy_id=<id> \
  -f prototype_path=<prototypePath>
```

Tell the user:
> Building now. Your export will be live in ~2 minutes at:
> **`<pagesUrl>/static/<id>/`**
>
> Track progress: `https://github.com/instructure/<repo>/actions`

---

## Workflow: rename

**Triggers:** "rename [export]", "change the URL of [export]"

### Step 1 — Identify and confirm

Look up the export by `id` or `title`. Confirm the rename:
> Renaming changes the URL. Anyone with the old link will get a 404.
>
> Current URL: `<pagesUrl>/static/<old-id>/`
> New URL: `<pagesUrl>/static/<new-id>/`
>
> Proceed?

### Step 2 — Update deploy.json and re-deploy

Change `id` from `<old-id>` to `<new-id>`. Wait for approval, then commit,
push, and trigger `deploy-static.yml` with the new `deploy_id`.

Note to user:
> The old URL (`/static/<old-id>/`) remains live on the `gh-pages` branch
> until manually removed. Let me know if you'd like cleanup instructions.

---

## Workflow: delete

**Triggers:** "delete [export]", "remove [export]"

### Step 1 — Confirm

> This removes **[Title]** from your deploy list. The URL will no longer
> be managed here, but the files stay on the `gh-pages` branch — the link
> keeps working until manually removed.
>
> Remove it from the deploy list?

### Step 2 — Update and commit

Remove the entry from `static[]`. Wait for approval, then:

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
| `repo.owner` | string | GitHub org (`instructure`) or username |
| `repo.name` | string | Repository name |
| `repo.pagesUrl` | string | Base Pages URL, no trailing slash |
| `upstream` | string | `owner/repo` of upstream source |
| `static[].id` | string | Kebab-case export ID; becomes the URL segment |
| `static[].prototypeId` | string | Registry `id` of the prototype |
| `static[].prototypePath` | string | Registry `path` (e.g. `/agent-patterns`) |
| `static[].title` | string | Human-readable title for list display |
| `static[].deployedAt` | string | ISO 8601 timestamp of last build |

This file is gitignored and never pushed to the upstream repo.

---

## Anti-patterns

- **Never `git push --force`.**
- **Never push or trigger CI without explicit user approval.**
- **Never commit `.claude/deploy.json` to the upstream repo.**
- **Always confirm the repo name before running `gh repo create`.** The name
  is hard to change after the fact — get it right first.
- **Deleting an export from deploy.json does not remove it from the web.**
  The `gh-pages` branch files persist. Say so explicitly.

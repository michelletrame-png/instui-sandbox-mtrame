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

**File exists:** Read `repo.owner`, `repo.name`, `repo.hash`, `repo.pagesUrl`, and
`static[]` from it. Use these throughout. The live sandbox URL is `<pagesUrl>/<hash>/`.

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

Use the AskUserQuestion tool to ask:

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

### Step 4 — Generate sandbox hash

```bash
openssl rand -hex 4
```

Save this 8-character hex string as `<hash>`. It will be used to obscure the live sandbox URL and all static export URLs, preventing discovery from a shared prototype link.

### Step 5 — Derive and confirm config

| Field | Value |
|---|---|
| `repo.owner` | `instructure` |
| `repo.name` | the name they chose |
| `repo.hash` | the generated hash |
| `repo.pagesUrl` | `https://instructure.github.io/<name>` |
| Live URL | `https://instructure.github.io/<name>/<hash>/` |
| `upstream` | `instructure/instui-sandbox-base` |

Use the AskUserQuestion tool to ask:

> Here's your sandbox configuration:
> - **Repo:** `https://github.com/instructure/<name>`
> - **Live sandbox:** `https://instructure.github.io/<name>/<hash>/`
>
> Does this look right?

### Step 6 — Write deploy.json and update sandbox.config.ts

Write `.claude/deploy.json`:

```json
{
  "repo": {
    "owner": "instructure",
    "name": "<name>",
    "hash": "<hash>",
    "pagesUrl": "https://instructure.github.io/<name>"
  },
  "upstream": "instructure/instui-sandbox-base",
  "static": []
}
```

Update `src/sandbox.config.ts` to set the hash and repo URL:

```typescript
export const sandboxOwner = '<owner name>'
export const sandboxHash = '<hash>'
```

Also update `.env.local` to use the hashed base path:

```
BASE_URL=/<name>/<hash>/
```

### Step 8 — Verify vite.config.ts is parameterized

Read `vite.config.ts`. If `base` is a hardcoded string (not using
`process.env.BASE_URL`), edit it:

```typescript
base: process.env.BASE_URL || '/instui-sandbox-base/',
```

If already parameterized, skip.

### Step 9 — Enable GitHub Pages on the repo

Tell the user:
> One more step: enable GitHub Pages.
>
> 1. Go to `https://github.com/instructure/<name>/settings/pages`
> 2. Under **GitHub Pages visibility**, select **Public**
> 3. Under **Source**, select **Deploy from a branch**
> 4. Set branch to `gh-pages`, folder to `/ (root)`
> 5. Click **Save**
>
> The `gh-pages` branch will be created automatically on your first push.

### Step 10 — Commit and push

Use the AskUserQuestion tool to ask:

> Ready to commit and push these configuration changes. This will trigger
> your first GitHub Pages deploy. Shall I proceed?

Wait for approval, then:

```bash
git add .claude/deploy.json src/sandbox.config.ts vite.config.ts .env.local
git commit -m "chore: configure sandbox for GitHub Pages deployment"
git push
```

Tell the user:
> Done! Your sandbox will be live at:
> **`https://instructure.github.io/<name>/<hash>/`**
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

**Output has changes** → use the AskUserQuestion tool to ask for a commit message or propose one, then:

```bash
git add <relevant files>
git commit -m "<message>"
```

**Output is empty** → nothing new to commit, just push.

### Step 2 — Push

Use the AskUserQuestion tool to ask:

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
| Learner Overview | `learner-overview` | `https://...` | 2026-05-05 |

URL for each entry = `<repo.pagesUrl>/static/<entry.hash>/<entry.id>/`

---

## Workflow: create

**Triggers:** "export [prototype]", "deploy [prototype]", "share [prototype]",
"create static export"

### Step 1 — Identify the prototype

Match against `src/registry.ts` by `id` or `title` (case-insensitive). If
not named, use the AskUserQuestion tool to ask:

> Which prototype would you like to export?
> [list of id + title]

### Step 2 — Generate a hash for this export

```bash
openssl rand -hex 4
```

Save this 8-character hex string as `<export-hash>`. It is unique to this export and independent of the live sandbox hash.

### Step 3 — Propose a deploy ID

Default: `<prototype-id>-v1`. Increment if that ID already exists.

Use the AskUserQuestion tool to ask:

> I'll create a static export of **[Title]** at:
> `<pagesUrl>/static/<export-hash>/<proposed-id>/`
>
> Use a different ID?

### Step 4 — Update deploy.json

Append to `static[]`:

```json
{
  "id": "<id>",
  "hash": "<export-hash>",
  "prototypeId": "<prototype-id>",
  "prototypePath": "<path from registry>",
  "title": "<title from registry>",
  "deployedAt": "<current ISO timestamp>"
}
```

### Step 5 — Commit and trigger

Update `src/static-exports.json` to reflect the new entry (see "Keeping src/static-exports.json in sync" below).

Use the AskUserQuestion tool to ask:

> Ready to commit and kick off the static build. This builds a frozen
> snapshot of **[Title]** and publishes it to GitHub Pages. Shall I proceed?

Wait for approval, then:

```bash
git add .claude/deploy.json src/static-exports.json
git commit -m "deploy: add static export for <title> (<id>)"
git push
```

Then trigger the build:

```bash
gh workflow run deploy-static.yml \
  --repo <repo.owner>/<repo.name> \
  -f deploy_id=<id> \
  -f prototype_path=<prototypePath> \
  -f sandbox_hash=<export-hash>
```

Tell the user:
> Building now. Your export will be live in ~2 minutes at:
> **`<pagesUrl>/static/<export-hash>/<id>/`**
>
> Track progress: `https://github.com/instructure/<repo>/actions`

---

## Workflow: rename

**Triggers:** "rename [export]", "change the URL of [export]"

### Step 1 — Identify and confirm

Look up the export by `id` or `title`. Use the AskUserQuestion tool to ask:

> Renaming changes the URL. Anyone with the old link will get a 404.
>
> Current URL: `<pagesUrl>/static/<entry.hash>/<old-id>/`
> New URL: `<pagesUrl>/static/<entry.hash>/<new-id>/`
>
> Proceed?

### Step 2 — Update deploy.json and re-deploy

Change `id` from `<old-id>` to `<new-id>`. The `hash` stays the same — only the `id` segment changes. Update `src/static-exports.json` to reflect the rename. Wait for approval, then commit,
push, and trigger `deploy-static.yml` with the new `deploy_id` and existing `sandbox_hash`.

Note to user:
> The old URL (`/static/<entry.hash>/<old-id>/`) remains live on the `gh-pages` branch
> until manually removed. Let me know if you'd like cleanup instructions.

---

## Workflow: delete

**Triggers:** "delete [export]", "remove [export]"

### Step 1 — Confirm

Use the AskUserQuestion tool to ask:

> This will fully remove **[Title]** — the deploy list entry and the files on
> the `gh-pages` branch. The URL will return a 404 once GitHub Pages catches up.
>
> Proceed?

### Step 2 — Remove files from gh-pages and update deploy.json

Wait for approval, then delete the files from the `gh-pages` branch using a worktree:

```bash
git worktree add /tmp/gh-pages-delete gh-pages
rm -rf /tmp/gh-pages-delete/static/<entry.hash>/<id>
git -C /tmp/gh-pages-delete add -A
git -C /tmp/gh-pages-delete commit -m "deploy: remove static export <id>"
git -C /tmp/gh-pages-delete push
git worktree remove /tmp/gh-pages-delete
```

Then remove the entry from `static[]` in deploy.json, update `src/static-exports.json` to match, and commit to main:

```bash
git add .claude/deploy.json src/static-exports.json
git commit -m "deploy: remove <id> from static exports"
git push
```

---

## Keeping src/static-exports.json in sync

`src/static-exports.json` is a tracked source file that the home page reads to
display published links. It must be kept in sync with the `static[]` array in
deploy.json. **After every create, delete, or rename operation**, rewrite
`src/static-exports.json` using the Write tool with the full updated array:

```json
[
  {
    "id": "<id>",
    "title": "<title>",
    "url": "<pagesUrl>/static/<hash>/<id>/",
    "deployedAt": "<deployedAt>"
  }
]
```

Where `<hash>` is the per-export hash stored in `static[].hash` in deploy.json.

Include `src/static-exports.json` in the git add/commit for that operation.

---

## Configuration reference

### `.claude/deploy.json` schema

| Field | Type | Description |
|---|---|---|
| `repo.owner` | string | GitHub org (`instructure`) or username |
| `repo.name` | string | Repository name |
| `repo.hash` | string | 8-char hex — obscures live and static URLs |
| `repo.pagesUrl` | string | Base Pages URL, no trailing slash |
| `upstream` | string | `owner/repo` of upstream source |
| `static[].id` | string | Kebab-case export ID (URL segment after hash) |
| `static[].hash` | string | 8-char hex — unique to this export, independent of `repo.hash` |
| `static[].prototypeId` | string | Registry `id` of the prototype |
| `static[].prototypePath` | string | Registry `path` (e.g. `/learner-overview`) |
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
- **Always delete both:** remove the entry from deploy.json AND delete the files from the `gh-pages` branch. Never just update deploy.json and leave the files live.

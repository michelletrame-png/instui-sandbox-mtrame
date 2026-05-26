---
name: sandbox-init
description: >
  Sets up and onboards a user to the InstUI sandbox. Checks Node.js, installs
  dependencies, starts the dev server, and orients the user to the sandbox
  structure and available skills. Invoke when a user wants to get started for
  the first time, reports an error running the project, asks "how do I run
  this?", or has just cloned the repo and needs to get going.
---

# InstUI Sandbox — Setup & Health Check

Run every step below in order. **Stop at the first failure and resolve it before
continuing.** Use plain language — the user may be non-technical and may not know
what Node, npm, or a terminal are.

---

## Step 1 — Check Node.js is installed

```bash
node --version
```

**Prints a version (e.g. `v20.11.0`)** → continue to Step 2.

**Command not found / error** → Node.js is not installed. Tell the user:

> Node.js isn't installed on your machine. Here's how to fix it:
>
> 1. Open your browser and go to **https://nodejs.org**
> 2. Click the big **"LTS"** download button (that's the stable version)
> 3. Open the downloaded file and follow the installer — accept all the defaults
> 4. Once it finishes, **close this terminal window completely and open a new one**
> 5. Then come back and try again

Stop here until they confirm Node is installed.

---

## Step 2 — Check Node version is 18 or higher

Parse the major version from the output of `node --version`. This project uses
Vite 8, which requires Node 18+.

**v18.x or higher** → continue.

**v17 or lower** → tell the user:

> Your version of Node.js is too old for this project (you have vX, but it needs
> v18 or higher). The easiest fix:
>
> 1. Go to **https://nodejs.org** and download the LTS version
> 2. Run the installer — it will replace your old version
> 3. Close and reopen your terminal, then try again

Stop here until the version is updated.

---

## Step 3 — Check npm is available

```bash
npm --version
```

**Prints a version** → continue.

**Error** → npm is missing despite Node being installed, which is unusual. Advise
reinstalling Node from nodejs.org, which bundles npm.

---

## Step 4 — Check GitHub org access

The sandbox requires access to two GitHub organizations: `instructure` (for the sandbox repo) and `instructure-internal` (for the InstUI plugin that loads automatically in Claude Code).

```bash
gh repo view instructure/instui-sandbox-base --json name 2>&1
gh repo view instructure-internal/aip-instui-plugin --json name 2>&1
```

**Both return JSON** → continue to Step 5.

**Either returns an error** → tell the user:

> You're missing GitHub org access needed for the InstUI sandbox. Post in **#it** on Slack:
>
> **Request:** GitHub Org Access
> **Action needed:** Please add me to both the `instructure` and `instructure-internal` GitHub orgs
> **Reason:** Access to InstUI Prototyping Tool

Stop here. Return when IT confirms access.

---

## Step 5 — Fix remote setup

Check what `origin` points to:

```bash
git remote get-url origin 2>/dev/null || echo ""
```

**If it prints `https://github.com/instructure/instui-sandbox-base.git`** → rename it to `upstream` so there's no risk of accidentally pushing to the shared base repo:

```bash
git remote rename origin upstream
```

Tell the user: *"Renamed `origin` → `upstream` so you can't accidentally push to the base repo. When you're ready to publish, `/sandbox-publish` will set up your own repo as `origin`."*

**If it prints anything else (a personal or team repo URL)** → `origin` is already the user's own repo. Leave it as-is and continue.

**If it prints nothing** → no `origin` configured (expected after a fresh clone with `/get-instui-sandbox`). Continue.

---

## Step 6 — Verify BASE_URL is configured

Run:

```bash
git remote get-url upstream 2>/dev/null || git remote get-url origin 2>/dev/null || echo ""
```

Extract the repo name — the last path segment, with `.git` stripped. If there is no remote, use `basename $(pwd)`.

Then check:

```bash
grep "^BASE_URL=" .env.local 2>/dev/null
```

**If the repo name is `instui-sandbox-base`** → skip to Step 7. The `vite.config.ts` fallback already covers it.

**If the repo name is anything else AND `.env.local` already contains `BASE_URL=/<repo-name>/`** → skip to Step 7.

**Otherwise** → create or update `.env.local`:

```bash
echo "BASE_URL=/<repo-name>/" >> .env.local
```

If the file already exists with a different `BASE_URL` line, replace that line rather than appending.

---

## Step 7 — Check dependencies are installed

```bash
ls node_modules 2>/dev/null | wc -l
```

**Output is greater than 0** → skip to Step 8.

**Output is 0 or the directory doesn't exist** → dependencies need to be installed.
Tell the user: *"Installing project dependencies — this takes a minute or two the
first time, but you only need to do it once."*

Then run:

```bash
npm install
```

**Succeeds** → continue.

**Fails** → show the error output and diagnose the most likely cause:

| Symptom in output | What to tell the user |
|---|---|
| `ENOTFOUND` / network error | "Check your internet connection and try again." |
| `EACCES` / permission denied | "Try running the command with `sudo npm install` — it will ask for your Mac password." |
| `npm warn ERESOLVE` | Usually harmless; the important line is further down. Look for `npm error` lines and share them. |
| Anything else | Share the full output so we can diagnose together. |

---

## Step 8 — Start the dev server

Run in the background:

```bash
npm run dev
```

Wait 2–3 seconds for Vite to start, then look for the local URL in the output.
The default is **http://localhost:5173**. If that port is busy, Vite automatically
picks the next free port (5174, 5175, …) — use whatever URL it printed.

Tell the user:

> Everything is set up! The dev server is running.
>
> Open your browser and go to: **http://localhost:5173**
> (or the URL that appeared in the terminal above)

**If the server crashes immediately**, run `npm run build` to get clean error
output. Common causes:

| Error type | Likely cause |
|---|---|
| TypeScript type error | A recent code change broke the types — share the error |
| `Cannot find module` | A file was deleted or renamed — share the error |
| `Port XXXX is already in use` | Another instance is running — close other terminal windows running this project, or just use the alternate port Vite offers |

---

## Step 9 — Hand off to the user

Once the server is confirmed running, tell the user:

> You're all set. Type **/sandbox-design** to start building.
>
> If the dev server ever isn't running, just ask and I'll take care of it.

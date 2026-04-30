---
name: sandbox-init
description: >
  Checks that this InstUI sandbox project is set up correctly and ready to run.
  Diagnoses Node.js installation, dependency installation, and dev server health.
  Invoke when a user wants to get started for the first time, reports an error
  running the project, or asks "how do I run this?".
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

## Step 4 — Check dependencies are installed

```bash
ls node_modules 2>/dev/null | wc -l
```

**Output is greater than 0** → skip to Step 5.

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

## Step 5 — Start the dev server

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
>
> You should see a theme switcher in the top-right corner and the learning
> dashboard below it. If the page is blank or shows an error, let me know
> and I'll help you fix it.

**If the server crashes immediately**, run `npm run build` to get clean error
output. Common causes:

| Error type | Likely cause |
|---|---|
| TypeScript type error | A recent code change broke the types — share the error |
| `Cannot find module` | A file was deleted or renamed — share the error |
| `Port XXXX is already in use` | Another instance is running — close other terminal windows running this project, or just use the alternate port Vite offers |

---

## Step 6 — Confirm and orient the user

Once the server is confirmed running, tell the user:

> A few things to know while you're working:
>
> - **Keep this terminal open** — closing it stops the server
> - **To stop the server**: press `Ctrl + C` in the terminal
> - **To restart it**: run `npm run dev` again
> - **Changes are live**: when you save a file the browser updates automatically —
>   no need to refresh

---

## Quick re-check (for returning users)

If the user has run this project before and just needs to restart, jump straight
to Step 4 (check node_modules) and Step 5 (start dev server). Skip the Node
installation steps unless they report an error.

---
name: get-instui-sandbox
description: >
  Guides a user through getting their own copy of the InstUI sandbox for the
  first time. Walks through cloning locally, getting the dev server running,
  and optionally creating a permanent GitHub repository in the Instructure org.
  Invoke when a user says they want to get started with the sandbox, set up
  the prototyping tool, or asks how to get the repo. Use proactively when the
  user is starting from scratch and doesn't yet have a local copy.
---

# Get the InstUI Sandbox

This skill walks you through getting your own copy of the InstUI sandbox.
The default path is **local first** — you can start prototyping immediately
without creating a GitHub repo. Publishing to GitHub is a separate, optional
step when you're ready to share your work.

---

## Step 1 — Check Node.js is installed

```bash
node --version
```

**Prints a version (e.g. `v20.x.x`)** → continue to Step 2.

**Not found** → tell the user to install Node.js LTS from **https://nodejs.org**,
then close and reopen their terminal and try again.

---

## Step 2 — Install the GitHub CLI

```bash
gh --version
```

**Prints a version** → continue to Step 3.

**Not found** → check the OS:

```bash
uname -s
```

**macOS (`Darwin`):**
```bash
brew install gh
```
If Homebrew is missing first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Then `brew install gh`.

**Linux:**
```bash
brew install gh
```
If Homebrew isn't available, use the package manager for their distro.
For Ubuntu/Debian: `sudo apt install gh`. For Fedora: `sudo dnf install gh`.
If unsure, send them to `https://cli.github.com/manual/installation`.

**Windows:** Direct the user to download and run the installer:
`https://cli.github.com/manual/installation`
Tell them to select the `.msi` file for their system, run it, then **close
and reopen their terminal** before continuing.

---

## Step 3 — Sign in to GitHub

```bash
gh auth status
```

**Shows your username and "Logged in"** → continue to Step 4.

**Not logged in**:
```bash
gh auth login
```

Walk the user through the prompts: **GitHub.com → HTTPS → Login with a web
browser**. Follow the browser steps. Continue once signed in.

---

## Step 4 — Check repo access

The sandbox requires access to two GitHub organizations: `instructure` (for the sandbox repo) and `instructure-internal` (for the InstUI plugin).

```bash
gh repo view instructure/instui-sandbox-base --json name
gh repo view instructure-internal/aip-instui-plugin --json name
```

**Both return JSON** → you have access. Continue to Step 5.

**Either returns an error** → the user is missing GitHub org access.
Tell them to post in the **#it** Slack channel:

> **Request:** GitHub Org Access
> **Action needed:** Please add me to both the `instructure` and `instructure-internal` GitHub orgs
> **Reason:** Access to InstUI Prototyping Tool

Stop here. Return when IT confirms access.

---

## Step 5 — Choose a name

Use the AskUserQuestion tool to ask:

> What type of sandbox is this?

With these options:
- **Personal** — just for me
- **Team** — shared with my team

Once they select, use the AskUserQuestion tool to ask:

>  "What's your name or GitHub username?" OR "What's your team name?"

Take their answer and use the AskUserQuestion tool to ask:

> Here's your sandbox name: **`instui-sandbox-<nameorteam>`**
> Is that right, or would you like to change it?

Confirm before continuing.

---

## Step 6 — Clone locally

```bash
git clone https://github.com/instructure/instui-sandbox-base.git <name>
```

Then immediately rename the remote so there's no risk of accidentally pushing to the base repo:

```bash
git -C <name> remote rename origin upstream
```

This gives you the right remote setup:
- **`upstream`** → the base repo, used by `/sandbox-update` to pull updates
- **No `origin`** until you run `/sandbox-publish`, which creates your own GitHub repo and sets it as `origin`

Tell the user:
> Done! Your sandbox folder **`<name>`** is ready on your computer.
> You can start prototyping locally right now — no GitHub setup needed yet.

---

## Step 7 — Set the base path

**This step is required — do not skip it.** Create `.env.local` inside the cloned folder using the Write tool (not bash), writing exactly this content:

```
BASE_URL=/<name>/
```

Save it to `<name>/.env.local`.

Then verify it was created:

```bash
cat <name>/.env.local
```

This tells Vite to serve the sandbox under `/<name>/` — required for GitHub Pages
and for the dev server to generate correct asset URLs. Without this file, the dev server will use the wrong base path.

---

## Step 8 — Configure the sandbox

Open `src/sandbox.config.ts` in the cloned folder and replace `[name]` with the
name the user chose in Step 5:

```typescript
export const sandboxOwner = '<name>'
```

For a personal sandbox (`instui-sandbox-jsmith`) use their name: `'Jane Smith'`.
For a team sandbox (`instui-sandbox-team-name`) use the team name: `'Team Name'`.

This name appears on the home page under the InstUI logo as "Designs by **[name]**".

---

## Step 9 — Open in Claude Code

The sandbox needs to be opened as its own project in a new Claude Code session in the newly created `<name>` folder. 

**Don't give the users instructions on how to do this because Claude Code's UI changes often.**


---

## Step 10 — Run `/sandbox-init`

Once inside the new Claude Code session:

```
/sandbox-init
```

This installs dependencies, starts the dev server, and orients you to how
the sandbox works. You'll be prototyping in minutes.

# InstUI Prototypes

A sandbox for rapidly prototyping Canvas LMS UI concepts using [Instructure UI (InstUI) v11](https://instructure.design/). Designed to be used with an AI coding agent (Claude Code) that is guided by built-in conventions to produce idiomatic InstUI code.

**Live:** [instructure.github.io/instui-sandbox-base](https://instructure.github.io/instui-sandbox-base/)

## How it works

Prototypes live in `src/prototypes/` and are registered in `src/registry.ts`. Each one is a self-contained React component that gets its own route and appears in the home page index. Add a new directory, register it, and it's live.

The environment provides three layers of guidance for the agent:

- **Skills** (`.claude/skills/`) — authoritative docs on InstUI theming, layout, icons, and setup that the agent reads automatically
- **Reference code** (`src/references/`) — fully-built example pages demonstrating correct patterns at scale
- **ESLint rules** (`eslint-rules/`) — local plugin that catches common InstUI mistakes (hardcoded colors, missing `themeOverride`, theme name detection) at write time

See [AGENTS.md](AGENTS.md) for the full environment guide.

## Stack

- React + TypeScript + Vite
- [Instructure UI v11](https://instructure.design/)
- Claude Code

## Getting started

```bash
npm install
npm run dev
```

Deploys to GitHub Pages automatically on push to `main`.

# InstUI Vibe Coding Sandbox (POC)

> **Experimental.** This is a proof of concept and is not yet intended to scale.

A sandbox for exploring "vibe coding" workflows with [Instructure UI (InstUI)](https://instructure.design/). The goal is to make it fast and low-friction for AI coding agents to build UI correctly using InstUI conventions.

## What this is

This project experiments with three levers for steering AI-assisted development with InstUI:

- **Claude skills** — reusable skill files (in `.claude/skills/`) that give the agent authoritative guidance on InstUI setup, theming, layout, and component usage
- **Clean template code** — a minimal, well-structured React + Vite baseline that agents can reference and extend without fighting legacy patterns
- **Hooks** — Claude Code hooks that steer agent behavior at key moments (e.g. before edits, after tool calls) to enforce InstUI conventions automatically

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Instructure UI v11](https://instructure.design/)

## Getting started

```bash
npm install
npm run dev
```

## Status

This is an early-stage experiment. Patterns here are being evaluated before any broader adoption.

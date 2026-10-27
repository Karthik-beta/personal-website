# 0003: Bun as package manager

- Status: Accepted
- Date: 2026-10-27

## Context

The project was first scaffolded with npm. Karthik asked to use Bun instead for speed.

## Options

1. **Bun**: much faster installs and script runs. Vercel detects `bun.lock` and installs with Bun
   automatically. Contributors need Bun installed.
2. **npm**: ships with Node, zero friction, slower.

## Decision

Bun (1.4+) is the package manager and script runner. The lockfile is `bun.lock`. Next.js itself
still runs on Node (22+, see `.nvmrc`): we use `bun run <script>`, not `bun --bun`.

## Why

It gives faster feedback during development at no runtime risk, because production still runs on
Node via Vercel. Bun blocks dependency install scripts by default. The only one blocked at the time
of writing (`unrs-resolver`) is a fallback that isn't needed.

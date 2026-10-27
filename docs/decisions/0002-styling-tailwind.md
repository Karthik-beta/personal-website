# 0002: Styling with Tailwind CSS v4

- Status: Accepted
- Date: 2026-10-27

## Context

We need a styling approach that turns the Phase 3 design system (colours, type, spacing, motion)
into code and keeps every page consistent with it.

## Options

1. **Tailwind CSS v4**: small utility classes in the markup. Design tokens live in one CSS file
   (`@theme`). Fast to build and hard to drift off-system. Markup is busier.
2. **CSS Modules + CSS variables**: hand-written CSS files per component. Cleaner markup and no
   dependency, but more CSS to maintain, and consistency depends on discipline.

## Decision

Tailwind CSS v4. Tokens are defined in `src/app/globals.css`. Prettier sorts class names
automatically with `prettier-plugin-tailwindcss`.

## Why

The design docs map one-to-one onto Tailwind tokens, so the styleguide and the site can't disagree.
Recruiters see no difference either way. Engineers reviewing the repo will recognise Tailwind as a
mainstream, sensible choice.

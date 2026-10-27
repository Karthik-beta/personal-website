# 0004: Base UI for UI primitives

- Status: Accepted
- Date: 2026-10-27

## Context

Karthik asked to use Base UI as the building blocks for UI components. Two different libraries go
by that name, so we clarified which one.

## Options

1. **Base UI** (`@base-ui/react`, from the teams behind Radix and Material UI): headless. It handles
   behaviour and accessibility (keyboard, focus, ARIA) but has no styling. We style it with
   Tailwind.
2. **Base Web** (`baseui`, by Uber): fully styled in Uber's design language, built on Styletron
   CSS-in-JS. Conflicts with Tailwind and awkward with React Server Components.

## Decision

Base UI (`@base-ui/react`) for interactive primitives such as dialog, menu, tabs, tooltip, popover
and collapsible. Simple elements (links, buttons, cards, tags) are plain semantic HTML styled with
Tailwind. **Install it in Phase 3** when the styleguide components are built, not before.

## Why

Accessible interactive components are hard to get right by hand, and accessibility matters to
hiring managers. A headless library gives us that correctness while the look stays fully our own,
which keeps the site from reading like a template.

# 0010: Site structure and navigation

- Status: Accepted
- Date: 2026-10-27

## Context

The site has a skim layer, a story, and several project case studies. Recruiters need a way to
reach the resume from anywhere and to share specific pages.

## Options

Structure:

1. **Home + a page per case study:** shareable links per project; better for search.
2. **One single page:** simplest, but long, and no direct links to a case study.

Navigation:

1. **Slim bar that hides on scroll down and returns on scroll up,** with a Resume button.
2. **Static bar:** scrolls away; the Resume button disappears after the first screen.
3. **Always-visible bar:** constant access, but costs reading space, especially on phones.

## Decision

- **Home page** (hero, proof, chapters, work, about, contact) plus **case-study pages** at
  `/work/aria`, `/work/job-matcher` and `/work/workclock`. Shorter projects appear only on the
  home page.
- **Slim nav, hide on scroll down / show on scroll up,** with Work, About, Contact, a theme toggle
  and a **Resume** button. On phones, section links move into a Base UI `Dialog` menu.

## Why

Direct case-study links help in applications and emails. A nav that returns on scroll-up keeps
the most important action (the resume) one gesture away without blocking reading. Details:
[06-navigation-and-sections.md](../design/06-navigation-and-sections.md).

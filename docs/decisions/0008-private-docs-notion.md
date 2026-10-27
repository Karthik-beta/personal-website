# 0008: Private docs mirrored to Notion

- Status: Accepted
- Date: 2026-10-27

## Context

ADR 0007 keeps `docs/research/` and `docs/content/` out of git, which leaves them with no backup
and readable only on one machine. Karthik asked for all personal and research material to be
saved in Notion, as a separate project.

## Options

These were not compared: Karthik asked for Notion directly and had already connected it.

## Decision

- A private Notion page, **"karthik.nz: Personal website (private)"**, holds three sections:
  **Research**, **Content** and **Personal** (resume, links, preferences, interview answers).
- The local Markdown files stay the working copy. Every time a private doc is created or changed,
  its Notion page is updated in the same session.
- Personal inputs from Karthik (resume, LinkedIn export, answers) are summarised under
  **Personal**.
- Notion page links are not written into this public repo. Find the project in Notion by its
  title.

## Why

Notion gives the private material a backup and a comfortable place to read it on any device,
while nothing becomes public.

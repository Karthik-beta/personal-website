# 0007: Private docs stay local only

- Status: Accepted
- Date: 2026-10-27

## Context

ADR 0006 keeps `docs/research/` and `docs/content/` off the wiki. But the repo itself is public, and
Vercel deploys from GitHub, so anything committed there becomes public once pushed. These folders
hold private working notes: a gap analysis of Karthik's work history, and draft wording about
leaving the startup.

## Options

1. **Gitignore them, local only**: never published. They live only on Karthik's machine, with no
   GitHub backup.
2. **Commit them publicly**: backed up and versioned, but readable by anyone, recruiters included.
3. **Make the repo private**: hides everything, but loses the public-code signal for engineers.
   On GitHub Free, wikis are only available for public repos.

## Decision

Option 1. Everything in `docs/research/` and `docs/content/` is gitignored, except a README in each
explaining why. Only the finished, polished wording reaches the public, as the site's content in
`src/`.

## Why

Drafts and gap analyses are useful to work from, but they shouldn't be public. A recruiter finding
them would see unpolished thinking instead of the final story. The cost is that these files need
their own backup.

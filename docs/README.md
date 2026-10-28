# Documentation

Everything about how karthik.nz is planned, designed and built. This folder is the source of
truth. `design/` and `decisions/` are also mirrored to the
[GitHub wiki](https://github.com/Karthik-beta/personal-website/wiki).

## Decisions (ADRs)

One short file per approved decision. See [decisions/README.md](decisions/README.md).

- [0001: Framework and hosting](decisions/0001-framework-and-hosting.md)
- [0002: Styling with Tailwind CSS](decisions/0002-styling-tailwind.md)
- [0003: Bun as package manager](decisions/0003-package-manager-bun.md)
- [0004: Base UI for UI primitives](decisions/0004-ui-primitives-base-ui.md)
- [0005: License](decisions/0005-license.md)
- [0006: Docs mirrored to the GitHub wiki](decisions/0006-docs-wiki-mirror.md)
- [0007: Private docs stay local only](decisions/0007-private-docs-local-only.md)
- [0008: Private docs mirrored to Notion](decisions/0008-private-docs-notion.md)
- [0009: Visual direction "Working hours"](decisions/0009-visual-direction-working-hours.md)
- [0010: Site structure and navigation](decisions/0010-site-structure-and-navigation.md)
- [0011: Icons, monogram and analytics](decisions/0011-icons-identity-analytics.md)
- [0012: Brand assets generated in code](decisions/0012-assets-generated-in-code.md)
- [0013: Search visibility and security headers](decisions/0013-search-and-security-headers.md)

## Research (local only, gitignored)

- `research/profile-summary.md`: skills, timeline, top projects, gaps (Phase 1)

## Content (local only, gitignored)

- `content/story.md`: narrative outline, section by section (Phase 2)
- `content/messaging.md`: headlines, pitch, tone, words to use and avoid (Phase 2)

## Design system (Phase 3)

Read in order; each builds on the previous ones.

1. [Principles](design/01-principles.md): what guides every decision
2. [Typography](design/02-typography.md): Instrument Sans, type scale, loading
3. [Colour](design/03-color.md): tokens, light/dark, measured contrast for every pair
4. [Theme](design/04-theme.md): the "Working hours" direction and what we avoid
5. [Layout, grid and spacing](design/05-layout-grid-spacing.md): time margin, spacing scale, breakpoints
6. [Navigation and sections](design/06-navigation-and-sections.md): site map, nav, page structure
7. [Components](design/07-components.md): every component and its states
8. [Imagery and identity](design/08-imagery-and-identity.md): photo, icons, monogram, favicon, OG image
9. [Motion and interactions](design/09-motion-and-interactions.md): durations, easing, reduced motion
10. [Accessibility](design/10-accessibility.md): WCAG 2.2 AA rules
11. [Performance and SEO](design/11-performance-and-seo.md): targets, metadata, JSON-LD, security headers, analytics
12. [Polish checklist](design/12-polish-checklist.md): before launch

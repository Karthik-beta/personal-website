# 07: Components

- Status: Approved (2026-10-27)
- Primitives: [Base UI](https://base-ui.com) (`@base-ui/react`) for interactive pieces that need
  focus management (ADR 0004). Everything else is plain semantic HTML styled with Tailwind.

Every component lists its states. All states use tokens from [03](03-color.md). **Focus** is the
same everywhere: a 2 px `accent` outline with a 3 px offset, shown only for keyboard focus
(`:focus-visible`).

## Button

Only two kinds. The site has very few actions, so there's no need for more.

| Variant     | Look                                                            | Use                                      |
| ----------- | --------------------------------------------------------------- | ---------------------------------------- |
| **Primary** | `accent` fill, `on-accent` text, 8 px radius                    | Download resume (one per screen at most) |
| **Quiet**   | Transparent, `ink` text, 1 px `rule-strong` border, 8 px radius | Theme toggle, Menu, Copy email           |

| State          | Primary                                    | Quiet                            |
| -------------- | ------------------------------------------ | -------------------------------- |
| Default        | `accent` / `on-accent`                     | border `rule-strong`, text `ink` |
| Hover          | `accent-hover` background                  | background `band`                |
| Active (press) | `accent-hover`, 1 px down                  | background `band`, 1 px down     |
| Focus-visible  | focus ring                                 | focus ring                       |
| Disabled       | not used (no disabled actions on the site) | not used                         |

Size: min height 44 px, horizontal padding 18 px, `text-sm` weight 600. Icon (if any) is 18 px,
4 px before the label.

## Text link

| Kind        | Look                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Inline      | `accent`, underlined 1 px, offset 0.2 em                                                                 |
| Action link | `accent`, weight 600, underlined, optional leading icon (Email me, GitHub)                               |
| External    | Same as inline/action, plus a small "opens in a new tab" icon and visually hidden text; `rel="noopener"` |

States: hover → `accent-hover` and 2 px underline · focus-visible → focus ring · active → no change ·
visited → same as default (deliberately: a recruiter revisiting shouldn't see a different page).

## Navigation bar

See [06](06-navigation-and-sections.md). States: at top (no rule line) · scrolled (rule line) ·
hidden (translated up, only while scrolling down and nothing inside has focus) · shown.

## Mobile menu (Base UI `Dialog`)

A full-width panel on `surface`, under the nav. Links at `text-xl` with 56 px rows. Focus moves
into the panel on open and returns to the Menu button on close. Escape and outside-tap close it.
Background scroll is locked while it's open.

## Theme toggle

A quiet icon button (sun/moon icon, 18 px). `aria-label="Switch to dark theme"` (or light).
Stores the choice in `localStorage`. States as Quiet button.

## Facts row

A `<dl>` of label/value pairs. Each pair has a 1 px `rule` top border and 8 px top padding.
Label: `text-xs` `muted`. Value: `text-sm` weight 500 `ink`. 1 column → 2 (`sm`) → 4 (`lg`). No
hover state (not interactive).

## Local time

`<p>` on a `band` background, 6 × 10 px padding, 6 px radius, `text-xs`/`text-sm` with tabular
numbers. Contains a `<time datetime="…">`. Not announced by screen readers on update (no live
region), because constant announcements would be noise.

## Time margin row (chapter)

A two-column grid row: the margin holds the date range (`text-xs`, `muted`, tabular numbers),
sticky at `top: 72px` on `md`+ while its chapter is on screen. The column holds the chapter title
(`text-xl`) and paragraphs. A 1 px `rule` above each row.

## Proof strip

Three short statements in a row (stacked on phones), each a `text-lg` sentence with the number in
weight 600. No icons, no big-number tiles: they read as sentences.

## Project entry (home page "Work" list)

**Not cards.** Each entry is a list row, separated by `rule` lines:

```text
Aria (Pivotr)                                   2025 – 2026
Core asset and inventory modules for a modular B2B ERP, deployed to 12 customers.
TypeScript, NestJS, Next.js, PostgreSQL
Read the case study      Code on GitHub
```

- Title `text-xl`, summary `text-base`, stack `text-xs` `muted` as plain comma-separated text
  (no pill badges).
- The title links to the case study. The whole row isn't one giant link, so each link reads
  clearly to screen readers.
- Hover on the title link: underline thickens. No lift, no shadow.

## Case-study meta

A `<dl>` like the facts row: Role, When, Stack, Links.

## Figure

`<figure>` with the image on `surface`, 1 px `rule` border, 8 px radius, and a `text-xs` `muted`
caption below. Images use `next/image` with explicit width/height.

## Copy email

A quiet button next to the email address: "Copy email". On click it copies the address and
changes to "Copied" with a check icon for 2 s. The change is announced via a polite live region.
If the clipboard is blocked, the address is selected instead. The address itself is always shown
as selectable text with a `mailto:` link.

## Quote

For Karthik's own words only. 2 px `accent` left border, 16 px padding, `text-lg`, `ink`.

## Skip link

"Skip to content", hidden until focused, then shown at top-left as a primary button.

## Footer

`text-xs` `muted`: name, © year, GitHub / LinkedIn / X / Email links, "Source on GitHub" link.
Top border `rule`.

## Not included, on purpose

Cards with shadows, tags/pills, carousels, accordions for main content, tooltips (Base UI
`Tooltip` may be used only for icon-only buttons, and those already have visible labels on
desktop), toasts, modals other than the phone menu.

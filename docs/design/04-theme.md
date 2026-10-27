# 04: Theme and visual direction

- Status: Approved (2026-10-27)
- Decision record: [ADR 0009](../decisions/0009-visual-direction-working-hours.md)

## Direction: "Working hours"

The site reads like **a well-kept schedule**: precise, quiet, organised by time. It doesn't look
like a calendar app. It borrows the habits of one:

- **A time margin.** Dates sit in a left column, aligned like times on a timesheet. On wide
  screens, a chapter's date stays pinned in the margin while you read that chapter.
- **One live detail.** The hero shows the current time and day in Bengaluru, on a soft ultramarine
  band. It tells remote recruiters the time zone at a glance, and it echoes Karthik's workclock
  library.
- **Ink on paper.** Mostly typography and space. No decorative imagery.

Three directions were compared before choosing this one. "Long read" was serif and essay-like but
had a weaker skim layer. "Ledger" was the fastest skim but too close to a resume. "Working
hours" balances the 10-second skim and the story.

## Mood words

Calm · precise · trustworthy · unhurried · specific.

The site should feel like the work of someone who checks the details: the dates line up, the
numbers align, nothing is there by accident.

## The one bold element

The **hero headline**: _"I build backend-heavy products and see them through to production."_
It's set large (up to 72 px) in Instrument Sans narrowed to 78% width, breaking into a tall block
of 3–4 lines. Everything else on the page is deliberately quieter.

## What we're deliberately not doing

- **Not a generic dev portfolio:** no dark sidebar layout, no "Hi, I'm Karthik 👋", no grid of
  project cards with tech-logo badges.
- **Not a SaaS landing page:** no feature cards, gradient washes, testimonial carousels or
  big-number tiles.
- **Not "AI-generated chic":** no cream paper with a serif and terracotta, no all-caps eyebrow
  labels, no "→" after every link, no monospace data labels.
- **Not animated:** nothing flies in on scroll. Motion only responds to what the visitor does (see
  [09](09-motion-and-interactions.md)).
- **No shapes for decoration:** lines and boxes appear only where they separate or group real
  content.

## How to check new work against the theme

Before adding anything, ask:

1. Does it help the 10-second skim or the story? If neither, cut it.
2. Could this element appear on any other developer's site unchanged? If yes, make it specific
   or cut it.
3. Does it use only tokens from [03](03-color.md) and the type scale from [02](02-typography.md)?
4. Is the bold thing still the headline?

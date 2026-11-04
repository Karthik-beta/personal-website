# 0026: Quoting a recommendation in the story

- Status: Accepted (2026-11-04)
- Date: 2026-11-04

## Context

Prashanth Matsya, who handled sales at Pivotr, wrote Karthik a LinkedIn recommendation (dated
28 October 2026). The site had nothing in anyone else's words. Design 04 rules out testimonial
carousels, and the Quote component (design 07) is reserved for Karthik's own words.

## Options

1. **Where:** the Pivotr chapter, beside the story it backs up (chosen); also on `/resume`; or
   above Contact.
2. **How much:** the whole recommendation (63 words), or the two sentences that carry the
   evidence (chosen).
3. **Credit:** name, title and a link to the recommendation on LinkedIn (chosen); name and title
   only; or also a link to Prashanth's profile.

## Decision

- Two sentences, word for word, in the "Building a company" chapter, after the paragraph about
  deployments, proofs of concept and the outreach tools:
  - "The asset management product I was selling was built by Karthik, and so were the outreach
    tools I used to sell it."
  - "We went into customer meetings together, and more than once what we heard there turned
    into a working demo for that prospect."
- Credit: "Prashanth Matsya, Director of sales, Pivotr." (his title as LinkedIn shows it) and
  "Read it on LinkedIn", linking to Karthik's recommendations page.
- **A separate look from Karthik's own quotes:** a `rule-strong` left rule instead of the accent,
  body size instead of `text-lg`, quotation marks, and the credit under it. A reader never
  mistakes it for Karthik's voice.
- Data: a `recommendation` block in `src/content/home.ts`, rendered by
  `src/components/site/recommendation.tsx`. `/index.md`, `llms-full.txt` and the MCP server get
  the same words from the same data.
- Prashanth agreed to being quoted (Karthik confirmed, 2026-11-04).
- No `Review` structured data: Google doesn't show review markup that a site adds about its own
  subject.

## Why

- One sentence from a business person about what was built and sold is stronger evidence than
  any line Karthik could write about the same work. It sits where a reader is already judging
  that work.
- The two sentences are the facts. The rest of the recommendation (how they met, "work with
  Karthik again") is warm but adds no evidence.
- The link lets a recruiter check that the words are real and unedited.

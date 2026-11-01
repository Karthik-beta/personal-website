# 0020: Contributions that keep growing

- Status: Accepted (2026-11-01). Revises [0018](0018-contributions-ledger-and-activity.md): how
  many pull requests and projects the ledger shows at once.
- Date: 2026-11-01
- Design: [13-open-source](../design/13-open-source.md)

## Context

Karthik keeps contributing to the same projects and will add new ones. The first ledger had two
limits that would show up later:

- One GitHub search fetched at most 100 pull requests across all projects, closed-unmerged ones
  included, and with no sort order. Past 100, GitHub's order decided which ones went missing.
- Every pull request was a row and every project a block, so the section grew without end.

## Options

Pull requests per project before a toggle: 3, 5 or 10. Project order: newest activity, most
merged, or most stars. Projects before a toggle: 4, 6, or all. A one-line total above the list,
or none.

## Decision

- **Fetch everything that's shown, and nothing else:** two searches, one for merged and one for
  open pull requests (drafts included), each read 100 at a time until none are left. Pull
  requests closed without merging are never fetched. GitHub stops a search at 1,000 results.
- **Five pull requests per project**, newest first. The rest wait behind "Show 7 older pull
  requests", which reads "Hide 7 older pull requests" when open.
- **Six projects**, the project with the newest pull request first. The rest wait behind "Show 3
  more projects".
- **A total line** under the section's description, worked out from the data: "6 pull requests
  to 3 projects: 1 merged, 5 in review."
- **The tally of squares wraps** onto more lines instead of running off the edge.
- The toggles are native `<details>` elements, not Base UI's Collapsible (ADR 0004): the page
  ships no client-side JavaScript, the resume's evidence notes already use `<details>`, and the
  hidden rows stay in the HTML for search engines and find-in-page.

## Why

- A recruiter gets the whole record from the total line in two seconds; the newest work stays
  on screen, and the full history is one click away.
- Ordering by newest activity shows Karthik contributing now. Ordering by stars would put the
  famous names first but could push this week's work down the page.
- Fetching by status instead of filtering afterwards means a closed pull request can never push
  a merged one out of the results.

"""
Prepares the public resume: removes phone numbers (true redaction: the text is deleted,
not covered) and personal metadata, then writes public/resume.pdf.

    python -I scripts/prepare-resume.py "path/to/Resume.pdf" [--json "path/to/resume.json"]

--json also installs the /resume page's data as src/content/resume.json. Make both files in
one run of the Job Hunt app, so the page and the PDF say the same thing:
`uv run jobhunt master --web <pdf> --json <json>`. The JSON gets the same phone check.

Prefer a resume rendered without the phone (`uv run jobhunt master --web <pdf>` in the
Job Hunt app): redaction leaves a gap where the number was, so the header line sits off
centre. The script still verifies that no phone number is left.

Requires PyMuPDF. Re-run whenever the resume changes.
"""

import argparse
import json
import re
from pathlib import Path

import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public/resume.pdf"
PAGE_DATA = ROOT / "src/content/resume.json"
# The shape src/content/resume.ts reads. jobhunt bumps it when the shape changes.
PAGE_DATA_VERSION = 1
PHONE = re.compile(r"(?:\+?\d[\s-]?){10,}")
SEPARATORS = {"•", "|", "·"}
DIGITS = re.compile(r"^\+?[\d()-]+$")


def phone_runs(words):
    """Yields lists of adjacent words on one line that together form a phone number (>= 10 digits)."""
    run = []
    for word in words + [None]:
        if word and DIGITS.match(word[4]) and (not run or same_line(run[-1], word)):
            run.append(word)
            continue
        if sum(c.isdigit() for w in run for c in w[4]) >= 10:
            yield run
        run = [word] if word and DIGITS.match(word[4]) else []


def same_line(a, b):
    return abs(a[1] - b[1]) < 2 and b[0] >= a[2] - 1


def install_page_data(path):
    """Checks the /resume page data and writes src/content/resume.json."""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if data.get("version") != PAGE_DATA_VERSION:
        raise SystemExit(
            f"Page data is version {data.get('version')}; this site reads version {PAGE_DATA_VERSION}."
        )
    text = json.dumps(data, indent=2, ensure_ascii=False)
    if PHONE.search(text):
        raise SystemExit("Phone-like text in the page data. Not safe to publish.")
    PAGE_DATA.write_text(text + "\n", encoding="utf-8", newline="\n")
    print(f"Wrote {PAGE_DATA.relative_to(ROOT)}.")


def main():
    parser = argparse.ArgumentParser(description="Prepare the public resume.")
    parser.add_argument("pdf", help="the resume PDF, ideally rendered without the phone")
    parser.add_argument("--json", help="the /resume page data from the Job Hunt app")
    args = parser.parse_args()

    doc = fitz.open(args.pdf)
    removed = 0
    for page in doc:
        words = page.get_text("words")
        for run in phone_runs(words):
            rect = fitz.Rect(run[0][:4])
            for word in run[1:]:
                rect |= fitz.Rect(word[:4])
            # Also remove the separator just before the number, so no "• •" is left behind.
            before = [w for w in words if w[4] in SEPARATORS and same_line(w, run[0])]
            if before:
                rect |= fitz.Rect(max(before, key=lambda w: w[2])[:4])
            page.add_redact_annot(rect)
            removed += 1
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        # Redaction leaves an empty /Annots array behind; drop it so strict PDF scanners
        # don't see an annotations entry at all.
        if not page.first_annot:
            doc.xref_set_key(page.xref, "Annots", "null")

    # A resume rendered without the phone (`uv run jobhunt master --web`) has nothing to
    # redact; it still gets the metadata cleanup and the leftover check below.

    doc.set_metadata({"title": "Karthik Parameshwara: Resume", "author": "Karthik Parameshwara"})
    doc.del_xml_metadata()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUTPUT, garbage=4, deflate=True, clean=True)

    # Verify: no 10+ digit sequence remains anywhere in the text.
    text = "".join(page.get_text() for page in fitz.open(OUTPUT))
    leftover = PHONE.findall(text)
    if leftover:
        raise SystemExit(
            f"Phone-like text still present: {len(leftover)} match(es). Not safe to publish."
        )
    print(f"Removed {removed} phone number(s). Wrote {OUTPUT.relative_to(ROOT)}.")

    if args.json:
        install_page_data(args.json)


if __name__ == "__main__":
    main()

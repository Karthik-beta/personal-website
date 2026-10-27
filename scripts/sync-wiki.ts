/**
 * Mirrors the public docs (docs/design, docs/decisions) into the GitHub wiki.
 *
 *   bun run wiki:sync            # build the mirror in .wiki/ and show what would change
 *   bun run wiki:sync -- --push  # also commit and push (publishes publicly!)
 *
 * docs/ is the source of truth; the wiki is generated and must not be edited by hand.
 * docs/research and docs/content are private and are never mirrored. See ADR 0006.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";

const REPO = "Karthik-beta/personal-website";
const WIKI_URL = `https://github.com/${REPO}.wiki.git`;
const BLOB_URL = `https://github.com/${REPO}/blob/main`;
const ROOT = resolve(import.meta.dirname, "..");
const WIKI_DIR = join(ROOT, ".wiki");

// Folder under docs/ -> wiki page prefix. Only these are published.
const SECTIONS = [
  { dir: "decisions", title: "Decisions" },
  { dir: "design", title: "Design" },
] as const;

// Wiki files this script owns. Anything else in the wiki is left alone.
const MANAGED = /^(Home|_Sidebar|_Footer|(Decisions|Design)(-.*)?)\.md$/;

const push = process.argv.includes("--push");

function git(args: string[], cwd = WIKI_DIR): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed:\n${result.stderr}`);
  }
  return result.stdout.trim();
}

/** docs/design/01-principles.md -> "Design-01-principles"; a section README -> "Design". */
function pageName(docsPath: string): string | null {
  const [dir, file, ...rest] = docsPath.split("/");
  const section = SECTIONS.find((s) => s.dir === dir);
  if (!section || !file || rest.length > 0 || !file.endsWith(".md")) return null;
  if (file === "README.md") return section.title;
  return `${section.title}-${file.replace(/\.md$/, "")}`;
}

function titleOf(markdown: string, fallback: string): string {
  return markdown.match(/^#\s+(.+)$/m)?.[1].trim() ?? fallback;
}

/** Point relative links at wiki pages when mirrored, otherwise at the file on GitHub. */
function rewriteLinks(markdown: string, docsPath: string): string {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (match, target: string) => {
    if (/^([a-z]+:|#|\/)/i.test(target)) return match;
    const [path, anchor] = target.split("#");
    const resolved = posix.normalize(posix.join(posix.dirname(docsPath), path));
    const page = pageName(resolved);
    const hash = anchor ? `#${anchor}` : "";
    if (page) return `](${page}${hash})`;
    return `](${BLOB_URL}/${posix.join("docs", resolved)}${hash})`;
  });
}

function main() {
  // The checkout is disposable: always start from the published wiki, discarding earlier dry runs.
  if (existsSync(WIKI_DIR)) {
    git(["fetch", "--quiet"]);
    git(["reset", "--hard", "--quiet", "@{u}"]);
    git(["clean", "-fdq"]);
  } else {
    git(["clone", "--quiet", WIKI_URL, WIKI_DIR], ROOT);
  }

  const pages = new Map<string, string>();
  const index: { title: string; entries: { page: string; title: string }[] }[] = [];

  for (const section of SECTIONS) {
    const dir = join(ROOT, "docs", section.dir);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
    const entries: { page: string; title: string }[] = [];

    for (const file of files.sort()) {
      const docsPath = `${section.dir}/${file}`;
      const page = pageName(docsPath)!;
      const source = readFileSync(join(dir, file), "utf8");
      pages.set(page, rewriteLinks(source, docsPath));
      if (file !== "README.md") entries.push({ page, title: titleOf(source, page) });
    }
    index.push({ title: section.title, entries });
  }

  const list = index
    .map(({ title, entries }) => {
      const items = entries.length
        ? entries.map((e) => `- [${e.title}](${e.page})`).join("\n")
        : "_Nothing here yet._";
      return `## ${title}\n\n${items}`;
    })
    .join("\n\n");

  pages.set(
    "Home",
    `# karthik.nz: design and decisions\n\n` +
      `Design system and decision records for [karthik.nz](https://karthik.nz), ` +
      `the personal website of Karthik. Source: [${REPO}](https://github.com/${REPO}).\n\n${list}\n`,
  );
  pages.set("_Sidebar", `${list}\n`);
  pages.set(
    "_Footer",
    `Generated from [\`docs/\`](https://github.com/${REPO}/tree/main/docs). ` +
      `Edit the source there, not here.\n`,
  );

  // Remove pages we previously generated whose source no longer exists.
  for (const file of readdirSync(WIKI_DIR)) {
    if (MANAGED.test(file) && !pages.has(file.replace(/\.md$/, ""))) {
      rmSync(join(WIKI_DIR, file));
    }
  }
  for (const [page, content] of pages) {
    const out = join(WIKI_DIR, `${page}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, content);
  }

  git(["add", "-A"]);
  const changes = git(["status", "--short"]);
  if (!changes) {
    console.log("Wiki is already up to date.");
    return;
  }
  console.log(`Changes in ${relative(ROOT, WIKI_DIR)}/:\n${changes}\n`);

  if (!push) {
    console.log("Dry run: nothing published. Re-run with `-- --push` to publish to the wiki.");
    return;
  }
  const sha = git(["rev-parse", "--short", "HEAD"], ROOT);
  git(["commit", "--quiet", "-m", `docs: sync from ${sha}`]);
  git(["push", "--quiet"]);
  console.log(`Published to https://github.com/${REPO}/wiki`);
}

main();

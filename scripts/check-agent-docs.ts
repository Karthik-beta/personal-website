// Checks the Markdown versions of the pages against a running production build:
//   bun run build && bun run start -p 3200
//   bun scripts/check-agent-docs.ts http://localhost:3200
// Every piece of text in a page's Markdown must appear in that page's HTML, so the Markdown can
// never say something the site doesn't (docs/design/14-agent-access.md).
import { agentDocs, markdownPath } from "@/lib/agent-docs";
import { site } from "@/lib/site";

const base = (process.argv[2] ?? "http://localhost:3200").replace(/\/$/, "");
const failures: string[] = [];
const check = (ok: boolean, message: string) => {
  if (!ok) failures.push(message);
};
const warnings: string[] = [];

const browser = { Accept: "text/html,application/xhtml+xml,*/*;q=0.8" };
const agent = { Accept: "text/markdown, text/html;q=0.9" };

const entities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
};
const decode = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name: string) => {
    if (name[0] === "#") {
      const hex = name[1].toLowerCase() === "x";
      return String.fromCodePoint(parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10));
    }
    return entities[name.toLowerCase()] ?? whole;
  });

/** Compared with all whitespace removed: tags split words in HTML but not in Markdown. */
const normalise = (text: string) =>
  text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, "");

/** The words a visitor can read: no head, scripts (the RSC payload), styles or comments. */
const visibleText = (html: string) =>
  normalise(
    decode(
      html
        .replace(/<head\b[\s\S]*?<\/head>/i, " ")
        .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]+>/g, " "),
    ),
  );

/**
 * The Markdown's text in pieces: each link label, each bold run (a trailing colon dropped, since
 * "**Role:**" is the page's "Role" label), and the text between them, split at " · ".
 */
function fragments(markdown: string) {
  const pieces: string[] = [];
  for (const raw of markdown.split("\n")) {
    const line = raw
      .replace(/^\s*(#+|>|-)\s+/, "")
      .replace(/^_(.*)_$/, "$1")
      .replace(/^-{3,}$/, "");
    const parts = line.split(/(\[(?:\\.|[^\]])*\]\([^)]*\)|\*\*[^*]+\*\*)/);
    for (const part of parts) {
      const label = part.match(/^\[((?:\\.|[^\]])*)\]\(/);
      if (label) pieces.push(label[1].replace(/\\(.)/g, "$1"));
      else if (part.startsWith("**")) pieces.push(part.slice(2, -2).replace(/:$/, ""));
      else pieces.push(...part.split(" · "));
    }
  }
  return pieces.map((piece) => piece.trim()).filter((piece) => /[\p{L}\p{N}]/u.test(piece));
}

const variesOnAccept = (res: Response) =>
  (res.headers.get("vary") ?? "").split(",").some((name) => name.trim().toLowerCase() === "accept");

async function get(path: string, headers: Record<string, string>) {
  const res = await fetch(base + path, { headers, redirect: "manual" });
  return { res, body: await res.text() };
}

for (const doc of agentDocs) {
  const mdPath = markdownPath(doc);
  const page = await get(doc.path, browser);
  const md = await get(mdPath, agent);
  const negotiated = await get(doc.path, agent);

  check(page.res.status === 200, `${doc.path}: HTML answered ${page.res.status}`);
  check(
    page.res.headers.get("content-type")?.startsWith("text/html") ?? false,
    `${doc.path}: a browser got ${page.res.headers.get("content-type")}, not HTML`,
  );
  // `next start` replaces the config's Vary on app pages with its own; Vercel may keep it.
  if (!variesOnAccept(page.res)) {
    warnings.push(`${doc.path}: HTML has no Vary: Accept (${page.res.headers.get("vary")})`);
  }
  check(md.res.status === 200, `${mdPath}: answered ${md.res.status}`);
  check(
    md.res.headers.get("content-type") === "text/markdown; charset=utf-8",
    `${mdPath}: Content-Type is ${md.res.headers.get("content-type")}`,
  );
  check(variesOnAccept(md.res), `${mdPath}: no Vary: Accept (${md.res.headers.get("vary")})`);
  const canonical = `<${site.url}${doc.path}>; rel="canonical"`;
  check(
    md.res.headers.get("link") === canonical,
    `${mdPath}: Link is ${md.res.headers.get("link")}, expected ${canonical}`,
  );
  check(negotiated.body === md.body, `${doc.path}: Accept: text/markdown did not return ${mdPath}`);

  const text = visibleText(page.body);
  for (const piece of fragments(md.body)) {
    check(text.includes(normalise(piece)), `${mdPath}: not on the page: "${piece}"`);
  }
}

const llms = await get("/llms.txt", agent);
check(llms.res.status === 200, `/llms.txt answered ${llms.res.status}`);
for (const doc of agentDocs) {
  check(
    llms.body.includes(`(${site.url}${markdownPath(doc)})`),
    `/llms.txt does not list ${markdownPath(doc)}`,
  );
}
const full = await get("/llms-full.txt", agent);
check(full.res.status === 200, `/llms-full.txt answered ${full.res.status}`);
for (const doc of agentDocs) {
  const md = await get(markdownPath(doc), agent);
  check(full.body.includes(md.body.trimEnd()), `/llms-full.txt lacks ${markdownPath(doc)}`);
}

const curl = await get("/", { "User-Agent": "curl/8.9.1", Accept: "*/*" });
check(
  curl.res.headers.get("content-type")?.startsWith("text/plain") ?? false,
  `plain curl on / no longer gets the card (${curl.res.headers.get("content-type")})`,
);
const curlMarkdown = await get("/", { "User-Agent": "curl/8.9.1", Accept: "text/markdown" });
check(
  curlMarkdown.res.headers.get("content-type")?.startsWith("text/markdown") ?? false,
  `curl with Accept: text/markdown on / got ${curlMarkdown.res.headers.get("content-type")}`,
);
for (const path of ["/nope.md", "/work/nope.md", "/md/nope"]) {
  const missing = await get(path, agent);
  check(missing.res.status === 404, `${path} answered ${missing.res.status}, not 404`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`OK: ${agentDocs.length} pages, their Markdown, llms.txt and llms-full.txt`);

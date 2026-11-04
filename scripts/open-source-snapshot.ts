// Refreshes src/content/open-source.snapshot.json: the copy the open-source page falls back to
// when GitHub or a registry can't be reached, or GITHUB_TOKEN isn't set (ADR 0017).
//
//   GITHUB_TOKEN=$(gh auth token) bun run oss:snapshot
//
// Fails instead of writing a partial snapshot.

import { writeFileSync } from "node:fs";
import { fetchOpenSource } from "../src/lib/open-source/fetch";

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Set GITHUB_TOKEN first, e.g. GITHUB_TOKEN=$(gh auth token) bun run oss:snapshot");
  process.exit(1);
}

const data = await fetchOpenSource({ token });
const file = new URL("../src/content/open-source.snapshot.json", import.meta.url);
writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

const active = data.days.filter((day) => day.active).length;
const prs = data.contributions.reduce((n, repo) => n + repo.pullRequests.length, 0);
console.log(
  `Snapshot written: ${active}/${data.days.length} active days, ${prs} pull requests in ` +
    `${data.contributions.length} repositories, ` +
    data.releases.map((r) => `${r.name} ${r.version}`).join(", "),
);

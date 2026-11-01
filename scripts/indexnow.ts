// Tells IndexNow (Bing and others) that every page in the live sitemap may have changed. Run
// after a deploy is live: bun run indexnow [-- --dry-run]
import { site } from "@/lib/site";

const dryRun = process.argv.includes("--dry-run");
const key = site.indexNowKey;
const keyLocation = `${site.url}/${key}.txt`;

const sitemap = await fetch(`${site.url}/sitemap.xml`);
if (!sitemap.ok) {
  console.error(`sitemap.xml answered ${sitemap.status}`);
  process.exit(1);
}
const urlList = [
  ...[...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim()),
  `${site.url}/llms.txt`,
];

const keyFile = await fetch(keyLocation);
const keyLive = keyFile.ok && (await keyFile.text()) === key;
const payload = { host: new URL(site.url).host, key, keyLocation, urlList };

if (dryRun) {
  if (!keyLive) console.warn(`${keyLocation} is not live yet (${keyFile.status})`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}
if (!keyLive) {
  console.error(`${keyLocation} does not return the key (${keyFile.status}): deploy first`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
console.log(`IndexNow answered ${res.status}`);
for (const url of urlList) console.log(`  ${url}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

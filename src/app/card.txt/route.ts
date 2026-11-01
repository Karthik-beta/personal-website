import { connection } from "next/server";
import { bengaluruTime } from "@/lib/bengaluru-time";
import { site } from "@/lib/site";

function wrap(text: string, width: number) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines.at(-1);
    if (last !== undefined && last.length + 1 + word.length <= width)
      lines[lines.length - 1] += ` ${word}`;
    else lines.push(word);
  }
  return lines;
}

const links = [
  ["Resume", `${site.url}${site.resume}`],
  ["Email", site.email],
  ["GitHub", site.links.github],
  ["LinkedIn", site.links.linkedin],
  ["AI agents", `${site.url}/llms.txt`],
];

export async function GET() {
  await connection();
  const now = new Date();
  const lines = [
    "",
    site.name,
    ...wrap(site.description, 64),
    "",
    `${bengaluruTime(now)}.`,
    "",
    ...links.map(([label, href]) => `${label.padEnd(10)}${href}`),
    "",
  ];
  // Plain ASCII, so a terminal with an old code page doesn't garble the typographic apostrophe.
  const body = lines
    .map((line) => (line ? `  ${line}` : ""))
    .join("\n")
    .replaceAll("’", "'");

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

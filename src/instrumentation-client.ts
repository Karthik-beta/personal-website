import { bengaluruTime } from "@/lib/bengaluru-time";
import { site } from "@/lib/site";

const commit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

console.log(
  [
    `${bengaluruTime(new Date())}.`,
    "You opened the console, so you probably read the source too. It’s public:",
    site.repo,
    commit &&
      `This page was built from commit ${commit.slice(0, 7)}: ${site.repo}/commit/${commit}`,
    `From a terminal, try: curl ${site.url}`,
    `I’m available now: ${site.email}`,
  ]
    .filter(Boolean)
    .join("\n"),
);

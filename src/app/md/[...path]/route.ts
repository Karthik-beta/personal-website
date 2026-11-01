import { agentDocs, findAgentDoc, markdownHeaders, markdownPath } from "@/lib/agent-docs";

// The Markdown version of each page. Reached through rewrites in next.config.ts: /resume.md, and
// /resume with `Accept: text/markdown`. Prerendered; /open-source follows its data's hourly cache.

export function generateStaticParams() {
  return agentDocs.map((doc) => ({ path: markdownPath(doc).slice(1, -3).split("/") }));
}

export async function GET(_: Request, ctx: RouteContext<"/md/[...path]">) {
  const { path } = await ctx.params;
  const doc = findAgentDoc(path);
  if (!doc) return new Response("Not found\n", { status: 404 });
  return new Response(await doc.markdown(), { headers: markdownHeaders(doc) });
}

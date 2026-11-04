import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/mcp";

// Stateless Streamable HTTP: no session id and plain JSON answers, so each POST stands alone in a
// serverless function. With only POST exported, Next.js answers GET and DELETE with 405.
export async function POST(request: Request) {
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer().connect(transport);
  return transport.handleRequest(request);
}

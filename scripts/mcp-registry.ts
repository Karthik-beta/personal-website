// Publishes server.json to the official MCP Registry (ADR 0024), the same requests the registry's
// mcp-publisher CLI makes for HTTP domain auth: sign the current time with the key whose public
// half is in public/.well-known/mcp-registry-auth, exchange that for a token, then publish.
//
//   bun run mcp:registry -- --validate   checks server.json with the registry, publishes nothing
//   bun run mcp:registry                 publishes (after the auth file is live)
//
// The private key never enters the repo: MCP_REGISTRY_KEY or ~/.mcp-registry/karthik-nz-ed25519.pem.
import { createPrivateKey, createPublicKey, sign } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { site } from "@/lib/site";

const registry = "https://registry.modelcontextprotocol.io";
const domain = new URL(site.url).host;
const serverJson = readFileSync(new URL("../server.json", import.meta.url), "utf8");

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const post = async (path: string, body: string, token?: string) => {
  const res = await fetch(registry + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  return { status: res.status, text: await res.text() };
};

if (process.argv.includes("--validate")) {
  const { status, text } = await post("/v0.1/validate", serverJson);
  console.log(`validate answered ${status}\n${text}`);
  process.exit(status < 300 ? 0 : 1);
}

const keyFile =
  process.env.MCP_REGISTRY_KEY ?? join(homedir(), ".mcp-registry", "karthik-nz-ed25519.pem");
const privateKey = createPrivateKey(readFileSync(keyFile));
const publicKey = createPublicKey(privateKey).export({ format: "der", type: "spki" }).subarray(-32);
const expected = `v=MCPv1; k=ed25519; p=${publicKey.toString("base64")}`;

// The registry fetches the proof itself, with these headers, and doesn't follow redirects.
const proof = await fetch(`${site.url}/.well-known/mcp-registry-auth`, {
  headers: { Accept: "text/plain", "User-Agent": "mcp-registry/1.0" },
  redirect: "manual",
});
const served = proof.status === 200 ? (await proof.text()).trim() : "";
if (served !== expected) {
  fail(
    `${site.url}/.well-known/mcp-registry-auth answered ${proof.status}, not this key: deploy first`,
  );
}

const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const signedTimestamp = sign(null, Buffer.from(timestamp), privateKey).toString("hex");
const auth = await post(
  "/v0/auth/http",
  JSON.stringify({ domain, timestamp, signed_timestamp: signedTimestamp }),
);
if (auth.status !== 200) fail(`token exchange answered ${auth.status}: ${auth.text}`);
const token = (JSON.parse(auth.text) as { registry_token: string }).registry_token;

const published = await post("/v0/publish", serverJson, token);
console.log(`publish answered ${published.status}\n${published.text}`);
if (published.status >= 300) process.exit(1);

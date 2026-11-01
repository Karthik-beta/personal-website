# 0024: Listing the MCP server in the official MCP Registry

- Status: Accepted (2026-11-01). Builds on [0023](0023-mcp-server.md).
- Date: 2026-11-01

## Context

The MCP server at `https://karthik.nz/mcp` is found only by people who already know the URL. The
official MCP Registry (registry.modelcontextprotocol.io) is the public list that MCP clients and
directories read. A server's name there must sit in a namespace the publisher proves they own.

## Options

1. **GitHub login:** name `io.github.karthik-beta/...`, proven by a GitHub sign-in.
2. **DNS proof:** name `nz.karthik/...`, proven by a TXT record on the karthik.nz apex.
3. **HTTP proof:** name `nz.karthik/...`, proven by a file at
   `https://karthik.nz/.well-known/mcp-registry-auth`.

## Decision

- **Option 3.** The name is `nz.karthik/karthik-parameshwara`, which matches the domain the server
  runs on, and the proof is a file the site already deploys, so no DNS change is needed.
- **`server.json`** at the repo root describes the listing: title, a 99-character description,
  the website, and one `streamable-http` remote at `https://karthik.nz/mcp`. The registry's
  validate endpoint accepted it.
- **The key pair:** an Ed25519 key generated on Karthik's PC. Only its public half is in the repo
  (`public/.well-known/mcp-registry-auth`). The private half lives at
  `~/.mcp-registry/karthik-nz-ed25519.pem` and must never be committed. Losing it only means
  generating a new pair and replacing the public file.
- **`bun run mcp:registry`** publishes. It makes the same requests as the registry's own
  `mcp-publisher` CLI: it checks that the live proof file matches the key, signs the current
  time, exchanges the signature for a token at `/v0/auth/http`, and posts `server.json` to
  `/v0/publish`. `-- --validate` only validates. The CLI itself wasn't used, because running a
  downloaded binary was blocked on this PC.
- **Updating the listing:** change `server.json`, raise its `version` (the registry keeps every
  version), and run `bun run mcp:registry` again.

## Why

- A name under karthik.nz tells a reader the server and the website have the same owner. The
  registry checks the namespace, not the remote URL, so a GitHub-namespaced name would say less.
- The HTTP proof keeps everything in the repo and needs no Cloudflare change.

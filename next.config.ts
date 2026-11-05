import path from "node:path";
import type { NextConfig } from "next";
import { site } from "./src/lib/site";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy: what the page may load and who may frame it. Pages are static, so
// there's no per-request nonce and Next.js's inline scripts need 'unsafe-inline'. The policy
// still blocks third-party scripts (except Cloudflare's beacon and the tags Google Tag Manager
// loads), plugins, framing and form posts elsewhere. React needs 'unsafe-eval' in development
// only; it stays off in production, so GTM "Custom JavaScript" variables won't run (ADR 0028).
// - Google: the hosts Google lists for GTM and a GA4 tag, plus www.google.com, which the tag also
//   sends each hit to. tagmanager.google.com, the gstatic hosts and Google Fonts are for GTM's
//   preview mode only.
// - LinkedIn Insight Tag: snap.licdn.com serves it; it reports to px.ads.linkedin.com, which can
//   redirect to www.linkedin.com.
// A new tag in GTM from any other host is blocked until its hosts are added here.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://www.googletagmanager.com https://tagmanager.google.com https://snap.licdn.com`,
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://px.ads.linkedin.com https://www.linkedin.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://px.ads.linkedin.com https://www.linkedin.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Vercel builds only: Safari applies it to http://localhost too, and a local build then
  // loads with no CSS or JavaScript.
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

// Strict-Transport-Security comes from Vercel. It deliberately has no includeSubDomains: that
// would also bind workclock.karthik.nz and blinkql.karthik.nz, which are hosted elsewhere.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

// Pages that also have a Markdown version (src/lib/agent-docs.ts), and where it is served from.
const markdownPages = [
  { source: "/", destination: "/md/index", markdown: "/index.md" },
  { source: "/resume", destination: "/md/resume", markdown: "/resume.md" },
  { source: "/open-source", destination: "/md/open-source", markdown: "/open-source.md" },
  { source: "/work/:slug([^/.]+)", destination: "/md/work/:slug", markdown: "/work/:slug.md" },
];
const wantsMarkdown = [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The same URL answers with HTML or Markdown, so caches must key on Accept.
      ...markdownPages.flatMap(({ source, markdown }) => [
        { source, headers: [{ key: "Vary", value: "Accept" }] },
        {
          // Only on the HTML: the Markdown answer keeps its own Link to the canonical page.
          source,
          missing: wantsMarkdown,
          headers: [
            {
              key: "Link",
              value: `<${site.url}${markdown}>; rel="alternate"; type="text/markdown"`,
            },
          ],
        },
      ]),
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // An explicit Accept: text/markdown wins over the curl card; plain curl sends */*.
        ...markdownPages.map(({ source, destination }) => ({
          source,
          destination,
          has: wantsMarkdown,
        })),
        {
          source: "/",
          has: [{ type: "header", key: "user-agent", value: "curl/.*" }],
          destination: "/card.txt",
        },
      ],
      afterFiles: [{ source: "/:path*.md", destination: "/md/:path*" }],
    };
  },
  turbopack: {
    // Pin the project root: a stray lockfile in a parent folder must not change it.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

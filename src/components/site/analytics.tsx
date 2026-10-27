"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

// Cloudflare Web Analytics (ADR 0011): cookie-free, so no consent banner is needed.
// Loads only in production builds, only when the site token is configured, and only on the real
// domain: Vercel's per-deployment addresses (*.vercel.app) serve the same build and would otherwise
// show up as extra hosts in the dashboard.
const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
const siteHost = new URL(site.url).hostname;
const subscribe = () => () => {};

export function Analytics() {
  const onSiteHost = useSyncExternalStore(
    subscribe,
    () => window.location.hostname === siteHost,
    () => false,
  );

  if (process.env.NODE_ENV !== "production" || !token || !onSiteHost) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}

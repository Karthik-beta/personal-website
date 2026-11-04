"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Two analytics tools, both production only, both only on the real domain: Vercel's
// per-deployment addresses (*.vercel.app) serve the same build and would otherwise show up as
// extra hosts in the dashboards.
// - Cloudflare Web Analytics (ADR 0011): cookie-free visit counts and real-visitor speed data.
// - Google Analytics 4 (ADR 0015): clicks and behaviour. Enhanced measurement (set in the GA
//   property) records page views on client-side navigation, outbound clicks, scrolling and PDF
//   opens; the click listener below adds the events it can't see.
const cfToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
const gaId = process.env.NEXT_PUBLIC_GA_ID;
const siteHost = new URL(site.url).hostname;
const subscribe = () => () => {};

// Sends a GA event for clicks on email links, the resume, and anything marked `data-track`.
function trackClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target.closest("a, [data-track]") : null;
  if (!target || !window.gtag) return;

  const named = target.getAttribute("data-track");
  const href = target.getAttribute("href") ?? "";
  const name =
    named ??
    (href.startsWith("mailto:") ? "email_click" : href === site.resume ? "resume_open" : null);
  if (name) window.gtag("event", name, { link_text: target.textContent?.trim() });
}

export function Analytics() {
  const onSiteHost = useSyncExternalStore(
    subscribe,
    () => window.location.hostname === siteHost,
    () => false,
  );
  const enabled = process.env.NODE_ENV === "production" && onSiteHost;

  useEffect(() => {
    if (!enabled || !gaId) return;
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      {cfToken && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={JSON.stringify({ token: cfToken })}
        />
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
    </>
  );
}

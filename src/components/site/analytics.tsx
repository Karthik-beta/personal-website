"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/track";

// Two analytics tools, both production only, both only on the real domain: Vercel's
// per-deployment addresses (*.vercel.app) serve the same build and would otherwise show up as
// extra hosts in the dashboards. A browser that has visited `?notrack` loads neither (ADR 0030).
// - Cloudflare Web Analytics (ADR 0011): cookie-free visit counts and real-visitor speed data.
// - Google Tag Manager (ADR 0028), which loads Google Analytics 4 (ADR 0015) and the X pixel
//   (ADR 0029). Enhanced measurement (set in the GA property) records page views on client-side
//   navigation, outbound clicks, scrolling and PDF opens; the listeners below add the events it
//   can't see: clicks on email links, the resume and anything marked `data-track` (with
//   `data-track-placement` for where on the page), and plays of any `<video data-track-video>`.
const cfToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const siteHost = new URL(site.url).hostname;
const subscribe = () => () => {};

// Karthik's own browsers opt out of analytics (ADR 0030): `?notrack` on any page remembers the
// choice in this browser, `?track` clears it. The parameter is then removed from the address
// bar. Worked out once per page load. If storage is blocked, tracking stays on.
const optOutKey = "karthik.nz:notrack";
let optedOut: boolean | undefined;

function isOptedOut() {
  if (optedOut !== undefined) return optedOut;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("notrack")) localStorage.setItem(optOutKey, "1");
    if (url.searchParams.has("track")) localStorage.removeItem(optOutKey);
    if (url.searchParams.has("notrack") || url.searchParams.has("track")) {
      url.searchParams.delete("notrack");
      url.searchParams.delete("track");
      window.history.replaceState(window.history.state, "", url);
    }
    optedOut = localStorage.getItem(optOutKey) === "1";
  } catch {
    optedOut = false;
  }
  return optedOut;
}

// Sends an event for clicks on email links, the resume, and anything marked `data-track`.
function trackClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target.closest("a, [data-track]") : null;
  if (!target) return;

  const named = target.getAttribute("data-track");
  const href = target.getAttribute("href") ?? "";
  const placement = target.getAttribute("data-track-placement");
  const name =
    named ??
    (href.startsWith("mailto:") ? "email_click" : href === site.resume ? "resume_open" : null);
  if (!name) return;
  track(name, {
    link_text: target.textContent?.trim(),
    ...(href && { link_url: href }),
    ...(placement && { placement }),
  });
}

// `play` doesn't bubble, so it is caught in the capture phase.
function trackPlay(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLVideoElement)) return;
  const video = target.getAttribute("data-track-video");
  if (video !== null) track("video_play", { video });
}

export function Analytics() {
  const trackable = useSyncExternalStore(
    subscribe,
    () => window.location.hostname === siteHost && !isOptedOut(),
    () => false,
  );
  const enabled = process.env.NODE_ENV === "production" && trackable;

  useEffect(() => {
    if (!enabled || !gtmId) return;
    document.addEventListener("click", trackClick);
    document.addEventListener("play", trackPlay, true);
    return () => {
      document.removeEventListener("click", trackClick);
      document.removeEventListener("play", trackPlay, true);
    };
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
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtm.js?id="+${JSON.stringify(encodeURIComponent(gtmId))};document.head.appendChild(s);`}
        </Script>
      )}
    </>
  );
}

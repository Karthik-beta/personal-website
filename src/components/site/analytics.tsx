import Script from "next/script";

// Cloudflare Web Analytics (ADR 0011): cookie-free, so no consent banner is needed.
// Loads only in production builds, and only when the site token is configured.
const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !token) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Every parameter any event sends. Each push resets the ones it doesn't set, because Tag
// Manager's data layer keeps old values: without this, a `placement` from one click would ride
// along on the next event.
const params = [
  "link_text",
  "link_url",
  "placement",
  "video",
  "case_study",
  "reading_minutes",
] as const;
export type TrackParams = Partial<Record<(typeof params)[number], string | number>>;

/** Sends an event to Google Tag Manager (ADR 0028). A no-op until the container has loaded. */
export function track(event: string, values: TrackParams = {}) {
  if (!window.dataLayer) return;
  const reset = Object.fromEntries(params.map((key) => [key, undefined]));
  window.dataLayer.push({ ...reset, ...values, event });
}

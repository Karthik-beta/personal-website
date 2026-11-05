"use client";

import { useEffect, useRef } from "react";

/**
 * Sends a GA event the first time this marker scrolls into view. A page Next keeps hidden
 * (display: none) never intersects, and effects re-run when it is shown again, so a revisit
 * counts once per visit.
 */
export function TrackView({
  event,
  params,
}: {
  event: string;
  params?: Record<string, string | number>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      window.gtag?.("event", event, params);
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
    // params is a fresh object each render; its values are fixed for a mounted marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return <span ref={ref} aria-hidden />;
}

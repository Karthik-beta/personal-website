"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { bengaluruTime } from "@/lib/bengaluru-time";
import { cn } from "@/lib/cn";
import { InlineScript } from "./inline-script";

const FALLBACK = "Based in Bengaluru, India";
const visitorTimeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const visitorDayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
const bengaluruUtcOffsetMinutes = 5 * 60 + 30;

function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours && `${hours} h`, rest && `${rest} min`].filter(Boolean).join(" ");
}

function visitorTime(date: Date) {
  const here = `It’s ${visitorTimeFormat.format(date)} on ${visitorDayFormat.format(date)} where you are`;
  const gap = bengaluruUtcOffsetMinutes + date.getTimezoneOffset();
  if (gap === 0) return `${here} too`;
  return `${here}, ${duration(Math.abs(gap))} ${gap > 0 ? "behind" : "ahead of"} Bengaluru`;
}

type Where = "bengaluru" | "visitor";
const formats: Record<Where, (date: Date) => string> = {
  bengaluru: bengaluruTime,
  visitor: visitorTime,
};

// Same output as bengaluruTime(), for the first paint before React hydrates. Keep the two in sync.
const scriptFormat = `function(d){var z="Asia/Kolkata";return "It\\u2019s "+new Intl.DateTimeFormat("en-GB",{timeZone:z,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(d)+" on "+new Intl.DateTimeFormat("en-GB",{timeZone:z,weekday:"long"}).format(d)+" in Bengaluru"}`;

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(timer);
}

/** "It's 14:20 on Tuesday in Bengaluru", or the visitor's own time once tapped. Shows a static
 *  fallback until the browser knows the time. */
export function LocalTime({ className }: { className?: string }) {
  const id = useId();
  const [where, setWhere] = useState<Where>("bengaluru");
  const [announced, setAnnounced] = useState("");
  const text = useSyncExternalStore(
    subscribe,
    () => formats[where](new Date()),
    () => null,
  );

  function toggle() {
    const next = where === "bengaluru" ? "visitor" : "bengaluru";
    setWhere(next);
    setAnnounced(formats[next](new Date()));
  }

  return (
    <>
      <button
        type="button"
        id={id}
        onClick={toggle}
        data-track="clock_toggle"
        suppressHydrationWarning
        className={cn(
          "inline-block cursor-pointer rounded-band bg-band px-2.5 py-1.5 text-left text-xs text-ink tabular-nums transition-colors duration-120 ease-out hover:text-accent",
          className,
        )}
      >
        {text ?? FALLBACK}
      </button>
      <span className="sr-only" aria-live="polite">
        {announced}
      </span>
      <InlineScript
        html={`(function(){var n=document.getElementById(${JSON.stringify(id)});if(n)n.textContent=(${scriptFormat})(new Date())})()`}
      />
    </>
  );
}

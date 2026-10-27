"use client";

import { useId, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { InlineScript } from "./inline-script";

const FALLBACK = "Based in Bengaluru, India";
const zone = { timeZone: "Asia/Kolkata" } as const;
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  ...zone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const dayFormat = new Intl.DateTimeFormat("en-GB", { ...zone, weekday: "long" });

function format(date: Date) {
  return `It’s ${timeFormat.format(date)} on ${dayFormat.format(date)} in Bengaluru`;
}

// Same output as format(), for the first paint before React hydrates. Keep the two in sync.
const scriptFormat = `function(d){var z="Asia/Kolkata";return "It\\u2019s "+new Intl.DateTimeFormat("en-GB",{timeZone:z,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(d)+" on "+new Intl.DateTimeFormat("en-GB",{timeZone:z,weekday:"long"}).format(d)+" in Bengaluru"}`;

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(timer);
}

/** "It's 14:20 on Tuesday in Bengaluru". Shows a static fallback until the browser knows the time. */
export function LocalTime({ className }: { className?: string }) {
  const id = useId();
  const text = useSyncExternalStore(
    subscribe,
    () => format(new Date()),
    () => null,
  );

  return (
    <>
      <p
        id={id}
        suppressHydrationWarning
        className={cn(
          "inline-block rounded-band bg-band px-2.5 py-1.5 text-xs text-ink tabular-nums",
          className,
        )}
      >
        {text ?? FALLBACK}
      </p>
      <InlineScript
        html={`(function(){var n=document.getElementById(${JSON.stringify(id)});if(n)n.textContent=(${scriptFormat})(new Date())})()`}
      />
    </>
  );
}

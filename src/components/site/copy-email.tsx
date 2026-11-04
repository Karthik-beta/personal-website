"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { textLinkClasses } from "@/components/ui/text-link";

type Result = "copied" | "selected" | null;

const messages: Record<Exclude<Result, null>, string> = {
  copied: "Email address copied",
  selected: "Address selected. Press Ctrl+C (or ⌘C) to copy.",
};

export function CopyEmail({ email }: { email: string }) {
  const [result, setResult] = useState<Result>(null);
  const addressRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(() => setResult(null), result === "copied" ? 2000 : 6000);
    return () => window.clearTimeout(timer);
  }, [result]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setResult("copied");
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand, and say so.
      const node = addressRef.current;
      const selection = window.getSelection();
      if (!node || !selection) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      setResult("selected");
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          ref={addressRef}
          href={`mailto:${email}`}
          className={textLinkClasses("action", "text-lg")}
        >
          {email}
        </a>
        <Button variant="quiet" onClick={copy} data-track="email_copy">
          {result === "copied" ? (
            <Check aria-hidden size={18} strokeWidth={1.75} />
          ) : (
            <Copy aria-hidden size={18} strokeWidth={1.75} />
          )}
          {result === "copied" ? "Copied" : "Copy email"}
        </Button>
      </div>
      <p role="status" className={result === "selected" ? "text-xs text-muted" : "sr-only"}>
        {result ? messages[result] : ""}
      </p>
    </div>
  );
}

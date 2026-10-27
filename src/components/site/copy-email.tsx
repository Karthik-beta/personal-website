"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { textLinkClasses } from "@/components/ui/text-link";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const addressRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand.
      const node = addressRef.current;
      const selection = window.getSelection();
      if (!node || !selection) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <a ref={addressRef} href={`mailto:${email}`} className={textLinkClasses("action", "text-lg")}>
        {email}
      </a>
      <Button variant="quiet" onClick={copy}>
        {copied ? (
          <Check aria-hidden size={18} strokeWidth={1.75} />
        ) : (
          <Copy aria-hidden size={18} strokeWidth={1.75} />
        )}
        {copied ? "Copied" : "Copy email"}
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}

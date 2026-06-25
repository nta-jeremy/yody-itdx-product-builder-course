/**
 * CodeCopyButton — client island that copies a code block's text to the
 * clipboard. Rendered inside the `pre` map of MarkdownView (Server Component),
 * so this stays a thin client child.
 *
 * Uses `navigator.clipboard.writeText` (secure context) with a
 * `document.execCommand("copy")` fallback for non-secure contexts.
 *
 * YODY DS: token colors only (no raw hex), tap target >=44px via padding,
 * visible focus ring, no emoji. Icons from lucide-react (Copy / Check).
 */

"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";

export interface CodeCopyButtonProps {
  /** Raw code text to copy. */
  code: string;
}

export function CodeCopyButton({ code }: CodeCopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for non-secure contexts (no clipboard API).
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Sao chép mã"
      className="yody-code-copy absolute right-[var(--s-2)] top-[var(--s-2)] inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-xs)] px-[var(--s-2)] text-[var(--fg-3)] outline-ring/50 transition-colors hover:text-[var(--fg-1)] hover:bg-[rgba(255,255,255,0.08)] focus-visible:ring-[3px]"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default CodeCopyButton;
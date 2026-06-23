"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "./icons";

interface CodeBlockProps {
  filename: string;
  code: string;
  onCopied: () => void;
}

export function CodeBlock({ filename, code, onCopied }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
    setCopied(true);
    onCopied();
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mb-7.5 overflow-hidden rounded-xl border border-line">
      <div className="flex items-center justify-between bg-ink px-3.5 py-2.25">
        <span className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[#cdd0ee]">
          {filename}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.75 py-1.25 font-[family-name:var(--font-body)] text-xs font-semibold text-white"
        >
          {copied ? (
            <CheckIcon className="size-3.25" />
          ) : (
            <CopyIcon className="size-3.25" />
          )}
          Sao chép
        </button>
      </div>
      <pre className="overflow-auto bg-[#0e0f24] px-4.5 py-4 font-[family-name:var(--font-mono)] text-[13px] leading-[1.75] text-[#e6e7f2]">
        {code}
      </pre>
    </div>
  );
}
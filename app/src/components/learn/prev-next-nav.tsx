/**
 * PrevNextNav — Server Component rendering prev/next lesson link cards at
 * the bottom of a learner detail page. Computed from the sorted session list
 * (no client state, no fetch). The active code's index picks the neighbours.
 *
 * YODY DS: token colors only, tap targets >=44px (min-h on links), visible
 * focus ring, no emoji. Icons from lucide-react (ChevronLeft/Right).
 */

import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LearnerContent } from "@/lib/content";

export interface PrevNextNavProps {
  /** Sorted learner sessions (from `listLearnerSessions()`). */
  sessions: LearnerContent[];
  /** sessionCode of the current page. */
  activeCode: string;
}

export function PrevNextNav({ sessions, activeCode }: PrevNextNavProps) {
  const idx = sessions.findIndex((s) => s.code === activeCode);
  if (idx === -1) return null;
  const prev = idx > 0 ? sessions[idx - 1] : null;
  const next = idx < sessions.length - 1 ? sessions[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Điều hướng bài học"
      className="mt-12 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/learn/${prev.code}` as Route}
          className="group inline-flex min-h-[64px] flex-col justify-center rounded-xl border border-border bg-[var(--bg)] px-5 py-3 outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          <span className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--fg-3)]">
            <ChevronLeft size={14} /> {prev.code}
          </span>
          <span className="mt-1 font-[family-name:var(--font-brand)] text-[14px] font-bold leading-[1.3] text-[var(--fg-1)]">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/learn/${next.code}` as Route}
          className="group inline-flex min-h-[64px] flex-col justify-center rounded-xl border border-border bg-[var(--bg)] px-5 py-3 text-right outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          <span className="flex items-center justify-end gap-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--fg-3)]">
            {next.code} <ChevronRight size={14} />
          </span>
          <span className="mt-1 font-[family-name:var(--font-brand)] text-[14px] font-bold leading-[1.3] text-[var(--fg-1)]">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}

export default PrevNextNav;
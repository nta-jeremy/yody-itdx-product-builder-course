/**
 * PrevNextNav — Server Component rendering prev/next lesson link cards at
 * the bottom of a learner detail page. Computed from the sorted session list
 * (no client state, no fetch). The active code's index picks the neighbours.
 *
 * VitePress pager rhythm: a 2-column grid where each link shows a small
 * muted `desc` ("Trang trước" / "Trang sau") on top and the lesson `title`
 * below, with a thin border that brightens on hover and an arrow pushed to
 * the outer edge.
 *
 * YODY DS: token colors only, tap targets >=44px (min-h on links), visible
 * focus ring, no emoji. Arrows via lucide-react (ArrowLeft / ArrowRight),
 * placed at the outer edge.
 */

import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
      className="mt-16 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/learn/${prev.code}` as Route}
          className="group flex flex-col justify-center gap-1.5 overflow-hidden rounded-lg border border-border bg-[var(--bg)] px-5 py-4 outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
            <ArrowLeft size={14} className="flex-none text-[var(--fg-3)] transition-colors group-hover:text-[var(--brand)]" />
            Trang trước
          </span>
          <span className="flex min-w-0 items-baseline gap-2 font-[family-name:var(--font-brand)] text-[15px] font-bold leading-[1.35] text-[var(--fg-1)]">
            <span className="flex-none font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand)]">
              {prev.code}
            </span>
            <span className="min-w-0 line-clamp-2 break-words">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/learn/${next.code}` as Route}
          className="group flex flex-col items-end justify-center gap-1.5 overflow-hidden rounded-lg border border-border bg-[var(--bg)] px-5 py-4 text-right outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
            Trang sau
            <ArrowRight size={14} className="flex-none text-[var(--fg-3)] transition-colors group-hover:text-[var(--brand)]" />
          </span>
          <span className="flex min-w-0 items-baseline justify-end gap-2 font-[family-name:var(--font-brand)] text-[15px] font-bold leading-[1.35] text-[var(--fg-1)]">
            <span className="min-w-0 line-clamp-2 break-words">{next.title}</span>
            <span className="flex-none font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand)]">
              {next.code}
            </span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}

export default PrevNextNav;
/**
 * SubSessionNav — Server Component rendering prev/next sub-session link cards
 * at the bottom of a sub-session detail page. Pre-computed by
 * `SubLearnerContent.navigation` (Phase 2) so no client state, no fetch.
 *
 * Distinguishes two transition kinds:
 *   - `kind: "sub"`    — same parent (e.g. I4.2.1 → I4.2.2). Label "Buổi phụ trước/sau".
 *   - `kind: "parent"` — cross-course (e.g. I2.1.2 → I2.3.1). Label "Buổi trước/sau".
 *
 * VitePress pager rhythm — mirrors `PrevNextNav` but scoped to sub-sessions.
 * YODY DS: token colors only, tap targets >=44px (min-h on links), no emoji.
 */

import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SubNavigation } from "@/lib/content";

export interface SubSessionNavProps {
  prevCode: string | null;
  prevTitle: string;
  prevKind: SubNavigation["prevKind"];
  nextCode: string | null;
  nextTitle: string;
  nextKind: SubNavigation["nextKind"];
}

function buildHref(code: string): Route {
  const dot = code.indexOf(".");
  const parent = code.slice(0, dot);
  const sub = code.slice(dot + 1);
  return `/learn/${parent}/${sub}` as Route;
}

function prevLabel(kind: SubNavigation["prevKind"]): string {
  if (kind === "parent") return "Buổi trước";
  return "Buổi phụ trước";
}

function nextLabel(kind: SubNavigation["nextKind"]): string {
  if (kind === "parent") return "Buổi sau";
  return "Buổi phụ sau";
}

export function SubSessionNav({
  prevCode,
  prevTitle,
  prevKind,
  nextCode,
  nextTitle,
  nextKind,
}: SubSessionNavProps) {
  if (!prevCode && !nextCode) return null;

  return (
    <nav
      aria-label="Điều hướng buổi phụ"
      className="mt-16 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prevCode ? (
        <Link
          href={buildHref(prevCode)}
          className="group flex min-h-[88px] flex-col justify-center rounded-lg border border-border bg-[var(--bg)] px-5 py-4 outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
            <ArrowLeft size={14} className="flex-none text-[var(--fg-3)] transition-colors group-hover:text-[var(--brand)]" />
            {prevLabel(prevKind)}
          </span>
          <span className="mt-1.5 flex items-center gap-2 font-[family-name:var(--font-brand)] text-[15px] font-bold leading-[1.3] text-[var(--fg-1)]">
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand)]">
              {prevCode}
            </span>
            <span className="truncate">{prevTitle}</span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {nextCode ? (
        <Link
          href={buildHref(nextCode)}
          className="group flex min-h-[88px] flex-col items-end justify-center rounded-lg border border-border bg-[var(--bg)] px-5 py-4 text-right outline-ring/50 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
        >
          <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
            {nextLabel(nextKind)}
            <ArrowRight size={14} className="flex-none text-[var(--fg-3)] transition-colors group-hover:text-[var(--brand)]" />
          </span>
          <span className="mt-1.5 flex items-center justify-end gap-2 font-[family-name:var(--font-brand)] text-[15px] font-bold leading-[1.3] text-[var(--fg-1)]">
            <span className="truncate">{nextTitle}</span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand)]">
              {nextCode}
            </span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}

export default SubSessionNav;

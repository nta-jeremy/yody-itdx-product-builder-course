"use client";

/**
 * PreReadBanner — Client Component for course-detail pages.
 *
 * Reads `localStorage.getItem("preReadPassed.${code}")` after hydration
 * (SSR cannot see localStorage → returns `null` on server render to avoid
 * hydration mismatch). Three states:
 *   1. Pre-mount (`passed === null`) → render nothing
 *   2. Passed → green confirmation banner, no CTA
 *   3. Not passed → brand-coloured CTA linking to `/learn/[code]/preread`
 *
 * The pass key is set by `PreReadQuiz` after a successful submit. localStorage
 * is per-browser and can be bypassed manually — Phase 5 MVP. Mentor checks
 * pre-read via observation in the live session.
 */

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

export interface PreReadBannerProps {
  code: string;
  totalMinutes: number;
}

function storageKey(code: string): string {
  return `preReadPassed.${code}`;
}

/**
 * Subscribe to localStorage pass status. Returns:
 *   - `true`/`false` on the client (after hydration),
 *   - `null` on the server (no localStorage → no flicker).
 *
 * Uses `useSyncExternalStore` to read localStorage without causing the
 * cascading-render warning that `useState + useEffect(setState)` would.
 */
function usePreReadPassed(code: string): boolean | null {
  const key = storageKey(code);
  return useSyncExternalStore(
    () => () => {},
    () =>
      typeof window === "undefined"
        ? null
        : localStorage.getItem(key) === "true",
    () => null,
  );
}

export function PreReadBanner({ code, totalMinutes }: PreReadBannerProps) {
  const passed = usePreReadPassed(code);

  if (passed === null) return null;

  if (passed) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-[var(--success)] bg-[var(--bg-muted)] px-4 py-3 text-[14px] text-[var(--success)]">
        <CheckCircle2 size={16} aria-hidden="true" />
        Bạn đã hoàn thành pre-read. Sẵn sàng cho buổi live.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border-2 border-[var(--brand)] bg-[var(--bg-muted)] px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3 text-[14px] leading-[1.6] text-[var(--fg-1)]">
        <AlertCircle size={18} aria-hidden="true" className="mt-0.5 flex-none text-[var(--brand)]" />
        <span>
          <strong>Pre-read bắt buộc ({totalMinutes} phút)</strong> trước buổi live.
          Mentor sẽ hỏi quiz ở đầu buổi.
        </span>
      </div>
      <Link
        href={`/learn/${code}/preread`}
        className="inline-flex min-h-[44px] flex-none items-center rounded-lg bg-[var(--brand)] px-5 py-2 text-[13px] font-bold text-white outline-ring/50 transition-colors hover:bg-[var(--brand-light)] hover:shadow-md focus-visible:ring-[3px] active:bg-[var(--brand-deep)]"
      >
        Làm pre-read →
      </Link>
    </div>
  );
}

export default PreReadBanner;

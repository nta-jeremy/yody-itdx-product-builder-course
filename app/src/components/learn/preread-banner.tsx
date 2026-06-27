"use client";

/**
 * PreReadBanner — Client Component for course-detail pages.
 *
 * Reads `localStorage.getItem("preReadPassed.${code}")` after hydration
 * (SSR cannot see localStorage → returns `null` on server render to avoid
 * hydration mismatch). Three states:
 *   1. Pre-mount (`passed === null`) → render nothing
 *   2. Passed → green confirmation banner with attempt history summary
 *      (highest score + most recent attempt) and a "Làm lại quiz" link to
 *      /learn/[code]/preread
 *   3. Not passed → brand-coloured CTA linking to `/learn/[code]/preread`
 *
 * The pass key is set by `PreReadQuiz` after a successful submit. Attempt
 * history (score/total/at per attempt) lives in
 * `preReadHistory.${code}` as a JSON array, also written by `PreReadQuiz`.
 * Both are per-browser and can be bypassed manually — Phase 5 MVP. Mentor
 * checks pre-read via observation in the live session.
 *
 * **Snapshot identity:** `useSyncExternalStore` requires `getSnapshot` to
 * return the same reference when the underlying value hasn't changed.
 * We keep a single shared `LocalState` object per code, and only rebuild
 * it when storage events fire. SSR returns `null` (the `pre-mount` state)
 * so initial client render matches server output.
 */

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import {
  readPreReadHistory,
  type PreReadAttempt,
} from "./preread-quiz";

export interface PreReadBannerProps {
  code: string;
  totalMinutes: number;
}

function passedKey(code: string): string {
  return `preReadPassed.${code}`;
}

interface LocalState {
  /** null = pre-mount (SSR / before first client read). */
  passed: boolean | null;
  attempts: PreReadAttempt[];
}

const PRE_MOUNT: LocalState = { passed: null, attempts: [] };

const snapshotCache = new Map<string, LocalState>();

function isSameAttempts(a: PreReadAttempt[], b: PreReadAttempt[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ea = a[i]!;
    const eb = b[i]!;
    if (ea.score !== eb.score || ea.total !== eb.total || ea.at !== eb.at) {
      return false;
    }
  }
  return true;
}

function buildSnapshot(code: string): LocalState {
  const passed = localStorage.getItem(passedKey(code)) === "true";
  const attempts = readPreReadHistory(code);
  const cached = snapshotCache.get(code);
  if (cached && cached.passed === passed && isSameAttempts(cached.attempts, attempts)) {
    return cached;
  }
  const next: LocalState = { passed, attempts };
  snapshotCache.set(code, next);
  return next;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (
      e.key === null ||
      e.key.startsWith("preReadPassed.") ||
      e.key.startsWith("preReadHistory.")
    ) {
      snapshotCache.clear();
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(code: string): LocalState {
  if (typeof window === "undefined") return PRE_MOUNT;
  return buildSnapshot(code);
}

function getServerSnapshot(): LocalState {
  return PRE_MOUNT;
}

interface AttemptSummary {
  bestScore: number;
  bestTotal: number;
  lastScore: number;
  lastTotal: number;
  attemptCount: number;
}

function summarise(attempts: PreReadAttempt[]): AttemptSummary | null {
  if (attempts.length === 0) return null;
  const last = attempts[attempts.length - 1]!;
  let best = attempts[0]!;
  for (const a of attempts) {
    if (a.score > best.score) best = a;
  }
  return {
    bestScore: best.score,
    bestTotal: best.total,
    lastScore: last.score,
    lastTotal: last.total,
    attemptCount: attempts.length,
  };
}

export function PreReadBanner({ code, totalMinutes }: PreReadBannerProps) {
  const state = useSyncExternalStore(
    subscribe,
    () => getSnapshot(code),
    getServerSnapshot,
  );

  if (state.passed === null) return null;

  if (state.passed) {
    const summary = summarise(state.attempts);
    return (
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border border-[var(--success)] bg-[var(--bg-muted)] px-4 py-3 text-[14px] text-[var(--success)] sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 size={16} aria-hidden="true" />
            Bạn đã hoàn thành pre-read. Sẵn sàng cho buổi live.
          </div>
          {summary ? (
            <div className="text-[12px] font-normal text-[var(--fg-2)]">
              Điểm cao nhất {summary.bestScore}/{summary.bestTotal}
              {summary.attemptCount > 1
                ? ` · Lần cuối ${summary.lastScore}/${summary.lastTotal} · ${summary.attemptCount} lần làm`
                : ""}
            </div>
          ) : null}
        </div>
        <Link
          href={`/learn/${code}/preread`}
          className="inline-flex min-h-[44px] flex-none items-center gap-2 rounded-lg border border-[var(--success)] bg-transparent px-4 py-2 text-[13px] font-bold text-[var(--success)] outline-ring/50 transition-colors hover:bg-[var(--success)] hover:text-white"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Làm lại quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border-2 border-[var(--brand)] bg-[var(--bg-muted)] px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3 text-[14px] leading-[1.6] text-[var(--fg-1)]">
        <AlertCircle
          size={18}
          aria-hidden="true"
          className="mt-0.5 flex-none text-[var(--brand)]"
        />
        <span>
          <strong>Pre-read bắt buộc ({totalMinutes} phút)</strong> trước buổi
          live. Mentor sẽ hỏi quiz ở đầu buổi.
        </span>
      </div>
      <Link
        href={`/learn/${code}/preread`}
        className="inline-flex min-h-[44px] flex-none items-center rounded-lg bg-[var(--brand)] px-5 py-2 text-[13px] font-bold text-white outline-ring/50 transition-colors hover:bg-[var(--brand-light)] hover:shadow-md focus-visible:ring-[3px] active:bg-[var(--brand-deep)]"
      >
        Làm test →
      </Link>
    </div>
  );
}

export default PreReadBanner;
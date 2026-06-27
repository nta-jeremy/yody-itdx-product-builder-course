"use client";

/**
 * PreReadQuiz — Client Component, 4-phase state machine.
 *
 * Phase 1 (intro) → 2 (answering) → 3 (submitting) → 4 (result).
 *
 * **SECURITY (B2.7):** This component NEVER receives the quiz answer key
 * nor per-question explanation strings. Only `{ question, options }` per
 * question. Answers are sent to `/api/preread/[code]/check`, which grades
 * server-side and returns the user's correct count + per-question feedback
 * strings. See plan Phase 5 §Security.
 *
 * **Shuffle:** On each `start()` (or `reset()`) the client calls
 * `/api/preread/[code]/shuffle` to fetch a fresh random ordering of
 * questions and per-question options, along with `questionOrder` and
 * `optionOrders` permutation vectors. Those vectors are sent back to
 * `/check` so the server can map user picks back to the original indices
 * for grading.
 *
 * **History:** Each submitted result is appended to
 * `localStorage.preReadHistory.${code}` so the course banner can display
 * "Điểm cao nhất / Lần cuối" without re-fetching from the server.
 */

import { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronRight, RefreshCw } from "lucide-react";

export type SafeQuestion = {
  question: string;
  options: string[];
};

export interface PreReadQuizProps {
  questions: SafeQuestion[];
  code: string;
}

type Phase = "intro" | "loading" | "answering" | "submitting" | "result";

interface QuizResult {
  correct: number;
  explanations: string[];
}

interface ShuffledPayload {
  questions: SafeQuestion[];
  questionOrder: number[];
  optionOrders: number[][];
}

const PASS_THRESHOLD = 2;

export interface PreReadAttempt {
  score: number;
  total: number;
  at: number;
}

export function preReadHistoryKey(code: string): string {
  return `preReadHistory.${code}`;
}

export function readPreReadHistory(code: string): PreReadAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(preReadHistoryKey(code));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is PreReadAttempt =>
        e !== null &&
        typeof e === "object" &&
        typeof (e as PreReadAttempt).score === "number" &&
        typeof (e as PreReadAttempt).total === "number" &&
        typeof (e as PreReadAttempt).at === "number",
    );
  } catch {
    return [];
  }
}

export function appendPreReadAttempt(
  code: string,
  attempt: PreReadAttempt,
): void {
  const history = readPreReadHistory(code);
  history.push(attempt);
  try {
    localStorage.setItem(preReadHistoryKey(code), JSON.stringify(history));
  } catch {
    // localStorage quota or disabled — ignore; pass flag still written by caller.
  }
}

export function PreReadQuiz({ questions, code }: PreReadQuizProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffled, setShuffled] = useState<ShuffledPayload | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchShuffle = async (): Promise<ShuffledPayload | null> => {
    try {
      const res = await fetch(`/api/preread/${code}/shuffle`, {
        method: "GET",
      });
      if (!res.ok) return null;
      return (await res.json()) as ShuffledPayload;
    } catch {
      return null;
    }
  };

  const start = async () => {
    setLoadError(null);
    setPhase("loading");
    const payload = await fetchShuffle();
    if (!payload) {
      setLoadError("Không tải được câu hỏi. Vui lòng thử lại.");
      setPhase("intro");
      return;
    }
    setShuffled(payload);
    setAnswers(Array(payload.questions.length).fill(-1));
    setCurrentIdx(0);
    setPhase("answering");
  };

  const select = (optionIdx: number) => {
    if (!shuffled) return;
    const next = [...answers];
    next[currentIdx] = optionIdx;
    setAnswers(next);
  };

  const goNext = () => {
    if (!shuffled) return;
    if (currentIdx < shuffled.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      void submit();
    }
  };

  const submit = async () => {
    if (!shuffled) return;
    setPhase("submitting");
    try {
      const res = await fetch(`/api/preread/${code}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          questionOrder: shuffled.questionOrder,
          optionOrders: shuffled.optionOrders,
        }),
      });
      const data = (await res.json()) as QuizResult;
      setResult(data);
      appendPreReadAttempt(code, {
        score: data.correct,
        total: shuffled.questions.length,
        at: Date.now(),
      });
      if (data.correct >= PASS_THRESHOLD) {
        localStorage.setItem(`preReadPassed.${code}`, "true");
      }
    } catch {
      setResult({
        correct: 0,
        explanations: ["Lỗi mạng. Vui lòng thử lại."],
      });
    } finally {
      setPhase("result");
    }
  };

  const retry = async () => {
    await start();
  };

  if (phase === "intro") {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={start}
          className="rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white outline-ring/50 hover:bg-[var(--brand-hover)] min-h-[44px]"
          type="button"
        >
          Bắt đầu làm quiz
        </button>
        {loadError ? (
          <p className="text-[13px] text-[var(--error)]" role="alert">
            {loadError}
          </p>
        ) : null}
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div
        className="flex items-center gap-2 text-[14px] text-[var(--fg-3)]"
        role="status"
        aria-live="polite"
      >
        <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
        Đang chuẩn bị câu hỏi…
      </div>
    );
  }

  if ((phase === "answering" || phase === "submitting") && shuffled) {
    const q = shuffled.questions[currentIdx]!;
    const isLast = currentIdx === shuffled.questions.length - 1;
    return (
      <div>
        <div className="mb-4 flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-[var(--fg-3)]">
          <span>
            Câu {currentIdx + 1} / {shuffled.questions.length}
          </span>
          <span>
            {answers.filter((a) => a !== -1).length} đã trả lời
          </span>
        </div>

        <p className="mb-4 text-[16px] font-medium text-[var(--fg-1)]">
          {q.question}
        </p>

        <div className="mb-6 flex flex-col gap-2">
          {q.options.map((opt, idx) => {
            const selected = answers[currentIdx] === idx;
            return (
              <button
                key={idx}
                onClick={() => select(idx)}
                disabled={phase === "submitting"}
                className={`min-h-[44px] rounded-lg border px-4 py-3 text-left outline-ring/50 transition-colors ${
                  selected
                    ? "border-[var(--brand)] bg-[var(--bg-muted)]"
                    : "border-border hover:border-[var(--border-hover)]"
                }`}
                type="button"
              >
                <span className="mr-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-3)]">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0 || phase === "submitting"}
            className="min-h-[44px] px-3 text-[14px] text-[var(--fg-3)] outline-ring/50 disabled:opacity-50"
            type="button"
          >
            ← Câu trước
          </button>
          <button
            onClick={goNext}
            disabled={answers[currentIdx] === -1 || phase === "submitting"}
            className="min-h-[44px] rounded-lg bg-[var(--brand)] px-5 py-2 font-bold text-white outline-ring/50 hover:bg-[var(--brand-hover)] disabled:opacity-50"
            type="button"
          >
            {isLast ? "Nộp bài" : "Câu tiếp theo"} →
          </button>
        </div>
      </div>
    );
  }

  // phase === "result"
  const passed = result !== null && result.correct >= PASS_THRESHOLD;
  return (
    <div>
      <div
        className={`mb-4 flex items-center gap-3 ${
          passed ? "text-[var(--success)]" : "text-[var(--error)]"
        }`}
      >
        {passed ? <Check size={32} /> : <X size={32} />}
        <div>
          <div className="text-[18px] font-bold">
            {passed ? "Bạn đã pass!" : "Chưa đạt"}
          </div>
          <div className="text-[14px]">
            {result?.correct} / {shuffled?.questions.length ?? questions.length}{" "}
            câu đúng
            {passed
              ? " — đủ điều kiện vào buổi live"
              : ` — cần ≥ ${PASS_THRESHOLD} câu đúng`}
          </div>
        </div>
      </div>

      {result && result.explanations.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-2 text-[14px] font-bold uppercase tracking-wide text-[var(--fg-2)]">
            Giải thích
          </h3>
          <ul className="flex flex-col gap-2">
            {result.explanations.map((expl, idx) => (
              <li key={idx} className="text-[14px] text-[var(--fg-1)]">
                <span className="font-bold">Câu {idx + 1}:</span> {expl}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {passed ? (
          <Link
            href={`/learn/${code}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white outline-ring/50 hover:bg-[var(--brand-hover)]"
          >
            Bắt đầu buổi live <ChevronRight size={16} />
          </Link>
        ) : (
          <button
            onClick={retry}
            className="min-h-[44px] rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white outline-ring/50 hover:bg-[var(--brand-hover)]"
            type="button"
          >
            Làm lại
          </button>
        )}
        <button
          onClick={retry}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 font-bold text-[var(--fg-1)] outline-ring/50 hover:bg-[var(--bg-muted)]"
          type="button"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Làm lại quiz
        </button>
        <Link
          href={`/learn/${code}`}
          className="text-[13px] text-[var(--fg-3)] underline outline-ring/50 hover:text-[var(--fg-1)]"
        >
          Xem tài liệu trước
        </Link>
      </div>
    </div>
  );
}

export default PreReadQuiz;
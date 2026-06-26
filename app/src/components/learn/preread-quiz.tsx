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
 */

import { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronRight } from "lucide-react";

export type SafeQuestion = {
  question: string;
  options: string[];
};

export interface PreReadQuizProps {
  questions: SafeQuestion[];
  code: string;
}

type Phase = "intro" | "answering" | "submitting" | "result";

interface QuizResult {
  correct: number;
  explanations: string[];
}

const PASS_THRESHOLD = 2;

export function PreReadQuiz({ questions, code }: PreReadQuizProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array(questions.length).fill(-1),
  );
  const [result, setResult] = useState<QuizResult | null>(null);

  const start = () => setPhase("answering");

  const select = (optionIdx: number) => {
    const next = [...answers];
    next[currentIdx] = optionIdx;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submit();
    }
  };

  const submit = async () => {
    setPhase("submitting");
    try {
      const res = await fetch(`/api/preread/${code}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = (await res.json()) as QuizResult;
      setResult(data);
      if (data.correct >= PASS_THRESHOLD) {
        localStorage.setItem(`preReadPassed.${code}`, "true");
      }
    } catch {
      setResult({ correct: 0, explanations: ["Lỗi mạng. Vui lòng thử lại."] });
    } finally {
      setPhase("result");
    }
  };

  const reset = () => {
    setPhase("intro");
    setCurrentIdx(0);
    setAnswers(Array(questions.length).fill(-1));
    setResult(null);
  };

  if (phase === "intro") {
    return (
      <button
        onClick={start}
        className="rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white outline-ring/50 hover:bg-[var(--brand-hover)] min-h-[44px]"
        type="button"
      >
        Bắt đầu làm quiz
      </button>
    );
  }

  if (phase === "answering" || phase === "submitting") {
    const q = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;
    return (
      <div>
        <div className="mb-4 flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wide text-[var(--fg-3)]">
          <span>
            Câu {currentIdx + 1} / {questions.length}
          </span>
          <span>{answers.filter((a) => a !== -1).length} đã trả lời</span>
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
            {result?.correct} / {questions.length} câu đúng
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

      {passed ? (
        <Link
          href={`/learn/${code}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white outline-ring/50 hover:bg-[var(--brand-hover)]"
        >
          Bắt đầu buổi live <ChevronRight size={16} />
        </Link>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="min-h-[44px] rounded-lg border border-border px-6 py-3 font-bold outline-ring/50 hover:bg-[var(--bg-muted)]"
            type="button"
          >
            Làm lại
          </button>
          <p className="text-[13px] text-[var(--fg-3)]">
            Hoặc{" "}
            <Link href={`/learn/${code}`} className="underline">
              xem tài liệu trước
            </Link>{" "}
            rồi quay lại.
          </p>
        </div>
      )}
    </div>
  );
}

export default PreReadQuiz;

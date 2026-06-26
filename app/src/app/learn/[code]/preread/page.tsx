/**
 * /learn/[code]/preread — full pre-read UI.
 *
 * Phase 5 brings the route from "TL;DR only" (Phase 4 stub) to the full
 * pre-read experience: breadcrumb, TL;DR, bullets, video, and interactive
 * quiz gate.
 *
 * **SECURITY (B2.7):** `PreReadQuiz` receives ONLY sanitized
 * `{ question, options }`. The answer key and per-question explanations
 * stay server-side — they are stripped before crossing the server→client
 * boundary. The grader lives in the API route at
 * `/api/preread/[code]/check/route.ts`.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPreRead,
  listPreReads,
  isValidSessionCode,
  getLearnerContent,
  type PreReadQuestion,
} from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { PreReadQuiz, type SafeQuestion } from "@/components/learn/preread-quiz";
import { VideoEmbed } from "@/components/learn/video-embed";
import { Breadcrumb } from "@/components/learn/breadcrumb";
import { ReadingProgress } from "@/components/learn/reading-progress";

export async function generateStaticParams() {
  const reads = await listPreReads();
  return reads.map((r) => ({ code: r.code }));
}

export const dynamicParams = false;

type Params = Promise<{ code: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { code } = await params;
  if (!isValidSessionCode(code)) {
    return { title: "Không tìm thấy pre-read" };
  }
  const [preread, session] = await Promise.all([
    getPreRead(code),
    getLearnerContent(code),
  ]);
  return {
    title:
      preread && session
        ? `Pre-read: ${session.title}`
        : `Pre-read: ${code}`,
    description: preread?.summary.tldr || undefined,
  };
}

/** Strip the answer key from questions before crossing into a Client
 *  Component. Only `{ question, options }` survives — the answer key and
 *  per-question feedback stay server-side (API route). */
function sanitizeQuestions(
  questions: readonly PreReadQuestion[],
): SafeQuestion[] {
  return questions.map((q) => ({
    question: q.question,
    options: q.options,
  }));
}

export default async function PreReadPage({
  params,
}: {
  params: Params;
}) {
  const { code } = await params;
  if (!isValidSessionCode(code)) notFound();

  const [preread, session] = await Promise.all([
    getPreRead(code),
    getLearnerContent(code),
  ]);
  if (!preread || !session) notFound();

  const safeQuestions = sanitizeQuestions(preread.questions);

  return (
    <div data-surface="app" className="mx-auto max-w-[688px] px-6 py-10">
      <ReadingProgress />

      <Breadcrumb
        level={session.level}
        levelNum={session.levelNum}
        code={session.code}
      />

      <header className="mb-10 border-b border-border pb-6">
        <div className="font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
          Pre-read · {preread.totalMinutes} phút
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-brand)] text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--fg-1)]">
          {session.title}
        </h1>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 font-[family-name:var(--font-brand)] text-[22px] font-bold text-[var(--fg-1)]">
          TL;DR
        </h2>
        <MarkdownView source={preread.summary.tldr} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-[family-name:var(--font-brand)] text-[22px] font-bold text-[var(--fg-1)]">
          {preread.summary.bullets.length} điểm cốt lõi cần nhớ
        </h2>
        <ul className="flex flex-col gap-2 p-0 list-none">
          {preread.summary.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--brand)] text-[12px] font-bold text-white">
                {idx + 1}
              </span>
              <span className="flex-1 text-[15px] leading-[1.6] text-[var(--fg-1)]">
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {preread.video ? (
        <section className="mb-10">
          <h2 className="mb-4 font-[family-name:var(--font-brand)] text-[22px] font-bold text-[var(--fg-1)]">
            Video · {Math.ceil(preread.video.durationSeconds / 60)} phút
          </h2>
          <VideoEmbed
            url={preread.video.url}
            duration={preread.video.durationSeconds}
          />
        </section>
      ) : null}

      <section className="mb-10 rounded-lg border-2 border-[var(--brand)] bg-[var(--bg-muted)] p-6">
        <h2 className="mb-2 font-[family-name:var(--font-brand)] text-[22px] font-bold text-[var(--fg-1)]">
          Quiz khởi động ({safeQuestions.length} câu)
        </h2>
        <p className="mb-6 text-[14px] text-[var(--fg-2)]">
          Làm quiz để mở khóa buổi live. Bạn cần trả lời đúng tối thiểu 2/3 câu.
        </p>
        <PreReadQuiz questions={safeQuestions} code={code} />
      </section>

      <div className="mt-8 text-center">
        <a
          href={`/learn/${code}`}
          className="text-[14px] text-[var(--fg-3)] hover:text-[var(--fg-1)]"
        >
          ← Quay lại tổng quan buổi học
        </a>
      </div>
    </div>
  );
}

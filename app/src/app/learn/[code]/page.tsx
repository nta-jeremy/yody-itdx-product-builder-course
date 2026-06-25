/**
 * /learn/[code] — reading-first learner view (single-column prose + TOC).
 *
 * Server Component. Mirrors /sessions/[code]/page.tsx's Next 16 shape
 * (`params` Promise, `generateStaticParams`, `dynamicParams=false`,
 * `generateMetadata` async) but renders a single-column reading layout
 * (NOT the mentor side-by-side).
 *
 * Placeholders (Breadcrumb / ReadingTime / PrevNext) are wired by G5;
 * the Toc→TocScrollspy swap and the CourseDrawer mobile sidebar are wired
 * by G4. This phase establishes the route shell only.
 *
 * YODY DS: no emoji, token colors only, Be Vietnam Pro inherits, root
 * carries `data-surface="app"`, tap targets >=44px.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLearnerContent, listLearnerSessions, isValidSessionCode } from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { extractToc } from "@/components/markdown/toc";
import { TocScrollspy } from "@/components/markdown/toc-scrollspy";
import { Sidebar } from "@/components/shell";
import { CourseDrawer } from "@/components/learn/course-drawer";
import { Breadcrumb } from "@/components/learn/breadcrumb";
import { ReadingTime } from "@/components/learn/reading-time";
import { PrevNextNav } from "@/components/learn/prev-next-nav";
import { ReadingProgress } from "@/components/learn/reading-progress";

/** Pre-render all 14 learner session codes at build time. */
export async function generateStaticParams() {
  const sessions = await listLearnerSessions();
  return sessions.map((s) => ({ code: s.code }));
}

/** Strict static export: 404 for any path not in `generateStaticParams`. */
export const dynamicParams = false;

type Params = Promise<{ code: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { code } = await params;
  if (!isValidSessionCode(code)) {
    return { title: "Không tìm thấy buổi học" };
  }
  const content = await getLearnerContent(code);
  return {
    title: content?.title ?? code,
    description: content
      ? `Tài liệu học ${content.code} — ${content.title}.`
      : undefined,
  };
}

export default async function LearnPage({
  params,
}: {
  params: Params;
}) {
  const { code } = await params;
  if (!isValidSessionCode(code)) notFound();
  const content = await getLearnerContent(code);
  if (!content) notFound();

  const sessions = await listLearnerSessions();
  const tocItems = await extractToc(content.markdown);

  return (
    <div
      data-surface="app"
      className="mx-auto flex w-full max-w-[var(--container-max)] items-start"
    >
      <ReadingProgress />
      {/* Desktop sidebar (>=lg) — visible inline; mobile uses the drawer below. */}
      <div className="hidden lg:flex">
        <Sidebar sessions={sessions} activeCode={content.code} linkBase="/learn" />
      </div>

      <main className="min-w-0 flex-1 px-6 py-11 md:px-11">
        {/* Mobile course drawer (<lg) — Sidebar is async Server Component, so
            it is rendered here and passed to the client CourseDrawer as children. */}
        <div className="lg:hidden mb-4">
          <CourseDrawer>
            <Sidebar sessions={sessions} activeCode={content.code} linkBase="/learn" />
          </CourseDrawer>
        </div>

        <Breadcrumb
          level={content.level}
          levelNum={content.levelNum}
          code={content.code}
        />

        {/* Article header — generous breathing room matching the reference's
            clean reading rhythm. Metadata row leads, then a prominent title. */}
        <header className="mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--brand)]">
              {content.code}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
              {content.level}
            </span>
            <span className="text-[var(--border-hover)]">·</span>
            <ReadingTime minutes={content.readingMinutes} />
          </div>
          <h1 className="mt-3 font-[family-name:var(--font-brand)] text-[clamp(28px,3.2vw,40px)] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--fg-1)]">
            {content.title}
          </h1>
        </header>

        {/* Body: single-column prose + TOC (NOT side-by-side).
            The reading column is constrained for comfortable line length;
            the TOC sits to the right on desktop only. */}
        <div className="flex items-start gap-10">
          <div className="min-w-0 flex-1">
            <MarkdownView source={content.markdown} />
          </div>
          <TocScrollspy items={tocItems} className="hidden lg:block" />
        </div>

        <PrevNextNav sessions={sessions} activeCode={content.code} />
      </main>
    </div>
  );
}
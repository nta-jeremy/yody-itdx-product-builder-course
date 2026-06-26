/**
 * /learn/[code] — reading-first learner view (3-column VitePress rhythm).
 *
 * Server Component. Mirrors /sessions/[code]/page.tsx's Next 16 shape
 * (`params` Promise, `generateStaticParams`, `dynamicParams=false`,
 * `generateMetadata` async) but renders a reading layout:
 *   [Sidebar 280px] [prose ~688px] [TOC 200px sticky]
 *
 * The prose column is centred in its flex slot to keep the comfortable
 * line length from the VitePress reference; the TOC sits to the right on
 * desktop only and is hidden on tablet/mobile (where the CourseDrawer
 * takes over as the mobile sidebar).
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
      className="mx-auto flex w-full max-w-[var(--container-max)] items-stretch"
    >
      <ReadingProgress />
      {/* Desktop sidebar (>=lg) — visible inline; mobile uses the drawer below. */}
      <div className="hidden lg:flex">
        <Sidebar sessions={sessions} activeCode={content.code} linkBase="/learn" />
      </div>

      {/* Center+right slot: the prose column is centred within its flex
          slot (max-w 688px) so the comfortable line length holds on wide
          screens; the TOC sits as a sibling on the right (xl+). */}
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 xl:px-14">
        {/* Mobile course drawer (<lg) — Sidebar is async Server Component, so
            it is rendered here and passed to the client CourseDrawer as children. */}
        <div className="lg:hidden mb-4">
          <CourseDrawer>
            <Sidebar sessions={sessions} activeCode={content.code} linkBase="/learn" />
          </CourseDrawer>
        </div>

        <div className="flex items-start gap-10 xl:gap-14">
          {/* Prose column — centred, VitePress 688px reading width. */}
          <div className="mx-auto w-full max-w-[688px] min-w-0">
            <Breadcrumb
              level={content.level}
              levelNum={content.levelNum}
              code={content.code}
            />

            {/* Article header — eyebrow meta row leads, then a prominent
                title with comfortable breathing room. */}
            <header className="mb-10 pb-6 border-b border-border">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                  {content.code}
                </span>
                <span className="text-[var(--border-hover)]">·</span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                  {content.level}
                </span>
                <span className="text-[var(--border-hover)]">·</span>
                <ReadingTime minutes={content.readingMinutes} />
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-brand)] text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--fg-1)]">
                {content.title}
              </h1>
            </header>

            {/* Body: single-column prose. */}
            <MarkdownView source={content.markdown} />

            <PrevNextNav sessions={sessions} activeCode={content.code} />
          </div>

          {/* TOC — sticky outline on the right (xl+). Hidden on smaller
              screens to keep the reading column uncluttered. */}
          <TocScrollspy items={tocItems} className="hidden xl:block" />
        </div>
      </main>
    </div>
  );
}
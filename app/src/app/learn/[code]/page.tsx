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
import Link from "next/link";
import type { Route } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getLearnerContent, listLearnerSessions, isValidSessionCode, getPreRead } from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { extractToc } from "@/components/markdown/toc";
import { TocScrollspy } from "@/components/markdown/toc-scrollspy";
import { Sidebar } from "@/components/shell";
import { CourseDrawer } from "@/components/learn/course-drawer";
import { Breadcrumb } from "@/components/learn/breadcrumb";
import { PreReadBanner } from "@/components/learn/preread-banner";
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

/** Opt into dynamic rendering ONLY for the headers() read (sidebar expand).
 *  Everything else (markdown, TOC, breadcrumb) stays static — see sidebar
 *  fallback in JSX for build-time render. */
export const dynamic = "force-static";

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
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";
  // Pre-read optional (only kits that shipped pre-read files — Phase 6
  // applies template to all 14). Banner hides gracefully when null.
  const preread = await getPreRead(code);

  return (
    <div
      data-surface="app"
      className="mx-auto flex w-full max-w-[var(--container-max)] items-stretch"
    >
      <ReadingProgress />
      {/* Desktop sidebar (>=lg) — visible inline; mobile uses the drawer below.
          Reads `x-pathname` (set by `src/middleware.ts`) so the sidebar can
          auto-expand the parent of an active sub-session. This makes the page
          dynamic (headers() opt-out of SSG), but the page otherwise prerenders
          the same for every request — only the sidebar expand state differs. */}
      <div className="hidden lg:flex">
        <Sidebar sessions={sessions} activeCode={content.code} linkBase="/learn" pathname={pathname} />
      </div>

      {/* Center+right slot: the prose column is centred within its flex
          slot (max-w 688px) so the comfortable line length holds on wide
          screens; the TOC sits as a sibling on the right (xl+). */}
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 xl:px-14">
        {/* Mobile course drawer (<lg) — Sidebar is async Server Component, so
            it is rendered here and passed to the client CourseDrawer as children. */}
        <div className="lg:hidden mb-4">
          <CourseDrawer>
            <Sidebar sessions={sessions} activeCode={content.code} linkBase="/learn" pathname={pathname} />
          </CourseDrawer>
        </div>

        <div className="flex items-stretch gap-10 xl:gap-14">
          {/* Prose column — outer flex-1 reserves the slot so the TOC
              (flex-none, 220px) can sit at `top: 96px` and stick. Inner
              mx-auto keeps the 688px reading width centred in that slot. */}
          <div className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[688px]">
              <Breadcrumb
                level={content.level}
                levelNum={content.levelNum}
                code={content.code}
              />

              {preread ? (
                <PreReadBanner code={code} totalMinutes={preread.totalMinutes} />
              ) : null}

              {/* Sub-session list — visible when the parent kit has been
                  split into multiple `.md` files (Phase 6 applies the split).
                  Backward compat: when subSessions=[] the section is omitted
                  entirely so 14 existing pages render unchanged. */}
              {content.subSessions.length > 0 ? (
                <section className="mb-8 rounded-lg border border-border bg-[var(--bg-muted)] p-5">
                  <h2 className="font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                    Buổi học gồm {content.subSessions.length} buổi phụ
                  </h2>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {content.subSessions.map((sub) => {
                      const shortSub = sub.subCode.replace(`${content.code}.`, "");
                      return (
                        <li key={sub.subCode}>
                          <Link
                            href={`/learn/${content.code}/${shortSub}` as Route}
                            className="group flex min-h-[44px] items-center gap-3 rounded-md px-2 outline-ring/50 transition-colors hover:bg-[var(--bg)] focus-visible:ring-[3px]"
                          >
                            <span className="font-[family-name:var(--font-mono)] text-[12px] font-bold text-[var(--brand)]">
                              {sub.subCode}
                            </span>
                            <span className="font-[family-name:var(--font-body)] text-[14px] text-[var(--fg-1)]">
                              {sub.title}
                            </span>
                            <span className="ml-auto font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                              {sub.readingMinutes}&rsquo; đọc ·{" "}
                              {sub.duration}&rsquo; live
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}

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
                  {content.subSessions.length === 0 && (
                    <>
                      <span className="text-[var(--border-hover)]">·</span>
                      <ReadingTime minutes={content.readingMinutes} />
                    </>
                  )}
                </div>
                <h1 className="mt-4 font-[family-name:var(--font-brand)] text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--fg-1)]">
                  {content.title}
                </h1>
              </header>

              {/* Body: single-column prose. */}
              {content.subSessions.length === 0 ? (
                <MarkdownView source={content.markdown} sessionCode={content.code} />
              ) : (
                <div className="mt-8 rounded-lg border border-dashed border-border p-6 text-center bg-[var(--bg-muted)]">
                  <p className="text-[15px] text-[var(--fg-2)]">
                    Nội dung của buổi học này được chia làm <strong>{content.subSessions.length} buổi phụ</strong>.
                  </p>
                  <p className="mt-2 text-[14px] text-[var(--fg-3)]">
                    Vui lòng chọn một buổi học cụ thể ở danh sách phía trên để bắt đầu học.
                  </p>
                </div>
              )}

              <PrevNextNav sessions={sessions} activeCode={content.code} />
            </div>
          </div>

          {/* TOC — sticky outline on the right (xl+). Hidden on smaller
              screens to keep the reading column uncluttered. */}
          {content.subSessions.length === 0 && (
            <TocScrollspy items={tocItems} className="hidden xl:block" />
          )}
        </div>
      </main>
    </div>
  );
}
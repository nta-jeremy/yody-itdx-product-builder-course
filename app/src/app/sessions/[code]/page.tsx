/**
 * /sessions/[code] — giáo án + cẩm nang giảng SIDE-BY-SIDE + sticky TOC.
 *
 * Next 16 (16.2.9) verified facts from nextjs.org/docs:
 *   - `params` is `Promise<{ code: string }>` — must `await`.
 *   - `generateStaticParams` returns `{ code: string }[]` and pre-renders all
 *     known sessions at build (works without `output: 'export'`; this app uses
 *     default SSG + `generateStaticParams`).
 *   - `generateMetadata` is async, `params` is a Promise.
 *   - `notFound()` from `next/navigation` raises a 404 for unknown codes.
 *
 * Layout: 2-col grid on `lg` (giáo án trái, cẩm nang phải), tab toggle on
 * mobile handled purely by CSS `grid-cols-1` stacking — reading order keeps
 * giáo án first (matches `aria-label`s).
 *
 * YODY DS: no emoji, token colors only, Be Vietnam Pro inherits from app
 * surface, root carries `data-surface="app"`.
 */

import type { Metadata } from "next";
import type { Route } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession, listSessions, isValidSessionCode } from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { Toc } from "@/components/markdown/toc";
import { Sidebar } from "@/components/shell";

/** Pre-render all 14 known session codes at build time. */
export async function generateStaticParams() {
  const sessions = await listSessions();
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
  const session = await getSession(code);
  return {
    title: session?.title ?? code,
    description: session
      ? `Giáo án + cẩm nang giảng cho buổi ${session.code} — ${session.title}.`
      : undefined,
  };
}

export default async function SessionPage({
  params,
}: {
  params: Params;
}) {
  const { code } = await params;
  if (!isValidSessionCode(code)) notFound();
  const session = await getSession(code);
  if (!session) notFound();

  const sessions = await listSessions();

  return (
    <div data-surface="app" className="mx-auto flex w-full max-w-[var(--container-max)] items-start">
      <Sidebar activeCode={session.code} sessions={sessions} />

      <main className="flex-1 px-6 py-11 md:px-11">
        {/* Session header */}
        <header className="mb-8 border-b border-border pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--brand)]">
              {session.code}
            </span>
            {session.level && (
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                {session.level}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-[family-name:var(--font-brand)] text-[clamp(26px,3vw,36px)] font-bold leading-[1.15] text-[var(--fg-1)]">
            {session.title}
          </h1>
          {session.gateRole && (
            <p className="mt-2 font-[family-name:var(--font-body)] text-[14px] text-[var(--fg-3)]">
              Gate role: {session.gateRole}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/sessions/${session.code}/print` as Route}
              className="inline-flex min-h-[40px] items-center rounded-full border border-border px-4 text-sm font-medium text-[var(--fg-1)] outline-ring/50 transition-colors hover:bg-[var(--bg-muted)] focus-visible:ring-[3px]"
            >
              Bản in
            </Link>
            {(session.version || session.date) && (
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-3)]">
                {session.version && `v${session.version}`}
                {session.version && session.date ? " · " : ""}
                {session.date}
              </span>
            )}
          </div>
        </header>

        {/* Body: side-by-side giáo án + cẩm nang, with sticky TOC */}
        <div className="flex items-start gap-8">
          {/* Main two-column content */}
          <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
            <section aria-label="Giáo án" className="min-w-0">
              <h2 className="mb-3 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
                Giáo án
              </h2>
              {session.sessionMarkdown ? (
                <MarkdownView source={session.sessionMarkdown} sessionCode={session.code} />
              ) : (
                <EmptySource label="Giáo án đang chờ cập nhật." />
              )}
            </section>

            <section aria-label="Cẩm nang giảng" className="min-w-0">
              <h2 className="mb-3 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
                Cẩm nang giảng
              </h2>
              {session.kitMarkdown ? (
                <MarkdownView source={session.kitMarkdown} sessionCode={session.code} />
              ) : (
                <EmptySource label="Chưa có cẩm nang giảng cho buổi này." />
              )}
            </section>
          </div>

          {/* TOC sticky aside — based on giáo án headings */}
          <Toc source={session.sessionMarkdown} />
        </div>
      </main>
    </div>
  );
}

function EmptySource({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-[var(--bg-2)] px-5 py-8 text-center font-[family-name:var(--font-body)] text-sm text-[var(--fg-3)]">
      {label}
    </div>
  );
}
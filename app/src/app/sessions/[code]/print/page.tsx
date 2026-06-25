/**
 * /sessions/[code]/print — print-ready view of giáo án + cẩm nang.
 *
 * No sidebar, no site nav (toolbar hidden via `print:hidden`); same content
 * as the session page but stacked vertically for paper flow. Print CSS in
 * ./print.css handles page-break hygiene.
 *
 * Next 16: `params` is a Promise; `generateStaticParams` mirrors the parent
 * route (so each session's print page is also pre-rendered).
 */

import type { Metadata } from "next";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getSession, listSessions, isValidSessionCode } from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { PrintLayout } from "@/components/shell";
import "./print.css";

export async function generateStaticParams() {
  const sessions = await listSessions();
  return sessions.map((s) => ({ code: s.code }));
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
    return { title: "Không tìm thấy buổi học" };
  }
  const session = await getSession(code);
  return {
    title: session ? `${session.code} · ${session.title} (bản in)` : code,
  };
}

export default async function SessionPrintPage({
  params,
}: {
  params: Params;
}) {
  const { code } = await params;
  if (!isValidSessionCode(code)) notFound();
  const session = await getSession(code);
  if (!session) notFound();

  return (
    <PrintLayout title={`${session.code} — ${session.title}`} backHref={`/sessions/${session.code}` as Route}>
      <article className="flex flex-col gap-10">
        <header>
          <h1 className="font-[family-name:var(--font-brand)] text-[28px] font-bold leading-[1.2] text-[var(--fg-1)]">
            {session.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-3 font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-3)]">
            <span>{session.code}</span>
            {session.level && <span>· {session.level}</span>}
            {session.version && <span>· v{session.version}</span>}
            {session.date && <span>· {session.date}</span>}
          </div>
          {session.gateRole && (
            <p className="mt-3 font-[family-name:var(--font-body)] text-[14px] text-[var(--fg-2)]">
              Gate role: {session.gateRole}
            </p>
          )}
        </header>

        <section aria-label="Giáo án">
          <h2 className="mb-4 border-b border-border pb-2 font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
            Giáo án
          </h2>
          {session.sessionMarkdown ? (
            <MarkdownView source={session.sessionMarkdown} />
          ) : (
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--fg-3)]">
              Giáo án đang chờ cập nhật.
            </p>
          )}
        </section>

        <section aria-label="Cẩm nang giảng" className="break-before-page">
          <h2 className="mb-4 border-b border-border pb-2 font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--fg-3)]">
            Cẩm nang giảng
          </h2>
          {session.kitMarkdown ? (
            <MarkdownView source={session.kitMarkdown} />
          ) : (
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--fg-3)]">
              Chưa có cẩm nang giảng cho buổi này.
            </p>
          )}
        </section>
      </article>
    </PrintLayout>
  );
}
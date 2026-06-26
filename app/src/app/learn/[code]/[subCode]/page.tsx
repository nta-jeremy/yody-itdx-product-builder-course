/**
 * /learn/[code]/[subCode] — sub-session view.
 *
 * Phase 2 minimal: title + markdown body + sidebar. Phase 3 adds
 * SubBreadcrumb (4-level path) and SubSessionNav (prev/next cards).
 *
 * Server Component. Next.js 16 conventions: `params` is a Promise,
 * `generateStaticParams` prerenders, `dynamicParams=false` makes unknown
 * paths 404 at build time.
 *
 * `subCode` segment is the SHORT form: e.g. for "I4.2.1" the route is
 * `/learn/I4.2/1`. We re-join as `${code}.${subCode}` before lookup.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSubLearnerContent,
  listSubLearnerContent,
  isValidSubSessionCode,
  isValidSessionCode,
} from "@/lib/content";
import { listLearnerSessions } from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { Sidebar } from "@/components/shell";

/**
 * Pre-render all sub-session short forms at build time.
 * `subCode` segment is the trailing digit only (e.g. "1" for "I4.2.1").
 */
export async function generateStaticParams() {
  const subs = await listSubLearnerContent();
  return subs.map((s) => ({
    code: s.parentCode,
    subCode: s.subCode.replace(`${s.parentCode}.`, ""),
  }));
}

/** Strict static export: 404 for any path not in `generateStaticParams`. */
export const dynamicParams = false;

type Params = Promise<{ code: string; subCode: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { code, subCode } = await params;
  const fullSubCode = `${code}.${subCode}`;
  if (!isValidSubSessionCode(fullSubCode)) {
    return { title: "Không tìm thấy buổi phụ" };
  }
  const content = await getSubLearnerContent(fullSubCode);
  return {
    title: content?.title ?? fullSubCode,
    description: content
      ? `Buổi phụ ${content.subCode} — ${content.title}.`
      : undefined,
  };
}

export default async function SubLearnPage({
  params,
}: {
  params: Params;
}) {
  const { code, subCode } = await params;
  if (!isValidSessionCode(code)) notFound();
  const fullSubCode = `${code}.${subCode}`;
  if (!isValidSubSessionCode(fullSubCode)) notFound();
  const content = await getSubLearnerContent(fullSubCode);
  if (!content) notFound();

  const sessions = await listLearnerSessions();

  return (
    <div
      data-surface="app"
      className="mx-auto flex w-full max-w-[var(--container-max)] items-stretch"
    >
      <div className="hidden lg:flex">
        <Sidebar sessions={sessions} activeCode={content.subCode} linkBase="/learn" />
      </div>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 xl:px-14">
        <div className="mx-auto w-full max-w-[688px] min-w-0">
          <header className="mb-10 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                {content.subCode}
              </span>
              <span className="text-[var(--border-hover)]">·</span>
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                {content.level}
              </span>
              <span className="text-[var(--border-hover)]">·</span>
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fg-3)]">
                {content.position}/{content.totalInParent} · {content.duration}&rsquo;
              </span>
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-brand)] text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--fg-1)]">
              {content.title}
            </h1>
          </header>

          <MarkdownView source={content.markdown} />
        </div>
      </main>
    </div>
  );
}

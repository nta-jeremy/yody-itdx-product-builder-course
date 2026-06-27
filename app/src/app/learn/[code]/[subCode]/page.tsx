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
import { headers } from "next/headers";
import {
  getSubLearnerContent,
  listSubLearnerContent,
  isValidSubSessionCode,
  isValidSessionCode,
  getLearnerContent,
} from "@/lib/content";
import { listLearnerSessions } from "@/lib/content";
import { MarkdownView } from "@/components/markdown/markdown";
import { Sidebar } from "@/components/shell";
import { SubBreadcrumb } from "@/components/learn/sub-breadcrumb";
import { SubSessionNav } from "@/components/learn/sub-session-nav";

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

/** Opt into dynamic rendering ONLY for the headers() read (sidebar expand).
 *  Everything else (markdown, breadcrumb, nav) stays static — see sidebar
 *  fallback in JSX for build-time render. */
export const dynamic = "force-static";

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
  const parent = await getLearnerContent(content.parentCode);
  const parentTitle = parent?.title ?? content.parentCode;
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";
  const prevSibling = content.navigation.prevCode
    ? await getSubLearnerContent(content.navigation.prevCode)
    : null;
  const nextSibling = content.navigation.nextCode
    ? await getSubLearnerContent(content.navigation.nextCode)
    : null;
  const prevTitle = prevSibling?.title ?? content.navigation.prevCode ?? "";
  const nextTitle = nextSibling?.title ?? content.navigation.nextCode ?? "";

  return (
    <div
      data-surface="app"
      className="mx-auto flex w-full max-w-[var(--container-max)] items-stretch"
    >
      <div className="hidden lg:flex">
        <Sidebar sessions={sessions} activeCode={content.subCode} activeSubCode={content.subCode} linkBase="/learn" pathname={pathname} />
      </div>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 xl:px-14">
        <div className="mx-auto w-full max-w-[688px] min-w-0">
          <SubBreadcrumb
            level={content.level}
            levelNum={content.levelNum}
            parentCode={content.parentCode}
            parentTitle={parentTitle}
            subCode={content.subCode}
            subTitle={content.title}
          />

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

          <SubSessionNav
            prevCode={content.navigation.prevCode}
            prevTitle={prevTitle}
            prevKind={content.navigation.prevKind}
            nextCode={content.navigation.nextCode}
            nextTitle={nextTitle}
            nextKind={content.navigation.nextKind}
          />
        </div>
      </main>
    </div>
  );
}

/**
 * Toc — Server Component extracting H2/H3 headings for an in-page table of
 * contents. Renders a sticky aside.
 *
 * Headings are parsed from the raw markdown with `remark-parse` (already a
 * transitive dep of react-markdown) so code-fenced `##` lines inside ``` are
 * NOT mistaken for real headings. The slug assigned here MUST match the slug
 * that `rehype-slug` produces in `markdown.tsx` so anchor links resolve.
 * `rehype-slug` uses github-slugger semantics; we replicate with the same
 * package (already a transitive dep of rehype-slug).
 *
 * YODY DS: token colors only, no emoji, Be Vietnam Pro inherits from the
 * app surface. Root aside carries `data-surface="app"`.
 */

import * as React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Heading, PhrasingContent } from "mdast";
import GithubSlugger from "github-slugger";
import { cn } from "@/lib/utils";

export interface TocItem {
  /** Heading level: 2 or 3. */
  level: 2 | 3;
  /** Anchor id (matches rehype-slug output). */
  id: string;
  /** Plain-text heading content. */
  text: string;
}

export interface TocProps {
  /** Raw markdown source to extract headings from. */
  source: string;
  /** Max heading depth to include. Default 3 (H2 + H3). */
  maxDepth?: 2 | 3;
  /** Extra className for the aside. */
  className?: string;
}

/**
 * Extract plain text from an mdast heading's children (phrasing nodes).
 */
function headingText(children: PhrasingContent[]): string {
  return children
    .map((node) => {
      if (node.type === "text") return node.value;
      if ("children" in node && Array.isArray(node.children)) {
        return headingText(node.children as PhrasingContent[]);
      }
      if ("value" in node && typeof node.value === "string") return node.value;
      return "";
    })
    .join("");
}

/**
 * Parse markdown and return H2/H3 (or up to `maxDepth`) heading items with
 * slug ids matching rehype-slug. Empty array if no headings or parse fails.
 */
export async function extractToc(source: string, maxDepth: 2 | 3 = 3): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).parse(source);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  for (const node of tree.children) {
    if (node.type !== "heading") continue;
    const heading = node as Heading;
    if (heading.depth < 2 || heading.depth > maxDepth) continue;
    const text = headingText(heading.children).trim();
    if (!text) continue;
    // github-slugger is stateful — repeated headings get -1, -2 suffixes,
    // matching rehype-slug exactly.
    const id = slugger.slug(text);
    items.push({ level: heading.depth as 2 | 3, id, text });
  }

  return items;
}

/**
 * Sticky table-of-contents aside. Renders nothing if there are fewer than 2
 * H2/H3 headings (no value in a TOC for a short doc).
 */
export async function Toc({ source, maxDepth = 3, className }: TocProps) {
  const items = await extractToc(source, maxDepth);

  if (items.length < 2) return null;

  return (
    <aside
      data-surface="app"
      className={cn(
        "yody-toc",
        "sticky top-[var(--toc-offset,73px)]",
        "max-h-[calc(100vh-var(--toc-offset,73px))]",
        "w-[var(--toc-width,200px)] flex-none overflow-auto",
        "px-[var(--s-5)] py-[var(--s-10)]",
        className,
      )}
      aria-label="Mục lục"
    >
      <div className="yody-toc-label mb-[var(--s-3)] font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-fg-3">
        Trên trang
      </div>
      <nav className="flex flex-col gap-[2px]">
        <ul className="m-0 list-none p-0">
          {items.map((item, idx) => (
            <li
              key={`${item.id}-${idx}`}
              className={cn(
                "yody-toc-item",
                item.level === 3 && "pl-[var(--s-4)]",
              )}
            >
              <a
                href={`#${item.id}`}
                className={cn(
                  "yody-toc-link block border-l-2 border-transparent py-[5px] pl-[var(--s-3)]",
                  "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] no-underline",
                  "text-fg-2 hover:text-iris-deep hover:border-iris",
                  item.level === 3 && "text-[12px]",
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Toc;
/**
 * Markdown — Server Component rendering GFM markdown with YODY DS prose.
 *
 * Uses react-markdown@10 (synchronous `Markdown` component — RSC-safe, no
 * async plugins) + remark-gfm (tables, task lists, strikethrough, autolinks)
 * + rehype-slug (id attributes on headings) + rehype-autolink-headings
 * (anchor links for TOC). Per plan decision #5: react-markdown, NOT
 * next-mdx-remote.
 *
 * YODY DS compliance:
 *  - No emoji anywhere (markdown source is trusted docs/idea, already clean).
 *  - Token colors only — no raw hex. All styling via the `yody-prose` class
 *    (prose.css) which references CSS variables from colors_and_type.css.
 *  - Be Vietnam Pro inherits from the app surface (body font var).
 *  - Root container carries `data-surface="app"`.
 *
 * This is a Server Component — no "use client". It renders to static HTML at
 * build time, which is what `output: 'export'` requires.
 */

import * as React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { cn } from "@/lib/utils";
import "./prose.css";

export interface MarkdownViewProps {
  /** Raw markdown source. */
  source: string;
  /** Extra className for the article wrapper (in addition to `yody-prose`). */
  className?: string;
}

/**
 * Render a markdown string as YODY-styled prose.
 *
 * Heading ids are added by rehype-slug (slugified from heading text) and
 * anchor links by rehype-autolink-headings — both feed the `Toc` component,
 * which extracts the same headings.
 */
export function MarkdownView({ source, className }: MarkdownViewProps) {
  return (
    <div data-surface="app" className={cn("yody-prose", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          // Anchor links: wrap heading text in an <a> with aria-hidden + a
          // visible "#" on hover. class hooks prose.css for styling.
          [rehypeAutolinkHeadings, {
            behavior: "wrap",
            properties: {
              className: "yody-anchor",
              ariaHidden: true,
              tabIndex: -1,
            },
          }],
        ]}
        components={{
          // Map headings to carry the YODY prose heading class so prose.css
          // can target them without relying on bare tag selectors.
          h1: ({ children, ...props }) => (
            <h1 className="yody-h1" {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="yody-h2" {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="yody-h3" {...props}>{children}</h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="yody-h4" {...props}>{children}</h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="yody-h5" {...props}>{children}</h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="yody-h6" {...props}>{children}</h6>
          ),
          p: ({ children, ...props }) => (
            <p className="yody-p" {...props}>{children}</p>
          ),
          a: ({ children, ...props }) => (
            <a className="yody-link" {...props}>{children}</a>
          ),
          ul: ({ children, ...props }) => (
            <ul className="yody-ul" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="yody-ol" {...props}>{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li className="yody-li" {...props}>{children}</li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="yody-quote" {...props}>{children}</blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="yody-table-wrap">
              <table className="yody-table" {...props}>{children}</table>
            </div>
          ),
          code: ({ children, className, ...props }) => {
            // Inline vs block: react-markdown gives `code` a `language-*`
            // className only inside fenced blocks; inline code has none.
            const isBlock = typeof className === "string" && /language-/.test(className);
            if (isBlock) {
              return (
                <code className={cn("yody-code-block", className)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="yody-code-inline" {...props}>{children}</code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="yody-pre" {...props}>{children}</pre>
          ),
          hr: (props) => <hr className="yody-hr" {...props} />,
          strong: ({ children, ...props }) => (
            <strong className="yody-strong" {...props}>{children}</strong>
          ),
          em: ({ children, ...props }) => (
            <em className="yody-em" {...props}>{children}</em>
          ),
          img: ({ alt, src, ...props }) => {
            // Static export: next/image default loader needs a server, so
            // raw <img> is correct here. The markdown source is trusted.
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="yody-img" alt={alt ?? ""} src={src ?? ""} {...props} />
            );
          },
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}

export default MarkdownView;
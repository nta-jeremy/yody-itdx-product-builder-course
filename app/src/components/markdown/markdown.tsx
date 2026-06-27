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
 *  - No emoji anywhere (markdown source is trusted content/idea, already clean).
 *  - Token colors only — no raw hex. All styling via the `yody-prose` class
 *    (prose.css) which references CSS variables from colors_and_type.css.
 *  - Be Vietnam Pro inherits from the app surface (body font var).
 *  - Root container carries `data-surface="app"`.
 *
 * This is a Server Component — no "use client". It renders to static HTML at
 * build time (default SSG — `output` is not set in next.config.ts).
 */

import * as React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { cn } from "@/lib/utils";
import { CodeCopyButton } from "./code-copy-button";
import {
  remarkImagePlaceholder,
  REHYPE_IMAGE_PLACEHOLDER_TAG,
} from "./remark-image-placeholder";
import { EmptyImage } from "./empty-image";
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

/** Component map for react-markdown@10. The `image-placeholder` entry
 *  (custom hast element produced by `remark-image-placeholder` via
 *  `data.hName` stamping) is accepted because the intrinsic is
 *  declared in ./jsx.d.ts. */
const markdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="yody-h1" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="yody-h2" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="yody-h3" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="yody-h4" {...props}>{children}</h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="yody-h5" {...props}>{children}</h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="yody-h6" {...props}>{children}</h6>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="yody-p" {...props}>{children}</p>
  ),
  a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="yody-link" {...props}>{children}</a>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="yody-ul" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="yody-ol" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="yody-li" {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="yody-quote" {...props}>{children}</blockquote>
  ),
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="yody-table-wrap">
      <table className="yody-table" {...props}>{children}</table>
    </div>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
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
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // Extract the fenced-block language + raw code text from the
    // child <code> element. react-markdown v10 (no syntax highlight)
    // renders the code block's children as a plain string.
    const child = React.Children.toArray(children)[0];
    const codeEl = React.isValidElement(child)
      ? (child as React.ReactElement<{ className?: string; children?: unknown }>)
      : null;
    const codeClassName = codeEl?.props?.className ?? "";
    const lang = codeClassName.match(/language-(\w+)/)?.[1] ?? "";
    const codeText =
      typeof codeEl?.props?.children === "string"
        ? codeEl.props.children
        : "";
    return (
      <div className="yody-code-wrap">
        {lang && <span className="yody-lang-label">{lang}</span>}
        {codeText && <CodeCopyButton code={codeText} />}
        <pre className="yody-pre" {...props}>
          {children}
        </pre>
      </div>
    );
  },
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="yody-hr" {...props} />,
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="yody-strong" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="yody-em" {...props}>{children}</em>
  ),
  img: ({ alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Static export: next/image default loader needs a server, so
    // raw <img> is correct here. The markdown source is trusted.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="yody-img" alt={alt ?? ""} src={src ?? ""} {...props} />
    );
  },
  // Map `<image-placeholder data-prompt="…">` hast element (produced by
  // `remark-image-placeholder` stamping `data.hName` so `remark-rehype`
  // emits our custom tag instead of stripping the comment) to the
  // EmptyImage component. The intrinsic tag is declared in ./jsx.d.ts
  // so react-markdown@10's `Components` type accepts it without casts.
  [REHYPE_IMAGE_PLACEHOLDER_TAG]: ({
    "data-prompt": dataPrompt,
  }: {
    "data-prompt"?: string;
  }) => <EmptyImage prompt={dataPrompt ?? ""} />,
};

export function MarkdownView({ source, className }: MarkdownViewProps) {
  return (
    <div data-surface="app" className={cn("yody-prose", className)}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkImagePlaceholder]}
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
        components={markdownComponents}
      >
        {source}
      </Markdown>
    </div>
  );
}

export default MarkdownView;
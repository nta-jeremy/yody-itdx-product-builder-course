/**
 * remark-image-placeholder — scan mdast for HTML `html` nodes that are
 * comments matching `<!-- CẦN HÌNH: <prompt> -->` and replace each with
 * a synthetic mdast node carrying `data.hName` so `remark-rehype`
 * emits a hast element with the chosen tag (instead of dropping the
 * node — `remark-rehype` strips comments at the mdast→hast boundary
 * by default).
 *
 * Why this approach: react-markdown@10 uses `remark-rehype` which
 * STRIPS HTML comments entirely (the previous rehype-side walker never
 * saw anything because the boundary drops them). We must intercept
 * BEFORE `remark-rehype` runs. Using `data.hName` is the standard
 * unified escape hatch: `remark-rehype` reads `node.data.hName` and
 * emits a hast `element` with that tag instead of a `raw` node.
 *
 * Other HTML comments (without `CẦN HÌNH:` prefix) pass through.
 */
import type { Root, Html, Data } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const MARKER_RE = /^<!--\s*CẦN HÌNH:\s*([\s\S]*?)\s*-->/;

export const REHYPE_IMAGE_PLACEHOLDER_TAG = "image-placeholder";

interface PlaceholderData extends Data {
  hName: string;
  hProperties: { "data-prompt": string };
}

export const remarkImagePlaceholder: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "html", (node: Html) => {
      const match = node.value.match(MARKER_RE);
      if (!match) return;
      // Re-purpose the existing mdast node into a placeholder. We keep
      // `type: "html"` so the parser doesn't reject the modification,
      // and stamp `data.hName` so `remark-rehype` emits our custom
      // hast tag.
      const data: Partial<PlaceholderData> = {
        ...node.data,
        hName: REHYPE_IMAGE_PLACEHOLDER_TAG,
        hProperties: { "data-prompt": match[1].trim() },
      };
      Object.assign(node, { data });
    });
  };
};

export default remarkImagePlaceholder;

/**
 * remark-image-placeholder — match `[IMAGE-INSIGHT]` marker used in content.
 *
 * Detects the placeholder pattern wherever it appears:
 *
 *   > **[IMAGE-INSIGHT]** Minh họa ...
 *     **[IMAGE-INSIGHT]** Minh họa ...        ← archive files
 *
 * The marker is a `strong` node containing exactly `[IMAGE-INSIGHT]`. Optional
 * leading text (emoji, whitespace) is allowed inside the same paragraph.
 * No emoji prefix required, no HTML comment format.
 *
 * On match, the node is replaced with a synthetic html node that stamps
 * `data.hName = "image-placeholder"` and `data.hProperties = { "data-prompt": ... }`.
 * `remark-rehype` reads `data.hName` and emits a hast `element` with that
 * tag instead of dropping the node, which is how `react-markdown` finds the
 * custom `image-placeholder` component in `markdown.tsx`.
 *
 * Anything else passes through unchanged.
 */
import type { Root, Blockquote, Paragraph, PhrasingContent } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const REHYPE_IMAGE_PLACEHOLDER_TAG = "image-placeholder";
const MARKER = "[IMAGE-INSIGHT]";

function findMarkerIndex(children: PhrasingContent[]): number {
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type === "strong") {
      const c = node.children;
      if (
        c.length === 1 &&
        c[0].type === "text" &&
        c[0].value.trim() === MARKER
      ) {
        return i;
      }
    }
  }
  return -1;
}

function extractPromptAfterMarker(para: Paragraph, markerIdx: number): string {
  let prompt = "";
  for (let i = markerIdx + 1; i < para.children.length; i++) {
    const node = para.children[i];
    if (node.type === "text") {
      prompt += node.value;
    }
  }
  return prompt.trim();
}

function buildPlaceholderNode(prompt: string) {
  return {
    type: "html" as const,
    value: `<!-- placeholder:${prompt} -->`,
    data: {
      hName: REHYPE_IMAGE_PLACEHOLDER_TAG,
      hProperties: { "data-prompt": prompt },
    },
  };
}

export const remarkImagePlaceholder: Plugin<[], Root> = () => {
  return (tree) => {
    // Blockquote: first paragraph contains [IMAGE-INSIGHT] → replace the
    // whole blockquote (any number of following lines like `> *(Prompt: ...)*`
    // are discarded along with it).
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      if (!parent || index === undefined) return;
      const first = node.children[0];
      if (!first || first.type !== "paragraph") return;
      const markerIdx = findMarkerIndex(first.children);
      if (markerIdx === -1) return;
      parent.children[index] = buildPlaceholderNode(
        extractPromptAfterMarker(first, markerIdx),
      );
    });

    // Plain paragraph at root: `[IMAGE-INSIGHT]` as the only marker → replace
    // the paragraph itself (used in archive files where the marker isn't
    // wrapped in a blockquote).
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (!parent || index === undefined) return;
      if (parent.type !== "root") return;
      const markerIdx = findMarkerIndex(node.children);
      if (markerIdx === -1) return;
      parent.children[index] = buildPlaceholderNode(
        extractPromptAfterMarker(node, markerIdx),
      );
    });

    // Strip any other HTML comments/blocks that are NOT our custom image placeholders.
    visit(tree, "html", (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.data?.hName === REHYPE_IMAGE_PLACEHOLDER_TAG) {
        return;
      }
      parent.children.splice(index, 1);
      return [visit.SKIP, index];
    });
  };
};

export default remarkImagePlaceholder;
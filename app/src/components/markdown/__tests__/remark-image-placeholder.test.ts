import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Root } from "mdast";
import { remarkImagePlaceholder } from "../remark-image-placeholder";

interface PlaceholderNode {
  type: "html";
  value: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
}

function runPlugin(src: string): Root {
  const tree = unified().use(remarkParse).parse(src);
  remarkImagePlaceholder()(tree);
  return tree;
}

function placeholders(root: Root): PlaceholderNode[] {
  return root.children.filter(
    (n) =>
      n.type === "html" &&
      (n as PlaceholderNode).data?.hName === "image-placeholder",
  ) as PlaceholderNode[];
}

describe("remark-image-placeholder", () => {
  // ─── Blockquote format (main-content) ───────────────────────────────

  it("replaces blockquote with **[IMAGE-INSIGHT]** marker (single line)", () => {
    const root = runPlugin("> **[IMAGE-INSIGHT]** Một prompt ngắn");
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe(
      "Một prompt ngắn",
    );
  });

  it("replaces blockquote with multi-line prompt + *(Prompt: ...)* metadata", () => {
    const src = [
      "> **[IMAGE-INSIGHT]** Minh họa một nhạc trưởng đứng trước bốn nhạc cụ",
      '> *(Prompt tạo hình: "abc")*',
    ].join("\n");
    const root = runPlugin(src);
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe(
      "Minh họa một nhạc trưởng đứng trước bốn nhạc cụ",
    );
  });

  it("handles blockquote followed by paragraph", () => {
    const src = [
      "Paragraph trước.",
      "",
      "> **[IMAGE-INSIGHT]** Mô tả",
      "",
      "Paragraph sau.",
    ].join("\n");
    const root = runPlugin(src);
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe("Mô tả");
  });

  it("tolerates optional 🖼️ emoji prefix before the marker", () => {
    const root = runPlugin("> 🖼️ **[IMAGE-INSIGHT]** Prompt có emoji");
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe(
      "Prompt có emoji",
    );
  });

  it("does not touch blockquote without [IMAGE-INSIGHT] marker", () => {
    const root = runPlugin("> Đây là blockquote bình thường");
    expect(placeholders(root)).toHaveLength(0);
  });

  // ─── Paragraph format (_archive) ───────────────────────────────────

  it("replaces paragraph with **[IMAGE-INSIGHT]** marker (archive style)", () => {
    const root = runPlugin("**[IMAGE-INSIGHT]** Prompt trong archive");
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe(
      "Prompt trong archive",
    );
  });

  it("tolerates 🖼️ emoji prefix in paragraph marker", () => {
    const root = runPlugin("🖼️ **[IMAGE-INSIGHT]** Có emoji");
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe("Có emoji");
  });

  it("replaces multiple markers in one document", () => {
    const root = runPlugin(
      "**[IMAGE-INSIGHT]** first\n\nmiddle\n\n> **[IMAGE-INSIGHT]** second",
    );
    expect(placeholders(root)).toHaveLength(2);
  });

  it("trims surrounding whitespace from prompt", () => {
    const root = runPlugin("> **[IMAGE-INSIGHT]**   spaced prompt   ");
    expect(placeholders(root)[0]?.data?.hProperties?.["data-prompt"]).toBe(
      "spaced prompt",
    );
  });

  it("does not touch plain text containing the marker", () => {
    const root = runPlugin("paragraph mentioning IMAGE-INSIGHT: inline");
    expect(placeholders(root)).toHaveLength(0);
  });

  it("strips HTML comments that do not contain the [IMAGE-INSIGHT] marker", () => {
    const root = runPlugin("Text before.\n\n<!--\nsome comment\n-->\n\nText after.");
    const htmlNodes = root.children.filter((n) => n.type === "html");
    expect(htmlNodes).toHaveLength(0);
  });
});
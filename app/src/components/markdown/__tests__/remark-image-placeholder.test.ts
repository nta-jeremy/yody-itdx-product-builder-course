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
  it("replaces <!-- CẦN HÌNH: foo --> by stamping hName + hProperties", () => {
    const root = runPlugin("<!-- CẦN HÌNH: foo -->");
    const found = placeholders(root);
    expect(found).toHaveLength(1);
    expect(found[0].data?.hName).toBe("image-placeholder");
    expect(found[0].data?.hProperties?.["data-prompt"]).toBe("foo");
  });

  it("carries prompt text in data-prompt", () => {
    const root = runPlugin("<!-- CẦN HÌNH: mô tả -->");
    const found = placeholders(root);
    expect(found[0]?.data?.hProperties?.["data-prompt"]).toBe("mô tả");
  });

  it("preserves multi-line prompts", () => {
    const root = runPlugin("<!-- CẦN HÌNH: line1\nline2 -->");
    const found = placeholders(root);
    expect(found[0]?.data?.hProperties?.["data-prompt"]).toBe("line1\nline2");
  });

  it("matches marker with no whitespace after <!--", () => {
    const root = runPlugin("<!--CẦN HÌNH: tight-->");
    expect(placeholders(root)).toHaveLength(1);
  });

  it("leaves unrelated HTML comments as plain html nodes", () => {
    const root = runPlugin("<!-- TODO: review this -->");
    const found = placeholders(root);
    expect(found).toHaveLength(0);
    const htmls = root.children.filter((n) => n.type === "html");
    expect(htmls).toHaveLength(1);
    expect((htmls[0] as { value: string }).value).toContain("TODO");
  });

  it("replaces multiple markers in one document", () => {
    const root = runPlugin(
      "<!-- CẦN HÌNH: first -->\n\nmiddle\n\n<!-- CẦN HÌNH: second -->",
    );
    expect(placeholders(root)).toHaveLength(2);
  });

  it("trims surrounding whitespace from prompt", () => {
    const root = runPlugin("<!-- CẦN HÌNH:   spaced prompt   -->");
    expect(placeholders(root)[0]?.data?.hProperties?.["data-prompt"]).toBe(
      "spaced prompt",
    );
  });

  it("does not touch plain text containing the marker", () => {
    const root = runPlugin("CẦN HÌNH: foo bar");
    expect(placeholders(root)).toHaveLength(0);
  });
});

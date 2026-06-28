import { describe, it, expect } from "vitest";

/**
 * @deprecated Diagnostic that drove the plugin re-design — kept as
 * a stub to document why the rehype-side walker was abandoned
 * (`remark-rehype` strips comments at the mdast→hast boundary).
 */
describe("diagnostic-raw (deprecated)", () => {
  it("is deprecated", () => {
    expect(true).toBe(true);
  });
});

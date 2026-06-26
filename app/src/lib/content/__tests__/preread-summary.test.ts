import { describe, it, expect } from "vitest";
import { parseSummary } from "../preread";

describe("parseSummary", () => {
  it("extracts TL;DR from # TL;DR heading", () => {
    const md = "# TL;DR\nĐây là tóm tắt 1 câu.\n\n# Điểm cốt lõi\n- A\n- B";
    const result = parseSummary(md);
    expect(result.tldr).toBe("Đây là tóm tắt 1 câu.");
  });

  it("extracts bullets from - lines", () => {
    const md =
      "# TL;DR\nX\n\n# Điểm cốt lõi\n- Bullet 1\n- Bullet 2\n- Bullet 3";
    const result = parseSummary(md);
    expect(result.bullets).toEqual(["Bullet 1", "Bullet 2", "Bullet 3"]);
  });

  it("handles missing TL;DR gracefully (returns empty)", () => {
    const md = "# Điểm cốt lõi\n- A";
    const result = parseSummary(md);
    expect(result.tldr).toBe("");
    expect(result.bullets).toEqual(["A"]);
  });
});

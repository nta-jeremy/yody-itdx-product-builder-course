import { describe, it, expect, vi } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { getLearnerContent } from "../learner";

vi.mock("node:fs/promises");

describe("getLearnerContent — multi-file main-content support", () => {
  it("returns single file content when only 1 .md exists (backward compat)", async () => {
    vi.mocked(readdir).mockResolvedValue([
      "I1.1-Tai-Lieu-Hoc-AI-Fundamentals.md",
    ] as any);
    vi.mocked(readFile).mockResolvedValue(
      "# I1.1 — AI Fundamentals\n\nContent for I1.1",
    );
    const result = await getLearnerContent("I1.1");
    expect(result).not.toBeNull();
    expect(result?.code).toBe("I1.1");
    expect(result?.markdown).toContain("AI Fundamentals");
    expect(result?.subSessions).toEqual([]);
  });

  it("returns subSessions metadata when multiple .md exist", async () => {
    vi.mocked(readdir).mockResolvedValue([
      "I4.2.1-Kien-Truc-5-Lop.md",
      "I4.2.2-Vibe-Coding-Lab.md",
    ] as any);
    vi.mocked(readFile).mockImplementation(async (path) => {
      if (String(path).includes("I4.2.1"))
        return "# I4.2.1 — Kiến trúc 5 lớp";
      if (String(path).includes("I4.2.2"))
        return "# I4.2.2 — Vibe Coding Lab";
      return "";
    });
    const result = await getLearnerContent("I4.2");
    expect(result?.subSessions).toHaveLength(2);
    expect(result?.subSessions?.[0]?.subCode).toBe("I4.2.1");
    expect(result?.subSessions?.[1]?.subCode).toBe("I4.2.2");
  });

  it("skips _archive/ folder (Phase 6 convention)", async () => {
    vi.mocked(readdir).mockResolvedValue([
      "I4.2.1-Kien-Truc-5-Lop.md",
      "_archive",
      "_archive/I4.2-Tai-Lieu-Hoc-OLD.md",
    ] as any);
    vi.mocked(readFile).mockResolvedValue("# I4.2.1");
    const result = await getLearnerContent("I4.2");
    // Only 1 visible .md file after skip — subSessions stays empty
    // until Phase 2 introduces multi-file split for I4.2.
    expect(result?.subSessions).toEqual([]);
  });

  it("returns null when folder missing (backward compat)", async () => {
    vi.mocked(readdir).mockRejectedValue(new Error("ENOENT"));
    const result = await getLearnerContent("I1.1");
    expect(result).toBeNull();
  });
});

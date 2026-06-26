import { describe, it, expect, vi } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { getLearnerContent, listLearnerSessions } from "../learner";

vi.mock("node:fs/promises");

describe("Backward compat — 14 sessions", () => {
  const cases = [
    {
      code: "I1.1",
      file: "I1.1-Tai-Lieu-Hoc-AI-Fundamentals.md",
      titleIncludes: "AI Fundamentals",
    },
    {
      code: "I4.2",
      file: "I4.2-Tai-Lieu-Hoc-Vien-Technical-Track-Claude-Code.md",
      titleIncludes: "Trách Nhiệm",
    },
    {
      code: "I5.3",
      file: "I5.3-Tai-Lieu-Hoc-Vien-Ship-Bao-Ve-Capstone.md",
      titleIncludes: "Ship",
    },
  ];

  for (const { code, file, titleIncludes } of cases) {
    it(`getLearnerContent("${code}") returns same shape as before`, async () => {
      vi.mocked(readdir).mockResolvedValue([file] as any);
      vi.mocked(readFile).mockResolvedValue(
        `# ${code} — ${titleIncludes}\n\nContent`,
      );
      const result = await getLearnerContent(code);
      expect(result?.code).toBe(code);
      expect(result?.markdown).toContain(titleIncludes);
      expect(result?.subSessions).toEqual([]);
    });
  }

  it("listLearnerSessions returns 14 sessions sorted", async () => {
    vi.mocked(readdir)
      .mockResolvedValueOnce([
        "Teaching-Kit-I1.1",
        "Teaching-Kit-I1.2",
        "Teaching-Kit-I2.1",
        "Teaching-Kit-I2.2",
        "Teaching-Kit-I2.3",
        "Teaching-Kit-I3.1",
        "Teaching-Kit-I3.2",
        "Teaching-Kit-I3.3",
        "Teaching-Kit-I4.1",
        "Teaching-Kit-I4.2",
        "Teaching-Kit-I4.3",
        "Teaching-Kit-I5.1",
        "Teaching-Kit-I5.2",
        "Teaching-Kit-I5.3",
      ] as any)
      .mockResolvedValue(["file.md"] as any);
    vi.mocked(readFile).mockResolvedValue("# Test\nContent");
    const sessions = await listLearnerSessions();
    expect(sessions).toHaveLength(14);
    expect(sessions[0]?.code).toBe("I1.1");
    expect(sessions[13]?.code).toBe("I5.3");
  });
});

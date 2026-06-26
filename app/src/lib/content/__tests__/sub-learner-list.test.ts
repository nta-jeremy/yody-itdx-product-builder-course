import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fsPromises from "node:fs/promises";
import { listSubLearnerContent, _resetSubCaches } from "../sub-learner";

vi.mock("node:fs/promises");

beforeEach(() => {
  _resetSubCaches();
});

describe("listSubLearnerContent", () => {
  it("returns 12 sub-sessions across 6 heavy kits", async () => {
    vi.mocked(fsPromises.readdir)
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
      .mockImplementation(async (dir) => {
        if (String(dir).includes("I2.1"))
          return ["I2.1.1-KT-Prompt.md", "I2.1.2-Lab.md"];
        if (String(dir).includes("I2.3"))
          return ["I2.3.1-Insight.md", "I2.3.2-Spec.md"];
        if (String(dir).includes("I3.1"))
          return ["I3.1.1-Workflow.md", "I3.1.2-Cowork.md"];
        if (String(dir).includes("I4.1"))
          return ["I4.1.1-Canvas.md", "I4.1.2-Iterate.md"];
        if (String(dir).includes("I4.2"))
          return ["I4.2.1-Arch.md", "I4.2.2-Vibe.md"];
        if (String(dir).includes("I5.1"))
          return ["I5.1.1-Overview.md", "I5.1.2-Apply.md"];
        return ["single-file.md"];
      });
    vi.mocked(fsPromises.readFile).mockResolvedValue("# Sub\nContent");

    const subs = await listSubLearnerContent();
    expect(subs).toHaveLength(12);
    expect(subs[0]?.subCode).toBe("I2.1.1");
    expect(subs[1]?.subCode).toBe("I2.1.2");
    expect(subs[11]?.subCode).toBe("I5.1.2");
  });

  it("returns empty when no kits have sub-sessions", async () => {
    vi.mocked(fsPromises.readdir)
      .mockResolvedValueOnce(["Teaching-Kit-I1.1", "Teaching-Kit-I1.2"] as any)
      .mockResolvedValue(["single.md"] as any);
    const subs = await listSubLearnerContent();
    expect(subs).toEqual([]);
  });
});

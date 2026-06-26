import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fsPromises from "node:fs/promises";
import {
  getSubLearnerContent,
  isValidSubSessionCode,
  _resetSubCaches,
} from "../sub-learner";

vi.mock("node:fs/promises");

beforeEach(() => {
  vi.mocked(fsPromises.readdir).mockClear();
  vi.mocked(fsPromises.readFile).mockClear();
  _resetSubCaches();
});

describe("getSubLearnerContent", () => {
  it("returns markdown + metadata for I4.2.1", async () => {
    vi.mocked(fsPromises.readdir).mockResolvedValue([
      "I4.2.1-Kien-Truc-5-Lop.md",
      "I4.2.2-Vibe-Coding-Lab.md",
    ] as any);
    vi.mocked(fsPromises.readFile).mockResolvedValue(
      "# I4.2.1 — Kiến trúc 5 lớp + Trust Layer\n\n## Section 1\nContent...",
    );
    const result = await getSubLearnerContent("I4.2.1");
    expect(result).not.toBeNull();
    expect(result?.subCode).toBe("I4.2.1");
    expect(result?.parentCode).toBe("I4.2");
    expect(result?.title).toBe("Kiến trúc 5 lớp + Trust Layer");
    expect(result?.markdown).toContain("Kiến trúc 5 lớp");
    expect(result?.position).toBe(1);
    expect(result?.totalInParent).toBe(2);
    expect(result?.duration).toBe(90);
    expect(result?.wordCount).toBeGreaterThan(0);
    expect(result?.readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it("returns null when file missing", async () => {
    vi.mocked(fsPromises.readdir).mockResolvedValue([
      "I4.2.2-Vibe-Coding-Lab.md",
    ] as any);
    const result = await getSubLearnerContent("I4.2.1");
    expect(result).toBeNull();
  });

  it("returns null when parent folder missing", async () => {
    vi.mocked(fsPromises.readdir).mockRejectedValue(new Error("ENOENT"));
    const result = await getSubLearnerContent("I4.2.1");
    expect(result).toBeNull();
  });

  it("throws on invalid sub-session code", async () => {
    await expect(getSubLearnerContent("I4.2")).rejects.toThrow();
    await expect(getSubLearnerContent("foo")).rejects.toThrow();
    await expect(getSubLearnerContent("I4.2.10")).rejects.toThrow();
  });
});

describe("isValidSubSessionCode", () => {
  it("accepts valid sub-session codes", () => {
    expect(isValidSubSessionCode("I4.2.1")).toBe(true);
    expect(isValidSubSessionCode("I5.3.3")).toBe(true);
  });
  it("rejects parent-only codes", () => {
    expect(isValidSubSessionCode("I4.2")).toBe(false);
  });
  it("rejects arbitrary strings", () => {
    expect(isValidSubSessionCode("foo.bar")).toBe(false);
  });
});

describe("SubLearnerContent.navigation — prev/next", () => {
  function setupMocks() {
    vi.mocked(fsPromises.readdir).mockReset();
    vi.mocked(fsPromises.readFile).mockReset();
    vi.mocked(fsPromises.readdir).mockImplementation(async (dir) => {
      const s = String(dir);
      // Kit folder level (more specific) — check first
      if (s.includes("Teaching-Kit-I2.1"))
        return ["I2.1.1-KT.md", "I2.1.2-Lab.md"];
      if (s.includes("Teaching-Kit-I2.3"))
        return ["I2.3.1-Insight.md", "I2.3.2-Spec.md"];
      if (s.includes("Teaching-Kit-I5.1"))
        return ["I5.1.1-Overview.md", "I5.1.2-Apply.md"];
      // CONTENT_ROOT level — 14 kit dirs
      if (s.endsWith("Intern-Product-Builder"))
        return [
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
        ];
      return ["single-file.md"];
    });
    vi.mocked(fsPromises.readFile).mockImplementation(async (path) => {
      const s = String(path);
      if (s.includes("I2.1.1")) return "# I2.1.1 — KT Prompt";
      if (s.includes("I2.1.2")) return "# I2.1.2 — Lab";
      if (s.includes("I2.3.1")) return "# I2.3.1 — Insight";
      if (s.includes("I2.3.2")) return "# I2.3.2 — Spec";
      if (s.includes("I5.1.1")) return "# I5.1.1 — Overview";
      if (s.includes("I5.1.2")) return "# I5.1.2 — Apply";
      return "# X";
    });
  }

  it("first sub I2.1.1 → prev=null, next=I2.1.2 (sub)", async () => {
    setupMocks();
    const sub = await getSubLearnerContent("I2.1.1");
    if (!sub) throw new Error("sub is null");
    expect(sub.subCode).toBe("I2.1.1");
    expect(sub.navigation.prevCode).toBeNull();
    expect(sub.navigation.nextCode).toBe("I2.1.2");
    expect(sub.navigation.nextKind).toBe("sub");
  });

  it("I2.1.2 → prev=I2.1.1, next=I2.3.1 (parent transition)", async () => {
    setupMocks();
    const sub = await getSubLearnerContent("I2.1.2");
    if (!sub) throw new Error("sub is null");
    expect(sub.navigation.prevCode).toBe("I2.1.1");
    expect(sub.navigation.prevKind).toBe("sub");
    expect(sub.navigation.nextCode).toBe("I2.3.1");
    expect(sub.navigation.nextKind).toBe("parent");
  });

  it("last sub I5.1.2 → next=null, prev=I5.1.1", async () => {
    setupMocks();
    const sub = await getSubLearnerContent("I5.1.2");
    if (!sub) throw new Error("sub is null");
    expect(sub.navigation.nextCode).toBeNull();
    expect(sub.navigation.prevCode).toBe("I5.1.1");
    expect(sub.navigation.prevKind).toBe("sub");
  });
});

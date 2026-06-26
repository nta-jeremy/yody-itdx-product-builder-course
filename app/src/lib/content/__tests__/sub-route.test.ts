import { describe, it, expect, vi } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { getSubLearnerContent } from "@/lib/content";

vi.mock("node:fs/promises");

describe("Sub-session route input validation", () => {
  it("route param [code]=I4.2, [subCode]=1 → fullSubCode=I4.2.1", async () => {
    vi.mocked(readdir).mockResolvedValue(["I4.2.1-Arch.md"] as any);
    vi.mocked(readFile).mockResolvedValue("# I4.2.1 — Architecture");
    const result = await getSubLearnerContent("I4.2.1");
    expect(result?.parentCode).toBe("I4.2");
    expect(result?.subCode).toBe("I4.2.1");
  });

  it("throws on out-of-range subCode I4.99", async () => {
    await expect(getSubLearnerContent("I4.99")).rejects.toThrow();
  });
});

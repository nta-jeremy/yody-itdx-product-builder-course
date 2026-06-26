import { describe, it, expect } from "vitest";
import type { LearnerContent, SubSessionMeta } from "../learner";

describe("LearnerContent type — subSessions field", () => {
  it("has subSessions field typed as SubSessionMeta[]", () => {
    const fake: LearnerContent = {
      code: "I4.2",
      title: "Xây Dựng AI Feature Có Trách Nhiệm",
      level: "L4 Integrator",
      levelNum: 4,
      markdown: "...",
      wordCount: 100,
      readingMinutes: 1,
      subSessions: [],
    };
    expect(fake.subSessions).toEqual([]);
  });

  it("SubSessionMeta has required fields", () => {
    const sub: SubSessionMeta = {
      subCode: "I4.2.1",
      slug: "Kien-Truc-5-Lop",
      title: "Kiến trúc 5 lớp",
      readingMinutes: 30,
      duration: 90,
    };
    expect(sub.subCode).toBe("I4.2.1");
    expect(sub.duration).toBe(90);
  });
});

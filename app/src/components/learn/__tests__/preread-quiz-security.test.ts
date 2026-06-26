import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Security: correctIndex leak", () => {
  it("PreReadQuiz component source KHÔNG chứa correctIndex field", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/learn/preread-quiz.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/correctIndex/);
  });

  it("PreReadQuiz component source KHÔNG import questions[0].correctIndex", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/learn/preread-quiz.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/\.correctIndex/);
  });

  it("route /learn/[code]/preread/page.tsx KHÔNG pass correctIndex to client", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/learn/[code]/preread/page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/correctIndex/);
  });
});

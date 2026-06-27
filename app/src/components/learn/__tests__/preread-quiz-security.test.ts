import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Strip JSDoc `/** ... *​/` blocks from source so security scans don't
 * false-positive on documentation that describes the invariant.
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("Security: correctIndex leak", () => {
  it("PreReadQuiz component source KHÔNG chứa correctIndex field", () => {
    const source = stripComments(
      readFileSync(
        join(process.cwd(), "src/components/learn/preread-quiz.tsx"),
        "utf8",
      ),
    );
    expect(source).not.toMatch(/correctIndex/);
  });

  it("PreReadQuiz component source KHÔNG import questions[0].correctIndex", () => {
    const source = stripComments(
      readFileSync(
        join(process.cwd(), "src/components/learn/preread-quiz.tsx"),
        "utf8",
      ),
    );
    expect(source).not.toMatch(/\.correctIndex/);
  });

  it("route /learn/[code]/preread/page.tsx KHÔNG pass correctIndex to client", () => {
    const source = stripComments(
      readFileSync(
        join(process.cwd(), "src/app/learn/[code]/preread/page.tsx"),
        "utf8",
      ),
    );
    expect(source).not.toMatch(/correctIndex/);
  });

  it("route /api/preread/[code]/shuffle/route.ts KHÔNG chứa correctIndex trong code", () => {
    const source = stripComments(
      readFileSync(
        join(process.cwd(), "src/app/api/preread/[code]/shuffle/route.ts"),
        "utf8",
      ),
    );
    expect(source).not.toMatch(/correctIndex/);
  });

  it("API route /api/preread/[code]/check KHÔNG serialize correctIndex trong response shape", () => {
    const source = stripComments(
      readFileSync(
        join(process.cwd(), "src/app/api/preread/[code]/check/route.ts"),
        "utf8",
      ),
    );
    const responseLiterals = source.match(/NextResponse\.json\([\s\S]*?\)\)/g) ?? [];
    for (const lit of responseLiterals) {
      expect(lit).not.toMatch(/correctIndex/);
    }
  });
});
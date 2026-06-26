import { describe, it, expect } from "vitest";
import { parseQuestions } from "../preread";

describe("parseQuestions", () => {
  it("parses single question block with 4 options", () => {
    const md = `> [!question]
> **Câu 1:** What?
> - A. Token
> - B. Vector
> - C. Graph
> - D. None
> **Đáp án: A**
> **Giải thích:** LLM predicts token.`;
    const result = parseQuestions(md);
    expect(result).toHaveLength(1);
    expect(result[0]?.question).toBe("What?");
    expect(result[0]?.options).toEqual(["Token", "Vector", "Graph", "None"]);
    expect(result[0]?.correctIndex).toBe(0);
    expect(result[0]?.explanation).toContain("predicts");
  });

  it("parses multiple questions (3 typical)", () => {
    const md = `
> [!question]
> **Câu 1:** A?
> - A. x
> - B. y
> **Đáp án: A**
> **Giải thích:** ...

> [!question]
> **Câu 2:** B?
> - A. x
> - B. y
> **Đáp án: B**
> **Giải thích:** ...
`;
    const result = parseQuestions(md);
    expect(result).toHaveLength(2);
  });

  it("skips malformed question (no answer)", () => {
    const md = `> [!question]
> **Câu 1:** Bad
> - A. x
> - B. y`;
    const result = parseQuestions(md);
    expect(result).toEqual([]);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fsPromises from "node:fs/promises";
import { getPreRead, _resetPreReadCaches } from "../preread";

vi.mock("node:fs/promises");

beforeEach(() => {
  vi.mocked(fsPromises.readdir).mockReset();
  vi.mocked(fsPromises.readFile).mockReset();
  _resetPreReadCaches();
});

describe("getPreRead", () => {
  it("returns PreReadContent for I1.1 (with all 3 files present)", async () => {
    vi.mocked(fsPromises.readdir).mockResolvedValue([
      "I1.1-preread-summary.md",
      "I1.1-preread-video.md",
      "I1.1-preread-qa.md",
    ] as any);
    vi.mocked(fsPromises.readFile).mockImplementation(async (path) => {
      if (String(path).includes("summary")) {
        return "# TL;DR\nAI is prediction.\n\n# Điểm cốt lõi\n- Token\n- Context\n- Temperature\n- Embeddings\n- RAG";
      }
      if (String(path).includes("video")) {
        return "url: https://youtube.com/embed/abc123\nduration: 600";
      }
      if (String(path).includes("qa")) {
        return "> [!question]\n> **Câu 1:** What is LLM?\n> - A. Token predictor\n> **Đáp án: A**\n> **Giải thích:** LLM dự đoán token.";
      }
      return "";
    });
    const result = await getPreRead("I1.1");
    expect(result).not.toBeNull();
    expect(result?.code).toBe("I1.1");
    expect(result?.summary.tldr).toContain("AI is prediction");
    expect(result?.summary.bullets).toHaveLength(5);
    expect(result?.video?.url).toBe("https://youtube.com/embed/abc123");
    expect(result?.video?.durationSeconds).toBe(600);
    expect(result?.questions).toHaveLength(1);
    expect(result?.questions[0]?.correctIndex).toBe(0);
  });

  it("returns null when preread folder missing (backward compat)", async () => {
    vi.mocked(fsPromises.readdir).mockRejectedValue(new Error("ENOENT"));
    const result = await getPreRead("I1.1");
    expect(result).toBeNull();
  });

  it("returns null when 1 of 3 files missing", async () => {
    vi.mocked(fsPromises.readdir).mockResolvedValue([
      "I1.1-preread-summary.md",
    ] as any);
    const result = await getPreRead("I1.1");
    expect(result).toBeNull();
  });
});

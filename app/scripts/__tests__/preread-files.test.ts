import { describe, it, expect, beforeEach } from "vitest";
import { getPreRead, _resetPreReadCaches } from "../../src/lib/content/preread";

describe("14 preread files parse successfully", () => {
  const codes = [
    "I1.1",
    "I1.2",
    "I2.1",
    "I2.2",
    "I2.3",
    "I3.1",
    "I3.2",
    "I3.3",
    "I4.1",
    "I4.2",
    "I4.3",
    "I5.1",
    "I5.2",
    "I5.3",
  ];

  beforeEach(() => {
    _resetPreReadCaches();
  });

  for (const code of codes) {
    it(`${code} → getPreRead returns valid PreReadContent with 3 questions`, async () => {
      const result = await getPreRead(code);
      expect(result).not.toBeNull();
      expect(result?.summary.bullets.length).toBeGreaterThanOrEqual(3);
      expect(result?.summary.bullets.length).toBeLessThanOrEqual(5);
      expect(result?.questions).toHaveLength(3);
      for (const q of result!.questions) {
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
      }
    });
  }
});

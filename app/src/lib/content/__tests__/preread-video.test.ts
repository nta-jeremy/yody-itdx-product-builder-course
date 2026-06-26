import { describe, it, expect } from "vitest";
import { parseVideo } from "../preread";

describe("parseVideo", () => {
  it("returns valid PreReadVideo when URL present", () => {
    const md = "url: https://youtube.com/embed/abc\nduration: 600";
    const result = parseVideo(md);
    expect(result?.url).toBe("https://youtube.com/embed/abc");
    expect(result?.durationSeconds).toBe(600);
  });

  it("returns null when file only contains TODO (placeholder URL)", () => {
    const md =
      "url: https://www.youtube.com/embed/placeholder\nduration: 600\n\n# Transcript\n> TODO: Ghi transcript khi quay video.";
    const result = parseVideo(md);
    expect(result).toBeNull();
  });
});

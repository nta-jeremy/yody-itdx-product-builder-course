import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoEmbed } from "../video-embed";

describe("VideoEmbed", () => {
  it("renders iframe for YouTube URL", () => {
    render(
      <VideoEmbed
        url="https://www.youtube.com/embed/abc"
        duration={600}
      />,
    );
    const iframe = screen.getByTitle(/Video pre-read/i);
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe.getAttribute("src")).toContain("youtube.com");
  });

  it("renders <video> tag for direct file URL", () => {
    render(
      <VideoEmbed
        url="https://cdn.example.com/lesson.mp4"
        duration={600}
      />,
    );
    const video = screen.getByTitle(/Video pre-read/i);
    expect(video.tagName).toBe("VIDEO");
    expect(video.getAttribute("src")).toContain("lesson.mp4");
  });
});

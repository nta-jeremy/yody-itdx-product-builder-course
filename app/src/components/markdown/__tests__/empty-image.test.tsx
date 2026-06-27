import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { EmptyImage } from "../empty-image";

describe("<EmptyImage>", () => {
  it("renders data-prompt on figure wrapper", () => {
    const { container } = render(<EmptyImage prompt="a prompt" />);
    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.getAttribute("data-prompt")).toBe("a prompt");
  });

  it("renders <img src='/placeholder.svg'> with aspect-video", () => {
    const { container } = render(<EmptyImage prompt="x" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/placeholder.svg");
    expect(img?.getAttribute("alt")).toBe("Ảnh minh họa");
    expect(img?.className).toContain("aspect-video");
  });

  it("does NOT render dashed-box label", () => {
    const { container } = render(<EmptyImage prompt="x" />);
    expect(container.textContent).not.toContain("chờ cập nhật");
  });

  it("does NOT render figcaption with prompt text", () => {
    const { container } = render(<EmptyImage prompt="my prompt" />);
    const figcaption = container.querySelector("figcaption");
    expect(figcaption).toBeNull();
    expect(container.textContent).not.toContain("Prompt:");
  });

  it("applies extra className when provided", () => {
    const { container } = render(
      <EmptyImage prompt="x" className="extra-class" />,
    );
    const figure = container.querySelector("figure");
    expect(figure?.className).toContain("extra-class");
    expect(figure?.className).toContain("yody-empty-image");
  });

  it("does not crash on very long prompts", () => {
    const long = "a".repeat(500);
    const { container } = render(<EmptyImage prompt={long} />);
    const figure = container.querySelector("figure");
    expect(figure?.getAttribute("data-prompt")).toBe(long);
  });
});
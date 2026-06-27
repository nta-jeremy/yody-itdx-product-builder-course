import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MarkdownView } from "../markdown";

describe("MarkdownView — image placeholder integration", () => {
  it("renders <img src='/placeholder.svg'> for blockquote [IMAGE-INSIGHT]", () => {
    const source =
      "> **[IMAGE-INSIGHT]** Minh họa một nhạc trưởng\n> *(Prompt tạo hình: \"abc\")*";
    const { container } = render(<MarkdownView source={source} />);
    const figure = container.querySelector("figure.yody-empty-image");
    expect(figure).not.toBeNull();
    const img = figure?.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/placeholder.svg");
    expect(figure?.getAttribute("data-prompt")).toBe(
      "Minh họa một nhạc trưởng",
    );
  });

  it("renders <img> for paragraph-only [IMAGE-INSIGHT] (archive style)", () => {
    const source = "**[IMAGE-INSIGHT]** Prompt trong archive";
    const { container } = render(<MarkdownView source={source} />);
    const figure = container.querySelector("figure.yody-empty-image");
    expect(figure).not.toBeNull();
    const img = figure?.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/placeholder.svg");
    expect(figure?.getAttribute("data-prompt")).toBe(
      "Prompt trong archive",
    );
  });

  it("tolerates 🖼️ emoji prefix before the marker", () => {
    const source = "> 🖼️ **[IMAGE-INSIGHT]** Có emoji";
    const { container } = render(<MarkdownView source={source} />);
    const figure = container.querySelector("figure.yody-empty-image");
    expect(figure).not.toBeNull();
    expect(figure?.getAttribute("data-prompt")).toBe("Có emoji");
  });

  it("preserves surrounding markdown content", () => {
    const { container } = render(
      <MarkdownView
        source={"# Heading\n\n> **[IMAGE-INSIGHT]** x\n\nparagraph"}
      />,
    );
    expect(container.querySelector("h1.yody-h1")).not.toBeNull();
    expect(container.querySelector("p.yody-p")).not.toBeNull();
    expect(container.querySelector("figure.yody-empty-image")).not.toBeNull();
  });

  it("does not render placeholder for plain text mentioning the marker", () => {
    const { container } = render(
      <MarkdownView source={"paragraph mentioning IMAGE-INSIGHT: inline"} />,
    );
    expect(container.querySelector("figure.yody-empty-image")).toBeNull();
  });

  it("does not render placeholder for regular blockquote", () => {
    const { container } = render(
      <MarkdownView source={"> Đây là blockquote bình thường, không có marker."} />,
    );
    expect(container.querySelector("figure.yody-empty-image")).toBeNull();
  });

  it("renders real ![alt](path) images without EmptyImage wrapper", () => {
    const { container } = render(
      <MarkdownView source={"![real image](/assets/foo.png)"} />,
    );
    const img = container.querySelector("img.yody-img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/assets/foo.png");
    expect(img?.getAttribute("alt")).toBe("real image");
    expect(container.querySelector("figure.yody-empty-image")).toBeNull();
  });
});
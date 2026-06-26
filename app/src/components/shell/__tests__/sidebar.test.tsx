import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../sidebar";
import type { LearnerContent } from "@/lib/content";

const i42SubSessions: LearnerContent["subSessions"] = [
  {
    subCode: "I4.2.1",
    slug: "Kien-Truc-5-Lop",
    title: "Kiến trúc 5 lớp",
    readingMinutes: 30,
    duration: 90,
  },
  {
    subCode: "I4.2.2",
    slug: "Vibe-Coding-Lab",
    title: "Vibe Coding Lab",
    readingMinutes: 30,
    duration: 90,
  },
];

const sessions: LearnerContent[] = [
  {
    code: "I4.1",
    title: "Workflow Canvas",
    level: "L4 Integrator",
    levelNum: 4,
    markdown: "",
    wordCount: 0,
    readingMinutes: 1,
    subSessions: [],
  },
  {
    code: "I4.2",
    title: "Xây Dựng AI Feature",
    level: "L4 Integrator",
    levelNum: 4,
    markdown: "",
    wordCount: 0,
    readingMinutes: 1,
    subSessions: i42SubSessions,
  },
  {
    code: "I4.3",
    title: "Tích hợp",
    level: "L4 Integrator",
    levelNum: 4,
    markdown: "",
    wordCount: 0,
    readingMinutes: 1,
    subSessions: [],
  },
];

describe("Sidebar — sub-session auto-expand", () => {
  it("expands I4.2 when pathname matches /learn/I4.2/1", () => {
    const jsx = Sidebar({
      sessions,
      activeCode: "I4.2",
      linkBase: "/learn",
      pathname: "/learn/I4.2/1",
    });
    render(jsx);
    expect(screen.getByText(/I4\.2\.1/)).toBeInTheDocument();
    expect(screen.getByText(/I4\.2\.2/)).toBeInTheDocument();
  });

  it("does NOT expand when no active sub-session", () => {
    const jsx = Sidebar({
      sessions,
      activeCode: "I4.2",
      linkBase: "/learn",
      pathname: "/learn/I4.2",
    });
    const { container } = render(jsx);
    expect(container.querySelector("a[href='/learn/I4.2/1']")).toBeNull();
    expect(container.querySelector("a[href='/learn/I4.2/2']")).toBeNull();
  });
});

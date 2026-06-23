import { Button } from "@/components/ui/button";
import { SearchIcon } from "./icons";
import type { Page } from "./data";

interface SiteHeaderProps {
  page: Page;
  onNav: (page: Page) => void;
}

export function SiteHeader({ page, onNav }: SiteHeaderProps) {
  const courseActive = page === "home" || page === "list" || page === "read";

  return (
    <header className="sticky top-0 z-20 flex items-center gap-6 border-b border-fg-1 bg-warm/92 px-6 py-3.5 backdrop-blur-md md:px-11">
      <button
        type="button"
        onClick={() => onNav("home")}
        className="font-[family-name:var(--font-impact)] text-[17px] font-extrabold leading-none text-brand"
      >
        YODY<span className="ml-1 text-[15px] font-bold text-fg-1">Học</span>
      </button>

      <nav className="flex gap-5 font-[family-name:var(--font-body)] text-sm font-medium">
        <button
          type="button"
          onClick={() => onNav("list")}
          className={courseActive ? "text-fg-1 font-semibold" : "text-fg-2 font-medium"}
        >
          Khóa học
        </button>
        <button
          type="button"
          onClick={() => onNav("intro")}
          className={page === "intro" ? "text-fg-1 font-semibold" : "text-fg-2 font-medium"}
        >
          Giới thiệu
        </button>
        <button type="button" className="text-fg-2">Tài nguyên</button>
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 font-[family-name:var(--font-body)] text-[13px] text-fg-3">
        <SearchIcon className="size-3.5" />
        <span className="hidden sm:inline">Tìm kiếm</span>
      </div>

      <Button onClick={() => onNav("read")} className="h-[42px] px-[22px] text-sm">
        Bắt đầu
      </Button>
    </header>
  );
}
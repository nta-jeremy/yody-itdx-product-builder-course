import { Input } from "@/components/ui/input";
import { SearchIcon } from "./icons";
import { modules } from "./data";
import type { Page } from "./data";

interface CourseSidebarProps {
  onNav: (page: Page) => void;
}

export function CourseSidebar({ onNav }: CourseSidebarProps) {
  return (
    <aside className="sticky top-[73px] max-h-[calc(100vh-73px)] w-[280px] flex-none overflow-auto border-r border-line bg-warm p-4">
      <div className="relative mb-5">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-fg-3" />
        <Input
          placeholder="Tìm trong khóa học…"
          className="h-10 rounded-[10px] pl-9 font-[family-name:var(--font-body)] text-sm"
        />
      </div>

      {modules.map((m) => (
        <div key={m.n} className="mb-4.5">
          <div className="mb-1.75 flex items-baseline gap-2.25">
            <span
              className="w-[22px] font-[family-name:var(--font-serif)] text-[15px] font-extrabold italic"
              style={{ color: m.c }}
            >
              {m.n}
            </span>
            <span className="font-[family-name:var(--font-brand)] text-xs font-bold leading-[1.3] text-fg-1">
              {m.title}
            </span>
          </div>

          <div className="ml-2.5 flex flex-col gap-px border-l border-line pl-[13px]">
            {m.lessons.map((l) => (
              <button
                key={l.i}
                type="button"
                onClick={() => onNav("read")}
                className="rounded-[6px] px-2.25 py-1.5 text-left font-[family-name:var(--font-body)] text-[13px] leading-[1.4] transition-all hover:bg-card hover:text-fg-1"
                style={{
                  color: l.active ? "var(--brand)" : "var(--fg-2)",
                  fontWeight: l.active ? 700 : 400,
                  background: l.active ? "var(--brand-tint)" : "transparent",
                }}
              >
                {l.t}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
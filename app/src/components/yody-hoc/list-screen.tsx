import { CourseSidebar } from "./course-sidebar";
import { modules } from "./data";
import type { Page } from "./data";

interface ListScreenProps {
  onNav: (page: Page) => void;
}

export function ListScreen({ onNav }: ListScreenProps) {
  return (
    <div data-surface="portal" className="flex items-start">
      <CourseSidebar onNav={onNav} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[760px] px-6 pt-14 pb-22 md:px-12">
          <div className="mb-3.5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.26em] text-iris-deep">
            Mục lục khóa học
          </div>
          <h1 className="mb-11 font-[family-name:var(--font-impact)] text-[clamp(36px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-[-0.022em] text-fg-1">
            Kỹ thuật Harness cho tác tử AI
          </h1>

          {modules.map((m) => (
            <div key={m.n} className="border-t-2 border-fg-1 py-6.5">
              <div className="mb-3 flex items-baseline gap-4.5">
                <span
                  className="font-[family-name:var(--font-serif)] text-[40px] font-extrabold italic leading-none"
                  style={{ color: m.c }}
                >
                  {m.n}
                </span>
                <h2 className="font-[family-name:var(--font-impact)] text-[24px] font-bold leading-[1.15] text-fg-1">
                  {m.title}
                </h2>
              </div>
              <div className="pl-[58px]">
                {m.lessons.map((l) => (
                  <button
                    key={l.i}
                    type="button"
                    onClick={() => onNav("read")}
                    className="flex items-baseline gap-3.5 border-b border-line py-2.75 text-left opacity-100 transition-opacity hover:opacity-60"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-fg-3">
                      {l.i}
                    </span>
                    <span className="flex-1 font-[family-name:var(--font-body)] text-[17px] font-medium leading-[1.4] text-fg-1">
                      {l.t}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[13px] font-normal text-fg-3">
                      {l.d}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
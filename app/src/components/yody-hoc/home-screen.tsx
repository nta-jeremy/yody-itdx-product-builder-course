import { ArrowRightIcon } from "./icons";
import { courses, stats } from "./data";
import type { Page } from "./data";

interface HomeScreenProps {
  onNav: (page: Page) => void;
}

export function HomeScreen({ onNav }: HomeScreenProps) {
  return (
    <div data-surface="marketing">
      <section className="mx-auto max-w-[1000px] px-6 pt-[76px] pb-10 text-center md:px-11">
        <span className="s-eyebrow">THƯ VIỆN KHÓA HỌC · MIỄN PHÍ</span>
        <h1 className="mt-5 font-[family-name:var(--font-impact)] text-[clamp(46px,5.6vw,78px)] font-extrabold leading-[1.02] tracking-[-0.028em] text-fg-1">
          Học kỹ thuật tại{" "}
          <span className="font-[family-name:var(--font-serif)] text-[1em] font-extrabold italic text-iris">
            YODY
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-[600px] font-[family-name:var(--font-body)] text-[21px] font-normal leading-[1.6] text-fg-2 [text-wrap:pretty]">
          Tài liệu đào tạo nội bộ, đọc theo chương như những cuốn sách kỹ thuật — công khai, không cần
          đăng nhập.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-7 font-[family-name:var(--font-body)] text-[13px] font-medium text-fg-3">
          <span>
            <b className="font-[family-name:var(--font-numeric)] text-fg-1">{stats.courses}</b> khóa
            học
          </span>
          <span className="opacity-40">·</span>
          <span>
            <b className="font-[family-name:var(--font-numeric)] text-fg-1">{stats.lessons}</b> bài
            học
          </span>
          <span className="opacity-40">·</span>
          <span>
            <b className="font-[family-name:var(--font-numeric)] text-fg-1">{stats.hours}</b> giờ
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-[1040px] px-6 pb-22 pt-6 md:px-11">
        <div className="mb-5.5 mt-6 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.26em] text-iris-deep">
          Tất cả khóa học
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-6">
          {courses.map((c) => (
            <button
              key={c.n}
              type="button"
              onClick={() => onNav(c.page)}
              className="group flex flex-col overflow-hidden rounded-lg border border-fg-1 bg-card text-left transition-[transform,box-shadow] hover:-translate-y-[3px] hover:shadow-lg"
            >
              <div className="h-[7px]" style={{ background: c.c }} />
              <div className="flex flex-1 flex-col px-7.5 pb-6.5 pt-7.5">
                <div className="mb-4.5 flex items-center justify-between">
                  <span
                    className="rounded-full px-2.75 py-1.75 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: c.cDeep, background: c.tint }}
                  >
                    {c.tag}
                  </span>
                  <span
                    className="font-[family-name:var(--font-serif)] text-[34px] font-extrabold italic leading-none"
                    style={{ color: c.c }}
                  >
                    {c.n}
                  </span>
                </div>
                <h3 className="mb-2.5 font-[family-name:var(--font-impact)] text-[27px] font-bold leading-[1.16] tracking-[-0.018em] text-fg-1">
                  {c.title}
                </h3>
                <p className="mb-5.5 flex-1 font-[family-name:var(--font-body)] text-[15px] leading-[1.6] text-fg-2 [text-wrap:pretty]">
                  {c.desc}
                </p>
                <div className="mb-5 flex flex-wrap gap-4.5 font-[family-name:var(--font-body)] text-[13px] font-medium text-fg-3">
                  <span>
                    <b className="font-[family-name:var(--font-numeric)] text-fg-1">
                      {c.chapters}
                    </b>{" "}
                    chương
                  </span>
                  <span className="opacity-40">·</span>
                  <span>
                    <b className="font-[family-name:var(--font-numeric)] text-fg-1">
                      {c.lessons}
                    </b>{" "}
                    bài
                  </span>
                  <span className="opacity-40">·</span>
                  <span>
                    <b className="font-[family-name:var(--font-numeric)] text-fg-1">{c.hours}</b> giờ
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1.75 font-[family-name:var(--font-brand)] text-sm font-bold"
                  style={{ color: c.cDeep }}
                >
                  {c.cta}
                  <ArrowRightIcon className="size-3.75" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
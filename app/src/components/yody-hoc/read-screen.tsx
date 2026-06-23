import { CourseSidebar } from "./course-sidebar";
import { CodeBlock } from "./code-block";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";
import { harnessYaml } from "./data";
import type { Page } from "./data";

interface ReadScreenProps {
  onNav: (page: Page) => void;
  onCopied: () => void;
}

const lifecycleSteps = [
  { n: "01", label: "Tác vụ", tone: "iris", active: false },
  { n: "02", label: "Harness", tone: "iris", active: true },
  { n: "03", label: "Môi trường", tone: "mint", active: false },
  { n: "04", label: "Kiểm chứng", tone: "gold", active: false },
];

const fourBlocks = [
  { label: "Môi trường", tone: "iris-deep", desc: "Sandbox, giới hạn thời gian, ranh giới truy cập." },
  { label: "Công cụ", tone: "mint-deep", desc: "Tập hành động được phép và quyền hạn của chúng." },
  { label: "Trạng thái", tone: "rose-deep", desc: "Bộ nhớ, ngữ cảnh và checkpoint giữa các lượt." },
  { label: "Kiểm chứng", tone: "gold-deep", desc: "Oracle xác định khi nào một lượt thành công." },
];

const toc = [
  { id: "h-vd", label: "Vòng đời một lượt", active: true },
  { id: "h-bk", label: "Bốn khối", active: false },
  { id: "h-ct", label: "Cấu trúc tối thiểu", active: false },
];

export function ReadScreen({ onNav, onCopied }: ReadScreenProps) {
  return (
    <div data-surface="portal" className="flex items-start">
      <CourseSidebar onNav={onNav} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-6 pt-11 pb-22 md:px-12">
          <div className="mb-5.5 flex items-center gap-2 font-[family-name:var(--font-body)] text-[13px] font-medium text-fg-3">
            <span>Nền tảng Harness</span>
            <ChevronRightIcon className="size-3.5" />
            <span className="font-semibold text-fg-1">Harness là gì?</span>
          </div>

          <div className="mb-2.5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.26em] text-iris-deep">
            Chương I · Bài 1.1
          </div>
          <h1 className="mb-5.5 font-[family-name:var(--font-impact)] text-[clamp(40px,5vw,58px)] font-extrabold leading-[1.04] tracking-[-0.026em] text-fg-1">
            Harness là{" "}
            <span className="font-[family-name:var(--font-serif)] text-[1em] font-extrabold italic text-iris">
              gì?
            </span>
          </h1>

          <p className="mb-5 font-[family-name:var(--font-body)] text-[19px] font-normal leading-[1.8] text-fg-1">
            <span className="float-left mr-3 mt-1.5 font-[family-name:var(--font-serif)] text-[76px] font-black italic leading-[0.72] text-iris">
              H
            </span>
            arness là lớp khung bao quanh một tác tử AI. Nó định nghĩa môi trường mà tác tử hành
            động, các công cụ được phép dùng, và cách kết quả của mỗi lượt được kiểm chứng trước khi
            chấp nhận.
          </p>
          <p className="mb-7 font-[family-name:var(--font-body)] text-[18px] font-normal leading-[1.8] text-fg-2">
            Thay vì để mô hình tự do thao tác, harness đặt ra ranh giới rõ ràng: đầu vào nào hợp lệ,
            hành động nào an toàn, và khi nào một lượt được coi là thành công.
          </p>

          <h2
            id="h-vd"
            className="mb-4 mt-9 font-[family-name:var(--font-impact)] text-[27px] font-bold leading-[1.2] tracking-[-0.012em] text-fg-1"
          >
            Vòng đời một lượt
          </h2>
          <div className="mb-3 flex flex-wrap items-stretch gap-2">
            {lifecycleSteps.map((s, idx) => (
              <div key={s.n} className="contents">
                <div
                  className="min-w-[100px] flex-1 rounded-xl border px-2.5 py-4 text-center"
                  style={{
                    borderColor: s.active ? "var(--iris)" : "var(--border)",
                    background: s.active ? "var(--iris-tint)" : "var(--bg)",
                  }}
                >
                  <div
                    className="mb-1.75 font-[family-name:var(--font-mono)] text-[10px] font-extrabold"
                    style={{ color: `var(--${s.tone})` }}
                  >
                    {s.n}
                  </div>
                  <div
                    className="font-[family-name:var(--font-brand)] text-sm font-bold leading-[1.2]"
                    style={{
                      color: s.active ? "var(--iris-deep)" : "var(--fg-1)",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
                {idx < lifecycleSteps.length - 1 && (
                  <div className="flex items-center text-fg-3">
                    <ArrowRightIcon className="size-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mb-7.5 font-[family-name:var(--font-body)] text-sm font-normal italic leading-[1.5] text-fg-3">
            Hình 1 — Một lượt khép kín; kết quả kiểm chứng phản hồi lại cho lượt sau.
          </p>

          <h2
            id="h-bk"
            className="mb-4 mt-9 font-[family-name:var(--font-impact)] text-[27px] font-bold leading-[1.2] tracking-[-0.012em] text-fg-1"
          >
            Bốn khối của một harness
          </h2>
          <div className="mb-7.5 grid grid-cols-2 gap-3.5">
            {fourBlocks.map((b) => (
              <div key={b.label} className="rounded-xl border border-line bg-card p-4.5">
                <div
                  className="mb-1.25 font-[family-name:var(--font-brand)] text-sm font-bold leading-[1.2]"
                  style={{ color: `var(--${b.tone})` }}
                >
                  {b.label}
                </div>
                <div className="font-[family-name:var(--font-body)] text-[13px] leading-[1.5] text-fg-2">
                  {b.desc}
                </div>
              </div>
            ))}
          </div>

          <h2
            id="h-ct"
            className="mb-4 mt-9 font-[family-name:var(--font-impact)] text-[27px] font-bold leading-[1.2] tracking-[-0.012em] text-fg-1"
          >
            Cấu trúc tối thiểu
          </h2>
          <CodeBlock filename="harness.yaml" code={harnessYaml} onCopied={onCopied} />

          <blockquote className="my-9 border-l-2 border-iris pl-7">
            <p className="font-[family-name:var(--font-serif)] text-[25px] font-semibold italic leading-[1.45] text-fg-1">
              Harness tốt làm cho hành vi của tác tử có thể dự đoán và kiểm chứng — không phải làm nó
              thông minh hơn.
            </p>
          </blockquote>

          <div className="mt-11 flex gap-4 border-t-2 border-fg-1 pt-5.5">
            <button
              type="button"
              onClick={() => onNav("intro")}
              className="flex-1 text-left"
            >
              <div className="mb-1.25 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-fg-3">
                ← TRƯỚC
              </div>
              <div className="font-[family-name:var(--font-impact)] text-base font-bold leading-[1.25] text-fg-1">
                Giới thiệu khóa học
              </div>
            </button>
            <button type="button" className="flex-1 text-right">
              <div className="mb-1.25 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-fg-3">
                SAU →
              </div>
              <div className="font-[family-name:var(--font-impact)] text-base font-bold leading-[1.25] text-iris-deep">
                Vòng đời tác tử
              </div>
            </button>
          </div>
        </div>
      </main>

      <aside className="sticky top-[73px] max-h-[calc(100vh-73px)] w-[200px] flex-none overflow-auto px-5.5 py-10">
        <div className="mb-3.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-fg-3">
          Trên trang
        </div>
        <div className="flex flex-col gap-0.5 border-l-2 border-line">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="-ml-0.5 border-l-2 py-1.25 pl-3.5 font-[family-name:var(--font-body)] text-[13px] leading-[1.4] no-underline"
              style={{
                color: item.active ? "var(--iris-deep)" : "var(--fg-2)",
                fontWeight: item.active ? 600 : 400,
                borderColor: item.active ? "var(--iris)" : "transparent",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}
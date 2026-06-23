import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckIcon } from "./icons";
import { author, outcomes, prereqs, faqs } from "./data";
import type { Page } from "./data";

interface IntroScreenProps {
  onNav: (page: Page) => void;
}

export function IntroScreen({ onNav }: IntroScreenProps) {
  return (
    <div data-surface="marketing">
      <section className="mx-auto max-w-[900px] px-6 pt-16 pb-10 md:px-11">
        <span className="s-eyebrow">GIỚI THIỆU KHÓA HỌC</span>
        <h1 className="mt-4.5 mb-4.5 font-[family-name:var(--font-impact)] text-[clamp(44px,5.4vw,68px)] font-extrabold leading-[1.02] tracking-[-0.026em] text-fg-1">
          Về{" "}
          <span className="font-[family-name:var(--font-serif)] text-[1em] font-extrabold italic text-iris">
            khóa học
          </span>
        </h1>
        <p className="max-w-[660px] font-[family-name:var(--font-body)] text-xl font-normal leading-[1.65] text-fg-2 [text-wrap:pretty]">
          Trang bị tư duy và công cụ để xây dựng tác tử AI đáng tin cậy — từ môi trường, trạng thái,
          đến kiểm chứng và vận hành.
        </p>
      </section>

      <section className="mx-auto grid max-w-[900px] grid-cols-[1.35fr_1fr] items-start gap-12 border-t-2 border-fg-1 px-6 py-6 md:px-11">
        <div>
          <h2 className="mt-7 mb-4 font-[family-name:var(--font-impact)] text-[24px] font-bold leading-[1.2] text-fg-1">
            Bạn sẽ học được gì
          </h2>
          <div className="mb-9 flex flex-col">
            {outcomes.map((o) => (
              <div
                key={o}
                className="flex items-baseline gap-3.25 border-b border-line py-3"
              >
                <span className="flex-none text-mint">
                  <CheckIcon className="size-4.5" />
                </span>
                <span className="font-[family-name:var(--font-body)] text-base leading-[1.55] text-fg-1">
                  {o}
                </span>
              </div>
            ))}
          </div>

          <h2 className="mb-3.5 font-[family-name:var(--font-impact)] text-[24px] font-bold leading-[1.2] text-fg-1">
            Yêu cầu trước khi học
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {prereqs.map((p) => (
              <span
                key={p}
                className="rounded-full border border-line bg-card px-3.5 py-2.25 font-[family-name:var(--font-body)] text-sm font-medium text-fg-2"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 rounded-md border border-fg-1 bg-card p-6.5">
          <div className="mb-4.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-fg-3">
            Giảng viên
          </div>
          <div className="mb-4 flex items-center gap-3.5">
            <div className="flex size-[60px] flex-none items-center justify-center rounded-full bg-iris-tint font-[family-name:var(--font-serif)] text-[22px] font-extrabold italic text-iris-deep">
              {author.initials}
            </div>
            <div>
              <div className="font-[family-name:var(--font-impact)] text-[18px] font-bold leading-[1.2] text-fg-1">
                {author.name}
              </div>
              <div className="mt-0.75 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.06em] text-fg-3">
                {author.role}
              </div>
            </div>
          </div>
          <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.65] text-fg-2">
            {author.bio}
          </p>
        </div>
      </section>

      <section className="border-t border-b border-line bg-card px-6 py-14 md:px-11">
        <div className="mx-auto max-w-[760px]">
          <h2 className="mb-5.5 font-[family-name:var(--font-impact)] text-[24px] font-bold leading-[1.2] text-fg-1">
            Câu hỏi thường gặp
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map((f, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="flex items-center gap-3 py-4.5 font-[family-name:var(--font-impact)] text-lg font-semibold leading-[1.4] text-fg-1">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4.5 font-[family-name:var(--font-body)] text-base leading-[1.7] text-fg-2">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-6 py-16 text-center md:px-11">
        <h2 className="mb-3.5 font-[family-name:var(--font-impact)] text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.015em] text-fg-1">
          Sẵn sàng bắt đầu?
        </h2>
        <Button onClick={() => onNav("read")} className="mt-2">
          Vào bài 1.1 · Harness là gì? →
        </Button>
      </section>
    </div>
  );
}
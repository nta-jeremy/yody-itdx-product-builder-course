/**
 * EmptyImage — placeholder cho blockquote `> [IMAGE-INSIGHT]` và comment
 * `<!-- CẦN HÌNH: ... -->` trong markdown.
 *
 * Render `<img src="/placeholder.svg">` 16:9, không có dashed-box cũ, không
 * có label "chờ cập nhật", không có figcaption prompt. `data-prompt` vẫn
 * giữ trên `<figure>` wrapper để dev script extract prompt khi cần
 * regenerate ảnh.
 *
 * YODY DS:
 * - Token colors only — `.yody-placeholder-img { color: var(--fg-3) }` ở
 *   prose.css, stroke SVG dùng `currentColor` để kế thừa.
 * - aspect-video reserves CLS-safe height (Core Web Vitals target).
 * - Khi có ảnh thật, replace blockquote bằng cú pháp `![alt](path)` chuẩn —
 *   react-markdown xử lý `<img>` thường, không đi qua component này.
 */
import { cn } from "@/lib/utils";

export interface EmptyImageProps {
  prompt: string;
  className?: string;
}

export function EmptyImage({ prompt, className }: EmptyImageProps) {
  return (
    <figure
      data-surface="app"
      data-prompt={prompt}
      className={cn("yody-empty-image my-6", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/placeholder.svg"
        alt="Ảnh minh họa"
        className="yody-placeholder-img block aspect-video w-full"
      />
    </figure>
  );
}

export default EmptyImage;
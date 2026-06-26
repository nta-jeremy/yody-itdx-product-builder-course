/**
 * EmptyImage — placeholder cho `<!-- CẦN HÌNH: ... -->` trong markdown.
 *
 * Render dashed-border box với label "chờ cập nhật" và prompt ở figcaption.
 * `data-prompt` attribute giữ prompt gốc (cho dev script extract sau này).
 *
 * YODY DS:
 * - No emoji as icon (skill rule) — dùng text label uppercase.
 * - Token colors only (--bg-muted, --border-hover, --fg-3).
 * - `aspect-video` reserves CLS-safe height (Core Web Vitals target).
 * - `role="img"` + `aria-label` cho screen reader.
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
      <div
        role="img"
        aria-label={`Ảnh minh họa chờ cập nhật: ${prompt}`}
        className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-hover)] bg-[var(--bg-muted)]"
      >
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--fg-3)]">
          Ảnh minh họa · chờ cập nhật
        </span>
      </div>
      {prompt && (
        <figcaption className="mt-2 font-[family-name:var(--font-body)] text-[12px] italic leading-[1.5] text-[var(--fg-3)]">
          <span className="font-bold not-italic">Prompt:</span> {prompt}
        </figcaption>
      )}
    </figure>
  );
}

export default EmptyImage;

# Brainstorm — Ẩn EmptyImage, render `<img>` placeholder

**Date:** 2026-06-27
**Status:** Approved
**Topic:** Thay đổi `EmptyImage` để không hiển thị dashed-box + label + prompt; chỉ render `<img>` default. Khi có ảnh thật, replace blockquote bằng `![alt](path)`.

## Problem statement

Trong các lesson markdown hiện tại, các placeholder ảnh dùng cú pháp blockquote `> [IMAGE-INSIGHT] ...` + `> *(Prompt tạo hình: "...")*`. Khi render, `EmptyImage` component hiển thị:
- Dashed-border box với label "Ảnh minh họa · chờ cập nhật"
- Figcaption chứa full prompt gốc

User muốn **ẩn hoàn toàn** các nội dung này — chỉ render một `<img>` default (SVG placeholder). Khi có ảnh thật, replace blockquote bằng cú pháp `![alt](path)` chuẩn của markdown.

## Requirements (concrete)

1. **Output mong đợi:** `<figure data-prompt="..."><img src="/placeholder.svg" alt="Ảnh minh họa" /></figure>` — không có label, không có figcaption prompt.
2. **Acceptance criteria:**
   - Markdown có `> [IMAGE-INSIGHT]` → snapshot test confirm `<img src="/placeholder.svg">`, không có text "chờ cập nhật", không có `<figcaption>`.
   - `<figure>` vẫn có `data-prompt="..."` (dev script extract được).
   - Markdown có `![alt](path)` thật → render qua `img` component thường, không wrap trong `<figure>` placeholder.
3. **Scope boundary:**
   - KHÔNG convert blockquote → comment HTML tự động.
   - KHÔNG generate ảnh thật từ prompt.
   - KHÔNG đổi cấu trúc folder content.
   - KHÔNG thêm build script mới.
4. **Non-negotiable constraints:**
   - Stack: Next.js 16 (App Router), React 19, TS, Tailwind v4, vitest.
   - `EmptyImage` phải giữ tên file và tên component (đổi implementation).
   - Giữ `data-prompt` trên DOM (đúng comment gốc trong file).
   - Dùng SVG placeholder, scale vô hạn.
5. **Touchpoints:**
   - `app/src/components/markdown/empty-image.tsx` — implementation chính.
   - `app/src/components/markdown/remark-image-placeholder.ts` — verify regex match blockquote format (HIGH RISK, xem rủi ro).
   - `app/src/components/markdown/markdown.tsx` — không đổi mapping (giữ nguyên), nhưng cần snapshot test.
   - `app/public/placeholder.svg` — file mới.
   - `app/src/components/markdown/__tests__/` — snapshot test mới/mở rộng.

## Approach đã chọn

### File-level changes

| File | Hành động |
|------|-----------|
| `app/src/components/markdown/empty-image.tsx` | Đổi implementation: render `<figure data-prompt="..."><img src="/placeholder.svg" alt="..." class="yody-img yody-placeholder-img" /></figure>`. Bỏ `role="img"` div + dashed-box + label + figcaption. Update comment đầu file. |
| `app/public/placeholder.svg` | **Mới.** SVG 16:9, dashed border, icon image-frame subtle, dùng `currentColor` cho stroke. |
| `app/src/components/markdown/__tests__/markdown.test.tsx` (hoặc tên tương tự) | **Mới/mở rộng.** Snapshot test cho cả 2 case: blockquote `CẦN HÌNH` và `![alt](path)`. |

### Implementation chi tiết

**`empty-image.tsx`:**
```tsx
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
        className="yody-img yody-placeholder-img block aspect-video w-full"
      />
    </figure>
  );
}

export default EmptyImage;
```

**`placeholder.svg`** (16:9, dashed border + image-frame icon):
- viewBox `0 0 800 450`
- `<rect>` dashed border, `stroke="currentColor"`, `fill="none"`
- Icon image-frame ở giữa (rect outline + circle cho sun + triangle cho mountain)
- Dùng `currentColor` để CSS `.yody-placeholder-img { color: var(--fg-3) }` điều khiển

### Verification plan (test-driven)

1. Snapshot test trong `__tests__/markdown.test.tsx`:
   - Input: source chứa `> [IMAGE-INSIGHT] test prompt\n> *(Prompt: "abc")*`
   - Expect: render `<figure>` với `<img src="/placeholder.svg">`, không có text "chờ cập nhật", không có figcaption.
   - Input 2: source chứa `![real](path/to/img.png)`
   - Expect 2: render `<img src="path/to/img.png">` qua `img` component (KHÔNG bị wrap trong `<figure>` placeholder).
2. Chạy `npm run lint` + `npm run test` để verify.
3. Manual check: render 1 lesson thật (vd `I2.2`) ở dev mode, xác nhận blockquote placeholder hiển thị `<img>` thay vì dashed-box.

## Risks & mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| `remark-image-placeholder.ts:22` regex `MARKER_RE` chỉ match comment HTML `<!-- CẦN HÌNH: ... -->`, KHÔNG match blockquote `> [IMAGE-INSIGHT]` | **HIGH** | Test pipeline thực tế với 1 lesson có blockquote format. Nếu regex không match, mở rộng `MARKER_RE` để match cả 2 format (HTML comment + markdown blockquote `> [IMAGE-INSIGHT]`). |
| ESLint `@next/next/no-img-element` chặn `<img>` trong `EmptyImage` | Medium | Thêm `eslint-disable-next-line` comment (đã có pattern ở `markdown.tsx:146`). |
| Snapshot test fail vì DOM thay đổi | Low | Cập nhật snapshot sau khi verify output đúng. |
| Lesson cũ trong `_archive` dùng comment HTML → vẫn match regex cũ, render `<img>` mới (không có label) | Low | Đúng intent — không cần xử lý đặc biệt. |

## Out of scope

- Auto-convert blockquote → `![alt](path)` khi đã có ảnh thật (làm manual).
- Generate ảnh từ prompt qua AI.
- Đổi folder structure content.
- Thêm build script mới.
- Xử lý các bài học cụ thể (vd tìm & replace tất cả blockquote `CẦN HÌNH` trong content).

## Success metrics

- ✅ Snapshot test pass cho cả 2 case (blockquote placeholder + `![alt](path)`).
- ✅ `npm run lint` pass (zero warnings, theo `package.json:9`).
- ✅ `npm run test` pass.
- ✅ Manual render `I2.2` lesson: tất cả placeholder hiển thị `<img>` 16:9, không có text "chờ cập nhật" hoặc prompt caption.
- ✅ `data-prompt` còn trên DOM (verify bằng DevTools hoặc snapshot test attribute check).

## Next steps

1. Chạy `npm run test` hiện tại để establish baseline.
2. Implement `placeholder.svg`.
3. Sửa `empty-image.tsx`.
4. Verify pipeline với blockquote format — nếu regex không match, mở rộng `MARKER_RE`.
5. Viết snapshot test.
6. Manual verify ở dev mode.
7. Optional: xóa `rehype-image-placeholder.ts` (đã deprecated, see `remark-image-placeholder.ts:1-12`).

## Decision log

- **Tên component:** Giữ `EmptyImage` (A1) — git diff nhỏ, không phải đổi mapping ở `markdown.tsx`.
- **`data-prompt`:** Giữ (B1) — khớp với intent gốc trong file comment, dev script extract được.
- **Nội dung SVG:** Icon image-frame + dashed border (C1) — rõ ràng "đây là chỗ có ảnh", không thừa.
- **Format ảnh thật:** Replace blockquote bằng `![alt](path)` — đơn giản, react-markdown có sẵn xử lý.
- **Asset default:** SVG (1 file, scale vô hạn).
- **Test:** Snapshot test cho markdown rendering.
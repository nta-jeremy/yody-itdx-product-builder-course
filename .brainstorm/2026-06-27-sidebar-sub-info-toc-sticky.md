# Brainstorm — Sidebar sub-items + TOC sticky fix

> **Ngày:** 27/06/2026 · **Phạm vi:** UI surgical fix cho route `/learn/[code]` + `/learn/[code]/[subCode]`
> **Trạng thái:** Sẵn sàng cho `/plan` — chốt được 4 quyết định chính với user
> **Tái sử dụng:** Plan `plans/260626-1530-sidebar-sub-info-toc-anchor-empty-image/` (status pending) — chạy lại subset

---

#

2 việc user yêu cầu:
1. **Sub-item menu trong sidebar cho buổi có buổi phụ** (vd I4.1.1, I4.1.2) — **thiếu `duration` + `readingMinutes`**
2. **TOC sticky khi scroll xuống** — TOC đã có `sticky top-[96px]` nhưng vẫn lỗi

Cả 2 đã có plan pending `260626-1530-...` chuẩn bị sẵn. User chốt:
- **Bỏ Phase 0** (diagnose) — apply fix thẳng
- **Sub-item UI đầy đủ**: code + title + duration + reading time
- **Wire SubBreadcrumb + SubSessionNav** đã có sẵn vào sub-session page

→ **4 file thay đổi**, ~2-3 giờ dev, **0 risk lớn** (tất cả component đã tồn tại, chỉ wire + tune).

---

## 1. Phạm vi đã chốt với user

| Câu hỏi | User chốt |
|---|---|
| Xử lý EmptyImage (Phase 3 plan cũ)? | **Bỏ** — ngoài phạm vi câu hỏi này |
| Diagnose TOC trước khi fix? | **Bỏ Phase 0** — apply fix thẳng theo khả năng cao nhất (RC3) |
| Sub-item UI scope? | **Đầy đủ** — code + title + duration + reading time |
| Wire SubBreadcrumb + SubSessionNav? | **Có** — page sub-session hiện đang chỉ render header + markdown |

---

## 2. Codebase facts (verified 27/06/2026)

### 2.1 Sub-session routing — đã có sẵn ✅

- `app/src/lib/content/learner.ts:148-161` — `parseSubSessionFromPath` parse `I4.2.1-Kien-Truc-5-Lop.md` → `{subCode, slug, title:subCode, readingMinutes:0, duration:90}` (Phase 1 stub)
- `app/src/lib/content/sub-learner.ts` — reader riêng cho sub-session
- `app/src/app/learn/[code]/[subCode]/page.tsx` — route `/learn/I4.1/1` đã chạy (test report: 12 SSG routes)
- `app/src/lib/content/index.ts` export `getSubLearnerContent`, `listSubLearnerContent`, `isValidSubSessionCode`
- `TEST-REPORT-pre-read-sub-session.md` confirm 41 routes sinh OK, 153 tests pass

### 2.2 Sidebar sub-info — Phase 1 plan cũ chưa chạy ❌

- `app/src/components/shell/sidebar.tsx:158-186` — block render sub-session đã có structure nhưng **thiếu duration span**:
  ```tsx
  <Link ...>
    <span>{sub.subCode}</span>
    <span>{sub.title}</span>
    {/* THIẾU: readingMinutes + duration span */}
  </Link>
  ```
- Mockup user cung cấp (ảnh đỏ) hiển thị: `I4.1.1 | I4.1.1 | 0' đọc · 90' live` ở góc phải.

### 2.3 TOC sticky — đã có class `sticky` nhưng vẫn lỗi ❌

- `app/src/components/markdown/toc-scrollspy.tsx:91-93` đã có:
  ```tsx
  "sticky top-[96px]",
  "max-h-[calc(100vh-128px)]",
  ```
- `app/src/app/learn/[code]/page.tsx:114-194` — wrap prose trong `min-w-0 flex-1` rồi mới `<div className="mx-auto w-full max-w-[688px]">`. **Đã có flex pattern đúng**.
- Không có overflow:hidden|auto|scroll ở ancestor chain (`body`, `main`, `data-surface="app"`, `<main className="min-w-0 flex-1 px-6 py-10...">`, `<div className="flex items-start gap-10 xl:gap-14">`).

### 2.4 Khả năng cao nhất cho TOC lỗi

3 candidates từ phase-00-diagnose-toc.md:

| RC | Khả năng | Lý do |
|---|---|---|
| RC1 (breakpoint) | Thấp | `hidden xl:block` đã đúng (>1280px). User nói "scroll xuống" — tức đã thấy TOC. |
| RC2 (overflow ancestor) | Thấp | Grep không tìm thấy overflow ở ancestors. |
| **RC3 (flex collapse)** | **Cao nhất** | Mặc dù outer đã có `flex-1 min-w-0`, có thể TOC **vẫn bị đẩy xuống** khi content prose ngắn — lúc đó `items-start` đẩy TOC xuống dưới, nhưng sticky vẫn neo. |

**Thực tế**: Vì outer đã đúng pattern, RC3 có thể là **edge case visual** — không phải technical sticky broken. Có thể user thấy:
- TOC hiển thị nhưng ở **vị trí thấp hơn content** (do `items-start` không phải `items-stretch`) → TOC đứng yên khi content scroll qua → **cảm giác "không sticky"** dù kỹ thuật vẫn sticky.
- Hoặc `top-[96px]` không khớp header height thực → TOC có khoảng trống > 0 giữa header và TOC → trông như "chưa dính".

### 2.5 Sub-session page — chưa wire SubBreadcrumb/SubSessionNav ❌

- `app/src/components/learn/sub-breadcrumb.tsx` (2.1K) — đã có sẵn
- `app/src/components/learn/sub-session-nav.tsx` (4.1K) — đã có sẵn
- `app/src/app/learn/[code]/[subCode]/page.tsx:85-108` chỉ render `<header>` + `<MarkdownView>` — **không import 2 component trên**.
- Sidebar `activeCode={content.subCode}` ở line 83 — đúng (vd `I4.1.1`), nhưng `pathname` prop không được pass → sidebar **không detect active sub-session** để auto-expand. → Sidebar show I4.1 active, nhưng không show sub-list.

---

## 3. Giải pháp đề xuất

### 3.1 Wire SubBreadcrumb + SubSessionNav vào sub-session page

**File**: `app/src/app/learn/[code]/[subCode]/page.tsx`

**Implementation** (surgical, ~30 phút):
- Import `SubBreadcrumb` từ `@/components/learn/sub-breadcrumb`
- Import `SubSessionNav` từ `@/components/learn/sub-session-nav`
- Thay `<header>` cũ (line 87-104) bằng: `<SubBreadcrumb {...} /> + <header> + <MarkdownView> + <SubSessionNav {...} />`
- Pass `pathname={pathname}` xuống `<Sidebar>` để auto-expand sub-list của parent

**Risk**: Thấp. 2 component đã có sẵn + tested. Chỉ là composition.

### 3.2 Sidebar — thêm reading time + duration cho sub-items

**File**: `app/src/components/shell/sidebar.tsx`

**Implementation** (~15 phút, đúng pattern plan cũ Phase 1):

```tsx
// Line 174-181 (sub-session Link):
<span className="ml-auto flex-none font-[family-name:var(--font-mono)] text-[10px] text-[var(--fg-3)]">
  {sub.readingMinutes}&rsquo; đọc · {sub.duration}&rsquo; live
</span>
```

**Lưu ý về `readingMinutes=0` (Phase 1 stub)**: Hiển thị `0' đọc · 90' live` — đồng nhất với section "Buổi học gồm 2 buổi phụ" trong `learn/[code]/page.tsx:148-153`. Phase sau (plan 0842) sẽ enrich từ markdown → tự động đúng.

### 3.3 TOC sticky — RC3 safety fix

**File**: `app/src/app/learn/[code]/page.tsx`

**Hypothesis**: TOC đã sticky đúng về kỹ thuật, nhưng user cảm thấy "không neo" vì:
1. **`top-[96px]` mismatch**: Site header cao ~60px (py-3.5 + logo 32px), nhưng TOC dùng 96px → TOC có gap ~36px giữa header và TOC → trông như "chưa dính".
2. **Edge case content ngắn**: Với buổi học ngắn, content prose kết thúc trước khi scroll xuống đáy → TOC bị kéo lên cùng container → không cảm thấy "sticky khi scroll".

**Implementation** (~30 phút):

**Fix A — header offset chính xác**:
- Đo `site-header` height thực tế (DevTools) → cập nhật `top-[96px]` → `top-[var(--header-h)]` với CSS var.
- Hoặc đơn giản: đổi `top-[96px]` → `top-[64px]` (match sidebar offset, gần với header height thực).

**Fix B — RC3 safety net** (defensive):
- Wrap prose + TOC trong `<div className="relative isolate">` để chắc chắn flex container không bị ảnh hưởng bởi z-index/stacking context khác.

**Fix C — `items-stretch` thay `items-start`**:
- Đổi `<div className="flex items-start gap-10 xl:gap-14">` → `<div className="flex items-stretch gap-10 xl:gap-14">`. Đảm bảo TOC column cao = prose column, sticky hoạt động trong full height range.

**Recommend**: Áp dụng Fix A + Fix C. Bỏ Fix B (over-engineering).

---

## 4. Quyết định thay đổi cụ thể

| # | File | Thay đổi | Effort |
|---|---|---|---|
| 1 | `app/src/components/shell/sidebar.tsx` | Thêm `readingMinutes + duration` span vào sub-item Link (line 174-181) | 15 phút |
| 2 | `app/src/app/learn/[code]/[subCode]/page.tsx` | Import + render `SubBreadcrumb` trước header + `SubSessionNav` sau MarkdownView; pass `pathname` xuống Sidebar | 30 phút |
| 3 | `app/src/app/learn/[code]/page.tsx` | Fix TOC: đổi `items-start` → `items-stretch` (line 114); đổi TOC `top-[96px]` → `top-[64px]` (toc-scrollspy.tsx:91) | 10 phút |
| 4 | `app/src/app/learn/[code]/page.tsx` | Verify TOC cũng hiển thị ở sub-session page (nếu extractToc OK với sub content) — tùy chọn, có thể defer | 30 phút (optional) |

**Tổng**: ~1.5-2 giờ dev (không tính optional #4).

---

## 5. Approach đã evaluate

### Approach A — Áp dụng plan cũ verbatim (Phase 0+1+2)

- **Pro**: Plan đã viết chi tiết, acceptance criteria sẵn.
- **Con**: Phase 0 (diagnose) — user đã bỏ. Phase 3 (EmptyImage) — ngoài phạm vi. Phải edit lại plan cũ.
- **Verdict**: ❌ Không tối ưu — phải refactor plan cũ.

### Approach B — Subset surgical (đề xuất)

- **Pro**: Đúng scope user hỏi. Tận dụng plan cũ cho Phase 1. Bỏ qua diagnose & EmptyImage.
- **Con**: Không có plan chi tiết sẵn → phải viết mới.
- **Verdict**: ✅ Khuyến nghị. Effort thấp, scope rõ.

### Approach C — Full overhaul (refactor sidebar + TOC)

- **Pro**: Code "sạch" hơn, có thể polish.
- **Con**: Vi phạm YAGNI. User chỉ hỏi 2 bug nhỏ. Over-engineer.
- **Verdict**: ❌.

---

## 6. Risk & mitigation

| Risk | Mức | Mitigation |
|---|---|---|
| `readingMinutes=0` hiển thị "0'" gây khó hiểu | 🟡 | Mockup user cũng hiển thị "0'" — đồng nhất. Phase sau enrich. |
| SubBreadcrumb/SubSessionNav API khác với những gì sub-session page truyền | 🟠 | Phase impl: đọc kỹ props của 2 component trước khi wire. Có thể cần adapter nhỏ. |
| `items-stretch` gây TOC cao = full content → click scroll xuống đáy có cảm giác khác | 🟢 | TOC đã có `overflow-y-auto max-h-[calc(100vh-128px)]` → tự handle. |
| `top-[64px]` quá gần header (header height thực ~60px) → TOC đè lên border header | 🟡 | DevTools đo lại; nếu cần → đổi thành `top-[var(--header-h,64px)]` + set `--header-h` ở root layout. |

---

## 7. Success criteria

| Metric | Verify |
|---|---|
| Sidebar sub-items show duration: `I4.1.1 [title] 0' đọc · 90' live` | Visual `/learn/I4.1` ở 1440px |
| Sidebar auto-expand sub-list khi ở `/learn/I4.1/1` | Click `/learn/I4.1/1` → sidebar mở I4.1 → thấy 4.1.1 + 4.1.2 |
| TOC neo đúng khi scroll xuống 500px, 1000px, 2000px | Visual scroll test `/learn/I4.1` ở 1440px |
| SubBreadcrumb show 4-level: Học › L4 Integrator › I4.1 › I4.1.1 | Visual `/learn/I4.1/1` |
| SubSessionNav prev/next card giữa `I4.1.1` ↔ `I4.1.2` | Visual `/learn/I4.1/1` + `/learn/I4.1/2` |
| Không phá vỡ existing 14 + 12 SSG routes | `npm run build` pass |
| Không CLS khi scroll | Lighthouse `/learn/I4.1` CLS < 0.1 |

---

## 8. Out of scope

- **KHÔNG** thêm EmptyImage (Phase 3 plan cũ) — user đã chốt bỏ.
- **KHÔNG** enrich `readingMinutes` từ markdown body — đó là task của plan `260626-0842-pre-read-and-sub-session` (Phase 2 content layer).
- **KHÔNG** refactor sidebar layout — chỉ thêm 1 span.
- **KHÔNG** thêm animation/shadow/polish cho TOC — chỉ fix sticky.
- **KHÔNG** thêm progress bar / collapsible TOC.
- **KHÔNG** thêm "TOC on sub-session page" (optional #4) — defer Phase sau nếu user cần.

---

## 9. Câu hỏi còn lại (để chốt trước /plan)

Đã chốt đủ với user. Có thể proceed sang `/plan` luôn.

---

## 10. Next steps

1. User confirm scope (đã chốt 4 quyết định ở §1).
2. Gọi `/plan` với context = file này → tạo implementation plan chi tiết (tasks, owner, acceptance, verify).
3. Plan sẽ cover 4 thay đổi ở §4, effort ~1.5-2 giờ.

---

## Phụ lục A — Tại sao `top-[96px]` có thể là vấn đề

| Component | Class sticky offset |
|---|---|
| `site-header.tsx:44` | `sticky top-0` (header height ~60px) |
| `sidebar.tsx:105` | `sticky top-[64px]` (offset = 64px, khớp header) |
| `toc.tsx:95` | `sticky top-[var(--toc-offset,73px)]` (CSS var) |
| **`toc-scrollspy.tsx:91`** | **`sticky top-[96px]` ← outlier, không khớp** |

Nếu header thực cao ~60px → TOC cách header 36px → trông như "chưa dính". Đề xuất: đổi thành `top-[64px]` cho khớp sidebar pattern.

## Phụ lục B — Mockup user vs Codebase hiện tại

**Mockup user (ảnh đỏ)** — sidebar sub-items có 3 thành phần:
1. `I4.1.1` (mono, bold, brand color)
2. `I4.1.1` (title — chú ý: title giống subCode vì Phase 1 stub)
3. `0' đọc · 90' live` (mono, fg-3, right-aligned)

**Codebase hiện tại** (`sidebar.tsx:173-180`):
```tsx
<Link ...>
  <span>{sub.subCode}</span>
  <span>{sub.title}</span>  ← chỉ có 2 span, thiếu #3
</Link>
```

→ Đúng 1 dòng code để match mockup.

---

*Brainstorm · 27/06/2026 · Sidebar sub-info + TOC sticky + sub-session UX · YODY Product Builder Program*
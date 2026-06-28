# Brainstorm — UI/UX đọc course dành cho người học (route `/learn`)

> **Phiên bản:** 1.0 · **Ngày:** 25/06/2026 · **Loại:** follow-up brainstorm (kế tiếp `brainstorm-yody-hoc-replace.md`) · **Vai trò:** Solution Brainstormer (phân tích + đề xuất, không code).
> **Đầu vào:** `app/content/idea/Intern-Product-Builder/Teaching-Kit-I*/main-content/*.md` (14 file tài liệu học) + route `/sessions/[code]` hiện tại (mentor-facing, side-by-side giáo án + cẩm nang) + báo cáo research UX từ planner agent.
> **Phạm vi chốt:** Thêm route `/learn` + `/learn/[code]` đọc `main-content` cho learner; **không đụng** `/sessions/[code]` mentor view. Reuse tối đa `components/markdown/`, `components/shell/`. Build 9 must-have components theo research.

---

## 1. Problem statement & requirements

**Vấn đề:** Web đang show `giáo án + cẩm nang giảng` (mentor-facing) tại `/sessions/[code]` — nội dung dành cho trainer/reviewer, **không** cho người học. Người học thật sự cần đọc `Teaching-Kit-I*/main-content/*-Tai-Lieu-Hoc-*.md` (14 file, đã đủ cho cả 14 buổi I1.1 → I5.3). Hiện chưa có UI/UX đọc-focused nào cho learner.

**Yêu cầu (chốt sau interview + research):**

| # | Yêu cầu | Đo lường |
|---|---|---|
| R1 | Tách biệt rõ learner view vs mentor view, không phá mentor view hiện tại | Route mới `/learn` + `/learn/[code]`; `/sessions/[code]` giữ nguyên side-by-side |
| R2 | Learner đọc được 14 file `main-content/*-Tai-Lieu-Hoc-*.md` | Content layer resolve đúng file theo `sessionCode` |
| R3 | UX reading-first, tối ưu cho bài dài 600–800 dòng tiếng Việt | Prose 70ch / 18px / lh 1.7 / Be Vietnam Pro, TOC scrollspy, prev/next, progress bar |
| R4 | Có cửa vào list 14 buổi cho learner (orientation) | Route `/learn` list + sidebar 5 level (reuse pattern `/sessions`) |
| R5 | Đèn đọc đêm + ước lượng thời gian đọc + breadcrumb | DarkModeToggle (next-themes đã có trong deps), ReadingTime, Breadcrumb 3 cấp |
| R6 | Tuân thủ YODY DS + Next.js 16 breaking-change guard + `output: 'export'` | 0 emoji, token-only, `data-surface="app"`, verify `node_modules/next/dist/docs/` trước code |

**Non-goals (defer theo YAGNI):** cross-course search, font-size toggle, font-family swap, bookmark/save, in-page custom search, print/PDF, MarkAsRead localStorage, keyboard shortcuts, image zoom. Pilot 30 users — browser Cmd+F + zoom + good sidebar đủ. Defer v2 nếu pilot feedback đòi.

---

## 2. Current state audit (thẳng thắn)

### 2.1 Tài liệu `main-content` — đủ và sẵn sàng

14 folder `Teaching-Kit-I*` đều có `main-content/`, mỗi folder đúng 1 file markdown (xác nhận bằng glob). Cấu trúc header không hoàn toàn nhất quán:

| Buổi | H1 | Dòng mở đầu |
|---|---|---|
| I1.1 | `# I1.1 — AI Fundamentals` | `## Tài liệu học` |
| I1.2 | `# I1.2 — Giới Hạn AI & An Toàn Dữ Liệu` | `## Tài Liệu Học · Module 1 · Level 1 Aware` |
| I5.3 | `# YODY PRODUCT BUILDER PROGRAM` | `## Tài Liệu Học Viên — I5.3: ...` |
| I4.3 | `# I4.3 — Tích hợp vào Initiative & Iterate` | `## Tài liệu học dành cho học viên` |

→ Cần parser **chống chịu header xập xệ**: title lấy từ H1 (fallback code), metadata (level/gate/version/date) lấy theo pattern hiện tại của `sessions.ts` nhưng tolerante hơn (nhiều file `main-content` không có blockquote `**Level:**`).

### 2.2 Components có sẵn — reuse được

| Component | Hiện có | Cần thêm cho learner |
|---|---|---|
| `MarkdownView` (`components/markdown/markdown.tsx`) | ✅ GFM + slug + autolink, map element → class | **Add**: copy button cho code block (top-right), language label (top-left) |
| `prose.css` | ✅ `max-width: 72ch`, `font-size: 18px`, `line-height: 1.7`, Be Vietnam Pro, token-only | **Already P0 spec** — không cần sửa |
| `Toc` (`components/markdown/toc.tsx`) | ✅ Extract H2/H3 + github-slugger, sticky aside | **Add**: scrollspy active highlight (IntersectionObserver → client component) |
| `Sidebar` (`components/shell/sidebar.tsx`) | ✅ 5 level tree, sticky, active highlight, server component | **Wrap**: drawer trên mobile (hamburger), giữ sidebar desktop |
| `SiteHeader` | ✅ Nav "Buổi học / Lộ trình / Huy hiệu" | **Add**: nav "Học" (learner) tách khỏi "Buổi học" (mentor), hoặc đổi label |

### 2.3 Deps đã có sẵn

`package.json` đã có: `next-themes@^0.4.6` (dark mode), `github-slugger`, `react-markdown@10`, `rehype-slug/autolink-headings`, `remark-gfm`, `lucide-react` (icon copy/chevron), `@radix-ui/react-dialog` (drawer), `@radix-ui/react-progress`. **Không cần install thêm** — surgical additions only.

### 2.4 What's missing

- Content reader cho `main-content/` — `sessions.ts` chỉ đọc `Sessions/*.md` + `Teaching-Kit-I*/*-Cam-Nang-Giang-*.md`, **chưa** đọc `main-content/`.
- Route `/learn`, `/learn/[code]`.
- Scrollspy, copy-code, drawer mobile, dark mode wiring, reading time, breadcrumb, prev/next.

---

## 3. Evaluated approaches

### 3.1 Deliver nội dung `main-content` vào learner route

| | A. Hardcode `data.ts` | **B. Mở rộng content layer** | C. Client-side fetch markdown |
|---|---|---|---|
| Sync | Stale ngay | Build-time fs read, sync git | Cần runtime fs hoặc public copy |
| Khớp kiến trúc | Trái | Đúng `sessions.ts` pattern | Paradigm xung (static export) |
| Effort | ½ ngày | ~½ ngày (add 1 hàm `getLearnerContent`) | 1 ngày + rủi ro |
| **Chọn** | — | **✓ B** | — |

→ Add `getLearnerContent(code)` vào `sessions.ts` (hoặc file mới `learner.ts`): đọc `Teaching-Kit-${code}/main-content/*-Tai-Lieu-Hoc-*.md`. Cùng pattern, cùng path-traversal guard (`^I[1-5]\.[1-3]$`), cùng `cache()`.

### 3.2 Tách route vs over-load route hiện tại

| | A. Tách `/learn` riêng | B. Toggle role trên `/sessions/[code]` | C. Thay hoàn toàn `/sessions` |
|---|---|---|---|
| Phá mentor view | Không | Không (nhưng UI phức tạp) | Có |
| Clean separation | ✅ URL = audience | ✗ mode state, link ambiguous | ✗ |
| Effort | +1 list route + 1 detail route | Toggle client + 2 content source | Move mentor view sang `/sessions/[code]/mentor` |
| **Chọn** | **✓ A** (user đã chốt) | — | — |

### 3.3 Cửa vào learner

| | `/learn` landing list 14 buổi | Home '/' thành learner hub | Thẳng `/learn/[code]` không list |
|---|---|---|---|
| Orientation | ✅ overview 14 buổi | ✅ nhưng mất dashboard home | ✗ learner lạc |
| Reuse pattern | ✅ giống `/sessions` | Phá `page.tsx` hiện tại | ✗ |
| **Chọn** | **✓** (user đã chốt) | — | — |

---

## 4. Recommended solution

**Chốt:** Thêm route `/learn` (list 14 buổi) + `/learn/[code]` (reading view), đọc `main-content/` qua hàm mới `getLearnerContent()` trong content layer. Build **9 must-have components** (research P0). Reuse `MarkdownView`, `prose.css`, `Sidebar`, `Toc` — chỉ **wrap/augment**, không rewrite.

### 4.1 Route map (sau khi thêm)

```
/                          program-home (giữ nguyên, dashboard mentor/internal)
/learn                     ← NEW: list 14 buổi (learner)
/learn/[code]              ← NEW: reading view (single col + sticky TOC + prev/next)
/sessions                  mentor list (giữ)
/sessions/[code]           mentor view side-by-side (giữ)
/sessions/[code]/print     mentor print (giữ)
/roadmap, /badges, ...     giữ
```

### 4.2 9 must-have components (research P0)

| # | Component | Status | Work |
|---|---|---|---|
| 1 | **ProseLayout** (70ch / 18px / lh 1.7 / Be Vietnam Pro) | ✅ đã có `prose.css` | 0 — reuse |
| 2 | **CourseSidebar** (left persistent desktop, drawer mobile) | ✅ có `Sidebar`, thiếu drawer | Wrap trong drawer Radix Dialog trên `<lg` |
| 3 | **LessonToc** (right sticky, **scrollspy**) | ✅ có `Toc`, thiếu active highlight | Add IntersectionObserver client wrapper, active link → `bg-[var(--brand-tint)]` |
| 4 | **PrevNextNav** (bottom + top cho bài dài) | ✗ | New server component, computed từ `listSessions()` sort |
| 5 | **ReadingProgress** (top 2px bar, indigo) | ✗ | New client component, scroll listener |
| 6 | **DarkModeToggle** (`prefers-color-scheme` + localStorage) | Deps có `next-themes` | Wire `ThemeProvider` vào `layout.tsx` + toggle button. **Risk**: verify `globals.css` có dark token vars — nếu chưa, bổ sung |
| 7 | **ReadingTime** (`~{ceil(words/200)} phút đọc`) | ✗ | New util, compute từ `main-content` word count |
| 8 | **Breadcrumb** (Program > Level > Lesson) | ✗ | New server component, 3 cấp max |
| 9 | **CodeBlock** (copy button top-right, language label, `overflow-x-auto`) | ✅ có `MarkdownView` | Augment `components.pre`/`code`: thêm wrapper `<div class="yody-code-wrap">` chứa button + label; copy dùng `navigator.clipboard.writeText` (client) |

### 4.3 Layout `/learn/[code]` (desktop)

```
┌─ SiteHeader (sticky) ─────────────────────────────────┐
│ ReadingProgress bar (2px, full-width, indigo)         │
├──────────┬───────────────────────────────────┬─────────┤
│ Sidebar  │ Breadcrumb: Program > L1 > I1.1    │ TOC     │
│ (drawer  │ ── I1.1 — AI Fundamentals ──       │ (sticky │
│  mobile) │ ~12 phút đọc · v1.0 · 21/06       │  scroll-│
│          │                                    │  spy)  │
│ L1       │ [MarkdownView: main-content]      │         │
│  I1.1 ●  │                                    │         │
│  I1.2    │ ...                                │         │
│ L2 ...   │                                    │         │
│          │ ┌─ PrevNextNav (bottom) ─────────┐ │         │
│          │ │ ← I1.1          I1.2 →         │ │         │
│          │ └────────────────────────────────┘ │         │
└──────────┴───────────────────────────────────┴─────────┘
```

Mobile: sidebar + TOC collapse vào drawer; PrevNextNav sticky bottom bar (thumb-zone).

### 4.4 Lý do chọn

- **B (content layer) thắng A**: sync git, đủ 14 buổi, khớp kiến trúc đã duyệt từ `brainstorm-yody-hoc-replace.md`.
- **Tách route thắng toggle**: URL = audience, link không ambiguous, không phá mentor view đang dùng.
- **9 must-have thắng 15 should-have**: research chỉ ra cross-course search/font toggle/bookmark = YAGNI ở 30 users. Browser Cmd+F + zoom + good sidebar đủ. Defer v2 khi pilot feedback đòi — tránh nợ kỹ thuật client-side search index.
- **Reuse thắng rewrite**: `prose.css` đã đúng P0 spec (72ch/18px/lh 1.7), `MarkdownView`/`Toc`/`Sidebar` chỉ cần augment. Surgical, KISS.

---

## 5. Implementation considerations & risks

### 5.1 Content layer addition

```ts
// src/lib/content/sessions.ts (hoặc learner.ts mới)
export const getLearnerContent = cache(async (code: string): Promise<LearnerContent | null> => {
  assertValidCode(code); // path-traversal guard
  const kitDir = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "main-content");
  // glob `*-Tai-Lieu-Hoc-*.md` OR `*.md` (tolerant — I4.3 dùng "Noi-Dung-Hoc")
  // parse H1 → title, fallback code
  // không ép header blockquote (main-content header xập xệ)
});
```

**Parser tolerante**: không ép `**Level:**`/`**Vai trò gate:**` blockquote (nhiều `main-content` không có). Level suy từ code (`I1.x` → L1, `I2.x` → L2...). Title từ H1, strip `I1.1 —` prefix.

### 5.2 Risks

| # | Rủi ro | L | I | Mitigate |
|---|---|---|---|---|
| R-L1 | **Dark mode token vars chưa có** — `next-themes` cài rồi nhưng `globals.css` có thể chưa define `--fg-1` dark | M | H | Audit `globals.css` + `colors_and_type.css` trước khi wire; nếu thiếu, add dark token block (đã có `themeColor` dark `#0e0f24` trong layout) |
| R-L2 | **Next.js 16 `params` async + `generateStaticParams`** — rule AGENTS.md bắt đọc `node_modules/next/dist/docs/` | M | H | First step của route impl: read docs. `params` là Promise, `await` |
| R-L3 | **`main-content` header xập xệ** — parser hiện tại (`sessions.ts`) hy vọng blockquote metadata | M | M | Parser mới tolerante, không share với `getSession` mentor; chỉ lấy H1 + suy level từ code |
| R-L4 | **Scrollspy = client component** — break RSC purity, thêm JS bundle | L | M | Wrap `Toc` trong thin client wrapper (`"use client"`), giữ extract logic server-side |
| R-L5 | **Copy code button** — `navigator.clipboard` cần client + secure context | L | L | Client island trong `MarkdownView` (chỉ `<pre>` wrapper), fallback `document.execCommand` |
| R-L6 | **Drawer mobile sidebar** — Radix Dialog thêm layout shift | L | L | `body-scroll-lock` không cần; Radix Dialog tự lock. Test on 375px |
| R-L7 | **`output: 'export'` + dark mode** — `next-themes` cần SSR script chặn flash | M | M | Dùng `NextThemesProvider` attribute `class` + `suppressHydrationWarning` trên `<html>` |

### 5.3 Files dự kiến (surgical)

**New:**
- `src/lib/content/learner.ts` — `getLearnerContent()`, `listLearnerSessions()`
- `src/app/learn/page.tsx` — list 14 buổi (mirror `/sessions/page.tsx` nhưng link `/learn/[code]`)
- `src/app/learn/[code]/page.tsx` — reading view (layout §4.3)
- `src/components/learn/breadcrumb.tsx`
- `src/components/learn/prev-next-nav.tsx`
- `src/components/learn/reading-progress.tsx` (client)
- `src/components/learn/reading-time.tsx`
- `src/components/learn/theme-toggle.tsx` (client, next-themes)
- `src/components/learn/course-drawer.tsx` (client wrapper quanh `Sidebar` cho mobile)

**Edit:**
- `src/lib/content/index.ts` — export `getLearnerContent`, `LearnerContent`
- `src/app/layout.tsx` — wrap `NextThemesProvider`, `suppressHydrationWarning`, nav "Học" entry
- `src/components/shell/site-header.tsx` — add nav `/learn`
- `src/components/markdown/markdown.tsx` — augment `pre`/`code` (copy button + lang label)
- `src/components/markdown/toc.tsx` — export `extractToc` (đã có) cho client scrollspy wrapper; or add `TocScrollspy` client variant
- `src/components/markdown/prose.css` — add `.yody-code-wrap`, `.yody-code-copy`, `.yody-lang-label`, dark mode overrides nếu cần

**Không đụng:**
- `/sessions/[code]/page.tsx`, `/sessions/page.tsx`, `Sidebar` core logic, `print-layout`.

---

## 6. Success metrics & validation

### Content layer
- [ ] `getLearnerContent("I1.1")` returns `{ code, title, level, markdown, wordCount, readingMinutes }`
- [ ] `listLearnerSessions()` returns 14 (đếm folder có `main-content/`)
- [ ] Parser tolerante: title từ H1 đúng cho cả 4 biến thể header (I1.1/I1.2/I5.3/I4.3)
- [ ] Path traversal: `getLearnerContent("../etc")` throw/reject

### Routes
- [ ] `/learn` list 14 buổi, group 5 level, link `/learn/[code]`
- [ ] `/learn/[code]` render `main-content` single column + TOC + prev/next + progress
- [ ] `/learn/I5.3` (header khác biệt nhất) render đúng title "Ship & Bảo Vệ Capstone"
- [ ] 404 unknown code; `dynamicParams = false`
- [ ] `/sessions/[code]` mentor view **không thay đổi** (regression check)

### Components (9 must-have)
- [ ] **ProseLayout**: 72ch / 18px / lh 1.7 (verify computed style)
- [ ] **CourseSidebar**: drawer mở trên `<lg`, persistent trên `≥lg`, active highlight
- [ ] **LessonToc**: scrollspy active link đổi màu khi scroll đến section
- [ ] **PrevNextNav**: bottom + top (xuất hiện khi bài >2000px height), `← I1.1 / I1.2 →`
- [ ] **ReadingProgress**: top bar scale 0→100% theo scroll, indigo `#2a2b86` (qua token)
- [ ] **DarkModeToggle**: toggle persist localStorage, respect `prefers-color-scheme` lần đầu, no FOUC
- [ ] **ReadingTime**: `~{N} phút đọc`, N = ceil(words/200)
- [ ] **Breadcrumb**: `Program > L1 Aware > I1.1` (3 cấp), link về `/learn` + `/learn#L1`
- [ ] **CodeBlock**: copy button click → clipboard, language label top-left, `overflow-x-auto`

### YODY DS + Next 16
- [ ] 0 emoji, 0 raw hex (grep `#[0-9a-f]{6}` trong file mới), `data-surface="app"` root
- [ ] Be Vietnam Pro inherit, token-only colors
- [ ] `npm run compile` pass
- [ ] `npm run lint` pass (--max-warnings 0)
- [ ] Read `node_modules/next/dist/docs/` cho `params` async + `generateStaticParams` trước code (rule AGENTS.md)

---

## 7. Next steps & dependencies

### Dependency graph

```
NOW ─→ G1 {audit globals.css dark tokens, read next 16 docs}
     ─→ G2 {content layer: learner.ts + index.ts export}
     ─→ G3 {route shell: /learn list + /learn/[code] skeleton reuse MarkdownView/Sidebar/Toc}
     ─→ G4 {augment components: scrollspy Toc, copy CodeBlock, drawer Sidebar}
     ─→ G5 {new components: PrevNext, Progress, ReadingTime, Breadcrumb, ThemeToggle}
     ─→ G6 {wire ThemeProvider layout.tsx, nav "Học"}
     ─→ G7 {validate: build + lint + manual 375px + dark mode toggle}
```

### Effort ước tính

| Phase | Effort | Note |
|---|---|---|
| G1 audit + research next docs | 0.25d | Risk gate cho dark mode |
| G2 content layer | 0.5d | Pattern có sẵn từ `sessions.ts` |
| G3 route shell | 0.5d | Mirror `/sessions` list, new reading layout |
| G4 augment components | 0.75d | Scrollspy + copy + drawer (client islands) |
| G5 new components | 0.75d | 5 component nhỏ |
| G6 wire theme + nav | 0.25d | |
| G7 validate | 0.25d | |
| **Tổng** | **~3.25d** | Sequential; G4/G5 có thể song song |

### Open decisions (none critical)

Tất cả blocker đã gỡ qua interview. Sẵn sàng thực thi G1 → G7.

---

## 8. Decisions (chốt 25/06/2026)

| # | Quyết sách | Chọn | Lý do |
|---|---|---|---|
| L1 | Deliver `main-content` vào learner | **B — mở rộng content layer** | Sync git, đủ 14 buổi, khớp kiến trúc |
| L2 | Tách vs toggle audience | **Tách `/learn` riêng** | URL = audience, không phá mentor view |
| L3 | Cửa vào learner | **Có `/learn` landing list** | Orientation 14 buổi, reuse pattern `/sessions` |
| L4 | Mức độ UX | **9 must-have (P0)** | Research chỉ ra should/could-have = YAGNI ở 30 users; browser Cmd+F + zoom đủ |
| L5 | Reuse vs rewrite | **Augment, không rewrite** | `prose.css` đã đúng spec, `MarkdownView`/`Toc`/`Sidebar` chỉ cần thêm feature |
| L6 | Dark mode | **Wire `next-themes` (deps có sẵn)** | NN/g khuyến nghị long-form reading; risk: audit dark token vars trước |
| L7 | Deferred (v2) | cross-course search, font-size toggle, bookmark, keyboard shortcuts, image zoom, print | YAGNI — defer khi pilot feedback đòi |

→ Tất cả quyết sách chốt. Sẵn sàng chuyển sang phase `/plan` nếu user đồng ý.

---

## Appendix — Research summary (planner agent, 13 nguồn)

**Sources**: NN/g ×6, Butterick Practical Typography, MDN, Google Fonts ×3, Stripe/Vercel/Linear docs, Tailwind Typography.

**Key findings**:
- Measure 65–75ch (Tailwind `prose` = 65ch; current `prose.css` = 72ch ✅).
- Body 18px, line-height 1.7 cho Vietnamese (diacritics stack). Current `prose.css` ✅.
- Persistent left sidebar desktop, drawer mobile — Stripe/MDN/Vercel consensus.
- Right sticky TOC với scrollspy **bắt buộc** — TOC không track = anti-pattern.
- Prev/next bottom (+ top cho bài dài).
- Reading progress top bar — subtle, low effort.
- Dark mode — NN/g explicitly recommends cho long-form.
- Mobile: drawer sidebar, sticky bottom prev/next, scroll-to-top after 1 viewport, horizontal scroll table (không reflow), image zoom cho diagram.
- Vietnamese: Be Vietnam Pro ✅ full diacritic support, line-height 1.7 practitioner convention (no peer-reviewed VN study — caveat).
- **Anti-patterns**: wall of text, forced linear progression, autoplay, popups mid-read, tiny font, non-scrollspy TOC, decorative stock imagery, bury summary at end.
- **Strongest lever**: content formatting (headings/bullets/bold/callouts/top-summary), không phải chrome widgets.

**Honest caveat**: NN/g evidence mạnh nhất về **content formatting**, không phải feature. Nếu budget tight, đầu tư vào chất lượng markdown + good `prose` stylesheet trước. Ở app này `prose.css` đã tốt — focus vào augment components.

---

*Brainstorm · v1.0 · 25/06/2026 · Solution Brainstormer session (follow-up `brainstorm-yody-hoc-replace.md`).*
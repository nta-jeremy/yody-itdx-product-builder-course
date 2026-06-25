# Brainstorm — Thay sample yody-hoc bằng nội dung Intern-Product-Builder (v1.0)

> **Phiên bản:** 1.0 · **Ngày:** 24/06/2026 · **Loại:** follow-up brainstorm (kế tiếp `brainstorm-course-build.md`) · **Vai trò:** Solution Brainstormer (phân tích + đề xuất, không code).
> **Đầu vào:** `app/src/components/yody-hoc/` (sample Harness bịa) + `docs/idea/Intern-Product-Builder/` (14 giáo án + 15 cẩm nang thật) + `plans/260624-1102-yody-course-build/` (plan đã duyệt, G1 xong, G2/G3 pending).
> **Phạm vi chốt:** Đưa nội dung Intern vào app theo đúng kiến trúc plan đã duyệt (route + content layer), **không** vá vào yody-hoc; **xóa** yody-hoc sau khi routes mới xong. Read-screen render **giáo án + cẩm nang side-by-side**.

---

## 1. Problem statement & requirements

**Vấn đề:** App chứa sample marketing hardcoded "Kỹ thuật Harness cho tác tử AI" (`yody-hoc/data.ts`, 5 module I–V bịa, 2 course card, `read-screen` nhét cứng `harness.yaml`, lifecycle/four-blocks/drop-cap "H"/blockquote). Cần **thay toàn bộ** bằng nội dung thật của chương trình Intern Product Builder (14 buổi / 5 level / 5 gate). Trong repo đã có plan được duyệt (`260624-1102-yody-course-build`) cho việc deliver Intern qua content layer + routes mới — plan đó **cố tình không đụng** yody-hoc.

**Yêu cầu (chốt sau interview):**

| # | Yêu cầu | Đo lường |
|---|---|---|
| R1 | App browse được 14 buổi Intern (giáo án + cẩm nang) thay cho sample Harness | 14 route `/sessions/[code]` render đúng file markdown tương ứng |
| R2 | Nội dung luôn đồng bộ `docs/idea/Intern-Product-Builder/` | Content layer đọc filesystem build-time, không duplicate vào `data.ts` |
| R3 | UX phản ánh đúng cấu trúc 5 level + 5 gate (không còn 5 module I–V bịa) | `/roadmap` + `/sessions` + `/sessions/[code]` |
| R4 | Đọc buổi = giáo án + cẩm nang **side-by-side** | Layout 2 cột (hoặc tab) trên `/sessions/[code]` |
| R5 | Xóa sample Harness khỏi codebase | `app/src/components/yody-hoc/` không còn tồn tại sau khi routes mới xong |
| R6 | Tuân thủ YODY DS + Next.js 16 breaking-change guard | Đọc `node_modules/next/dist/docs/` trước khi code (rule AGENTS.md) |

**Non-goals:** không rewrite 3 gốc docs, không auth/DB (đã loại ở plan gốc scope D2 static), không nhánh Non-IT, không tự chế learner-facing copy (render nguyên giáo án/cẩm nang — nội dung mentor-facing, chấp nhận được cho pilot internal).

---

## 2. Current state audit (thẳng thắn)

### 2.1 yody-hoc hiện tại

- **Paradigm sai:** client SPA `useState<Page>` (`yody-hoc.tsx:14`) — không thể `fs`-read markdown filesystem (cần Server Component App Router).
- **Hardcoded toàn bộ:** `data.ts` (164 dòng) modules I–V + 2 course cards bịa; `read-screen.tsx` nhúng `harnessYaml`, `lifecycleSteps`, `fourBlocks`, drop-cap "H", blockquote Harness — không parameter hoá được mà không phá UX.
- **Shell tốt:** `site-header.tsx` (53 dòng) + `course-sidebar.tsx` (56 dòng) đạt chuẩn YODY DS (token, Be Vietnam Pro, `data-surface`). Tuy nhiên kế thừa chúng vào routes mới = pha paradigms (client SPA shell + server content) → không推荐.
- **Dead code sớm:** `home-screen.tsx`/`list-screen.tsx`/`intro-screen.tsx`/`yody-hoc.tsx`/`data.ts`/`code-block.tsx`/`copy-toast.tsx`/`icons.tsx` → tất cả gắn Harness, không tái dùng được.

### 2.2 Plan đã duyệt vs yêu cầu mới

| Khía cạnh | Plan-2c hiện | Yêu cầu mới | Xung đột |
|---|---|---|---|
| yody-hoc | "REUSE, not edit" (`phase-2c-routes.md:18,46,201`) | **Xóa sạch** sau khi routes xong | **Override** chính sách plan — cần cập nhật plan-2c |
| Read-screen | Side-by-side giáo án + cẩm nang (`phase-2c-routes.md:113`) | Side-by-side (giống) | Không xung đột |
| Routes | `/roadmap /sessions /sessions/[code] /sessions/[code]/print / /gates /scorecard /badges /learners/[id]` | Như plan (scope D2 simplified → 7 routes public) | Không xung đột |
| `app/src/app/page.tsx` | "REWRITE from demo → dashboard" | Như plan + dashboard trỏ Intern (không còn Harness) | Không xung đột |

→ **Một override duy nhất:** plan-2c "reuse yody-hoc" → "xóa yody-hoc, build shell mới từ YODY DS tokens". Shell mới cần: site-header (logo YODYHọc + nav), course-sidebar (module 5 level thay 5 chữ I-V), print CSS. **Phần lớn logic tái chế ý tưởng** từ yody-hoc nhưng viết lại server-side friendly.

---

## 3. Evaluated approaches

### 3.1 Cách deliver nội dung Intern vào app

| | A. Vá `data.ts` (literal) | **B. Content layer + routes (plan)** | C. Hybrid: yody-hoc ăn content |
|---|---|---|---|
| Việc | Swap `data.ts`, hardcode `read-screen` sang I1.1 | Build `lib/content/` (reader) + `components/markdown/` (renderer) + routes `/sessions/[code]` đọc `docs/idea/**` build-time | Sửa yody-hoc thành client render markdown (giữ UX drop-cap/lifecycle, swap nội dung) |
| Sync nội dung | **Stale ngay** — chỉ I1.1 hardcoded, I1.2–I5.3 vapor | Luôn sync git (build-time copy) | Sync nếu copy, nhưng bundle nặng + paradigm xung |
| Khớp plan | **Trái** Conflict Prevention | **Đúng** — chính plan đã duyệt | Vỡ rule "không đụng yody-hoc" |
| YAGNI/KISS | KISS nếu stop-gap; ✗ nếu deliver thật | ✓ cả hai | ✗ monkey-patch, pha App Router + Client SPA |
| Effort | ~½ ngày | 1d (1d) + 2d (2a) + 1.5d (2c) = 4.5d | Giữa A và B, rủi ro cao |
| **Chọn** | — | **✓ B** | — |

### 3.2 Read-screen Intern: giáo án vs cẩm nang

| | B-i. Chỉ giáo án | **B-ii. Side-by-side giáo án + cẩm nang** | B-iii. Cẩm nang link ra file |
|---|---|---|---|
| UX learner | Một cột, dễ theo dõi | Hai cột (hoặc tab), đầy đủ | Một cột + link external |
| Value mentor | Thiếu cẩm nang (mentor mất tool dạy) | Mentor đọc liền cẩm nang, learner thấy cả | Mentor phải mở file riêng |
| Cost render | 1 markdown | 2 markdown (song song) | 1 markdown |
| Khớp intent plan | Nửa vời | **Đúng `phase-2c-routes.md:113`** | Sai plan |
| **Chọn** | — | **✓ B-ii** | — |

### 3.3 Xử lý yody-hoc sau khi routes mới

| | Xóa sạch | Giữ shell (header/sidebar) | Để dead code |
|---|---|---|---|
| Codebase sạch | ✓ | Gần sạch | Nợ kỹ thuật |
| Shell mới | Tự viết bằng token YODY DS | Tái chế 2 file (53+56 dòng), nhưng phải rewrite thành server-safe | — |
| Rủi ro | Shell mới cần design lại (low — đã có tokens) | Paradigm lai (client props trong server) | Lẫn lộn sau này |
| **Chọn** | **✓** | — | — |

---

## 4. Recommended solution

**Chốt:** Thực thi 3 phase pending của `plans/260624-1102-yody-course-build/` theo đúng thiết kế, với **một override duy nhất** ở plan-2c:

1. **Phase 1d (header standardization, 1d)** — unlock content layer, 0 rủi ro. Sync 28 file header từ `_version.md`, repoint "Soạn theo" → `03_Giao-An-Trien-Khai.md#2-...`.
2. **Phase 2a (content layer + markdown render, 2d)** — `lib/content/` đọc 14 sessions + 15 kits theo `sessionCode` (`I1.1`…`I5.3`), `components/markdown/` render GFM + TOC + YODY DS prose CSS. Verify Next 16 fs/`generateStaticParams`/`cache` trước khi code (rule AGENTS.md app/).
3. **Phase 2c (routes, 1.5d)** — `/roadmap` (5 level visual token), `/sessions` (list 14 + sidebar 5 level), `/sessions/[code]` (giáo án + cẩm nang side-by-side + TOC), `/sessions/[code]/print` (print CSS). **Override plan:** thay vì reuse yody-hoc, **xóa toàn bộ** `app/src/components/yody-hoc/` (13 file), viết shell mới server-safe (`site-header`, `course-sidebar`, `markdown` components) dùng YODY DS tokens. Rewrite `app/src/app/page.tsx` → program-home trỏ Intern.

**Sequence:**
```
G0 0a ✓ ─→ G1 {0b ✓, 1a ✓, 1b ✓, 1c ✓} ─→ G2 {1d, 2a} ─→ G3 {2c (override: xóa yody-hoc)} ─→ DONE
```

**Effort tăng vs plan gốc:** ~0.5d (viết lại site-header + course-sidebar server-safe thay vì reuse). Tổng plan: 9.5d → **10d**.

### 4.1 Lý do chọn

- **B thắng A:** deliver thật (14 buổi) cần content layer sync git; `data.ts` literal = stale ngay + chỉ 1 buổi hardcoded → không phải deliver.
- **B-ii thắng B-i:** plan-2c đã định side-by-side; mentor có cẩm nang ngay trên cùng route; learner nội bộ pilot chấp nhận tài liệu mentor-facing.
- **Xóa yody-hoc thắng reuse:** paradigm mismatch (Client SPA vs Server Component content) — tái chế `useState<Page>` shell sẽ phải monkey-patch props/render mode, tăng rủi ro và nợ kỹ thuật. Shell mới server-safe tốn ~0.5d nhưng sạch, dễ maintain.

---

## 5. Implementation considerations & risks

### 5.1 Override plan-2c — chi tiết

- **Files xóa:** `app/src/components/yody-hoc/` (13 file: `yody-hoc.tsx`, `data.ts`, `index.ts`, `home-screen.tsx`, `list-screen.tsx`, `read-screen.tsx`, `intro-screen.tsx`, `course-sidebar.tsx`, `site-header.tsx`, `site-footer.tsx`, `code-block.tsx`, `copy-toast.tsx`, `icons.tsx`).
- **Files tạo (2c, shell mới):** `app/src/components/shell/site-header.tsx`, `sidebar.tsx` (server components, nhận props từ route). Hoặc đơn giản hơn — inline vào route layouts.
- **Files edit:** `app/src/app/page.tsx` (rewrite từ `<YodyHoc/>` → program-home Intern), `app/src/app/layout.tsx` (giữ `data-surface="app"` + font, không cần YodyHoc wrapper).
- **Plan-2c update:** ghi rõ ở "Conflict Prevention" và "Related code files" — override cũ "REUSE yody-hoc" → "DELETE yody-hoc, build shell mới". Update phase file commit message rõ ràng.

### 5.2 Rủi ro & mitigate

| # | Rủi ro | L | I | Mitigate |
|---|---|---|---|---|
| R-Y1 | **Next.js 16 breaking changes** — `params` async, `generateStaticParams`, fs trong Server Component | M | H | Đọc `node_modules/next/dist/docs/` *first step* của 2a/2c (rule AGENTS.md) |
| R-Y2 | **Override plan gây confict** — plan-2c đã ghi "reuse", member khác_follow | L | M | Update phase-2c file inline (delta clear), PR mô tả override理由 |
| R-Y3 | **Side-by-side render nặng** — giáo án ~120 dòng + cẩm nang ~800 dòng, build-time generate 14 page xong tải không slow | L | M | Static export, `output: 'export'` (plan đã chốt), prebuild copy script |
| R-Y4 | **Mentor-facing content vs learner UX** — giáo án/cẩm nang chứa facilitator notes, không tối ưu cho learner | M | L | Pilot internal — chấp nhận được; viết learner-facing copy = scope khác (defer) |
| R-Y5 | **Sample Harness mất — link/demo cũ vỡ** — nếu có bookmark/PR cũ | L | L | Pilot internal, không external; commit xóa ghi rõ replacement |
| R-Y6 | **Shell mới design overhead** — tự viết site-header/sidebar server-safe | L | M | Reuse *ý tưởng* yody-hoc (layout pattern), YODY DS tokens đã có sẵn — tốn ~0.5d |

(R-PII đã gỡ: app static, không xử lý PII — plan gốc đã chốt.)

### 5.3 Tuân thủ ràng buộc

- **"markdown/JSON, giữ kiến trúc base+override":** Phase 1d/2a không đụng 3 gốc, chỉ sync header + build content reader.
- **"verify link Anthropic":** Phase 1b đã xong (G1).
- **"dữ liệu mẫu YODY mới":** Phase 1c đã xong (4 mock file).
- **Next.js 16 guard:** first step mỗi phase 2a/2c = read `node_modules/next/dist/docs/`.

---

## 6. Success metrics & validation

### Phase 1d (header standardization)

- [ ] 14 sessions line 4 + 14 kits header: version/date = `_version.md`, 0 `Session-Design-Framework.md` ref
- [ ] Grep version/date drift = 0

### Phase 2a (content layer + markdown render)

- [ ] `getSession("I1.1")` returns `{ sessionMarkdown, kitMarkdown, title, level, gateRole }`
- [ ] `listSessions()` returns 14 sessions
- [ ] Markdown renderer: GFM tables render, TOC anchors work, code blocks copy
- [ ] YODY DS prose: 0 raw hex, 0 emoji, Be Vietnam Pro inherit, `data-surface="app"`
- [ ] `sessionCode` regex validate `^I[1-5]\.[1-3]$` (path traversal guard)
- [ ] `npm run compile` pass

### Phase 2c (routes + yody-hoc xóa)

- [ ] `/roadmap` render 5 level (L1→L5) với token colors (L1 mint · L2-L4 iris · L5 gold — plan decision #20)
- [ ] `/sessions` list 14 buổi + sidebar 5 level (không còn 5 module I-V Harness)
- [ ] `/sessions/[code]` render **giáo án + cẩm nang side-by-side** + TOC + GFM tables
- [ ] `/sessions/[code]/print` print CSS (no nav, no sidebar)
- [ ] 404 unknown sessionCode
- [ ] **`app/src/components/yody-hoc/` không còn tồn tại** (glob = 0 file)
- [ ] `app/src/app/page.tsx` = program-home Intern (dashboard hoặc redirect `/sessions`), không còn `<YodyHoc/>`
- [ ] 0 `YodyHoc` import, 0 `harnessYaml` ref, 0 "Harness" string trong src
- [ ] YODY DS: 0 emoji, 0 raw hex, Badge variants only, `data-surface="app"`
- [ ] `npm run compile` pass

---

## 7. Next steps & dependencies

### Dependency graph

```
NOW ─→ Phase 1d (header std) ──┬──→ Phase 2a (content layer) ──→ Phase 2c (routes + xóa yody-hoc)
                                │                                   (override plan: xóa, không reuse)
                                └──→ (G2 song song: 1d ‖ 2a)
```

### Thời gian

| Phase | Effort | Note |
|---|---|---|
| 1d | 1d | Unlock content layer, 0 rủi ro |
| 2a | 2d | Verify Next 16 fs/generateStaticParams trước, add markdown deps |
| 2c | 1.5d + 0.5d override | Routes + xóa yody-hoc + shell mới server-safe |
| **Tổng** | **5d** | Sequential; G2 song song giảm ~0.5d |

### Open decisions (chờ user — none critical)

Tất cả blocker đã gỡ. Sẵn sàng thực thi theo thứ tự **1d → 2a → 2c**.

---

## 8. Decisions (chốt 24/06/2026)

| # | Quyết sách | Chọn | Lý do |
|---|---|---|---|
| Y1 | Deliver Intern content vào app | **B (plan-2a/2c)** | Sync git, đủ 14 buổi, KISS/YAGNI |
| Y2 | Read-screen Intern | **Side-by-side giáo án + cẩm nang** | Plan-2c đã định, mentor có tool đầy đủ, pilot internal OK |
| Y3 | yody-hoc sau khi routes xong | **Xóa sạch, build shell mới server-safe** | Paradigm mismatch Client SPA vs Server Component; reuse = monkey-patch + nợ |
| Y4 | Plan-2c override | **"Reuse yody-hoc" → "Delete yody-hoc, build shell mới"** | Đồng bộ intent "thay toàn bộ sample", shell mới ~0.5d |
| Y5 | Learner-facing copy | **Defer** | Nội dung mentor-facing chấp nhận được cho pilot internal; viết lại learner = scope khác |

→ Tất cả quyết sách chốt. Thực thi Phase 1d → 2a → 2c theo plan hiện có + override duy nhất ở 2c.

---

*Brainstorm · v1.0 · 24/06/2026 · Solution Brainstormer session (follow-up `brainstorm-course-build.md`).*
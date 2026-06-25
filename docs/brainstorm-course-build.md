# Brainstorm — Xây dựng YODY Product Builder Course (v1.0)

> **Phiên bản:** 1.0 · **Ngày:** 24/06/2026 · **Soạn theo:** vai trò Solution Brainstormer (chỉ phân tích + đề xuất, không code).
> **Đầu vào:** `docs/idea/` (3 file gốc v3.0 + `Intern-Product-Builder/` 14 giáo án + 15 cẩm nang) + `app/` (Next.js 16 scaffold YODY DS).
> **Phạm vi chốt:** (A) Điền canonical `00_Core/*` + (C) Polish nội dung Intern + (D) Xây app Next.js deliver course. **Bỏ (B)** nhánh AI-Training-NonIT ở phiên này.
> **Ưu tiên phục vụ:** Trainer/Mentor **và** học viên song song.
> **Ràng buộc:** markdown/JSON, giữ nguyên kiến trúc base+override · verify link Anthropic live · cần dữ liệu mẫu YODY giả lập mới.

---

## Mục lục

1. [Problem statement & requirements](#1-problem-statement--requirements)
2. [Current state audit (brutal honesty)](#2-current-state-audit-brutal-honesty)
3. [Evaluated approaches](#3-evaluated-approaches)
4. [Recommended solution](#4-recommended-solution)
5. [Implementation considerations & risks](#5-implementation-considerations--risks)
6. [Success metrics & validation](#6-success-metrics--validation)
7. [Next steps & dependencies](#7-next-steps--dependencies)
8. [Open decisions for user](#8-open-decisions-for-user)

---

## 1. Problem statement & requirements

**Vấn đề:** Bộ tài liệu `docs/idea/` đã chỉn chu về *lý thuyết* (4D AI Fluency, gate-by-evidence, base+override, rubric 20 điểm, Will FIT YODY) nhưng **thiếu phần móng cứng** mà mọi file đang tham chiếu ngược tới. Đồng thời cần một *bề mặt delivers* nội dung tới trainer/học viên thay vì để markdown rời rạc trong repo.

**Yêu cầu (theo scope đã chốt):**

| # | Yêu cầu | Đo lường được |
|---|---|---|
| A | 3 file canonical (`competency_dictionary.json`, `will_fit.json`, `progression_ladder.md`) tồn tại, self-consistent, và mọi tham chiếu `00_Core/*` trong 14 giáo án + 3 file gốc resolve đúng | 0 tham chiếu treo |
| C | 14 giáo án + 15 cẩm nang Intern đồng nhất phiên bản, link Anthropic còn sống, sửa bất nhất số buổi, bổ `scorecard_template.md` | 0 broken link · 0 inconsist |
| D | App Next.js (YODY DS) delivers nội dung course + tracking tiến độ + scorecard cho 2 nhóm user (trainer/học viên) | Render đủ 14 session + 15 cẩm nang · login 2 role · submit gate · chấm rubric |

**Non-goals (đã loại):**
- Nhánh AI-Training-NonIT (8 buổi + framework.json) — để phiên sau.
- Full LMS features (cert Open Badges, recertification, manager dashboard, cohort ops) — defer sau pilot.
- Refactor 3 file gốc v3.0 — giữ nguyên, chỉ bổ canonical bị thiếu.

---

## 2. Current state audit (brutal honesty)

### 2.1 Đã tốt (không động vào)

- **3 file gốc v3.0** (23/06/2026): taxonomy 5 level, 4D, gate-by-evidence, Harness Engineering, rubric 20 điểm, Will FIT, 22 buổi map, thư viện tài nguyên. Logic chặt.
- **14 giáo án Intern** (`Sessions/I1.1→I5.3`): theo khung 14 thành phần, backward design, 30/70, ô an toàn dữ liệu, nối rubric + gate. Chất lượng đều.
- **15 cẩm nang giảng dạy** (`Teaching-Kit-*`): talk-track từng slide, kịch bản demo có prompt thật, lab + đáp án, img/ minh hoạ. Đọc là giảng được.
- **App Next.js 16** (`app/`): scaffold YODY DS (47 shadcn components, tokens, Be Vietnam Pro, `data-surface="app"`, rules no-emoji/gold-deco). Sẵn nền UI.

### 2.2 Khoảng trống cấu trúc (nợ kỹ thuật tài liệu)

| Hạng mục | Được tham chiếu là | Thực tế trên disk |
|---|---|---|
| `00_Core/competency_dictionary.json` | "nguồn định nghĩa duy nhất", "canonical thắng khi xung đột" | **KHÔNG TỒN TẠI** |
| `00_Core/will_fit.json` | "dùng chung, không override" cho cả 2 chương trình | **KHÔNG TỒN TẠI** |
| `00_Core/progression_ladder.md` | exit criteria gate dựa vào đây (B.4.c, B.6.c, B.8.c, D.2...) | **KHÔNG TỒN TẠI** |
| `scorecard_template.md` | README Intern tham chiếu để chấm | **KHÔNG TỒN TẠI** |
| `01_AI-Training-NonIT/` | 1 trong 2 chương trình (8 buổi) | **KHÔNG TỒN TẠI** (đã loại khỏi scope) |
| `_archive/` (9 file nháp) | được nhắc ở phụ lục 01 | KHÔNG TỒN TẠI |
| `Session-Design-Framework.md` | 14 giáo án ghi "Soạn theo" | KHÔNG TỒN TẠI (nội dung nằm trong `03_Giao-An-Trien-Khai.md` §2) |

**Hệ quả:** 14 giáo án + 15 cẩm nang **tất cả đều trỏ tới vapor** ở header (`Gate theo 00_Core/progression_ladder.md mục B.X.c & D.2`). Đây là rủi ro lớn nhất — chưa build canonical thì toàn bộ nhánh Intern "lơ lửng".

### 2.3 Bất nhất nội dung Intern (cần polish)

| Vị trí | Bất nhất | Sửa |
|---|---|---|
| `Teaching-Kit-INDEX.md` header | `1.1 · 22/06/2026` | vs footer `1.0 · 21/06/2026` |
| `Teaching-Kit-INDEX.md` body | "Đủ trọn **15** buổi (I1.1 → I5.3)" | Thực tế **14** buổi/sessions/kits |
| `Teaching-Kit-INDEX.md` bảng | 14 hàng (đúng) | Text "15" sai |
| Version dates | Sessions 21/06 v1.0 · INDEX 22/06 v1.1 · 3 gốc 23/06 v3.0 | Drift 3 ngày, 3 version |
| `03_Giao-An-Trien-Khai.md` §6 L2 | `platform.claude.com/docs/...` và `docs.anthropic.com/...` cùng liệt kê | 2 URL cho 1 resource, cần verify canonical |
| Link tài nguyên | "verify 21/06/2026" | User yêu cầu verify live lại |
| `README.md` Intern | Tham chiếu `../scorecard_template.md` | File không tồn tại |

### 2.4 App Next.js — state hiện tại

- `src/app/page.tsx` chỉ demo Button/Card/Badge. **0 route delivers course**.
- `src/components/ui/` 47 shadcn, `src/styles/colors_and_type.css` tokens, `src/lib/fonts.ts` Be Vietnam Pro. Đủ nền.
- **0 state layer** (no Prisma, no DB, no auth). `package.json` chỉ có Next/React/Tailwind/shadcn deps.
- `AGENTS.md` cảnh báo: "This is NOT the Next.js you know" — Next 16 breaking changes, đọc `node_modules/next/dist/docs/` trước khi code.

### 2.5 Mâu thuẫn với tài liệu gốc (cần surface thẳng)

`03_Giao-An-Trien-Khai.md` §5.4 **khuyến nghị LMS**:
- A. Lightweight Google Workspace (pilot)
- B. Moodle/TalentLMS (rollout)
- C. Hybrid Anthropic Academy + LMS

→ **Build custom Next.js LMS KHÔNG nằm trong khuyến nghị gốc**. Đây là chọn lựa có chủ đích, phải nói thẳng: chỉ hợp lý nếu YODY muốn (i) full brand control + UX đồng bộ YODY DS, (ii) không recurring license, (iii) có dev capacity duy trì. Nếu không thoả 3 điều kiện → mua Moodle/TalentLMS rẻ hơn. **Build custom = option D (undocumented), trade-off phải được accept rõ.**

---

## 3. Evaluated approaches

### 3.1 Scope A — Canonical `00_Core/*`

**Hai cách tổ chức:**

| | A1. Tách 3 file độc lập | A2. Gộp + tham chiếu |
|---|---|---|
| Mô tả | 3 file riêng: dictionary.json (A+B+C), will_fit.json (D), progression_ladder.md (ladder+gate) | 1 file core.json + ladder.md, will_fit tham chiếu |
| Ưu | Khớp exactly tham chiếu trong docs (`00_Core/competency_dictionary.json`, `00_Core/will_fit.json`, `00_Core/progression_ladder.md` đều được nhắc đích danh) | Ít file, dễ duy trì |
| Nhược | Phải giữ 3 file sync version | Vỡ tham chiếu đã viết trong 14 giáo án + 3 gốc → phải sửa tất cả |
| **Chọn** | **A1** — tôn trọng tham chiếu đã có, surgical | — |

**Bài toán numbering `progression_ladder.md` (CRITICAL):**

14 giáo án trỏ tới các mục cụ thể: `B.4 & D.2`, `B.4.c`, `B.6.c & D.2`, `B.8 & D.2`, `B.8.c & D.2`, `B.3 & A.3`. Phải thiết kế numbering khớp **trước khi build**, không thì vỡ tham chiếu hàng loạt.

**Đề xuất numbering (xuất phát từ tham chiếu ngược):**

```
A. Nguyên tắc nối rubric ↔ ladder
  A.1 Rubric đo chiều cao
  A.2 Ladder vẽ con đường
  A.3 Khía cạnh chủ đạo + behavioral indicators per level  ← I1.1 cite "A.3"
B. Exit criteria per level + gate
  B.1 Nguyên tắc gate-by-evidence
  B.2 Bản đồ gate & người duyệt (tổng)
  B.3 L1 Aware — exit criteria  ← I1.1 cite "B.3"
  B.4 L2 Operator — exit criteria + Gate L1→L2
    B.4.c sub-item exit criteria Gate L1→L2  ← I1.1/I1.2 cite
  B.5 L3 Builder — exit criteria
  B.6 Gate L2→L3 & L3→L4
    B.6.c sub-item Gate L3→L4  ← I3.3 cite
  B.7 L4 Integrator — exit criteria + Gate L4→L5
  B.8 L5 Architect — exit criteria + Gate tốt nghiệp
    B.8.c sub-item Gate tốt nghiệp  ← I5.1/I5.3 cite
D. Gate map + người duyệt (chi tiết)
  D.2 Bảng gate & người duyệt  ← tất cả session cite
```

→ Phần `C` có thể là Will FIT cross-ref (hoặc bỏ, vì Will FIT ở `will_fit.json`). **Đây là quyết sách thiết kế numbering — phải chốt trước khi implement.**

### 3.2 Scope C — Polish Intern

**Hai mức polish:**

| | C1. Surgical (chỉ sửa sai) | C2. Polish + standardize |
|---|---|---|
| Việc | Fix 15→14, sync version, verify link, bổ scorecard_template.md | C1 + tạo `_version.md` nguồn sự thật version/date, chuẩn hoá header tất cả 14+15 file, reconcile URL Anthropic, thêm cross-link giữa giáo án ↔ cẩm nang |
| Ưu | Nhanh, ít rủi ro | Bền vững, dễ maintain, phát hiện inconsistency sâu hơn |
| Nhược | Version drift tái diễn | Tốn thời gian, chạm nhiều file |
| **Chọn** | **C2** — đã có ràng buộc "verify link" + "dữ liệu mẫu mới", surgical không đủ | — |

**Link verification strategy:**

Anthropic đã restructure URL (có cả `platform.claude.com/docs` và `docs.anthropic.com/en/docs` cho cùng prompt-engineering). Cần:
1. Fetch mỗi URL live, bắt HTTP 200 + nội dung đúng topic.
2. Chọn **canonical URL** (Anthropic mới hướng tới `platform.claude.com`/`claude.com/resources`).
3. Log URL cũ → redirect tại source (hoặc cập nhật luôn).
4. Đánh dấu `verified: YYYY-MM-DD` để biết khi nào cần re-check.

**Dữ liệu mẫu YODY mới (user yêu cầu):**

Hiện có: `I1.1` 30 review áo + mô tả (đã giả lập). Cần bổ sung cho app (scope D) và có thể dùng lại cho polish Intern:
- **Learner profiles (mock):** 8-10 nhân vật giả, mỗi người 1 phòng ban/level/gate-status (không PII).
- **Cohort mock:** 2 cohort (Non-IT pilot, Intern) với tiến độ khác nhau.
- **Gate evidence samples:** sample nộp gate L1→L2, L3→L4, L5 (đã ẩn PII).
- **Scorecard samples:** 3-4 scorecard điền mẫu (đầu vào/giữa/cuối) cho cả Non-IT lẫn Intern.
- **Badge inventory:** 5 badge (L1-L5) + metadata.

Lưu ở `docs/idea/_mock-data/` (gitignored nếu chứa PII thật — nhưng đây là mock, commit được). **Ràng buộc:** mock phải real-enough để demo nhưng không nhầm với dữ liệu thật (prefix `mock_`).

### 3.3 Scope D — App Next.js deliver course

**Hai kiến trúc:**

| | D1. Full custom LMS | D2. Companion surface + state layer |
|---|---|---|
| Scope | Thay Moodle/TalentLMS: quiz engine, cert Open Badges, recert, cohort ops, manager dashboard, gating | **Chỉ** browse content + roadmap + gate tracker + scorecard input + learner progress |
| Content | Markdown trong repo → render | Markdown → render (như D1) |
| State | Prisma + DB: learners, progress, gates, scorecards, certs, cohorts | Prisma + DB: learners, progress, gates, scorecards (subset) |
| Auth | better-auth, 3-4 roles (learner/mentor/council/admin) | better-auth, 2-3 roles (learner/mentor/council) |
| Khối lượng | ~3-4x D2 | Baseline |
| Trade-off | Full control, no license, contradict docs §5.4 | Fit YAGNI/KISS, complement bought LMS sau pilot, fit docs |
| Rủi ro | Over-engineering cho pilot, dev capacity tied down | Phải mua LMS sau nếu cần quiz/cert (nhưng docs khuyến nghị vậy) |
| **Chọn** | — | **D2** — KISS/YAGNI, khớp khuyến nghị docs, đủ cho trainer+học viên |

**Routes đề xuất (D2):**

```
/                           Dashboard (role-aware)
/roadmap                    Lộ trình 5 level (visual, public)
/sessions                   List 14 buổi Intern (+ slot Non-IT sau)
/sessions/[code]            Giáo án + cẩm nang side-by-side (vd /sessions/I1.1)
/sessions/[code]/print      Bản in cho trainer
/gates                      Gate tracker (learner: của mình; mentor: queue duyệt)
/gates/[id]                 Chi tiết 1 gate submission + approve
/scorecard                  Rubric 20 điểm input (mentor) / view (learner)
/scorecard/[id]             Scorecard chi tiết + history
/badges                     Badge inventory + của learner
/learners/[id]              Profile + progress (mentor/council view)
/admin                      Cohort + content sync (sau)
```

**Kiến trúc data:**

```
Content (read, git-versioned)        State (write, DB)
─────────────────────────            ───────────────────
docs/idea/**/*.md  ──→ render       Prisma + SQLite (dev)
  via file-system route                 / Postgres (prod)
  stable ID = session code           Models: Learner, Cohort,
  (I1.1, I1.2, ...)                   GateSubmission, Scorecard,
                                       Badge, SessionProgress
```

**Tách bạch content vs state** là quyết sách quan trọng: nội dung course nằm trong git (version-controlled, review-able), state học viên nằm trong DB. Foreign key = `sessionCode` (string stable, không phải filePath) → đổi tên file không vỡ DB.

**Tech stack bổ sung (cần add vào app):**

- `prisma` + `@prisma/client` — ORM
- `better-auth` — auth (skill `ck:better-auth` có sẵn)
- `next-mdx-remote` hoặc `react-markdown` + `remark-gfm` — render markdown giáo án/cẩm nang
- `rehype-slug` + `rehype-autolink-headings` — TOC cho giáo án dài
- `zod` — validate gate submission + scorecard input
- `lucide-react` — icon (đã có shadcn dep)

**Không thêm (YAGNI):**
- CMS (Sanity/Contentful) — content đã trong git, đủ.
- Full-text search engine — 14 buổi, `cmd-K` đủ.
- Email service — thông báo gate qua Slack/internal sau.
- Video hosting — pre-work link tới Anthropic Academy.

---

## 4. Recommended solution

### Phasing (3 phase, có thể chạy 0+1 song song rồi 2)

```
Phase 0 — Canonical foundation (A)        [block 1, 2]
  ├─ 0.1 Thiết kế numbering progression_ladder.md (chốt với user)
  ├─ 0.2 Build 00_Core/competency_dictionary.json
  ├─ 0.3 Build 00_Core/will_fit.json
  ├─ 0.4 Build 00_Core/progression_ladder.md
  └─ 0.5 Verify: mọi ref 00_Core/* trong 14 sessions + 3 gốc resolve

Phase 1 — Polish Intern (C)              [sau 0, hoặc song song 0.1]
  ├─ 1.1 Fix Teaching-Kit-INDEX (15→14, version sync)
  ├─ 1.2 Tạo _version.md (nguồn sự thật version/date)
  ├─ 1.3 Verify live tất cả link Anthropic (L1-L5 + per-session)
  ├─ 1.4 Reconcile platform.claude.com vs docs.anthropic.com URLs
  ├─ 1.5 Bổ scorecard_template.md (khớp rubric 02_Khung-Nang-Luc)
  ├─ 1.6 Chuẩn hoá header 14 sessions + 15 cẩm nang
  ├─ 1.7 Tạo _mock-data/ (learners, cohorts, gates, scorecards, badges)
  └─ 1.8 Repoint Session-Design-Framework.md → 03 §2 (hoặc tạo stub)

Phase 2 — App companion surface (D2)     [sau 0, 1]
  ├─ 2.1 Content layer: file-system route đọc docs/idea/**/*.md
  ├─ 2.2 Prisma schema + migration (Learner, Cohort, GateSubmission, Scorecard, Badge, SessionProgress)
  ├─ 2.3 better-auth: 3 role (learner, mentor, council)
  ├─ 2.4 Route / + /roadmap (public, YODY DS visual 5 level)
  ├─ 2.5 Route /sessions + /sessions/[code] (render markdown + TOC + print)
  ├─ 2.6 Route /gates + /gates/[id] (submit + approve workflow)
  ├─ 2.7 Route /scorecard + /scorecard/[id] (rubric 20 điểm input + history)
  ├─ 2.8 Route /badges + /learners/[id]
  ├─ 2.9 Seed mock data từ _mock-data/
  └─ 2.10 PII compliance: data residency doc + redaction at intake
```

**Phase 3 (defer, ngoài scope phiên này):** Full LMS features (D1) — quiz engine, Open Badges cert, recertification, manager dashboard, cohort ops. Chỉ build nếu pilot D2 chứng minh giá trị + YODY không muốn mua Moodle/TalentLMS.

### Lý do chọn

1. **A1 (3 file tách)** — tôn trọng tham chiếu đã viết trong 14 giáo án + 3 gốc, surgical, không vỡ docs.
2. **C2 (polish + standardize)** — ràng buộc verify link + mock data mới đã vượt surgical; làm triệt để 1 lần.
3. **D2 (companion surface)** — KISS/YAGNI, khớp khuyến nghị `03 §5.4`, đủ phục vụ trainer + học viên, không cưới mình vào vai trò LMS vendor.

---

## 5. Implementation considerations & risks

### 5.1 Rủi ro & mitigate

| # | Rủi ro | Mitigate |
|---|---|---|
| R1 | **Numbering `progression_ladder.md` vỡ tham chiếu 14 sessions** — nếu B.4.c/B.6.c/B.8.c không khớp, tất cả session header sai | Chốt numbering **trước** khi build (Phase 0.1), map ngược từ tham chiếu hiện có, update session header nếu cần (allowed: content ref ≠ architecture) |
| R2 | **Next.js 16 breaking changes** — AGENTS.md cảnh báo rõ, training data lạc hậu | Đọc `node_modules/next/dist/docs/` trước khi code Phase 2; dùng skill `ck:frontend-development` |
| R3 | **Scope creep D2→D1** — "deliver course" dễ kéo full LMS | D2 chốt scope rõ; D1 chỉ sau pilot có data |
| R4 | **Content vs state coupling** — đổi tên file markdown → DB ref vỡ | Foreign key = `sessionCode` (stable string), không phải filePath |
| R5 | **PII learner data (Luật 91/2025/QH15 đã hiệu lực 01/01/2026)** — app lưu learner progress = PII | Data residency chọn ở Phase 2.2; redaction at intake; auth required; document luồng xử lý sự cố |
| R6 | **Link rot Anthropic** — đã restructure URL (platform.claude.com vs docs.anthropic.com) | Verify live Phase 1.3; dùng canonical hub URL; ghi `verified:` date |
| R7 | **Mock data realism** — cần YODY domain flavor (retail/fashion/SC) | Reuse I1.1 mock (30 review) + xin input YODY domain person cho department samples |
| R8 | **Version drift tái diễn** — 3 nguồn version/date khác nhau | `_version.md` làm nguồn sự thật duy nhất ở Phase 1.2 |
| R9 | **Canonical self-consistency** — JSON weight phải = 100%, điểm = 5.0/khía cạnh | Validate schema ở Phase 0.5 (script hoặc manual) |
| R10 | **3 gốc docs tham chiếu `_archive/` không tồn tại** — phụ lục 01 nhắc 9 file nháp | Hoặc tạo `_archive/` rỗng + README giải thích, hoặc sửa tham chiếu trong 01 (allowed: content fix) |

### 5.2 Quyết định kiến trúc app

- **Render markdown:** `next-mdx-remote` ưu tiên (hỗ trợ component MDX sau nếu cần embed interactive). `react-markdown` fallback nếu MDX không cần.
- **DB:** SQLite (dev, file-based, zero-ops) → Postgres (prod). Prisma hỗ trợ cả hai, migrate dễ.
- **Auth:** `better-auth` (skill có sẵn, TypeScript-native, hỗ trợ role + session). Không NextAuth (lỗi thời).
- **Styling:** Tuân thủ YODY DS rules — no emoji (dùng Badge variant `live/build/gap/plan`), no raw hex (dùng token), gold decoration only, `data-surface="app"`.
- **Content routing:** `app/sessions/[code]/page.tsx` đọc file từ `docs/idea/Intern-Product-Builder/Sessions/${code}-*.md` + `Teaching-Kit-${code}/*.md` tại build/run time. Stable code = `I1.1`, `I1.2`...

### 5.3 Tuân thủ ràng buộc user

- **"markdown/JSON, giữ nguyên kiến trúc":** Phase 0, 1 chỉ thêm file mới + sửa surgical, không refactor 3 gốc. Phase 2 thêm app code (allowed: app là surface mới).
- **"verify link Anthropic":** Phase 1.3 dùng `webfetch` live check từng URL, log kết quả.
- **"dữ liệu mẫu YODY giả lập mới":** Phase 1.7 tạo `_mock-data/` cho app + polish. Prefix `mock_`, không PII, real-enough flavor.

---

## 6. Success metrics & validation

### Phase 0 (Canonical)

- [ ] 3 file tồn tại: `00_Core/competency_dictionary.json`, `00_Core/will_fit.json`, `00_Core/progression_ladder.md`
- [ ] JSON valid + schema self-consistent: mỗi khía cạnh weight tổng = 100%, điểm tổng = 5.0
- [ ] Mọi tham chiếu `00_Core/...` trong 14 sessions + 3 gốc docs resolve tới section thật
- [ ] Numbering `B.4.c`, `B.6.c`, `B.8.c`, `D.2`, `A.3`, `B.3` tồn tại đúng ý nghĩa

### Phase 1 (Polish Intern)

- [ ] `Teaching-Kit-INDEX.md`: count = 14, version đồng nhất
- [ ] 0 broken Anthropic link (HTTP 200 + đúng topic)
- [ ] `scorecard_template.md` tồn tại, khớp rubric trong `02_Khung-Nang-Luc-Danh-Gia.md` Phần IV
- [ ] 14 sessions + 15 cẩm nang có header version/date đồng nhất (lấy từ `_version.md`)
- [ ] `_mock-data/` tồn tại với ≥8 learner profiles, 2 cohort, 3 gate samples, 4 scorecard samples, 5 badge

### Phase 2 (App)

- [ ] App render đủ 14 session + 15 cẩm nang với YODY DS (no emoji, token colors, Be Vietnam Pro)
- [ ] Login 3 role (learner/mentor/council) via better-auth
- [ ] Learner thấy: roadmap 5 level, level hiện tại, % tới level kế, session sắp tới, pre-work, badge đã đạt
- [ ] Mentor thấy: queue gate duyệt, input scorecard 20 điểm, history learner
- [ ] Council thấy: gate tốt nghiệp L5 queue
- [ ] Submit gate evidence + approve workflow chạy end-to-end
- [ ] PII: no PII trong mock, auth required cho stateful op, data residency doc tồn tại

---

## 7. Next steps & dependencies

### Dependency graph

```
Phase 0.1 (numbering chốt) ──┬──→ Phase 0.2-0.5 (build canonical)
                              └──→ Phase 1.1-1.6 (polish, cần ref canonical)
                                          │
                                          └──→ Phase 1.7 (mock data)
                                                      │
                                                      └──→ Phase 2 (app)
```

- **Phase 0.1 là blocker toàn bộ** — numbering phải chốt với user trước.
- Phase 0.2-0.5 và Phase 1.1-1.6 chạy song song sau 0.1.
- Phase 1.7 (mock data) và Phase 2 (app) song song được sau khi content layer (2.1) xong.

### Thời gian ước lượng (thô, cho planning)

| Phase | Effort | Ghi chú |
|---|---|---|
| 0 | 1-2 ngày | 3 file, schema design cẩn thận |
| 1 | 2-3 ngày | Verify link tốn thời gian, polish 29 file |
| 2 | 5-8 ngày | App scaffold đã có, chủ yếu route + Prisma + auth + render |
| **Tổng** | **8-13 ngày** | Sequential; song song giảm ~30% |

### Open decisions (chờ user — xem §8)

- Numbering `progression_ladder.md` (R1)
- Data residency DB (R5)
- Full LMS hay companion (D1 vs D2 — đã recommend D2, chờ accept)
- `_archive/` handling (R10)

---

## 8. Decisions (chốt 24/06/2026)

| # | Quyết sách | Chọn | Lý do |
|---|---|---|---|
| 1 | Numbering `progression_ladder.md` | **Accept sơ đồ §3.1** | Phù hợp mọi tham chiếu đã viết trong 14 sessions + 3 gốc, surgical |
| 2 | App scope | **D2 Companion** | KISS/YAGNI, khớp docs §5.4, đủ trainer+học viên, không cưới mình vào vai LMS vendor |
| 3 | Data residency DB | **Defer đến Phase 2.2** | Phase 0+1 không cần DB; quyết khi rõ yêu cầu + input IT ops |
| 4 | `_archive/` 9 file nháp | **Placeholder rỗng + README** | Không tìm khôi phục; tham chiếu trong 01 mang tính lịch sử |

→ Tất cả blocker đã gỡ. Sẵn sàng chuyển sang `/plan` để tạo implementation plan chi tiết.

---

*Brainstorm · v1.0 · 24/06/2026 · Solution Brainstormer session.*
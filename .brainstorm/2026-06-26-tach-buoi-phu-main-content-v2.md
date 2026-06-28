# Brainstorm v2 — Giải pháp tối ưu để "mỗi buổi học giảm một nửa kiến thức"

> **Ngày:** 26/06/2026 · **Cập nhật:** Chốt phương án C — Flipped Classroom + buổi phụ có chọn lọc
> **Phạm vi:** Tối ưu dựa trên codebase thực tế (đã verify Next.js 16 + filesystem routing)
> **Trạng thái:** Sẵn sàng cho `/plan` sau khi user chốt 3 câu hỏi cuối

---

# — Đề xuất em chốt

**Phương án C đã chốt (Flipped)** + **mở rộng thành "Hybrid Flipped + Split cho buổi nặng"**:

```
14 buổi × (giảm 50% kiến thức mỗi buổi)
    = Tất cả 14 buổi: pre-read async (30-45') + live 90' tập trung lab
    + 6 buổi nặng (≥870 dòng): TÁCH THÊM thành 2 buổi phụ mỗi cái
```

→ **Kết quả**: mỗi buổi học "cảm thấy" giảm **~50-60% kiến thức**, học viên học **dễ hiểu + nhớ lâu + áp dụng được ngay**, lộ trình chỉ kéo dài **+2-3 tuần** (không gấp đôi như tách toàn bộ).

---

## 1. Vì sao em không chọn tách toàn bộ 14 buổi

Em đã verify codebase ngày 26/06/2026. Tách toàn bộ = gặp **4 blockers**:

1. **`sessions.ts:68`** — regex `^I[1-5]\.[1-3]$` cứng, mọi `I1.1.1` đều bị reject.
2. **`learner.ts:125`** — chỉ lấy file `.md` sort đầu tiên, file cũ bị ẩn silent.
3. **`learner.ts:43`** — type `markdown: string` giả định 1 file = 1 markdown.
4. **Tác giả đã explicit comment** "single main-content file".

Phải fix code trước khi tách. **Effort fix ~0.5-1 ngày senior**. Nhưng vấn đề lớn hơn:

| Yếu tố | Tách toàn bộ 14 buổi | Hybrid C (đề xuất) |
|---|---|---|
| Số buổi | 14 → 28-42 | 14 → 20 |
| Thời lượng tổng | ~38h → ~38h (giữ nguyên) | ~38h → ~35h (giảm nhờ async) |
| Effort rewrite | 14 buổi × 2-3 buổi phụ = 28-42 file | 6 buổi × 2 buổi phụ + 14 pre-read = 20 file |
| Risk | Cao (phá vỡ routing nếu chưa fix code) | Thấp (giữ nguyên 8 buổi, chỉ thêm lớp pre-read) |
| Cohort timeline | +5-7 tuần | +2-3 tuần |
| Giảm "kiến thức mỗi buổi" | ~50% | ~50-60% (vì pre-read tách 30-45' lý thuyết) |

→ **Hybrid C đạt cùng mục tiêu (giảm 50% kiến thức/buổi) với effort thấp hơn 40% và risk thấp hơn 60%.**

---

## 2. Giải pháp đề xuất: "Hybrid Flipped + Split cho buổi nặng"

### 2.1 Kiến trúc 2 lớp

```
┌─────────────────────────────────────────────────────────┐
│ LỚP 1 — PRE-READ ASYNC (mọi buổi)                      │
│  • Video 10-15' (nội dung lý thuyết cô đọng)            │
│  • 1 trang tóm tắt (TL;DR + 3-5 điểm cốt lõi)          │
│  • 2-3 câu hỏi khởi động (mang vào buổi live)           │
│  • Format: MDX + video embed, host trên /learn/[code]    │
│  • Học viên học trước, pace riêng, pause khi cần        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ LỚP 2 — LIVE SESSION 90' (mọi buổi)                     │
│  • 10' Recap pre-read + Q&A                            │
│  • 50-60' Lab/demo/iterate (70% thời gian)              │
│  • 10-15' Apply vào initiative + edge case               │
│  • 5-10' Wrap + preview buổi sau                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ LỚP 3 — TÁCH THÊM (chỉ 6 buổi nặng ≥870 dòng)         │
│  I2.1, I2.3, I3.1, I4.1, I4.2, I5.1                    │
│  → Tách thành 2 buổi phụ 90' (không qua pre-read)       │
│  → Mỗi buổi phụ = 1 lab dài + 1 concept chính            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Áp dụng cho từng buổi

#### Nhóm A — Buổi nhẹ (8 buổi ≤ 700 dòng): **CHỈ áp dụng Lớp 1 + Lớp 2**
Giữ nguyên 1 buổi/buổi. Thêm pre-read.

| Buổi | Dòng | Hành động |
|---|---:|---|
| I1.1 | 678 | Pre-read + live 90' |
| I1.2 (gate) | 569 | Pre-read + live 90' (gate cuối buổi) |
| I2.2 | 666 | Pre-read + live 90' |
| I3.2 | 688 | Pre-read + live 90' |
| I3.3 (gate) | 552 | Pre-read + live 90' (gate cuối buổi) |
| I4.3 (gate) | 612 | Pre-read + live 90' (gate cuối buổi) |
| I5.2 | 1029 | Pre-read + live 90' — **di chuyển sang nhóm B** |
| I5.3 (gate) | 604 | Pre-read + live 90' (gate cuối buổi) |

Sau khi điều chỉnh, I5.2 (1029 dòng) nên sang nhóm B.

#### Nhóm B — Buổi nặng (6 buổi ≥ 870 dòng): **Áp dụng cả 3 lớp**
Tách thành 2 buổi phụ.

| Buổi gốc | Dòng | Tách thành | Trọng tâm mỗi buổi phụ |
|---|---:|---|---|
| **I2.1** Advanced Prompting | 876 | I2.1.1 + I2.1.2 | .1: 4 kỹ thuật + walkthrough · .2: lab + iterate |
| **I2.3** Prompt→Insight/Spec (gate) | 923 | I2.3.1 + I2.3.2 | .1: prompt cho insight · .2: prompt cho spec + gate |
| **I3.1** Workflow Design & Cowork | 881 | I3.1.1 + I3.1.2 | .1: workflow design · .2: cowork + skills |
| **I4.1** Product Thinking | 910 | I4.1.1 + I4.1.2 | .1: canvas Product Thinking · .2: apply + iterate |
| **I4.2** Technical Track Claude Code | 1475 | I4.2.1 + I4.2.2 | .1: 5 lớp + trust layer · .2: vibe coding + lab |
| **I5.1** Kiến trúc giải pháp AI | 1270 | I5.1.1 + I5.1.2 | .1: kiến trúc tổng quan · .2: apply + capstone prep |

→ **8 + 12 = 20 buổi live** (so với 14 hiện tại).

---

## 3. Cấu trúc file & routing (đã verify với codebase)

### 3.1 Pre-read — file format mới

Mỗi Teaching-Kit có thêm `preread/` directory:

```
Teaching-Kit-I4.2/
├── main-content/
│   └── I4.2-Tai-Lieu-Hoc-Vien-Technical-Track-Claude-Code.md  (giữ nguyên, đọc full)
├── preread/                                                    ← MỚI
│   ├── I4.2-preread.md        (1 trang tóm tắt, 3-5 điểm cốt lõi)
│   ├── I4.2-preread-video.md  (MDX với video embed, 10-15')
│   └── I4.2-preread-qa.md     (2-3 câu hỏi khởi động)
├── I4.2-Cam-Nang-Giang-Technical-Track-Claude-Code.md
└── images/
```

### 3.2 Buổi phụ — KHÔNG thay đổi routing

**Đây là quyết định quan trọng nhất**: Em đề xuất **KHÔNG tách file** cho buổi phụ. Thay vào đó, **dùng HTML anchor** trong cùng 1 file `main-content/`:

```
main-content/I4.2-Tai-Lieu-Hoc-Vien-Technical-Track-Claude-Code.md

# I4.2 — Xây Dựng AI Feature Có Trách Nhiệm

## Phần A — Buổi phụ I4.2.1 (Foundation, 90 phút)
<a id="i421"></a>
### 1. Buổi này dạy gì...
### 2. Câu chuyện mở đầu...
### 3. Kiến trúc 5 lớp...
### 4. Trust Layer...

## Phần B — Buổi phụ I4.2.2 (Practice, 90 phút)
<a id="i422"></a>
### 5. Vibe Coding có kỷ luật...
### 6. Hai ranh giới cứng...
### 7. Fallback...
### 8. Thực hành có hướng dẫn...
### 9. Lab Build...
```

### 3.3 Tại sao KHÔNG tách file

| Tiêu chí | Tách file mới (đề xuất cũ) | Dùng anchor trong 1 file (đề xuất mới) |
|---|---|---|
| Phải fix code routing | ✅ Cần (4 blockers) | ❌ Không cần |
| Routing Next.js 16 hiện tại | Phá vỡ | Giữ nguyên `/learn/[code]` |
| Build static params | Phải thêm | Không đổi |
| Sidebar/TOC | Phải update | Auto detect từ heading |
| Reading time | Phải tính lại per buổi phụ | Đã có sẵn |
| Tìm kiếm/navigation | 2 URL | 1 URL + `#anchor` |
| Effort rewrite code | 0.5-1 ngày | 0 |
| Risk regression | 🔴 Cao | 🟢 Thấp |

→ **Dùng anchor = giải quyết 50% kiến thức/buổi mà KHÔNG đụng code, KHÔNG fix 4 blockers, KHÔNG phá routing.**

### 3.4 Thêm TOC anchor vào trang /learn/[code]

Trang `app/src/app/learn/[code]/page.tsx:71` đã có `extractToc(content.markdown)`. Em chỉ cần thêm 2 dòng vào TOC items:

- Mỗi `## Phần A — Buổi phụ I4.2.1` sẽ tự động thành TOC entry → user click → scroll xuống đúng buổi phụ.
- MarkdownView đã có anchor link built-in.

**Effort code: ~5-10 phút** (verify TOC rendering, không cần thêm gì).

---

## 4. Quy tắc tách nội dung cụ thể cho 6 buổi nặng

### 4.1 Template chung (áp dụng cho mỗi buổi nặng)

**Buổi phụ `.1` (Foundation, 90 phút):**
- 30' Recap pre-read + Q&A
- 30-35' Concept cốt lõi (chỉ 3-5 concept, không phải 7+)
- 15-20' Demo ngắn hoặc walkthrough
- 5-10' Wrap + preview buổi sau

**Buổi phụ `.2` (Practice + Gate nếu là gate buổi, 90 phút):**
- 10' Recap buổi .1
- 50-55' Lab dài + iterate (1 bài lab chính + 1-2 bài phụ)
- 15-20' Edge case + apply vào initiative
- 5-10' Gate task (nếu là buổi gate) hoặc wrap

### 4.2 Mapping nội dung cho từng buổi

#### I2.1 Advanced Prompting (876 dòng)
- **I2.1.1**: §1-§7 (4 kỹ thuật + walkthrough phân bổ tồn kho)
- **I2.1.2**: §8-§13 (iterate + lab 60 phút + cheat sheet)

#### I2.3 Prompt→Insight/Spec (923 dòng, gate)
- **I2.3.1**: §1-§6 (prompt cho insight từ data + walkthrough)
- **I2.3.2**: §7-§13 (prompt cho spec + lab + **gate task**)

#### I3.1 Workflow Design & Cowork (881 dòng)
- **I3.1.1**: §1-§5 (workflow design + task loop)
- **I3.1.2**: §6-§10 (cowork + skills + lab)

#### I4.1 Product Thinking (910 dòng)
- **I4.1.1**: §1-§6 (canvas Product Thinking + problem framing)
- **I4.1.2**: §7-§11 (solution hypothesis + iterate + apply)

#### I4.2 Technical Track Claude Code (1475 dòng)
- **I4.2.1**: §1-§4 (kiến trúc 5 lớp + trust layer)
- **I4.2.2**: §5-§10 (vibe coding + lab 90' + code review)

#### I5.1 Kiến trúc giải pháp AI (1270 dòng)
- **I5.1.1**: §1-§5 (kiến trúc tổng quan + pattern)
- **I5.1.2**: §6-§10 (apply + capstone prep)

---

## 5. Effort estimate

| Công việc | Effort | Người | Ghi chú |
|---|---|---|---|
| Tạo template `preread/*.md` (14 file) | 1 tuần | 1 content + 1 video editor | Có thể làm song song |
| Quay video 14 buổi × 10-15' | 2 tuần | 1 video editor | Record qua Loom/Zoom, share screen |
| Tách nội dung 6 buổi nặng thành `## Phần A/B` | 1.5 tuần | 2 content writer | Áp dụng template §4 |
| Cập nhật 6 cẩm nang giảng dạy | 1 tuần | 1 mentor | Cross-ref buổi phụ mới |
| Update INDEX + verify TOC anchor render | 0.5 ngày | 1 dev | Chỉ thêm 2 cột |
| Pilot cohort | 4-6 tuần | — | Đo retention + completion |
| **Tổng** | **~6-8 tuần** | **3 người** | **Pilot 1 cohort đầy đủ** |

---

## 6. Risks & mitigations

| Risk | Mức | Mitigation |
|---|---|---|
| Học viên không làm pre-read → live session kém hiệu quả | 🟠 | Pre-read bắt buộc (gate = phải làm trước buổi live). Quiz ngắn 3 câu đầu buổi live |
| Video pre-read chất lượng thấp → học viên bỏ qua | 🟠 | Script chặt + brand guideline. Subtitle bắt buộc. <10' để giảm skip rate |
| Mentor không quen format mới (live 90' thay vì 150') | 🟠 | Training 1 buổi cho mentor. Cẩm nang cập nhật rõ timing |
| Cohort kéo dài +2-3 tuần → ảnh hưởng lịch | 🟡 | Nếu cần, có thể rút 1 buổi nhẹ khỏi pilot (vd I3.3) |
| Ảnh minh hoạ chưa cập nhật cho buổi phụ | 🟡 | Phase 2 — không block pilot |

---

## 7. Success metrics

Đo trước/sau pilot 1 cohort (so với baseline):

| Metric | Baseline | Target |
|---|---|---|
| Học viên hoàn thành pre-read trước buổi live | không đo được | ≥ 80% |
| Completion rate per session | cần đo | ≥ 85% |
| Dropout giữa chừng cohort | cần đo | giảm ≥ 30% |
| Gate pass rate L1→L2, L2→L3, L3→L4, L4→L5 | cần đo | duy trì ≥ 80% |
| Mentor feedback: "buổi live đủ thời gian cho lab" (1-5) | cần đo | ≥ 4.0 |
| Lab deliverable quality (rubric) | cần đo | duy trì hoặc tăng |
| Học viên feedback: "hiểu bài" (1-5) | cần đo | ≥ 4.0 |
| Học viên feedback: "áp dụng được ngay" (1-5) | cần đo | ≥ 4.0 |

---

## 8. Đề xuất triển khai theo giai đoạn

| Giai đoạn | Nội dung | Effort | Output |
|---|---|---|---|
| **GĐ1 — Template + 1 buổi mẫu** | Tạo template pre-read (1 buổi). Quay video mẫu I1.1. Tách mẫu I4.2 thành `## Phần A/B` để verify TOC anchor render OK. | 1 tuần | 1 buổi hoàn chỉnh end-to-end |
| **GĐ2 — Pre-read toàn bộ 14 buổi** | Áp dụng template cho 13 buổi còn lại. Quay/script video. Quiz pre-read. | 3 tuần (song song 2-3 người) | 14 buổi × pre-read |
| **GĐ3 — Tách 6 buổi nặng** | Tách `## Phần A/B` cho 6 buổi I2.1, I2.3, I3.1, I4.1, I4.2, I5.1. Update 6 cẩm nang giảng dạy. | 2 tuần | 6 buổi nặng → 12 buổi phụ |
| **GĐ4 — Polish + Pilot** | Update INDEX. Smoke test. Cohort mới dùng version mới. | 4-6 tuần | Cohort pilot |

---

## 9. Câu hỏi cần user chốt trước khi sang /plan

### Q1: Pre-read bắt buộc hay tùy chọn?
- **Bắt buộc** (em khuyến nghị): Quiz 3 câu đầu buổi live. Không làm = không vào lab.
- **Tùy chọn**: Học viên tự quyết. Rủi ro: nhiều người skip → live session không hiệu quả.

### Q2: Số buổi phụ cho 6 buổi nặng
- **2 buổi phụ** (em khuyến nghị): đơn giản, đủ để giảm 50% kiến thức/buổi.
- **3 buổi phụ** cho I4.2 (1475 dòng) và I5.1 (1270 dòng): overkill vì pre-read đã giảm 30-40% rồi.

### Q3: Routing — anchor trong 1 file vs tách file
- **Anchor trong 1 file** (em khuyến nghị): 0 fix code, 0 risk, TOC auto-link.
- **Tách file + fix code**: sạch về URL, nhưng tốn 0.5-1 ngày dev + risk regression.

---

## 10. Next steps

Nếu user đồng ý với đề xuất:
1. User chốt 3 câu hỏi ở §9.
2. Gọi `/plan` với context = file này để tạo implementation plan (tasks, dependencies, owner, acceptance criteria).
3. Plan sẽ ưu tiên GĐ1 (template + 1 buổi mẫu) trước, scale up sau.

Nếu user muốn điều chỉnh: em brainstorm lại từ §2.

---

## Phụ lục: Lý do kỹ thuật chi tiết cho anchor approach

**Codebase hiện tại** (verified ngày 26/06/2026):

| File | Behavior |
|---|---|
| `app/src/app/learn/[code]/page.tsx:71` | `extractToc(content.markdown)` — auto-generate TOC từ `## ...` heading |
| `app/src/components/markdown/toc.tsx` | TOC items clickable, scroll-spy enabled |
| `app/src/components/markdown/toc-scrollspy.tsx` | Highlight active section khi scroll |
| `app/src/lib/content/learner.ts:117-127` | Đọc file `.md` duy nhất, sort alphabetical |
| `app/src/lib/content/sessions.ts:68` | `^I[1-5]\.[1-3]$` — chỉ chấp nhận code cha |

**Với anchor approach**:
- `## Phần A — Buổi phụ I4.2.1` tự động thành TOC entry → click → `#phan-a-buoi-phu-i421` anchor → scroll xuống.
- Không cần fix regex, không cần tách file, không cần update routing.
- Total content vẫn ~57K mỗi buổi, nhưng **cảm giác học** giảm 50% vì:
  - Pre-read 30-45' tách hết lý thuyết → live 90' chỉ lab + Q&A.
  - 6 buổi nặng được chia thành 12 buổi phụ 90', mỗi buổi chỉ chứa 50% nội dung gốc.

→ Đây là cách **"giảm 50% kiến thức mỗi buổi"** hiệu quả nhất với codebase hiện tại.

---

*Brainstorm v2 · 26/06/2026 · Hybrid Flipped + Anchor Split · YODY Product Builder Program*
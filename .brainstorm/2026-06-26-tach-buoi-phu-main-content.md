# Brainstorm — Tách buổi phụ (sub-session) cho `main-content/` của Teaching-Kit

> **Ngày tạo:** 26/06/2026 · **Người viết:** Solution Brainstormer (advisory only)
> **Phạm vi:** Cấu trúc nội dung giảng dạy Intern Product Builder — `app/content/idea/Intern-Product-Builder/Teaching-Kit-I*/main-content/*.md`
> **Trạng thái:** Brainstorm kết thúc. Cần user chốt trước khi chuyển sang `/plan`.

---

## 1. Problem statement

### 1.1 Đề xuất gốc của user

> "Nội dung `main-content/` của các Teaching-Kit đang quá dài và nặng lý thuyết. Nên chia bớt nội dung, thêm buổi dạy để dàn trải nội dung giúp học viên học dễ hiểu hơn."

### 1.2 Data thực tế (đo ngày 26/06/2026)

Tài liệu học trong `Teaching-Kit-I*/main-content/` — 14 file, tổng **11.733 dòng / ~800K**:

| Buổi | Dòng | Kích thước | Mức |
|---|---:|---:|---|
| I4.2 | **1475** | 69.5K | 🔴 rất nặng |
| I5.1 | 1270 | 75.4K | 🔴 rất nặng |
| I5.2 | 1029 | 66.6K | 🟠 nặng |
| I2.3 | 923 | 63.1K | 🟠 nặng |
| I4.1 | 910 | 58.3K | 🟠 nặng |
| I3.1 | 881 | 66.4K | 🟠 nặng |
| I2.1 | 876 | 61.5K | 🟠 nặng |
| I3.2 | 688 | 47.3K | 🟡 trung bình |
| I1.1 | 678 | 47.6K | 🟡 trung bình |
| I2.2 | 666 | 57.6K | 🟡 trung bình |
| I4.3 | 612 | 44.7K | 🟡 trung bình |
| I5.3 | 604 | 56.9K | 🟡 trung bình |
| I1.2 | 569 | 36.9K | 🟢 nhẹ |
| I3.3 | 552 | 48.9K | 🟢 nhẹ |

**6 buổi ≥ 870 dòng = buổi 150 phút phải dạy trung bình ~600 từ/phút**. Không có thời gian cho Q&A, lab, hay iterate.

### 1.3 Phân tích gốc rễ (brutal honesty)

"Nội dung dài + nặng lý thuyết" **không phải một vấn đề, mà là ba vấn đề chồng lên nhau**:

1. **Cognitive load**: working memory 4–7 items (Miller). Buổi 150-180 phút vỡ attention span từ phút 25-40. Sau đó học viên "có mặt nhưng không xử lý".
2. **Mật độ concept mới / buổi quá cao**: I2.1 dạy 4 kỹ thuật prompting mới trong 1 buổi; I3.1 dạy workflow design + cowork + nhiều skill cùng lúc; I5.1 dạy toàn bộ kiến trúc AI feature.
3. **Không có pre-read async**: 100% lý thuyết đổ vào buổi live. Học viên không có cơ chế "nhai trước" theo pace riêng.

→ **Chỉ tách buổi mà không giải quyết #2 và #3 = nửa vời, tốn effort nhưng không cải thiện retention thực sự.**

---

## 2. Ràng buộc & mong muốn (đã xác nhận với user)

- **Loại vấn đề**: thời lượng buổi quá dài (không phải thiếu ví dụ, không phải nền tảng kém).
- **Ràng buộc**: có thể tăng tổng số buổi, không bắt buộc giữ 14. Tuy nhiên user đã chốt: **tách tất cả 14 buổi, không pilot**.
- **Mục tiêu kết quả**: (1) dễ hiểu + nhớ lâu, (2) áp dụng được ngay vào công việc.

---

## 3. Phương án đã cân nhắc

### A — Split Session chọn lọc (chỉ tách buổi nặng)
- Tách 6 buổi ≥ 870 dòng thành 2 buổi phụ 90 phút. Giữ nguyên 8 buổi nhẹ.
- 14 → 20 buổi.
- ✅ Ít disruption nhất. ⚠️ Cohort kéo dài 3 tuần.

### B — Timebox lại, không tách buổi
- 4 block × 35' + 3 lần nghỉ 10'. Yêu cầu đọc trước 20-30 phút (không tính thời lượng buổi).
- ✅ Không phá lộ trình. ⚠️ Không giải quyết "nội dung nặng", chỉ "thời lượng dài".

### C — Flipped Classroom + buổi ngắn (đã loại)
- 14 buổi live rút xuống 90 phút (chỉ lab/demo/Q&A). Lý thuyết → pre-read async.
- ✅ Giải quyết cả 2 vấn đề. ⚠️ Cần LMS + kỷ luật tự học + setup lớn.

### D — **Tách buổi phụ toàn bộ 14 buổi (USER CHỐT)**

Mỗi buổi chính → các buổi phụ `I{x}.{y}.{z}`, đặt ngay trong `Teaching-Kit-I{x}.{y}/main-content/`.

---

## 4. Đề xuất phương án D (đã chốt) — Quy tắc cụ thể

### 4.1 Quy tắc đặt tên

| Element | Quy tắc | Ví dụ |
|---|---|---|
| Buổi chính | `I{x}.{y}` (giữ nguyên) | `I1.1`, `I2.3`, `I4.2` |
| Buổi phụ | `I{x}.{y}.{z}` với z = 1, 2, 3... | `I1.1.1`, `I1.1.2` |
| File main-content | `I{x}.{y}.{z}-{Slug}.md` | `I4.2.1-Kien-Truc-5-Lop.md` |
| Thư mục | `Teaching-Kit-I{x}.{y}/main-content/` | `Teaching-Kit-I4.2/main-content/` |

**Lưu ý quan trọng**: KHÔNG dùng `L1.1.1` (chữ L) — sẽ tạo hệ ký hiệu song song với INDEX hiện tại (đang dùng `I1.1`). Giữ `I` để tránh phá vỡ quy ước đã có trong `Teaching-Kit-INDEX.md`.

### 4.2 Quy tắc tách nội dung

Mỗi buổi chính → **2 hoặc 3 buổi phụ**, theo trục learning unit (KHÔNG tách theo đề mục cũ):

| Buổi phụ | Thời lượng | Nội dung | Tỷ trọng thực hành |
|---|---|---|---|
| `.1` (Foundation) | 75-90' | Concept cốt lõi (≤5), walkthrough, demo ngắn | 30% |
| `.2` (Practice) | 75-90' | Lab dài + iterate + edge case | 70% |
| `.3` (Capstone) *(nếu cần)* | 60-75' | Gate prep / Q&A tổng / apply vào initiative | 80% |

**Đặc biệt cho buổi gate** (I1.2, I2.3, I3.3, I4.3, I5.3):
- Gate task đặt ở **buổi phụ cuối** (`.2` hoặc `.3`).
- Buổi phụ trước đó là foundation/practice để học viên chuẩn bị.

**Đặc biệt cho buổi nhẹ** (≤ 700 dòng, vd I1.2, I3.3, I4.3, I5.3):
- Tách thành 2 buổi phụ thay vì 3, không cần `.3`.

### 4.3 Quy tắc cập nhật Cẩm nang giảng dạy

Mỗi `Teaching-Kit-I{x}.{y}/{I{x}.{y}}-Cam-Nang-Giang-*.md` (talk-track 8 phần) phải được tách theo buổi phụ:

| Phần trong cẩm nang hiện tại | Mapping sang buổi phụ |
|---|---|
| §0 Định vị & agenda | Giữ nguyên ở cẩm nang cha |
| §1 Lời giảng theo slide | Tách theo buổi phụ (mỗi buổi phụ 1 tập slide) |
| §2 Demo | Demo `.1` thuộc buổi phụ `.1`, demo `.2` thuộc buổi phụ `.2` |
| §3 Lab | Lab `.1` → `.1`, Lab `.2` → `.2` |
| §4 Dữ liệu mẫu | Chung cho cả 3 buổi phụ (in phát 1 lần) |
| §5 Gate task / đóng gói | Đặt ở buổi phụ cuối |
| §6 FAQ | Tách theo buổi phụ |
| §7 Image prompts | Giữ nguyên ở cẩm nang cha |

### 4.4 Quy tắc cập nhật INDEX

`Teaching-Kit-INDEX.md` phải thêm cột "Buổi phụ" cho mỗi dòng:

```markdown
| **I1.1** | AI Fundamentals | L1 | mở đầu | I1.1 → [I1.1.1](Teaching-Kit-I1.1/main-content/I1.1.1-...) · [I1.1.2](Teaching-Kit-I1.1/main-content/I1.1.2-...) |
```

---

## 5. CRITICAL — Verify codebase trước khi triển khai

Em đã verify codebase ngày 26/06/2026. **CÓ 4 VẤN ĐỀ NGHIÊM TRỌNG** cần xử lý trước khi có thể tách buổi phụ:

### 🚨 Vấn đề 1 — Regex validation cứng từ chối buổi phụ

**File:** `app/src/lib/content/sessions.ts:68`
```ts
export const SESSION_CODE_RE = /^I[1-5]\.[1-3]$/;
```

**Tác động**: `I1.1.1` không match → `isValidSessionCode()` throw → **mọi route / nội dung buổi phụ sẽ 404 hoặc crash**.

### 🚨 Vấn đề 2 — Learner reader chỉ lấy file .md đầu tiên

**File:** `app/src/lib/content/learner.ts:125`
```ts
const match = entries.filter((e) => e.endsWith(".md")).sort()[0];
```

**Tác động**: Khi thêm `I4.2.1-...md` và `I4.2.2-...md` cùng `main-content/`, sort alphabetical sẽ trả về `I4.2.1-...md` — file `I4.2-Tai-Lieu-Hoc-...md` (tên cũ) **bị bỏ hoàn toàn**. Đây là silent bug: build pass, không lỗi, nhưng learner chỉ thấy 1 file ngẫu nhiên.

### 🚨 Vấn đề 3 — Title parser giả định 1 file = 1 title

**File:** `app/src/lib/content/learner.ts:43`
```ts
/** Raw learner markdown (the single main-content file). */
markdown: string;
```

**Tác động**: `LearnerContent.markdown` được thiết kế là 1 string. Nếu muốn hiển thị nhiều buổi phụ trên UI, cần:
- Đổi `markdown: string` → `subSessions: { code, title, markdown }[]`, HOẶC
- Tạo type `SubLearnerContent` song song, route `/[code]/[subCode]`.

### 🚨 Vấn đề 4 — Codebase đã explicit "single main-content file"

**File:** `app/src/lib/content/learner.ts:2`
```ts
* reads `Teaching-Kit-${code}/main-content/*.md` (14 files).
```

và comment dòng 113: `Find the single main-content markdown for code`. Tác giả đã explicit thiết kế cho 1 file. Cần rework không chỉ logic mà cả type contract.

### Đề xuất fix (xử lý TRƯỚC khi tách nội dung)

| File | Fix |
|---|---|
| `app/src/lib/content/sessions.ts:68` | Đổi regex thành `^I[1-5]\.[1-3](\.[1-3])?$` |
| `app/src/lib/content/learner.ts:117-127` | Đổi `findMainContentFile` thành `listMainContentFiles` (trả mảng) |
| `app/src/lib/content/learner.ts:142-159` | Tách thành 2 function: `getLearnerContent(code)` (cho code cha, trả metadata + danh sách buổi phụ) + `getSubLearnerContent(code, subCode)` (cho buổi phụ) |
| `app/src/lib/content/index.ts` | Export 2 function mới |
| Routing tương ứng (Next.js page) | Thêm route `/content/idea/Intern-Product-Builder/[code]/[subCode]` |

**Effort estimate fix code**: 1 senior ~0.5-1 ngày làm việc + test.

---

## 6. Effort estimate tổng thể

| Công việc | Effort | Ghi chú |
|---|---|---|
| Fix code (Vấn đề 1-4) | 0.5-1 ngày | 1 senior dev |
| Tách nội dung 14 buổi × 2-3 buổi phụ | 14-21 file mới | 2-3 tuần (1-2 người viết) |
| Cập nhật 14 cẩm nang giảng dạy | 14 file edit | 1-2 tuần (song song với tách nội dung) |
| Cập nhật INDEX + ảnh minh hoạ | 1 ngày | |
| Pilot 1 cohort + thu feedback | 4-6 tuần | Cohort dài nhất ~5-7 tuần |
| **Tổng** | **~2.5-3.5 tháng** | |

→ **Không phải "1 sprint".** Cần kick-off thật, có product owner, có người review chất lượng nội dung.

---

## 7. Risks & mitigations

| Risk | Mức | Mitigation |
|---|---|---|
| Học viên mất mạch giữa các buổi phụ | 🟠 | Buổi phụ `.1` luôn recap buổi chính trước; buổi phụ `.2` recap `.1` |
| Code change phá vỡ build/SEO của 14 buổi hiện tại | 🔴 | Fix code trong PR riêng, không bundle với content; giữ backward compat (route cha vẫn hoạt động) |
| Tên file `I4.2.1-...md` sort trước `I4.2-Tai-Lieu-Hoc-...md` → file cũ bị "ẩn" | 🔴 | Đổi tên file cũ thành `I4.2-LEGACY-...md` hoặc xóa hẳn sau khi tách xong; KHÔNG để 2 hệ file cùng tồn tại |
| Cohort kéo dài quá 12 tuần | 🟠 | Tách 2 buổi thay vì 3 cho buổi nhẹ; giữ buổi gate dài 150' (gate không tách) |
| Không có người review chất lượng tách | 🟠 | Yêu cầu ít nhất 1 reviewer cho mỗi buổi trước khi merge |
| Slide/ảnh minh hoạ không kịp cập nhật | 🟡 | Dùng ảnh cũ cho buổi `.1`, ảnh mới cho buổi `.2` nếu cần |

---

## 8. Success metrics

Đo trước/sau pilot 1 cohort:

| Metric | Baseline (ước tính) | Target |
|---|---|---|
| Completion rate per session | cần đo | ≥ 85% |
| Dropout giữa chừng cohort | cần đo | giảm ≥ 30% |
| Gate pass rate L1→L2, L2→L3, L3→L4, L4→L5 | cần đo | duy trì ≥ 80% |
| Mentor feedback: "học viên hiểu bài" (1-5) | cần đo | ≥ 4.0 |
| Lab deliverable quality (rubric) | cần đo | duy trì hoặc tăng |

---

## 9. Đề xuất triển khai theo giai đoạn (dù user chốt "không pilot")

Em vẫn khuyến nghị **làm theo 3 giai đoạn** dù không có pilot chính thức, vì:

1. Giai đoạn 1 tạo foundation (code + 1 buổi mẫu).
2. Giai đoạn 2 scale up bằng template đã verified.
3. Giai đoạn 3 polish và rollout.

| Giai đoạn | Nội dung | Effort | Output |
|---|---|---|---|
| **GĐ1 — Foundation** | Fix code (Vấn đề 1-4). Tách mẫu 1 buổi: **I4.2** (1475 dòng, nặng nhất) thành I4.2.1 + I4.2.2. Update cẩm nang I4.2 tương ứng. | 1 tuần | 1 buổi hoàn chỉnh end-to-end, verify build + UI + routing |
| **GĐ2 — Scale-up** | Tách 13 buổi còn lại theo template đã có. Mỗi buổi dùng checklist chung. | 3-4 tuần (2 người song song) | 14 buổi × 2-3 buổi phụ = ~30 file mới |
| **GĐ3 — Polish & Rollout** | Update INDEX, ảnh minh hoạ, cẩm nang giảng dạy đầy đủ. Smoke test cohort mới. | 1-2 tuần | Cohort tiếp theo dùng version mới |

---

## 10. Câu hỏi còn mở (cần user chốt trước khi sang /plan)

1. **Code change**: Anh/chị muốn em gọi team dev để fix Vấn đề 1-4 trước, hay em tạm thời ghi nhận blockers và user tự xử lý?
2. **Quy tắc tách**: 2 hay 3 buổi phụ cho mỗi buổi chính? (Em đề xuất: **3 buổi phụ cho buổi nặng ≥ 870 dòng**, **2 buổi phụ cho buổi nhẹ ≤ 700 dòng**.)
3. **Gate placement**: Gate task ở buổi phụ `.2` hay `.3`? (Em đề xuất: **`.2` cho buổi gate có 2 buổi phụ, `.3` cho buổi gate có 3 buổi phụ**.)
4. **Cẩm nang giảng dạy**: Tách thành file riêng cho từng buổi phụ (`I4.2.1-Cam-Nang-...md`) hay giữ 1 file cha với section tách rõ? (Em đề xuất: **1 file cha + section tách rõ**, vì mentor thường xem toàn bộ 1 lần.)
5. **Backward compat**: Sau khi tách, file `I4.2-Tai-Lieu-Hoc-...md` (tên cũ) có giữ lại để redirect cũ, hay xóa hẳn?

---

## 11. Next steps

Nếu user đồng ý với đề xuất:
1. User chốt 5 câu hỏi ở §10.
2. Gọi `/plan` với context = file này để tạo implementation plan (tasks, dependencies, owner, acceptance criteria cho từng buổi).
3. Plan sẽ ưu tiên fix code (GĐ1) trước, content (GĐ2) sau.

Nếu user muốn điều chỉnh phương án D: brainstorm lại từ §3.

---

*Brainstorm summary · v1.0 · 26/06/2026 · YODY Product Builder Program*
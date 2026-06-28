# Chương trình Intern Product Builder — YODY

## Mục tiêu

Đào tạo thực tập sinh trở thành Product Builder có khả năng đóng góp thực tế vào quá trình xây dựng sản phẩm công nghệ của YODY — nắm vững nguyên lý AI, tư duy product, và kỹ năng build trong môi trường thực.

## Đối tượng

Thực tập sinh (sinh viên năm 3–4 hoặc mới tốt nghiệp) có định hướng Product Manager / AI Product Builder / Technical Product Owner.

## Khung đánh giá năng lực

Rubric đầy đủ = bộ gốc `../00_Core/competency_dictionary.json` + override trong `framework.json` (file này).

- **Trần lộ trình:** L5 Architect (chuẩn tốt nghiệp bắt buộc).
- **Đặc thù:** BẬT tiêu chí "Hiểu vai trò & kỳ vọng Product Builder" (Outcome) + áp dụng đầy đủ Product Thinking (Can Do).
- **Will FIT:** dùng nguyên `../00_Core/will_fit.json`, không override.
- **Lộ trình 5 level:** `../00_Core/progression_ladder.md`.
- **Chấm điểm:** `../scorecard_template.md` (chọn cột Intern). Áp dụng cho cả đầu vào (tuyển chọn) lẫn đánh giá giữa/cuối kỳ.

## Cấu trúc thư mục

```
02_Intern-Product-Builder/
├── README.md        # File này
├── framework.json   # Override theo chương trình (trần L5, bật tiêu chí role + Product Thinking)
└── Teaching-Kit-I*.*
    ├── main-content/
    │   ├── I{x}.{y}.{z}-{Slug}.md        # Sub-session file (cho buổi nặng)
    │   ├── I{x}.{y}-{Slug}.md            # Single-file kit (cho buổi nhẹ)
    │   └── _archive/                     # File gốc trước khi split (Phase 6)
    │       └── I{x}.{y}-Tai-Lieu-Hoc-*.md
    ├── preread/                          # Pre-read async (Phase 4)
    │   ├── I{x}.{y}-preread-summary.md   + 5 bullets
    │   ├── I{x}.{y}-preread-video.md    # Video URL + duration
    │   └── I{x}.{y}-preread-qa.md       # 3 câu quiz multiple-choice
    └── I{x}.{y}-Cam-Nang-Giang-*.md     # Cẩm nang giảng dạy (cho mentor)
```

### Quy tắc đặt tên content

**Sub-session files** (cho buổi nặng ≥ 870 dòng, Phase 6):

- Pattern: `I{x}.{y}.{z}-{Slug}.md` (3 segments).
- Mỗi buổi nặng có **2 sub-sessions** (`z = 1` và `z = 2`).
- File gốc `I{x}.{y}-Tai-Lieu-Hoc-*.md` được move vào `_archive/` (giữ để rollback).

**Single-file kits** (cho buổi nhẹ < 870 dòng):

- Pattern: `I{x}.{y}-{Slug}.md` (2 segments).
- 8 kit áp dụng: I1.1, I1.2, I2.2, I3.2, I3.3, I4.3, I5.2, I5.3.

**Pre-read files** (Phase 4+, bắt buộc cho 14 kit):

- 3 file: `summary`, `video`, `qa` — đặt trong `preread/`.
- `summary`: `` + `# Điểm cốt lõi` (3-5 bullets).
- `video`: `url:` placeholder + `duration: 600` (giây) + transcript TODO.
- `qa`: 3 câu format `> [!question]` với 4 đáp án `A. B. C. D.` + `**Đáp án: X**` + `**Giải thích:**`.

### Workflow cho content author

1. Viết content cho 1 buổi → file `I{x}.{y}-{Slug}.md` trong `main-content/`.
2. Nếu file ≥ 870 dòng → tách thành 2 sub-session theo mapping Phase 6.
3. Apply pre-read template cho `preread/` (copy từ `Teaching-Kit-I1.1/preread/` mẫu).
4. Submit PR — Phase 7 (Cam nang) + Phase 8 (Validate) chạy sau khi merge.

### Gate kits (5 kit có quiz gate ở buổi cuối)

I1.2, I2.3, I3.3, I4.3, I5.3 — sub-session cuối cùng (`z = totalInParent`) có duration 75 phút (gate summary), các sub-session khác 90 phút. Logic ở `src/lib/content/sub-learner.ts`.

---

*Cập nhật: 2026-06-26 · v2.1 (Phase 6: split 6 buổi nặng + apply pre-read template cho 14 buổi)*

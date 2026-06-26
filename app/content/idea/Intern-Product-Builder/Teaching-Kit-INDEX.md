# Bộ Cẩm Nang Giảng Dạy — Intern Product Builder (Module 1 → 5, đầy đủ)

> **Phiên bản:** 1.2 · 24/06/2026 (sync `../_version.md`) · Brand YODY (#2a2b86 / #fcaf16 / Montserrat)
> **Mục đích:** Tài liệu để người dạy **đọc là giảng được** — mỗi buổi gồm talk-track từng slide, kịch bản demo có prompt thật, lab + đáp án mẫu, dữ liệu mẫu, gate task, FAQ/dự phòng, và phụ lục prompt tạo ảnh.
> **Quan hệ với giáo án:** mỗi cẩm nang là phần *triển khai nội dung* cho file giáo án tương ứng trong `Sessions/` (giáo án = cách tổ chức buổi; cẩm nang = nội dung để dạy).

---

## Danh mục

| Mã | Tên buổi | Level | Vai trò gate | Cẩm nang | Pre-read | Buổi phụ |
|---|---|---|---|---|---|---|
| **I1.1** | AI Fundamentals | L1 | mở đầu | [Teaching-Kit-I1.1](Teaching-Kit-I1.1/I1.1-Cam-Nang-Giang-AI-Fundamentals.md) | [I1.1-preread](/learn/I1.1/preread) | — |
| **I1.2** | Giới hạn AI & An toàn dữ liệu | L1 | **Gate L1→L2** | [Teaching-Kit-I1.2](Teaching-Kit-I1.2/I1.2-Cam-Nang-Giang-Gioi-Han-AI-An-Toan.md) | [I1.2-preread](/learn/I1.2/preread) | — |
| **I2.1** | Advanced Prompting | L2 | tích lũy | [Teaching-Kit-I2.1](Teaching-Kit-I2.1/I2.1-Cam-Nang-Giang-Advanced-Prompting.md) | [I2.1-preread](/learn/I2.1/preread) | [I2.1.1](/learn/I2.1/1) · [I2.1.2](/learn/I2.1/2) |
| **I2.2** | AI Tools cho Product Work | L2 | tích lũy | [Teaching-Kit-I2.2](Teaching-Kit-I2.2/I2.2-Cam-Nang-Giang-AI-Tools-Product-Work.md) | [I2.2-preread](/learn/I2.2/preread) | — |
| **I2.3** | Prompt để Insight & Spec | L2 | **Gate L2→L3** | [Teaching-Kit-I2.3](Teaching-Kit-I2.3/I2.3-Cam-Nang-Giang-Prompt-de-Insight-Spec.md) | [I2.3-preread](/learn/I2.3/preread) | [I2.3.1](/learn/I2.3/1) · [I2.3.2](/learn/I2.3/2) |
| **I3.1** | Workflow Design & Cowork | L3 | mở đầu L3 | [Teaching-Kit-I3.1](Teaching-Kit-I3.1/I3.1-Cam-Nang-Giang-Workflow-Design-Cowork.md) | [I3.1-preread](/learn/I3.1/preread) | [I3.1.1](/learn/I3.1/1) · [I3.1.2](/learn/I3.1/2) |
| **I3.2** | Build Deliverable sản phẩm | L3 | tích lũy | [Teaching-Kit-I3.2](Teaching-Kit-I3.2/I3.2-Cam-Nang-Giang-Build-Deliverable.md) | [I3.2-preread](/learn/I3.2/preread) | — |
| **I3.3** | Mentor Review & Iterate | L3 | **Gate L3→L4** | [Teaching-Kit-I3.3](Teaching-Kit-I3.3/I3.3-Cam-Nang-Giang-Mentor-Review-Iterate.md) | [I3.3-preread](/learn/I3.3/preread) | — |
| **I4.1** | Product Thinking đầy đủ | L4 | tích lũy | [Teaching-Kit-I4.1](Teaching-Kit-I4.1/I4.1-Cam-Nang-Giang-Product-Thinking.md) | [I4.1-preread](/learn/I4.1/preread) | [I4.1.1](/learn/I4.1/1) · [I4.1.2](/learn/I4.1/2) |
| **I4.2** | Technical Track: Claude Code | L4 | tích lũy | [Teaching-Kit-I4.2](Teaching-Kit-I4.2/I4.2-Cam-Nang-Giang-Technical-Track-Claude-Code.md) | [I4.2-preread](/learn/I4.2/preread) | [I4.2.1](/learn/I4.2/1) · [I4.2.2](/learn/I4.2/2) |
| **I4.3** | Tích hợp Initiative & Iterate | L4 | **Gate L4→L5** | [Teaching-Kit-I4.3](Teaching-Kit-I4.3/I4.3-Cam-Nang-Giang-Tich-Hop-Initiative-Iterate.md) | [I4.3-preread](/learn/I4.3/preread) | — |
| **I5.1** | Kiến trúc giải pháp AI | L5 | tích lũy | [Teaching-Kit-I5.1](Teaching-Kit-I5.1/I5.1-Cam-Nang-Giang-Kien-Truc-Giai-Phap-AI.md) | [I5.1-preread](/learn/I5.1/preread) | [I5.1.1](/learn/I5.1/1) · [I5.1.2](/learn/I5.1/2) |
| **I5.2** | Production Readiness & Guardrails | L5 | tích lũy | [Teaching-Kit-I5.2](Teaching-Kit-I5.2/I5.2-Cam-Nang-Giang-Production-Readiness-Guardrails.md) | [I5.2-preread](/learn/I5.2/preread) | — |
| **I5.3** | Ship & Bảo vệ Sản Phẩm AI Cuối Khóa | L5 | **Gate tốt nghiệp L5** | [Teaching-Kit-I5.3](Teaching-Kit-I5.3/I5.3-Cam-Nang-Giang-Ship-Bao-Ve-Capstone.md) | [I5.3-preread](/learn/I5.3/preread) | — |

> **Đủ trọn 14 buổi (I1.1 → I5.3) + 15 cẩm nang (incl. INDEX).** L3–L5 (đợt 22/06/2026) theo cùng cấu trúc 8 phần; các buổi gate (I3.3, I4.3, I5.3) có thêm phần exit criteria + chuẩn ĐẠT. I5.3 là buổi tốt nghiệp (100% bảo vệ, không khối lý thuyết) nên Phần 1 là kịch bản điều phối Hội đồng thay cho talk-track slide.

---

## Cấu trúc buổi học (update 26/06/2026)

> Từ cohort tiếp theo, mỗi buổi học áp dụng format mới:

> 1. **Pre-read bắt buộc** (30-45'): học viên tự học trước qua [`/learn/[code]/preread`](/learn/I1.1/preread). Quiz 3 câu đầu buổi live để gate.
> 2. **Live session** (90'): mentor recap + lab + Q&A. Không dạy lý thuyết dài trên lớp.
> 3. **Buổi phụ** (nếu có): 6 buổi nặng (≥870 dòng markdown) được tách thành 2 buổi phụ 90' mỗi cái — xem cột **Buổi phụ** trong bảng trên.

> Mục tiêu: **giảm 50% kiến thức/buổi live**, tăng retention + áp dụng được ngay. Chi tiết tại `.brainstorm/2026-06-26-tach-buoi-phu-main-content-v2.md`.

**Tổng kết pilot format:**

- **14 buổi** × pre-read (TL;DR + 5 bullets + video + 3 câu quiz) — tổng 42 file preread.
- **6 buổi nặng** × 2 buổi phụ — tổng 12 file sub-session (I2.1, I2.3, I3.1, I4.1, I4.2, I5.1).
- **5 buổi gate** (I1.2, I2.3, I3.3, I4.3, I5.3): buổi cuối sub-session = 75' summary + gate task (nếu có).

---

## Cấu trúc chuẩn mỗi cẩm nang (theo I1.1)

0. **Định vị buổi & cách dùng** — khác biệt cốt lõi (người dùng vs người build), bảng xương sống, agenda timeboxed.
1. **Lời giảng theo slide** — 13 slide, mỗi slide có "Trên slide" + "Lời giảng" (đọc gần nguyên văn) + 🖼️ vị trí ảnh.
2. **Kịch bản demo** — prompt thật + output kỳ vọng + "rút ra".
3. **Lab + đáp án mẫu** — đề, tiêu chí ĐẠT, đáp án để mentor đối chiếu.
4. **Dữ liệu mẫu** — giả lập, KHÔNG PII, in phát.
5. **Gate task** (buổi gate) hoặc đóng gói (buổi tích lũy).
6. **Ghi chú người dạy & FAQ** — điểm hay vấp, FAQ, dự phòng, nối rubric.
7. **Phụ lục image prompts** — style suffix chung + prompt từng ảnh.

---

## Quy ước tạo ảnh minh hoạ

Mỗi cẩm nang có **style suffix chung** (Phần 7) để cả bộ slide đồng nhất: phong cách *flat editorial + sketch-note*, linework vẽ tay, tông indigo `#2a2b86` + amber `#fcaf16` trên nền off-white, font geometric kiểu Montserrat, nhiều khoảng trắng, 16:9. Dán suffix vào cuối prompt nội dung từng ảnh rồi đưa vào công cụ tạo ảnh (Midjourney / v0 / DALL·E…). Khi tạo xong, lưu vào `img/` của mỗi Teaching-Kit và gắn vào slide.

---

## Lưu ý compliance & cập nhật

- Mọi nội dung lab dùng **dữ liệu giả lập, không PII thật** (Luật 91/2025/QH15, NĐ 356/2025/NĐ-CP).
- Cẩm nang **I2.2** chốt dữ kiện tool tại **6/2026** — thị trường AI tool đổi nhanh; kiểm lại tên model/tính năng trước buổi, dạy nguyên lý *tool-fit* thay vì thuộc tính năng.
- Link tài nguyên kiểm lần cuối 21/06/2026 (theo `Resource-Library-Verified.md`).
- **Update 26/06/2026:** Áp dụng pre-read bắt buộc cho 14 buổi + tách 6 buổi nặng thành 12 buổi phụ (2 buổi/kit). Pilot cohort tiếp theo.

---

*YODY Product Builder Program — Teaching Kit INDEX · v1.3 · 26/06/2026 (pre-read + sub-sessions)*

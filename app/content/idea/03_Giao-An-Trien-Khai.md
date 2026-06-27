# YODY Product Builder Program — Giáo án & Triển khai

> **Phiên bản:** 3.0 (consolidated) · **Ngày:** 23/06/2026 · **Biên soạn:** Jeremy Nguyen / YODY
> **Vai trò file:** Tài liệu gốc số 3/3 — bản đồ 22 buổi học, khung thiết kế buổi, vận hành chương trình và thư viện tài nguyên.
> **Đọc kèm:** `01_Tong-Quan-Chuong-Trinh.md` (lộ trình 5 level), `02_Khung-Nang-Luc-Danh-Gia.md` (rubric + gate). Giáo án chi tiết từng buổi: `01_AI-Training-NonIT/Sessions/`, `02_Intern-Product-Builder/Sessions/`.

---

## Mục lục

- [1. Bản đồ 22 buổi học](#1-bản-đồ-22-buổi-học)
  - [1.1. AI-Training-NonIT — 8 buổi](#11-ai-training-nonit--8-buổi-l1--l3)
  - [1.2. Intern Product Builder — 14 buổi](#12-intern-product-builder--14-buổi-l1--l5)
- [2. Khung thiết kế một buổi học](#2-khung-thiết-kế-một-buổi-học)
- [3. Template buổi học (copy cho mỗi buổi)](#3-template-buổi-học-copy-cho-mỗi-buổi)
- [4. Ví dụ điền mẫu — N1.2](#4-ví-dụ-điền-mẫu--n12)
- [5. Vận hành chương trình](#5-vận-hành-chương-trình)
- [6. Thư viện tài nguyên (đã verify)](#6-thư-viện-tài-nguyên-đã-verify)

---

## 1. Bản đồ 22 buổi học

**Nguyên tắc:** mỗi buổi soạn theo khung 14 thành phần (Mục 2), gate-by-evidence (xem `02_Khung-Nang-Luc-Danh-Gia.md` Phần III). Mục tiêu buổi ánh xạ trực tiếp tới hành vi 4 khía cạnh + exit criteria của level. Đánh giá trong buổi = *formative* (giúp tự soi tiến bộ) + *thu thập bằng chứng* cho gate. Buổi cuối mỗi level **tạo ra deliverable gate** + có người duyệt.

### 1.1. AI-Training-NonIT — 8 buổi (L1 → L3)

Đối tượng: nhân sự non-IT · ~75–90 phút/buổi · blended. Phân bổ: L1 (2) · L2 (3) · L3 (3).

| Mã | Buổi | Level | Mục tiêu chính | Lab / Bài tập | Vai trò gate |
|---|---|---|---|---|---|
| **N1.1** | AI 101 & AI Mindset | L1 | Phân biệt AI làm được/không; đặt kỳ vọng đúng; tổng quan công cụ | Liệt kê 5 tác vụ lặp lại trong tuần, đánh dấu cái nào AI hỗ trợ được | Chuẩn bị evidence L1 |
| **N1.2** | Giới hạn AI & An toàn dữ liệu (PII) | L1 | Hiểu hallucination/rủi ro; quy tắc PII & Luật 91/2025 | Phân loại 10 mẫu dữ liệu được/không nhập + xử lý 1 tình huống | **Gate L1→L2** |
| **N2.1** | Prompt cơ bản | L2 | Công thức prompt (vai trò/bối cảnh/nhiệm vụ/định dạng/ví dụ) | Viết lại 3 prompt kém thành tốt | Tích lũy L2 |
| **N2.2** | Prompt patterns cho công việc văn phòng | L2 | Soạn thảo/tóm tắt/phân tích/dịch + kiểm chứng output (Discernment) | Giải 3 tác vụ thật bằng prompt có cấu trúc | Tích lũy L2 |
| **N2.3** | Thư viện prompt cá nhân & Human-in-the-loop | L2 | Hệ thống hóa prompt tái dùng; biết khi nào cần người kiểm | Nộp 3 prompt/template + đo kết quả tiết kiệm | **Gate L2→L3** |
| **N3.1** | Tư duy workflow AI | L3 | Map công việc → bước AI (input → AI → output → review) | Vẽ sơ đồ 1 workflow cho quy trình phòng ban | Chuẩn bị evidence L3 |
| **N3.2** | Build mini-workflow & đo impact | L3 | Dựng workflow chạy được; đo trước/sau | Build workflow AI thật cho công việc của mình | Chuẩn bị evidence L3 |
| **N3.3** | Triển khai & Bảo vệ workflow | L3 | Đưa cho đồng nghiệp dùng thử; trình bày kết quả | Demo workflow + bằng chứng có người dùng + giá trị đo được | **Gate L3 — 🎓 tốt nghiệp Non-IT** |

*Tài nguyên gắn kèm:* L1 → AI Capabilities and Limitations, tutorial "Why do AI models hallucinate?" / "sycophancy"; L2 → Claude 101, AI Fluency (Effective prompting); L3 → use cases theo phòng ban, Introduction to Claude Cowork.

### 1.2. Intern Product Builder — 14 buổi (L1 → L5)

Đối tượng: thực tập sinh hướng product · ~120–180 phút/buổi · cohort + lab, project-based. Phân bổ: L1 (2) · L2 (3) · L3 (3) · L4 (3) · L5 (3).

| Mã | Buổi | Level | Mục tiêu chính | Lab / Bài tập | Vai trò gate |
|---|---|---|---|---|---|
| **I1.1** | AI Fundamentals (conceptual) | L1 | LLM, token, context window, temperature, embeddings — góc product | Giải thích 1 quyết định product bị ảnh hưởng bởi context window | Chuẩn bị evidence L1 |
| **I1.2** | Giới hạn AI & An toàn dữ liệu | L1 | Hallucination góc product; AI là infrastructure; PII & Luật 91/2025 | Viết 1 trang: 1 feature có AI — giải bài toán gì, giới hạn gì | **Gate L1→L2** |
| **I2.1** | Advanced Prompting | L2 | CoT, task decomposition, context injection, structured output | Giải 1 task phức bằng prompt phân rã | Tích lũy L2 |
| **I2.2** | AI Tools cho Product Work | L2 | Claude/ChatGPT (research/spec), Cursor/Copilot, v0/Midjourney, Notion AI | Dùng ≥2 tool cho 1 tác vụ product | Tích lũy L2 |
| **I2.3** | Prompt Insight & Spec | L2 | Extract insight, draft spec, synthesize research | Tạo bản tóm tắt user research hoặc draft spec từ dữ liệu cho sẵn | **Gate L2→L3** |
| **I3.1** | Workflow Design & Cowork | L3 | Workflow product (spec/prototype/insight); Cowork task loop, skills & plugins | Thiết kế workflow AI cho 1 bài toán product | Chuẩn bị evidence L3 |
| **I3.2** | Build Deliverable sản phẩm | L3 | Dựng spec/prototype/insight report; QC mức product (nguồn, edge case) | Build 1 deliverable sản phẩm thật | Chuẩn bị evidence L3 |
| **I3.3** | Mentor Review & Iterate | L3 | Nhận review, chỉnh sửa có định hướng | Bảo vệ deliverable trước mentor | **Gate L3→L4** |
| **I4.1** | Product Thinking đầy đủ | L4 | problem → hypothesis → build → measure; metric, edge case, AI-fit | Phân tích 1 feature: ai dùng, metric, AI có cần không | Tích lũy L4 |
| **I4.2** | Technical Track: Vibe coding / Claude Code | L4 | Tích hợp AI component vào sản phẩm; thiết kế trust layer | Build 1 feature AI nhỏ chạy được | Tích lũy L4 |
| **I4.3** | Tích hợp vào Initiative & Iterate | L4 | Đưa giải pháp vào initiative thật; build→feedback→iterate ≥2 vòng | Case iterate ≥2 vòng + bằng chứng feedback | **Gate L4→L5** |
| **I5.1** | Kiến trúc giải pháp AI | L5 | Cost, latency, trust, monitoring; RAG/agent/eval; harness cơ bản | Thiết kế kiến trúc cho capstone | Chuẩn bị evidence L5 |
| **I5.2** | Production Readiness & Guardrails | L5 | Eval, guardrails, prompt injection, PII redaction; rủi ro/đạo đức ở quy mô | Dựng eval + guardrail cho capstone | Chuẩn bị evidence L5 |
| **I5.3** | Ship & Bảo vệ Capstone | L5 | Ship sản phẩm AI-augmented; tài liệu kiến trúc & rủi ro | Demo sản phẩm thật + tài liệu kiến trúc | **Gate L5 — 🎓 tốt nghiệp Intern** |

*Tài nguyên gắn kèm:* L1 → AI Capabilities and Limitations, Claude Platform 101; L2 → AI Fluency Framework, Claude Code 101; L3 → Introduction to Claude Cowork, agent skills; L4 → Claude Code in Action, Building with the Claude API; L5 → Introduction to MCP + Advanced, Learn Harness Engineering (tiếng Việt), Anthropic Engineering (harness blogs).

> **Nội dung chuyên sâu mỗi level** (LLM fundamentals, advanced prompting, RAG, agents/MCP, harness engineering, AI product design, production readiness) đã được map vào các buổi I4.x–I5.x. Chi tiết kỹ thuật: xem giáo án trong `02_Intern-Product-Builder/Sessions/` và `Teaching-Kit-*/`.

---

## 2. Khung thiết kế một buổi học

Ba nguyên tắc bắt buộc, mọi buổi đều phải thể hiện:

1. **Backward design — thiết kế ngược.** Bắt đầu từ *"sau buổi này học viên LÀM được gì"* (mục tiêu đo được), rồi mới chọn bài tập kiểm chứng, cuối cùng mới đến nội dung. Không bắt đầu từ slide.
2. **Tỷ lệ 30/70 — học bằng làm.** Tối đa 30% thời lượng cho lý thuyết/demo, tối thiểu 70% cho thực hành trên bài toán thật. Buổi nào lý thuyết vượt 40% là thiết kế sai.
3. **4D xuyên suốt + Diligence không thương lượng.** Mỗi buổi nêu rõ trọng tâm 4D. Mọi buổi đều có ô **An toàn dữ liệu** (PII, Luật 91/2025/QH15) — kể cả buổi kỹ thuật.

**Bộ khung chuẩn — 14 thành phần, chia 3 nhóm:**

### Nhóm A — Thiết kế (làm trước, ít thay đổi)

| # | Thành phần | Mô tả |
|---|---|---|
| 1 | **Metadata** | Mã buổi · Chương trình · Level · Thời lượng · Hình thức (self-paced/live/lab) · Người phụ trách |
| 2 | **Vị trí trong lộ trình** | Buổi trước → buổi này → buổi sau; prerequisite |
| 3 | **Mục tiêu học tập** | 2–4 mục tiêu: *"Học viên có thể [động từ Bloom] + [đối tượng] + [tiêu chuẩn]"* |
| 4 | **Trọng tâm 4D + chế độ AI** | Nhấn D nào; chế độ Automation/Augmentation/Agency |
| 5 | **Pre-work** | Việc chuẩn bị trước buổi (xem video, đọc, cài công cụ, có sẵn dữ liệu) |
| 6 | **Công cụ & vật liệu** | Công cụ AI đã được YODY duyệt, tài khoản, dữ liệu mẫu (giả lập, KHÔNG PII), slide, handout |

### Nhóm B — Triển khai (kịch bản trong buổi)

| # | Thành phần | Mô tả |
|---|---|---|
| 7 | **Agenda timeboxed** | Lịch theo phút: Hook → Lý thuyết → Demo → Lab → Review → Wrap-up |
| 8 | **Nội dung cốt lõi** | 3–5 key concept, mỗi cái 1–2 câu; tránh nhồi |
| 9 | **Demo theo bối cảnh YODY** | Ví dụ thật ngành bán lẻ thời trang (retail/supply chain/CSKH...) |
| 10 | **Lab thực hành** | Đề bài + dữ liệu mẫu + tiêu chí "đạt"; làm ngay trong buổi (phần học chính, 70%) |
| 11 | **Ô An toàn dữ liệu** | Cảnh báo PII/bảo mật cụ thể cho nội dung buổi — bắt buộc |

### Nhóm C — Sau buổi (củng cố & đo lường)

| # | Thành phần | Mô tả |
|---|---|---|
| 12 | **Đánh giá trong buổi (formative)** | Exit ticket / quiz ngắn / mini-demo: kiểm tra đạt mục tiêu chưa |
| 13 | **Bài tập áp dụng công việc thật** | Giao 1 việc thật để áp dụng kỹ năng vừa học |
| 14 | **Tài nguyên & bước tiếp** | Link khóa/tutorial liên quan; kết nối buổi sau |

**Biến thể theo chương trình:**

| Khía cạnh | AI-Training-NonIT | Intern Product Builder |
|---|---|---|
| Độ dài buổi | 75–90 phút | 120–180 phút (lab dài) |
| Tỷ lệ self-paced/live | Nặng self-paced + 1 live/tuần | Live cohort + lab + code review |
| Lab | Tác vụ văn phòng/nghiệp vụ, không code | Code, API, RAG, agent, harness |
| Đánh giá | Exit ticket + deliverable cá nhân | Mini-project + capstone + bảo vệ |
| Facilitator | Champion phòng ban | Leader kỹ thuật / mentor |
| Dữ liệu lab | Mẫu nghiệp vụ giả lập | Repo/sandbox thật (đã ẩn PII) |

**Checklist QA trước khi chốt buổi:**

- [ ] Mục tiêu viết bằng động từ đo được (không "hiểu"/"biết" chung chung)?
- [ ] Lab chiếm ≥ 70% thời lượng?
- [ ] Có dữ liệu mẫu giả lập, **không** PII thật?
- [ ] Có ô An toàn dữ liệu phù hợp nội dung?
- [ ] Có tiêu chí "đạt" rõ ràng cho lab & exit ticket?
- [ ] Có bài tập áp dụng vào công việc thật?
- [ ] Có nối với buổi trước/sau (không hổng nền)?
- [ ] Có facilitator notes + phương án dự phòng?
- [ ] Tài nguyên tham chiếu là link đã verify?

---

## 3. Template buổi học (copy cho mỗi buổi)

```markdown
# [Mã buổi] — [Tên buổi]

## A. Thiết kế
- **Chương trình:** AI-Training-NonIT / Intern Product Builder
- **Level:** [L1–L5] — **Thời lượng:** [vd 90 phút] — **Hình thức:** self-paced / live / lab
- **Người phụ trách:** [tên]
- **Vị trí lộ trình:** sau [buổi trước] → trước [buổi sau]
- **Prerequisite:** [kiến thức/buổi cần có trước]

### Mục tiêu học tập (kết thúc buổi, học viên có thể...)
1. [động từ Bloom + đối tượng + tiêu chuẩn]
2. ...

### Trọng tâm 4D & chế độ AI
- **4D:** [Delegation / Description / Discernment / Diligence]
- **Chế độ:** [Automation / Augmentation / Agency]

### Pre-work
- [ ] [video/đọc/cài đặt/chuẩn bị dữ liệu]

### Công cụ & vật liệu
- Công cụ: [đã được YODY duyệt]
- Dữ liệu mẫu: [giả lập, KHÔNG chứa PII]
- Tài liệu: [slide / handout / prompt mẫu]

## B. Triển khai — Agenda timeboxed
| Thời gian | Hoạt động | Hình thức |
|---|---|---|
| 0–10' | Hook: [tình huống/câu hỏi mở] | cả lớp |
| 10–25' | Lý thuyết: [key concepts] | giảng |
| 25–40' | Demo: [ví dụ YODY] | trình diễn |
| 40–75' | **Lab thực hành:** [đề bài] | cá nhân/nhóm |
| 75–85' | Review & chữa bài | cả lớp |
| 85–90' | Wrap-up + exit ticket | cả lớp |

### Nội dung cốt lõi (3–5 ý)
- ...

### Demo theo bối cảnh YODY
- [mô tả ví dụ thật]

### Lab thực hành
- **Đề bài:** ... · **Dữ liệu:** [mẫu giả lập] · **Tiêu chí ĐẠT:** ...

### ⚠️ An toàn dữ liệu (bắt buộc)
- [cảnh báo PII/bảo mật cụ thể cho buổi này]

## C. Sau buổi
### Đánh giá trong buổi (formative)
- [exit ticket / quiz / mini-demo + tiêu chí]

### Bài tập áp dụng công việc thật
- [giao 1 việc thật]

### Tài nguyên & bước tiếp
- [link khóa/tutorial] · Kết nối buổi sau: ...

## Ghi chú cho người dạy (facilitator notes)
- Điểm học viên hay vấp: ...
- Câu hỏi thường gặp: ...
- Phương án dự phòng (mất mạng/công cụ lỗi): ...
```

---

## 4. Ví dụ điền mẫu — N1.2

# N1.2 — Giới hạn AI & An toàn dữ liệu (PII)

## A. Thiết kế
- **Chương trình:** AI-Training-NonIT — **Level:** L1
- **Thời lượng:** 75 phút — **Hình thức:** self-paced 25' + live 50'
- **Người phụ trách:** Champion phòng ban + IT Security
- **Vị trí lộ trình:** sau N1.1 (AI 101) → trước N2.1 (Prompt cơ bản)
- **Prerequisite:** đã xem video N1.1

### Mục tiêu học tập (kết thúc buổi, học viên có thể...)
1. **Giải thích** vì sao AI tạo thông tin sai (hallucination) và "nịnh" người dùng (sycophancy), nêu ≥ 2 ví dụ.
2. **Phân loại** đúng 10 mẫu dữ liệu vào nhóm "được nhập" / "không được nhập" vào công cụ AI công cộng.
3. **Áp dụng** quy tắc PII của YODY khi xử lý một tình huống công việc giả định.

### Trọng tâm 4D & chế độ AI
- **4D:** Diligence (chính) + Discernment — **Chế độ:** Augmentation

### Pre-work
- [ ] Xem tutorial "Why do AI models hallucinate?" và "What is sycophancy in AI models?"

### Công cụ & vật liệu
- Công cụ: trợ lý AI đã được YODY duyệt
- Dữ liệu mẫu: 10 thẻ dữ liệu giả lập (đơn hàng, thông tin KH giả, số liệu nội bộ giả)
- Tài liệu: 1-pager "Quy tắc dữ liệu YODY", trích Luật 91/2025/QH15 & NĐ 356/2025/NĐ-CP

## B. Triển khai — Agenda
| Thời gian | Hoạt động | Hình thức |
|---|---|---|
| 0–10' | Hook: cho xem 1 câu trả lời AI sai trông rất thuyết phục | cả lớp |
| 10–25' | Vì sao AI sai: hallucination, sycophancy, bias, giới hạn | giảng |
| 25–35' | Demo: AI tự tin bịa số liệu tồn kho YODY (giả lập) | trình diễn |
| 35–60' | **Lab:** phân loại 10 thẻ dữ liệu + xử lý 1 tình huống PII | nhóm 3 người |
| 60–70' | Review & chữa bài, làm rõ ranh giới | cả lớp |
| 70–75' | Exit ticket: 5 câu trắc nghiệm | cá nhân |

### Nội dung cốt lõi
- AI dự đoán từ tiếp theo, không "biết sự thật" → có thể bịa rất trơn tru.
- Sycophancy: AI có xu hướng đồng tình với bạn → phải tự kiểm chứng.
- Dữ liệu nhập vào công cụ công cộng có thể bị lưu/huấn luyện → tuyệt đối không nhập PII khách hàng/nhân sự/số liệu mật.

### ⚠️ An toàn dữ liệu (bắt buộc)
- Tất cả dữ liệu lab là **giả lập**. Nhấn mạnh: vi phạm PII có thể chịu chế tài theo Luật 91/2025/QH15.

## C. Sau buổi
### Đánh giá trong buổi (deliverable gate L1→L2)
- Exit ticket ≥ 4/5 câu đúng (nhận thức L1) + nêu 1 use case AI cho công việc của mình. Trainer chương trình duyệt gate.

### Bài tập áp dụng
- Rà 1 việc thật của mình tuần qua: chỗ nào suýt nhập nhầm dữ liệu nhạy cảm vào AI?

### Tài nguyên & bước tiếp
- AI Capabilities and Limitations; AI Fluency: Framework & Foundations.
- Buổi sau N2.1: bắt đầu thực hành viết prompt.

## Ghi chú cho người dạy
- Học viên hay nghĩ "AI luôn đúng vì nói trơn tru" → dùng demo bịa số liệu để phá vỡ.
- Dự phòng: nếu mất mạng, dùng ảnh chụp màn hình câu trả lời sai đã chuẩn bị sẵn.

---

## 5. Vận hành chương trình

### 5.1. Lớp hiển thị tiến độ & Gamification

Vì chương trình **không gắn lương/thăng tiến**, lớp hiển thị tiến độ là động lực chính. Badge cấp khi **đạt điều kiện để đi tiếp** (không phải khi đậu điểm).

- **Badge theo level** (chuẩn Open Badges — chia sẻ được lên hồ sơ nội bộ/LinkedIn): 🟢 L1 Aware · 🔵 L2 Operator · 🟣 L3 Builder · 🟠 L4 Integrator · 🏆 L5 Architect.
- **Personal Skill Tracker:** mỗi người thấy level hiện tại, % tiến tới level kế, lab/deliverable đã hoàn thành, trạng thái gate, badge đã đạt.
- **Milestone recognition:** mỗi lần qua gate → thông báo kênh nội bộ phòng ban + e-certificate + tên lên "AI Champions wall".
- **Manager dashboard:** bản đồ nhiệt năng lực AI của team — để hỗ trợ, không phải để phạt.
- **Tránh leaderboard cạnh tranh công khai** ở giai đoạn đầu (gây áp lực ngược cho chương trình tự nguyện). Thay bằng "cohort progress" — cùng tiến.

### 5.2. Tái chứng nhận (Recertification)

- **Khái niệm nền (L1):** không hết hạn.
- **Kỹ năng gắn công cụ (L2–L5):** badge hiệu lực **12 tháng**, gia hạn bằng một "refresh challenge" ngắn (cập nhật tool/tính năng mới), không thi lại toàn bộ.

### 5.3. Quản trị động lực — bù rủi ro chương trình tự nguyện

Bốn đòn bẩy bắt buộc:

1. **Thời gian học được bảo vệ:** cấp quyền chính thức dành X giờ/tuần cho học — yếu tố số 1 quyết định tỷ lệ hoàn thành.
2. **Leader làm gương:** quản lý cũng tham gia, cũng có badge.
3. **Lab gắn việc thật:** mỗi lab giải đúng bài toán học viên đang làm → học xong dùng được ngay.
4. **Ghi nhận xã hội đều đặn:** vinh danh qua-gate hằng tháng, kể câu chuyện thành công nội bộ.

### 5.4. Đề xuất nền tảng vận hành (LMS)

| Phương án | Ưu | Nhược | Phù hợp |
|---|---|---|---|
| **A. Lightweight** (Google Workspace: Forms + Sheets/Looker + Sites) | Rẻ, dựng nhanh | Chấm thực hành thủ công, badge/tracking yếu, khó scale | Pilot |
| **B. LMS chuyên dụng** (Moodle nguồn mở, hoặc TalentLMS/Litmos SaaS) | Tracking, gating, quiz engine, Open Badges, cert, scale tốt | Tốn chi phí + setup; cần người vận hành | Rollout toàn công ty |
| **C. Hybrid nội dung** (Anthropic Academy cho nền + LMS cho lab/đánh giá YODY) | Tận dụng nội dung chất lượng miễn phí cho L1–L2 | Nội dung Anthropic là tiếng Anh (rào cản nhóm phổ cập) | Kết hợp với B |

**Khuyến nghị — lộ trình 3 bước:**

1. **Pilot trên phương án A** với 1 cohort (1 phòng ban Non-IT + nhóm Intern nhỏ) để kiểm chứng cơ chế leveling/gate trước khi đầu tư.
2. **Rollout trên phương án B** (chọn **Moodle** nếu IT đủ năng lực tự host & muốn kiểm soát dữ liệu; **TalentLMS** nếu muốn nhanh, ít vận hành) khi mở rộng.
3. **Tích hợp phương án C:** dùng cert Anthropic Academy làm điều kiện tiên quyết cho L1–L2, dồn nguồn lực nội bộ cho lab & đánh giá gate.

> *Lưu ý:* tính năng và giá LMS thay đổi theo thời gian — verify bảng giá/tính năng hiện tại trước khi mua. Tuân thủ Luật 91/2025/QH15 khi LMS lưu dữ liệu học viên (PII): ưu tiên giải pháp cho phép kiểm soát nơi lưu trữ dữ liệu.

### 5.5. Lộ trình triển khai

| Giai đoạn | Thời gian | Việc chính |
|---|---|---|
| **P0 — Chuẩn bị** | Tháng 0 | Chốt nền tảng pilot, dựng deliverable gate L1–L2, rubric, badge |
| **P1 — Pilot** | Tháng 1–2 | 1 cohort Non-IT + nhóm Intern nhỏ; chạy thử leveling/gate; thu phản hồi |
| **P2 — Rollout Non-IT** | Tháng 3–5 | Mở L1–L3 cho toàn công ty trên LMS; vận hành recognition |
| **P3 — Track Intern** | Tháng 3–6 | Intern track L3–L5 song song |
| **P4 — Vận hành liên tục** | Từ tháng 6 | Recert, cập nhật nội dung, mở rộng champion |

---

## 6. Thư viện tài nguyên (đã verify)

> **Kiểm tra lần cuối:** 24/06/2026 (truy cập trực tiếp — chi tiết 29 URL xms `_link-verification-log.md`). Nếu link đổi, tra lại tại [Anthropic Academy](https://www.anthropic.com/learn) và [Tutorials](https://claude.com/resources/tutorials). Mọi nội dung lab dùng dữ liệu giả lập, không PII thật (Luật 91/2025/QH15, NĐ 356/2025/NĐ-CP).

### L1 — Aware (nhận thức, giới hạn, an toàn)

- **AI Capabilities and Limitations** (Anthropic Academy) — [anthropic.skilljar.com/ai-capabilities-and-limitations](https://anthropic.skilljar.com/ai-capabilities-and-limitations)
- **Claude 101** (Anthropic Academy) — [anthropic.skilljar.com/claude-101](https://anthropic.skilljar.com/claude-101)
- **Why do AI models hallucinate?** — [claude.com/resources/tutorials/why-do-ai-models-hallucinate](https://claude.com/resources/tutorials/why-do-ai-models-hallucinate)
- **What is sycophancy in AI models?** — [claude.com/resources/tutorials/what-is-sycophancy-in-ai-models](https://claude.com/resources/tutorials/what-is-sycophancy-in-ai-models)
- **The 4 Ds of AI Fluency — Behavioral Indicators** — [claude.com/resources/tutorials/the-4-ds-of-ai-fluency-behavioral-indicators](https://claude.com/resources/tutorials/the-4-ds-of-ai-fluency-behavioral-indicators)
- **Writing an AI diligence statement** — [claude.com/resources/tutorials/writing-an-ai-diligence-statement](https://claude.com/resources/tutorials/writing-an-ai-diligence-statement)

### L2 — Operator (prompt thực chiến)

- **AI Fluency: Framework & Foundations** (chứa *Deep Dive 2: Effective Prompting Techniques*) — [anthropic.skilljar.com/ai-fluency-framework-foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations)
- **Deep Dive: Effective Prompting Techniques** — [anthropic.com/ai-fluency/deep-dive-2-effective-prompting-techniques](https://www.anthropic.com/ai-fluency/deep-dive-2-effective-prompting-techniques)
- **Prompt engineering overview** (Claude docs) — [platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
- **Chain-of-thought & prompting best practices** (Claude docs) — [platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

### L3 — Builder (workflow & Cowork)

- **Introduction to Claude Cowork** (Anthropic Academy) — [anthropic.skilljar.com/introduction-to-claude-cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork)
- **Use cases theo phòng ban** — [claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- **Courses hub** — [claude.com/resources/courses](https://claude.com/resources/courses)

### L4 — Integrator (Claude Code, API, tích hợp)

- **Claude Code 101** — [anthropic.skilljar.com/claude-code-101](https://anthropic.skilljar.com/claude-code-101)
- **Claude Code in Action** — [anthropic.skilljar.com/claude-code-in-action](https://anthropic.skilljar.com/claude-code-in-action)
- **Building with the Claude API** — [anthropic.skilljar.com/claude-with-the-anthropic-api](https://anthropic.skilljar.com/claude-with-the-anthropic-api)
- **Claude Platform 101** — [anthropic.skilljar.com/claude-platform-101](https://anthropic.skilljar.com/claude-platform-101)

### L5 — Architect (MCP, harness, production)

- **Introduction to Model Context Protocol** — [anthropic.skilljar.com/introduction-to-model-context-protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol)
- **MCP: Advanced Topics** — [anthropic.skilljar.com/model-context-protocol-advanced-topics](https://anthropic.skilljar.com/model-context-protocol-advanced-topics)
- **Introduction to subagents** — [anthropic.skilljar.com/introduction-to-subagents](https://anthropic.skilljar.com/introduction-to-subagents)
- **Introduction to agent skills** — [anthropic.skilljar.com/introduction-to-agent-skills](https://anthropic.skilljar.com/introduction-to-agent-skills)
- **Learn Harness Engineering — bản tiếng Việt** — [walkinglabs.github.io/learn-harness-engineering/vi](https://walkinglabs.github.io/learn-harness-engineering/vi/)
- **Anthropic Engineering: Effective harnesses for long-running agents** — [anthropic.com/engineering/effective-harnesses-for-long-running-agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **Anthropic Engineering: Harness design for long-running application development** — [anthropic.com/engineering/harness-design-long-running-apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)

### Hub & lộ trình

- Anthropic Academy: [anthropic.com/learn](https://www.anthropic.com/learn) · Courses (Skilljar): [anthropic.skilljar.com](https://anthropic.skilljar.com/)
- Claude — Courses: [claude.com/resources/courses](https://claude.com/resources/courses) · Tutorials: [claude.com/resources/tutorials](https://claude.com/resources/tutorials) · Use cases: [claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- Developer docs: [platform.claude.com/docs](https://platform.claude.com/docs)
- AI Fluency Framework (OER, học thuật): [aifluencyframework.org](https://aifluencyframework.org/)

---

*YODY Product Builder Program · Tài liệu gốc 3/3 · v3.0 · 23/06/2026 · 22/22 buổi.*

# 00_Core/progression_ladder.md — Lộ trình 5 level + gate-by-evidence

> **Phiên bản:** 1.0 · **Ngày:** 23/06/2026 · **Biên soạn:** Jeremy Nguyen / YODY
> **Vai trò file:** Lộ trình năng lực Product Builder + cơ chế gate-by-evidence. Định nghĩa exit criteria 每个 level + gate (lên level dựa bằng chứng hành vi, không phải ngưỡng điểm rubric).
> **Đọc kèm:** `competency_dictionary.json` (rubric) · `will_fit.json` (giá trị cốt lõi) · `../02_Khung-Nang-Luc-Danh-Gia.md` Phần III (cơ chế gate) · Phần IV (scorecard).
> **Nguồn schema:** `../../plans/.../phase-0a-numbering-lock.md` (LOCKED — 18 refs + B.5.b placeholder).
> Khi xung đột, JSON thắng.

---

## A. Nguyên tắc nối rubric ↔ ladder

### A.1 Rubric đo chiều cao (điểm tại thời điểm)

Rubric = ảnh chụp năng lực tại một thời điểm. Trả lời câu hỏi "hiện đang ở đâu trên thang đo 5.0?" — đo theo 4 khía cạnh (Outcome / Can Do / Will Do / Will FIT).

### A.2 Ladder vẽ con đường (đang ở chặng nào)

Ladder = lộ trình phát triển theo các level. Trả lời câu hỏi "đang đi trên con đường nào, exit criteria để lên chặng kế là gì?" — định nghĩa bằng **bằng chứng hành vi** + **người duyệt**, không phải ngưỡng điểm rubric.

### A.3 Khía cạnh chủ đạo + behavioral indicators per level

Mỗi level có 1 khía cạnh chủ đạo (table bên dưới). Hành vi indicator cụ thể chạy dọc 4D, nhưng trọng tâm dịch chuyển theo level.

| Level | Khía cạnh chủ đạo | Behavioral indicator cốt lõi |
|---|---|---|
| L1 Aware | Growth Mindset | Nhận thức đúng kỳ vọng AI, ≥1 use case nêu được, Diligence |
| L2 Operator | Ownership | Prompt đạt output mong muốn, tool proficiency cơ bản, workflow cá nhân |
| L3 Builder | Customer Centric | Builder mindset: prompt турнир + tool cho product, workflow tái dùng |
| L4 Integrator | Good Relationship | Workflow có human review, bằng chứng người dùng, giá trị đo được |
| L5 Architect | Integrity | Kiến trúc production, eval/guardrail, redaction, bảo vệ hội đồng |

---

## B. Exit criteria per level + gate

> Lên level khi **thỏa exit criteria của level đó** (by evidence + người duyệt). Trọng tâm phát triển theo 4D (Outcome/Can Do/Will Do/Will FIT) — mỗi level nhấn 4D khác nhau.

### B.1 Nguyên tắc gate-by-evidence (hành vi, không điểm)

Quiz/lab là *input bằng chứng* + giúp học viên tự thấy tiến bộ — **không** trực tiếp quyết định lên level. Lên level dựa trên: (a) deliverable gate cuối cấp + (b) người duyệt chốt bằng chứng hành vi. Đổi cách đo trong thời đại ai cũng có AI: **discernment** (phát hiện/sửa lỗi AI), **description** (chất lượng cách giao việc cho AI), **diligence** (xử lý dữ liệu an toàn, minh bạch phần AI làm), **vấn đáp live**, **quan sát quá trình**.

> Nguyên tắc: bài đánh giá tốt là bài mà *người dùng AI giỏi vượt qua, người chỉ copy-paste AI trượt*.

### B.2 Bản đồ gate & người duyệt (tổng quan — chi tiết ở D.2)

5 gate dẫn dọc L1→L5 graduation. Mỗi gate gắn với buổi cuối cấp tạo deliverable. Chi tiết bảng: xem [D.2](#d2-bảng-gate--người-duyệt).

### B.3 L1 Aware — exit criteria

L1 = nhận thức đúng kỳ vọng AI, nêu được ≥1 use case, Diligence (xử lý dữ liệu minh bạch). End goal: đã/dang dùng AI tự do, biết AI có thể sai.
- **Trọng tâm 4D:** Will FIT/Growth Mindset (mở) + Will Do/Motivation.
- **Khía cạnh chủ đạo:** Growth Mindset.
- **YC chính:** kỳ vọng đúng về AI capabilities/limits; nêu được ≥1 use case; Diligence statement; ≥1 use case cá nhân.

### B.4 L2 Operator — exit criteria

L2 = tự dùng AI đạt output mong muốn, biết iterate prompt, dùng ≥2 tools, ghép AI vào workflow cá nhân.
- **Trọng tâm 4D:** Can Do (prompt + tool proficiency); Outcome (deliverable cá nhân-first).
- **Khía cạnh chủ đạo:** Ownership.

#### B.4.a Hiểu rủi ro dữ liệu nhạy cảm

Biết khi nào input chứa dữ liệu nhạy cảm (customer/PII) → redact hoặc chọn kênh phù hợp. Không paste raw customer data vào công cụ không phù hợp.

#### B.4.b Workflow design cơ bản — placeholder *(chưa cited)*

> **Placeholder** (Phase 0a decision: GIỮ để tránh lỗ hổng numbering). Dự phòng cho bổ sung design workflow cơ bản L2 nếu cần. Hiện không được session nào cite("${chua_cited}").

#### B.4.c Gate L1→L2 — exit criteria

- **Buổi tạo deliverable:** I1.2 (Intern) / N1.2 (Non-IT).
- **Bằng chứng:** quiz nhận thức + nêu được use case/feature AI cho bài toán thực; phân biệt AI làm được/không làm được; Diligence statement.
- **Người duyệt:** Trainer chương trình.

### B.5 L3 Builder — exit criteria

L3 = builder mindset: prompt + tool cho product work, workflow tái dùng được, template/quy trình share được.
- **Trọng tâm 4D:** Can Do (prompt + tool level product) + Outcome (deliverable sản phẩm).
- **Khía cạnh chủ đạo:** Customer Centric.

#### B.5.a Prompt Engineering thực chiến (CoT, phân rã)

Chain-of-thought, task decomposition, context injection, few-shot. Prompt đạt output trong 1–2 lần cho use case product.

#### B.5.b Workflow design cơ bản — placeholder *(chưa cited)*

> **Placeholder** (Phase 0a decision: GIỮ để tránh lỗ hổng numbering). Dự phòng "Workflow design cơ bản" cho L3 nếu cần bổ sung. Hiện không có session cite.

#### B.5.d Tool proficiency (2–3 tools cho product)

2–3 AI tools phù hợp use case product (Claude/ChatGPT cho reasoning/spec, Cursor/v0 cho code/UI, Notion AI cho docs). Đánh giá qua bài tập thực hành.

#### B.5.c Gate L2→L3 — exit criteria

- **Buổi tạo deliverable:** I2.3 (Intern) / N2.3 (Non-IT).
- **Bằng chứng:** template/quy trình tái dùng; workflow ghép AI đạt output product; tool proficiency ≥2 tools; prompt có cấu trúc.
- **Người duyệt:** Trainer / Team lead.

### B.6 L4 Integrator — exit criteria

L4 = tích hợp AI vào workflow hoàn chỉnh có human review, bằng chứng người dùng, giá trị đo được.
- **Trọng tâm 4D:** Can Do (workflow_design) + Outcome (deliverable có user evidence + giá trị đo).
- **Khía cạnh chủ đạo:** Good Relationship (làm việc cross-team với user thực).

#### B.6.a Workflow design + QC output (input → AI → output → review)

Workflow rõ: input là gì, AI làm gì, output đi đâu, human review ở đâu. QC output mức product (nguồn dữ liệu, edge case). Không cần hỗ trợ kỹ thuật liên tục.

#### B.6.b Workflow design nâng cao — placeholder *(chưa cited)*

> **Placeholder** (Phase 0a decision: GIỮ). Dự phòng. Hiện không có session cite.

#### B.6.c Gate L3→L4 — exit criteria

- **Buổi tạo deliverable:** I3.3 (Intern) / N3.3 (tốt nghiệp Non-IT).
- **Bằng chứng:** workflow hoàn chỉnh có human review + bằng chứng người dùng + giá trị đo được; Product Thinking đầy đủ (mở lại khi chuyển nhánh Product Builder); deliverable được mentor review.
- **Người duyệt:** Mentor sản phẩm.

### B.7 L5 Architect — exit criteria

L5 Architect = case iterate ≥2 vòng, tích hợp vào initiative, stakeholder ngoài team.
- **Trọng tâm 4D:** Outcome (deliverable cross-team) + Will FIT/Integrity (minh bạch kiến trúc/rủi ro).
- **Khía cạnh chủ đạo:** Integrity.

#### B.7.a Case iterate + tích hợp initiative

Case iterate ≥2 vòng; tích hợp case vào ≥1 initiative sản phẩm; làm việc với stakeholder ngoài team.

#### B.7.b Architecture fundamentals — placeholder *(chưa cited)*

> **Placeholder** (Phase 0a decision: GIỮ). Dự phòng. Hiện không có session cite.

#### B.7.c Gate L4→L5 — exit criteria

- **Buổi tạo deliverable:** I4.3 (Intern).
- **Bằng chứng:** case iterate ≥2 vòng + tích hợp initiative + stakeholder ngoài team; deliverable cross-team.
- **Người duyệt:** Mentor + đội Product.

### B.8 L5 Architect — Production readiness

L5 production = kiến trúc production, eval, guardrail, redaction, scale, monitoring. Đây vẫn là L5 nhưng là phase "ship sản phẩm người-dùng-thật".
- **Trọng tâm 4D:** Outcome (ship production) + Can Do (architecture) + Will FIT/Integrity (tài liệu kiến trúc/rủi ro minh bạch).

#### B.8.a Kiến trúc + eval + guardrail

RAG có trích nguồn, guardrail, PII redaction, eval set, monitoring, scale plan.

#### B.8.b Production doc — placeholder *(chưa cited)*

> **Placeholder** (Phase 0a decision: GIỮ). Dự phòng. Hiện không có session cite.

#### B.8.c Gate tốt nghiệp L5 — exit criteria

- **Buổi tạo deliverable:** I5.3 (Intern).
- **Bằng chứng:** ship sản phẩm người-dùng-thật + tài liệu kiến trúc/rủi ro + bảo vệ trước hội đồng.
- **Người duyệt:** Hội đồng Product Builder.

---

## C. Will FIT cross-ref (tham chiếu → will_fit.json, không override)

Bộ 5 giá trị cốt lõi YODY dùng chung cho mọi level + mọi chương trình, **không override**. Đánh giá hành vi, không phụ thuộc cấp bậc. Chi tiết + câu hỏi gợi ý: xem [`will_fit.json`](./will_fit.json).

| ID | Giá trị | Trọng số | Điểm tối đa |
|---|---|---|---|
| D1 | Customer Centric | 25% | 1.25 |
| D2 | Ownership & Autonomy (gồm proactiveness) | 15% | 0.75 |
| D3 | Integrity | 20% | 1.0 |
| D4 | Growth Mindset (gồm self-learning) | 20% | 1.0 |
| D5 | Good Relationship | 20% | 1.0 |

> Khía cạnh chủ đạo mỗi level (A.3 table) = giá trị Will FIT tương ứng làm kim chỉ nam hành vi, không phải "chỉ chấm giá trị đó".

---

## D. Gate map + người duyệt (chi tiết)

### D.1 Nguyên tắc duyệt (đạt / kèm điều kiện, không "trượt điểm")

Quyết định gate: **Đạt** · **Đạt kèm điều kiện** · **Chưa đạt** (cần bổ sung bằng chứng). **Không có "trượt theo điểm"** — quiz/lab là input bằng chứng, không quyết định trực tiếp. Badges cấp khi **qua gate hành vi**, không phải khi đậu điểm. Recertification + vận hành: `../03_Giao-An-Trien-Khai.md`.

### D.2 Bảng gate & người duyệt

| Gate | Buổi tạo deliverable | Người duyệt |
|---|---|---|
| L1→L2 | N1.2 / I1.2 | Trainer chương trình |
| L2→L3 | N2.3 / I2.3 | Trainer / Team lead |
| L3→L4 | N3.3 (tốt nghiệp Non-IT) / I3.3 | Mentor sản phẩm |
| L4→L5 | I4.3 | Mentor + đội Product |
| Tốt nghiệp L5 | I5.3 | Hội đồng Product Builder |

> Lớp hiển thị tiến độ (badge & tracker): badge cấp khi qua gate hành vi. Badge color token: L1 mint · L2–L4 iris · L5 gold.

---

## Phụ: Lộ trình định vị theo chương trình

- **AI Training (Non-IT):** L1 Aware → L3 Builder (tran). Đạt L3 + có nhu cầu/năng lực → mở L4–L5 (chuyển nhánh Product Builder, dùng override Intern).
- **Intern Product Builder:** L1–L2 → L5 Architect (chuẩn tốt nghiệp bắt buộc). Bật A0 (role understanding) + áp dụng đầy đủ B3 (Product Thinking).

---

*v1.0 · 2026-06-24 · Source: 02 doc Phần III + Phase 0a schema (LOCKED). Khi xung đột JSON thắng.*
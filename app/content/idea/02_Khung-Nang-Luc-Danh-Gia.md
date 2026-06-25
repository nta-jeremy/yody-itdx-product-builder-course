# YODY Product Builder Program — Khung năng lực & Đánh giá

> **Phiên bản:** 3.0 (consolidated) · **Ngày:** 23/06/2026 · **Biên soạn:** Jeremy Nguyen / YODY
> **Vai trò file:** Tài liệu gốc số 2/3 — định nghĩa đầy đủ khung năng lực (canonical + 2 dẫn xuất), cơ chế gate, và scorecard chấm điểm.
> **Đọc kèm:** `01_Tong-Quan-Chuong-Trinh.md` (chiến lược, lộ trình 5 level), `03_Giao-An-Trien-Khai.md` (22 buổi, buổi nào tạo deliverable gate).
> **Nguồn máy đọc (canonical):** `00_Core/competency_dictionary.json`, `00_Core/will_fit.json`, `00_Core/progression_ladder.md`, hai `framework.json`. Khi xung đột, JSON thắng.

---

## Mục lục

- [Phần I — Khung năng lực canonical](#phần-i--khung-năng-lực-canonical)
  - [I.0. Nguyên tắc thiết kế](#i0-nguyên-tắc-thiết-kế)
  - [I.A. Outcome](#ia-outcome--kết-quả-tạo-ra)
  - [I.B. Can Do](#ib-can-do--năng-lực-chuyên-môn)
  - [I.C. Will Do](#ic-will-do--động-lực--cam-kết)
  - [I.D. Will FIT](#id-will-fit--giá-trị-cốt-lõi-yody)
  - [I.E. Bảng điểm tham chiếu](#ie-bảng-điểm-tham-chiếu)
- [Phần II — Hai khung dẫn xuất](#phần-ii--hai-khung-dẫn-xuất)
  - [II.A. AI Training (Non-IT)](#iia-ai-training-non-it)
  - [II.B. Intern Product Builder](#iib-intern-product-builder)
- [Phần III — Cơ chế gate (gate-by-evidence)](#phần-iii--cơ-chế-gate-gate-by-evidence)
- [Phần IV — Scorecard chấm điểm](#phần-iv--scorecard-chấm-điểm)

---

# PHẦN I — KHUNG NĂNG LỰC CANONICAL

Khung gốc là **nguồn định nghĩa duy nhất** cho mọi tiêu chí. Hai chương trình dẫn xuất theo mô hình **base + override**: bộ con chỉ khai báo phần khác biệt (trọng số, bật/tắt tiêu chí, ngữ cảnh); mọi tiêu chí không override đều tham chiếu về đây.

Thang điểm: **4 khía cạnh × 5.0 = 20.0 điểm.**

| Khía cạnh | Câu hỏi cốt lõi | Điểm tối đa |
|---|---|---|
| **A. Outcome** | Đã tạo ra kết quả thực bằng product thinking + AI chưa? | 5.0 |
| **B. Can Do** | Có đủ nền tảng kỹ thuật để build giải pháp bằng AI không? | 5.0 |
| **C. Will Do** | Có thực sự muốn trở thành Product Builder và duy trì lâu dài không? | 5.0 |
| **D. Will FIT** | Có phù hợp với môi trường và văn hóa YODY không? | 5.0 |

## I.0. Nguyên tắc thiết kế

**Phân vai 4 trục — không double-count.** Mỗi trait chỉ được đo ở đúng một nơi:

- **Outcome** — bằng chứng đã tạo ra kết quả thực (build, iterate, kiểm soát rủi ro). Nơi **duy nhất** đo hành vi *iterate/nhận feedback* trên deliverable.
- **Can Do** — năng lực **kỹ thuật** thuần để build. Không chứa hành vi/động lực.
- **Will Do** — động lực tham gia và định hướng nghề dài hạn. Không chứa proactiveness/growth.
- **Will FIT** — giá trị & hành vi văn hóa. Nơi **duy nhất** đo *Growth Mindset (gồm self-learning)* và *Ownership (gồm proactiveness)*.

**Ba vùng overlap đã dọn (v2.0):**

1. *Self-learning* — trước nằm ở Can Do + Will Do + Will FIT → nay **chỉ** ở Will FIT/Growth Mindset; Can Do giữ thuần "output quality control".
2. *Iterate/feedback* — trước ở Outcome + Will FIT → nay **chỉ** ở Outcome.
3. *Proactiveness/không chờ giao việc* — trước ở Will Do + Will FIT → nay **chỉ** ở Will FIT/Ownership; Will Do/Stability giữ thuần "cam kết dài hạn".

**Không áp dụng "Năng lực lãnh đạo":** chương trình đào tạo individual contributor ở mọi cấp độ.

**Trọng số trong khung gốc là default** — bộ con có thể override theo trần level. Khung gốc **không dùng để chấm trực tiếp**; nó là từ điển năng lực, rubric thực thi nằm ở bộ con (Phần II).

---

## I.A. Outcome — Kết quả tạo ra

*Đã tạo ra kết quả thực bằng cách kết hợp product thinking và công cụ AI chưa?*

### A0 · Hiểu rõ vai trò và kỳ vọng của Product Builder *(optional)*

`OUT_role_understanding` · **Default: 0% (tắt)** — bật cho chương trình có lộ trình cố định (Intern).

Hiểu Product Builder không phải vai trò "học quan sát" hay "thực thi đơn thuần" — mà là tư duy xây dựng sản phẩm từ bài toán thực, được kỳ vọng contribute thật. Nắm rõ lộ trình và các milestone đánh giá.

*Câu hỏi gợi ý:* "Product Builder khác gì người chỉ thực thi task được giao? Bạn được kỳ vọng đóng góp gì cụ thể trong chương trình này?"

### A1 · Đã xây dựng ≥1 giải pháp/deliverable có giá trị thực

`OUT_deliverable` · **Default: 40% · 2.0 điểm**

Không phải thử nghiệm cho biết — phải có output cụ thể được **người khác dùng hoặc review**: workflow AI tiết kiệm thời gian đo được, feature spec được đội sản phẩm tham khảo, prototype/insight report từ dữ liệu thực, hoặc một bài toán công việc được giải rõ ràng nhờ AI. Điểm then chốt: đã có người khác dùng/đánh giá.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Deliverable rõ ràng, đã được người khác dùng/review, impact đo được |
| Đạt | Deliverable hoàn chỉnh, qua review, chất lượng đủ dùng |
| Cần cải thiện | Có output nhưng chưa qua review thực sự hoặc impact mờ |
| Chưa đạt | Chỉ có bài tập lý thuyết hoặc thử nghiệm chưa hoàn chỉnh |

### A2 · Thể hiện vòng lặp build → feedback → iterate

`OUT_iterate` · **Default: 35% · 1.75 điểm**

Product Builder thực sự không dừng ở version đầu. Đã nhận feedback (mentor, đồng nghiệp, hoặc kết quả thực) và điều chỉnh output/approach. Không "đứng bánh" khi kết quả chưa như kỳ vọng. Tín hiệu của learning velocity và builder mindset.

> **Nơi duy nhất** đo hành vi iterate/nhận feedback trên output. Growth Mindset (Will FIT) đo thái độ học hỏi tổng quát, không trùng việc iterate trên deliverable cụ thể.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Nhận feedback không defensive, iterate nhanh và có định hướng, chủ động khi gặp ambiguity |
| Đạt | Xử lý được feedback, iterate dù có thể chậm |
| Cần cải thiện | Cần nhiều guidance, khó chịu với sự không rõ ràng |
| Chưa đạt | Defensive với feedback, đứng im khi không rõ hướng |

### A3 · Hiểu giới hạn, rủi ro và phạm vi ứng dụng AI

`OUT_risk_awareness` · **Default: 25% · 1.25 điểm**

Không dùng AI mù quáng — biết khi nào AI là công cụ đúng và khi nào không. Mô tả được ≥1 rủi ro cụ thể của domain (hallucination, data sensitivity, bias, over-reliance) và có hành vi kiểm soát tương ứng. Hiểu AI là infrastructure, không phải oracle.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Nêu được rủi ro cụ thể theo domain, có hành vi kiểm soát thực tế |
| Đạt | Biết AI có thể sai, có cross-check cơ bản, không over-rely |
| Cần cải thiện | Hiểu lý thuyết nhưng chưa áp dụng vào hành vi |
| Chưa đạt | Dùng AI output mà không verify, xem AI như oracle |

---

## I.B. Can Do — Năng lực chuyên môn

*Có đủ nền tảng kỹ thuật để build giải pháp bằng AI không?* Chỉ chứa năng lực **kỹ thuật**.

### B1 · AI Foundations — hiểu đủ để build, không chỉ dùng

`CAN_ai_foundations` · **Default: 20% · 1.0 điểm**

Nắm cơ chế LLM ở mức conceptual: context window, tokenization, temperature, hallucination, RAG, tool use. Quan trọng hơn: biết các khái niệm này ảnh hưởng quyết định thiết kế sản phẩm thế nào (context limit → UX flow, hallucination → trust layer, latency → kỳ vọng người dùng). Tư duy "AI là infrastructure có constraints", không phải "AI là magic".

| Mức | Mô tả |
|---|---|
| Xuất sắc | Giải thích conceptual chính xác, kết nối được với quyết định product/workflow cụ thể |
| Đạt | Hiểu đủ để làm việc với AI component, không ảo tưởng về khả năng AI |
| Cần cải thiện | Biết khái niệm nhưng chưa kết nối với ứng dụng thực |
| Chưa đạt | Không hiểu nền tảng, xem AI như magic |

### B2 · Prompt Engineering & AI tool proficiency

`CAN_prompt_tools` · **Default: 25% · 1.25 điểm**

Thành thạo viết prompt đạt output mong muốn trong 1–2 lần, iterate có định hướng. Áp dụng: context injection, format specification, few-shot, chain-of-thought, task decomposition. Dùng được ≥2–3 AI tools phù hợp use case (Claude/ChatGPT cho reasoning/writing, Cursor/v0 cho code/UI, Notion AI cho docs...). **Đánh giá qua bài tập thực hành** — không hỏi lý thuyết.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Đạt output trong 1–2 lần, prompt có cấu trúc rõ, thành thạo 2+ tools |
| Đạt | Đạt output sau 3–4 lần, iterate có định hướng |
| Cần cải thiện | Prompt còn mơ hồ, chưa biết iterate hiệu quả |
| Chưa đạt | Không biết cải thiện khi output sai |

### B3 · Product Thinking — từ bài toán đến giải pháp

`CAN_product_thinking` · **Default: 25% · 1.25 điểm** *(tắt ở Non-IT)*

Áp dụng vòng lặp: bài toán người dùng → solution hypothesis → build → measure. Khi gặp một feature/workflow, biết đặt câu hỏi đúng: giải cho ai, success metric là gì, edge case nào chưa xử lý, AI có thực sự cần ở đây không? Không nhảy vào solution trước khi hiểu bài toán. Không cần kinh nghiệm — cần tư duy có cấu trúc.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Đặt câu hỏi đúng hướng, không sa vào solution, biết khi nào không cần AI |
| Đạt | Hiểu vòng lặp problem → solution → measure, tư duy có cấu trúc |
| Cần cải thiện | Còn nhảy vào solution, chưa đặt câu hỏi về user/metric |
| Chưa đạt | Tư duy feature-first, không có framework phân tích |

### B4 · Workflow design — tích hợp AI vào quy trình thực

`CAN_workflow_design` · **Default: 15% · 0.75 điểm**

Biết ánh xạ công việc thực sang AI use case cụ thể, thiết kế workflow có AI là một bước cụ thể — không phải thêm AI cho có. Mô tả rõ: input là gì, AI làm gì, output đi đâu, human review ở bước nào. Workflow chạy được mà không cần hỗ trợ kỹ thuật liên tục.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Workflow rõ ràng, AI có vai trò cụ thể, có human review layer, không cần hỗ trợ kỹ thuật liên tục |
| Đạt | Dùng AI trong vài bước nhất định, hiểu cách map use case |
| Cần cải thiện | Dùng AI rời rạc, chưa thành workflow có cấu trúc |
| Chưa đạt | Không biết thiết kế workflow với AI |

### B5 · Output quality control

`CAN_output_qc` · **Default: 15% · 0.75 điểm**

Không accept AI output blindly. Có thói quen verify thông tin quan trọng, nhận ra khi output sai/thiếu (sai thực tế, thiếu ngữ cảnh, format sai), biết iterate prompt để cải thiện. Hiểu "human in the loop" phù hợp vai trò.

> *Dedup:* tiêu chí này giữ thuần kiểm soát chất lượng output (kỹ thuật); self-learning chuyển hẳn sang Will FIT/Growth Mindset.

| Mức | Mô tả |
|---|---|
| Xuất sắc | Verify output thường xuyên & có hệ thống, phát hiện lỗi tinh vi, iterate prompt hiệu quả |
| Đạt | Cross-check thông tin quan trọng, nhận ra lỗi rõ ràng |
| Cần cải thiện | Verify không nhất quán, chỉ bắt được lỗi lớn |
| Chưa đạt | Accept AI output không verify |

---

## I.C. Will Do — Động lực & cam kết

*Có thực sự muốn trở thành Product Builder và duy trì lâu dài không?* Chỉ chứa **động lực & định hướng nghề**.

### C1 · Motivation fit

`WILLDO_motivation` · **Default: 30% · 1.5 điểm**

Có lý do cụ thể và chân thực để tham gia — không vì trend AI hay vì công ty yêu cầu. Lý do gắn với một bài toán thực muốn giải: trong công việc hằng ngày, trong domain YODY (Retail/Fashion/Supply Chain), hoặc trong con đường nghề nghiệp đang xây.

*Câu hỏi gợi ý:* "Điều gì khiến bạn tham gia — không phải câu trả lời 'đẹp', mà là lý do thực sự? Bài toán nào bạn muốn giải?"

### C2 · Career alignment

`WILLDO_career` · **Default: 40% · 2.0 điểm**

Định hướng tương thích với chương trình — PM, AI Product Builder, Technical Product Owner, hoặc bất kỳ vai trò nào cần kết hợp product thinking và AI fluency. Chủ động định vị việc nâng cao năng lực AI + product là career development, không phải gánh nặng. Không cần chắc 100% về hướng đi, nhưng cần thấy chủ đích.

*Câu hỏi gợi ý:* "Chương trình này fit vào con đường nghề nghiệp của bạn thế nào? Bạn muốn trở thành ai trong 2–3 năm tới?"

### C3 · Stability signal — cam kết dài hạn

`WILLDO_stability` · **Default: 30% · 1.5 điểm**

Tín hiệu sẽ duy trì cam kết và tiếp tục phát triển sau chương trình. Đo qua: khả năng cam kết full timeline, và track record tự build/tự học trước đây (project cá nhân, side project). Stability không phải "không đổi hướng" — mà là "không bỏ giữa chừng khi gặp khó".

> *Dedup:* "proactiveness/tự raise vấn đề" đã chuyển sang Will FIT/Ownership. Tiêu chí này tập trung vào cam kết timeline + track record bền bỉ.

*Câu hỏi gợi ý:* "Bạn có thể cam kết theo hết timeline không? Kể về một thứ bạn theo đuổi đến cùng dù gặp khó khăn."

---

## I.D. Will FIT — Giá trị cốt lõi YODY

*Có phù hợp với môi trường và văn hóa YODY không?* Bộ giá trị **dùng chung cho mọi đối tượng**, không override. Đánh giá **hành vi**, không phụ thuộc cấp bậc — một intern và một nhân viên 5 năm đều có thể đạt "Xuất sắc".

### D1 · Customer Centric — 25% · 1.25 điểm

`FIT_customer_centric` · Trong mọi quyết định, luôn hỏi "Điều này ảnh hưởng đến khách hàng thế nào?" — dù không trực tiếp làm việc với khách hàng. Hiểu kết quả cuối cùng luôn chạm đến người mua/người dùng.

- ✅ Tự hỏi về impact phía khách hàng trước khi thay đổi; đặt câu hỏi về trải nghiệm người dùng; ưu tiên giải pháp tốt cho khách hàng dù phức tạp hơn cho bản thân.
- ❌ Chỉ tối ưu quy trình nội bộ, không quan tâm downstream; xem khách hàng là người ngoài.
- *Câu hỏi:* "Kể về lần bạn thay đổi cách làm vì nghĩ đến người dùng/khách hàng — dù không ai yêu cầu."

### D2 · Ownership & Autonomy *(gồm proactiveness)* — 15% · 0.75 điểm

`FIT_ownership` · Nhận trách nhiệm về **kết quả**, không chỉ hành động. Gặp vấn đề, phản xạ đầu tiên là "tôi có thể làm gì?" thay vì "lỗi của ai?". Chủ động raise vấn đề và đề xuất giải pháp thay vì chờ giao. Hoạt động hiệu quả cả khi thiếu hướng dẫn chi tiết.

> **Nơi duy nhất** đo proactiveness/"không chờ giao việc".

- ✅ Tự raise vấn đề & đề xuất giải pháp; nhận lỗi và rút kinh nghiệm; tìm cách làm tiếp khi ambiguity.
- ❌ Làm đúng task nhưng không quan tâm kết quả thực; cần nhắc/check-in liên tục mới tiến.
- *Câu hỏi:* "Kể về lần bạn tự xử lý một vấn đề mà không ai yêu cầu — kết quả ra sao?"

### D3 · Integrity — 20% · 1.0 điểm

`FIT_integrity` · Nhất quán giữa lời nói và hành động, kể cả khi không ai nhìn. Nói thật khi có vấn đề thay vì che giấu. Không cam kết điều biết mình không làm được. Nền tảng để xây trust.

- ✅ Báo sớm khi có rủi ro trễ/chất lượng; nói thẳng khi không đồng ý; giữ cam kết nhỏ nhất (đúng giờ, đúng format, đúng scope).
- ❌ Nói điều người khác muốn nghe thay vì sự thật; che giấu vấn đề đến khi không giấu được.
- *Câu hỏi:* "Kể về lần bạn phải nói điều không dễ nghe với người có thẩm quyền. Bạn xử lý thế nào?"

### D4 · Growth Mindset *(gồm self-learning)* — 20% · 1.0 điểm

`FIT_growth_mindset` · Xem năng lực là thứ phát triển được. Nhận feedback như dữ liệu hữu ích, không phải công kích. Chủ động tự học ngoài vùng quen thuộc, gồm tự đọc tài liệu kỹ thuật/tool/concept mới không cần tay dắt. Trong môi trường YODY thay đổi nhanh, đây là trait quyết định ai bắt kịp.

> **Nơi duy nhất** đo self-learning.

- ✅ Tự học tool/kỹ năng mới không cần yêu cầu; tự đọc API docs/changelog và giải thích lại; nhận feedback không defensive; thoải mái nói "tôi không biết".
- ❌ Tránh task mới vì sợ sai/bị đánh giá; phản ứng defensive với feedback.
- *Câu hỏi:* "Kể về thứ bạn tự học trong 6 tháng gần đây — không phải vì công việc yêu cầu. Bạn học và áp dụng thế nào?"

### D5 · Good Relationship — 20% · 1.0 điểm

`FIT_good_relationship` · Xây quan hệ làm việc tốt với đồng nghiệp ở các team khác — không chỉ trong nhóm mình. Collaborate để đạt kết quả chung, không chỉ bảo vệ lợi ích team mình. Ở YODY (cross-functional cao), khả năng này tác động trực tiếp tới tốc độ và chất lượng.

- ✅ Chủ động kết nối với team khác khi có bài toán liên quan; chia sẻ thông tin hữu ích không cần được hỏi; giải quyết conflict tập trung vào kết quả chung.
- ❌ Chỉ communicate khi cần thiết; cạnh tranh thay vì collaborate khi lợi ích team xung đột.
- *Câu hỏi:* "Kể về lần bạn phải làm việc với người team khác để giải một bài toán. Điều gì khó nhất và bạn xử lý thế nào?"

---

## I.E. Bảng điểm tham chiếu

Áp dụng cho Will FIT và cho từng khía cạnh (thang 5.0):

| Mức | Khoảng điểm | Diễn giải |
|---|---|---|
| Xuất sắc | 4.5 – 5.0 | Thể hiện nhất quán trong hành vi thực tế |
| Đạt | 3.5 – 4.4 | Thể hiện rõ đa số tiêu chí, còn phát triển 1–2 chỗ |
| Cần cải thiện | 2.5 – 3.4 | Hiểu nhưng hành vi chưa nhất quán |
| Chưa đạt | < 2.5 | Có gap rõ ràng, cần đánh giá thêm |

Quy đổi % tổng (trên 20.0): **Xuất sắc 90–100% · Đạt 70–89% · Cần cải thiện 50–69% · Chưa đạt <50%.**

---

# PHẦN II — HAI KHUNG DẪN XUẤT

Mỗi chương trình = **khung gốc + override**. Tiêu chí không liệt kê dùng nguyên định nghĩa + trọng số default. Will FIT dùng nguyên, **không override** ở cả hai.

## II.A. AI Training (Non-IT)

**Định vị lộ trình:** L1 Aware → **L3 Builder**. Đạt L3 và có nhu cầu/năng lực → mở lộ trình L4–L5 (chuyển nhánh Product Builder, dùng override của bộ Intern).

**Tiêu chí bật/tắt:**

- **Tắt** `OUT_role_understanding` (A0) — đặc thù chương trình lộ trình cố định, không áp dụng cho Non-IT.
- **Tắt** `CAN_product_thinking` (B3) — Product Thinking đầy đủ là năng lực L4+, không bắt buộc ở trần L3; mở lại khi chuyển nhánh.

**Trọng số hiệu dụng:**

| Khía cạnh | Tiêu chí | Trọng số | Điểm |
|---|---|---|---|
| **A. Outcome** | A1 · Deliverable có giá trị thực | 40% | 2.0 |
| | A2 · Build → feedback → iterate | 35% | 1.75 |
| | A3 · Hiểu giới hạn/rủi ro AI | 25% | 1.25 |
| | *Tổng A* | *100%* | *5.0* |
| **B. Can Do** | B1 · AI Foundations | 20% | 1.0 |
| | B2 · Prompt Engineering & tools | 35% | 1.75 |
| | B4 · Workflow design | 30% | 1.5 |
| | B5 · Output quality control | 15% | 0.75 |
| | *Tổng B* | *100%* | *5.0* |
| **C. Will Do** | C1 · Motivation fit | 30% | 1.5 |
| | C2 · Career alignment | 40% | 2.0 |
| | C3 · Stability signal | 30% | 1.5 |
| | *Tổng C* | *100%* | *5.0* |
| **D. Will FIT** | (5 giá trị, dùng nguyên khung gốc) | 100% | 5.0 |
| | **TỔNG** | | **20.0** |

**Ngữ cảnh override (đặc thù Non-IT):**

- **A1 Deliverable:** "deliverable có giá trị" = 1 bài toán công việc thực được giải bằng AI (tự động hóa một bước soạn thảo/tổng hợp/phân tích lặp lại), được ≥1 đồng nghiệp dùng thử hoặc quản lý review. Không yêu cầu sản phẩm công nghệ. *Câu hỏi:* "Kể về một việc bạn đã dùng AI để giải — ai đã dùng lại cách làm đó, tiết kiệm được gì?"
- **B1 AI Foundations:** đủ để đặt kỳ vọng đúng, không cần chiều sâu kỹ thuật; phân biệt AI làm được/không làm được.
- **B2 Prompt:** trọng tâm của Non-IT — prompt patterns cho công việc văn phòng (soạn thảo, tóm tắt, phân tích, tra cứu, dịch); đánh giá qua bài tập tại chỗ.
- **B4 Workflow:** mini-workflow đơn giản ghép AI vào quy trình phòng ban hiện có, không cần hỗ trợ kỹ thuật.
- **C2 Career:** hiểu AI literacy đang là baseline competency; không yêu cầu định hướng PM/Product Builder cụ thể.
- **C1 Motivation:** *Câu hỏi:* "Sau chương trình, 1–2 việc cụ thể nào bạn muốn tiếp tục dùng AI để làm tốt hơn?"

---

## II.B. Intern Product Builder

**Định vị lộ trình:** L1–L2 → **L5 Architect** (chuẩn tốt nghiệp bắt buộc).

**Tiêu chí bật:**

- **Bật** `OUT_role_understanding` (A0, 25%) — đặc thù lộ trình cố định của Intern. Vì thêm tiêu chí 25%, ba tiêu chí Outcome còn lại được tái cân chỉnh (giữ tương quan default 40:35:25).
- **Áp dụng đầy đủ** `CAN_product_thinking` (B3) — Product Thinking đầy đủ.

**Trọng số hiệu dụng:**

| Khía cạnh | Tiêu chí | Trọng số | Điểm |
|---|---|---|---|
| **A. Outcome** | A0 · Hiểu vai trò & kỳ vọng Product Builder | 25% | 1.25 |
| | A1 · Deliverable sản phẩm có giá trị thực | 30% | 1.5 |
| | A2 · Build → feedback → iterate | 25% | 1.25 |
| | A3 · Hiểu giới hạn/rủi ro AI | 20% | 1.0 |
| | *Tổng A* | *100%* | *5.0* |
| **B. Can Do** | B1 · AI Foundations | 20% | 1.0 |
| | B2 · Prompt Engineering & tools | 25% | 1.25 |
| | B3 · Product Thinking | 25% | 1.25 |
| | B4 · Workflow design | 15% | 0.75 |
| | B5 · Output quality control | 15% | 0.75 |
| | *Tổng B* | *100%* | *5.0* |
| **C. Will Do** | C1 · Motivation fit | 30% | 1.5 |
| | C2 · Career alignment | 40% | 2.0 |
| | C3 · Stability signal | 30% | 1.5 |
| | *Tổng C* | *100%* | *5.0* |
| **D. Will FIT** | (5 giá trị, dùng nguyên khung gốc) | 100% | 5.0 |
| | **TỔNG** | | **20.0** |

**Ngữ cảnh override (đặc thù Intern):**

- **A0 Role:** intern hiểu đây không phải vai trò "học quan sát" mà được kỳ vọng contribute vào ≥1 product initiative; phân biệt Product Builder và vai trò thực thi đơn thuần; nắm lộ trình + milestone.
- **A1 Deliverable:** ≥1 deliverable sản phẩm cụ thể — feature spec / prototype-mockup / AI-assisted workflow / insight report từ dữ liệu thực, được mentor hoặc đội sản phẩm review. Không phải bài tập lý thuyết.
- **B1 AI Foundations:** đủ để ra quyết định product đúng khi AI là một component (token, context window, temperature, hallucination, RAG conceptual). Không cần code ML.
- **B2 Prompt:** 2–3 AI tools cho product building (Claude/ChatGPT cho research/spec, Cursor/Copilot nếu coding, v0/Midjourney cho design, Notion AI). Prompt để extract insight, draft spec, synthesize research, prototype UI.
- **B3 Product Thinking:** vòng lặp đầy đủ — bài toán người dùng → solution hypothesis → build → measure; success metric, edge case, trade-off, quyết định AI-fit.
- **B4 Workflow:** workflow cho product context (AI-assisted spec/prototype/insight report); Cowork task loop, skills & plugins; QC mức product (nguồn dữ liệu, edge case).
- **C1 Motivation:** gắn với bài toán Retail/Fashion/Supply Chain của YODY hoặc xây sản phẩm AI ở môi trường thực — không phải "muốn học AI" chung chung. *Câu hỏi:* "Điều gì ở YODY mà bạn muốn contribute cụ thể?"
- **C2 Career:** định hướng sau thực tập tương thích — PM, AI Product Builder, Technical Product Owner, hoặc Software Engineer với product mindset. Cần thấy bước đi có chủ đích.
- **C3 Stability:** cam kết full timeline + track record tự build/tự học trước đó (project cá nhân, side project).

---

# PHẦN III — CƠ CHẾ GATE (GATE-BY-EVIDENCE)

**Nguyên tắc:** lên level dựa trên **bằng chứng hành vi + người duyệt** (exit criteria của ladder), **không** dựa trên ngưỡng điểm rubric. Quiz/lab trong buổi chỉ là *input bằng chứng* + giúp học viên tự thấy tiến bộ. Mỗi buổi cuối level **tạo ra deliverable gate** và có người duyệt.

**Bản đồ gate & người duyệt** (theo `00_Core/progression_ladder.md` D.2):

| Gate | Buổi tạo deliverable | Người duyệt |
|---|---|---|
| L1→L2 | N1.2 / I1.2 | Trainer chương trình |
| L2→L3 | N2.3 / I2.3 | Trainer / Team lead |
| L3→L4 | N3.3 (tốt nghiệp Non-IT) / I3.3 | Mentor sản phẩm |
| L4→L5 | I4.3 | Mentor + đội Product |
| Tốt nghiệp L5 | I5.3 | Hội đồng Product Builder |

**Liêm chính đánh giá trong thời đại ai cũng có AI:** học viên nào cũng có sẵn công cụ AI, nên quiz kiến thức thuần gần như vô nghĩa nếu thi online không giám sát. Thay vì chống AI, **đổi cách đo** — chấm trên thứ AI không làm thay được:

- **Discernment:** phát hiện và sửa lỗi AI (cài sẵn "bẫy" để xem học viên có nhận ra kết quả sai không).
- **Description:** chất lượng cách giao việc cho AI (xem lịch sử prompt).
- **Diligence:** xử lý dữ liệu an toàn, minh bạch về phần nào do AI làm.
- **Vấn đáp live:** hỏi "vì sao chọn cách này", "rủi ro ở đâu" — AI không trả lời thay tại chỗ được.
- **Quan sát quá trình, không chỉ sản phẩm:** lab live + oral defense làm cho việc "nhờ AI làm hộ toàn bộ" không qua được gate.

> Nguyên tắc: bài đánh giá tốt là bài mà *người dùng AI giỏi sẽ vượt qua, người chỉ biết copy-paste AI thì trượt*.

**Lớp hiển thị tiến độ (badge & tracker):** badge cấp khi **qua gate hành vi**, không phải khi đậu điểm. Chi tiết gamification, recertification, vận hành: `03_Giao-An-Trien-Khai.md`.

---

# PHẦN IV — SCORECARD CHẤM ĐIỂM

> **Cách dùng:** Chọn chương trình → chấm theo các tiêu chí ÁP DỤNG cho chương trình đó. Trọng số khác nhau giữa hai chương trình — dùng cột phù hợp.

**Họ tên:** ___________________________
**Chương trình:** &nbsp; [ ] AI Training (Non-IT) &nbsp;&nbsp; [ ] Intern Product Builder
**Người đánh giá:** ___________________________
**Thời điểm:** &nbsp; [ ] Đầu vào &nbsp;&nbsp; [ ] Giữa chương trình &nbsp;&nbsp; [ ] Cuối chương trình
**Level hiện tại (theo ladder):** _______ &nbsp;&nbsp; **Ngày:** ___________

> **Đánh giá đầu vào:** tập trung tín hiệu tiềm năng — Outcome (hiểu kỳ vọng) + Will Do (motivation). Không kỳ vọng Can Do đầy đủ ở người chưa qua lộ trình.

## A. Outcome — Kết quả tạo ra (Tổng: 5.0)

| # | Tiêu chí | Non-IT | Intern | Áp dụng |
|---|---|---|---|---|
| A0 | Hiểu vai trò & kỳ vọng Product Builder | — | 1.25 | Chỉ Intern |
| A1 | Đã xây dựng ≥1 deliverable có giá trị thực | 2.0 | 1.5 | Cả hai |
| A2 | Vòng lặp build → feedback → iterate | 1.75 | 1.25 | Cả hai |
| A3 | Hiểu giới hạn, rủi ro, phạm vi ứng dụng AI | 1.25 | 1.0 | Cả hai |

- **A0** *(chỉ Intern · 1.25)* — Điểm: ____/1.25 · Ghi chú: __________
- **A1** — Điểm: ____/(Non-IT 2.0 · Intern 1.5) · Deliverable: __________
- **A2** — Điểm: ____/(Non-IT 1.75 · Intern 1.25) · Ghi chú: __________
- **A3** — Điểm: ____/(Non-IT 1.25 · Intern 1.0) · Ghi chú: __________

**Tổng A. Outcome:** _______ / 5.0

## B. Can Do — Năng lực chuyên môn (Tổng: 5.0)

| # | Tiêu chí | Non-IT | Intern | Áp dụng |
|---|---|---|---|---|
| B1 | AI Foundations — hiểu đủ để build | 1.0 | 1.0 | Cả hai |
| B2 | Prompt Engineering & AI tool proficiency | 1.75 | 1.25 | Cả hai |
| B3 | Product Thinking — từ bài toán đến giải pháp | — | 1.25 | Chỉ Intern |
| B4 | Workflow design — tích hợp AI vào quy trình | 1.5 | 0.75 | Cả hai |
| B5 | Output quality control | 0.75 | 0.75 | Cả hai |

> *Non-IT (trần L3):* Product Thinking đầy đủ KHÔNG bắt buộc — mở lại khi chuyển nhánh Product Builder.

- **B1** — Điểm: ____/1.0 · Ghi chú: __________
- **B2** *(bài tập thực hành)* — Điểm: ____/(Non-IT 1.75 · Intern 1.25) · Ghi chú: __________
- **B3** *(chỉ Intern · 1.25)* — Điểm: ____/1.25 · Ghi chú: __________
- **B4** — Điểm: ____/(Non-IT 1.5 · Intern 0.75) · Ghi chú: __________
- **B5** — Điểm: ____/0.75 · Ghi chú: __________

**Tổng B. Can Do:** _______ / 5.0

## C. Will Do — Động lực & Cam kết (Tổng: 5.0)

| # | Tiêu chí | Trọng số | Điểm tối đa | Điểm đạt |
|---|---|---|---|---|
| C1 | Motivation fit | 30% | 1.5 | _______ |
| C2 | Career alignment | 40% | 2.0 | _______ |
| C3 | Stability signal — cam kết dài hạn | 30% | 1.5 | _______ |

**Tổng C. Will Do:** _______ / 5.0

## D. Will FIT — Giá trị cốt lõi (Tổng: 5.0)
*Dùng chung cho mọi chương trình, không override.*

| Tiêu chí | Trọng số | Điểm tối đa | Điểm đạt | Ghi chú |
|---|---|---|---|---|
| Customer Centric | 25% | 1.25 | _______ | |
| Ownership & Autonomy *(gồm proactiveness)* | 15% | 0.75 | _______ | |
| Integrity | 20% | 1.0 | _______ | |
| Growth Mindset *(gồm self-learning)* | 20% | 1.0 | _______ | |
| Good Relationship | 20% | 1.0 | _______ | |

**Tổng D. Will FIT:** _______ / 5.0

## Tổng kết

| Khía cạnh | Điểm tối đa | Điểm đạt | % |
|---|---|---|---|
| A. Outcome | 5.0 | _______ | _______ |
| B. Can Do | 5.0 | _______ | _______ |
| C. Will Do | 5.0 | _______ | _______ |
| D. Will FIT | 5.0 | _______ | _______ |
| **Tổng** | **20.0** | **_______** | **_______** |

**Đầu vào:** &nbsp; [ ] Nhận vào &nbsp; [ ] Dự bị &nbsp; [ ] Không phù hợp

**Cuối chương trình:**
- [ ] Xuất sắc (≥90%) — tiềm năng offer / extend / AI champion
- [ ] Hoàn thành (70–89%) — tốt nghiệp
- [ ] Cần theo dõi (50–69%) — extend / coaching thêm
- [ ] Không hoàn thành (<50%)

**Điểm mạnh nổi bật:** ___________________________________________
**Điểm cần phát triển:** ___________________________________________
**Nhận xét tổng quan:** ___________________________________________
**Chữ ký người đánh giá:** ___________________ **Ngày:** ___________

---

*YODY Product Builder Program · Tài liệu gốc 2/3 · v3.0 · 23/06/2026 · Tổng hợp từ `00_Core/*` + hai `framework.json`.*

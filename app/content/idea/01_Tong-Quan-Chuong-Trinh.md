# YODY Product Builder Program — Tổng quan & Kiến trúc

> **Phiên bản:** 3.0 (consolidated) · **Ngày:** 23/06/2026 · **Biên soạn:** Jeremy Nguyen / YODY
> **Vai trò file:** Tài liệu gốc số 1/3 — định vị chiến lược, kiến trúc tài liệu, khung lý thuyết nền và lộ trình 5 level. Đọc file này trước.
> **Bộ tài liệu gốc:**
> 1. `01_Tong-Quan-Chuong-Trinh.md` *(file này)* — chiến lược, kiến trúc, 4D, lộ trình 5 level, quản trị.
> 2. `02_Khung-Nang-Luc-Danh-Gia.md` — rubric 4 khía cạnh, 2 khung dẫn xuất, gate, scorecard.
> 3. `03_Giao-An-Trien-Khai.md` — 22 buổi học, khung thiết kế buổi, vận hành, thư viện tài nguyên.
>
> **Nguồn máy đọc (canonical):** `00_Core/competency_dictionary.json`, `00_Core/will_fit.json`, `00_Core/progression_ladder.md`, và hai `framework.json` trong `01_AI-Training-NonIT/`, `02_Intern-Product-Builder/`. Bộ 3 file markdown này là bản tổng hợp để đọc; khi xung đột, JSON canonical thắng.

---

## Mục lục

- [1. Mục tiêu chiến lược](#1-mục-tiêu-chiến-lược)
- [2. Kiến trúc tài liệu: 1 gốc + 2 dẫn xuất](#2-kiến-trúc-tài-liệu-1-gốc--2-dẫn-xuất)
- [3. Hai chương trình](#3-hai-chương-trình)
- [4. Khung lý thuyết nền](#4-khung-lý-thuyết-nền)
- [5. Lộ trình 5 level (taxonomy chuẩn)](#5-lộ-trình-5-level-taxonomy-chuẩn)
- [6. Cấu trúc thời gian](#6-cấu-trúc-thời-gian)
- [7. Quản trị, vai trò & KPI](#7-quản-trị-vai-trò--kpi)
- [8. Rủi ro & giả định cần xác nhận](#8-rủi-ro--giả-định-cần-xác-nhận)
- [Phụ lục — Ghi chú reconcile phiên bản](#phụ-lục--ghi-chú-reconcile-phiên-bản)

---

## 1. Mục tiêu chiến lược

Chương trình xây dựng năng lực AI cho hai nhóm với hai mục tiêu khác nhau nhưng bổ trợ: phổ cập AI cho nhân sự nghiệp vụ, và đào tạo lớp Product Builder có thể đóng góp trực tiếp vào sản phẩm YODY.

**Mục tiêu kinh doanh (đo lường được):**

- Phổ cập: ≥ 80% nhân sự non-IT đạt tối thiểu L2 trong khung thời gian chương trình.
- Chuyên sâu: ≥ 1 sản phẩm/feature AI-native (capstone) có ROI đo được.
- Hình thành **thư viện prompt & workflow nội bộ** theo phòng ban.
- Thiết lập **chính sách quản trị AI**: đạo đức, bảo mật dữ liệu, tuân thủ pháp luật.

**Triết lý xuyên suốt:** AI là *infrastructure có constraints*, không phải magic. Năng lực đo bằng **bằng chứng đầu ra**, không bằng số giờ học hay điểm quiz.

---

## 2. Kiến trúc tài liệu: 1 gốc + 2 dẫn xuất

Bộ gốc (`00_Core`) là **nguồn định nghĩa duy nhất** (canonical). Hai chương trình **dẫn xuất** theo mô hình **base + override** — bộ con chỉ khai báo phần khác biệt (trọng số, ví dụ, trần level, bật/tắt tiêu chí optional). Sửa định nghĩa tiêu chí → sửa 1 chỗ ở gốc; sửa đặc thù chương trình → sửa ở bộ con.

```
Product Builder Program/
├── 00_Core/                          # GỐC — canonical, không chấm trực tiếp
│   ├── competency_dictionary.json    #   Định nghĩa đầy đủ 4 khía cạnh (Outcome/Can Do/Will Do)
│   ├── will_fit.json                 #   Will FIT — giá trị cốt lõi dùng chung
│   └── progression_ladder.md         #   Lộ trình 5 level + cách nối rubric ↔ ladder
├── 01_AI-Training-NonIT/
│   ├── framework.json                # Override: trần L3, ví dụ non-IT
│   └── Sessions/                      # 8 giáo án chi tiết
├── 02_Intern-Product-Builder/
│   ├── framework.json                # Override: trần L5, bật tiêu chí "vai trò Product Builder"
│   ├── Sessions/                      # 14 giáo án chi tiết
│   └── Teaching-Kit-*/                # Bộ giảng dạy theo buổi
├── 01_Tong-Quan-Chuong-Trinh.md      # ← Tài liệu gốc (file này)
├── 02_Khung-Nang-Luc-Danh-Gia.md     # ← Tài liệu gốc
├── 03_Giao-An-Trien-Khai.md          # ← Tài liệu gốc
└── _archive/                         # 9 file markdown nháp/tiền thân (tham khảo lịch sử)
```

**Cách đọc một bộ chương trình:** rubric đầy đủ = **bộ gốc** + áp **override** của chương trình. Tiêu chí optional không bật ở bộ con = không áp dụng.

---

## 3. Hai chương trình

| | **AI Training (Non-IT)** | **Intern Product Builder** |
|---|---|---|
| Đối tượng | Nhân sự non-IT: Kinh doanh, Marketing, Vận hành, Supply Chain, Tài chính, Nhân sự, CSKH | Thực tập sinh hướng product (năm 3–4 hoặc mới tốt nghiệp) |
| Mục tiêu | Ứng dụng AI vào công việc thực tế | Trở thành Product Builder đóng góp cho sản phẩm YODY |
| Điểm xuất phát | L1 Aware | L1–L2 |
| Trần tốt nghiệp | **L3 Builder** | **L5 Architect** (bắt buộc) |
| Output đánh giá | Bài toán công việc thực đã giải bằng AI | Deliverable sản phẩm thực (spec / prototype / insight report) |
| Số buổi | 8 buổi (~75–90 phút) | 14 buổi (~120–180 phút) |
| Hình thức | Blended (self-paced + 1 live/tuần) | Cohort + lab, project-based |
| Tiêu chí role (A0) | Tắt | **Bật** (25%) |
| Product Thinking (B3) | Tắt (năng lực L4+) | **Bật** (25%) |
| Mở rộng | Đạt L3 + có nhu cầu → mở nhánh L4–L5 (dùng override bộ Intern) | — |

Will FIT (giá trị cốt lõi YODY) **dùng chung cho cả hai**, không override. Chi tiết trọng số và rubric: `02_Khung-Nang-Luc-Danh-Gia.md`.

---

## 4. Khung lý thuyết nền

### 4.1 AI Fluency 4D — xương sống tư duy cho cả hai chương trình

AI Fluency: *khả năng làm việc với AI một cách hiệu quả (effective), thành thạo (efficient), có đạo đức (ethical) và an toàn (safe)*. Bốn năng lực cốt lõi:

| D | Năng lực | Bản chất | Câu hỏi định hướng |
|---|---|---|---|
| **Delegation** — Ủy quyền | Quyết định *có nên, khi nào, phần nào* giao cho AI | Phân vai con người ↔ AI | "Việc này nên để AI làm, mình làm, hay làm chung?" |
| **Description** — Mô tả | Diễn đạt mục tiêu/ngữ cảnh đủ tốt để AI cho kết quả hữu ích | Prompt engineering | "Mình đã cung cấp đủ ngữ cảnh, vai trò, định dạng chưa?" |
| **Discernment** — Phân biệt | Đánh giá đúng chất lượng kết quả & hành vi của AI | Tư duy phản biện, fact-check | "Kết quả này đúng/đủ/đáng tin không? Sai ở đâu?" |
| **Diligence** — Cẩn trọng | Chịu trách nhiệm về cách dùng AI và hệ quả | Đạo đức, bảo mật, minh bạch | "Dùng thế này có an toàn dữ liệu, minh bạch, đúng luật không?" |

**Ba chế độ tương tác con người–AI** (dạy ở mọi level, độ sâu tăng dần):

- **Automation** — AI thực thi tác vụ cụ thể theo hướng dẫn.
- **Augmentation** — Con người và AI cộng tác như đối tác tư duy.
- **Agency** — Con người cấu hình AI để tự chủ thực hiện tác vụ thay mình (agent).

> **Vòng lặp cốt lõi cần rèn:** Description → Discernment loop — mô tả → đánh giá kết quả → tinh chỉnh mô tả → lặp lại. **Diligence không thương lượng:** mọi buổi học đều có ô an toàn dữ liệu (PII, Luật 91/2025/QH15), kể cả buổi kỹ thuật.

### 4.2 Harness Engineering — chỉ áp dụng cho Intern Product Builder (L4–L5)

Triết lý: harness *không làm model thông minh hơn*, mà tạo **hệ thống làm việc khép kín** ràng buộc agent bằng quy tắc, ngữ cảnh, kiểm chứng và khả năng quan sát. Đây là nền để đưa AI agent vào production một cách tin cậy.

Nội dung (theo 12 bài WalkingLabs, dạy ở buổi I5.x): (1) vì sao agent giỏi vẫn fail; (2) harness là gì; (3) repo làm system-of-record; (4) vì sao một file hướng dẫn khổng lồ thất bại; (5) giữ ngữ cảnh qua phiên dài; (6) phase khởi tạo riêng; (7) agent ôm việc nhưng không hoàn thành; (8) feature list như primitive; (9) agent "tuyên bố thắng" quá sớm; (10) end-to-end testing; (11) observability; (12) mỗi phiên để lại trạng thái sạch.

Thực hành: dựng minimal harness (`AGENTS.md`, `feature_list.json`, `claude-progress.md`) cho 1 repo thật.

---

## 5. Lộ trình 5 level (taxonomy chuẩn)

Một thang đo duy nhất cho cả tổ chức. Độ sâu kỹ thuật và bài tập rẽ nhánh theo chương trình; trần level khác nhau.

| Level | Tên | Triết lý | Trọng tâm | Trọng tâm 4D | Khía cạnh chủ đạo |
|---|---|---|---|---|---|
| **L1** | **Aware** | Hiểu AI là gì, làm được/không làm được gì | Nhận thức & kỳ vọng đúng | Diligence | Growth Mindset |
| **L2** | **Operator** | Dùng AI thành thạo cho việc của mình | Vận hành & prompt thực chiến | Description + Discernment | Ownership |
| **L3** | **Builder** | Tự xây workflow AI giải bài toán thật | Workflow & deliverable đầu tiên | Delegation + Description | Customer Centric |
| **L4** | **Integrator** | Tích hợp AI vào sản phẩm/quy trình thật | Product thinking & iterate | Agency + Harness cơ bản | Good Relationship |
| **L5** | **Architect** | Kiến trúc giải pháp cho người khác dùng | Hệ thống, rủi ro, scale | Cả 4D ở mức hệ thống | Integrity ở quy mô |

**Trần theo chương trình:** Non-IT tốt nghiệp **L3**; Intern tốt nghiệp **L5** (bắt buộc).

**Trade-off đã chốt — ai trả giá:** Trần L3 cho nhóm non-IT là *cố tình*. Ép lên L4–L5 sẽ loãng chất lượng, giảm tỷ lệ hoàn thành và niềm tin. Nhóm Intern bỏ qua dạy lại nền nếu đã vững (placement), dồn cho L3–L5.

**Nguyên tắc nối rubric ↔ ladder:** rubric **đo chiều cao** (điểm tại một thời điểm), ladder **vẽ con đường** (đang ở chặng nào). Gate chuyển level dựa trên **bằng chứng hành vi** (deliverable + người duyệt), **không** dựa trên ngưỡng điểm rubric — tránh biến điều kiện để đi tiếp thành cổng chặn theo điểm số. Chi tiết gate & người duyệt: `02_Khung-Nang-Luc-Danh-Gia.md`.

---

## 6. Cấu trúc thời gian

| | AI Training (Non-IT) — 8 buổi | Intern Product Builder — 14 buổi |
|---|---|---|
| **Nhịp** | ~75–90 phút/buổi, blended | ~120–180 phút/buổi, cohort + lab |
| **Phân bổ level** | L1: 2 buổi · L2: 3 · L3: 3 | L1: 2 · L2: 3 · L3: 3 · L4: 3 · L5: 3 |
| **Phase nền tảng** | L1→L2: Nhận biết + Sử dụng cơ bản | L1→L3: Fundamentals + prompting + workflow/deliverable |
| **Phase ứng dụng** | L3: Workflow & deliverable theo phòng ban | L4: Product thinking, technical track, tích hợp initiative |
| **Phase kiến tạo** | (tốt nghiệp ở L3) | L5: Kiến trúc + production readiness + capstone |

Bản đồ 22 buổi chi tiết (mục tiêu, lab, gate từng buổi): `03_Giao-An-Trien-Khai.md`.

---

## 7. Quản trị, vai trò & KPI

**Vai trò:**

- **Sponsor** — CTO / Ban lãnh đạo.
- **Program Owner** — điều phối, đo KPI.
- **Mentor / Coach** — leader kỹ thuật (Intern); champion phòng ban (Non-IT).
- **Học viên** — cam kết thời lượng, nộp evidence.

**Quản trị AI (bắt buộc trước khi mở rộng):**

- Danh mục công cụ AI được phê duyệt + quy tắc dữ liệu.
- Chính sách tuân thủ **Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15, hiệu lực 01/01/2026)** và **NĐ 356/2025/NĐ-CP**.
- Sandbox an toàn; kênh báo cáo sự cố/rò rỉ.
- **Ranh giới cứng:** không tự deploy production khi chưa qua review; không nhập PII khách hàng/nhân sự/số liệu mật vào công cụ AI công cộng.

**KPI thành công:** tỷ lệ hoàn thành & đạt level theo nhóm; giờ tiết kiệm/tuần (Non-IT); số sản phẩm/automation (Intern); mức đóng góp thư viện prompt/workflow nội bộ.

---

## 8. Rủi ro & giả định cần xác nhận

| Hạng mục | Giả định hiện tại | Cần xác nhận |
|---|---|---|
| Trần level Non-IT | L3 trong khung thời gian | Chấp nhận, hay fast-track nhóm nhỏ lên L4? |
| Nền nhóm Intern | Đã có L1–L2 | Cần buổi placement/bootcamp nền không? |
| Công cụ | YODY sẽ duyệt danh mục công cụ AI nội bộ | Đã có danh mục & ngân sách license chưa? |
| Thời lượng/tuần | Non-IT 2–3h · Intern 6–8h | Phù hợp lịch vận hành cửa hàng/đội product? |
| Capstone | Có bài toán thật + dữ liệu truy cập được | Ai cấp dữ liệu & môi trường? |
| Nền tảng vận hành (LMS) | Pilot → LMS chuyên dụng | Chốt Moodle (self-host) hay TalentLMS (SaaS)? Xem `03_Giao-An-Trien-Khai.md` |

---

## Phụ lục — Ghi chú reconcile phiên bản

Bộ 3 file gốc này hợp nhất 9 file markdown tiền thân (đã chuyển vào `_archive/`). Khi hợp nhất, **lấy taxonomy mới làm chuẩn** và loại bỏ mâu thuẫn của bản nháp cũ:

| Khía cạnh | Bản nháp cũ *(_archive/)* | Chuẩn hiện hành |
|---|---|---|
| Tên 5 level | Awareness · Literacy · Practitioner · Integrator · Innovator/Builder | **Aware · Operator · Builder · Integrator · Architect** |
| Cách chia chương trình | A (Builder, L3–L5) + B (Phổ cập, L1–L3) | **AI-Training-NonIT (L1→L3)** + **Intern Product Builder (L1→L5)** |
| Cơ chế gate | Hard-gate level-up exam (đậu điểm mới lên) | **Gate-by-evidence** (bằng chứng hành vi + người duyệt) |

Phần còn giá trị của bản nháp được giữ và gắn vào hệ chuẩn: khung 4D, Harness Engineering, nội dung module, khung thiết kế buổi học, gamification/badge, tư vấn nền tảng LMS, quản trị động lực. Phần "level-up exam làm cổng cứng" bị thay bằng gate-by-evidence.

---

*YODY Product Builder Program · Tài liệu gốc 1/3 · v3.0 · 23/06/2026 · Biên soạn: Jeremy Nguyen.*

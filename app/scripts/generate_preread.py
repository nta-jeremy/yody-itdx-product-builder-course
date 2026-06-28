#!/usr/bin/env python3
"""
Generate pre-read files for the 6 heavy kits that were split in Phase 6.
I1.1 was already produced in Phase 4; this script adds preread for the
remaining kits (I1.2, I2.1, I2.2, I2.3, I3.1, I3.2, I3.3, I4.1, I4.2,
I4.3, I5.1, I5.2, I5.3 = 13 kits).
"""

import sys
from pathlib import Path

CONTENT_ROOT = Path("content/idea/Intern-Product-Builder")

# 13 kits: code, title, gate?, bullets (5), questions (3).
KITS = [
    {
        "code": "I2.1",
        "title": "Advanced Prompting — 4 kỹ thuật nền tảng",
        "bullets": [
            "Chain-of-Thought: yêu cầu AI trình bày suy luận từng bước để giảm lỗi logic",
            "Task Decomposition: chẻ việc lớn thành chuỗi bước nhỏ có thể verify",
            "Context Injection: cung cấp đủ thông tin cụ thể, tránh nội dung chung chung",
            "Structured Output: yêu cầu format cố định (JSON, table, list) để dễ parse",
            "Ghép 4 kỹ thuật lại khi giải bài toán phức tạp — không dùng riêng lẻ",
        ],
        "questions": [
            {
                "q": "Khi nào nên dùng Chain-of-Thought?",
                "options": [
                    "Mọi prompt đều nên có",
                    "Khi task logic phức tạp, nhiều bước suy luận",
                    "Chỉ khi dùng GPT-4",
                    "Khi output ngắn",
                ],
                "answer": "B",
                "explanation": "CoT giúp AI có thời gian 'suy nghĩ' — hữu ích cho logic phức tạp, không cần cho task đơn giản.",
            },
            {
                "q": "Task Decomposition quan trọng vì sao?",
                "options": [
                    "Giảm chi phí API",
                    "Mỗi bước nhỏ có thể verify và debug riêng",
                    "Prompt ngắn hơn",
                    "Nhanh hơn",
                ],
                "answer": "B",
                "explanation": "Bước nhỏ = dễ verify từng phần + dễ debug khi sai + có thể parallel hoá.",
            },
            {
                "q": "Structured Output giúp ích gì?",
                "options": [
                    "Output đẹp hơn",
                    "Dễ parse programmatically, giảm lỗi format",
                    "Tăng tốc độ",
                    "Tăng creativity",
                ],
                "answer": "B",
                "explanation": "Khi output cố định format, code parser không phải đoán — giảm edge case.",
            },
        ],
    },
    {
        "code": "I2.3",
        "title": "Prompt cho Insight & Spec (Gate L2→L3)",
        "bullets": [
            "Insight ≠ Tóm tắt — Insight cho action, Tóm tắt chỉ là mô tả",
            "Phân rã nhiệm vụ: đừng hỏi tất cả trong một prompt",
            "Grounding: buộc AI trích dẫn nguồn để chống insight ma",
            "Template Spec 7 mục: bộ khung spec một trang",
            "Discernment: truy nguồn từng nhận định trước khi tin",
        ],
        "questions": [
            {
                "q": "Insight khác Tóm tắt ở điểm nào?",
                "options": [
                    "Insight dài hơn",
                    "Insight dẫn đến action, Tóm tắt chỉ mô tả",
                    "Insight có số liệu",
                    "Insight dùng bullet",
                ],
                "answer": "B",
                "explanation": "Insight phải actionable — 'doanh thu giảm 15% vì X' (action) vs 'doanh thu 1M' (summary).",
            },
            {
                "q": "Grounding quan trọng vì sao?",
                "options": [
                    "Giảm hallucination",
                    "Output dễ đọc hơn",
                    "Tăng tốc độ",
                    "Giảm chi phí",
                ],
                "answer": "A",
                "explanation": "Buộc AI trích dẫn nguồn → user check được → giảm hallucination.",
            },
            {
                "q": "Spec tốt phải có?",
                "options": [
                    "Code example",
                    "Mục tiêu + tiêu chí + scope + constraint",
                    "Screenshot mockup",
                    "Bug list",
                ],
                "answer": "B",
                "explanation": "Spec phải đủ rõ để implementer không phải đoán — mục tiêu rõ, tiêu chí đo được.",
            },
        ],
    },
    {
        "code": "I3.1",
        "title": "Workflow Design & Cowork",
        "bullets": [
            "4 ô bắt buộc của mọi workflow AI: Input → AI làm gì → Output → Checkpoint",
            "Ô 'AI làm gì' phải là hành động cụ thể, không phải 'xử lý'",
            "Cowork khác chat: có task loop với state management",
            "Human-in-the-loop đặt checkpoint ở chỗ rủi ro cao",
            "Workflow phục vụ user cuối, không phải phục vụ AI",
        ],
        "questions": [
            {
                "q": "Workflow AI thiếu ô nào thường gặp nhất?",
                "options": [
                    "Input",
                    "AI làm gì",
                    "Checkpoint (human review)",
                    "Output",
                ],
                "answer": "C",
                "explanation": "Skip checkpoint = AI tự quyết định → rủi ro cao. Checkpoint là safety net.",
            },
            {
                "q": "Cowork khác chat ở điểm nào?",
                "options": [
                    "Dùng model mạnh hơn",
                    "Có task loop và state management giữa các turn",
                    "Trả tiền nhiều hơn",
                    "Dùng giọng thân thiện",
                ],
                "answer": "B",
                "explanation": "Cowork = AI remember context qua task loop, không phải stateless Q&A.",
            },
            {
                "q": "Khi nào cần human checkpoint?",
                "options": [
                    "Mọi output",
                    "Khi output có risk cao (gửi email, commit code, chi tiền)",
                    "Khi user yêu cầu",
                    "Khi model không chắc chắn",
                ],
                "answer": "B",
                "explanation": "Risk cao = cần review. Low-risk task = AI tự quyết OK.",
            },
        ],
    },
    {
        "code": "I4.1",
        "title": "Product Thinking — Canvas 8 mục",
        "bullets": [
            "Canvas 8 mục: Problem, User, JTBD, AI fit, Risk, Metric, Rollout, Edge cases",
            "Vòng lặp: canvas → hypothesis → MVP → metric → iterate",
            "An toàn dữ liệu từ đầu — không phải giai đoạn cuối",
            "Lỗi phổ biến: bắt đầu từ 'AI có thể làm gì' thay vì 'user cần gì'",
            "Canvas là hypothesis, không phải kế hoạch — phải validate với user",
        ],
        "questions": [
            {
                "q": "Bước đầu của Canvas là gì?",
                "options": [
                    "Chọn model AI",
                    "Xác định vấn đề user gặp phải",
                    "Thiết kế UI",
                    "Tính chi phí",
                ],
                "answer": "B",
                "explanation": "Canvas bắt đầu từ problem, không từ tech — AI là giải pháp, không phải điểm bắt đầu.",
            },
            {
                "q": "Canvas là gì?",
                "options": [
                    "Tài liệu kỹ thuật",
                    "Hypothesis cần validate với user",
                    "Kế hoạch chi tiết",
                    "Spec cuối cùng",
                ],
                "answer": "B",
                "explanation": "Canvas là giả thuyết — phải test với user thật trước khi commit.",
            },
            {
                "q": "Khi nào nên update canvas?",
                "options": [
                    "Khi PM yêu cầu",
                    "Khi có data mới từ user feedback",
                    "Khi sprint mới",
                    "Khi code change",
                ],
                "answer": "B",
                "explanation": "Canvas sống — update khi có insight mới từ user, không phải theo lịch.",
            },
        ],
    },
    {
        "code": "I4.2",
        "title": "Technical Track: Vibe Coding / Claude Code",
        "bullets": [
            "Kiến trúc 5 lớp: Input → Preprocess → AI core → Postprocess → Output",
            "Trust Layer bao quanh AI core: validate input, validate output, rate limit",
            "Vibe Coding có kỷ luật: AI viết code, con người review + ship",
            "Hai ranh giới cứng: secret & PII không bao giờ vào prompt",
            "Fallback thiết kế cho lúc AI thất bại — không để user stuck",
        ],
        "questions": [
            {
                "q": "5 lớp kiến trúc AI feature gồm?",
                "options": [
                    "Frontend, Backend, DB, AI, DevOps",
                    "Input, Preprocess, AI core, Postprocess, Output",
                    "Model, Prompt, API, UI, Test",
                    "Train, Eval, Deploy, Monitor, Retrain",
                ],
                "answer": "B",
                "explanation": "5 lớp giúp tách concerns: input handling tách khỏi AI logic tách khỏi output formatting.",
            },
            {
                "q": "Trust Layer làm gì?",
                "options": [
                    "Tăng tốc độ model",
                    "Validate input/output, rate limit, kill switch",
                    "Giảm chi phí",
                    "Tăng creativity",
                ],
                "answer": "B",
                "explanation": "Trust Layer = defenses around AI — validate, rate limit, kill switch khi cần.",
            },
            {
                "q": "Khi nào được phép paste secret vào prompt?",
                "options": [
                    "Khi test local",
                    "Không bao giờ — secret phải inject qua env var",
                    "Khi user đồng ý",
                    "Khi model mạnh",
                ],
                "answer": "B",
                "explanation": "Secret không bao giờ vào prompt — log/training có thể capture → lộ thông tin nhạy cảm.",
            },
        ],
    },
    {
        "code": "I5.1",
        "title": "Kiến trúc giải pháp AI production",
        "bullets": [
            "Kiến trúc ≠ sơ đồ đẹp — là quyết định ràng buộc hành vi hệ thống",
            "Thành phần: model + data + API + UI + monitoring + on-call",
            "4 trục trade-off: cost ↔ quality, latency ↔ depth, control ↔ flexibility, build ↔ buy",
            "Chọn pattern: Prompt đơn / RAG / Agent — mỗi cái có chi phí & capability khác nhau",
            "Giám sát phải đi cùng kiến trúc — không phải gắn thêm sau",
        ],
        "questions": [
            {
                "q": "Kiến trúc tốt phải thể hiện điều gì?",
                "options": [
                    "Sơ đồ đẹp",
                    "Trade-off + lý do chọn cho từng quyết định",
                    "Code đầy đủ",
                    "Tài liệu dài",
                ],
                "answer": "B",
                "explanation": "Architect phải show 'tại sao chọn X thay vì Y' — quyết định có lý do mới là architecture.",
            },
            {
                "q": "Khi nào nên dùng Agent thay vì Prompt đơn?",
                "options": [
                    "Luôn luôn",
                    "Khi task cần multi-step reasoning + tool use",
                    "Khi có budget",
                    "Khi user yêu cầu",
                ],
                "answer": "B",
                "explanation": "Agent = powerful nhưng expensive + slow + unreliable. Chỉ dùng khi cần multi-step.",
            },
            {
                "q": "Trade-off quan trọng nhất khi chọn model?",
                "options": [
                    "Tốc độ",
                    "Cost ↔ Quality ↔ Latency (cả 3 cùng nhau)",
                    "Brand name",
                    "Open vs closed",
                ],
                "answer": "B",
                "explanation": "3 chiều trade-off: model rẻ-nhanh-nhẹ thường kém chất lượng, model đắt-chậm-nặng thường tốt hơn.",
            },
        ],
    },
    {
        "code": "I1.2",
        "title": "Tạo & đo lường — Operational AI (Gate L1→L2)",
        "bullets": [
            "Đo lường là yếu tố tách amateur khỏi professional",
            "Chọn metric aligned với business outcome, không phải metric dễ",
            "Eval set phải đại diện cho production data, không phải happy path",
            "Đo baseline trước khi optimize — không có baseline là bay mù",
            "Track metrics theo thời gian, không phải 1 lần rồi thôi",
        ],
        "questions": [
            {
                "q": "Metric nào quan trọng nhất cho một AI feature?",
                "options": [
                    "Metric dễ đo nhất",
                    "Metric aligned với business outcome",
                    "Metric mà team quen thuộc",
                    "Metric mà đối thủ đang dùng",
                ],
                "answer": "B",
                "explanation": "Business outcome là lý do tồn tại của feature — metric phải phản ánh điều đó.",
            },
            {
                "q": "Khi nào cần dừng optimize metric?",
                "options": [
                    "Khi metric tăng 5%",
                    "Khi metric bão hoà / marginal gain giảm",
                    "Khi hết tháng",
                    "Khi PM yêu cầu",
                ],
                "answer": "B",
                "explanation": "Diminishing returns — khi marginal gain < chi phí optimize thêm, dừng lại.",
            },
            {
                "q": "Eval set tốt phải có đặc điểm gì?",
                "options": [
                    "Càng nhiều càng tốt",
                    "Đại diện cho production data và edge cases",
                    "Được viết bởi PM",
                    "Chỉ chứa happy path",
                ],
                "answer": "B",
                "explanation": "Eval set phải reflect thực tế — nếu chỉ happy path, sẽ miss regression khi production khác.",
            },
        ],
    },
    {
        "code": "I2.2",
        "title": "Workflow đo lường & iterate",
        "bullets": [
            "Loop đo lường → phân tích → fix → đo lại là quy trình cốt lõi",
            "Một lần đo không có giá trị — cần time-series",
            "Phân tích lỗi theo category (input dở / prompt kém / model không đủ)",
            "Đừng sửa nhiều thứ cùng lúc — đo trước/sau cho từng thay đổi",
            "Đặt guardrail trước khi ship — không chờ user phàn nàn",
        ],
        "questions": [
            {
                "q": "Khi gặp regression, bước đầu tiên là gì?",
                "options": [
                    "Sửa prompt ngay",
                    "Phân loại lỗi theo category",
                    "Đổi model",
                    "Rollback toàn bộ",
                ],
                "answer": "B",
                "explanation": "Phân loại giúp tìm root cause — không phân loại thì sửa mù.",
            },
            {
                "q": "Khi nào nên rollback thay vì sửa?",
                "options": [
                    "Khi gặp lỗi đầu tiên",
                    "Khi user phàn nàn",
                    "Khi fix không có baseline để so sánh",
                    "Khi team quyết định",
                ],
                "answer": "C",
                "explanation": "Rollback an toàn khi không biết change có giúp hay hại — fix cần baseline.",
            },
            {
                "q": "Tần suất đo lường nên là bao lâu?",
                "options": [
                    "1 lần khi ship",
                    "Mỗi tuần",
                    "Continuous hoặc theo batch hàng ngày",
                    "Khi có complaint",
                ],
                "answer": "C",
                "explanation": "Drift xảy ra mỗi ngày — đo liên tục mới phát hiện sớm.",
            },
        ],
    },
    {
        "code": "I3.2",
        "title": "Tạo & đánh giá deliverable",
        "bullets": [
            "Deliverable AI = output cụ thể, dùng được, đo được",
            "Mỗi deliverable cần format cố định + acceptance criteria",
            "Đánh giá bằng task thực, không phải prompt đẹp",
            "Iterate theo feedback, không theo cảm tính",
            "Document để người khác reproduce được",
        ],
        "questions": [
            {
                "q": "Deliverable tốt phải có gì?",
                "options": [
                    "Prompt dài và phức tạp",
                    "Format cố định + acceptance criteria rõ ràng",
                    "Nhiều ví dụ minh hoạ",
                    "Comment chi tiết",
                ],
                "answer": "B",
                "explanation": "Acceptance criteria giúp đánh giá tự động + người review dễ check.",
            },
            {
                "q": "Tiêu chí đánh giá deliverable nên dựa trên?",
                "options": [
                    "Cảm tính mentor",
                    "Task thực tế + rubric định sẵn",
                    "Số token sử dụng",
                    "Độ dài output",
                ],
                "answer": "B",
                "explanation": "Rubric định sẵn loại bỏ bias và cho phép đánh giá ở scale.",
            },
            {
                "q": "Khi nào nên viết lại deliverable từ đầu?",
                "options": [
                    "Khi không pass rubric lần đầu",
                    "Khi đã iterate ≥ 3 lần không cải thiện",
                    "Khi mentor không thích",
                    "Khi team quyết định",
                ],
                "answer": "B",
                "explanation": "Sau nhiều lần iterate không cải thiện = root issue ở approach, không phải wording.",
            },
        ],
    },
    {
        "code": "I3.3",
        "title": "Gate L3 → L4",
        "bullets": [
            "Gate là điểm đánh giá — phải pass thì mới lên level",
            "Gate evidence = bằng chứng cụ thể (screenshot, log, output, review)",
            "Reviewer độc lập — không phải người làm cùng team",
            "Feedback phải actionable — chỉ ra điểm cần fix",
            "Resubmit khi đã sửa — không argue với gate",
        ],
        "questions": [
            {
                "q": "Gate evidence tốt phải có gì?",
                "options": [
                    "Lời kể thành tích",
                    "Bằng chứng cụ thể — output, log, screenshot",
                    "Đánh giá chủ quan",
                    "Một slide tóm tắt",
                ],
                "answer": "B",
                "explanation": "Reviewer không thể verify nếu không có bằng chứng cụ thể.",
            },
            {
                "q": "Ai review gate?",
                "options": [
                    "Cùng team",
                    "Reviewer độc lập ngoài team",
                    "PM của team",
                    "Bản thân",
                ],
                "answer": "B",
                "explanation": "Độc lập = loại bỏ conflict of interest, cho đánh giá khách quan.",
            },
            {
                "q": "Khi gate fail, nên làm gì?",
                "options": [
                    "Argue lại",
                    "Resubmit sau khi fix feedback",
                    "Skip gate",
                    "Đợi 6 tháng",
                ],
                "answer": "B",
                "explanation": "Gate fail = cần fix theo feedback rồi resubmit, không argue.",
            },
        ],
    },
    {
        "code": "I4.3",
        "title": "Gate L4 → L5",
        "bullets": [
            "Gate L4 là cổng vào L5 Architect — cao nhất trong chương trình",
            "Phải thể hiện tư duy hệ thống, không chỉ từng feature riêng lẻ",
            "Evidence phải chứng minh khả năng vận hành production",
            "Architecture decision phải có lý do rõ ràng (trade-off, alternative)",
            "Reviewer panel đánh giá trong buổi live",
        ],
        "questions": [
            {
                "q": "Đặc điểm quan trọng nhất của L4 evidence?",
                "options": [
                    "Code chạy được",
                    "Thể hiện tư duy hệ thống + production-ready",
                    "Số dòng code nhiều",
                    "Sử dụng nhiều model khác nhau",
                ],
                "answer": "B",
                "explanation": "L4 không chỉ là 'code chạy' mà là 'code chạy + có lý do + có thể vận hành'.",
            },
            {
                "q": "Architecture decision cần có?",
                "options": [
                    "Một lựa chọn duy nhất",
                    "Trade-off + alternative + lý do chọn",
                    "Số liệu benchmark",
                    "Code demo",
                ],
                "answer": "B",
                "explanation": "Architect trình bày alternatives + trade-offs = thể hiện tư duy có chiều sâu.",
            },
            {
                "q": "Gate L4 review diễn ra như thế nào?",
                "options": [
                    "Tự đánh giá",
                    "Reviewer panel đánh giá trong buổi live",
                    "PM duyệt qua form",
                    "Bỏ phiếu team",
                ],
                "answer": "B",
                "explanation": "Live review cho phép Q&A sâu + xác minh hiểu biết thực sự.",
            },
        ],
    },
    {
        "code": "I5.2",
        "title": "Vận hành & monitor ở scale",
        "bullets": [
            "Scale ≠ chỉ nhiều user — còn nhiều failure modes",
            "Observability: metrics + logs + traces = bắt buộc",
            "Cost & latency là product constraint, không phải optimization sau",
            "Graceful degradation khi AI fail (fallback rule-based)",
            "Runbook + on-call rotation cho incident",
        ],
        "questions": [
            {
                "q": "Khi nào nên bật observability?",
                "options": [
                    "Khi có incident đầu tiên",
                    "Trước khi ship production",
                    "Sau 1 tháng vận hành",
                    "Khi có budget",
                ],
                "answer": "B",
                "explanation": "Observability cần có sẵn để debug khi xảy ra sự cố — không có sẵn = không debug được.",
            },
            {
                "q": "Fallback strategy tốt nhất khi AI fail?",
                "options": [
                    "Trả lỗi 500 cho user",
                    "Graceful degradation (rule-based fallback)",
                    "Tắt feature",
                    "Retry vô hạn",
                ],
                "answer": "B",
                "explanation": "Graceful degradation = user vẫn nhận được giá trị dù AI không hoạt động.",
            },
            {
                "q": "Khi nào cần on-call rotation?",
                "options": [
                    "Khi user complain",
                    "Khi feature ở production với user > 0",
                    "Khi có budget cho team",
                    "Khi PM yêu cầu",
                ],
                "answer": "B",
                "explanation": "Production với user thật = có thể có incident bất kỳ lúc nào — cần người respond.",
            },
        ],
    },
    {
        "code": "I5.3",
        "title": "Capstone: Ship & bảo vệ sản phẩm AI (Gate L5)",
        "bullets": [
            "Capstone = sản phẩm cuối cùng, ship đến user thật",
            "Pitch deck + live demo trước panel là 2 artefact chính",
            "Production-ready = có monitoring + on-call + rollback plan",
            "Bảo vệ = trả lời câu hỏi panel về trade-off & alternative",
            "Chứng minh đã iterate dựa trên feedback, không phải build rồi thôi",
        ],
        "questions": [
            {
                "q": "Capstone pitch deck cần có?",
                "options": [
                    "Nhiều slide về tech detail",
                    "Problem → Solution → Demo → Metrics → Next",
                    "Source code đầy đủ",
                    "Tài liệu tham khảo",
                ],
                "answer": "B",
                "explanation": "Pitch = storytelling cho panel thấy journey từ vấn đề đến giải pháp.",
            },
            {
                "q": "Production-ready nghĩa là gì?",
                "options": [
                    "Code không có bug",
                    "Có monitoring + on-call + rollback plan",
                    "Đã deploy lên server",
                    "Có test coverage 100%",
                ],
                "answer": "B",
                "explanation": "Production-ready = hệ thống có thể vận hành khi có incident — không phải chỉ 'chạy được'.",
            },
            {
                "q": "Khi panel hỏi 'tại sao không dùng X?', nên trả lời?",
                "options": [
                    "Vì tôi thích cách này",
                    "Đã cân nhắc X — đây là trade-off và lý do chọn Y",
                    "X không tốt",
                    "Tôi không biết X",
                ],
                "answer": "B",
                "explanation": "Architect phải show đã cân nhắc alternatives + đưa ra quyết định có lý do.",
            },
        ],
    },
]

VIDEO_PLACEHOLDER_URL = "https://www.youtube.com/embed/placeholder"
VIDEO_DURATION_SECONDS = 600


def render_summary(kit: dict) -> str:
    bullets_md = "\n".join(f"- {b}" for b in kit["bullets"])
    return f"""---
kit: {kit["code"]}
title: {kit["title"]}
---



{kit["title"]} trang bị nền tảng và thực hành để học viên vận dụng được ngay sau buổi live — kết hợp pre-read 30-45 phút với 90 phút thực hành có mentor hướng dẫn.

# Điểm cốt lõi cần nhớ trước buổi live

{bullets_md}

# Câu hỏi mang vào buổi live

1. Trong context team bạn, điểm cốt lõi nào áp dụng được ngay hôm nay?
2. Khi gặp khó khăn khi thực hành, bạn sẽ debug theo hướng nào trước?
3. Làm sao đo lường hiệu quả sau khi áp dụng kiến thức buổi học?
"""


def render_video(kit: dict) -> str:
    return f"""---
kit: {kit["code"]}
duration_seconds: {VIDEO_DURATION_SECONDS}
---

url: {VIDEO_PLACEHOLDER_URL}
duration: {VIDEO_DURATION_SECONDS}

# Transcript

> TODO: Ghi transcript khi quay video.
"""


def render_qa(kit: dict) -> str:
    blocks: list[str] = [
        f"""---
kit: {kit["code"]}
quiz_count: {len(kit["questions"])}
---

"""
    ]
    for idx, q in enumerate(kit["questions"], start=1):
        letters = ["A", "B", "C", "D"]
        options_md = "\n".join(
            f"> - {letter}. {opt}" for letter, opt in zip(letters, q["options"])
        )
        blocks.append(
            f"""> [!question]
> **Câu {idx}:** {q["q"]}
{options_md}
> **Đáp án: {q["answer"]}**
> **Giải thích:** {q["explanation"]}

"""
        )
    return "".join(blocks).rstrip() + "\n"


def main() -> int:
    written = 0
    skipped = 0
    for kit in KITS:
        kit_dir = CONTENT_ROOT / f"Teaching-Kit-{kit['code']}" / "preread"
        if not (CONTENT_ROOT / f"Teaching-Kit-{kit['code']}").exists():
            print(f"[{kit['code']}] SKIP — Teaching-Kit folder missing")
            skipped += 1
            continue
        kit_dir.mkdir(parents=True, exist_ok=True)
        (kit_dir / f"{kit['code']}-preread-summary.md").write_text(
            render_summary(kit), encoding="utf-8"
        )
        (kit_dir / f"{kit['code']}-preread-video.md").write_text(
            render_video(kit), encoding="utf-8"
        )
        (kit_dir / f"{kit['code']}-preread-qa.md").write_text(
            render_qa(kit), encoding="utf-8"
        )
        written += 3
        print(f"[{kit['code']}] wrote 3 preread files")
    print(f"\nTotal: {written} files across {len(KITS) - skipped} kits.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

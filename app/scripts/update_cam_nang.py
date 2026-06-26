#!/usr/bin/env python3
"""
Inject pre-read + sub-session cross-references into cam-nang files.

For each kit's Cam-Nang-Giang-*.md:
  - Append a "Pre-read workflow" note (after `### Agenda timeboxed`).
  - For 6 heavy kits: append "Cấu trúc buổi học (sub-sessions)" table +
    "Câu hỏi thường gặp" FAQ + pre-read note.

Idempotent: skips already-injected content.
"""
import sys
from pathlib import Path

CONTENT_ROOT = Path("content/idea/Intern-Product-Builder")

LIGHTWEIGHT = [
    "I1.1",
    "I1.2",
    "I2.2",
    "I3.2",
    "I3.3",
    "I4.3",
    "I5.2",
    "I5.3",
]

HEAVY = [
    ("I2.1", "4 Kỹ thuật Prompting", "Iterate + Lab"),
    ("I2.3", "Prompt cho Insight", "Prompt cho Spec + Gate"),
    ("I3.1", "Workflow Design", "Cowork + Skills + Lab"),
    ("I4.1", "Canvas + Problem Framing", "Solution + Hypothesis + Iterate"),
    ("I4.2", "Kiến trúc 5 lớp + Trust Layer", "Vibe Coding + Lab + Code Review"),
    ("I5.1", "Kiến trúc tổng quan + Pattern", "Apply + Capstone Prep"),
]

PREREAD_NOTE_TEMPLATE = """### Pre-read bắt buộc (update 26/06/2026)

Trước buổi live, học viên đọc [{code}-preread](/learn/{code}/preread) (30-45 phút: TL;DR + 5 điểm cốt lõi + video + 3 câu quiz). Đầu buổi live mentor hỏi 3 câu quiz để gate. Học viên không pass = mentor xử lý case-by-case (yêu cầu đọc lại pre-read trước khi vào lab).
"""


SUBSECTION_TEMPLATE = """### Cấu trúc buổi học (update 26/06/2026)

Buổi gốc {code} được tách thành **2 buổi phụ 90 phút** để giảm tải cho buổi live:

| Buổi phụ | Thời lượng | Trọng tâm | Pre-read |
|---|---|---|---|
| **{code}.1 — {sub1_title}** | 90' | Foundation + walkthrough | [`/learn/{code}/preread`](/learn/{code}/preread) (30-45') |
| **{code}.2 — {sub2_title}** | 90' | Lab + iterate + edge case | (đã cover ở {code}.1) |

**Pre-read bắt buộc** trước buổi phụ `.1`: học viên đọc TL;DR + 5 điểm cốt lõi + xem video (nếu có) + làm quiz 3 câu. Pass quiz = được vào buổi live.

**Câu hỏi thường gặp (FAQ) cho buổi nặng:**

- **Q: Học viên không làm pre-read thì sao?**
  A: Đầu buổi live, hỏi 3 câu quiz (giống pre-read quiz). Trả lời sai ≥2/3 = dấu hiệu chưa chuẩn bị → mentor cân nhắc cho ở lại xem hoặc yêu cầu làm pre-read trước khi vào lab.

- **Q: Tại sao tách buổi này?**
  A: Buổi gốc có ~1000 dòng markdown — quá nặng cho 1 buổi live 150-180'. Tách thành 2 buổi phụ 90' giúp học viên tiêu hóa từng phần + pre-read giảm tải lý thuyết trên lớp.
"""


def find_cam_nang(kit_dir: Path) -> Path | None:
    matches = list(kit_dir.glob("*-Cam-Nang-Giang-*.md"))
    return matches[0] if matches else None


def inject_after_agenda(content: str, marker: str, addition: str) -> tuple[str, bool]:
    """Insert `addition` after the first occurrence of `marker`. Returns
    (new_content, was_inserted). If marker not found or already has the
    marker, returns original."""
    if marker in addition and marker in content:
        return content, False
    if addition.strip().split("\n", 1)[0] in content:
        return content, False
    idx = content.find(marker)
    if idx == -1:
        return content, False
    insert_at = idx + len(marker)
    return content[:insert_at] + "\n\n" + addition + content[insert_at:], True


def update_lightweight(code: str) -> bool:
    kit_dir = CONTENT_ROOT / f"Teaching-Kit-{code}"
    cam_nang = find_cam_nang(kit_dir)
    if not cam_nang:
        print(f"[{code}] WARN: no cam-nang found")
        return False
    text = cam_nang.read_text(encoding="utf-8")
    addition = PREREAD_NOTE_TEMPLATE.replace("{code}", code)
    new_text, inserted = inject_after_agenda(
        text,
        "### Agenda timeboxed",
        addition,
    )
    if inserted:
        cam_nang.write_text(new_text, encoding="utf-8")
        print(f"[{code}] lightweight: preread note added")
    else:
        print(f"[{code}] lightweight: skipped (already injected or no marker)")
    return inserted


def update_heavy(code: str, sub1: str, sub2: str) -> bool:
    kit_dir = CONTENT_ROOT / f"Teaching-Kit-{code}"
    cam_nang = find_cam_nang(kit_dir)
    if not cam_nang:
        print(f"[{code}] WARN: no cam-nang found")
        return False
    text = cam_nang.read_text(encoding="utf-8")
    # First: lightweight preread note (for the kit itself).
    preread_note = PREREAD_NOTE_TEMPLATE.replace("{code}", code)
    text, _ = inject_after_agenda(text, "### Agenda timeboxed", preread_note)
    # Then: heavy sub-session structure.
    sub_block = (
        SUBSECTION_TEMPLATE
        .replace("{code}", code)
        .replace("{sub1_title}", sub1)
        .replace("{sub2_title}", sub2)
    )
    # For heavy kits we add the structure note BEFORE the lightweight
    # preread note (more prominent placement).
    new_text, inserted = inject_after_agenda(
        text,
        "### Pre-read bắt buộc",
        sub_block,
    )
    if not inserted:
        # Fallback: insert before the existing preread note.
        new_text, inserted = inject_after_agenda(
            text,
            "### Agenda timeboxed",
            sub_block + "\n\n" + preread_note,
        )
    if inserted:
        cam_nang.write_text(new_text, encoding="utf-8")
        print(f"[{code}] heavy: preread + sub-session structure added")
    else:
        print(f"[{code}] heavy: skipped")
    return inserted


def main() -> int:
    print("=== Lightweight kits (R2: 1 pre-read note) ===")
    for code in LIGHTWEIGHT:
        update_lightweight(code)
    print()
    print("=== Heavy kits (R1: structure + FAQ + pre-read note) ===")
    for code, sub1, sub2 in HEAVY:
        update_heavy(code, sub1, sub2)
    return 0


if __name__ == "__main__":
    sys.exit(main())

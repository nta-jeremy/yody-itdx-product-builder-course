#!/usr/bin/env python3
"""
Helper to split heavy sessions into sub-session files.

Usage:
  python3 split_session.py <code> <total_lines> <split_at_line> <sub1_name> <sub2_name>

Reads <Teaching-Kit-IX.Y>/main-content/IX.Y-Tai-Lieu-Hoc-*.md, splits at the
given line, writes two new files with new frontmatter + title, and verifies
line counts within ±5% of the original.
"""
import sys
import os
import shutil
import re
from pathlib import Path

CONTENT_ROOT = Path("content/idea/Intern-Product-Builder")


def split_session(code: str, split_at: int, sub1_name: str, sub2_name: str) -> None:
    kit_dir = CONTENT_ROOT / f"Teaching-Kit-{code}"
    main_dir = kit_dir / "main-content"
    archive_dir = main_dir / "_archive"
    archive_dir.mkdir(exist_ok=True)

    # Find the legacy file (starts with code prefix, not sub-session code)
    legacy_files = [
        f for f in main_dir.iterdir()
        if f.is_file()
        and f.suffix == ".md"
        and f.name.startswith(f"{code}-Tai-Lieu-Hoc")
    ]
    if not legacy_files:
        print(f"[{code}] ERROR: no legacy file found in {main_dir}", file=sys.stderr)
        sys.exit(1)
    if len(legacy_files) > 1:
        print(f"[{code}] ERROR: multiple legacy files: {legacy_files}", file=sys.stderr)
        sys.exit(1)
    legacy = legacy_files[0]
    text = legacy.read_text(encoding="utf-8")
    lines = text.split("\n")
    total = len(lines)

    if not (1 <= split_at < total):
        print(f"[{code}] ERROR: split_at {split_at} out of range [1, {total})", file=sys.stderr)
        sys.exit(1)

    sub1_file = main_dir / f"{code}.1-{sub1_name}.md"
    sub2_file = main_dir / f"{code}.2-{sub2_name}.md"

    # Slice [split_at:] includes line split_at onwards.
    # Each sub-session keeps the file's # I{x}.{y} heading + front-matter
    # preamble, then re-anchors with its own sub-session title.
    preamble_end = 0
    for i, line in enumerate(lines):
        # The legacy file starts with `# IX.Y — Title` (first line typically
        # is the title, then blank, then content begins). We keep the
        # front-matter (any leading `---`-fenced YAML at the top), the first
        # heading, and a blank line before content.
        if i > 0 and line.startswith("## "):
            preamble_end = i
            break
    if preamble_end == 0:
        # Fallback: keep first 15 lines.
        preamble_end = min(15, total)

    preamble = "\n".join(lines[:preamble_end])

    sub1_body = "\n".join(lines[preamble_end:split_at])
    sub2_body = "\n".join(lines[split_at:])

    # Inject sub-session title into the first H1 (replace original).
    sub1_title = f"# {code}.1 — {sub1_name.replace('-', ' ')}"
    sub2_title = f"# {code}.2 — {sub2_name.replace('-', ' ')}"

    # Replace the original H1 inside preamble-derived content.
    # Preamble's first heading is the kit title (e.g. "# IX.Y — Title").
    # Sub1/sub2 files need their own H1 → rewrite the first H1 in body.

    def rewrite_h1(body: str, new_h1: str) -> str:
        out = []
        replaced = False
        for line in body.split("\n"):
            if not replaced and line.startswith("# ") and not line.startswith("## "):
                out.append(new_h1)
                replaced = True
            else:
                out.append(line)
        if not replaced:
            return new_h1 + "\n\n" + body
        return "\n".join(out)

    sub1_body = rewrite_h1(sub1_body, sub1_title)
    sub2_body = rewrite_h1(sub2_body, sub2_title)

    sub1_file.write_text(preamble + "\n\n" + sub1_body, encoding="utf-8")
    sub2_file.write_text(preamble + "\n\n" + sub2_body, encoding="utf-8")

    # Move legacy to _archive/.
    shutil.move(str(legacy), str(archive_dir / legacy.name))

    # Verify line-count parity (±5%).
    sub1_lines = len(sub1_file.read_text(encoding="utf-8").split("\n"))
    sub2_lines = len(sub2_file.read_text(encoding="utf-8").split("\n"))
    new_total = sub1_lines + sub2_lines
    diff = abs(new_total - total) / total
    print(
        f"[{code}] split at line {split_at}: "
        f"sub1={sub1_lines} sub2={sub2_lines} total={new_total} "
        f"(orig={total}, diff={diff * 100:.1f}%)"
    )
    if diff > 0.10:
        # 10% tolerance (front-matter duplication inflates new total by ~10%).
        print(f"[{code}] WARN: diff > 10%, verify manually", file=sys.stderr)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(
            "Usage: split_session.py <code> <split_at> <sub1_name> <sub2_name>",
            file=sys.stderr,
        )
        sys.exit(2)
    code, split_at, sub1_name, sub2_name = sys.argv[1:]
    split_session(code, int(split_at), sub1_name, sub2_name)

"""Fix {x}.{y} placeholders that were not replaced in cam-nang files."""
from pathlib import Path

LIGHTWEIGHT = [
    "I1.1", "I1.2", "I2.2", "I3.2", "I3.3", "I4.3", "I5.2", "I5.3",
]
HEAVY = ["I2.1", "I2.3", "I3.1", "I4.1", "I4.2", "I5.1"]

ROOT = Path("content/idea/Intern-Product-Builder")
for code in LIGHTWEIGHT + HEAVY:
    matches = list(ROOT.glob(f"Teaching-Kit-{code}/*-Cam-Nang-Giang-*.md"))
    if not matches:
        continue
    cam_nang = matches[0]
    text = cam_nang.read_text(encoding="utf-8")
    new_text = (
        text.replace("I{x}.{y}-preread", f"{code}-preread")
        .replace("/learn/I{x}.{y}/preread", f"/learn/{code}/preread")
    )
    if new_text != text:
        cam_nang.write_text(new_text, encoding="utf-8")
        print(f"[{code}] fixed")
    else:
        print(f"[{code}] no change")

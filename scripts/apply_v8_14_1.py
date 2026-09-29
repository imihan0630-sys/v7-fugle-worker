from pathlib import Path

# V8.14.1 TDCC share reconciliation.
# Formal selection logic is unchanged; this repair corrects official TDCC dataset validation semantics.

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")

def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text = text.replace(old, new, 1)

required = [
    'tierShares-adjustmentShares!==totalShares',
    '集保級距比例與股數不一致',
    '第16級差異數調整另行勾稽'
]
for marker in required:
    if marker not in text:
        raise SystemExit(f"TDCC raw-source repair missing before V8.14.1 build: {marker}")

replace_once(
    'const VERSION = "8.14.0-sector-gate-provenance-shadow";',
    'const VERSION = "8.14.1-tdcc-share-reconciliation";',
    "runtime version",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.14.1 TDCC share reconciliation")

from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")
old='const VERSION = "8.19.0-c1-scan-origin-generation-inventory";'
new='const VERSION = "8.19.1-pve250-runtime-remediation";'
if text.count(old)!=1:
    raise SystemExit(f"production version stamp anchor mismatch: {text.count(old)}")
path.write_text(text.replace(old,new,1),encoding="utf-8")
print("Applied owner-approved PVE-250 production version stamp")

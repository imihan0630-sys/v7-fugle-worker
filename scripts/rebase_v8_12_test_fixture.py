from pathlib import Path

path = Path("tests/test_requirements_repair.mjs")
text = path.read_text(encoding="utf-8")

old = """const history = Array.from({length:65}, (_, i) => ({date:new Date(Date.UTC(2026,5,1+i)).toISOString().slice(0,10),open:100,close:100,high:101,low:99,volumeShares:5000000,tradeValue:500000000}));"""
new = """const history = qualityApi.recentWeekdays('2026-09-16',65).reverse()
  .map(date => ({date,open:100,close:100,high:101,low:99,volumeShares:5000000,tradeValue:500000000}));"""

if text.count(old) != 1:
    raise SystemExit("legacy calendar-day history fixture not found exactly once")

path.write_text(text.replace(old, new, 1), encoding="utf-8")
print("Rebased requirements history fixture onto official trading dates")

from pathlib import Path

path = Path("tests/test_v8_10_0_aideen_independent_pool.mjs")
text = path.read_text(encoding="utf-8")
old = 'assert.match(source,/const VERSION = "8\\.11\\.0-pv-shadow-v0\\.1-log-only";/);'
new = 'assert.match(source,/const VERSION = "[^"]+";/);'

if text.count(old) != 1:
    raise SystemExit("Aideen exact-version assertion not found exactly once")

path.write_text(text.replace(old, new, 1), encoding="utf-8")
print("Rebased Aideen regression onto forward-compatible runtime version assertion")

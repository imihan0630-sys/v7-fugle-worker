from pathlib import Path

path = Path("scripts/apply_v8_12_0.py")
text = path.read_text(encoding="utf-8")

old = """replace_once(
    '  enrichment.history = { ...cachedHistory, ...(enrichment.history || {}) };\\n'
    '  // Free Workers 每次只有很小的 CPU 預算；18:10 不再臨時額外暖機。',
    '  enrichment.history = { ...cachedHistory, ...(enrichment.history || {}) };\\n'
    '  const historyAdmission=await buildHistoryAdmissionMap(rows,enrichment.history,marketDate,env);\\n'
    '  // Free Workers 每次只有很小的 CPU 預算；18:10 不再臨時額外暖機。',
    "after market history admission",
)

replace_once(
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate);',
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate,historyAdmission);',
    "market state admission input",
)"""

new = """replace_once(
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate);',
    '  const historyAdmission=await buildHistoryAdmissionMap(rows,enrichment.history,marketDate,env);\\n'
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate,historyAdmission);',
    "after market history admission and state input",
)"""

if text.count(old) != 1:
    raise SystemExit("V8.12 stale anchor block not found exactly once")

path.write_text(text.replace(old, new, 1), encoding="utf-8")
print("Rebased V8.12 anchor onto current patch chain")

import rebase_v8_12_test_fixture

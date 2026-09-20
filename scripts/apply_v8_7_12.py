from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.7.11-cross-market-evidence-provenance";',
    'const VERSION = "8.7.12-after-market-2335";',
    "runtime version"
)

replacements=[
    (" * Phase 4.3：A＝拉回承接、B＝突破後承接；18:10自動選0～6檔並寫入隔日監控計畫。",
     " * Phase 4.3：A＝拉回承接、B＝突破後承接；23:35自動選0～6檔並寫入隔日監控計畫。","phase comment"),
    ("// Cron expression: 10 10 * * MON-FRI  // 台灣 18:10 盤後掃描",
     "// Cron expression: 35 15 * * MON-FRI  // 台灣 23:35 盤後掃描","cron comment"),
    ("正式環境請由18:10 Cron執行","正式環境請由23:35 Cron執行","acceptance wording"),
    ("供 ChatGPT 18:15 自動回報使用","供 ChatGPT 23:40 後自動回報使用","recommendation wording"),
    ('          "10 10 * * MON-FRI"','          "35 15 * * MON-FRI"',"cron expected"),
    ('if (jobType === "AFTER_MARKET_SCAN") return "18:10 盤後掃描";','if (jobType === "AFTER_MARKET_SCAN") return "23:35 盤後掃描";',"cron label"),
    ('if (String(controller?.cron || "").toLowerCase() === "10 10 * * mon-fri") return true;',
     'if (String(controller?.cron || "").toLowerCase() === "35 15 * * mon-fri") return true;',"after market exact cron"),
    ("// Free Workers 每次只有很小的 CPU 預算；18:10 不再臨時額外暖機。",
     "// Free Workers 每次只有很小的 CPU 預算；23:35 不再臨時額外暖機。","warmup comment"),
    ("18:10分成非千金股池與千金股池獨立篩選","23:35分成非千金股池與千金股池獨立篩選","strategy note"),
    ("；18:10盤後日 ${scanDate}；","；23:35盤後日 ${scanDate}；","selected reason"),
    ('      "18:10 盤後選股"','      "23:35 盤後選股"',"ui scan label"),
    ("18:10 Cron 會自動執行","23:35 Cron 會自動執行","ui formal mode wording")
]
for old,new,label in replacements:
    replace_once(old,new,label)

old='''  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date(controller?.scheduledTime || Date.now()));
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return Number(value.hour) >= 18;'''
new='''  return false;'''
replace_once(old,new,"remove broad after-market time fallback")

path.write_text(text,encoding="utf-8")
print("Applied V8.7.12 after-market 23:35 policy")

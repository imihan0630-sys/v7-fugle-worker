"""PVE-253 Class-B candidate only: split 23:35 primary and 23:55 recovery Cron identity. NOT authorized for Production merge/deploy."""
from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected one anchor, got {count}")
    text=text.replace(old,new,1)

Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-v8_20_1-pve253.mjs").write_text(text,encoding="utf-8")

once(
'''function isAfterMarketSchedule(controller) {
  const cron=String(controller?.cron || "").trim().toLowerCase().replace(/\s+/g," ");
  return cron === "35 15 * * mon-fri" || cron === "35,55 15 * * mon-fri";
}''',
'''function afterMarketScheduleRole(controller) {
  const cron=String(controller?.cron || "").trim().toLowerCase().replace(/\s+/g," ");
  if(cron === "35 15 * * mon-fri") return "PRIMARY";
  if(cron === "55 15 * * mon-fri") return "RECOVERY";
  if(cron === "35,55 15 * * mon-fri") return "COMBINED";
  return null;
}
function isAfterMarketSchedule(controller) {
  return afterMarketScheduleRole(controller)!==null;
}''',
"split after-market schedule identity"
)

once(
'''  const cronExpression = String(controller?.cron || "");
  const isAfterMarket = isAfterMarketSchedule(controller);
  const isHistoryWarmup = isHistoryWarmupSchedule(controller);
  const jobType = isHistoryWarmup ? "HISTORY_WARMUP" : (isAfterMarket ? "AFTER_MARKET_SCAN" : "INTRADAY_MONITOR");''',
'''  const cronExpression = String(controller?.cron || "");
  const afterMarketRole = afterMarketScheduleRole(controller);
  const isAfterMarket = afterMarketRole!==null;
  const isHistoryWarmup = isHistoryWarmupSchedule(controller);
  const jobType = isHistoryWarmup ? "HISTORY_WARMUP" : (isAfterMarket ? (afterMarketRole==="RECOVERY" ? "AFTER_MARKET_RECOVERY" : "AFTER_MARKET_SCAN") : "INTRADAY_MONITOR");''',
"explicit primary/recovery job identity"
)

once(
'const VERSION = "8.20.0-formal-c1-binding-ledger";',
'const VERSION = "8.20.1-pve253-split-recovery-candidate";',
"candidate version stamp"
)

path.write_text(text,encoding="utf-8")
print("Applied PVE-253 split-recovery Class-B candidate; Production merge/deploy not authorized")

from pathlib import Path

# V8.14.3 owner-approved System1 correctness/performance follow-up.
# Reuses the existing per-scan history receipt memo for unscheduled whole-market closure receipts.
# No Formal A/B, ranking, score, quota, capital, signal, push or System2 behavior changes.

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.14.2-unscheduled-closure-recovery-guard";',
    'const VERSION = "8.14.3-closure-receipt-memo";',
    "runtime version"
)

replace_once(
'''  for(const gapDate of shape.gapDates) {
    const closure=await readUnscheduledMarketClosureReceipt(env,market,gapDate);
    if(closure) {
      verifiedMarketClosureDates.push(gapDate);
      continue;
    }
    const key=market+":"+gapDate;
    let receipt=memo.get(key);''',
'''  for(const gapDate of shape.gapDates) {
    const closureKey="CLOSURE:"+market+":"+gapDate;
    let closure=memo.get(closureKey);
    if(closure===undefined) {
      closure=await readUnscheduledMarketClosureReceipt(env,market,gapDate);
      memo.set(closureKey,closure||null);
    }
    if(closure) {
      verifiedMarketClosureDates.push(gapDate);
      continue;
    }
    const key=market+":"+gapDate;
    let receipt=memo.get(key);''',
    "memoize closure receipt"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.14.3 closure receipt memo")

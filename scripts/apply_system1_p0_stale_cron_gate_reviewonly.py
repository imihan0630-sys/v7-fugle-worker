#!/usr/bin/env python3
"""Create a separately reviewable Worker copy, never mutate canonical Worker.js."""
from pathlib import Path
import argparse
import hashlib
import json

ANCHOR = """async function runBackgroundMonitor(env, scheduledTime = Date.now(), allowOutsideWindow = false) {
  await loadTradingCalendar(env, Number(taiwanDate(scheduledTime).slice(0, 4)));"""
PATCH = """// S1_P0_ORIGINAL_INTRADAY_REAL_WALL_CLOCK_GUARD_V0_1
function system1StaleIntradayCronGate(scheduledTime, observedNow = Date.now()) {
  if(!Number.isFinite(scheduledTime) || !Number.isFinite(observedNow)) {
    return {skip:true,reason:"INTRADAY_CRON_CLOCK_INVALID"};
  }
  const ageMs=observedNow-scheduledTime;
  const sameLocalTradingDay=taiwanDate(observedNow)===taiwanDate(scheduledTime);
  const actuallyInWindow=isIntradayMonitorWindow(observedNow);
  // The original live quote threshold is 90 seconds; do not widen to make
  // delayed Cloudflare Cron look like a fresh trading-signal observation.
  if(!sameLocalTradingDay || !actuallyInWindow || ageMs < -5000 || ageMs > 90000) {
    return {skip:true,reason:"INTRADAY_CRON_ACTUAL_CLOCK_STALE_OR_OUTSIDE",
      scheduledDate:taiwanDate(scheduledTime),observationDate:taiwanDate(observedNow),
      ageMs,sameLocalTradingDay,actuallyInWindow};
  }
  return {skip:false,reason:"INTRADAY_CRON_ACTUAL_CLOCK_VALID",
    ageMs,sameLocalTradingDay:true,actuallyInWindow:true};
}

async function runBackgroundMonitor(env, scheduledTime = Date.now(), allowOutsideWindow = false) {
  if (!allowOutsideWindow) {
    const timeGate=system1StaleIntradayCronGate(scheduledTime);
    if(timeGate.skip) return {skipped:true,version:VERSION,
      generatedAt:taiwanTime(),fugleCalls:0,fugleCallsThisRun:{quote:0,candles:0,total:0},
      status:timeGate.reason,physicalClockGate:timeGate,noSourceRead:true,
      noSignalEmission:true,noPush:true,noPlanChanges:true};
  }
  await loadTradingCalendar(env, Number(taiwanDate(scheduledTime).slice(0, 4)));"""

def patch(worker):
    if worker.count(ANCHOR)!=1:
        raise RuntimeError("CANONICAL_INTRADAY_ANCHOR_DRIFT")
    if worker.count("const LIVE_STALE_SECONDS = 90;")!=1:
        raise RuntimeError("ORIGINAL_QUOTE_FRESHNESS_CHANGED")
    for token in ("const need10 = minutesSinceOpen >= 11 && (minutesSinceOpen - 1) % 10 === 0;",
                  "const need15 = minutesSinceOpen >= 16 && (minutesSinceOpen - 1) % 15 === 0;",
                  "await acquireSignalStateLease(env,key)"):
        if token not in worker: raise RuntimeError("PROTECTED_CANDLE_SIGNAL_OR_D1_LEASE_CHANGED")
    return worker.replace(ANCHOR,PATCH,1)

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--source",default="Worker.js")
    parser.add_argument("--output",default="artifacts/system1-p0-stale-cron-worker-reviewonly.mjs")
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[1]
    source=(root/args.source)
    original=source.read_text(encoding="utf8")
    candidate=patch(original)
    output=root/args.output
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(candidate,encoding="utf8")
    assert original==source.read_text(encoding="utf8")
    digest=lambda s:hashlib.sha256(s.encode("utf8")).hexdigest()
    print(json.dumps({"status":"OFFLINE_CANDIDATE_ONLY",
      "canonicalWorkerSha256":digest(original),"candidateSha256":digest(candidate),
      "canonicalWorkerChanged":False,"workerDeployed":False,
      "cronSchedulesChanged":False,"quoteFreshSeconds":90,
      "noPlanChanges":True,"noBrokerWrite":True,
      "testsMustRunBeforeIndependentApproval":True}))

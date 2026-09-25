import assert from "node:assert/strict";
import { expectedSymbolSessionsBefore, validateSymbolHistoryFreshness } from "../research/symbol_session_calendar_prototype.mjs";

function seq(prefix, days) { return days.map(d => prefix + String(d).padStart(2, "0")); }

// 8422 par-value exchange: market traded 11/06-11/14, symbol did not.
{
  const market = seq("2025-11-", [3,4,5,6,7,10,11,12,13,14]);
  const out = expectedSymbolSessionsBefore({
    marketSessions: market,
    targetDate: "2025-11-17",
    requiredSessions: 3,
    suspensions: [{ start:"2025-11-06", end:"2025-11-14", quality:"VERIFIED" }]
  });
  assert.equal(out.status, "READY");
  assert.deepEqual(out.sessions, ["2025-11-03","2025-11-04","2025-11-05"]);
}

// 3593 capital reduction: prior valid symbol session is 12/10, not market-wide 12/19.
{
  const market = seq("2025-12-", [8,9,10,11,12,15,16,17,18,19]);
  const out = expectedSymbolSessionsBefore({
    marketSessions: market,
    targetDate: "2025-12-22",
    requiredSessions: 3,
    suspensions: [{ start:"2025-12-11", end:"2025-12-19", quality:"VERIFIED" }]
  });
  assert.deepEqual(out.sessions, ["2025-12-08","2025-12-09","2025-12-10"]);
}

// 8103 capital reduction: prior valid symbol session is 11/26.
{
  const market = ["2025-11-24","2025-11-25","2025-11-26","2025-11-27","2025-11-28",
    "2025-12-01","2025-12-02","2025-12-03","2025-12-04","2025-12-05"];
  const out = expectedSymbolSessionsBefore({
    marketSessions: market,
    targetDate: "2025-12-08",
    requiredSessions: 3,
    suspensions: [{ start:"2025-11-27", end:"2025-12-05", quality:"VERIFIED" }]
  });
  assert.deepEqual(out.sessions, ["2025-11-24","2025-11-25","2025-11-26"]);
}

// Verified suspension permits a valid history instead of treating it as stale.
{
  const result = validateSymbolHistoryFreshness({
    historyDates:["2025-11-03","2025-11-04","2025-11-05"],
    marketSessions:seq("2025-11-", [3,4,5,6,7,10,11,12,13,14]),
    targetDate:"2025-11-17",
    requiredSessions:3,
    suspensions:[{start:"2025-11-06",end:"2025-11-14",quality:"VERIFIED"}]
  });
  assert.equal(result.usable,true);
  assert.equal(result.expectedPriorDate,"2025-11-05");
}

// Unknown suspension provenance fails closed.
{
  const out = expectedSymbolSessionsBefore({
    marketSessions:["2025-11-03","2025-11-04","2025-11-05","2025-11-06"],
    targetDate:"2025-11-07",
    requiredSessions:3,
    suspensions:[{start:"2025-11-06",end:"2025-11-06",quality:"UNKNOWN"}]
  });
  assert.equal(out.status,"UNKNOWN");
  assert.equal(out.reason,"SUSPENSION_PROVENANCE_UNKNOWN");
}

// B-130 protection remains: without a verified suspension, a stale latest bar stays stale.
{
  const market=["2026-09-11","2026-09-14","2026-09-15","2026-09-16","2026-09-17","2026-09-18","2026-09-21","2026-09-22","2026-09-23"];
  const result=validateSymbolHistoryFreshness({
    historyDates:["2026-09-11"],
    marketSessions:market,
    targetDate:"2026-09-24",
    requiredSessions:1,
    suspensions:[]
  });
  assert.equal(result.usable,false);
  assert.equal(result.reason,"STALE_LATEST_SYMBOL_SESSION");
  assert.equal(result.expectedPriorDate,"2026-09-23");
}

console.log("symbol-session calendar prototype tests passed");

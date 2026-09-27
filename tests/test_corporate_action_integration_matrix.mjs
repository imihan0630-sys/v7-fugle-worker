import assert from "node:assert/strict";
import { validateSymbolHistoryFreshness } from "../research/symbol_session_calendar_prototype.mjs";
import { buildPointInTimeContinuity } from "../research/corporate_action_continuity_prototype.mjs";

function bar(date, close, volume=1000) {
  return { date, open:close, high:close, low:close, close, volume };
}

// Matrix 1: verified symbol suspension is a legitimate missing-market-session class.
{
  const fresh = validateSymbolHistoryFreshness({
    historyDates:["2025-11-03","2025-11-04","2025-11-05"],
    marketSessions:["2025-11-03","2025-11-04","2025-11-05","2025-11-06","2025-11-07","2025-11-10","2025-11-11","2025-11-12","2025-11-13","2025-11-14"],
    targetDate:"2025-11-17",
    requiredSessions:3,
    suspensions:[{start:"2025-11-06",end:"2025-11-14",quality:"VERIFIED"}]
  });
  assert.equal(fresh.usable,true);
  assert.equal(fresh.expectedPriorDate,"2025-11-05");
}

// Matrix 2: suspected/unknown suspension must not excuse missing bars.
{
  const unknown = validateSymbolHistoryFreshness({
    historyDates:["2025-11-03","2025-11-04","2025-11-05"],
    marketSessions:["2025-11-03","2025-11-04","2025-11-05","2025-11-06"],
    targetDate:"2025-11-07",
    requiredSessions:3,
    suspensions:[{start:"2025-11-06",end:"2025-11-06",quality:"UNKNOWN"}]
  });
  assert.equal(unknown.usable,false);
  assert.equal(unknown.reason,"SUSPENSION_PROVENANCE_UNKNOWN");
}

// Matrix 3: ordinary B-130 stale history stays rejected.
{
  const stale = validateSymbolHistoryFreshness({
    historyDates:["2026-09-11"],
    marketSessions:["2026-09-11","2026-09-14","2026-09-15","2026-09-16","2026-09-17","2026-09-18","2026-09-21","2026-09-22","2026-09-23"],
    targetDate:"2026-09-24",
    requiredSessions:1,
    suspensions:[]
  });
  assert.equal(stale.usable,false);
  assert.equal(stale.reason,"STALE_LATEST_SYMBOL_SESSION");
}

// Matrix 4: two events in one rolling history are deterministic.
// The ex-right event bridges price; later new-share listing is supply-only.
{
  const bars=[
    bar("2025-08-20",272,300),
    bar("2025-08-21",261,301),
    bar("2025-10-08",258.5,300),
    bar("2025-10-09",258,294)
  ];
  const events=[
    {
      eventKey:"8454:2025-08-21:EX_RIGHT",
      effectiveDate:"2025-08-21",
      actionType:"STOCK_DIVIDEND_EX_RIGHT",
      technicalPriceFactor:1/1.05,
      priceIndexComparableFactor:1/1.05,
      totalReturnComparableFactor:1/1.05,
      volumeTransformMode:"NONE"
    },
    {
      eventKey:"8454:2025-10-09:NEW_SHARES_LISTED",
      effectiveDate:"2025-10-09",
      actionType:"NEW_SHARES_LISTED",
      technicalPriceFactor:1,
      priceIndexComparableFactor:1,
      totalReturnComparableFactor:1,
      volumeTransformMode:"SUPPLY_CHANGE"
    }
  ];
  const a=buildPointInTimeContinuity({bars,events,targetDate:"2025-10-09"});
  const b=buildPointInTimeContinuity({bars,events:[...events].reverse(),targetDate:"2025-10-09"});
  assert.deepEqual(a.continuityBars,b.continuityBars);
  assert.equal(a.priceContinuityComplete,true);
  assert.equal(a.volumeContinuityComplete,false);
  assert.equal(a.continuityBars[0].volume,300);
  assert.equal(a.continuityBars.at(-1).volume,294);
}

// Matrix 5: no corporate action is strict identity; research transform must be a no-op.
{
  const bars=[bar("2026-09-21",100,500),bar("2026-09-22",102,600),bar("2026-09-23",101,550)];
  const out=buildPointInTimeContinuity({bars,events:[],targetDate:"2026-09-23"});
  assert.deepEqual(out.continuityBars,out.rawBars);
  assert.equal(out.appliedEvents.length,0);
  assert.equal(out.priceContinuityComplete,true);
  assert.equal(out.volumeContinuityComplete,true);
}

console.log("corporate-action integration falsification matrix passed");

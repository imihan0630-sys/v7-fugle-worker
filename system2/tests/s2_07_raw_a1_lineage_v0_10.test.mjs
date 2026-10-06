import assert from "node:assert/strict";
import {
  buildBoundedRawA1SessionPlanV0_10,
  evaluateBoundedRawA1LineageV0_10,
  summarizeBoundedRawA1LineageV0_10,
} from "../runtime/s2_07_raw_a1_lineage_v0_10.mjs";

const sessions=["2026-03-31","2026-04-01","2026-04-02","2026-04-07","2026-04-08","2026-04-09","2026-04-10","2026-04-13"];
const plan=buildBoundedRawA1SessionPlanV0_10({
  market:"TPEX",symbol:"5381",stopTradingStart:"2026-04-01",resumeTradingDate:"2026-04-13",
  boundedNativeSymbolSessionEvidenceReady:true,marketSessions:sessions,
});
assert.equal(plan.priorTradingSession,"2026-03-31");
assert.deepEqual(plan.suspendedMarketSessions,["2026-04-01","2026-04-02","2026-04-07","2026-04-08","2026-04-09","2026-04-10"]);
assert.equal(plan.resumeIsMarketSession,true);

function obs(date,tradable){
  return {
    marketDate:date,
    sourceId:"A1_TPEX_DAILY_QUOTES_HISTORICAL",
    sourceUrl:"https://example.invalid/"+date,
    sourceDateEvidence:date,
    sourceDateEvidenceBasis:"PAYLOAD_DATE",
    transportMode:"PRIMARY",
    rawPriceSpace:"RAW",
    sourcePopulationHash:"a".repeat(64),
    symbolRowObserved:tradable,
    symbolRowHash:tradable?"b".repeat(64):null,
    tradableOhlcObserved:tradable,
  };
}
const observations=plan.requiredDates.map(date=>obs(
  date,
  date===plan.priorTradingSession||date===plan.resumeTradingDate,
));
const ready=evaluateBoundedRawA1LineageV0_10({plan,observations});
assert.equal(ready.state,"BOUNDED_RAW_A1_LINEAGE_EVIDENCE_READY");
assert.equal(ready.rawA1LineageEvidenceReady,true);
assert.equal(ready.rawA1LineageBound,true);
assert.equal(ready.suspendedSessionsTreatedAsMissingData,false);
assert.equal(ready.technicalContinuityCertified,false);
assert.equal(ready.pitHistoricalPublicationClockCertified,false);
assert.equal(ready.selectionAuthority,false);

const unexpected=evaluateBoundedRawA1LineageV0_10({
  plan,
  observations:observations.map(x=>x.marketDate==="2026-04-02"?{...x,tradableOhlcObserved:true}:x),
});
assert.equal(unexpected.rawA1LineageEvidenceReady,false);
assert.ok(unexpected.blockers.some(x=>x.code==="UNEXPECTED_TRADABLE_BAR_DURING_CERTIFIED_SUSPENSION"));

const noResume=evaluateBoundedRawA1LineageV0_10({
  plan,
  observations:observations.map(x=>x.marketDate===plan.resumeTradingDate?{...x,tradableOhlcObserved:false}:x),
});
assert.ok(noResume.blockers.some(x=>x.code==="RESUME_TRADABLE_BAR_NOT_OBSERVED"));

const missing=evaluateBoundedRawA1LineageV0_10({plan,observations:observations.slice(1)});
assert.ok(missing.blockers.some(x=>x.code==="RAW_A1_REQUIRED_DATE_OBSERVATION_MISSING"));

const wrongDate=evaluateBoundedRawA1LineageV0_10({
  plan,
  observations:observations.map(x=>x.marketDate==="2026-04-01"?{...x,sourceDateEvidence:"2026-04-02"}:x),
});
assert.ok(wrongDate.blockers.some(x=>x.code==="RAW_A1_SOURCE_DATE_MISMATCH"));

const notNative=buildBoundedRawA1SessionPlanV0_10({
  market:"TPEX",symbol:"5381",stopTradingStart:"2026-04-01",resumeTradingDate:"2026-04-13",
  boundedNativeSymbolSessionEvidenceReady:false,marketSessions:sessions,
});
const blocked=evaluateBoundedRawA1LineageV0_10({plan:notNative,observations});
assert.ok(blocked.blockers.some(x=>x.code==="NATIVE_SCHEDULE_EVIDENCE_NOT_READY"));

const summary=summarizeBoundedRawA1LineageV0_10([ready,unexpected]);
assert.equal(summary.eventCount,2);
assert.equal(summary.rawA1LineageEvidenceReadyCount,1);
assert.equal(summary.blockedCount,1);
assert.equal(summary.suspendedSessionsTreatedAsMissingData,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.orderImpact,false);

console.log("S2-07 bounded RAW A1 lineage V0.10 tests PASS");

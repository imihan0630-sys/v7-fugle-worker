import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(path)=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
const all=read("../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json");
const physical=read("../evidence/S2_RECENT60_20261008_HOT_D1_VS_PIT_PHYSICAL_SAMPLE_V0_1.json");
const a=all.aggregate,m=all.byMarket,proof=physical.boundedHotD1PhysicalCrosscheck,source=all.source;

assert.equal(all.time.marketDate,"2026-10-08");
assert.equal(physical.marketDate,all.time.marketDate);
assert.equal(source.workflowRunId,physical.workflow.runId);
assert.equal(source.jobId,physical.workflow.jobId);
assert.equal(source.artifactId,physical.workflow.artifact.id);
assert.equal(source.artifactDigest,physical.workflow.artifact.digest);
assert.equal(source.runStatus,"SUCCESS");
assert.equal(physical.workflow.conclusion,"success");

for(const field of [
  "currentUniverseCount","historyReadyCount",
  "missingExpectedPITEligibleSymbolCount","missingExpectedPITEligibleSymbolSessionTotal",
]){
  assert.equal(a[field],m.TWSE[field]+m.TPEX[field],field+" TWSE+TPEX reconciliation");
}
assert.equal(a.currentUniverseCount,a.missingExpectedPITEligibleSymbolCount+a.historyReadyCount);
assert.equal(a.continuityReadyCount,0);
assert.equal(a.firstBlockerPriorityClassCounts.EXPECTED_PIT_SESSION_MISSING,a.missingExpectedPITEligibleSymbolCount);
assert.equal(a.firstBlockerPriorityClassCounts.CONTINUITY_PROOF_MISSING,a.historyReadyCount);
assert.equal(a.firstBlockerPriorityClassCounts.OTHER_FIRST_BLOCKERS,0);
assert.ok(a.unexpectedOlderSessionSymbolCount<=a.currentUniverseCount);
assert.ok(a.unexpectedOlderSessionSymbolCount>0);
assert.ok(a.missingExpectedPITEligibleSymbolSessionTotal>0);
assert.equal(a.minimumPriorSessionRequirement,60);
for(const [name,buckets,total] of [
  ["combined",a.selectedCountBuckets,a.currentUniverseCount],
  ["TWSE",m.TWSE.selectedDateBuckets,m.TWSE.currentUniverseCount],
  ["TPEX",m.TPEX.selectedDateBuckets,m.TPEX.currentUniverseCount],
]){
  assert.equal(Object.values(buckets).reduce((x,y)=>x+y,0),total,name+" bucket count");
}

assert.equal(proof.sampledDateIdentities,96);
assert.equal(proof.D1HotBarRowAbsent,96);
assert.equal(proof.D1PresentButPitFlagExcluded,0);
assert.equal(proof.D1PresentButAvailableAtTooLate,0);
assert.equal(proof.D1PresentButNonRawPriceSpace,0);
assert.equal(proof.unexpectedEligibleRowReaderMismatch,0);
assert.equal(all.sample.requestedDateIdentities,proof.sampledDateIdentities);
assert.equal(all.sample.marketSymbolCount*all.sample.dateSample.length,proof.sampledDateIdentities);
assert.equal(all.sample.twseSymbols.length+all.sample.tpexSymbols.length,all.sample.marketSymbolCount);
assert.ok(proof.noInferences.includes("NO_COLD_R2_ABSENCE_INFERENCE"));
assert.ok(proof.noInferences.includes("NOT_FULL_MARKET_PHYSICAL_ABSENCE_PROOF"));
assert.ok(all.sample.guardrails.includes("SAMPLE_NOT_RANDOM"));

const sampledAt=Date.parse(all.time.sourceObservedAt);
assert.ok(sampledAt>Date.parse("2026-10-08T23:59:59+08:00"),
  "Retrospective evidence cannot be relabeled as T decision-time PIT");
assert.match(all.time.semantics,/RETROSPECTIVE/);
assert.match(physical.observationTimeBasis,/POST_FACTO/);
assert.ok(all.policy.cleanZeroPickAllowed===false);
assert.ok(all.policy.system2SelectionPromotion===false);
assert.ok(all.policy.corporateActionNoEventCertified===false);
assert.ok(physical.executionCost.d1RowsWritten===0);
assert.ok(all.metering.d1RowsWritten===0);
assert.ok(all.metering.r2WriteCount===0);
assert.equal(all.metering.d1RowsRead,physical.executionCost.d1RowsRead);

console.log("AUDIT recent60 two-source evidence integrity and release blockers PASS");
console.log(JSON.stringify({
  marketDate:all.time.marketDate,
  observedUtc:all.time.sourceObservedAt,
  symbols:a.currentUniverseCount,exactHistoryReady:a.historyReadyCount,
  continuityReady:a.continuityReadyCount,expectedSessionGapSymbols:a.missingExpectedPITEligibleSymbolCount,
  expectedSessionGaps:a.missingExpectedPITEligibleSymbolSessionTotal,
  olderDateSubstitutionRiskSymbols:a.unexpectedOlderSessionSymbolCount,
  physicalSampleHotD1Absent:proof.D1HotBarRowAbsent,
  physicalSampleIdentities:proof.sampledDateIdentities,
  physicalAllMarketAbsenceProved:false,
  conditionalFinalFreezeAuthorized:false,
}));

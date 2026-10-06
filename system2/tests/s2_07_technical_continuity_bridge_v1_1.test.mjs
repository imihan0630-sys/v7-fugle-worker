import assert from "node:assert/strict";
import { evaluateBoundedTechnicalContinuityBridgeV1_1 } from "../runtime/s2_07_technical_continuity_bridge_v1_1.mjs";

const lineage={
  state:"BOUNDED_RAW_A1_LINEAGE_READY",
  rawA1LineageBound:true,
  market:"TPEX",
  symbol:"4806",
  family:"CAPITAL_REDUCTION",
  previousOfficialSession:"2026-09-22",
  resumeTradingDate:"2026-10-02",
};

const officialEvent={
  exchange:"TPEX",
  symbol:"4806",
  actionFamilyId:"CAPITAL_REDUCTION",
  effectiveDate:"2026-10-02",
  eventVersionId:"S2-CA-EVENT:test",
  sourceCaptureId:"S2-CA-CAPTURE:test",
  sourceRowHash:"a".repeat(64),
  actualResultVerified:true,
  technicalContinuityEvidenceEligible:true,
  continuityEffectState:"VERIFIED",
  continuityEffect:{
    preActionClose:20,
    officialReferencePrice:25,
    referencePriceRatio:1.25,
  },
  knowledgeTimeMode:"HISTORICAL_UNKNOWN",
  firstKnownAt:null,
  availableAt:null,
  pitEventReplayEligible:false,
};

function bar(date,open,high,low,close){
  return {
    market:"TPEX",
    symbol:"4806",
    marketDate:date,
    canonicalKey:["TPEX","4806",date,"RAW"].join("|"),
    priceSpace:"RAW",
    open,high,low,close,
    sourceId:"A1_TPEX_DAILY_QUOTES_RECENT_HOT_WARMUP_PROSPECTIVE",
    sourceRowHash:"b".repeat(64),
    barHash:"c".repeat(64),
    observedAt:"2026-10-04T00:00:00Z",
    availableAt:"2026-10-04T01:00:00Z",
    pitReplayEligible:true,
    continuityState:"UNVERIFIED",
  };
}

const ready=evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase:lineage,
  officialEvent,
  preSuspensionRawBar:bar("2026-09-22",19,21,18,20),
  resumeRawBar:bar("2026-10-02",26,27,24,24.5),
});
assert.equal(ready.state,"BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED");
assert.equal(ready.boundedTechnicalContinuityBridgeReady,true);
assert.equal(ready.officialReferencePriceRatio,1.25);
assert.equal(ready.transformedPreSuspensionCloseInReferenceSpace,25);
assert.ok(Math.abs(ready.residualOpenGapRate-0.04)<1e-12);
assert.ok(Math.abs(ready.residualCloseMoveRate-(-0.02))<1e-12);
assert.equal(ready.mechanicalResetNeutralizedForBoundaryResearch,true);
assert.equal(ready.residualMoveSeparatedFromMechanicalReset,true);
assert.equal(ready.pitTechnicalContinuityReplayEligible,false);
assert.equal(ready.pitReplayBlocker,"OFFICIAL_EVENT_KNOWLEDGE_CLOCK_HISTORICAL_UNKNOWN");
assert.equal(ready.technicalContinuityScope,"EVENT_BOUNDARY_ONLY");
assert.equal(ready.technicalContinuityCertified,false);
assert.equal(ready.continuityTransformPerformed,false);
assert.equal(ready.historyMutationPerformed,false);
assert.equal(ready.adjustedHistoryPersisted,false);
assert.equal(ready.selectionAuthority,false);
assert.equal(ready.orderImpact,false);

const badPreClose=evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase:lineage,
  officialEvent,
  preSuspensionRawBar:bar("2026-09-22",19,22,18,21),
  resumeRawBar:bar("2026-10-02",26,27,24,24.5),
});
assert.equal(badPreClose.boundedTechnicalContinuityBridgeReady,false);
assert.ok(badPreClose.blockers.includes("PRE_SUSPENSION_CLOSE_OFFICIAL_MISMATCH"));

const badEvent=evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase:lineage,
  officialEvent:{...officialEvent,technicalContinuityEvidenceEligible:false,continuityEffectState:"UNKNOWN"},
  preSuspensionRawBar:bar("2026-09-22",19,21,18,20),
  resumeRawBar:bar("2026-10-02",26,27,24,24.5),
});
assert.equal(badEvent.boundedTechnicalContinuityBridgeReady,false);
assert.ok(badEvent.blockers.includes("OFFICIAL_REFERENCE_PAIR_NOT_VERIFIED"));

const notLineage=evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase:{...lineage,state:"RAW_A1_LINEAGE_BLOCKED",rawA1LineageBound:false},
  officialEvent,
  preSuspensionRawBar:bar("2026-09-22",19,21,18,20),
  resumeRawBar:bar("2026-10-02",26,27,24,24.5),
});
assert.equal(notLineage.boundedTechnicalContinuityBridgeReady,false);
assert.ok(notLineage.blockers.includes("RAW_A1_LINEAGE_NOT_READY"));

const pitReady=evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase:lineage,
  officialEvent:{
    ...officialEvent,
    knowledgeTimeMode:"EXACT",
    firstKnownAt:"2026-10-02T00:00:00Z",
    availableAt:"2026-10-02T00:00:00Z",
    pitEventReplayEligible:true,
  },
  preSuspensionRawBar:bar("2026-09-22",19,21,18,20),
  resumeRawBar:bar("2026-10-02",26,27,24,24.5),
});
assert.equal(pitReady.state,"BOUNDED_CONTINUITY_BRIDGE_READY");
assert.equal(pitReady.pitTechnicalContinuityReplayEligible,true);
assert.equal(pitReady.pitReplayBlocker,null);
assert.equal(pitReady.technicalContinuityCertified,false);

console.log("S2-07 technical continuity bridge V1.1 tests PASS");

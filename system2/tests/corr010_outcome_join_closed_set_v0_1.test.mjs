import assert from "node:assert/strict";
import { buildFactorObservation, buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { buildFrozenDecisionSnapshot } from "../runtime/decision_archive.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildShadowRunReceipt } from "../runtime/shadow_run_receipt.mjs";
import { buildShadowRunFingerprint } from "../runtime/shadow_run_fingerprint.mjs";
import { buildPredictionSnapshotBundleV0_1 } from "../runtime/prediction_snapshot_v0_1.mjs";

const marketDate="2026-10-08";
const decisionTimestamp="2026-10-08T07:30:00Z";
const capturedAt="2026-10-08T07:31:00Z";
const h=(c)=>c.repeat(64);

const regime=buildMarketRegimeSnapshot({
  regimeSnapshotId:"REG-CORR010",
  marketDate,
  decisionTimestamp,
  labels:["UNKNOWN"],
  taiwanIndexState:"KNOWN",
  breadthState:"UNKNOWN",
  liquidityState:"KNOWN",
  volatilityState:"KNOWN",
  leadershipState:"UNKNOWN",
  sectorRotationState:"UNKNOWN",
  globalMacroState:"UNKNOWN",
  factorRefs:[],
  warnings:["fixture"],
});

const contract={
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  evidenceFamilies:[{
    family:"PRICE_VOLUME",
    factorIds:["PV.TEST"],
    unknownBlocksEligibility:true,
  }],
};
const familyAssessments={
  PRICE_VOLUME:{
    family:"PRICE_VOLUME",
    observationState:"KNOWN",
    thesisState:"SUPPORTIVE",
    reasons:["fixture"],
    warnings:[],
  },
};

const obs=buildFactorObservation({
  factorId:"PV.TEST",
  factorVersion:"0.1",
  scope:"SYMBOL",
  scopeKey:"2330",
  marketDate,
  decisionTimestamp,
  state:"KNOWN",
  rawValue:1,
  normalizedValue:0.5,
  confidence:1,
  provenance:{
    sourceId:"FIXTURE",
    sourceName:"fixture",
    availableAt:"2026-10-08T07:20:00Z",
    capturedAt:"2026-10-08T07:20:00Z",
    pointInTimeEligible:true,
    payloadHash:h("a"),
  },
  normalization:{method:"NONE",normalizationVersion:"0.1"},
  qualityFlags:[],
});

const decision=await buildFrozenDecisionSnapshot({
  evaluation:{
    decisionId:"D-CORR010-2330",
    marketDate,
    decisionTimestamp,
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    symbol:"2330",
    companyName:"台積電",
    state:"QUALIFIED_NOT_SELECTED",
    rank:null,
    totalScore:null,
    factorRefs:["PV.TEST@0.1"],
    interactionRefs:[],
    regimeSnapshotId:regime.regimeSnapshotId,
    reasons:["fixture"],
    warnings:[],
    missingRequiredFactors:[],
    invalidationConditions:[],
    strategyValidity:"VALID",
    entryReadiness:"NEAR_ENTRY",
    shadowSpecId:"S2-SM-LS-001",
  },
  entryPlan:{},
  factorObservations:[obs],
  interactionObservations:[],
  regime,
  strategyContract:contract,
  familyAssessments,
  frozenAt:capturedAt,
});

const source=await buildShadowSourceSessionReceipt({
  receiptId:"SRC-CORR010",
  marketDate,
  decisionTimestamp,
  expectedSources:[{sourceId:"FIXTURE",role:"REQUIRED"}],
  observedSources:[{
    sourceId:"FIXTURE",
    state:"KNOWN",
    sourceDate:marketDate,
    availableAt:"2026-10-08T07:20:00Z",
    capturedAt:"2026-10-08T07:20:00Z",
    pointInTimeEligible:true,
    payloadHash:h("b"),
  }],
  capturedAt:"2026-10-08T07:20:00Z",
});

const run=buildShadowRunReceipt({
  runId:"RUN-CORR010",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"U-CORR010",
  baseUniverseSymbols:["2330"],
  excludedSymbols:[],
  eligibleUniverseSymbols:["2330"],
  symbolAccounts:[{
    symbol:"2330",
    state:"QUALIFIED_NOT_SELECTED",
    decisionId:"D-CORR010-2330",
  }],
  capturedAt,
});

const fp=await buildShadowRunFingerprint({
  fingerprintId:"FP-CORR010",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"U-CORR010",
  sourceSessionReceipt:source,
  shadowRunReceipt:run,
  decisionHashes:[decision.evaluation.decisionHash],
  capturedAt,
});

async function prediction({
  id,
  decisions=[decision],
  sourceReceipt=source,
  runs=[run],
  fingerprints=[fp],
}){
  return buildPredictionSnapshotBundleV0_1({
    predictionSnapshotId:id,
    marketDate,
    decisionTimestamp,
    decisionSnapshots:decisions,
    sourceSessionReceipt:sourceReceipt,
    shadowRunReceipts:runs,
    runFingerprints:fingerprints,
    capturedAt,
  });
}

const safe=await prediction({id:"PS-CORR010-SAFE"});
assert.equal(safe.outcomeJoinEligible,true);
assert.deepEqual(safe.outcomeJoinBlockers,[]);
assert.equal(safe.fingerprintReconciliations[0].state,"READY");

const foreignRun=buildShadowRunReceipt({
  runId:"RUN-CORR010-FOREIGN",
  marketDate,
  decisionTimestamp,
  strategyId:"SWING_GROWTH",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SG-LS-001",
  universeVersion:"U-CORR010",
  baseUniverseSymbols:["2330"],
  excludedSymbols:[],
  eligibleUniverseSymbols:["2330"],
  symbolAccounts:[{
    symbol:"2330",
    state:"QUALIFIED_NOT_SELECTED",
    decisionId:"D-CORR010-2330",
  }],
  capturedAt,
});
const foreignFp=await buildShadowRunFingerprint({
  fingerprintId:"FP-CORR010-FOREIGN",
  marketDate,
  decisionTimestamp,
  strategyId:"SWING_GROWTH",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SG-LS-001",
  universeVersion:"U-CORR010",
  sourceSessionReceipt:source,
  shadowRunReceipt:foreignRun,
  decisionHashes:[decision.evaluation.decisionHash],
  capturedAt,
});
assert.equal(foreignFp.outcomeJoinEligible,true,"AP-02 fixture must look superficially complete");
const ap02=await prediction({
  id:"PS-CORR010-AP02",
  sourceReceipt:null,
  runs:[foreignRun],
  fingerprints:[foreignFp],
});
assert.equal(ap02.outcomeJoinEligible,false);
assert.ok(ap02.outcomeJoinBlockers.includes("SOURCE_SESSION_RECEIPT_NOT_PROVIDED"));
assert.ok(ap02.outcomeJoinBlockers.some((x)=>x.includes("DECISION_HASH_CLOSED_SET_MISMATCH")));
assert.ok(ap02.outcomeJoinBlockers.some((x)=>x.startsWith("RUN_FINGERPRINT_RECONCILIATION_INCOMPLETE:")));

const strategyMismatchFp=await buildShadowRunFingerprint({
  fingerprintId:"FP-CORR010-MISMATCH",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"U-CORR010",
  sourceSessionReceipt:source,
  shadowRunReceipt:foreignRun,
  decisionHashes:[decision.evaluation.decisionHash],
  capturedAt,
});
assert.equal(strategyMismatchFp.outcomeJoinEligible,false);
assert.ok(strategyMismatchFp.blockers.includes("SHADOW_RUN_STRATEGY_ID_MISMATCH"));
assert.ok(strategyMismatchFp.blockers.includes("SHADOW_RUN_SPEC_ID_MISMATCH"));

const tamperedFp={
  ...fp,
  decisionHashes:[],
};
const tampered=await prediction({
  id:"PS-CORR010-TAMPERED-FP",
  fingerprints:[tamperedFp],
});
assert.equal(tampered.outcomeJoinEligible,false);
assert.ok(tampered.outcomeJoinBlockers.some((x)=>x.includes("RUN_FINGERPRINT_HASH_MISMATCH")));
assert.ok(tampered.outcomeJoinBlockers.includes("PREDICTION_DECISION_HASH_CLOSED_SET_MISMATCH"));

const duplicate=await prediction({
  id:"PS-CORR010-DUP-FP",
  runs:[run],
  fingerprints:[fp,fp],
});
assert.equal(duplicate.outcomeJoinEligible,false);
assert.ok(
  duplicate.outcomeJoinBlockers.includes(
    "DECISION_HASH_COVERED_MULTIPLE_TIMES:"+decision.evaluation.decisionHash,
  ),
);

const tamperedDecision={
  ...decision,
  entryPlan:{triggerPrice:9999},
};
const decisionTamper=await prediction({
  id:"PS-CORR010-TAMPERED-DECISION",
  decisions:[tamperedDecision],
});
assert.equal(decisionTamper.outcomeJoinEligible,false);
assert.ok(
  decisionTamper.outcomeJoinBlockers.includes(
    "DECISION_HASH_INTEGRITY_INVALID:D-CORR010-2330",
  ),
);

const tamperedSource={...source,sourceSessionHash:h("f")};
const sourceTamper=await prediction({
  id:"PS-CORR010-TAMPERED-SOURCE",
  sourceReceipt:tamperedSource,
});
assert.equal(sourceTamper.outcomeJoinEligible,false);
assert.ok(sourceTamper.outcomeJoinBlockers.some((x)=>x.includes("SOURCE_SESSION_HASH_INVALID")));

const emptyFp=await buildShadowRunFingerprint({
  fingerprintId:"FP-CORR010-EMPTY",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"U-CORR010",
  sourceSessionReceipt:source,
  shadowRunReceipt:run,
  decisionHashes:[],
  capturedAt,
});
assert.equal(emptyFp.outcomeJoinEligible,false);
assert.ok(emptyFp.blockers.includes("EMPTY_DECISION_HASHES_WITHOUT_PROVED_EMPTY_UNIVERSE"));

const wrongDateRun=buildShadowRunReceipt({
  runId:"RUN-CORR010-WRONG-DATE",
  marketDate:"2026-10-07",
  decisionTimestamp:"2026-10-07T07:30:00Z",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"U-CORR010",
  baseUniverseSymbols:[],
  excludedSymbols:[],
  eligibleUniverseSymbols:[],
  symbolAccounts:[],
  capturedAt:"2026-10-07T07:31:00Z",
});
await assert.rejects(
  ()=>prediction({
    id:"PS-CORR010-AP03-WRONG-DATE",
    runs:[wrongDateRun],
    fingerprints:[fp],
  }),
  /does not match Prediction Snapshot clock/,
);

console.log("CORR-010 outcome-join closed-set reconciliation tests PASS");

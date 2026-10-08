import assert from "node:assert/strict";
import { buildFactorObservation, buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { buildFrozenDecisionSnapshot } from "../runtime/decision_archive.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildShadowRunReceipt } from "../runtime/shadow_run_receipt.mjs";
import { buildShadowRunFingerprint } from "../runtime/shadow_run_fingerprint.mjs";
import { buildPredictionSnapshotBundleV0_1 } from "../runtime/prediction_snapshot_v0_1.mjs";

const marketDate="2026-10-08";
const decisionTimestamp="2026-10-08T07:30:00Z";
const frozenAt="2026-10-08T07:31:00Z";
const symbol="2330";

const contract={
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  evidenceFamilies:[
    {
      family:"PRICE_VOLUME",
      factorIds:["PV.TEST"],
      unknownBlocksEligibility:true,
    },
  ],
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

const regime=buildMarketRegimeSnapshot({
  regimeSnapshotId:"REG-CORR009",
  marketDate,
  decisionTimestamp,
  labels:["UNKNOWN"],
  taiwanIndexState:"UNKNOWN",
  breadthState:"UNKNOWN",
  liquidityState:"UNKNOWN",
  volatilityState:"UNKNOWN",
  leadershipState:"UNKNOWN",
  sectorRotationState:"UNKNOWN",
  globalMacroState:"UNKNOWN",
  factorRefs:[],
  warnings:["fixture"],
});

function factor({
  factorVersion="0.1",
  availableAt="2026-10-08T07:20:00Z",
  pointInTimeEligible=true,
  payloadHash="a".repeat(64),
  rawValue=1,
}={}){
  return buildFactorObservation({
    factorId:"PV.TEST",
    factorVersion,
    scope:"SYMBOL",
    scopeKey:symbol,
    marketDate,
    decisionTimestamp,
    state:"KNOWN",
    rawValue,
    normalizedValue:0.5,
    confidence:1,
    provenance:{
      sourceId:"FIXTURE_SOURCE",
      sourceName:"fixture",
      sourceDate:marketDate,
      observedAt:"2026-10-08T07:25:00Z",
      availableAt,
      capturedAt:"2026-10-08T07:25:00Z",
      pointInTimeEligible,
      ...(payloadHash===null?{}:{payloadHash}),
    },
    normalization:{
      method:"BOUNDED_RATIO",
      normalizationVersion:"0.1",
    },
    qualityFlags:[],
  });
}

async function decision(obs,{factorRefs=["PV.TEST@0.1"],decisionId="D-CORR009"}={}){
  return buildFrozenDecisionSnapshot({
    evaluation:{
      decisionId,
      marketDate,
      decisionTimestamp,
      strategyId:"SHORT_MOMENTUM",
      strategyVersion:"V0.1-CONTRACT",
      symbol,
      companyName:"台積電",
      state:"SELECTED",
      rank:1,
      totalScore:88,
      factorRefs,
      interactionRefs:[],
      regimeSnapshotId:regime.regimeSnapshotId,
      reasons:["fixture selected"],
      warnings:[],
      missingRequiredFactors:[],
      invalidationConditions:[],
      strategyValidity:"VALID",
      entryReadiness:"BUY_ELIGIBLE",
      shadowSpecId:"S2-SM-LS-001",
    },
    entryPlan:{},
    factorObservations:[obs],
    interactionObservations:[],
    regime,
    strategyContract:contract,
    familyAssessments,
    frozenAt,
  });
}

const valid=await decision(factor());
assert.equal(valid.evaluation.state,"SELECTED");
assert.equal(valid.evaluation.strategyValidity,"VALID");
assert.equal(valid.evaluation.entryReadiness,"BUY_ELIGIBLE");
assert.equal(valid.decisionEvidence.state,"READY");
assert.equal(valid.decisionEvidence.outcomeJoinEligible,true);
assert.equal(valid.decisionEvidence.blockerCodes.length,0);
assert.match(valid.decisionEvidence.evidenceHash,/^[a-f0-9]{64}$/);
assert.equal(valid.decisionEvidence.familyLineage.length,1);
assert.equal(valid.decisionEvidence.familyLineage[0].factorRefs[0],"PV.TEST@0.1");
assert.match(valid.decisionEvidence.familyLineage[0].factorObservationHashes[0],/^[a-f0-9]{64}$/);

const ap01=await decision(factor({
  pointInTimeEligible:false,
  availableAt:"2026-10-08T08:30:00Z",
}),{decisionId:"D-CORR009-AP01"});
assert.equal(ap01.evaluation.state,"INCOMPLETE");
assert.equal(ap01.evaluation.rank,null);
assert.equal(ap01.evaluation.totalScore,null);
assert.equal(ap01.evaluation.strategyValidity,"INCOMPLETE");
assert.equal(ap01.evaluation.entryReadiness,"BLOCKED");
assert.equal(ap01.decisionEvidence.state,"INCOMPLETE");
assert.equal(ap01.decisionEvidence.outcomeJoinEligible,false);
assert.ok(ap01.decisionEvidence.blockerCodes.includes("FACTOR_PIT_INELIGIBLE:PV.TEST@0.1"));
assert.ok(ap01.decisionEvidence.blockerCodes.includes("FACTOR_AVAILABLE_AFTER_DECISION:PV.TEST@0.1"));
assert.ok(ap01.evaluation.missingRequiredFactors.some((x)=>x.includes("FACTOR_PIT_INELIGIBLE")));
assert.ok(ap01.evaluation.warnings.some((x)=>x.includes("FACTOR_AVAILABLE_AFTER_DECISION")));

const missingHash=await decision(factor({payloadHash:null}),{decisionId:"D-CORR009-NOHASH"});
assert.equal(missingHash.evaluation.state,"INCOMPLETE");
assert.ok(missingHash.decisionEvidence.blockerCodes.includes("FACTOR_SOURCE_HASH_MISSING:PV.TEST@0.1"));

const wrongVersion=await decision(
  factor({factorVersion:"0.1"}),
  {factorRefs:["PV.TEST@0.2"],decisionId:"D-CORR009-VERSION"},
);
assert.equal(wrongVersion.evaluation.state,"INCOMPLETE");
assert.ok(
  wrongVersion.decisionEvidence.blockerCodes.includes(
    "FACTOR_VERSION_NOT_AUTHORIZED_BY_DECISION_REF:PV.TEST@0.1",
  ),
);
assert.ok(
  wrongVersion.decisionEvidence.blockerCodes.includes(
    "DECLARED_FACTOR_REF_MISSING_OBSERVATION:PV.TEST@0.2",
  ),
);

const changedPayload=await decision(
  factor({payloadHash:"b".repeat(64)}),
  {decisionId:"D-CORR009-HASH-CHANGE"},
);
assert.notEqual(valid.decisionEvidence.evidenceHash,changedPayload.decisionEvidence.evidenceHash);
assert.notEqual(
  valid.decisionEvidence.familyLineage[0].familyAssessmentHash,
  changedPayload.decisionEvidence.familyLineage[0].familyAssessmentHash,
);

const sourceSessionReceipt=await buildShadowSourceSessionReceipt({
  receiptId:"SRC-CORR009",
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
    payloadHash:"c".repeat(64),
  }],
  capturedAt:"2026-10-08T07:20:00Z",
});

async function coherentRunEvidence(snapshot,{suffix,state}){
  const runReceipt=buildShadowRunReceipt({
    runId:"RUN-CORR009-"+suffix,
    marketDate,
    decisionTimestamp,
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    shadowSpecId:"S2-SM-LS-001",
    universeVersion:"U-CORR009",
    baseUniverseSymbols:[symbol],
    excludedSymbols:[],
    eligibleUniverseSymbols:[symbol],
    symbolAccounts:[{
      symbol,
      state,
      decisionId:snapshot.evaluation.decisionId,
    }],
    capturedAt:frozenAt,
  });
  const fingerprint=await buildShadowRunFingerprint({
    fingerprintId:"FP-CORR009-"+suffix,
    marketDate,
    decisionTimestamp,
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    shadowSpecId:"S2-SM-LS-001",
    universeVersion:"U-CORR009",
    sourceSessionReceipt,
    shadowRunReceipt:runReceipt,
    decisionHashes:[snapshot.evaluation.decisionHash],
    capturedAt:frozenAt,
  });
  assert.equal(fingerprint.outcomeJoinEligible,true);
  return {runReceipt,fingerprint};
}

const unsafeRun=await coherentRunEvidence(ap01,{
  suffix:"UNSAFE",
  state:"INCOMPLETE",
});
const unsafePrediction=await buildPredictionSnapshotBundleV0_1({
  predictionSnapshotId:"PS-CORR009-UNSAFE",
  marketDate,
  decisionTimestamp,
  decisionSnapshots:[ap01],
  sourceSessionReceipt,
  shadowRunReceipts:[unsafeRun.runReceipt],
  runFingerprints:[unsafeRun.fingerprint],
  capturedAt:frozenAt,
});
assert.equal(unsafePrediction.outcomeJoinEligible,false);
assert.ok(
  unsafePrediction.outcomeJoinBlockers.includes(
    "DECISION_EVIDENCE_NOT_READY:D-CORR009-AP01",
  ),
);
assert.equal(unsafePrediction.cohortCounts.SELECTED,0);

const safeRun=await coherentRunEvidence(valid,{
  suffix:"SAFE",
  state:"SELECTED",
});
const safePrediction=await buildPredictionSnapshotBundleV0_1({
  predictionSnapshotId:"PS-CORR009-SAFE",
  marketDate,
  decisionTimestamp,
  decisionSnapshots:[valid],
  sourceSessionReceipt,
  shadowRunReceipts:[safeRun.runReceipt],
  runFingerprints:[safeRun.fingerprint],
  capturedAt:frozenAt,
});
assert.equal(safePrediction.outcomeJoinEligible,true);
assert.deepEqual(safePrediction.outcomeJoinBlockers,[]);

console.log("CORR-009 decision PIT evidence firewall tests PASS");

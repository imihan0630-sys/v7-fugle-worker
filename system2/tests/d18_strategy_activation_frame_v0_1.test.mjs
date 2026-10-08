import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildD18StrategyActivationFrameV0_1 } from "../runtime/d18_strategy_activation_frame_v0_1.mjs";

const marketDate="2026-10-05";
const decisionTimestamp="2026-10-05T06:30:00.000Z";

function counts(overrides={}) {
  return {
    SELECTED:0,
    QUALIFIED_NOT_SELECTED:0,
    WATCH:0,
    REJECTED:0,
    INCOMPLETE:0,
    SOURCE_BLOCKED:0,
    SESSION_INVALID:0,
    NOT_APPLICABLE:0,
    ERROR:0,
    ...overrides,
  };
}

async function makePair(stateCounts,{runState="COMPLETE",completionRate=1,fingerprintState="RUN_FINGERPRINT_COMPLETE"}={}) {
  const shadowRunReceipt={
    runId:"RUN-SM-20261005",
    marketDate,
    decisionTimestamp,
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    shadowSpecId:"SHADOW-SM-V0.1",
    universeVersion:"TW-EQUITY-V1",
    runState,
    baseUniverseCount:10,
    excludedCount:0,
    eligibleCount:10,
    accountedCount:runState==="COMPLETE"?10:9,
    completionRate,
    stateCounts,
    unaccountedSymbols:runState==="COMPLETE"?[]:["9999"],
    symbolAccounts:[],
    warnings:[],
    capturedAt:"2026-10-05T06:31:00.000Z",
  };
  const shadowAccountingHash=await sha256Hex(shadowRunReceipt);
  const fpBase={
    fingerprintId:"FP-SM-20261005",
    marketDate,
    decisionTimestamp,
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    shadowSpecId:"SHADOW-SM-V0.1",
    universeVersion:"TW-EQUITY-V1",
    sourceSessionHash:"source-hash",
    shadowAccountingHash,
    decisionHashes:[],
    orderingHashes:[],
    rankingExperimentHashes:[],
    capacityHash:null,
    lifecycleHashes:[],
    runFingerprintState:fingerprintState,
    blockers:fingerprintState==="RUN_FINGERPRINT_COMPLETE"?[]:["SHADOW_RUN_ACCOUNTING_INCOMPLETE"],
    outcomeJoinEligible:fingerprintState==="RUN_FINGERPRINT_COMPLETE",
    capturedAt:"2026-10-05T06:31:00.000Z",
    schemaVersion:"S2_SHADOW_RUN_FINGERPRINT_V0_1",
  };
  return {
    shadowRunReceipt,
    runFingerprint:{...fpBase,runFingerprintHash:await sha256Hex(fpBase)},
  };
}

const params={
  regimeDimension:"trendContext",
  disabledValues:["DOWN_TREND_CONTEXT"],
  unknownAction:"DATA_UNKNOWN",
  nonDisabledAction:"KEEP_STATIC_BASELINE",
};
const registration={
  policyId:"D18-08-SHORT-MOMENTUM-DOWN-TREND-DISABLE-V0_1",
  policyVersion:"0.1-RESEARCH",
  policyClass:"BINARY_ACTIVATION_DEACTIVATION",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  state:"PREREGISTERED_SHADOW",
  parameters:params,
  parameterHash:await sha256Hex(params),
  registeredAt:"2026-10-04T06:35:00.000Z",
  availableAt:"2026-10-04T06:35:00.000Z",
};

const costContract={
  version:"S2-RESEARCH-COST-V0_1",
  availableAt:"2026-10-04T06:30:00.000Z",
  roundTripCostRate:0.004,
  note:"same frozen research cost for baseline/challenger",
};

const D18_DIMENSIONS=[
  "trendContext",
  "breadthContext",
  "volatilityDirection",
  "activityDirection",
  "concentrationContext",
  "sizeLeadership",
  "institutionalContext",
  "globalTransmission",
  "sectorRotationContext",
];

async function hashedDimension({
  state="UNKNOWN",
  value=null,
  reason="fixture unknown",
  sourceRef=null,
  sourceIdentity=null,
  availableAt=null,
  pointInTimeEligible=false,
  blockerCodes=[],
}={}) {
  const base={
    state,
    value,
    reason,
    sourceRef,
    sourceIdentity,
    sourceHashField:pointInTimeEligible ? "receiptHash" : null,
    sourceHashRecomputed:pointInTimeEligible ? sourceRef : null,
    sourceHashVerified:pointInTimeEligible === true,
    availableAt,
    pointInTimeEligible,
    blockerCodes,
  };
  return {...base,evidenceHash:await sha256Hex(base)};
}

async function regime(value,state="KNOWN") {
  const dimensions={};
  for(const key of D18_DIMENSIONS){
    dimensions[key]=await hashedDimension();
  }
  dimensions.trendContext = state==="KNOWN"
    ? await hashedDimension({
        state:"KNOWN",
        value,
        reason:null,
        sourceRef:"a".repeat(64),
        sourceIdentity:"A2_TAIEX_CLOSE",
        availableAt:"2026-10-05T06:20:00.000Z",
        pointInTimeEligible:true,
        blockerCodes:[],
      })
    : await hashedDimension();
  const base={
    vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
    marketDate,
    decisionTimestamp,
    pointInTimeEligible:true,
    dimensions,
  };
  return {...base,receiptHash:await sha256Hex(base)};
}

const opportunity=await makePair(counts({QUALIFIED_NOT_SELECTED:2}));
const base={
  frameId:"D18-ACT-1",
  ...opportunity,
  regimeVector:await regime("DOWN_TREND_CONTEXT"),
  registration,
  costContract,
  createdAt:"2026-10-05T06:32:00.000Z",
};

const disabled=await buildD18StrategyActivationFrameV0_1(base);
assert.equal(disabled.baseline.state,"BASELINE_OPPORTUNITY_PRESENT");
assert.equal(disabled.challenger.state,"POLICY_DISABLED");
assert.equal(disabled.challenger.action,"SUPPRESS_STRATEGY_FOR_DATE");
assert.equal(disabled.challenger.opportunityCostOutcomeRequired,true);
assert.equal(disabled.costParity.identicalCostContract,true);
assert.equal(disabled.costParity.staticBaselineCostHash,disabled.costParity.challengerCostHash);
assert.equal(disabled.policyValueEstimated,false);
assert.equal(disabled.selectionImpact,false);

const replay=await buildD18StrategyActivationFrameV0_1(base);
assert.equal(replay.frameHash,disabled.frameHash);

const enabled=await buildD18StrategyActivationFrameV0_1({
  ...base,
  frameId:"D18-ACT-2",
  regimeVector:await regime("UP_TREND_CONTEXT"),
});
assert.equal(enabled.challenger.state,"POLICY_ENABLED");
assert.equal(enabled.challenger.action,"KEEP_STATIC_STRATEGY");

const naturalPair=await makePair(counts({REJECTED:10}));
const natural=await buildD18StrategyActivationFrameV0_1({
  ...base,
  frameId:"D18-ACT-3",
  ...naturalPair,
});
assert.equal(natural.baseline.state,"NATURAL_ZERO_PICK");
assert.equal(natural.challenger.state,"NATURAL_ZERO_PICK");
assert.equal(natural.challenger.policyDisabledCounterfactualEligible,false);
assert.equal(natural.baseline.zeroPickIsPolicyEffect,false);

const blockedPair=await makePair(counts({REJECTED:9,SOURCE_BLOCKED:1}));
const blocked=await buildD18StrategyActivationFrameV0_1({
  ...base,
  frameId:"D18-ACT-4",
  ...blockedPair,
});
assert.equal(blocked.baseline.state,"DATA_UNKNOWN");
assert.equal(blocked.challenger.state,"DATA_UNKNOWN");

const unknownRegime=await buildD18StrategyActivationFrameV0_1({
  ...base,
  frameId:"D18-ACT-5",
  regimeVector:await regime(null,"UNKNOWN"),
});
assert.equal(unknownRegime.challenger.state,"DATA_UNKNOWN");

const validRegimeForTamper=await regime("DOWN_TREND_CONTEXT");
const tamperedRegime={
  ...validRegimeForTamper,
  dimensions:{
    ...validRegimeForTamper.dimensions,
    trendContext:{
      ...validRegimeForTamper.dimensions.trendContext,
      value:"UP_TREND_CONTEXT",
    },
  },
};
const tamperedActivation=await buildD18StrategyActivationFrameV0_1({
  ...base,
  frameId:"D18-ACT-TAMPERED-REGIME",
  regimeVector:tamperedRegime,
});
assert.equal(tamperedActivation.regimeEvidenceValid,false);
assert.equal(tamperedActivation.challenger.state,"DATA_UNKNOWN");
assert.ok(tamperedActivation.regimeEvidenceBlockers.some((x)=>x.includes("DIMENSION_EVIDENCE_HASH_MISMATCH")));

const incompletePair=await makePair(
  counts({REJECTED:9}),
  {runState:"INCOMPLETE",completionRate:0.9,fingerprintState:"RUN_FINGERPRINT_INCOMPLETE"},
);
const incomplete=await buildD18StrategyActivationFrameV0_1({
  ...base,
  frameId:"D18-ACT-6",
  ...incompletePair,
});
assert.equal(incomplete.baseline.state,"DATA_UNKNOWN");
assert.equal(incomplete.challenger.state,"DATA_UNKNOWN");

await assert.rejects(
  ()=>buildD18StrategyActivationFrameV0_1({
    ...base,
    frameId:"D18-ACT-LATE-REG",
    registration:{
      ...registration,
      registeredAt:"2026-10-05T07:00:00.000Z",
      availableAt:"2026-10-05T07:00:00.000Z",
    },
  }),
  /post-decision/,
);

await assert.rejects(
  ()=>buildD18StrategyActivationFrameV0_1({
    ...base,
    frameId:"D18-ACT-BAD-HASH",
    registration:{...registration,parameterHash:"bad"},
  }),
  /parameterHash mismatch/,
);

await assert.rejects(
  ()=>buildD18StrategyActivationFrameV0_1({
    ...base,
    frameId:"D18-ACT-BAD-ACCOUNTING",
    shadowRunReceipt:{...base.shadowRunReceipt,warnings:["mutated"]},
  }),
  /shadow accounting hash mismatch/,
);

await assert.rejects(
  ()=>buildD18StrategyActivationFrameV0_1({
    ...base,
    frameId:"D18-ACT-LATE-COST",
    costContract:{...costContract,availableAt:"2026-10-05T07:00:00.000Z"},
  }),
  /costContract is post-decision/,
);

console.log("D18 strategy activation frame tests: PASS");

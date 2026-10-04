import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildD18StrategyWeightFrameV0_1 } from "../runtime/d18_strategy_weight_frame_v0_1.mjs";

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

async function pair(date,stateCounts) {
  const shadowRunReceipt={
    runId:"RUN-SM-"+date,
    marketDate:date,
    decisionTimestamp:date+"T06:30:00.000Z",
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    shadowSpecId:"SHADOW-SM-V0.1",
    universeVersion:"TW-EQUITY-V1",
    runState:"COMPLETE",
    baseUniverseCount:10,
    excludedCount:0,
    eligibleCount:10,
    accountedCount:10,
    completionRate:1,
    stateCounts,
    unaccountedSymbols:[],
    symbolAccounts:[],
    warnings:[],
    capturedAt:date+"T06:31:00.000Z",
  };
  const shadowAccountingHash=await sha256Hex(shadowRunReceipt);
  const fpBase={
    fingerprintId:"FP-SM-"+date,
    marketDate:date,
    decisionTimestamp:date+"T06:30:00.000Z",
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    shadowSpecId:"SHADOW-SM-V0.1",
    universeVersion:"TW-EQUITY-V1",
    sourceSessionHash:"source-"+date,
    shadowAccountingHash,
    decisionHashes:[],
    orderingHashes:[],
    rankingExperimentHashes:[],
    capacityHash:null,
    lifecycleHashes:[],
    runFingerprintState:"RUN_FINGERPRINT_COMPLETE",
    blockers:[],
    outcomeJoinEligible:true,
    capturedAt:date+"T06:31:00.000Z",
    schemaVersion:"S2_SHADOW_RUN_FINGERPRINT_V0_1",
  };
  return {
    shadowRunReceipt,
    runFingerprint:{...fpBase,runFingerprintHash:await sha256Hex(fpBase)},
  };
}

function regime(date,value,state="KNOWN") {
  return {
    vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
    marketDate:date,
    decisionTimestamp:date+"T06:30:00.000Z",
    pointInTimeEligible:true,
    receiptHash:"regime-"+date+"-"+String(value)+"-"+state,
    dimensions:{
      trendContext:{
        state,
        value:state==="KNOWN"?value:null,
        reason:state==="KNOWN"?null:"fixture unknown",
        sourceRef:"taiex",
      },
    },
  };
}

const params={
  regimeDimension:"trendContext",
  weightByValue:{
    UP_TREND_CONTEXT:1,
    RANGE_OR_MIXED:1,
    DOWN_TREND_CONTEXT:0.5,
  },
  unknownAction:"DATA_UNKNOWN",
  staticBaselineWeight:1,
  maxResearchWeight:1,
  leverageAllowed:false,
};
const registration={
  policyId:"D18-09-SHORT-MOMENTUM-DOWN-TREND-HALF-WEIGHT-V0_1",
  policyVersion:"0.1-RESEARCH",
  policyClass:"DISCRETE_REGIME_EXPOSURE_MULTIPLIER",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  state:"PREREGISTERED_SHADOW",
  parameters:params,
  parameterHash:await sha256Hex(params),
  registeredAt:"2026-10-04T06:40:00.000Z",
  availableAt:"2026-10-04T06:40:00.000Z",
};
const turnoverCostContract={
  version:"S2-RESEARCH-TURNOVER-COST-V0_1",
  availableAt:"2026-10-04T06:40:00.000Z",
  oneWayTurnoverCostRate:0.001,
  note:"research incremental policy-turnover cost only",
};

const sessions=["2026-10-05","2026-10-06","2026-10-07"];
const priorPair=await pair("2026-10-05",counts({QUALIFIED_NOT_SELECTED:2}));
const prior=await buildD18StrategyWeightFrameV0_1({
  frameId:"D18-WGT-PRIOR",
  ...priorPair,
  regimeVector:regime("2026-10-05","UP_TREND_CONTEXT"),
  registration,
  turnoverCostContract,
  priorWeightFrame:null,
  officialSessionDates:sessions,
  createdAt:"2026-10-05T06:32:00.000Z",
});
assert.equal(prior.challenger.state,"WEIGHT_ASSIGNED");
assert.equal(prior.challenger.researchWeight,1);
assert.equal(prior.turnover.state,"WARMUP_NO_PRIOR_FRAME");
assert.equal(prior.turnover.incrementalTurnoverCostRate,null);

const currentPair=await pair("2026-10-06",counts({QUALIFIED_NOT_SELECTED:3}));
const currentInput={
  frameId:"D18-WGT-CURRENT",
  ...currentPair,
  regimeVector:regime("2026-10-06","DOWN_TREND_CONTEXT"),
  registration,
  turnoverCostContract,
  priorWeightFrame:prior,
  officialSessionDates:sessions,
  createdAt:"2026-10-06T06:32:00.000Z",
};
const current=await buildD18StrategyWeightFrameV0_1(currentInput);
assert.equal(current.baseline.state,"BASELINE_OPPORTUNITY_PRESENT");
assert.equal(current.challenger.state,"WEIGHT_ASSIGNED");
assert.equal(current.challenger.researchWeight,0.5);
assert.equal(current.challenger.exposureDeltaVsStatic,-0.5);
assert.equal(current.turnover.state,"KNOWN");
assert.equal(current.turnover.policyTurnoverUnits,0.5);
assert.ok(Math.abs(current.turnover.incrementalTurnoverCostRate-0.0005)<1e-12);
assert.equal(current.challenger.capitalAmountAssigned,null);
assert.equal(current.capitalImpact,false);
assert.equal(current.weightOptimizedFromOutcome,false);

const replay=await buildD18StrategyWeightFrameV0_1(currentInput);
assert.equal(replay.frameHash,current.frameHash);

const rangePair=await pair("2026-10-07",counts({QUALIFIED_NOT_SELECTED:1}));
const range=await buildD18StrategyWeightFrameV0_1({
  frameId:"D18-WGT-RANGE",
  ...rangePair,
  regimeVector:regime("2026-10-07","RANGE_OR_MIXED"),
  registration,
  turnoverCostContract,
  priorWeightFrame:current,
  officialSessionDates:sessions,
  createdAt:"2026-10-07T06:32:00.000Z",
});
assert.equal(range.challenger.researchWeight,1);
assert.equal(range.turnover.policyTurnoverUnits,0.5);

const naturalPair=await pair("2026-10-06",counts({REJECTED:10}));
const natural=await buildD18StrategyWeightFrameV0_1({
  ...currentInput,
  frameId:"D18-WGT-NATURAL",
  ...naturalPair,
});
assert.equal(natural.baseline.state,"NATURAL_ZERO_PICK");
assert.equal(natural.challenger.state,"NATURAL_ZERO_PICK");
assert.equal(natural.challenger.researchWeight,null);
assert.equal(natural.turnover.state,"NOT_APPLICABLE");

const unknown=await buildD18StrategyWeightFrameV0_1({
  ...currentInput,
  frameId:"D18-WGT-UNKNOWN",
  regimeVector:regime("2026-10-06",null,"UNKNOWN"),
});
assert.equal(unknown.challenger.state,"DATA_UNKNOWN");
assert.equal(unknown.challenger.researchWeight,null);

await assert.rejects(
  ()=>buildD18StrategyWeightFrameV0_1({
    ...currentInput,
    frameId:"D18-WGT-GAP",
    officialSessionDates:["2026-10-04","2026-10-06","2026-10-07"],
  }),
  /not adjacent official session/,
);

await assert.rejects(
  ()=>buildD18StrategyWeightFrameV0_1({
    ...currentInput,
    frameId:"D18-WGT-BAD-PRIOR",
    priorWeightFrame:{
      ...prior,
      registration:{...prior.registration,parameterHash:"other"},
    },
  }),
  /prior weight frame parameter mismatch/,
);

await assert.rejects(
  ()=>buildD18StrategyWeightFrameV0_1({
    ...currentInput,
    frameId:"D18-WGT-LATE-REG",
    registration:{
      ...registration,
      registeredAt:"2026-10-06T07:00:00.000Z",
      availableAt:"2026-10-06T07:00:00.000Z",
    },
  }),
  /post-decision/,
);

await assert.rejects(
  ()=>buildD18StrategyWeightFrameV0_1({
    ...currentInput,
    frameId:"D18-WGT-LATE-COST",
    turnoverCostContract:{
      ...turnoverCostContract,
      availableAt:"2026-10-06T07:00:00.000Z",
    },
  }),
  /post-decision/,
);

const badParams={...params,weightByValue:{...params.weightByValue,DOWN_TREND_CONTEXT:1.2}};
const badParamsHash=await sha256Hex(badParams);
await assert.rejects(
  ()=>buildD18StrategyWeightFrameV0_1({
    ...currentInput,
    frameId:"D18-WGT-LEVERED",
    registration:{
      ...registration,
      parameters:badParams,
      parameterHash:badParamsHash,
    },
  }),
  /exceeds maxResearchWeight/,
);

console.log("D18 strategy weight frame tests: PASS");

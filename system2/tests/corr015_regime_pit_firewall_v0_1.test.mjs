import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildD18ObservableRegimeVectorV0_1,
  validateD18ObservableRegimeVectorV0_1,
} from "../runtime/d18_observable_regime_vector_v0_1.mjs";
import { buildD18StrategyActivationFrameV0_1 } from "../runtime/d18_strategy_activation_frame_v0_1.mjs";

const marketDate="2026-10-08";
const decisionTimestamp="2026-10-08T06:30:00.000Z";
const availableAt="2026-10-08T06:20:00.000Z";

async function withReceiptHash(base){
  return {...base,receiptHash:await sha256Hex(base)};
}
function withFeatureHash(base){
  return {...base,featureHash:createHash("sha256").update(JSON.stringify(base)).digest("hex")};
}
function without(obj,key){
  return Object.fromEntries(Object.entries(obj).filter(([k])=>k!==key));
}
async function receiptMutation(receipt,changes){
  return withReceiptHash({...without(receipt,"receiptHash"),...changes});
}

const taiexContext=await withReceiptHash({
  receiptId:"TAIEX-CORR015",
  sourceId:"A2_TAIEX_CLOSE",
  marketDate,
  decisionTimestamp,
  state:"KNOWN",
  pointInTimeEligible:true,
  availableAt,
  historyWindowHash:"a".repeat(64),
  officialSessionWindowHash:"b".repeat(64),
  trendContext:"UP_TREND_CONTEXT",
  volatilityDirection:"VOL_CONTRACTING",
  metrics:{
    close:25000,
    ma20:24500,
    ma20Slope5:100,
    return20:0.03,
    realizedVol5:0.008,
    realizedVol20:0.012,
    volRatio5to20:2/3,
  },
});

const directionBreadth=withFeatureHash({
  featureId:"D18.DIRECTION_BREADTH",
  version:"0.1-RESEARCH",
  marketDate,
  decisionTimestamp,
  availableAt,
  pointInTimeEligible:true,
  state:"KNOWN",
  sourceBatchId:"A1-CORR015",
  sourceBatchHash:"c".repeat(64),
  total:{
    advanceShareKnown:0.55,
    declineShareKnown:0.40,
    flatShareKnown:0.05,
    netBreadthShareKnown:0.15,
    comparableCoveragePct:0.98,
    notComparablePct:0.01,
    unknownPct:0.01,
  },
  byMarket:{
    TWSE:{advanceShareKnown:0.54},
    TPEX:{advanceShareKnown:0.57},
  },
});

const core={
  marketDate,
  decisionTimestamp,
  taiexContext,
  directionBreadth,
};

const specs=[
  {
    inputKey:"activityContext",
    dimension:"activityDirection",
    expectedState:"KNOWN",
    tag:"ACTIVITY_CONTEXT",
    valid:()=>withReceiptHash({
      receiptId:"ACTIVITY-CORR015",marketDate,decisionTimestamp,state:"KNOWN",
      pointInTimeEligible:true,availableAt,totalTradeValueVs20D:1.12,
    }),
    tamper:(r)=>({...r,totalTradeValueVs20D:0.88}),
  },
  {
    inputKey:"concentrationContext",
    dimension:"concentrationContext",
    expectedState:"CONTEXT_RAW",
    tag:"CONCENTRATION_CONTEXT",
    valid:()=>withReceiptHash({
      receiptId:"CONC-CORR015",marketDate,decisionTimestamp,state:"KNOWN",
      pointInTimeEligible:true,availableAt,
      top10TradeValueShare:0.30,top20TradeValueShare:0.45,returnDispersion:0.02,
    }),
    tamper:(r)=>({...r,top10TradeValueShare:0.99}),
  },
  {
    inputKey:"institutionalContext",
    dimension:"institutionalContext",
    expectedState:"CONTEXT_RAW",
    tag:"INSTITUTIONAL_CONTEXT",
    valid:()=>withReceiptHash({
      receiptId:"INST-CORR015",marketDate,decisionTimestamp,state:"KNOWN",
      pointInTimeEligible:true,availableAt,foreignNet:100,trustNet:-20,dealerNet:5,
    }),
    tamper:(r)=>({...r,foreignNet:999999}),
  },
  {
    inputKey:"sizeLeadership",
    dimension:"sizeLeadership",
    expectedState:"KNOWN",
    tag:"SIZE_LEADERSHIP",
    valid:()=>withReceiptHash({
      receiptId:"SIZE-CORR015",marketDate,decisionTimestamp,state:"KNOWN",
      pointInTimeEligible:true,availableAt,value:"LARGE_CAP_LED",
    }),
    tamper:(r)=>({...r,value:"SMALL_CAP_LED"}),
  },
  {
    inputKey:"globalTransmission",
    dimension:"globalTransmission",
    expectedState:"KNOWN",
    tag:"GLOBAL_TRANSMISSION",
    valid:()=>withReceiptHash({
      receiptId:"GLOBAL-CORR015",marketDate,decisionTimestamp,state:"KNOWN",
      pointInTimeEligible:true,availableAt,value:"RISK_ON",
    }),
    tamper:(r)=>({...r,value:"RISK_OFF"}),
  },
  {
    inputKey:"sectorRotation",
    dimension:"sectorRotationContext",
    expectedState:"CONTEXT_RAW",
    tag:"SECTOR_ROTATION",
    valid:()=>withReceiptHash({
      receiptId:"SECTOR-CORR015",marketDate,priorMarketDate:"2026-10-07",
      decisionTimestamp,state:"KNOWN",pointInTimeEligible:true,availableAt,
      commonIndustryCount:1,
      industries:[{industryKey:"TWSE:電子",currentRank:1,priorRank:2,rankImprovement:1}],
    }),
    tamper:(r)=>({...r,commonIndustryCount:99}),
  },
];

let receiptCounter=0;
async function vectorWith(spec,receipt){
  receiptCounter+=1;
  return buildD18ObservableRegimeVectorV0_1({
    receiptId:`CORR015-VECTOR-${receiptCounter}`,
    ...core,
    [spec.inputKey]:receipt,
  });
}

for(const spec of specs){
  const validReceipt=await spec.valid();
  const validVector=await vectorWith(spec,validReceipt);
  const validDimension=validVector.dimensions[spec.dimension];
  assert.equal(validDimension.state,spec.expectedState,`${spec.inputKey} valid state`);
  assert.equal(validDimension.pointInTimeEligible,true,`${spec.inputKey} PIT eligible`);
  assert.equal(validDimension.sourceHashVerified,true,`${spec.inputKey} component hash verified`);
  assert.equal((await validateD18ObservableRegimeVectorV0_1(validVector)).valid,true);

  const cases=[
    {
      name:"future-date",
      receipt:await receiptMutation(validReceipt,{
        marketDate:"2030-01-01",
        decisionTimestamp:"2030-01-01T06:30:00.000Z",
        availableAt:"2030-01-01T06:20:00.000Z",
      }),
      blocker:spec.tag+"_MARKET_DATE_MISMATCH",
    },
    {
      name:"wrong-clock",
      receipt:await receiptMutation(validReceipt,{
        decisionTimestamp:"2026-10-08T06:31:00.000Z",
      }),
      blocker:spec.tag+"_DECISION_CLOCK_MISMATCH",
    },
    {
      name:"non-pit",
      receipt:await receiptMutation(validReceipt,{pointInTimeEligible:false}),
      blocker:spec.tag+"_PIT_INELIGIBLE",
    },
    {
      name:"missing-available-at",
      receipt:await withReceiptHash(without(without(validReceipt,"receiptHash"),"availableAt")),
      blocker:spec.tag+"_AVAILABLE_AT_MISSING_OR_INVALID",
    },
    {
      name:"missing-hash",
      receipt:without(validReceipt,"receiptHash"),
      blocker:spec.tag+"_SOURCE_HASH_MISSING_OR_INVALID",
    },
    {
      name:"tampered-receipt",
      receipt:spec.tamper(validReceipt),
      blocker:spec.tag+"_SOURCE_HASH_MISMATCH",
    },
  ];

  for(const testCase of cases){
    const vector=await vectorWith(spec,testCase.receipt);
    const dimension=vector.dimensions[spec.dimension];
    assert.equal(dimension.state,"UNKNOWN",`${spec.inputKey}/${testCase.name} must be UNKNOWN`);
    assert.equal(dimension.pointInTimeEligible,false,`${spec.inputKey}/${testCase.name} must not be PIT eligible`);
    assert.ok(
      dimension.blockerCodes.includes(testCase.blocker),
      `${spec.inputKey}/${testCase.name} missing blocker ${testCase.blocker}: ${dimension.blockerCodes.join(",")}`,
    );
    const validation=await validateD18ObservableRegimeVectorV0_1(vector);
    assert.equal(validation.valid,true,`${spec.inputKey}/${testCase.name} final vector must be internally hash-valid`);
  }
}

// AP-07: future/non-PIT global context must become UNKNOWN and cannot activate/deactivate.
const validGlobal=await specs.find((x)=>x.inputKey==="globalTransmission").valid();
const ap07Global=await receiptMutation(validGlobal,{
  marketDate:"2030-01-01",
  decisionTimestamp:"2030-01-01T06:30:00.000Z",
  availableAt:"2030-01-01T06:20:00.000Z",
  pointInTimeEligible:false,
});
const globalSpec=specs.find((x)=>x.inputKey==="globalTransmission");
const ap07Vector=await vectorWith(globalSpec,ap07Global);
assert.equal(ap07Vector.dimensions.globalTransmission.state,"UNKNOWN");
assert.equal(ap07Vector.dimensions.globalTransmission.pointInTimeEligible,false);
assert.equal((await validateD18ObservableRegimeVectorV0_1(ap07Vector)).valid,true);

function counts(overrides={}){
  return {
    SELECTED:0,QUALIFIED_NOT_SELECTED:0,WATCH:0,REJECTED:0,INCOMPLETE:0,
    SOURCE_BLOCKED:0,SESSION_INVALID:0,NOT_APPLICABLE:0,ERROR:0,...overrides,
  };
}
const shadowRunReceipt={
  runId:"RUN-CORR015",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"SHADOW-SM-V0.1",
  universeVersion:"TW-EQUITY-V1",
  runState:"COMPLETE",
  baseUniverseCount:1,
  excludedCount:0,
  eligibleCount:1,
  accountedCount:1,
  completionRate:1,
  stateCounts:counts({QUALIFIED_NOT_SELECTED:1}),
  unaccountedSymbols:[],
  symbolAccounts:[],
  warnings:[],
  capturedAt:"2026-10-08T06:31:00.000Z",
};
const shadowAccountingHash=await sha256Hex(shadowRunReceipt);
const fingerprintBase={
  fingerprintId:"FP-CORR015",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"SHADOW-SM-V0.1",
  universeVersion:"TW-EQUITY-V1",
  sourceSessionHash:"d".repeat(64),
  shadowAccountingHash,
  decisionHashes:[],
  orderingHashes:[],
  rankingExperimentHashes:[],
  capacityHash:null,
  lifecycleHashes:[],
  runFingerprintState:"RUN_FINGERPRINT_COMPLETE",
  blockers:[],
  outcomeJoinEligible:true,
  capturedAt:"2026-10-08T06:31:00.000Z",
  schemaVersion:"S2_SHADOW_RUN_FINGERPRINT_V0_1",
};
const runFingerprint={...fingerprintBase,runFingerprintHash:await sha256Hex(fingerprintBase)};

const parameters={
  regimeDimension:"globalTransmission",
  disabledValues:["RISK_OFF"],
  unknownAction:"DATA_UNKNOWN",
  nonDisabledAction:"KEEP_STATIC_BASELINE",
};
const registration={
  policyId:"CORR015-GLOBAL-ACTIVATION",
  policyVersion:"0.1-RESEARCH",
  policyClass:"BINARY_ACTIVATION_DEACTIVATION",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  state:"PREREGISTERED_SHADOW",
  parameters,
  parameterHash:await sha256Hex(parameters),
  registeredAt:"2026-10-07T06:00:00.000Z",
  availableAt:"2026-10-07T06:00:00.000Z",
};
const costContract={
  version:"S2-RESEARCH-COST-V0_1",
  availableAt:"2026-10-07T06:00:00.000Z",
  roundTripCostRate:0.004,
  note:"fixture",
};

const activation=await buildD18StrategyActivationFrameV0_1({
  frameId:"CORR015-ACTIVATION",
  shadowRunReceipt,
  runFingerprint,
  regimeVector:ap07Vector,
  registration,
  costContract,
  createdAt:"2026-10-08T06:32:00.000Z",
});
assert.equal(activation.regimeEvidenceValid,true);
assert.equal(activation.regimeState,"UNKNOWN");
assert.equal(activation.challenger.state,"DATA_UNKNOWN");
assert.equal(activation.challenger.action,"ABSTAIN_DATA_UNKNOWN");
assert.notEqual(activation.challenger.state,"POLICY_ENABLED");
assert.notEqual(activation.challenger.state,"POLICY_DISABLED");

console.log("CORR-015 Regime PIT firewall adversarial tests PASS");

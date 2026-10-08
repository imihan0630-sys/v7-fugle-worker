import assert from "node:assert/strict";
import {
  sha256,
  buildDynamicWeightFrame,
  buildDrawdownDeriskFrame,
} from "../research/d18_policy_transform_l3_v0_1.mjs";

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("PASS", name);
  } catch (err) {
    console.error("FAIL", name, err?.stack || err);
    process.exitCode = 1;
  }
}
function throws(name, fn, pattern) {
  test(name, () => assert.throws(fn, pattern));
}

const decisionTimestamp="2026-10-08T06:10:00.000Z";
const strategyDay={
  marketDate:"2026-10-08",
  decisionTimestamp,
  frameHash:"a".repeat(64),
};
const regimeVector={
  marketDate:"2026-10-08",
  decisionTimestamp,
  pointInTimeEligible:true,
  vectorHash:"b".repeat(64),
  vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1",
  dimensions:{trendContext:{state:"KNOWN",value:"UP_TREND_CONTEXT"}},
};
const expectedStrategies=["SHORT_MOMENTUM","SWING_GROWTH"];
const staticWeights={SHORT_MOMENTUM:0.5,SWING_GROWTH:0.5};
const discreteWeightMap={
  UP_TREND_CONTEXT:{SHORT_MOMENTUM:0.7,SWING_GROWTH:0.3},
  DOWN_TREND_CONTEXT:{SHORT_MOMENTUM:0.3,SWING_GROWTH:0.7},
};
const dynamicParamHash=sha256({
  policyClass:"DISCRETE_DYNAMIC_WEIGHTING",
  regimeDimension:"trendContext",
  expectedStrategies:[...expectedStrategies].sort(),
  staticWeights,
  discreteWeightMap,
});
const dynamicRegistration={
  state:"PREREGISTERED_SHADOW",
  policyClass:"DISCRETE_DYNAMIC_WEIGHTING",
  parameterHash:dynamicParamHash,
  registeredAt:"2026-10-08T05:00:00.000Z",
  availableAt:"2026-10-08T05:01:00.000Z",
  registrationHash:"c".repeat(64),
  outcomeSelected:false,
};
const costContract={
  version:"COST_V0_1",
  costHash:"d".repeat(64),
  roundTripCostRate:0.003,
  availableAt:"2026-10-08T05:30:00.000Z",
};

function dyn(overrides={}) {
  return buildDynamicWeightFrame({
    strategyDay,
    regimeVector,
    registration:dynamicRegistration,
    costContract,
    expectedStrategies,
    staticWeights,
    discreteWeightMap,
    regimeDimension:"trendContext",
    ...overrides,
  });
}

test("DW-T01 known preregistered regime produces deterministic discrete weights",()=>{
  const a=dyn(), b=dyn();
  assert.equal(a.disposition,"POLICY_WEIGHT_DEFINED");
  assert.deepEqual(a.dynamicWeights,{SHORT_MOMENTUM:0.7,SWING_GROWTH:0.3});
  assert.equal(a.outcomeAccessed,false);
  assert.equal(a.policyValueEvaluated,false);
  assert.equal(a.frameHash,b.frameHash);
});
test("DW-T02 unknown regime fails closed",()=>{
  const x=dyn({regimeVector:{...regimeVector,dimensions:{trendContext:{state:"UNKNOWN",value:null}}}});
  assert.equal(x.disposition,"DATA_UNKNOWN");
  assert.equal(x.dynamicWeights,null);
});
test("DW-T03 unmapped known regime fails closed",()=>{
  const x=dyn({regimeVector:{...regimeVector,dimensions:{trendContext:{state:"KNOWN",value:"TRANSITION"}}}});
  assert.equal(x.disposition,"DATA_UNKNOWN");
});
throws("DW-T04 post-decision registration rejected",()=>dyn({registration:{...dynamicRegistration,registeredAt:"2026-10-08T06:11:00.000Z"}}),/REGISTRATION_AFTER_DECISION/);
throws("DW-T05 post-decision cost rejected",()=>dyn({costContract:{...costContract,availableAt:"2026-10-08T06:11:00.000Z"}}),/COST_AFTER_DECISION/);
throws("DW-T06 outcome-selected policy rejected",()=>dyn({registration:{...dynamicRegistration,outcomeSelected:true}}),/OUTCOME_SELECTED_POLICY_FORBIDDEN/);
throws("DW-T07 parameter mutation rejected",()=>dyn({registration:{...dynamicRegistration,parameterHash:"e".repeat(64)}}),/PARAMETER_HASH_MISMATCH/);
throws("DW-T08 non-unit static weights rejected",()=>dyn({staticWeights:{SHORT_MOMENTUM:0.8,SWING_GROWTH:0.8}}),/WEIGHTS_MUST_SUM_TO_ONE/);
throws("DW-T09 dynamic strategy-set mismatch rejected",()=>dyn({discreteWeightMap:{UP_TREND_CONTEXT:{SHORT_MOMENTUM:1},DOWN_TREND_CONTEXT:{SHORT_MOMENTUM:1}}}),/PARAMETER_HASH_MISMATCH|WEIGHT_STRATEGY_SET_MISMATCH/);
throws("DW-T10 regime date mismatch rejected",()=>dyn({regimeVector:{...regimeVector,marketDate:"2026-10-07"}}),/REGIME_MARKET_DATE_MISMATCH/);
throws("DW-T11 non-PIT regime rejected",()=>dyn({regimeVector:{...regimeVector,pointInTimeEligible:false}}),/REGIME_NOT_PIT_ELIGIBLE/);

const drawdownRules=[
  {drawdownLte:-0.10,exposure:0.5},
  {drawdownLte:-0.05,exposure:0.75},
];
const drawdownParamHash=sha256({
  policyClass:"DRAWDOWN_DERISKING",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  rules:drawdownRules,
  fallbackExposure:1,
});
const ddRegistration={
  state:"PREREGISTERED_SHADOW",
  policyClass:"DRAWDOWN_DERISKING",
  parameterHash:drawdownParamHash,
  registeredAt:"2026-10-08T05:00:00.000Z",
  availableAt:"2026-10-08T05:01:00.000Z",
  registrationHash:"f".repeat(64),
  outcomeSelected:false,
  rules:drawdownRules,
  fallbackExposure:1,
};
const priorReturns=[
 {decisionId:"D1",marketDate:"2026-10-01",outcomeUpdatedAt:"2026-10-02T02:00:00.000Z",attributionReceiptHash:"1".repeat(64),state:"MATURED",netReturn:0.10},
 {decisionId:"D2",marketDate:"2026-10-02",outcomeUpdatedAt:"2026-10-03T02:00:00.000Z",attributionReceiptHash:"2".repeat(64),state:"MATURED",netReturn:-0.08},
 {decisionId:"D3",marketDate:"2026-10-03",outcomeUpdatedAt:"2026-10-06T02:00:00.000Z",attributionReceiptHash:"3".repeat(64),state:"MATURED",netReturn:-0.04},
];
function dd(overrides={}) {
 return buildDrawdownDeriskFrame({
  marketDate:"2026-10-08",
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  historyCoverageState:"COMPLETE",
  unresolvedPriorDecisionCount:0,
  priorReturns,
  registration:ddRegistration,
  costContract,
  ...overrides,
 });
}

test("DD-T01 complete past-only history produces deterministic exposure",()=>{
 const a=dd(), b=dd();
 assert.equal(a.disposition,"POLICY_EXPOSURE_DEFINED");
 assert.equal(a.challengerExposure,0.5);
 assert.ok(a.currentDrawdown < -0.10);
 assert.equal(a.frameHash,b.frameHash);
 assert.equal(a.priorMaturedOutcomeHistoryConsumed,true);\n assert.equal(a.currentOrFutureOutcomeAccessed,false);
});
test("DD-T02 incomplete history coverage fails closed",()=>{
 const x=dd({historyCoverageState:"PARTIAL"});
 assert.equal(x.disposition,"DATA_UNKNOWN");
 assert.equal(x.challengerExposure,null);
});
test("DD-T03 unresolved prior decision fails closed",()=>{
 const x=dd({unresolvedPriorDecisionCount:1});
 assert.equal(x.disposition,"DATA_UNKNOWN");
});
throws("DD-T04 immature prior outcome rejected",()=>dd({priorReturns:[{...priorReturns[0],state:"IMMATURE"}]}),/PRIOR_RETURN_NOT_MATURED/);
throws("DD-T05 future-updated prior outcome rejected",()=>dd({priorReturns:[{...priorReturns[0],outcomeUpdatedAt:"2026-10-08T06:11:00.000Z"}]}),/PRIOR_RETURN_AFTER_DECISION/);
throws("DD-T06 same-day return rejected as non-prior",()=>dd({priorReturns:[{...priorReturns[0],marketDate:"2026-10-08"}]}),/PRIOR_RETURN_NOT_PRIOR_DATE/);
throws("DD-T07 duplicate decision rejected",()=>dd({priorReturns:[priorReturns[0],{...priorReturns[0],marketDate:"2026-10-02"}]}),/DUPLICATE_PRIOR_DECISION/);
throws("DD-T08 missing attribution lineage rejected",()=>dd({priorReturns:[{...priorReturns[0],attributionReceiptHash:null}]}),/PRIOR_RETURN_IDENTITY_INCOMPLETE/);
throws("DD-T09 post-decision registration rejected",()=>dd({registration:{...ddRegistration,availableAt:"2026-10-08T06:11:00.000Z"}}),/REGISTRATION_NOT_AVAILABLE/);
throws("DD-T10 parameter mutation rejected",()=>dd({registration:{...ddRegistration,parameterHash:"0".repeat(64)}}),/PARAMETER_HASH_MISMATCH/);
throws("DD-T11 outcome-selected rule rejected",()=>dd({registration:{...ddRegistration,outcomeSelected:true}}),/OUTCOME_SELECTED_POLICY_FORBIDDEN/);
test("DD-T12 shallower drawdown maps to preregistered intermediate exposure",()=>{
 const x=dd({priorReturns:[
  {...priorReturns[0],netReturn:0.05},
  {...priorReturns[1],netReturn:-0.06},
 ]});
 assert.equal(x.challengerExposure,0.75);
});
test("DD-T13 no drawdown breach preserves full exposure",()=>{
 const x=dd({priorReturns:[
  {...priorReturns[0],netReturn:0.02},
  {...priorReturns[1],netReturn:0.01},
 ]});
 assert.equal(x.challengerExposure,1);
});
test("DD-T14 input order cannot change replay identity",()=>{
 const a=dd();
 const b=dd({priorReturns:[priorReturns[2],priorReturns[0],priorReturns[1]]});
 assert.equal(a.priorEvidenceHash,b.priorEvidenceHash);
 assert.equal(a.frameHash,b.frameHash);
});

if (process.exitCode) process.exit(process.exitCode);
console.log(`D18 policy-transform L3 falsification suite PASS: ${passed} tests`);

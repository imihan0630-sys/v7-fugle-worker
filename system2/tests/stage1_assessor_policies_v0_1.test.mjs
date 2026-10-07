import assert from "node:assert/strict";
import {
  STAGE1_ASSESSOR_POLICIES_V0_1,
  assessStage1StrategyV0_1,
} from "../runtime/stage1_assessor_policies_v0_1.mjs";
import {
  SHORT_MOMENTUM_CONTRACT_V0_1,
  SWING_GROWTH_CONTRACT_V0_1,
} from "../runtime/strategy_contracts_v0_1.mjs";
import { buildStrategyStateAssessment } from "../runtime/strategy_evaluator.mjs";

function known(factorId, rawValue) {
  return { factorId, state: "KNOWN", rawValue };
}
function unknown(factorId) {
  return { factorId, state: "UNKNOWN", rawValue: null };
}
function supportiveExternal() {
  return { observationState:"KNOWN", thesisState:"SUPPORTIVE", reasons:["PIT_FIXTURE"], warnings:[] };
}

const supportiveBundle={
  coreMetrics:{
    close:110, high:112, priorHigh20:108, priorLow20:92,
  },
  factorObservations:[
    known("TECH.TREND",{maOrder5gt10gt20:true,ma20Slope1Pct:0.01,ret20:0.08}),
    known("TECH.STRUCTURE",{distanceToMa20:0.05}),
    known("PV.RELATIVE_VOLUME",{relativeVolume20Prior:1.2}),
    known("PV.ACCEPTANCE",{distanceToPriorHigh20:0.018}),
    known("PV.RESPONSE",{ret20:0.08}),
    known("RISK.LIQUIDITY",{avgVolume20PriorLots:1200,avgAmount20Prior:300000000}),
    known("RISK.EXTENSION",{distanceToMa20:0.05}),
  ],
};

const sm=assessStage1StrategyV0_1({strategyId:"SHORT_MOMENTUM",factorBundle:supportiveBundle});
assert.equal(sm.familyAssessments.TECHNICAL_STRUCTURE.thesisState,"SUPPORTIVE");
assert.equal(sm.familyAssessments.PRICE_VOLUME.thesisState,"SUPPORTIVE");
assert.equal(sm.familyAssessments.RISK_FRICTION.thesisState,"NEUTRAL");
assert.equal(sm.entryReadiness,"BUY_ELIGIBLE");
assert.deepEqual(sm.activeHardInvalidationIds,[]);
const smState=buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1,sm);
assert.equal(smState.strategyValidity,"VALID");
assert.equal(smState.entryReadiness,"BUY_ELIGIBLE");

const missing={
  ...supportiveBundle,
  factorObservations:supportiveBundle.factorObservations.map(x=>
    x.factorId==="PV.RELATIVE_VOLUME"?unknown("PV.RELATIVE_VOLUME"):x
  ),
};
const smMissing=assessStage1StrategyV0_1({strategyId:"SHORT_MOMENTUM",factorBundle:missing});
assert.equal(smMissing.familyAssessments.PRICE_VOLUME.observationState,"UNKNOWN");
const smMissingState=buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1,smMissing);
assert.equal(smMissingState.strategyValidity,"INCOMPLETE");
assert.equal(smMissingState.entryReadiness,"BLOCKED");

const failedBreakout={
  ...supportiveBundle,
  coreMetrics:{...supportiveBundle.coreMetrics,high:112,close:106,priorHigh20:108,priorLow20:92},
};
const smFailed=assessStage1StrategyV0_1({strategyId:"SHORT_MOMENTUM",factorBundle:failedBreakout});
assert.ok(smFailed.activeHardInvalidationIds.includes("FAILED_BREAKOUT"));
const smFailedState=buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1,smFailed);
assert.equal(smFailedState.strategyValidity,"INVALIDATED");
assert.equal(smFailedState.entryReadiness,"BLOCKED");

const sgMissing=assessStage1StrategyV0_1({
  strategyId:"SWING_GROWTH",
  factorBundle:supportiveBundle,
});
assert.equal(sgMissing.familyAssessments.INDUSTRY_THESIS.observationState,"UNKNOWN");
assert.equal(sgMissing.familyAssessments.FUNDAMENTAL_QUALITY.observationState,"UNKNOWN");
const sgMissingState=buildStrategyStateAssessment(SWING_GROWTH_CONTRACT_V0_1,sgMissing);
assert.equal(sgMissingState.strategyValidity,"INCOMPLETE");
assert.equal(sgMissingState.entryReadiness,"BLOCKED");

const sgReady=assessStage1StrategyV0_1({
  strategyId:"SWING_GROWTH",
  factorBundle:supportiveBundle,
  externalFamilyAssessments:{
    INDUSTRY_THESIS:supportiveExternal(),
    FUNDAMENTAL_QUALITY:supportiveExternal(),
  },
});
assert.equal(sgReady.entryReadiness,"BUY_ELIGIBLE");
const sgReadyState=buildStrategyStateAssessment(SWING_GROWTH_CONTRACT_V0_1,sgReady);
assert.equal(sgReadyState.strategyValidity,"VALID");
assert.equal(sgReadyState.entryReadiness,"BUY_ELIGIBLE");

assert.notEqual(
  STAGE1_ASSESSOR_POLICIES_V0_1.SHORT_MOMENTUM.assessorPolicyId,
  STAGE1_ASSESSOR_POLICIES_V0_1.SWING_GROWTH.assessorPolicyId,
);
for(const p of Object.values(STAGE1_ASSESSOR_POLICIES_V0_1)){
  assert.equal(p.state,"READY");
  assert.ok(p.rules.includes("NO_WEIGHTED_TOTAL_SCORE"));
}
assert.ok(STAGE1_ASSESSOR_POLICIES_V0_1.SHORT_MOMENTUM.rules.includes("NO_OUTCOME_TUNED_NUMERIC_THRESHOLD"));
assert.ok(STAGE1_ASSESSOR_POLICIES_V0_1.SWING_GROWTH.rules.includes("NO_RAW_FUNDAMENTAL_PROXY_IMPUTATION"));

console.log("System2 Stage-1 assessor policy V0.1 tests PASS");

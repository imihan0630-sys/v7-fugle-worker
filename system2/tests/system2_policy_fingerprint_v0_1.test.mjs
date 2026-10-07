import assert from "node:assert/strict";
import {
  buildSystem2StrategyPolicyFingerprintV0_1,
  buildStage1System2PolicyFingerprintSetV0_1,
  system2PolicyFingerprintSourceArtifactsV0_1,
} from "../runtime/system2_policy_fingerprint_v0_1.mjs";

const generatedA="2026-10-07T01:10:00.000Z";
const generatedB="2026-10-07T01:11:00.000Z";
const sm=await buildSystem2StrategyPolicyFingerprintV0_1({
  strategyId:"SHORT_MOMENTUM",generatedAt:generatedA,
});
const sg=await buildSystem2StrategyPolicyFingerprintV0_1({
  strategyId:"SWING_GROWTH",generatedAt:generatedA,
});
const smLater=await buildSystem2StrategyPolicyFingerprintV0_1({
  strategyId:"SHORT_MOMENTUM",generatedAt:generatedB,
});

for(const x of [sm,sg]){
  assert.equal(x.schemaVersion,"CROSS_SYSTEM_POLICY_FINGERPRINT_RECEIPT_V0_1");
  assert.equal(x.systemId,"SYSTEM2");
  assert.match(x.fingerprintHash,/^[a-f0-9]{64}$/);
  assert.equal(x.authorityState,"RESEARCH_SHADOW");
  assert.equal(x.candidateUniverseMode,"NOT_PHYSICALLY_PROVEN");
  assert.equal(x.requiresOtherSystemCandidateOutput,false);
  assert.equal(x.requiresOtherSystemRankOutput,false);
  assert.equal(x.rankingPolicy.rankingMechanism,"STRATEGY_LOCAL_PARETO");
  assert.equal(x.capacityPolicy.globalMax,12);
  assert.equal(x.capacityPolicy.perStrategyActiveMonitorMax,3);
  assert.equal(x.capacityPolicy.forcedFill,false);
  assert.equal(x.capacityPolicy.implicitGlobalUniversalScore,false);
  assert.equal(x.capacityPolicy.crossStrategyGlobalPriorityState,"UNRESOLVED_FAIL_CLOSED");
  assert.equal(x.entryConfirmationPolicy.system1Formal15mGateRequired,false);
  assert.equal(x.entryConfirmationPolicy.finalSelectionAuthority,false);
  assert.equal(x.formalMutation,false);
}
assert.equal(sm.strategyId,"SHORT_MOMENTUM");
assert.equal(sm.strategyVersion,"V0.1-CONTRACT");
assert.equal(sm.policyId,"S2-ASSESSOR-SM-LAUNCH-001");
assert.deepEqual(sm.primaryHorizonSessions,[1,3,5,10]);
assert.deepEqual(sm.requiredEvidenceFamilies,["TECHNICAL_STRUCTURE","PRICE_VOLUME","RISK_FRICTION"]);
assert.equal(sm.rankingPolicy.rankingPolicyId,"SM-PARETO-BASELINE");

assert.equal(sg.strategyId,"SWING_GROWTH");
assert.equal(sg.strategyVersion,"V0.1-CONTRACT");
assert.equal(sg.policyId,"S2-ASSESSOR-SG-LAUNCH-001");
assert.deepEqual(sg.primaryHorizonSessions,[10,20,40,60]);
assert.deepEqual(sg.requiredEvidenceFamilies,["INDUSTRY_THESIS","FUNDAMENTAL_QUALITY"]);
assert.equal(sg.rankingPolicy.rankingPolicyId,"SG-PARETO-BASELINE");

assert.notEqual(sm.fingerprintId,sg.fingerprintId);
assert.notEqual(sm.fingerprintHash,sg.fingerprintHash);
assert.notEqual(sm.policyId,sg.policyId);
assert.notEqual(sm.rankingPolicy.rankingPolicyId,sg.rankingPolicy.rankingPolicyId);

// generatedAt is observability metadata and deliberately excluded from policy identity.
assert.equal(sm.fingerprintHash,smLater.fingerprintHash);
assert.notEqual(sm.generatedAt,smLater.generatedAt);

const sourceArtifacts=system2PolicyFingerprintSourceArtifactsV0_1();
assert.equal(sourceArtifacts.length,11);
assert.equal(new Set(sourceArtifacts.map(x=>x.path)).size,11);
assert.ok(sourceArtifacts.every(x=>/^[a-f0-9]{40,64}$/.test(x.contentSha)));

const set=await buildStage1System2PolicyFingerprintSetV0_1({generatedAt:generatedA});
assert.equal(set.fingerprints.length,2);
assert.equal(set.sda022.S22_T06,true);
assert.equal(set.sda022.S22_T07,true);
assert.equal(set.sda022.S22_T08,true);
assert.equal(set.sda022.S22_T09,true);
assert.equal(set.sda022.S22_T10,true);
assert.equal(set.sda022.physicalIndependentDiscovery,false);
assert.equal(set.sda022.ncT01Required,true);
assert.equal(set.finalSelectionEnabled,false);
assert.equal(set.livePushEnabled,false);
assert.equal(set.capitalImpact,false);
assert.equal(set.orderImpact,false);
assert.equal(set.system1RuntimeUsed,false);

await assert.rejects(
  ()=>buildSystem2StrategyPolicyFingerprintV0_1({strategyId:"UNKNOWN",generatedAt:generatedA}),
  /unsupported System2 fingerprint strategy/,
);

console.log("SDA-022 System2 policy fingerprint S22-T06~T10 tests PASS");

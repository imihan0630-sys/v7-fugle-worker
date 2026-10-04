import assert from 'node:assert/strict';
import {buildSystem1FirstFailureMaskingAudit as audit} from '../research/system1_first_failure_masking_audit_v0_1.mjs';

const gates=(fails=[])=>Object.fromEntries([
  'PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','MARKET_CAP_FLOOR','DAILY_ABNORMALITY','LIQUIDITY',
  'SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY','CHIP_CONCENTRATION_PRESENT','FINANCIAL_SOURCE_COMPLETENESS',
  'ANNOUNCEMENT_RISK','VALUATION_RELATIVE_RISK','SECTOR_GATE','AB_SETUP','FUNDAMENTAL_COMPONENT_COUNT',
  'FUNDAMENTAL_QUALITY','ATR_QUALITY','TARGET_AVAILABLE','REWARD_RISK','FINAL_SIGNAL_GRADE'
].map(id=>[id,{status:fails.includes(id)?'FAIL':'PASS'}]));
const obs=(symbol,reason,fails,ok=false)=>({symbol,pool:'GENERAL',firstFailureReason:reason,formalResult:{ok},gates:gates(fails)});
const diagnosis={
  schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',sessionDate:'2026-10-05',
  researchOnly:true,decisionImpact:false,formalCoreImpact:false,
  observations:[
    obs('A','20日流動性不足',['LIQUIDITY','SECTOR_GATE']),
    obs('B','產業廣度、漲幅或資金活躍度偏弱',['SECTOR_GATE']),
    obs('C','A拉回承接/B突破後承接皆未形成候選',['AB_SETUP','TARGET_AVAILABLE']),
    obs('D','NEW_UNKNOWN_REASON',['ATR_QUALITY']),
    obs('UP','HISTORY_OR_FEATURE_ADMISSION_BLOCKED',['HISTORY_60D']),
    obs('E',null,[],true)
  ]
};
const x=audit(diagnosis);
assert.equal(x.formalRejectedN,5);
assert.equal(x.scoreCandidateReasonScopeN,4);
assert.equal(x.outsideScoreCandidateReasonScopeN,1);
assert.equal(x.mappedFirstFailureN,3);
assert.equal(x.unmappedFirstFailureN,1);
assert.equal(x.multiFailRejectedN,2);
assert.equal(x.singleFailRejectedN,2);
assert.equal(x.totalHiddenObservedFails,3);
assert.equal(x.mappingCoverageRate,.75);
assert.equal(x.perGate.LIQUIDITY.firstFailureN,1);
assert.equal(x.perGate.LIQUIDITY.observedFailN,1);
assert.equal(x.perGate.SECTOR_GATE.firstFailureN,1);
assert.equal(x.perGate.SECTOR_GATE.observedFailN,2);
assert.equal(x.perGate.SECTOR_GATE.hiddenBehindOtherFirstFailureN,1);
assert.equal(x.perGate.SECTOR_GATE.firstFailureCaptureRateAmongObservedFails,.5);
assert.equal(x.perGate.TARGET_AVAILABLE.hiddenBehindOtherFirstFailureN,1);
assert.equal(x.perGate.ATR_QUALITY.hiddenBehindOtherFirstFailureN,1);
assert.equal(x.attributionTrust,'MAPPING_REVIEW_REQUIRED');
assert.equal(x.interpretation.firstFailureIsOrderDependent,true);
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

const mismatch=structuredClone(diagnosis);
mismatch.observations=[obs('X','20日流動性不足',['SECTOR_GATE'])];
const y=audit(mismatch);
assert.equal(y.mappedGateMismatchN,1);
assert.equal(y.attributionTrust,'MAPPING_REVIEW_REQUIRED');

const complete=structuredClone(diagnosis);
complete.observations=[obs('A','20日流動性不足',['LIQUIDITY']),obs('B','產業廣度、漲幅或資金活躍度偏弱',['SECTOR_GATE'])];
assert.equal(audit(complete).attributionTrust,'MAPPING_COMPLETE');

assert.throws(()=>audit({...diagnosis,researchOnly:false}),/FIRST_FAILURE_C1_DIAGNOSIS_REQUIRED/);
console.log(JSON.stringify({ok:true,formalRejectedN:x.formalRejectedN,multiFailRejectedN:x.multiFailRejectedN,
  hiddenSector:x.perGate.SECTOR_GATE.hiddenBehindOtherFirstFailureN,formalCoreImpact:false}));

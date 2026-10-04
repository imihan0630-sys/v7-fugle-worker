import assert from 'node:assert/strict';
import {buildSystem1ExtremeMoveProxyDenominatorAudit as audit} from '../research/system1_extreme_move_proxy_denominator_audit_v0_1.mjs';

const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const earlier=['PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','MARKET_CAP_FLOOR'];
const mk=(symbol,{change,earlierState='PASS',pool='GENERAL',first=null}={})=>{
  const gates=Object.fromEntries(earlier.map(id=>[id,{status:earlierState}]));
  gates.DAILY_ABNORMALITY={status:change===null?'UNKNOWN':Math.abs(change)<9.8?'PASS':'FAIL'};
  return {
    raw:{symbol,pricePool:pool,feature:{changePercent:change,close:pool==='THOUSAND'?1200:100}},
    obs:{symbol,pool,firstFailureReason:first,formalResult:{ok:false},gates}
  };
};
const cases=[
  mk('UP',{change:9.9,first:'單日走勢過度異常'}),
  mk('DOWN',{change:-10,first:'單日走勢過度異常'}),
  mk('PASS',{change:4}),
  mk('MISS',{change:null,first:'20日流動性不足'}),
  mk('EARLY_FAIL',{change:9.9,earlierState:'FAIL',first:'市值低於10億'}),
  mk('EARLY_UNKNOWN',{change:-9.9,earlierState:'UNKNOWN'}),
  mk('TH',{change:9.7,pool:'THOUSAND'})
];
const adapted={...base,rows:cases.map(x=>x.raw)};
const diagnosis={...base,schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',observations:cases.map(x=>x.obs)};
const ff={perGate:{DAILY_ABNORMALITY:{firstFailureN:2,observedFailN:4,hiddenBehindOtherFirstFailureN:2}}};
const x=audit({adapted,diagnosis,firstFailureMasking:ff});
assert.equal(x.populationN,7);
assert.equal(x.upstreamReachN,5);
assert.equal(x.upstreamFailN,1);
assert.equal(x.upstreamUnknownN,1);
assert.equal(x.reached.finiteChangeN,4);
assert.equal(x.reached.missingChangeN,1);
assert.equal(x.reached.stateCounts.EXTREME_RETURN_PROXY_UP_REJECTED,1);
assert.equal(x.reached.stateCounts.EXTREME_RETURN_PROXY_DOWN_REJECTED,1);
assert.equal(x.reached.stateCounts.NUMERIC_PROXY_PASS,2);
assert.equal(x.reached.upRejectRateAmongFinite,.25);
assert.equal(x.reached.downRejectRateAmongFinite,.25);
assert.equal(x.formalFirstFailureCrossCheck.missingButFormalContinuesByProxyCoercionN,1);
assert.equal(x.byPool.THOUSAND.reachedN,1);
assert.equal(x.firstFailureMasking.hiddenBehindEarlierFirstFailureN,2);
assert.equal(x.officialLimitStateLayer.status,'NOT_JOINED');
assert.equal(x.observerParityMismatchN,0);
assert.equal(x.evidenceTrust,'PROXY_PARENT_PARITY_VERIFIED');
assert.equal(x.economicSuperiority,'UNKNOWN');

const bad=structuredClone(diagnosis);
bad.observations[0].gates.DAILY_ABNORMALITY.status='PASS';
const y=audit({adapted,diagnosis:bad});
assert.equal(y.observerParityMismatchN,1);
assert.equal(y.evidenceTrust,'DATA_QUALITY_BLOCKED');
assert.throws(()=>audit({adapted:{...adapted,researchOnly:false},diagnosis}),/EXTREME_MOVE_C1_DIAGNOSIS_REQUIRED/);

console.log(JSON.stringify({ok:true,reach:x.upstreamReachN,up:x.reached.stateCounts.EXTREME_RETURN_PROXY_UP_REJECTED,
  down:x.reached.stateCounts.EXTREME_RETURN_PROXY_DOWN_REJECTED,missing:x.reached.missingChangeN,formalCoreImpact:false}));

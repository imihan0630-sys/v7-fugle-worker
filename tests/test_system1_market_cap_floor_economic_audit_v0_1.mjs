import assert from 'node:assert/strict';
import {buildSystem1MarketCapFloorEconomicAudit as audit} from '../research/system1_market_cap_floor_economic_audit_v0_1.mjs';

const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const upstream=['PRICE_FLOOR','HISTORY_60D','RS_CONTEXT'];
const downstream=['DAILY_ABNORMALITY','LIQUIDITY','SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY','ANNOUNCEMENT_RISK','VALUATION_RELATIVE_RISK','SECTOR_GATE','AB_SETUP','FUNDAMENTAL_QUALITY','ATR_QUALITY','TARGET_AVAILABLE','REWARD_RISK','FINAL_SIGNAL_GRADE'];
const mk=(symbol,{mcap,reach='PASS',pool='GENERAL',first=null,nextFail=null}={})=>{
  const gates=Object.fromEntries(upstream.map(id=>[id,{status:reach}]));
  gates.MARKET_CAP_FLOOR={status:mcap===null?'UNKNOWN':mcap<10?'FAIL':'PASS'};
  for(const id of downstream)gates[id]={status:id===nextFail?'FAIL':'PASS'};
  return {
    raw:{symbol,pricePool:pool,feature:{marketCapYi:mcap,close:pool==='THOUSAND'?1200:100}},
    obs:{symbol,pool,firstFailureReason:first,formalResult:{ok:false},gates}
  };
};
const cases=[
  mk('MICRO1',{mcap:5,first:'市值低於10億',nextFail:'LIQUIDITY'}),
  mk('MICRO2',{mcap:9.9,first:'市值低於10億'}),
  mk('MISS',{mcap:null,first:'缺市值資料'}),
  mk('S10',{mcap:10}),
  mk('S20',{mcap:20}),
  mk('MID',{mcap:50}),
  mk('BIG',{mcap:200,pool:'THOUSAND'}),
  mk('EARLY_FAIL',{mcap:5,reach:'FAIL',first:'歷史資料未滿60日'}),
  mk('EARLY_UNKNOWN',{mcap:5,reach:'UNKNOWN'})
];
const adapted={...base,rows:cases.map(x=>x.raw)};
const diagnosis={...base,schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',observations:cases.map(x=>x.obs)};
const ff={perGate:{MARKET_CAP_FLOOR:{firstFailureN:3,observedFailN:4,hiddenBehindOtherFirstFailureN:1}}};
const x=audit({adapted,diagnosis,firstFailureMasking:ff});
assert.equal(x.populationN,9);
assert.equal(x.upstreamReachN,7);
assert.equal(x.upstreamFailN,1);
assert.equal(x.upstreamUnknownN,1);
assert.equal(x.reached.knownMarketCapN,6);
assert.equal(x.reached.missingMarketCapN,1);
assert.equal(x.economicThreshold.knownBelow10N,2);
assert.equal(x.economicThreshold.rejectRateAmongKnown,roundForTest(2/6));
assert.equal(x.p1aMissingState.missingMarketCapN,1);
assert.equal(x.p1aMissingState.neverRelabelAsEconomicFail,true);
assert.equal(x.reasonCrossCheck.knownBelow10ExactFirstFailureN,2);
assert.equal(x.reasonCrossCheck.missingExactFirstFailureN,1);
assert.equal(x.economicThreshold.singleGateReplay.counts.NEXT_OBSERVED_FAIL,1);
assert.equal(x.economicThreshold.singleGateReplay.counts.ALL_OTHER_OBSERVED_GATES_CLEAR,1);
assert.equal(x.economicThreshold.singleGateReplay.nextGateCounts.LIQUIDITY,1);
assert.equal(x.economicThreshold.downstreamObservedStates.LIQUIDITY.FAIL,1);
assert.equal(x.byPool.THOUSAND.states.KNOWN_100_PLUS_PASS,1);
assert.equal(x.observerParityMismatchN,0);
assert.equal(x.evidenceTrust,'MARKET_CAP_STATE_PARITY_VERIFIED');
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

const bad=structuredClone(diagnosis);
bad.observations[0].gates.MARKET_CAP_FLOOR.status='PASS';
const y=audit({adapted,diagnosis:bad});
assert.equal(y.observerParityMismatchN,1);
assert.equal(y.evidenceTrust,'DATA_QUALITY_BLOCKED');

assert.throws(()=>audit({adapted:{...adapted,researchOnly:false},diagnosis}),/MCAP_FLOOR_C1_DIAGNOSIS_REQUIRED/);
console.log(JSON.stringify({ok:true,reach:x.upstreamReachN,knownBelow10:x.economicThreshold.knownBelow10N,
  missing:x.p1aMissingState.missingMarketCapN,nextLiquidity:x.economicThreshold.singleGateReplay.nextGateCounts.LIQUIDITY,formalCoreImpact:false}));

function roundForTest(v){return Math.round(v*10000)/10000;}

import assert from 'node:assert/strict';
import {buildSystem1MarketCapConditionalAdmissionAudit as audit} from '../research/system1_market_cap_conditional_admission_v0_1.mjs';

const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',researchOnly:true,decisionImpact:false,formalCoreImpact:false};
function row(symbol,{mcap,close=100,avgLots,inst,avgAmount=60000000,spread=.3,depth=true}){
  return {symbol,feature:{marketCapYi:mcap,close,avgVolume20Lots:avgLots,avgAmount20:avgAmount,spreadPercent:spread,orderBookDepthGood:depth,depthScore:90},
    derived:{institutionalScore:inst}};
}
function obs(symbol,gates){
  return {symbol,parentId:'C1:g',gates:{LIQUIDITY:{status:'PASS'},SMALL_CAP_SPECIAL:{status:'PASS'},MID_CAP_LIQUIDITY:{status:'PASS'},...gates},
    formalResult:{ok:false},researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}
const adapted={...base,rows:[
  row('S_VOL',{mcap:20,avgLots:1200,inst:80}),
  row('S_INST',{mcap:25,avgLots:1600,inst:60}),
  row('S_BOTH',{mcap:29,avgLots:1100,inst:60}),
  row('M_FAIL',{mcap:50,avgLots:1100,inst:75,avgAmount:10000000,spread:.8,depth:false}),
  row('M_PASS',{mcap:90,avgLots:1300,inst:75}),
  row('LARGE',{mcap:105,avgLots:1100,inst:50}),
  row('THOUSAND',{mcap:20,close:1200,avgLots:500,inst:80})
]};
const diagnosis={...base,observations:[
  obs('S_VOL',{SMALL_CAP_SPECIAL:{status:'FAIL'}}),
  obs('S_INST',{SMALL_CAP_SPECIAL:{status:'FAIL'}}),
  obs('S_BOTH',{SMALL_CAP_SPECIAL:{status:'FAIL'}}),
  obs('M_FAIL',{MID_CAP_LIQUIDITY:{status:'FAIL'}}),
  obs('M_PASS',{}),
  obs('LARGE',{}),
  obs('THOUSAND',{})
]};
const x=audit({adapted,diagnosis});
assert.equal(x.observedN,7);
assert.equal(x.byBand.CAP_10_30.n,4);
assert.equal(x.smallCapSpecial.failBreakdown.VOLUME_ONLY_FAIL,1);
assert.equal(x.smallCapSpecial.failBreakdown.INSTITUTIONAL_ONLY_FAIL,1);
assert.equal(x.smallCapSpecial.failBreakdown.VOLUME_AND_INSTITUTIONAL_FAIL,1);
assert.equal(x.midCapLiquidity.failBreakdown.failN,1);
assert.equal(x.midCapLiquidity.failBreakdown.below1_2xN,1);
assert.equal(x.byPool.THOUSAND.n,1);
assert.equal(x.boundaryWindows.cap30.lower.n,2);
assert.equal(x.boundaryWindows.cap30.upper.n,0);
assert.equal(x.boundaryWindows.cap100.lower.n,1);
assert.equal(x.boundaryWindows.cap100.upper.n,1);
assert.equal(x.interpretation.uniqueObservedClearIsNotRecoveredSelection,true);
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

assert.throws(()=>audit({adapted:{...adapted,researchOnly:false},diagnosis}),/ADAPTED_FIREWALL/);
console.log(JSON.stringify({ok:true,observedN:x.observedN,smallFails:x.byBand.CAP_10_30.smallCapSpecial.FAIL,
  midFails:x.midCapLiquidity.failBreakdown.failN,formalCoreImpact:false}));

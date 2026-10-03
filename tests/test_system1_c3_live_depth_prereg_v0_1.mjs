import assert from "node:assert/strict";
import {C3_LIVE_DEPTH_PREREG_V0_1,buildC3LiveDepthNormalizedVector} from "../research/system1_c3_live_depth_prereg_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

function row(tradeDate,{symbol="AAA",slot="09:30",bid=1000,ask=900,imbalance=.052632,spread=.1}={}){
  return {
    symbol,tradeDate,slot,bidDepth5:bid,askDepth5:ask,depthImbalance:imbalance,spreadPct:spread,
    quoteTimestamp:tradeDate+"T09:44:00+08:00"
  };
}
const history=Array.from({length:12},(_,i)=>{
  const day=String(10+i).padStart(2,"0");
  return row("2026-09-"+day,{bid:800+i*20,ask:760+i*15,imbalance:(40+i)/1000,spread:.18-i*.005});
});
const obs=row("2026-10-05",{bid:1200,ask:1000,imbalance:.090909,spread:.08});
const v=buildC3LiveDepthNormalizedVector(obs,history);

eq(C3_LIVE_DEPTH_PREREG_V0_1.compositeDepthScore,"NOT_AUTHORIZED_V0_1");
eq(C3_LIVE_DEPTH_PREREG_V0_1.triggerUse,"NOT_AUTHORIZED_V0_1");
eq(C3_LIVE_DEPTH_PREREG_V0_1.outcomeLabelsAllowed,false);
eq(v.schemaVersion,"SYSTEM1_C3_LIVE_DEPTH_VECTOR_V0_1");
eq(v.status,"NORMALIZED_VECTOR_READY");
eq(v.baselineN,12);
eq(v.baselineStart,"2026-09-10");
eq(v.baselineEnd,"2026-09-21");
eq(v.triggerEligible,false);
eq(v.compositeDepthScore,null);
eq(v.outcomeLabelsUsed,false);
eq(v.lookaheadRowsUsed,0);
eq(v.sameDayRowsUsed,0);
eq(v.baselineUsesSameSymbol,true);
eq(v.baselineUsesSameSlot,true);
eq(v.latestPriorSessionsOnly,true);
ok(v.normalized.totalDepthPercentile>50);
ok(v.normalized.spreadQualityPercentile>50);
eq(v.normalized.depthImbalance,.090909);
ok(v.normalized.bidSharePct>50);
eq(v.economicSuperiority,"UNKNOWN");

const insufficient=buildC3LiveDepthNormalizedVector(obs,history.slice(0,5));
eq(insufficient.status,"UNKNOWN_INSUFFICIENT_BASELINE");
eq(insufficient.baselineN,5);
eq(insufficient.normalized.totalDepthPercentile,null);
eq(insufficient.normalized.spreadQualityPercentile,null);
eq(insufficient.compositeDepthScore,null);
eq(insufficient.triggerEligible,false);

const withUnrelated=[
  ...history,
  row("2026-10-05",{symbol:"BBB",slot:"09:30",bid:9999,ask:9999,imbalance:0,spread:.01}),
  row("2026-10-05",{symbol:"AAA",slot:"10:00",bid:9999,ask:9999,imbalance:0,spread:.01})
];
const unrelatedIgnored=buildC3LiveDepthNormalizedVector(obs,withUnrelated);
eq(unrelatedIgnored.baselineN,12);
eq(unrelatedIgnored.normalized.totalDepthPercentile,v.normalized.totalDepthPercentile);

assert.throws(()=>buildC3LiveDepthNormalizedVector(obs,[...history,row("2026-10-05")]),/C3_LIVE_DEPTH_LOOKAHEAD_ROW/);n++;
assert.throws(()=>buildC3LiveDepthNormalizedVector(obs,[...history,row("2026-10-06")]),/C3_LIVE_DEPTH_LOOKAHEAD_ROW/);n++;
assert.throws(()=>buildC3LiveDepthNormalizedVector(obs,[...history,{...history[0]}]),/C3_LIVE_DEPTH_DUPLICATE_SESSION/);n++;
assert.throws(()=>buildC3LiveDepthNormalizedVector({...obs,depthImbalance:1.2},history),/C3_LIVE_DEPTH_OBSERVATION_IMBALANCE_INVALID/);n++;
assert.throws(()=>buildC3LiveDepthNormalizedVector({...obs,bidDepth5:0,askDepth5:0},history),/C3_LIVE_DEPTH_OBSERVATION_DEPTH_INVALID/);n++;
assert.throws(()=>buildC3LiveDepthNormalizedVector(obs,history,{minPriorSessions:21,maxPriorSessions:20}),/C3_LIVE_DEPTH_BASELINE_WINDOW_INVALID/);n++;

const longHistory=Array.from({length:25},(_,i)=>{
  const d=new Date(Date.UTC(2026,7,1+i));
  const date=d.toISOString().slice(0,10);
  return row(date,{bid:700+i*10,ask:650+i*9,imbalance:.03,spread:.15});
});
const capped=buildC3LiveDepthNormalizedVector(obs,longHistory);
eq(capped.baselineN,20);

console.log(JSON.stringify({
  ok:true,assertions:n,outcomeBlind:true,sameSymbolSameSlot:true,priorSessionsOnly:true,
  compositeScoreAuthorized:false,triggerEligible:false,lookaheadRejected:true,
  formalCoreImpact:false,system2Touched:false
}));

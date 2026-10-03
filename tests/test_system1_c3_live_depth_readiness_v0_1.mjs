import assert from "node:assert/strict";
import {buildC3LiveDepthBaselineReadiness} from "../research/system1_c3_live_depth_readiness_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

function iso(date,slot){
  return new Date(date+"T"+slot+":00+08:00").toISOString();
}
function bar(date,slot,{bid=1000,ask=900,imbalance=.052632,spread=.1,complete=true}={}){
  return {
    startAt:iso(date,slot),endAt:new Date(Date.parse(iso(date,slot))+15*60000).toISOString(),slot,
    liveBidDepth5:complete?bid:null,liveAskDepth5:complete?ask:null,
    liveDepthImbalance:complete?imbalance:null,liveSpreadPct:complete?spread:null,
    liveDepthRawComplete:complete,
    liveQuoteTimestamp:complete?new Date(Date.parse(iso(date,slot))+14*60000).toISOString():null
  };
}
function packet(date,bars,{symbol="AAA"}={}){
  return {
    schemaVersion:"SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1",
    targetTradeDate:date,sourceSessionDate:date,generationId:"g-"+date,
    researchOnly:true,formalCoreLocked:true,
    capture:{audit:{readyReceipts:[{symbol,bars}]}}
  };
}
const priorDates=["2026-09-10","2026-09-11","2026-09-14","2026-09-15","2026-09-16","2026-09-17",
  "2026-09-18","2026-09-21","2026-09-22","2026-09-23","2026-09-24","2026-09-25"];
const priors=priorDates.map((d,i)=>packet(d,[
  bar(d,"09:30",{bid:800+i*20,ask:760+i*15,imbalance:.04+i*.002,spread:.18-i*.005}),
  ...(i<5?[bar(d,"10:00",{bid:600+i*10,ask:580+i*8,imbalance:.02,spread:.2})]:[])
]));
const current=packet("2026-10-05",[
  bar("2026-10-05","09:30",{bid:1200,ask:1000,imbalance:.090909,spread:.08}),
  bar("2026-10-05","10:00",{bid:700,ask:650,imbalance:.037037,spread:.12})
]);
const r=buildC3LiveDepthBaselineReadiness(current,priors);
eq(r.schemaVersion,"SYSTEM1_C3_LIVE_DEPTH_BASELINE_READINESS_V0_1");
eq(r.currentTradeDate,"2026-10-05");
eq(r.currentObservationN,2);
eq(r.rawCompleteCurrentN,2);
eq(r.normalizedReadyN,1);
eq(r.insufficientBaselineN,1);
eq(r.rawIncompleteN,0);
eq(r.normalizedReadyPct,50);
eq(r.priorPacketN,12);
eq(r.readiness,"PARTIAL_CURRENT_SLOTS_READY");
eq(r.noReadinessDateForecast,true);
eq(r.noMissingDataImputation,true);
eq(r.sameSymbolSameSlotPriorSessionsOnly,true);
eq(r.compositeDepthScoreAuthorized,false);
eq(r.triggerUseAuthorized,false);
eq(r.outcomeLabelsUsed,false);

const bySlot=Object.fromEntries(r.rows.map(x=>[x.slot,x]));
eq(bySlot["09:30"].status,"NORMALIZED_VECTOR_READY");
eq(bySlot["09:30"].baselineN,12);
eq(bySlot["09:30"].missingPriorSessionsToMin,0);
eq(bySlot["09:30"].compositeDepthScore,null);
eq(bySlot["09:30"].triggerEligible,false);
ok(bySlot["09:30"].normalized.totalDepthPercentile>50);

eq(bySlot["10:00"].status,"UNKNOWN_INSUFFICIENT_BASELINE");
eq(bySlot["10:00"].baselineN,5);
eq(bySlot["10:00"].missingPriorSessionsToMin,5);
eq(bySlot["10:00"].normalized.totalDepthPercentile,null);
eq(bySlot["10:00"].triggerEligible,false);

eq(r.symbolSummary.length,1);
eq(r.symbolSummary[0].symbol,"AAA");
eq(r.symbolSummary[0].slotN,2);
eq(r.symbolSummary[0].normalizedReadySlotN,1);
eq(r.symbolSummary[0].insufficientSlotN,1);
eq(r.symbolSummary[0].minBaselineN,5);
eq(r.symbolSummary[0].maxBaselineN,12);

const incomplete=buildC3LiveDepthBaselineReadiness(
  packet("2026-10-05",[bar("2026-10-05","09:30",{complete:false})]),priors
);
eq(incomplete.rawCompleteCurrentN,0);
eq(incomplete.rawIncompleteN,1);
eq(incomplete.normalizedReadyN,0);
eq(incomplete.rows[0].status,"RAW_LIVE_DEPTH_INCOMPLETE");
eq(incomplete.rows[0].triggerEligible,false);

const unrelated=[...priors,packet("2026-09-26",[bar("2026-09-26","09:30",{bid:9999,ask:9999})],{symbol:"BBB"})];
const ignored=buildC3LiveDepthBaselineReadiness(current,unrelated);
eq(ignored.rows.find(x=>x.slot==="09:30").baselineN,12);

assert.throws(()=>buildC3LiveDepthBaselineReadiness(current,[...priors,packet("2026-10-05",[bar("2026-10-05","09:30")])]),/LOOKAHEAD_PACKET/);n++;
assert.throws(()=>buildC3LiveDepthBaselineReadiness(current,[priors[0],priors[0]]),/DUPLICATE_PRIOR_DATE/);n++;
assert.throws(()=>buildC3LiveDepthBaselineReadiness(
  packet("2026-10-05",[bar("2026-10-05","09:30"),bar("2026-10-05","09:30")]),priors
),/DUPLICATE_SYMBOL_DATE_SLOT/);n++;

const wrongDateBar=bar("2026-10-06","09:30");
assert.throws(()=>buildC3LiveDepthBaselineReadiness(packet("2026-10-05",[wrongDateBar]),priors),/BAR_TIME_INVALID/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,artifactOnly:true,sameSymbolSameSlot:true,minPriorSessions:10,
  readyAndInsufficientSeparated:true,noReadinessForecast:true,noImputation:true,
  compositeScoreAuthorized:false,triggerUseAuthorized:false,formalCoreImpact:false,system2Touched:false
}));

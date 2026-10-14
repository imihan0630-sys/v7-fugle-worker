// Research-only synthetic source-function falsification; never market evidence.
import {buildC3LiveDepthBaselineReadiness} from "./system1_c3_live_depth_readiness_v0_1.mjs";
const mk=(date,delta={})=>({
  schemaVersion:"SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1",
  targetTradeDate:date,researchOnly:true,formalCoreLocked:true,
  capture:{audit:{readyReceipts:[{symbol:"2330",bars:[{
    slot:"09:00",startAt:date+"T09:00:00+08:00",
    liveQuoteTimestamp:date+"T09:16:01+08:00",liveDepthRawComplete:true,
    liveBidDepth5:80,liveAskDepth5:20,liveDepthImbalance:0.6,liveSpreadPct:0.2,
    liveExecutionMarketState:"CONTINUOUS",liveBestBid:100,liveBestAsk:100.2,...delta
  }]}]}}
});
const prior=Array.from({length:10},(_,i)=>mk("2026-09-"+String(i+15).padStart(2,"0")));
const cases=[
  ["reference",{},prior,"ALL_CURRENT_SLOTS_READY"],
  ["imbalance_inverted",{liveDepthImbalance:-0.6},prior,"ALL_CURRENT_SLOTS_READY"],
  ["imbalance_arbitrary",{liveDepthImbalance:0.9},prior,"ALL_CURRENT_SLOTS_READY"],
  ["imbalance_range_guard",{liveDepthImbalance:1.1},prior,"NO_CURRENT_SLOT_READY"],
  ["negative_depth_guard",{liveBidDepth5:-1},prior,"NO_CURRENT_SLOT_READY"],
  ["negative_spread_guard",{liveSpreadPct:-0.1},prior,"NO_CURRENT_SLOT_READY"],
  ["spread_300pct",{liveSpreadPct:300},prior,"ALL_CURRENT_SLOTS_READY"],
  ["current_trial",{liveExecutionMarketState:"TRIAL"},prior,"ALL_CURRENT_SLOTS_READY"],
  ["prior_trial",{},prior.map(p=>mk(p.targetTradeDate,{liveExecutionMarketState:"TRIAL"})),"ALL_CURRENT_SLOTS_READY"],
  ["incomplete_flag",{liveDepthRawComplete:false},prior,"NO_CURRENT_SLOT_READY"],
  ["crossed_best_quote",{liveBestBid:101,liveBestAsk:100},prior,"ALL_CURRENT_SLOTS_READY"],
  ["zero_depth",{liveBidDepth5:0,liveAskDepth5:0},prior,"NO_CURRENT_SLOT_READY"],
  ["tomorrow_quote",{liveQuoteTimestamp:"2026-10-15T09:16:00+08:00"},prior,"NO_CURRENT_SLOT_READY"],
  ["nine_prior",{},prior.slice(0,9),"NO_CURRENT_SLOT_READY"],
  ["same_day_prior",{},[...prior,mk("2026-10-14")],"ERROR:C3_DEPTH_READINESS_LOOKAHEAD_PACKET"],
  ["duplicate_prior",{},[...prior,prior[0]],"ERROR:C3_DEPTH_READINESS_DUPLICATE_PRIOR_DATE"]
];
let passed=0;
for(const [name,delta,history,expected] of cases){
  let actual;
  try{actual=buildC3LiveDepthBaselineReadiness(mk("2026-10-14",delta),history).readiness;}
  catch(error){actual="ERROR:"+error.message;}
  const ok=actual===expected;
  if(ok)passed++;
  console.log((ok?"PASS":"FAIL")+" "+name+" expected="+expected+" actual="+actual);
}
console.log("ROOM04_C3_INVARIANT_SYNTHETIC "+passed+"/"+cases.length);
if(passed!==cases.length)process.exitCode=1;

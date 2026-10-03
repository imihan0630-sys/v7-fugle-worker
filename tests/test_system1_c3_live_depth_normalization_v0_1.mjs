import assert from "node:assert/strict";
import {
  C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1,
  buildC3LiveDepthFeature,scoreC3LiveDepthFeature,buildC3LiveDepthNormalizationAudit
} from "../research/system1_c3_live_depth_normalization_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const feature=buildC3LiveDepthFeature({
  symbol:"2330",targetTradeDate:"2026-10-05",slot:"10:00",
  barVolume:10000,bidDepth5:1000,askDepth5:500,depthImbalance:1/3,spreadPct:.1,
  quoteTimestamp:"2026-10-05T02:14:00.000Z"
});
eq(feature.status,"READY");
eq(feature.harmonicDepth5,666.66666667);
eq(feature.depthToBarVolume,.06666667);
eq(feature.outcomeFieldsUsed,[]);
eq(feature.rawOutcomeBlind,true);

const blocked=buildC3LiveDepthFeature({
  symbol:"2330",targetTradeDate:"2026-10-05",slot:"10:00",
  barVolume:0,bidDepth5:1000,askDepth5:500,depthImbalance:.2,spreadPct:.1
});
eq(blocked.status,"INPUT_BLOCKED");
ok(blocked.blockers.includes("BAR_VOLUME_UNAVAILABLE"));

const zeroSide=buildC3LiveDepthFeature({
  symbol:"2330",targetTradeDate:"2026-10-05",slot:"10:00",
  barVolume:1000,bidDepth5:0,askDepth5:500,depthImbalance:-1,spreadPct:.1
});
eq(zeroSide.status,"READY");
eq(zeroSide.harmonicDepth5,0);
eq(zeroSide.depthToBarVolume,0);

function hist(date,value,{symbol="2330",slot="10:00"}={}){
  return buildC3LiveDepthFeature({
    symbol,targetTradeDate:date,slot,
    barVolume:1000,bidDepth5:value,askDepth5:value,depthImbalance:0,spreadPct:.1,
    quoteTimestamp:date+"T02:14:00.000Z"
  });
}
const target=hist("2026-10-05",105);
const history19=Array.from({length:19},(_,i)=>hist("2026-09-"+String(i+1).padStart(2,"0"),(i+1)*10));
const insufficient=scoreC3LiveDepthFeature(target,history19);
eq(insufficient.status,"BASELINE_INSUFFICIENT");
eq(insufficient.liveDepthScore,null);
eq(insufficient.baselineN,19);
eq(insufficient.triggerAuthorized,false);
eq(insufficient.existingDepthThresholdsReusable,false);

const history20=Array.from({length:20},(_,i)=>hist("2026-09-"+String(i+1).padStart(2,"0"),(i+1)*10));
const scored=scoreC3LiveDepthFeature(target,history20);
eq(scored.status,"SCORED");
eq(scored.liveDepthScore,50);
eq(scored.lessN,10);
eq(scored.equalN,0);
eq(scored.baselineN,20);
eq(scored.newestBaselineDate,"2026-09-20");
eq(scored.oldestBaselineDate,"2026-09-01");
eq(scored.mappingPreregistered,true);
eq(scored.outcomeBlind,true);
eq(scored.triggerAuthorized,false);
eq(scored.existingDepthThresholdsReusable,false);
eq(scored.economicSuperiority,"UNKNOWN");
ok(typeof scored.baselineFingerprint==="string"&&scored.baselineFingerprint.length===64);

const ties=Array.from({length:20},(_,i)=>hist("2026-08-"+String(i+1).padStart(2,"0"),100));
const targetTie=hist("2026-10-05",100);
eq(scoreC3LiveDepthFeature(targetTie,ties).liveDepthScore,50);

assert.throws(()=>scoreC3LiveDepthFeature(target,[
  ...history19,
  hist("2026-10-05",200)
]),/C3_LIVE_DEPTH_LOOKAHEAD_REJECTED/);n++;

assert.throws(()=>scoreC3LiveDepthFeature(target,[
  ...history19,
  hist("2026-09-01",200)
]),/C3_LIVE_DEPTH_DUPLICATE_BASELINE_SESSION/);n++;

const mixed=[...history20,hist("2026-09-21",999,{symbol:"2317"}),hist("2026-09-21",999,{slot:"10:15"})];
eq(scoreC3LiveDepthFeature(target,mixed).baselineN,20);

const audit=buildC3LiveDepthNormalizationAudit([target,blocked],history20);
eq(audit.schemaVersion,"SYSTEM1_C3_LIVE_DEPTH_NORMALIZATION_AUDIT_V0_1");
eq(audit.targetN,2);
eq(audit.scoredN,1);
eq(audit.inputBlockedN,1);
eq(audit.status,"INPUT_BLOCKED");
eq(audit.triggerAuthorized,false);
eq(audit.existingDepthThresholdsReusable,false);
eq(audit.formalOptimizationCandidate,"NONE");

eq(C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.minDistinctSessions,20);
eq(C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.maxLookbackSessions,60);
eq(C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.fallbackAcrossSymbols,false);
eq(C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.fallbackAcrossSlots,false);
eq(C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.fallbackAcrossCurrentDay,false);
eq(C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.triggerAuthorized,false);

console.log(JSON.stringify({
  ok:true,assertions:n,metric:"HARMONIC_TWO_SIDED_DEPTH_TO_COMPLETED_15M_VOLUME",
  minDistinctSessions:20,maxLookbackSessions:60,outcomeBlind:true,
  currentDayLeakage:false,futureLeakage:false,crossSymbolFallback:false,crossSlotFallback:false,
  triggerAuthorized:false,existingDepthThresholdsReusable:false,formalCoreImpact:false
}));

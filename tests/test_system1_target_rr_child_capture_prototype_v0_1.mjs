import assert from "node:assert/strict";
import {buildTargetRrChildCapturePrototype,TARGET_RR_SOURCE_SCHEMA} from "../research/system1_target_rr_child_capture_prototype_v0_1.mjs";

const day="2026-10-07",decisionAt="2026-10-07T15:35:00+08:00";
const dates=Array.from({length:61},(_,i)=>new Date(Date.UTC(2026,7,8+i)).toISOString().slice(0,10));
dates[dates.length-1]=day;
function history(oldHigh=null){
  const h=dates.map((date,i)=>({date,open:99,high:100,low:98,close:100,volumeShares:1000000,tradeValue:100000000}));
  if(oldHigh!==null) h[8].high=oldHigh;
  return h;
}
function feature(symbol,{oldHigh=null,targetPrice=null,targetProv=false,prior20Override=null,prior60Override=null}={}){
  const h=history(oldHigh),prior20=prior20Override??Math.max(...h.slice(-21,-1).map(x=>x.high)),
    prior60=prior60Override??Math.max(...h.slice(-61,-1).map(x=>x.high));
  return {
    symbol,close:100,atrPercent:3,priorHigh20:prior20,priorHigh60:prior60,history:h,
    ...(targetPrice===null?{}:{targetPrice,
      ...(targetProv?{
        targetPriceSource:"fixture",targetPriceAsOf:day+"T13:00:00+08:00",
        targetPriceCapturedAt:day+"T14:00:00+08:00",targetPricePointInTimeEligible:true
      }:{})})
  };
}
function entryStop(f){
  const breakout=f.priorHigh20,entry=breakout*1.003,stop=breakout-Math.max((f.atrPercent/100*f.close)*0.65,breakout*0.012);
  return {entry,stop};
}
function parentRow(f,{reason="上方無可驗證實質壓力，無法計算真實RR",ok=false,target=null}={}){
  const g=entryStop(f);
  return {
    symbol:f.symbol,market:"TWSE",pricePool:"GENERAL",
    feature:{close:100,historyDays:61},
    historyAdmission:{usable:true,status:"READY"},
    derived:{channel:"B",entryGeometry:{entry:g.entry,stop:g.stop,target}},
    formalResult:{ok,firstFailure:ok?null:reason,basePassed:true,rrPassed:ok}
  };
}
function receipt(rows){
  return {
    generationId:"C1:"+day+":fixture",sessionDate:day,decisionAt,
    sourceMainSha:"a".repeat(40),effectiveRuntimeVersion:"8.20.0-formal-c1-binding-ledger",
    contentDigest:"b".repeat(64),populationN:rows.length,rows,readbackVerified:true,
    shadowMembershipCapture:{schemaVersion:"SYSTEM1_SHADOW_COHORT_CAPTURE_V0_1"},
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
const sourceNone={
  schemaVersion:TARGET_RR_SOURCE_SCHEMA,scanDate:day,capturedAt:day+"T15:30:00+08:00",
  sourceReceiptId:"SRC:none:"+day,customConfigured:false,customMode:"NONE",customFetchStatus:"NOT_CONFIGURED",
  targetPriceCoverageSemantics:"SOURCE_NOT_CONFIGURED",customStockCount:0,targetPriceObservedCount:0
};
const sourceSubset={
  ...sourceNone,sourceReceiptId:"SRC:subset:"+day,customConfigured:true,customMode:"API",
  customFetchStatus:"SUCCESS",targetPriceCoverageSemantics:"UNKNOWN_SUBSET_COVERAGE"
};
const sourceComplete={
  ...sourceSubset,sourceReceiptId:"SRC:complete:"+day,targetPriceCoverageSemantics:"COMPLETE_SYMBOL_COVERAGE"
};

const fNull=feature("1001");
let out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fNull)]),sameScanFeatures:[fNull],sourceState:sourceNone
});
assert.equal(out.header.fullFrameN,1);
assert.equal(out.children.length,1);
assert.equal(out.children[0].formalStage,"TARGET_NULL_REJECTED");
assert.equal(out.children[0].targetStateV2,"TARGET_NONE_SEARCH_COMPLETE");
assert.equal(out.children[0].semantics.searchComplete,true);
assert.equal(out.children[0].semantics.knownAt,decisionAt);
assert.deepEqual(out.children[0].semantics.sourceReceiptIds,["SRC:none:"+day,"C1_GENERATION:C1:"+day+":fixture"]);

out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fNull)]),sameScanFeatures:[fNull],sourceState:sourceSubset
});
assert.equal(out.children[0].targetStateV2,"TARGET_UNKNOWN_SOURCE");
assert.equal(out.children[0].semantics.reason,"ABSENT_SUBSET_COVERAGE_UNKNOWN");

out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fNull)]),sameScanFeatures:[fNull],sourceState:sourceComplete
});
assert.equal(out.children[0].targetStateV2,"TARGET_NONE_SEARCH_COMPLETE");

const fIncompleteTarget=feature("1002",{oldHigh:110,targetPrice:105,targetProv:false});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fIncompleteTarget,{ok:true,target:105})]),sameScanFeatures:[fIncompleteTarget],sourceState:sourceSubset
});
assert.equal(out.children[0].targetStateV2,"TARGET_UNKNOWN_SOURCE");
assert.equal(out.children[0].targetPriceSourceState.state,"PRESENT_PROVENANCE_UNKNOWN");

const fVerifiedTarget=feature("1003",{oldHigh:110,targetPrice:105,targetProv:true});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fVerifiedTarget,{ok:true,target:105})]),sameScanFeatures:[fVerifiedTarget],sourceState:sourceSubset
});
assert.equal(out.children[0].targetStateV2,"TARGET_FOUND");
assert.equal(out.children[0].audit.resistance.selectedTarget,105);
assert.equal(out.children[0].audit.targetPrice.provenanceComplete,true);

const fLow=feature("1004",{oldHigh:103});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fLow,{reason:"預期RR低於2比1",target:103})]),sameScanFeatures:[fLow],sourceState:sourceNone
});
assert.equal(out.children[0].formalStage,"LOW_RR_REJECTED");
assert.equal(out.children[0].targetStateV2,"TARGET_FOUND");
assert.ok(out.children[0].audit.rr.value<2);

const fPass=feature("1005",{oldHigh:110});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fPass,{ok:true,target:110})]),sameScanFeatures:[fPass],sourceState:sourceNone
});
assert.equal(out.children[0].formalStage,"RR_PASSED_FORMAL_OK");
assert.equal(out.children[0].targetStateV2,"TARGET_FOUND");
assert.ok(out.children[0].audit.rr.value>=2);

const fGrade=feature("1006",{oldHigh:110});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fGrade,{reason:"策略品質低於B級，不列入推薦",target:110})]),sameScanFeatures:[fGrade],sourceState:sourceNone
});
assert.equal(out.children[0].formalStage,"FINAL_GRADE_REJECTED_AFTER_RR_PASS");
assert.equal(out.children[0].targetStateV2,"TARGET_FOUND");

const fHistoryMismatch=feature("1007",{prior60Override:111});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fHistoryMismatch)]),sameScanFeatures:[fHistoryMismatch],sourceState:sourceNone
});
assert.equal(out.children[0].targetStateV2,"TARGET_UNKNOWN_SOURCE");
assert.equal(out.children[0].historySource.derivedLevelsMatch,false);

const fParentMismatch=feature("1008",{oldHigh:110});
out=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fParentMismatch,{ok:true,target:109})]),sameScanFeatures:[fParentMismatch],sourceState:sourceNone
});
assert.equal(out.children[0].targetStateV2,"TARGET_UNKNOWN_GEOMETRY");
assert.equal(out.children[0].semantics.reason,"PARENT_OBSERVER_TARGET_MISMATCH");

const many=Array.from({length:20},(_,i)=>feature(String(2000+i)));
const manyParents=many.map(f=>parentRow(f));
const a=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt(manyParents),sameScanFeatures:many,sourceState:sourceNone,capPerStratum:6
});
const b=await buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([...manyParents].reverse()),sameScanFeatures:[...many].reverse(),sourceState:sourceNone,capPerStratum:6
});
assert.equal(a.header.fullFrameN,20);
assert.equal(a.children.length,6);
assert.equal(a.header.sampledChildN,6);
assert.equal(Object.values(a.header.frameCounts).reduce((x,y)=>x+y,0),20);
assert.deepEqual(a.children.map(x=>x.symbol),b.children.map(x=>x.symbol));
assert.equal(a.header.childDigest,b.header.childDigest);
assert.ok(Buffer.byteLength(JSON.stringify(a),"utf8")<250000);

await assert.rejects(()=>buildTargetRrChildCapturePrototype({
  c1Receipt:receipt([parentRow(fNull)]),sameScanFeatures:[fNull],
  sourceState:{...sourceNone,customMode:"API"}
}),/SOURCE_NONE_CONTRACT|SOURCE_CONFIG_CONTRACT/);

console.log(JSON.stringify({
  ok:true,assertions:31,targetNoneRequiresCompleteSource:true,
  subsetAbsenceRemainsUnknown:true,presentUnprovenTargetRemainsUnknown:true,
  historyLevelsReplayed:true,parentTargetMismatchCaught:true,
  fullFrameBeforeSampling:true,deterministicOutcomeBlindSampling:true,
  providerCallDelta:0,economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
  formalCoreImpact:false
}));

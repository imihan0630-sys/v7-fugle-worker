import {C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1} from "./system1_c3_live_depth_normalization_v0_1.mjs";
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;

export function buildC3DepthSemanticsAudit(c3Audit){
  if(c3Audit?.schemaVersion!=="SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_4"||
     c3Audit?.researchOnly!==true||c3Audit?.formalCoreImpact!==false||
     !Array.isArray(c3Audit?.rows)||!Array.isArray(c3Audit?.readyReceipts))
    throw new Error("C3_DEPTH_SEMANTICS_V0_4_AUDIT_REQUIRED");

  const receiptMap=new Map(c3Audit.readyReceipts.map(r=>[String(r.symbol),r]));
  const rows=c3Audit.rows.map(r=>{
    const receipt=receiptMap.get(String(r.symbol));
    const bars=Array.isArray(receipt?.bars)?receipt.bars:[];
    const depthBars=bars.filter(b=>b?.liveDepthRawComplete===true);
    const allRawSemanticsValid=bars.every(b=>
      b?.depthScoreSemantics==="SELECTION_TIME_CONTEXT_REUSED_NOT_LIVE_ORDER_BOOK"&&
      b?.liveDepthScore===null&&b?.liveDepthScoreDerived===false
    );
    return {
      symbol:String(r.symbol),
      inputStatus:r.status,
      barCount:Number(r.barCount)||0,
      selectionDepthVerified:r.selectionDepthVerified===true,
      liveDepthCompleteBars:Number(r.liveDepthCompleteBars)||0,
      liveDepthCoveragePct:finite(r.liveDepthCoveragePct),
      readyReceiptPresent:!!receipt,
      readyReceiptBars:bars.length,
      readyReceiptRawDepthBars:depthBars.length,
      rawDepthSemanticsValid:allRawSemanticsValid,
      triggerDepthSource:r.depthGuardSource||null,
      triggerUsesLiveOrderBook:r.depthGuardUsesLiveOrderBook===true,
      researchOnly:true,decisionImpact:false
    };
  });

  const totalBars=rows.reduce((s,x)=>s+x.barCount,0);
  const liveDepthCompleteBars=rows.reduce((s,x)=>s+x.liveDepthCompleteBars,0);
  const readyRows=rows.filter(x=>x.inputStatus==="READY");
  const allReadyRawDepthComplete=readyRows.length>0&&readyRows.every(x=>x.readyReceiptBars>0&&x.readyReceiptRawDepthBars===x.readyReceiptBars);
  const allReadySemanticsValid=readyRows.every(x=>x.rawDepthSemanticsValid===true);

  return {
    schemaVersion:"SYSTEM1_C3_DEPTH_SEMANTICS_AUDIT_V0_1",
    generationId:c3Audit.generationId,sessionDate:c3Audit.sessionDate,
    status:allReadyRawDepthComplete?"RAW_LIVE_DEPTH_CAPTURE_READY_MAPPING_PREREGISTERED":"RAW_LIVE_DEPTH_INCOMPLETE",
    rows,totalBars,liveDepthCompleteBars,
    liveDepthCoveragePct:totalBars?round(liveDepthCompleteBars/totalBars*100,4):null,
    triggerDepthSource:"SELECTION_TIME_DEPTH_SCORE_REPLICATED_ACROSS_INTRADAY_BARS",
    triggerUsesLiveOrderBook:false,
    selectionDepthStillUsedByTrigger:true,
    rawLiveDepthCaptured:true,
    rawLiveDepthUsedForTrigger:false,
    liveDepthScoreMappingStatus:"PREREGISTERED_RESEARCH_ONLY_BASELINE_REQUIRED",
    liveDepthNormalizationContract:C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1,
    liveDepthScoreDerived:false,
    noRetestLiveDepthValidationReady:false,
    allReadyRawDepthComplete,allReadySemanticsValid,
    mustNotClaimPoorLiveDepthFilter:true,
    nextResearchRequirement:"ACCUMULATE_PRIOR_SAME_SYMBOL_SAME_SLOT_BASELINE_THEN_VALIDATE_BEFORE_ENTRY_CONTRACT_VERSION",
    economicSuperiority:"UNKNOWN",
    noTriggerMutation:true,noPlanChanges:true,noTrade:true,noPush:true,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

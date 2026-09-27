// Class-A research observer for target/resistance/RR attribution.
// No Worker import, no market calls, no persistence, no Formal decision impact.

const TARGET_NULL_REASON="上方無可驗證實質壓力，無法計算真實RR";
const LOW_RR_REASON="預期RR低於2比1";
const FINAL_GRADE_REASON="策略品質低於B級，不列入推薦";

function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}

function deriveFormalEntryStop(feature,channel){
  const f=feature||{};
  const close=num(f.close),atrPct=num(f.atrPercent);
  if(close===null||atrPct===null) return {status:"UNKNOWN",reason:"MISSING_CLOSE_OR_ATR"};
  const atr=atrPct/100*close;
  if(channel==="B"){
    const breakout=num(f.priorHigh20);
    if(breakout===null||breakout<=0) return {status:"UNKNOWN",reason:"MISSING_BREAKOUT_REFERENCE"};
    return {
      status:"OK",channel,
      planBuyLow:breakout*0.995,
      planBuyHigh:breakout*1.01,
      entry:breakout*1.003,
      stop:breakout-Math.max(atr*0.65,breakout*0.012),
      stopBinding:atr*0.65>=breakout*0.012?"ATR_0_65":"BREAKOUT_1_2PCT"
    };
  }
  if(channel==="A"){
    const support=num(f.support);
    if(support===null||support<=0) return {status:"UNKNOWN",reason:"MISSING_SUPPORT_REFERENCE"};
    const structureLow=num(f.recentLow5Prev) ?? support;
    const planBuyLow=support*0.995,planBuyHigh=support*1.018;
    const supportStop=support*0.98,structureAtrStop=structureLow-atr*0.12;
    return {
      status:"OK",channel,planBuyLow,planBuyHigh,
      entry:(planBuyLow+planBuyHigh)/2,
      stop:Math.min(supportStop,structureAtrStop),
      stopBinding:supportStop<=structureAtrStop?"SUPPORT_0_98":"STRUCTURE_LOW_MINUS_ATR_0_12"
    };
  }
  return {status:"UNKNOWN",reason:"CHANNEL_NOT_A_OR_B"};
}

function resistanceCandidates(feature,entry){
  const f=feature||{};
  const threshold=entry*1.01;
  const rows=[];
  const add=(source,value,date=null,meta={})=>{
    const n=num(value);
    if(n===null) return;
    rows.push({
      source,value:n,date,
      eligible:n>threshold,
      distancePct:(n/entry-1)*100,
      ...meta
    });
  };
  add("TARGET_PRICE",f.targetPrice,null,{
    provenance:{
      source:f.targetPriceSource??null,
      asOf:f.targetPriceAsOf??null,
      capturedAt:f.targetPriceCapturedAt??null,
      pointInTimeEligible:f.targetPricePointInTimeEligible===true?true:
        f.targetPricePointInTimeEligible===false?false:null
    }
  });
  add("PRIOR_HIGH20",f.priorHigh20);
  add("PRIOR_HIGH60",f.priorHigh60);

  const history=Array.isArray(f.history)?f.history.slice(0,-1):[];
  for(let i=2;i<history.length-2;i+=1){
    const h=num(history[i]?.high);
    const p1=num(history[i-1]?.high),p2=num(history[i-2]?.high);
    const n1=num(history[i+1]?.high),n2=num(history[i+2]?.high);
    if([h,p1,p2,n1,n2].some(x=>x===null)) continue;
    const pivot=h>=p1&&h>=p2&&h>=n1&&h>=n2;
    if(!pivot) continue;
    add("LOCAL_5BAR_PIVOT",h,String(history[i]?.date||"")||null,{historyIndex:i});
  }
  return rows;
}

function classifyFormalStage(formalResult){
  if(formalResult?.ok===true) return "RR_PASSED_FORMAL_OK";
  const reason=String(formalResult?.reason||"");
  if(reason===TARGET_NULL_REASON) return "TARGET_NULL_REJECTED";
  if(reason===LOW_RR_REASON) return "LOW_RR_REJECTED";
  if(reason===FINAL_GRADE_REASON) return "FINAL_GRADE_REJECTED_AFTER_RR_PASS";
  return "NOT_EVALUABLE_UNDER_FORMAL_ORDER";
}

export function buildTargetRrAudit(feature,{channel,formalResult,minRewardRisk=2}={}){
  const geometry=deriveFormalEntryStop(feature,channel);
  const formalStage=classifyFormalStage(formalResult);

  if(geometry.status!=="OK"){
    return {
      status:"UNKNOWN",formalStage,geometry,
      researchOnly:true,decisionImpact:false
    };
  }

  const candidates=resistanceCandidates(feature,geometry.entry);
  const eligible=candidates.filter(x=>x.eligible);
  const minTarget=eligible.length?Math.min(...eligible.map(x=>x.value)):null;
  const selectedSources=minTarget===null?[]:eligible
    .filter(x=>Math.abs(x.value-minTarget)<=1e-9)
    .map(x=>({source:x.source,date:x.date,value:x.value,provenance:x.provenance??null}));

  const targetNull=minTarget===null;
  const risk=geometry.entry-geometry.stop;
  const reward=targetNull?null:minTarget-geometry.entry;
  const rr=targetNull||!(risk>0)?null:reward/risk;
  const rrState=targetNull?"TARGET_NULL":
    !(risk>0)?"NON_POSITIVE_RISK":
    rr<minRewardRisk?"LOW_RR":"RR_PASS";

  const targetPriceCandidate=candidates.find(x=>x.source==="TARGET_PRICE")||null;
  const targetPricePresent=targetPriceCandidate!==null;
  const targetPriceProvenanceComplete=!targetPricePresent ? null :
    !!(targetPriceCandidate.provenance?.source &&
       targetPriceCandidate.provenance?.asOf &&
       targetPriceCandidate.provenance?.capturedAt &&
       targetPriceCandidate.provenance?.pointInTimeEligible!==null);

  const stageConsistent=
    (formalStage==="TARGET_NULL_REJECTED"&&rrState==="TARGET_NULL") ||
    (formalStage==="LOW_RR_REJECTED"&&rrState==="LOW_RR") ||
    (formalStage==="FINAL_GRADE_REJECTED_AFTER_RR_PASS"&&rrState==="RR_PASS") ||
    (formalStage==="RR_PASSED_FORMAL_OK"&&rrState==="RR_PASS") ||
    formalStage==="NOT_EVALUABLE_UNDER_FORMAL_ORDER";

  return {
    schemaVersion:"TARGET_RR_AUDIT_OBSERVER_V0_1",
    researchOnly:true,
    decisionImpact:false,
    formalStage,
    formalReason:formalResult?.reason??null,
    stageConsistent,
    channel,
    geometry:{
      entry:geometry.entry,stop:geometry.stop,risk,
      planBuyLow:geometry.planBuyLow,planBuyHigh:geometry.planBuyHigh,
      stopBinding:geometry.stopBinding
    },
    resistance:{
      eligibilityRule:"value > entry*1.01",
      thresholdPrice:geometry.entry*1.01,
      candidates,
      eligibleCandidates:eligible,
      selectedTarget:minTarget,
      selectedTargetSources:selectedSources,
      selectedSourceAmbiguous:selectedSources.length>1,
      targetNull
    },
    targetPrice:{
      present:targetPricePresent,
      eligible:targetPriceCandidate?.eligible??null,
      provenance:targetPriceCandidate?.provenance??null,
      provenanceComplete:targetPriceProvenanceComplete,
      provenanceState:!targetPricePresent?"ABSENT":
        targetPriceProvenanceComplete?"COMPLETE":"UNKNOWN"
    },
    rr:{
      state:rrState,
      reward,
      risk,
      value:rr,
      threshold:minRewardRisk
    }
  };
}

export const TARGET_RR_AUDIT_REASONS={
  TARGET_NULL_REASON,LOW_RR_REASON,FINAL_GRADE_REASON
};

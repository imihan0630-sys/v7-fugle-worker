function finite(value){
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}

function pctAbove(entry,value){
  return entry>0&&value!==null?((value/entry)-1)*100:null;
}

function addCandidate(out,{source,value,date=null,meta=null,entry}){
  const n=finite(value);
  if(n===null) return;
  const threshold=entry*1.01;
  const eligible=n>threshold;
  out.push({
    source,
    value:n,
    date:date||null,
    distancePct:pctAbove(entry,n),
    formalEligible:eligible,
    exclusionReason:eligible?null:"NOT_ABOVE_ENTRY_1PCT",
    meta:meta||null
  });
}

function pivotCandidates(history,entry){
  const rows=Array.isArray(history)?history.slice(0,-1):[];
  const out=[];
  for(let i=2;i<rows.length-2;i+=1){
    const h=finite(rows[i]?.high);
    const h1=finite(rows[i-1]?.high),h2=finite(rows[i-2]?.high);
    const p1=finite(rows[i+1]?.high),p2=finite(rows[i+2]?.high);
    if(h===null||h1===null||h2===null||p1===null||p2===null) continue;
    const isPivot=h>=h1&&h>=h2&&h>=p1&&h>=p2;
    if(!isPivot) continue;
    addCandidate(out,{
      source:"HISTORICAL_5BAR_PIVOT",
      value:h,
      date:String(rows[i]?.date||"").slice(0,10)||null,
      entry
    });
  }
  return out;
}

export function buildTargetResistanceProvenanceReceipt({
  feature={},entry,stop,channel=null,scanDate=null,targetPriceMeta=null,minRewardRisk=2
}={}){
  const e=finite(entry),s=finite(stop);
  if(e===null||e<=0) throw new Error("INVALID_ENTRY");
  const candidates=[];

  addCandidate(candidates,{
    source:"TARGET_PRICE",
    value:feature?.targetPrice,
    entry:e,
    meta:targetPriceMeta||{
      source:null,asOf:null,capturedAt:null,pointInTimeEligible:null
    }
  });
  addCandidate(candidates,{source:"PRIOR_HIGH20",value:feature?.priorHigh20,entry:e});
  addCandidate(candidates,{source:"PRIOR_HIGH60",value:feature?.priorHigh60,entry:e});
  candidates.push(...pivotCandidates(feature?.history,e));

  const eligible=candidates.filter(x=>x.formalEligible);
  const selectedTarget=eligible.length?Math.min(...eligible.map(x=>x.value)):null;
  const selectedMatches=selectedTarget===null?[]:eligible.filter(x=>Math.abs(x.value-selectedTarget)<1e-12);
  const selectedTargetSource=selectedMatches.length===1?selectedMatches[0].source:
    selectedMatches.length>1?"MULTIPLE_EQUAL_LEVELS":null;
  const selectedTargetDate=selectedMatches.length===1?selectedMatches[0].date:null;

  const targetPriceCandidate=candidates.find(x=>x.source==="TARGET_PRICE")||null;
  let targetPriceProvenanceState="ABSENT";
  if(targetPriceCandidate){
    const m=targetPriceCandidate.meta||{};
    targetPriceProvenanceState=m.source&&m.asOf&&m.capturedAt&&m.pointInTimeEligible===true
      ?"PIT_PROVENANCE_COMPLETE"
      :"PIT_PROVENANCE_UNKNOWN";
  }

  const risk=s===null?null:e-s;
  const reward=selectedTarget===null?null:selectedTarget-e;
  const rewardRisk=selectedTarget===null||risk===null||risk<=0?null:reward/risk;

  let state="UNKNOWN";
  let formalRejectReason=null;
  if(selectedTarget===null){
    state="TARGET_NULL";
    formalRejectReason="上方無可驗證實質壓力，無法計算真實RR";
  }else if(risk===null||risk<=0){
    state="RR_NOT_EVALUABLE_INVALID_RISK";
  }else if(rewardRisk<Number(minRewardRisk)){
    state="LOW_RR";
    formalRejectReason="預期RR低於2比1";
  }else{
    state="RR_PASS";
  }

  const formalSelectedTargetUsesUnprovenExternalSource=
    selectedMatches.some(x=>x.source==="TARGET_PRICE")&&targetPriceProvenanceState!=="PIT_PROVENANCE_COMPLETE";

  return {
    schemaVersion:"target-resistance-provenance-receipt-v0.1",
    scanDate:scanDate?String(scanDate):null,
    symbol:String(feature?.symbol||""),
    channel:channel||null,
    entry:e,
    stop:s,
    risk,
    thresholdPrice:e*1.01,
    candidates,
    eligibleResistanceLevels:eligible,
    selectedTarget,
    selectedTargetSource,
    selectedTargetDate,
    selectedSourceCount:selectedMatches.length,
    targetNull:selectedTarget===null,
    targetPriceRaw:finite(feature?.targetPrice),
    targetPriceProvenanceState,
    targetPriceMeta:targetPriceCandidate?.meta||targetPriceMeta||null,
    formalSelectedTargetUsesUnprovenExternalSource,
    reward,
    rewardRisk,
    minRewardRisk:Number(minRewardRisk),
    state,
    formalRejectReason,
    policy:"Receipt mirrors current Formal target selection by price. PIT provenance is reported separately and never changes the observed Formal target.",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}

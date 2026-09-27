function finite(value){
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}

function level(source,price,{date=null,provenanceState=null}={}){
  return {source,price,date,provenanceState};
}

export function auditTargetResistanceGeometry({feature={},entry,targetPriceMetadata=null}={}){
  const e=finite(entry);
  if(!(e>0)) return {
    schemaVersion:"target-resistance-geometry-audit-v0.1",
    status:"ENTRY_UNKNOWN",
    entry:e,threshold:null,candidates:[],eligibleResistanceLevels:[],
    selectedTarget:null,selectedTargetSources:[],selectedTargetSourceUnique:null,
    targetNull:true,targetNullReason:"ENTRY_NOT_FINITE_POSITIVE",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };

  const threshold=e*1.01;
  const candidates=[];
  const push=(source,value,meta={})=>{
    const p=finite(value);
    if(p===null) return;
    candidates.push({
      ...level(source,p,meta),
      eligible:p>threshold,
      distancePct:(p/e-1)*100
    });
  };

  const targetPrice=finite(feature?.targetPrice);
  if(targetPrice!==null){
    push("TARGET_PRICE",targetPrice,{
      provenanceState:"NO_CANONICAL_REPO_SOURCE_ASOF_KNOWNAT_CONTRACT",
      date:null
    });
  }
  push("PRIOR_HIGH_20",feature?.priorHigh20);
  push("PRIOR_HIGH_60",feature?.priorHigh60);

  const history=Array.isArray(feature?.history)?feature.history.slice(0,-1):[];
  for(let i=2;i<history.length-2;i+=1){
    const h=finite(history[i]?.high);
    if(h===null) continue;
    const p1=finite(history[i-1]?.high),p2=finite(history[i-2]?.high);
    const n1=finite(history[i+1]?.high),n2=finite(history[i+2]?.high);
    if([p1,p2,n1,n2].some(v=>v===null)) continue;
    const isPivot=h>=p1&&h>=p2&&h>=n1&&h>=n2;
    if(!isPivot) continue;
    push("LOCAL_PIVOT_HIGH",h,{date:String(history[i]?.date||"")||null});
  }

  const eligible=candidates.filter(x=>x.eligible);
  const selectedTarget=eligible.length?Math.min(...eligible.map(x=>x.price)):null;
  const selected=selectedTarget===null?[]:eligible.filter(x=>x.price===selectedTarget);
  const excludedByBand=candidates.filter(x=>!x.eligible);

  let targetNullReason=null;
  if(selectedTarget===null){
    targetNullReason=candidates.length
      ?"NO_CANDIDATE_STRICTLY_ABOVE_ENTRY_X_1_01"
      :"NO_FINITE_RESISTANCE_CANDIDATES";
  }

  const historicalCandidates=candidates.filter(x=>x.source!=="TARGET_PRICE");
  const maxHistorical=historicalCandidates.length?Math.max(...historicalCandidates.map(x=>x.price)):null;
  const blueSkyLike=maxHistorical!==null?maxHistorical<=e:null;

  return {
    schemaVersion:"target-resistance-geometry-audit-v0.1",
    status:"OBSERVED_FROM_SAME_SCAN_FEATURE",
    entry:e,threshold,
    candidates,
    eligibleResistanceLevels:eligible,
    excludedByOnePercentBand:excludedByBand,
    selectedTarget,
    selectedTargetSources:selected.map(x=>({source:x.source,date:x.date,price:x.price,provenanceState:x.provenanceState||null})),
    selectedTargetSourceUnique:selected.length===1?selected[0].source:null,
    selectedTargetSourceTie:selected.length>1,
    targetNull:selectedTarget===null,
    targetNullReason,
    targetPrice:{
      raw:targetPrice,
      metadataProvided:targetPriceMetadata||null,
      canonicalProvenanceState:targetPrice===null
        ?"NOT_PRESENT"
        :"NO_CANONICAL_REPO_SOURCE_ASOF_KNOWNAT_CONTRACT"
    },
    historicalMaxCandidate:maxHistorical,
    blueSkyLikeHistoricalContext:blueSkyLike,
    ruleMirror:"Formal eligibility is strict price > entry*1.01; selected target is minimum eligible price. Source ties are preserved as multiple sources because Formal has no source tie-break.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

export function classifyTargetRrGradeScarcity({
  geometry,stop,minRewardRisk=2,setupQuality=null,signalGradeBMin=65,
  upstreamFormalGatesObservedPass=false
}={}){
  const entry=finite(geometry?.entry);
  const s=finite(stop);
  if(!(entry>0)||s===null){
    return {
      schemaVersion:"target-rr-grade-scarcity-v0.1",
      state:"GEOMETRY_UNKNOWN",reward:null,risk:null,rewardRisk:null,
      upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  const risk=entry-s;
  if(!(risk>0)){
    return {
      schemaVersion:"target-rr-grade-scarcity-v0.1",
      state:"RISK_NONPOSITIVE_OR_INVALID",reward:null,risk,rewardRisk:null,
      upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  const target=finite(geometry?.selectedTarget);
  if(target===null){
    return {
      schemaVersion:"target-rr-grade-scarcity-v0.1",
      state:"TARGET_NULL",reward:null,risk,rewardRisk:null,
      targetNullReason:geometry?.targetNullReason||"UNKNOWN",
      upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
      interpretation:"RR is undefined. Do not coerce TARGET_NULL to RR=0.",
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  const reward=target-entry;
  const rr=reward/risk;
  if(rr<Number(minRewardRisk)){
    return {
      schemaVersion:"target-rr-grade-scarcity-v0.1",
      state:"LOW_RR",reward,risk,rewardRisk:rr,target,
      threshold:Number(minRewardRisk),
      upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  const quality=finite(setupQuality);
  if(quality===null){
    return {
      schemaVersion:"target-rr-grade-scarcity-v0.1",
      state:"RR_PASSED_GRADE_UNKNOWN",reward,risk,rewardRisk:rr,target,
      upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  if(quality<Number(signalGradeBMin)){
    return {
      schemaVersion:"target-rr-grade-scarcity-v0.1",
      state:"FINAL_GRADE_REJECTED",reward,risk,rewardRisk:rr,target,
      setupQuality:quality,gradeThreshold:Number(signalGradeBMin),
      upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  return {
    schemaVersion:"target-rr-grade-scarcity-v0.1",
    state:"TARGET_RR_GRADE_PASS",reward,risk,rewardRisk:rr,target,
    setupQuality:quality,gradeThreshold:Number(signalGradeBMin),
    upstreamFormalGatesObservedPass:Boolean(upstreamFormalGatesObservedPass),
    warning:upstreamFormalGatesObservedPass
      ?"All target/RR/grade states observed after upstream-pass context; still research-only."
      :"Do not interpret this as Formal-qualified because upstream gate passage is not proven by this observer alone.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

export function summarizeTargetRrGradeScarcity(rows=[]){
  const counts={TARGET_NULL:0,LOW_RR:0,FINAL_GRADE_REJECTED:0,TARGET_RR_GRADE_PASS:0,RR_PASSED_GRADE_UNKNOWN:0,GEOMETRY_UNKNOWN:0,RISK_NONPOSITIVE_OR_INVALID:0};
  const sourceCounts={};
  const targetNullReasons={};
  let upstreamPassRows=0;
  for(const row of Array.isArray(rows)?rows:[]){
    if(row?.upstreamFormalGatesObservedPass===true) upstreamPassRows+=1;
    if(counts[row?.state]!==undefined) counts[row.state]+=1;
    if(row?.state==="TARGET_NULL"){
      const reason=String(row?.targetNullReason||"UNKNOWN");
      targetNullReasons[reason]=(targetNullReasons[reason]||0)+1;
    }
    for(const src of (row?.selectedTargetSources||[])){
      const key=String(src?.source||"UNKNOWN");
      sourceCounts[key]=(sourceCounts[key]||0)+1;
    }
  }
  return {
    schemaVersion:"target-rr-grade-scarcity-summary-v0.1",
    rows:Array.isArray(rows)?rows.length:0,
    upstreamPassRows,counts,sourceCounts,targetNullReasons,
    rule:"TARGET_NULL, LOW_RR and FINAL_GRADE_REJECTED are distinct states. Counts are descriptive unless the parent denominator and upstream-pass context are complete.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

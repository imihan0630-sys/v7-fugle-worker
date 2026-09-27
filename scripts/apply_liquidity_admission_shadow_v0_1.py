from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

if 'const VERSION = "8.14.0-sector-gate-provenance-shadow";' not in text:
    raise SystemExit("expected V8.14.0 built Worker before liquidity-admission Shadow prototype")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

helper=r'''function buildLiquidityAdmissionResearchAudit(f) {
  const close=toNumber(f?.close);
  const minLots=close!==null && close>=THOUSAND_STOCK_PRICE ? 300 : 1000;
  const avgVolume20Lots=toNumber(f?.avgVolume20Lots);
  const avgAmount20=toNumber(f?.avgAmount20);
  const spreadPercent=toNumber(f?.spreadPercent);
  const orderBookDepthGoodObserved=typeof f?.orderBookDepthGood==="boolean";
  const orderBookDepthGood=orderBookDepthGoodObserved ? f.orderBookDepthGood : null;
  const depthScore=toNumber(f?.depthScore);
  const depthEvidenceObserved=orderBookDepthGoodObserved || depthScore!==null;
  const exceptionInputCoverage=
    spreadPercent!==null && depthEvidenceObserved ? "COMPLETE" :
    spreadPercent!==null || depthEvidenceObserved ? "PARTIAL" : "ABSENT";
  const amountPass=avgAmount20===null?null:avgAmount20>=50000000;
  const spreadPass=spreadPercent===null?null:spreadPercent<=0.5;
  const goodDepth=depthEvidenceObserved ? (orderBookDepthGood===true || (depthScore!==null && depthScore>=80)) : null;
  const belowPrimaryMin=avgVolume20Lots===null?null:avgVolume20Lots<minLots;
  const liquidityExceptionPass=belowPrimaryMin===true
    ? (amountPass===true && spreadPass===true && goodDepth===true)
    : false;
  const exceptionFailureReasons=[];
  if(belowPrimaryMin===true && liquidityExceptionPass!==true) {
    if(amountPass===false) exceptionFailureReasons.push("AVG_AMOUNT_BELOW_50M");
    if(spreadPercent===null) exceptionFailureReasons.push("SPREAD_MISSING");
    else if(spreadPass===false) exceptionFailureReasons.push("SPREAD_GT_0_5");
    if(!depthEvidenceObserved) exceptionFailureReasons.push("DEPTH_EVIDENCE_MISSING");
    else if(goodDepth===false) exceptionFailureReasons.push("DEPTH_NOT_GOOD");
  }
  const marketCapYi=toNumber(f?.marketCapYi);
  const inst=institutionalScore(f);
  const smallCapSpecialPass=marketCapYi!==null && marketCapYi<30
    ? (avgVolume20Lots!==null && avgVolume20Lots>=minLots*1.5 && inst>=70)
    : null;
  const midCapExtraPass=marketCapYi!==null && marketCapYi<100
    ? (avgVolume20Lots!==null && (avgVolume20Lots>=minLots*1.2 || liquidityExceptionPass===true))
    : null;
  return {
    auditVersion:"LIQUIDITY_ADMISSION_AUDIT_V0_1",
    researchOnly:true,decisionImpact:false,
    minLots,close,marketCapYi,
    avgVolume20Lots,
    volumeThresholdRatio:avgVolume20Lots===null?null:avgVolume20Lots/minLots,
    avgAmount20,
    spreadPercent,
    orderBookDepthGood,
    depthScore,
    exceptionInputCoverage,
    exceptionInputs:{
      amountPass,spreadObserved:spreadPercent!==null,spreadPass,
      depthEvidenceObserved,goodDepth
    },
    belowPrimaryMin,
    liquidityExceptionPass,
    exceptionFailureReasons,
    formalMissingnessEffect:belowPrimaryMin===true && (spreadPercent===null || !depthEvidenceObserved)
      ? "MISSING_EXCEPTION_INPUTS_CAUSE_FORMAL_EXCEPTION_FAILURE"
      : "NO_MISSINGNESS_CAUSAL_CLAIM",
    institutionalScore:round(inst,2),
    smallCapSpecialPass,
    midCapExtraPass,
    sourceState:{
      spreadDepthFormalFields:"PRODUCTION_COVERAGE_UNKNOWN",
      note:"Formal reads spreadPercent/orderBookDepthGood/depthScore; repository-side producer is not proven and external enrichment injection is feasible."
    }
  };
}

function buildLiquidityAdmissionRejectedResearch(features,sectorFor,scanDate) {
  const exactReasons=[
    ["20日流動性不足","LIQ_LOW_AVG_VOLUME_REJECTED"],
    ["10至30億市值缺少強力特殊理由","LIQ_SMALLCAP_SPECIAL_REASON_REJECTED"],
    ["30至100億市值流動性要求未達","LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED"]
  ];
  const rows=[];
  const populationCounts={};
  const exceptionPassCounts={GENERAL:0,THOUSAND:0};
  const coverageCounts={COMPLETE:0,PARTIAL:0,ABSENT:0};
  const belowPrimaryMinCoverageCounts={COMPLETE:0,PARTIAL:0,ABSENT:0};
  const belowPrimaryMinFailureReasonCounts={};
  let belowPrimaryMinTotal=0;

  for(const f of (Array.isArray(features)?features:[])) {
    const audit=buildLiquidityAdmissionResearchAudit(f);
    coverageCounts[audit.exceptionInputCoverage]=(coverageCounts[audit.exceptionInputCoverage]||0)+1;
    if(audit.belowPrimaryMin===true) {
      belowPrimaryMinTotal+=1;
      belowPrimaryMinCoverageCounts[audit.exceptionInputCoverage]=(belowPrimaryMinCoverageCounts[audit.exceptionInputCoverage]||0)+1;
      for(const reason of (audit.exceptionFailureReasons||[])) {
        belowPrimaryMinFailureReasonCounts[reason]=(belowPrimaryMinFailureReasonCounts[reason]||0)+1;
      }
    }
    const pool=(toNumber(f?.close)||0)>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL";
    if(audit.liquidityExceptionPass===true) exceptionPassCounts[pool]+=1;
    const result=scoreCandidate(f,sectorFor(f));
    const reason=String(result?.reason||"");
    const match=exactReasons.find(([formalReason])=>formalReason===reason);
    if(!match) continue;
    const [,cohort]=match;
    populationCounts[cohort] ||= {GENERAL:0,THOUSAND:0};
    populationCounts[cohort][pool]+=1;
    rows.push({f,result,audit,pool,cohort,reason});
  }

  const samples=[];
  for(const [formalReason,cohort] of exactReasons) {
    for(const pool of ["GENERAL","THOUSAND"]) {
      const group=rows.filter(x=>x.cohort===cohort && x.pool===pool).sort((a,b)=>{
        const ah=researchStableHash(String(scanDate)+"|LIQ|"+cohort+"|"+pool+"|"+String(a.f?.symbol||""));
        const bh=researchStableHash(String(scanDate)+"|LIQ|"+cohort+"|"+pool+"|"+String(b.f?.symbol||""));
        return (ah-bh)||String(a.f?.symbol||"").localeCompare(String(b.f?.symbol||""));
      });
      const sampled=group.slice(0,6);
      sampled.forEach((row,index)=>samples.push({
        ...row,
        reasonPopulationCount:group.length,
        reasonSampleCount:sampled.length,
        reasonSampleRank:index+1
      }));
    }
  }

  return {
    schemaVersion:"liquidity-admission-rejected-shadow-v0.1",
    researchOnly:true,decisionImpact:false,outcomeSelected:false,
    populationCounts,exceptionPassCounts,
    exceptionInputCoverageCounts:coverageCounts,
    belowPrimaryMinTotal,
    belowPrimaryMinExceptionInputCoverageCounts:belowPrimaryMinCoverageCounts,
    belowPrimaryMinFailureReasonCounts,
    samples
  };
}'''

replace_once(
'''function buildShadowCandidateEntry(audit,cohort,cohortRank,scanDate,selectedFlag=false) {''',
helper+"\n\n"+'''function buildShadowCandidateEntry(audit,cohort,cohortRank,scanDate,selectedFlag=false) {''',
"insert liquidity audit helpers"
)

replace_once(
'''  snapshot.sourceCompleteness="SHADOW_PROSPECTIVE";''',
'''  snapshot.liquidityAdmissionAudit=buildLiquidityAdmissionResearchAudit(f);
  snapshot.sourceCompleteness="SHADOW_PROSPECTIVE";''',
"attach liquidity audit to every Shadow row"
)

replace_once(
'''  const baseCandidates=(basePoolDiagnostics||[])''',
'''  const liquidityRejected=buildLiquidityAdmissionRejectedResearch(features,sectorFor,scanDate);
  let liquidityRejectedRank=0;
  for(const sample of liquidityRejected.samples) {
    if(used.has(String(sample.f?.symbol||""))) continue;
    const before=out.length;
    liquidityRejectedRank+=1;
    add(sample.f,sample.result,sample.cohort,liquidityRejectedRank,false);
    if(out.length>before) {
      const entry=out[out.length-1];
      entry.snapshot.liquidityAdmissionAudit={
        ...(entry.snapshot.liquidityAdmissionAudit||{}),
        exactFormalRejectReason:sample.reason,
        reasonPopulationCount:sample.reasonPopulationCount,
        reasonSampleCount:sample.reasonSampleCount,
        reasonSampleRank:sample.reasonSampleRank,
        samplingUnit:"EXACT_LIQUIDITY_REASON_X_PRICE_POOL",
        fullFormalCounterfactual:false,
        note:"Early liquidity reject; downstream Formal gates were not reached. Do not label as would-have-qualified."
      };
    }
  }

  const baseCandidates=(basePoolDiagnostics||[])''',
"add dedicated liquidity rejected cohorts"
)

replace_once(
'''    rows:out,
    counts:out.reduce((acc,row)=>{acc[row.cohort]=(acc[row.cohort]||0)+1;return acc},{}),
    policy:''',
'''    rows:out,
    counts:out.reduce((acc,row)=>{acc[row.cohort]=(acc[row.cohort]||0)+1;return acc},{}),
    liquidityAdmissionResearch:{
      schemaVersion:liquidityRejected.schemaVersion,
      populationCounts:liquidityRejected.populationCounts,
      exceptionPassCounts:liquidityRejected.exceptionPassCounts,
      exceptionInputCoverageCounts:liquidityRejected.exceptionInputCoverageCounts,
      belowPrimaryMinTotal:liquidityRejected.belowPrimaryMinTotal,
      belowPrimaryMinExceptionInputCoverageCounts:liquidityRejected.belowPrimaryMinExceptionInputCoverageCounts,
      belowPrimaryMinFailureReasonCounts:liquidityRejected.belowPrimaryMinFailureReasonCounts,
      outcomeSelected:false,decisionImpact:false
    },
    policy:''',
"expose liquidity admission denominator"
)

replace_once(
'''      generatedCounts: scan.shadowArchive?.counts || {},''',
'''      generatedCounts: scan.shadowArchive?.counts || {},
      liquidityAdmissionResearch: scan.shadowArchive?.liquidityAdmissionResearch || null,''',
"scan summary liquidity research"
)

path.write_text(text,encoding="utf-8")
print("Applied research-only liquidity admission Shadow prototype")

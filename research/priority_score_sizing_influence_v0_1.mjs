// Research-only decomposition of PriorityScore's post-selection sizing influence.
// It does not reproduce selection/gates and must never be interpreted as causal factor attribution.

function n(v){const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(p){return String(p?.symbol??p?.code??"").trim()}

export function prioritySizingInfluence(plans=[]){
  const rows=(plans||[]).map(p=>({
    symbol:sym(p),
    score:n(p?.priorityScore??p?.priority_score),
    allocation:n(p?.totalAllocation??p?.total_allocation),
    stopRiskPct:n(p?.conservativeStopRiskPct??p?.stopRiskPctHigh)
  })).filter(x=>x.symbol&&x.score!==null&&x.allocation!==null&&x.allocation>=0);
  const scoreSum=rows.reduce((s,x)=>s+x.score,0);
  const allocSum=rows.reduce((s,x)=>s+x.allocation,0);
  if(rows.length<2||!(scoreSum>0)||!(allocSum>0)) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE",rows:[]};
  const equal=allocSum/rows.length;
  const details=rows.map(x=>{
    const scoreShare=x.score/scoreSum;
    const allocShare=x.allocation/allocSum;
    const scoreImpliedAllocation=allocSum*scoreShare;
    const sizingTilt=x.allocation-equal;
    const riskFrac=x.stopRiskPct!==null?x.stopRiskPct/100:null;
    return {
      symbol:x.symbol,priorityScore:x.score,
      scoreSharePct:round(scoreShare*100,4),
      allocationNTD:round(x.allocation,2),
      allocationSharePct:round(allocShare*100,4),
      equalCapitalNTD:round(equal,2),
      sizingTiltVsEqualNTD:round(sizingTilt,2),
      sizingTiltVsEqualPctOfDeployment:round(sizingTilt/allocSum*100,4),
      scoreImpliedAllocationNTD:round(scoreImpliedAllocation,2),
      implementationResidualVsScoreProportionalNTD:round(x.allocation-scoreImpliedAllocation,2),
      conservativeStopRiskPct:x.stopRiskPct,
      incrementalProjectedStopRiskVsEqualNTD:riskFrac===null?null:round(sizingTilt*riskFrac,2)
    };
  });
  const positiveTilt=details.filter(x=>x.sizingTiltVsEqualNTD>0);
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedNames:rows.length,totalDeploymentNTD:round(allocSum,2),
    positiveTiltSymbols:positiveTilt.map(x=>x.symbol),
    maxAbsoluteImplementationResidualNTD:round(Math.max(...details.map(x=>Math.abs(x.implementationResidualVsScoreProportionalNTD))),2),
    details,
    semantics:"POST_SELECTION_SIZING_INFLUENCE_ONLY. Does not measure gate, selection, comparator, causal factor, expected return, or realized return."
  };
}

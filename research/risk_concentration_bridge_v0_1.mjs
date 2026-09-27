// Risk concentration bridge decomposition v0.1 — research-only.
// Descriptive algebra only; not causal attribution.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function decomposeRiskConcentration({selectedCount,currentHHI,equalCapitalHHI,globalMinHHI}={}){
  const k=n(selectedCount),cur=n(currentHHI),eq=n(equalCapitalHHI),g=n(globalMinHHI);
  if(!Number.isInteger(k)||k<2||cur===null||eq===null||g===null) return {status:"UNKNOWN"};
  const ideal=1/k;
  if(cur<0||eq<0||g<0) return {status:"UNKNOWN"};
  const totalIdealExcess=cur-ideal;
  const equalGeometryExcess=eq-ideal;
  const sizingIncrement=cur-eq;
  const totalFeasibleExcess=cur-g;
  const equalToFeasibleGap=eq-g;
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount:k,
    theoreticalEqualContributionHHI:round(ideal),
    currentHHI:round(cur),
    equalCapitalHHI:round(eq),
    globalFeasibleMinHHI:round(g),
    theoreticalBridge:{
      totalObservedExcessHHI:round(totalIdealExcess),
      equalCapitalStopGeometryExcessHHI:round(equalGeometryExcess),
      prioritySizingIncrementHHI:round(sizingIncrement),
      geometryShareOfObservedExcessPct:totalIdealExcess>0?round(equalGeometryExcess/totalIdealExcess*100,6):null,
      sizingShareOfObservedExcessPct:totalIdealExcess>0?round(sizingIncrement/totalIdealExcess*100,6):null,
      identityResidual:round(totalIdealExcess-equalGeometryExcess-sizingIncrement,12)
    },
    feasibleBridge:{
      currentAboveGlobalMinHHI:round(totalFeasibleExcess),
      equalCapitalAboveGlobalMinHHI:round(equalToFeasibleGap),
      prioritySizingIncrementHHI:round(sizingIncrement),
      neutralCapitalShareOfGapPct:totalFeasibleExcess>0?round(equalToFeasibleGap/totalFeasibleExcess*100,6):null,
      sizingShareOfGapPct:totalFeasibleExcess>0?round(sizingIncrement/totalFeasibleExcess*100,6):null,
      identityResidual:round(totalFeasibleExcess-equalToFeasibleGap-sizingIncrement,12)
    },
    semantics:"Exact descriptive bridge using equal-capital as an intermediate counterfactual. Shares are not causal variance attribution and components are not statistically independent."
  };
}

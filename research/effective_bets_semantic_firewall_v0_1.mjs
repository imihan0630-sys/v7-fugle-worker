// D15 Effective Bets semantic firewall v0.1 — research-only.
// Prevents inverse-HHI concentration counts from being misreported as covariance-adjusted independent bets.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function inverseHhiEffectiveNames(hhi){
  const x=n(hhi);
  if(!(x>0&&x<=1)) return {status:"UNKNOWN",reason:"INVALID_HHI"};
  return {
    status:"READY",
    hhi:round(x,8),
    concentrationEffectiveNames:round(1/x,6),
    semantics:"INVERSE_HHI_CONCENTRATION_EQUIVALENT_COUNT_ONLY",
    independentBets:false
  };
}

export function effectiveBetsEligibility({
  covarianceEvidence="UNKNOWN",
  alignedReturnHistory="UNKNOWN",
  riskFactorDefinition="UNKNOWN",
  factorRiskContribution="UNKNOWN"
}={}){
  const fields={covarianceEvidence,alignedReturnHistory,riskFactorDefinition,factorRiskContribution};
  const ready=Object.values(fields).every(v=>String(v).toUpperCase()==="READY");
  return {
    status:ready?"ELIGIBLE_FOR_SEPARATE_EFFECTIVE_BETS_RESEARCH":"NOT_ELIGIBLE",
    independentBetsClaimAllowed:ready,
    missing:Object.entries(fields).filter(([,v])=>String(v).toUpperCase()!=="READY").map(([k])=>k),
    rule:"Inverse HHI alone never establishes independent bets. Effective Bets requires a frozen factor/risk decomposition plus PIT-aligned covariance evidence."
  };
}

export function classifyDiversificationEvidence({capitalHhi,riskHhi,...evidence}={}){
  const cap=inverseHhiEffectiveNames(capitalHhi);
  const risk=inverseHhiEffectiveNames(riskHhi);
  const elig=effectiveBetsEligibility(evidence);
  return {
    status:(cap.status==="READY"||risk.status==="READY")?"READY":"UNKNOWN",
    capital:cap,
    projectedRisk:risk,
    effectiveBetsEligibility:elig,
    safeLabels:{
      capital:"CONCENTRATION_EFFECTIVE_NAMES",
      projectedRisk:"PROJECTED_RISK_CONCENTRATION_EFFECTIVE_NAMES",
      forbiddenWithoutEligibility:"EFFECTIVE_INDEPENDENT_BETS"
    },
    semantics:"Concentration-equivalent counts summarize weight dispersion only. They do not encode covariance, common-factor exposure, crisis dependence or independent risk sources."
  };
}

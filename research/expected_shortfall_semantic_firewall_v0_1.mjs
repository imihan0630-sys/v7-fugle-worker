// Expected Shortfall semantic firewall v0.1 — research-only.
// Prevents deterministic stop geometry or excursion metrics from being mislabeled Expected Shortfall.

function present(v){return !(v===null||v===undefined||String(v).trim()==="")}
export function classifyExpectedShortfallClaim(input={}){
  const sourceType=String(input.sourceType??"").trim().toUpperCase();
  const hasDistribution=Boolean(input.lossDistributionAvailable);
  const hasConfidence=present(input.confidenceLevel);
  const hasHorizon=present(input.horizon);
  const hasPIT=Boolean(input.pointInTimeEligible);
  const sufficientSample=Boolean(input.sufficientTailSample);
  const blockers=[];
  if(!hasDistribution)blockers.push("LOSS_DISTRIBUTION_MISSING");
  if(!hasConfidence)blockers.push("CONFIDENCE_LEVEL_MISSING");
  if(!hasHorizon)blockers.push("HORIZON_MISSING");
  if(!hasPIT)blockers.push("PIT_ELIGIBILITY_MISSING");
  if(!sufficientSample)blockers.push("TAIL_SAMPLE_INSUFFICIENT");
  if(["PLANNED_STOP_RISK","STOP_DISTANCE","MFE","MAE","STOP_FIRST_RATE"].includes(sourceType)){
    blockers.push("SOURCE_IS_NOT_TAIL_LOSS_DISTRIBUTION");
  }
  return {
    status:blockers.length?"NOT_ES_ELIGIBLE":"ES_RESEARCH_ELIGIBLE",
    blockers:[...new Set(blockers)],
    permittedLabel:blockers.length?"SCENARIO_OR_PATH_RISK_ONLY":"EXPECTED_SHORTFALL_RESEARCH",
    semantics:"Expected Shortfall requires a tail loss distribution at a specified confidence level and horizon. Deterministic stop-loss geometry and path excursions are not ES."
  };
}

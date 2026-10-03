export const KELLY_STATUS = Object.freeze({
  ELIGIBLE: "ELIGIBLE",
  INELIGIBLE: "INELIGIBLE",
  UNKNOWN: "UNKNOWN",
});

const present = (v) => v !== null && v !== undefined && v !== "";

export function validateKellyInput(r = {}) {
  const reasons = [];
  const pitRequired = [
    "predictionId","generationId","symbol","decisionAt",
    "targetDefinition","outcomeHorizon","exitPolicy",
    "predictionDistribution","calibrationMethodId","calibrationTrainingCutoff"
  ];
  for (const k of pitRequired) if (!present(r[k])) reasons.push("MISSING_"+k.toUpperCase());

  if (present(r.decisionAt) && present(r.calibrationTrainingCutoff)) {
    const d=Date.parse(r.decisionAt), c=Date.parse(r.calibrationTrainingCutoff);
    if (!Number.isFinite(d) || !Number.isFinite(c)) reasons.push("INVALID_TIME");
    else if (c >= d) reasons.push("CALIBRATION_CUTOFF_NOT_BEFORE_DECISION");
  }

  if (r.usesFutureLabel === true) reasons.push("LOOKAHEAD_LABEL");
  if (r.decisionMutatedAfterOutcome === true) reasons.push("POST_OUTCOME_DECISION_MUTATION");
  if (r.commonSupportEligible === false) reasons.push("OUTSIDE_COMMON_SUPPORT");

  if (reasons.length) return {status:KELLY_STATUS.INELIGIBLE,reasons};

  const unknown=[];
  if (!present(r.uncertaintyStatus)) unknown.push("UNCERTAINTY");
  if (!present(r.costEvidenceStatus)) unknown.push("COST_EVIDENCE");
  if (!present(r.executionEvidenceStatus)) unknown.push("EXECUTION_EVIDENCE");
  if (!present(r.dependenceEvidenceStatus)) unknown.push("DEPENDENCE_EVIDENCE");

  return {
    status: KELLY_STATUS.ELIGIBLE,
    reasons: [],
    unknown,
    enabledVariants: {
      fullKelly: true,
      fractionalKelly: true,
      uncertaintyShrunkKelly: !unknown.includes("UNCERTAINTY"),
      drawdownConstrainedKelly: true,
      portfolioKelly: !unknown.includes("DEPENDENCE_EVIDENCE"),
      netOfCostKelly: !unknown.includes("COST_EVIDENCE"),
      realizedExecutionKelly: !unknown.includes("EXECUTION_EVIDENCE"),
    }
  };
}

export function binaryKellyFraction({p,b}) {
  if (!(p>=0 && p<=1) || !(b>0)) throw new Error("INVALID_BINARY_KELLY_INPUT");
  const q=1-p;
  return Math.max(0,(b*p-q)/b);
}

export function expectedLogGrowth({fraction, scenarios}) {
  if (!(fraction>=0) || !Array.isArray(scenarios) || scenarios.length===0) throw new Error("INVALID_SCENARIO_INPUT");
  let ps=0,g=0;
  for (const s of scenarios) {
    if (!(s.p>=0) || !Number.isFinite(s.r)) throw new Error("INVALID_SCENARIO");
    const wealth=1+fraction*s.r;
    if (!(wealth>0)) return -Infinity;
    ps+=s.p; g+=s.p*Math.log(wealth);
  }
  if (Math.abs(ps-1)>1e-9) throw new Error("PROBABILITIES_MUST_SUM_TO_ONE");
  return g;
}

export function gridScenarioKelly({scenarios,maxFraction=1,step=0.001}) {
  if (!(maxFraction>=0) || !(step>0)) throw new Error("INVALID_GRID");
  let best={fraction:0,expectedLogGrowth:expectedLogGrowth({fraction:0,scenarios})};
  for(let f=step;f<=maxFraction+1e-12;f+=step){
    const ff=Math.min(maxFraction,Number(f.toFixed(12)));
    const g=expectedLogGrowth({fraction:ff,scenarios});
    if(g>best.expectedLogGrowth) best={fraction:ff,expectedLogGrowth:g};
  }
  return best;
}

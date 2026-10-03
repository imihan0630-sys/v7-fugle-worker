// D01 DL-026 crossing-opportunity control availability auditor v0.1
// Research-only; does not compute a recurrence score.

const REQUIRED=[
  "parentZoneWidthPct",
  "parentZoneWidthATR",
  "boundaryDistancePathAvailable",
  "episodeAgeEligibleSessions",
  "observableEligibleSessionsAtRisk",
  "constrainedEligibleSessionsAtRisk",
  "atrOrVolatilityReceiptRef",
  "tickRuleVersion",
  "relativeTick",
  "liquidityState",
  "priceLimitSessionProvenance",
  "priceVolumeAcceptanceReceiptRef",
  "marketSectorRegimeReceiptRef"
];

export function auditCrossingOpportunityControls(x={}){
  const missing=[];
  for(const k of REQUIRED){
    const v=x[k];
    if(v===null||v===undefined||v==="") missing.push(k);
  }
  return {
    status:missing.length?"CONTROL_INCOMPLETE":"CONTROL_BUNDLE_COMPLETE",
    missing,
    structuralRecurrenceResidualEligible:missing.length===0,
    rawCycleRatePromotionEligible:false,
    missingDataSemantics:missing.length?"UNKNOWN":"COMPLETE",
    formalCoreImpact:"NONE"
  };
}

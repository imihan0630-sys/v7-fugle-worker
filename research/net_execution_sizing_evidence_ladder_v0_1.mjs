// Net execution sizing evidence ladder v0.1 — research-only.
// Reuses Portfolio Risk + Trading Frictions evidence semantics.
// It classifies claim eligibility; it does not estimate missing costs.

function text(v){return String(v??"").trim().toUpperCase()}
function yes(v){return v===true}

const COST_QUALITY=["ACTUAL","PARTIAL_ACTUAL","MODELED","UNKNOWN"];

export function classifyNetSizingEvidence(raw={}){
  const blockers=[];
  const generation=raw.generationCertified;
  const positiveSignal=raw.positiveSignalCertified;
  const orderable=raw.counterfactualOrderable;
  const fillAttributed=raw.confirmedFillAttributed;
  const terminalMode=text(raw.terminalEvidenceMode);
  const commission=text(raw.commissionQuality||"UNKNOWN");
  const tax=text(raw.taxQuality||"UNKNOWN");
  const slippage=text(raw.slippageQuality||"UNKNOWN");
  const sameCohort=raw.sameSelectedNamesAndDeployment;
  const comparatorExecution=raw.comparatorExecutionDefined;
  const cashTreatment=raw.untriggeredCapitalCashTreatmentFrozen;

  if(!yes(generation)) blockers.push("GENERATION_NOT_CERTIFIED");
  if(!yes(positiveSignal)) blockers.push("POSITIVE_SIGNAL_NOT_CERTIFIED");
  if(!yes(orderable)) blockers.push("COUNTERFACTUAL_ORDERABILITY_NOT_CERTIFIED");
  if(!yes(fillAttributed)) blockers.push("CONFIRMED_FILL_NOT_SIGNAL_ATTRIBUTED");
  if(!yes(sameCohort)) blockers.push("COMPARATOR_COHORT_NOT_FIXED");
  if(!yes(comparatorExecution)) blockers.push("COMPARATOR_EXECUTION_NOT_DEFINED");
  if(!yes(cashTreatment)) blockers.push("UNTRIGGERED_CAPITAL_CASH_TREATMENT_NOT_FROZEN");
  if(!["ATTRIBUTED_TERMINAL_FILL","FIXED_EXECUTION_HORIZON_WITH_MARK"].includes(terminalMode)) blockers.push("TERMINAL_OR_HORIZON_EVIDENCE_MISSING");

  if(!COST_QUALITY.includes(commission)) blockers.push("INVALID_COMMISSION_QUALITY");
  if(!COST_QUALITY.includes(tax)) blockers.push("INVALID_TAX_QUALITY");
  if(!COST_QUALITY.includes(slippage)) blockers.push("INVALID_SLIPPAGE_QUALITY");

  const grossExecutionEligible=blockers.filter(x=>!x.startsWith("INVALID_")).length===0;
  const explicitNetEligible=grossExecutionEligible && commission!=="UNKNOWN" && tax!=="UNKNOWN";
  const allInNetEligible=explicitNetEligible && slippage!=="UNKNOWN";

  let strongestClaim="NOT_EXECUTION_ELIGIBLE";
  if(grossExecutionEligible) strongestClaim="GROSS_EXECUTION_SIZING_EDGE_ELIGIBLE";
  if(explicitNetEligible) strongestClaim="NET_EXPLICIT_SIZING_EDGE_ELIGIBLE";
  if(allInNetEligible) strongestClaim="NET_ALL_IN_SIZING_EDGE_ELIGIBLE";

  const quality={
    commission,tax,slippage,
    containsModeled:[commission,tax,slippage].includes("MODELED"),
    containsPartialActual:[commission,tax,slippage].includes("PARTIAL_ACTUAL"),
    fullyActual:commission==="ACTUAL"&&tax==="ACTUAL"&&slippage==="ACTUAL"
  };

  return {
    status:strongestClaim,
    grossExecutionEligible,
    explicitNetEligible,
    allInNetEligible,
    blockers,
    quality,
    labelingRule:quality.fullyActual
      ?"ACTUAL_NET_EXECUTION"
      : quality.containsModeled
        ?"MODELED_OR_MIXED_NET_EXECUTION"
        : quality.containsPartialActual
          ?"PARTIAL_ACTUAL_NET_EXECUTION"
          :"EVIDENCE_QUALITY_AS_REPORTED",
    prohibitions:[
      "UNKNOWN commission must never be coerced to zero",
      "MODELED tax/commission must never be labeled ACTUAL",
      "signal-price path return must never substitute for fill return",
      "signal suggested shares must never prove submitted order quantity or fill rate"
    ]
  };
}

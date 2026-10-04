export const METHODS=Object.freeze(["M0_BASELINE","M1_RISK_BUDGET","M2_MEAN_VARIANCE","M3_RISK_PARITY","M4_BLACK_LITTERMAN","M5_KELLY"]);
const known=v=>v!==undefined&&v!==null&&v!==""&&v!=="UNKNOWN";
export function optimizerEligibility(r={}){
 const common=[];
 if(!known(r.decisionAt)) common.push("DECISION_TIME_UNKNOWN");
 if(!known(r.opportunitySetId)) common.push("OPPORTUNITY_SET_UNKNOWN");
 if(!known(r.constraintsId)) common.push("CONSTRAINTS_UNKNOWN");
 if(!known(r.capitalPolicyId)) common.push("CAPITAL_POLICY_UNKNOWN");
 const base=common.length===0;
 const covariance=known(r.covarianceReceiptId);
 const expectedReturn=known(r.expectedReturnReceiptId);
 const riskBudget=known(r.riskBudgetId);
 const equilibrium=known(r.equilibriumPriorReceiptId);
 const views=known(r.viewReceiptId)&&known(r.viewConfidenceReceiptId);
 const distribution=known(r.calibratedDistributionReceiptId);
 return {
  commonReasons:common,
  methods:{
   M0_BASELINE:{eligible:base,reasons:base?[]:common},
   M1_RISK_BUDGET:{eligible:base&&riskBudget,reasons:[...common,...(!riskBudget?["RISK_BUDGET_UNKNOWN"]:[])]},
   M2_MEAN_VARIANCE:{eligible:base&&covariance&&expectedReturn,reasons:[...common,...(!covariance?["COVARIANCE_UNKNOWN"]:[]),...(!expectedReturn?["EXPECTED_RETURN_UNKNOWN"]:[])]},
   M3_RISK_PARITY:{eligible:base&&covariance,reasons:[...common,...(!covariance?["COVARIANCE_UNKNOWN"]:[])]},
   M4_BLACK_LITTERMAN:{eligible:base&&covariance&&equilibrium&&views,reasons:[...common,...(!covariance?["COVARIANCE_UNKNOWN"]:[]),...(!equilibrium?["EQUILIBRIUM_PRIOR_UNKNOWN"]:[]),...(!views?["VIEW_OR_CONFIDENCE_UNKNOWN"]:[])]},
   M5_KELLY:{eligible:base&&distribution,reasons:[...common,...(!distribution?["CALIBRATED_DISTRIBUTION_UNKNOWN"]:[])]}
  },
  implementation:{
   costStatus:known(r.costEvidenceStatus)?r.costEvidenceStatus:"UNKNOWN",
   liquidityStatus:known(r.liquidityEvidenceStatus)?r.liquidityEvidenceStatus:"UNKNOWN",
   executionStatus:known(r.executionEvidenceStatus)?r.executionEvidenceStatus:"UNKNOWN"
  }
 };
}
export function eligibleMethods(r={}){const x=optimizerEligibility(r);return Object.entries(x.methods).filter(([,v])=>v.eligible).map(([k])=>k);}

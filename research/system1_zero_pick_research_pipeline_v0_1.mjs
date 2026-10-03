import {buildSystem1ZeroPickRankObservation} from "./system1_zero_pick_rank_input_observer_v0_1.mjs";
import {buildSystem1ZeroPickCounterfactualSelection} from "./system1_zero_pick_counterfactual_comparator_v0_1.mjs";

export const ZERO_PICK_PIPELINE_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_ZERO_PICK_RESEARCH_PIPELINE_V0_1",
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  observerSourceSchema:"SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1",
  comparatorInputSchema:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1",
});

const text=(v,field)=>{
  const s=String(v??"").trim();
  if(!s) throw new Error("ZERO_PICK_PIPELINE_MISSING_"+field);
  return s;
};
const uniq=xs=>[...new Set(xs)];

export function buildSystem1ZeroPickResearchPipeline({
  observerSources=[],
  eligibleSymbols=[],
  eligibilitySourceSchema,
  eligibilityOutcomeBlind,
  formalSelectedCount,
  hashFn,
}={}){
  if(!Array.isArray(observerSources)||observerSources.length===0)
    throw new Error("ZERO_PICK_PIPELINE_OBSERVER_SOURCES_REQUIRED");
  if(!Array.isArray(eligibleSymbols))
    throw new Error("ZERO_PICK_PIPELINE_ELIGIBLE_SYMBOLS_ARRAY_REQUIRED");
  if(eligibilitySourceSchema!==ZERO_PICK_PIPELINE_V0_1.eligibilitySourceSchema)
    throw new Error("ZERO_PICK_PIPELINE_ELIGIBILITY_SOURCE_SCHEMA_MISMATCH");
  if(eligibilityOutcomeBlind!==true)
    throw new Error("ZERO_PICK_PIPELINE_OUTCOME_BLIND_ELIGIBILITY_REQUIRED");
  if(!Number.isInteger(formalSelectedCount)||formalSelectedCount<0)
    throw new Error("ZERO_PICK_PIPELINE_FORMAL_SELECTED_COUNT_REQUIRED");
  if(formalSelectedCount!==0)
    throw new Error("ZERO_PICK_PIPELINE_REQUIRES_FORMAL_ZERO_PICK_DATE");
  if(typeof hashFn!=="function")
    throw new Error("ZERO_PICK_PIPELINE_HASH_FUNCTION_REQUIRED");

  const observations=observerSources.map(x=>buildSystem1ZeroPickRankObservation(x,hashFn));
  const first=observations[0];
  const sourceBySymbol=new Map();
  for(const obs of observations){
    if(obs.scanDate!==first.scanDate||obs.captureGeneration!==first.captureGeneration||obs.decisionAt!==first.decisionAt)
      throw new Error("ZERO_PICK_PIPELINE_MIXED_DECISION_GENERATION");
    if(sourceBySymbol.has(obs.symbol)) throw new Error("ZERO_PICK_PIPELINE_DUPLICATE_OBSERVER_SYMBOL");
    sourceBySymbol.set(obs.symbol,obs);
  }

  const normalizedEligible=eligibleSymbols.map(x=>text(x,"eligibleSymbol"));
  if(uniq(normalizedEligible).length!==normalizedEligible.length)
    throw new Error("ZERO_PICK_PIPELINE_DUPLICATE_ELIGIBLE_SYMBOL");

  const base={
    schemaVersion:ZERO_PICK_PIPELINE_V0_1.schemaVersion,
    scanDate:first.scanDate,
    captureGeneration:first.captureGeneration,
    decisionAt:first.decisionAt,
    formalSelectedCount,
    eligibilitySourceSchema,
    eligibilityOutcomeBlind:true,
    observerN:observations.length,
    eligibleN:normalizedEligible.length,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false,
    noPlanChanges:true,
    noTrade:true,
    noPush:true,
    economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE",
    autoSwitchAuthorized:false,
  };

  if(normalizedEligible.length===0){
    return Object.freeze({
      ...base,
      status:"NO_P1A_F9_ELIGIBLE",
      missingSourceSymbols:Object.freeze([]),
      incompleteEligibleSymbols:Object.freeze([]),
      selection:null,
    });
  }

  const missingSourceSymbols=normalizedEligible.filter(symbol=>!sourceBySymbol.has(symbol));
  if(missingSourceSymbols.length){
    return Object.freeze({
      ...base,
      status:"BLOCKED_MISSING_ELIGIBLE_SOURCE",
      missingSourceSymbols:Object.freeze([...missingSourceSymbols]),
      incompleteEligibleSymbols:Object.freeze([]),
      selection:null,
    });
  }

  const eligibleObservations=normalizedEligible.map(symbol=>sourceBySymbol.get(symbol));
  const incompleteEligibleSymbols=eligibleObservations
    .filter(obs=>obs.rankInputStatus!=="COMPLETE"||!obs.rankInput)
    .map(obs=>obs.symbol);

  if(incompleteEligibleSymbols.length){
    return Object.freeze({
      ...base,
      status:"BLOCKED_INCOMPLETE_ELIGIBLE_RANK_INPUT",
      missingSourceSymbols:Object.freeze([]),
      incompleteEligibleSymbols:Object.freeze([...incompleteEligibleSymbols]),
      selection:null,
    });
  }

  const selection=buildSystem1ZeroPickCounterfactualSelection({
    rows:eligibleObservations.map(obs=>obs.rankInput),
  });

  return Object.freeze({
    ...base,
    status:"COUNTERFACTUAL_MEMBERSHIP_FROZEN_RESEARCH_ONLY",
    missingSourceSymbols:Object.freeze([]),
    incompleteEligibleSymbols:Object.freeze([]),
    selection,
  });
}

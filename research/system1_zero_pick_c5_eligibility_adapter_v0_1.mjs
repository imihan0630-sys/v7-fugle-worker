import {buildSystem1ZeroPickResearchPipeline} from "./system1_zero_pick_research_pipeline_v0_1.mjs";

export const ZERO_PICK_C5_ADAPTER_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_ZERO_PICK_C5_ELIGIBILITY_ADAPTER_V0_1",
  sourceSchemaVersion:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibleReachStage:"F9_RANKABLE",
});

function assertC5(c5){
  if(c5?.schemaVersion!==ZERO_PICK_C5_ADAPTER_V0_1.sourceSchemaVersion)
    throw new Error("ZERO_PICK_C5_SOURCE_SCHEMA_MISMATCH");
  if(c5?.researchOnly!==true||c5?.formalCoreLocked!==true||
     c5?.economicSuperiority!=="UNKNOWN"||c5?.formalOptimizationCandidate!=="NONE")
    throw new Error("ZERO_PICK_C5_RESEARCH_FIREWALL_REQUIRED");
  if(!Array.isArray(c5?.rows)) throw new Error("ZERO_PICK_C5_ROWS_REQUIRED");
  const seen=new Set();
  for(const row of c5.rows){
    const symbol=String(row?.symbol||"").trim();
    if(!symbol) throw new Error("ZERO_PICK_C5_SYMBOL_REQUIRED");
    if(seen.has(symbol)) throw new Error("ZERO_PICK_C5_DUPLICATE_SYMBOL");
    seen.add(symbol);
    if(String(row?.sessionDate||c5.sessionDate)!==String(c5.sessionDate))
      throw new Error("ZERO_PICK_C5_ROW_DATE_MISMATCH");
    if(String(row?.generationId||c5.generationId)!==String(c5.generationId))
      throw new Error("ZERO_PICK_C5_ROW_GENERATION_MISMATCH");
  }
}

export function extractSystem1P1AF9Eligibility(c5Diagnostic){
  assertC5(c5Diagnostic);
  const eligibleSymbols=c5Diagnostic.rows
    .filter(row=>Array.isArray(row?.p1aBlockSet)&&row.p1aBlockSet.length>0&&
      row?.reachStage===ZERO_PICK_C5_ADAPTER_V0_1.eligibleReachStage)
    .map(row=>String(row.symbol));
  return Object.freeze({
    schemaVersion:ZERO_PICK_C5_ADAPTER_V0_1.schemaVersion,
    sourceSchemaVersion:c5Diagnostic.schemaVersion,
    sessionDate:String(c5Diagnostic.sessionDate),
    generationId:String(c5Diagnostic.generationId),
    eligibleReachStage:ZERO_PICK_C5_ADAPTER_V0_1.eligibleReachStage,
    eligibleSymbols:Object.freeze(eligibleSymbols),
    eligibleN:eligibleSymbols.length,
    outcomeBlind:true,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false,
    economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE",
  });
}

export function buildSystem1ZeroPickResearchPipelineFromC5({
  observerSources=[],
  c5Diagnostic,
  formalSelectedCount,
  hashFn,
}={}){
  const eligibility=extractSystem1P1AF9Eligibility(c5Diagnostic);
  if(!Array.isArray(observerSources)||observerSources.length===0)
    throw new Error("ZERO_PICK_C5_OBSERVER_SOURCES_REQUIRED");
  const sourceDate=String(observerSources[0]?.scanDate||"");
  if(sourceDate!==eligibility.sessionDate)
    throw new Error("ZERO_PICK_C5_OBSERVER_DATE_MISMATCH");

  const pipeline=buildSystem1ZeroPickResearchPipeline({
    observerSources,
    eligibleSymbols:eligibility.eligibleSymbols,
    eligibilitySourceSchema:ZERO_PICK_C5_ADAPTER_V0_1.sourceSchemaVersion,
    eligibilityOutcomeBlind:true,
    formalSelectedCount,
    hashFn,
  });

  return Object.freeze({
    schemaVersion:"SYSTEM1_ZERO_PICK_RESEARCH_PIPELINE_FROM_C5_V0_1",
    eligibility,
    pipeline,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false,
    economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE",
  });
}

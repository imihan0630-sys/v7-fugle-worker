import {buildSystem1OpportunityLossBridgeV02} from "./system1_opportunity_loss_bridge_v0_2.mjs";

function adaptSemanticC5(c5){
  if(c5?.schemaVersion!=="SYSTEM1_C5_SEMANTIC_REPAIR_V0_2"||
     c5?.formalCoreLocked!==true||c5?.researchOnly!==true||!Array.isArray(c5?.rows))
    throw new Error("OPPORTUNITY_LOSS_V03_CANONICAL_C5_REQUIRED");
  return {
    ...c5,
    schemaVersion:"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2",
    semanticAdapter:{
      schemaVersion:"SYSTEM1_C5_SEMANTIC_TO_OVERFILTER_ADAPTER_V0_1",
      sourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
      targetCompatibilitySchema:"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2",
      fieldMutation:false,
      researchOnly:true
    }
  };
}

export function buildSystem1OpportunityLossBridgeV03({
  c1Diagnosis,c5SemanticDiagnostic,c3EntryExperiment=null,lifecycleRows=[]
}={}){
  const adapted=adaptSemanticC5(c5SemanticDiagnostic);
  const base=buildSystem1OpportunityLossBridgeV02({
    c1Diagnosis,c5Diagnostic:adapted,c3EntryExperiment,lifecycleRows
  });
  return {
    ...base,
    schemaVersion:"SYSTEM1_OPPORTUNITY_LOSS_BRIDGE_V0_3",
    sourceC5Schema:c5SemanticDiagnostic.schemaVersion,
    c5SemanticAdapter:adapted.semanticAdapter,
    interpretation:{
      ...base.interpretation,
      canonicalC5SemanticRepairPreserved:true,
      adapterChangesResearchSemantics:false
    }
  };
}

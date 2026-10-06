export const FORMAL_C1_BINDING_READBACK_SCHEMA="SYSTEM1_FORMAL_C1_BINDING_READBACK_VALIDATION_V0_1";

export function runtimeRequiresFormalC1Binding(runtimeVersion){
  const text=String(runtimeVersion||"").trim();
  const m=text.match(/^(\d+)\.(\d+)\.(\d+)/);
  if(!m) return false;
  const major=Number(m[1]),minor=Number(m[2]);
  return major>8||(major===8&&minor>=20);
}

function need(value,code){
  if(value===null||value===undefined||String(value).trim()==="") throw new Error(code);
  return value;
}

export function validateFormalC1BindingReadback(payload,{
  scanDate,generationId,decisionAt,runtimeVersion,sourceMainSha,contentDigest,universeDigest,populationN
}={}){
  if(!runtimeRequiresFormalC1Binding(runtimeVersion)){
    return {
      schemaVersion:FORMAL_C1_BINDING_READBACK_SCHEMA,
      status:"LEGACY_PRE_V820_BINDING_NOT_REQUIRED",
      runtimeVersion:String(runtimeVersion||""),
      historicalBackfillPerformed:false,
      formalCoreImpact:false
    };
  }
  if(!payload||typeof payload!=="object") throw new Error("FORMAL_C1_BINDING_READBACK_MISSING");
  if(payload.schemaVersion!=="SYSTEM1_FORMAL_C1_BINDING_V0_1") throw new Error("FORMAL_C1_BINDING_SCHEMA_MISMATCH");
  if(payload.authoritativeParentSelection!=="EXPLICIT_BINDING_ONLY") throw new Error("FORMAL_C1_BINDING_AUTHORITY_MISMATCH");
  if(payload.latestHeuristicUsed!==false||payload.inventoryOrdinalHeuristicUsed!==false||
     payload.selectedSetEqualityInferenceUsed!==false||payload.historicalBackfillPerformed!==false)
    throw new Error("FORMAL_C1_BINDING_INFERENCE_FORBIDDEN");
  if(payload.researchOnly!==true||payload.decisionImpact!==false||payload.formalCoreImpact!==false||
     payload.noPlanChanges!==true||payload.noTrade!==true||payload.noPush!==true)
    throw new Error("FORMAL_C1_BINDING_SAFETY_MISMATCH");
  if(!Array.isArray(payload.bindings)) throw new Error("FORMAL_C1_BINDING_ROWS_MISSING");
  if(Number(payload.count)!==payload.bindings.length) throw new Error("FORMAL_C1_BINDING_COUNT_MISMATCH");

  const exact=payload.bindings.filter(row=>String(row?.c1GenerationId||"")===String(generationId||""));
  if(exact.length===0) throw new Error("FORMAL_C1_BINDING_EXACT_PARENT_NOT_FOUND");
  if(exact.length!==1) throw new Error("FORMAL_C1_BINDING_EXACT_PARENT_AMBIGUOUS");
  const row=exact[0];

  if(String(row.scanDate)!==String(scanDate)) throw new Error("FORMAL_C1_BINDING_SCAN_DATE_MISMATCH");
  if(String(row.c1DecisionAt)!==String(decisionAt)) throw new Error("FORMAL_C1_BINDING_DECISION_CLOCK_MISMATCH");
  if(String(row.formalDecisionAt)!==String(decisionAt)) throw new Error("FORMAL_C1_BINDING_FORMAL_CLOCK_MISMATCH");
  if(String(row.formalRuntimeVersion)!==String(runtimeVersion)) throw new Error("FORMAL_C1_BINDING_RUNTIME_MISMATCH");
  if(String(row.formalSourceMainSha)!==String(sourceMainSha)) throw new Error("FORMAL_C1_BINDING_SOURCE_SHA_MISMATCH");
  if(String(row.c1ContentDigest)!==String(contentDigest)) throw new Error("FORMAL_C1_BINDING_CONTENT_DIGEST_MISMATCH");
  if(String(row.c1UniverseDigest)!==String(universeDigest)) throw new Error("FORMAL_C1_BINDING_UNIVERSE_DIGEST_MISMATCH");
  if(Number(row.c1PopulationN)!==Number(populationN)) throw new Error("FORMAL_C1_BINDING_POPULATION_MISMATCH");
  if(row.c1ScanOriginKind!=="AFTER_MARKET_SCAN_PIPELINE") throw new Error("FORMAL_C1_BINDING_ORIGIN_MISMATCH");
  if(row.appendOnly!==true||row.superseded!==false) throw new Error("FORMAL_C1_BINDING_APPEND_ONLY_MISMATCH");
  if(row.researchOnly!==true||row.decisionImpact!==false||row.formalCoreImpact!==false||
     row.noPlanChanges!==true||row.noTrade!==true||row.noPush!==true)
    throw new Error("FORMAL_C1_BINDING_ROW_SAFETY_MISMATCH");
  need(row.bindingId,"FORMAL_C1_BINDING_ID_MISSING");
  need(row.bindingDigest,"FORMAL_C1_BINDING_DIGEST_MISSING");
  need(row.formalDecisionReceiptId,"FORMAL_C1_DECISION_RECEIPT_ID_MISSING");
  if(!String(row.bindingId).startsWith("FORMAL_C1:")) throw new Error("FORMAL_C1_BINDING_ID_INVALID");
  if(!String(row.formalDecisionReceiptId).startsWith("FORMAL:"+scanDate+":")) throw new Error("FORMAL_C1_DECISION_RECEIPT_ID_INVALID");
  if(!Number.isInteger(Number(row.formalSelectedCount))||Number(row.formalSelectedCount)<0||Number(row.formalSelectedCount)>6)
    throw new Error("FORMAL_C1_SELECTED_COUNT_INVALID");

  return {
    schemaVersion:FORMAL_C1_BINDING_READBACK_SCHEMA,
    status:"VERIFIED",
    bindingId:row.bindingId,
    formalDecisionReceiptId:row.formalDecisionReceiptId,
    c1GenerationId:row.c1GenerationId,
    formalSelectedCount:Number(row.formalSelectedCount),
    c1ScanOriginKind:row.c1ScanOriginKind,
    authoritativeParentSelection:"EXPLICIT_BINDING_ONLY",
    historicalBackfillPerformed:false,
    formalCoreImpact:false
  };
}

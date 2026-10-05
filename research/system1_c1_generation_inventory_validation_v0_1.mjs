const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SHA64=/^[0-9a-f]{64}$/i;
const ORIGINS=new Set(["AFTER_MARKET_SCAN_PIPELINE","STAGE_SELECTION_ROUTE","DIRECT_SAFE_PERSISTENCE_CALLER"]);

export function validateC1GenerationInventory(inventory,expected={}){
  if(!inventory||typeof inventory!=="object") throw new Error("C1_INVENTORY_MISSING");
  if(inventory.schemaVersion!=="SYSTEM1_C1_GENERATION_INVENTORY_V0_1") throw new Error("C1_INVENTORY_SCHEMA_MISMATCH");
  const scanDate=String(expected.scanDate||"");
  if(!DATE.test(scanDate)||inventory.scanDate!==scanDate) throw new Error("C1_INVENTORY_SCAN_DATE_MISMATCH");
  const total=Number(inventory.generationCount),returned=Number(inventory.returnedCount);
  if(!Number.isInteger(total)||total<1||!Number.isInteger(returned)||returned<1||returned>total) throw new Error("C1_INVENTORY_COUNT_INVALID");
  if(inventory.truncated===true) throw new Error("C1_INVENTORY_TRUNCATED");
  if(inventory.integrityComplete!==true) throw new Error("C1_INVENTORY_INTEGRITY_BLOCKED");
  if(inventory.modernOriginCoverageComplete!==true) throw new Error("C1_INVENTORY_ORIGIN_COVERAGE_BLOCKED");
  if(inventory.historicalBackfillPerformed!==false) throw new Error("C1_INVENTORY_BACKFILL_CONFLICT");
  const generations=Array.isArray(inventory.generations)?inventory.generations:[];
  if(generations.length!==returned) throw new Error("C1_INVENTORY_RETURNED_COUNT_MISMATCH");
  const generationId=String(expected.generationId||"");
  const parent=generations.find(x=>x?.generationId===generationId);
  if(!parent) throw new Error("C1_INVENTORY_FORMAL_PARENT_MISSING");
  if(parent.sessionDate!==scanDate) throw new Error("C1_INVENTORY_PARENT_DATE_MISMATCH");
  if(parent.originStatus!=="SCAN_ORIGIN_CAPTURED") throw new Error("C1_INVENTORY_PARENT_ORIGIN_BLOCKED");
  if(!ORIGINS.has(parent.originKind)) throw new Error("C1_INVENTORY_PARENT_ORIGIN_UNKNOWN");
  if(!String(parent.runtimeVersion||"").startsWith("8.19.0-")) throw new Error("C1_INVENTORY_PARENT_RUNTIME_MISMATCH");
  if(expected.runtimeVersion&&parent.runtimeVersion!==expected.runtimeVersion) throw new Error("C1_INVENTORY_PARENT_RUNTIME_MISMATCH");
  if(expected.contentDigest&&parent.contentDigest!==expected.contentDigest) throw new Error("C1_INVENTORY_CONTENT_DIGEST_MISMATCH");
  if(expected.universeDigest&&parent.universeDigest!==expected.universeDigest) throw new Error("C1_INVENTORY_UNIVERSE_DIGEST_MISMATCH");
  if(!SHA64.test(parent.contentDigest||"")||!SHA64.test(parent.universeDigest||"")) throw new Error("C1_INVENTORY_DIGEST_INVALID");
  if(Number(parent.populationN)!==Number(parent.capturedN)||Number(parent.populationN)<1) throw new Error("C1_INVENTORY_PARENT_COUNT_MISMATCH");
  return {
    status:"VERIFIED",
    scanDate,
    generationId:parent.generationId,
    originKind:parent.originKind,
    pathKind:parent.pathKind??null,
    runtimeVersion:parent.runtimeVersion,
    generationCount:total,
    returnedCount:returned,
    populationN:Number(parent.populationN),
    capturedN:Number(parent.capturedN),
    contentDigest:parent.contentDigest,
    universeDigest:parent.universeDigest,
    modernOriginCoverageComplete:true,
    integrityComplete:true,
    historicalBackfillPerformed:false,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false,
    noPlanChanges:true,
    noTrade:true,
    noPush:true
  };
}

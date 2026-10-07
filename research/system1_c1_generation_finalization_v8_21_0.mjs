export const C1_GENERATION_FINALIZATION_SCHEMA_VERSION="SYSTEM1_C1_GENERATION_FINALIZATION_V0_1";
export const C1_PRODUCER_REGISTRY_VERSION="SYSTEM1_C1_PRODUCER_REGISTRY_V0_1";
export const C1_FINALIZATION_RULE_VERSION="SDA016_T48_V0_1";
export const C1_PRODUCER_REGISTRY=Object.freeze([
  Object.freeze({producerClass:"AFTER_MARKET_SCAN_PIPELINE",promotionEligible:true,prospectiveSameDateOnly:true}),
  Object.freeze({producerClass:"STAGE_SELECTION_ROUTE",promotionEligible:true,prospectiveSameDateOnly:true}),
  Object.freeze({producerClass:"DIRECT_SAFE_PERSISTENCE_CALLER",promotionEligible:false,prospectiveSameDateOnly:true,
    reason:"NO_CONCRETE_PRODUCTION_CALLSITE_REGISTERED"})
]);
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SHA64=/^[0-9a-f]{64}$/i;
const FLAGS=Object.freeze({researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true});

function clean(value){
  if(Array.isArray(value)) return value.map(clean);
  if(value&&typeof value==="object"){
    const out={};
    for(const key of Object.keys(value).sort()) if(value[key]!==undefined) out[key]=clean(value[key]);
    return out;
  }
  if(typeof value==="number"&&!Number.isFinite(value)) throw new Error("C1_FINALIZATION_NONFINITE_VALUE");
  return value;
}
export function canonicalFinalizationJson(value){return JSON.stringify(clean(value));}
export async function c1FinalizationSha256(value){
  const bytes=new TextEncoder().encode(typeof value==="string"?value:canonicalFinalizationJson(value));
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(x=>x.toString(16).padStart(2,"0")).join("");
}
export async function c1ProducerRegistryIdentity(){
  const producerSetHash=await c1FinalizationSha256(C1_PRODUCER_REGISTRY);
  const producerCutoffRuleHash=await c1FinalizationSha256({
    rule:"PERSIST_COMPLETED_C1_SAFE_REQUIRES_TAIWAN_DATE_NOW_EQUALS_SCAN_DATE",
    finalization:"ONLY_AFTER_TAIWAN_DATE_ROLLOVER",
    activeProducers:C1_PRODUCER_REGISTRY.filter(x=>x.promotionEligible).map(x=>x.producerClass).sort()
  });
  return {producerRegistryVersion:C1_PRODUCER_REGISTRY_VERSION,producerSetHash,producerCutoffRuleHash,
    expectedProducerClasses:C1_PRODUCER_REGISTRY.filter(x=>x.promotionEligible).map(x=>x.producerClass).sort()};
}
function generationMaterial(row){
  return {
    generationId:String(row.generationId||""),
    sessionDate:String(row.sessionDate||""),
    decisionAt:String(row.decisionAt||""),
    runtimeVersion:String(row.runtimeVersion||""),
    originKind:String(row.originKind||""),
    pathKind:String(row.pathKind||""),
    contentDigest:String(row.contentDigest||""),
    universeDigest:String(row.universeDigest||""),
    populationN:Number(row.populationN),
    integrityState:String(row.originStatus||row.integrityState||"")
  };
}
function validateGeneration(row,scanDate){
  if(!row.generationId||row.sessionDate!==scanDate||!Number.isFinite(Date.parse(row.decisionAt))||
     !row.runtimeVersion||!row.originKind||!row.pathKind||!SHA64.test(row.contentDigest)||
     !SHA64.test(row.universeDigest)||!Number.isInteger(row.populationN)||row.populationN<0||
     row.integrityState!=="SCAN_ORIGIN_CAPTURED") throw new Error("C1_FINALIZATION_GENERATION_INVALID");
}
export async function buildC1GenerationFinalizationReceipt({
  scanDate,inventory,bindings=[],sessionIdentityHash,finalizedAt,knowledgeCutoff
}={}){
  const date=String(scanDate||"");
  if(!DATE.test(date)) throw new Error("C1_FINALIZATION_SCAN_DATE_REQUIRED");
  if(!inventory||inventory.scanDate!==date) throw new Error("C1_FINALIZATION_INVENTORY_DATE_MISMATCH");
  if(inventory.truncated===true||Number(inventory.returnedCount)!==Number(inventory.generationCount))
    throw new Error("C1_FINALIZATION_INVENTORY_TRUNCATED");
  if(inventory.integrityComplete!==true||inventory.modernOriginCoverageComplete!==true)
    throw new Error("C1_FINALIZATION_INVENTORY_INCOMPLETE");
  const rows=(inventory.generations||[]).map(generationMaterial).sort((a,b)=>
    a.sessionDate.localeCompare(b.sessionDate)||a.decisionAt.localeCompare(b.decisionAt)||a.generationId.localeCompare(b.generationId));
  if(rows.length!==Number(inventory.generationCount)) throw new Error("C1_FINALIZATION_GENERATION_COUNT_MISMATCH");
  for(const row of rows) validateGeneration(row,date);
  const ids=rows.map(x=>x.generationId),set=new Set(ids);
  if(set.size!==ids.length) throw new Error("C1_FINALIZATION_DUPLICATE_GENERATION");
  for(const binding of bindings){
    if(binding.scanDate!==date||!set.has(String(binding.c1GenerationId||"")))
      throw new Error("FINALIZATION_BINDING_SET_MISMATCH");
  }
  const registry=await c1ProducerRegistryIdentity();
  const generationSetDigest=await c1FinalizationSha256(rows);
  const originCounts={};
  for(const row of rows) originCounts[row.originKind]=(originCounts[row.originKind]||0)+1;
  const at=String(finalizedAt||"");
  const cutoff=String(knowledgeCutoff||at);
  if(!Number.isFinite(Date.parse(at))||!Number.isFinite(Date.parse(cutoff))) throw new Error("C1_FINALIZATION_CLOCK_REQUIRED");
  const identityHash=String(sessionIdentityHash||"");
  if(!SHA64.test(identityHash)) throw new Error("C1_FINALIZATION_SESSION_IDENTITY_REQUIRED");
  const core={
    schemaVersion:C1_GENERATION_FINALIZATION_SCHEMA_VERSION,
    scanDate:date,sessionIdentityHash:identityHash,
    finalizationRuleVersion:C1_FINALIZATION_RULE_VERSION,
    producerRegistryVersion:registry.producerRegistryVersion,
    producerSetHash:registry.producerSetHash,
    expectedProducerClasses:registry.expectedProducerClasses,
    producerCutoffRuleHash:registry.producerCutoffRuleHash,
    finalizedAt:at,knowledgeCutoff:cutoff,
    generationCount:rows.length,generationSetDigest,generationIds:ids,originCounts,
    bindingIds:bindings.map(x=>String(x.bindingId||"")).filter(Boolean).sort(),
    pendingProducerRefs:[],failedProducerRefs:[],unresolvedProducerRefs:[],
    postFinalizationViolationCount:0,superseded:false,historicalBackfillPerformed:false,
    appendOnly:true,...FLAGS
  };
  const finalizationReceiptId="C1_FINAL:"+date+":"+await c1FinalizationSha256({
    scanDate:date,sessionIdentityHash:identityHash,generationSetDigest,
    producerSetHash:registry.producerSetHash,producerCutoffRuleHash:registry.producerCutoffRuleHash
  });
  const receiptDigest=await c1FinalizationSha256({...core,finalizationReceiptId});
  return {...core,finalizationReceiptId,receiptDigest};
}
export async function verifyC1GenerationFinalizationReceipt(receipt){
  if(!receipt||receipt.schemaVersion!==C1_GENERATION_FINALIZATION_SCHEMA_VERSION) throw new Error("C1_FINALIZATION_SCHEMA_MISMATCH");
  if(!DATE.test(receipt.scanDate||"")||!String(receipt.finalizationReceiptId||"").startsWith("C1_FINAL:"+receipt.scanDate+":"))
    throw new Error("C1_FINALIZATION_ID_INVALID");
  for(const key of ["sessionIdentityHash","producerSetHash","producerCutoffRuleHash","generationSetDigest","receiptDigest"])
    if(!SHA64.test(receipt[key]||"")) throw new Error("C1_FINALIZATION_DIGEST_INVALID");
  const registry=await c1ProducerRegistryIdentity();
  if(receipt.finalizationRuleVersion!==C1_FINALIZATION_RULE_VERSION||
     receipt.producerRegistryVersion!==registry.producerRegistryVersion||
     receipt.producerSetHash!==registry.producerSetHash||
     receipt.producerCutoffRuleHash!==registry.producerCutoffRuleHash)
    throw new Error("C1_FINALIZATION_REGISTRY_MISMATCH");
  if(JSON.stringify(receipt.expectedProducerClasses)!==JSON.stringify(registry.expectedProducerClasses))
    throw new Error("C1_FINALIZATION_PRODUCER_SET_MISMATCH");
  if(receipt.appendOnly!==true||receipt.superseded!==false||receipt.historicalBackfillPerformed!==false||
     receipt.researchOnly!==true||receipt.decisionImpact!==false||receipt.formalCoreImpact!==false||
     receipt.noPlanChanges!==true||receipt.noTrade!==true||receipt.noPush!==true)
    throw new Error("C1_FINALIZATION_CONTRACT_MISMATCH");
  const material={...receipt};delete material.receiptDigest;
  if(await c1FinalizationSha256(material)!==receipt.receiptDigest) throw new Error("C1_FINALIZATION_RECEIPT_DIGEST_MISMATCH");
  return {status:"FINALIZED_VERIFIED",scanDate:receipt.scanDate,finalizationReceiptId:receipt.finalizationReceiptId,...FLAGS};
}
function receiptFromRow(row){
  if(!row?.receipt_json) throw new Error("C1_FINALIZATION_ROW_INVALID");
  const receipt=JSON.parse(row.receipt_json);
  if(row.finalization_receipt_id!==receipt.finalizationReceiptId||row.scan_date!==receipt.scanDate||
     row.generation_set_digest!==receipt.generationSetDigest||row.receipt_digest!==receipt.receiptDigest)
    throw new Error("C1_FINALIZATION_ROW_MISMATCH");
  return receipt;
}
export async function persistC1GenerationFinalization(db,receipt){
  if(!db?.prepare) throw new Error("C1_FINALIZATION_D1_REQUIRED");
  await verifyC1GenerationFinalizationReceipt(receipt);
  const existing=await db.prepare("SELECT * FROM trade_research_c1_generation_finalizations WHERE scan_date=?1").bind(receipt.scanDate).first();
  if(existing){
    const stored=receiptFromRow(existing);await verifyC1GenerationFinalizationReceipt(stored);
    if(stored.finalizationReceiptId!==receipt.finalizationReceiptId||stored.receiptDigest!==receipt.receiptDigest)
      throw new Error("REJECT_MUTABLE_FINALIZATION_HISTORY");
    return {ok:true,status:"FINALIZED_VERIFIED",deduplicated:true,receipt:stored,...FLAGS};
  }
  await db.prepare(`INSERT INTO trade_research_c1_generation_finalizations(
    finalization_receipt_id,scan_date,generation_set_digest,receipt_json,receipt_digest,created_at
  ) VALUES(?1,?2,?3,?4,?5,?6)`).bind(receipt.finalizationReceiptId,receipt.scanDate,receipt.generationSetDigest,
    JSON.stringify(receipt),receipt.receiptDigest,receipt.finalizedAt).run();
  const row=await db.prepare("SELECT * FROM trade_research_c1_generation_finalizations WHERE scan_date=?1").bind(receipt.scanDate).first();
  if(!row) throw new Error("C1_FINALIZATION_READBACK_MISSING");
  const stored=receiptFromRow(row);await verifyC1GenerationFinalizationReceipt(stored);
  return {ok:true,status:"FINALIZED_VERIFIED",deduplicated:false,receipt:stored,...FLAGS};
}
export async function readC1GenerationFinalization(db,{scanDate}={}){
  if(!db?.prepare) throw new Error("C1_FINALIZATION_D1_REQUIRED");
  const date=String(scanDate||"");
  if(!DATE.test(date)) throw new Error("C1_FINALIZATION_SCAN_DATE_REQUIRED");
  const row=await db.prepare("SELECT * FROM trade_research_c1_generation_finalizations WHERE scan_date=?1").bind(date).first();
  if(!row) return {ok:true,status:"GENERATION_SET_NOT_FINALIZED",scanDate:date,receipt:null,postFinalizationViolationCount:0,...FLAGS};
  const receipt=receiptFromRow(row);await verifyC1GenerationFinalizationReceipt(receipt);
  const count=await db.prepare("SELECT COUNT(*) AS n FROM trade_research_c1_generation_finalization_violations WHERE scan_date=?1").bind(date).first();
  return {ok:true,status:Number(count?.n)>0?"POST_FINALIZATION_GENERATION_VIOLATION":"FINALIZED_VERIFIED",
    scanDate:date,receipt,postFinalizationViolationCount:Number(count?.n)||0,...FLAGS};
}
export async function guardC1GenerationInsertAfterFinalization(db,{scanDate,generationId,observedAt}={}){
  if(!db?.prepare) return {allowed:true};
  const date=String(scanDate||""),id=String(generationId||"");
  const row=await db.prepare("SELECT finalization_receipt_id,receipt_json FROM trade_research_c1_generation_finalizations WHERE scan_date=?1").bind(date).first();
  if(!row) return {allowed:true};
  const finalized=receiptFromRow(row);
  await verifyC1GenerationFinalizationReceipt(finalized);
  // Exact replay of a generation already frozen inside the final set is not a new generation.
  // The immutable generation table still performs its own content/digest conflict check afterward.
  if((finalized.generationIds||[]).includes(id))
    return {allowed:true,finalizedReplay:true,finalizationReceiptId:finalized.finalizationReceiptId};
  const at=String(observedAt||new Date().toISOString());
  const violationId="C1_FINAL_VIOLATION:"+await c1FinalizationSha256({scanDate:date,generationId:id,observedAt:at});
  await db.prepare(`INSERT OR IGNORE INTO trade_research_c1_generation_finalization_violations(
    violation_id,scan_date,generation_id,finalization_receipt_id,observed_at,violation_json
  ) VALUES(?1,?2,?3,?4,?5,?6)`).bind(violationId,date,id,row.finalization_receipt_id,at,
    JSON.stringify({violationId,scanDate:date,generationId:id,finalizationReceiptId:row.finalization_receipt_id,
      observedAt:at,code:"POST_FINALIZATION_GENERATION_VIOLATION",researchOnly:true,formalCoreImpact:false})).run();
  throw new Error("POST_FINALIZATION_GENERATION_VIOLATION");
}

export const FORMAL_C1_BINDING_SCHEMA_VERSION="SYSTEM1_FORMAL_C1_BINDING_V0_1";
export const FORMAL_DECISION_PAYLOAD_SCHEMA_VERSION="SYSTEM1_FORMAL_DECISION_BINDING_PAYLOAD_V0_1";
export const FORMAL_C1_PARENT_RULE_VERSION="FORMAL_C1_EXPLICIT_AFTER_MARKET_V0_1";
export const FORMAL_C1_ALLOWED_ORIGIN="AFTER_MARKET_SCAN_PIPELINE";
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SHA40=/^[0-9a-f]{40}$/i;
const SHA64=/^[0-9a-f]{64}$/i;
const FLAGS=Object.freeze({researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true});

function clean(value){
  if(Array.isArray(value)) return value.map(v=>v===undefined?null:clean(v));
  if(value&&typeof value==="object"){
    const out={};
    for(const key of Object.keys(value).sort()) if(value[key]!==undefined) out[key]=clean(value[key]);
    return out;
  }
  if(typeof value==="number"&&!Number.isFinite(value)) throw new Error("FORMAL_C1_NONFINITE_VALUE");
  return value;
}
export function canonicalFormalC1Json(value){return JSON.stringify(clean(value));}
export async function formalC1Sha256(value){
  const bytes=new TextEncoder().encode(typeof value==="string"?value:canonicalFormalC1Json(value));
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function requiredText(value,code){const s=String(value||"").trim();if(!s)throw new Error(code);return s;}
function planDateFrom(plans,fallback){
  const dates=[...new Set((plans||[]).map(x=>String(x?.planDate||"").trim()).filter(Boolean))];
  if(dates.length>1) throw new Error("FORMAL_C1_PLAN_DATE_CONFLICT");
  const date=dates[0]||String(fallback||"");
  if(!DATE.test(date)) throw new Error("FORMAL_C1_PLAN_DATE_REQUIRED");
  return date;
}
function selectedIdentity(plans){
  return (plans||[]).map((plan,index)=>({
    ordinal:index+1,
    symbol:String(plan?.symbol||plan?.code||"").trim(),
    strategyPool:plan?.strategyPool==null?null:String(plan.strategyPool)
  }));
}

export async function buildFormalDecisionIdentity({
  scanDate,planDate,formalDecisionAt,formalRuntimeVersion,formalSourceMainSha,plans
}={}){
  const date=String(scanDate||"");
  if(!DATE.test(date)) throw new Error("FORMAL_C1_SCAN_DATE_REQUIRED");
  if(!Number.isFinite(Date.parse(formalDecisionAt))||String(formalDecisionAt).slice(0,10)!==date)
    throw new Error("FORMAL_C1_DECISION_CLOCK_INVALID");
  const runtime=requiredText(formalRuntimeVersion,"FORMAL_C1_RUNTIME_REQUIRED");
  const source=requiredText(formalSourceMainSha,"FORMAL_C1_SOURCE_SHA_REQUIRED");
  if(!SHA40.test(source)) throw new Error("FORMAL_C1_SOURCE_SHA_INVALID");
  const list=Array.isArray(plans)?plans:null;
  if(!list) throw new Error("FORMAL_C1_PLANS_REQUIRED");
  if(list.length>6) throw new Error("FORMAL_C1_FORMAL_CAPACITY_EXCEEDED");
  const symbols=selectedIdentity(list);
  if(symbols.some(x=>!x.symbol)) throw new Error("FORMAL_C1_SYMBOL_REQUIRED");
  if(new Set(symbols.map(x=>x.symbol)).size!==symbols.length) throw new Error("FORMAL_C1_DUPLICATE_SYMBOL");
  const resolvedPlanDate=planDateFrom(list,planDate);
  const payload={
    schemaVersion:FORMAL_DECISION_PAYLOAD_SCHEMA_VERSION,
    scanDate:date,
    planDate:resolvedPlanDate,
    formalDecisionAt:String(formalDecisionAt),
    formalRuntimeVersion:runtime,
    formalSourceMainSha:source,
    orderedFormalPlans:clean(list)
  };
  const formalResultDigest=await formalC1Sha256(payload);
  const formalSelectedSymbolsDigest=await formalC1Sha256(symbols);
  const formalDecisionReceiptId="FORMAL:"+date+":"+formalResultDigest;
  return {
    payload,formalDecisionReceiptId,formalResultDigest,formalSelectedSymbolsDigest,
    formalSelectedCount:list.length,scanDate:date,planDate:resolvedPlanDate,
    formalDecisionAt:String(formalDecisionAt),formalRuntimeVersion:runtime,formalSourceMainSha:source,
    ...FLAGS
  };
}

export async function buildFormalC1BindingReceipt({identity,c1,bindingCreatedAt}={}){
  if(!identity?.formalDecisionReceiptId) throw new Error("FORMAL_C1_IDENTITY_REQUIRED");
  if(!c1||typeof c1!=="object") throw new Error("FORMAL_C1_PARENT_REQUIRED");
  if(c1.scanDate!==identity.scanDate) throw new Error("FORMAL_C1_PARENT_DATE_MISMATCH");
  if(c1.decisionAt!==identity.formalDecisionAt) throw new Error("FORMAL_C1_PARENT_CLOCK_MISMATCH");
  if(c1.runtimeVersion!==identity.formalRuntimeVersion) throw new Error("FORMAL_C1_PARENT_RUNTIME_MISMATCH");
  if(c1.sourceMainSha!==identity.formalSourceMainSha) throw new Error("FORMAL_C1_PARENT_SOURCE_MISMATCH");
  if(c1.originKind!==FORMAL_C1_ALLOWED_ORIGIN) throw new Error("FORMAL_C1_BINDING_ORIGIN_NOT_AUTHORIZED");
  if(!SHA64.test(c1.contentDigest||"")||!SHA64.test(c1.universeDigest||"")) throw new Error("FORMAL_C1_PARENT_DIGEST_INVALID");
  if(!Number.isInteger(Number(c1.populationN))||Number(c1.populationN)<1) throw new Error("FORMAL_C1_PARENT_COUNT_INVALID");
  const created=String(bindingCreatedAt||"");
  if(!Number.isFinite(Date.parse(created))) throw new Error("FORMAL_C1_BINDING_CREATED_AT_INVALID");
  const core={
    schemaVersion:FORMAL_C1_BINDING_SCHEMA_VERSION,
    formalDecisionReceiptId:identity.formalDecisionReceiptId,
    scanDate:identity.scanDate,
    planDate:identity.planDate,
    formalDecisionAt:identity.formalDecisionAt,
    formalRuntimeVersion:identity.formalRuntimeVersion,
    formalSourceMainSha:identity.formalSourceMainSha,
    formalResultDigest:identity.formalResultDigest,
    formalSelectedSymbolsDigest:identity.formalSelectedSymbolsDigest,
    formalSelectedCount:identity.formalSelectedCount,
    c1GenerationId:requiredText(c1.generationId,"FORMAL_C1_PARENT_GENERATION_REQUIRED"),
    c1DecisionAt:String(c1.decisionAt),
    c1ContentDigest:String(c1.contentDigest),
    c1UniverseDigest:String(c1.universeDigest),
    c1PopulationN:Number(c1.populationN),
    c1ScanOriginKind:String(c1.originKind),
    bindingCreatedAt:created,
    parentSelectionRuleVersion:FORMAL_C1_PARENT_RULE_VERSION,
    appendOnly:true,
    superseded:false,
    ...FLAGS
  };
  const pairDigest=await formalC1Sha256({
    formalDecisionReceiptId:core.formalDecisionReceiptId,
    c1GenerationId:core.c1GenerationId,
    parentSelectionRuleVersion:core.parentSelectionRuleVersion
  });
  const bindingId="FORMAL_C1:"+pairDigest;
  const bindingDigest=await formalC1Sha256({...core,bindingId});
  return {...core,bindingId,bindingDigest};
}

export async function verifyFormalC1BindingReceipt(receipt){
  if(!receipt||receipt.schemaVersion!==FORMAL_C1_BINDING_SCHEMA_VERSION) throw new Error("FORMAL_C1_BINDING_SCHEMA_MISMATCH");
  if(!DATE.test(receipt.scanDate||"")||!DATE.test(receipt.planDate||"")) throw new Error("FORMAL_C1_BINDING_DATE_INVALID");
  if(!String(receipt.formalDecisionReceiptId||"").startsWith("FORMAL:"+receipt.scanDate+":")) throw new Error("FORMAL_C1_FORMAL_ID_INVALID");
  if(!String(receipt.bindingId||"").startsWith("FORMAL_C1:")) throw new Error("FORMAL_C1_BINDING_ID_INVALID");
  for(const key of ["formalResultDigest","formalSelectedSymbolsDigest","c1ContentDigest","c1UniverseDigest","bindingDigest"])
    if(!SHA64.test(receipt[key]||"")) throw new Error("FORMAL_C1_BINDING_DIGEST_INVALID");
  if(!SHA40.test(receipt.formalSourceMainSha||"")) throw new Error("FORMAL_C1_SOURCE_SHA_INVALID");
  if(receipt.c1ScanOriginKind!==FORMAL_C1_ALLOWED_ORIGIN) throw new Error("FORMAL_C1_BINDING_ORIGIN_NOT_AUTHORIZED");
  if(receipt.parentSelectionRuleVersion!==FORMAL_C1_PARENT_RULE_VERSION||
     receipt.appendOnly!==true||receipt.superseded!==false||
     receipt.researchOnly!==true||receipt.decisionImpact!==false||receipt.formalCoreImpact!==false||
     receipt.noPlanChanges!==true||receipt.noTrade!==true||receipt.noPush!==true)
    throw new Error("FORMAL_C1_BINDING_CONTRACT_MISMATCH");
  const material={...receipt};delete material.bindingDigest;
  if(await formalC1Sha256(material)!==receipt.bindingDigest) throw new Error("FORMAL_C1_BINDING_DIGEST_MISMATCH");
  const pairDigest=await formalC1Sha256({
    formalDecisionReceiptId:receipt.formalDecisionReceiptId,
    c1GenerationId:receipt.c1GenerationId,
    parentSelectionRuleVersion:receipt.parentSelectionRuleVersion
  });
  if(receipt.bindingId!=="FORMAL_C1:"+pairDigest) throw new Error("FORMAL_C1_BINDING_ID_MISMATCH");
  return {status:"VERIFIED",bindingId:receipt.bindingId,formalDecisionReceiptId:receipt.formalDecisionReceiptId,
    c1GenerationId:receipt.c1GenerationId,...FLAGS};
}

function rowReceipt(row){
  if(!row?.binding_json) throw new Error("FORMAL_C1_BINDING_ROW_INVALID");
  const receipt=JSON.parse(row.binding_json);
  if(row.binding_id!==receipt.bindingId||row.formal_decision_receipt_id!==receipt.formalDecisionReceiptId||
     row.c1_generation_id!==receipt.c1GenerationId||row.binding_digest!==receipt.bindingDigest)
    throw new Error("FORMAL_C1_BINDING_ROW_MISMATCH");
  return receipt;
}
async function loadByFormal(db,id){
  return db.prepare("SELECT * FROM trade_research_formal_c1_bindings WHERE formal_decision_receipt_id=?1").bind(id).first();
}
async function loadByC1(db,id){
  return db.prepare("SELECT * FROM trade_research_formal_c1_bindings WHERE c1_generation_id=?1").bind(id).first();
}

export async function persistFormalC1BindingRecord(db,receipt){
  if(!db?.prepare) throw new Error("FORMAL_C1_BINDING_D1_REQUIRED");
  await verifyFormalC1BindingReceipt(receipt);
  let byFormal=await loadByFormal(db,receipt.formalDecisionReceiptId);
  let byC1=await loadByC1(db,receipt.c1GenerationId);
  const classify=async()=>{
    if(byFormal&&byFormal.c1_generation_id!==receipt.c1GenerationId) throw new Error("CONFLICT_FORMAL_DECISION_REBOUND");
    if(byC1&&byC1.formal_decision_receipt_id!==receipt.formalDecisionReceiptId) throw new Error("CONFLICT_C1_PARENT_REBOUND");
    const row=byFormal||byC1;
    if(row){
      const stored=rowReceipt(row);await verifyFormalC1BindingReceipt(stored);
      if(stored.bindingId!==receipt.bindingId||stored.formalResultDigest!==receipt.formalResultDigest||
         stored.c1ContentDigest!==receipt.c1ContentDigest||stored.c1UniverseDigest!==receipt.c1UniverseDigest)
        throw new Error("FORMAL_C1_BINDING_IMMUTABLE_CONFLICT");
      return {ok:true,status:"VERIFIED",saved:1,deduplicated:true,bindingId:stored.bindingId,
        formalDecisionReceiptId:stored.formalDecisionReceiptId,c1GenerationId:stored.c1GenerationId,
        bindingDigest:stored.bindingDigest,readbackVerified:true,...FLAGS};
    }
    return null;
  };
  const existing=await classify();if(existing)return existing;
  try{
    await db.prepare(`INSERT INTO trade_research_formal_c1_bindings(
      binding_id,formal_decision_receipt_id,scan_date,plan_date,formal_decision_at,formal_runtime_version,
      formal_source_main_sha,formal_result_digest,formal_selected_symbols_digest,formal_selected_count,
      c1_generation_id,c1_decision_at,c1_content_digest,c1_universe_digest,c1_population_n,c1_scan_origin_kind,
      parent_selection_rule_version,binding_json,binding_digest,created_at
    ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20)`)
      .bind(receipt.bindingId,receipt.formalDecisionReceiptId,receipt.scanDate,receipt.planDate,receipt.formalDecisionAt,
        receipt.formalRuntimeVersion,receipt.formalSourceMainSha,receipt.formalResultDigest,receipt.formalSelectedSymbolsDigest,
        receipt.formalSelectedCount,receipt.c1GenerationId,receipt.c1DecisionAt,receipt.c1ContentDigest,receipt.c1UniverseDigest,
        receipt.c1PopulationN,receipt.c1ScanOriginKind,receipt.parentSelectionRuleVersion,JSON.stringify(receipt),
        receipt.bindingDigest,receipt.bindingCreatedAt).run();
  }catch(error){
    byFormal=await loadByFormal(db,receipt.formalDecisionReceiptId);
    byC1=await loadByC1(db,receipt.c1GenerationId);
    const concurrent=await classify();
    if(concurrent)return concurrent;
    throw new Error("FORMAL_C1_BINDING_WRITE_FAILED:"+String(error).slice(0,180));
  }
  byFormal=await loadByFormal(db,receipt.formalDecisionReceiptId);
  if(!byFormal) throw new Error("FORMAL_C1_BINDING_READBACK_MISSING");
  const stored=rowReceipt(byFormal);await verifyFormalC1BindingReceipt(stored);
  if(stored.bindingId!==receipt.bindingId||stored.bindingDigest!==receipt.bindingDigest)
    throw new Error("FORMAL_C1_BINDING_READBACK_MISMATCH");
  return {ok:true,status:"VERIFIED",saved:1,deduplicated:false,bindingId:stored.bindingId,
    formalDecisionReceiptId:stored.formalDecisionReceiptId,c1GenerationId:stored.c1GenerationId,
    bindingDigest:stored.bindingDigest,readbackVerified:true,...FLAGS};
}

export async function readFormalC1Bindings(db,{formalDecisionReceiptId=null,scanDate=null}={}){
  if(!db?.prepare) throw new Error("FORMAL_C1_BINDING_D1_REQUIRED");
  const id=String(formalDecisionReceiptId||"").trim(),date=String(scanDate||"").trim();
  if(Boolean(id)===Boolean(date)) throw new Error("FORMAL_C1_BINDING_EXACTLY_ONE_QUERY_REQUIRED");
  let rows=[];
  if(id){
    const row=await loadByFormal(db,id);if(row)rows=[row];
  }else{
    if(!DATE.test(date)) throw new Error("FORMAL_C1_BINDING_SCAN_DATE_INVALID");
    const result=await db.prepare(`SELECT * FROM trade_research_formal_c1_bindings
      WHERE scan_date=?1 ORDER BY formal_decision_at ASC,binding_id ASC`).bind(date).all();
    rows=result?.results||[];
  }
  const bindings=[];
  for(const row of rows){const receipt=rowReceipt(row);await verifyFormalC1BindingReceipt(receipt);bindings.push(receipt);}
  return {ok:true,schemaVersion:FORMAL_C1_BINDING_SCHEMA_VERSION,
    query:id?{formalDecisionReceiptId:id}:{scanDate:date},count:bindings.length,bindings,
    authoritativeParentSelection:"EXPLICIT_BINDING_ONLY",latestHeuristicUsed:false,
    inventoryOrdinalHeuristicUsed:false,selectedSetEqualityInferenceUsed:false,historicalBackfillPerformed:false,
    ...FLAGS};
}

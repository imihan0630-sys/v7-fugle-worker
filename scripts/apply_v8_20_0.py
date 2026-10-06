"""Owner-approved SDA-016 Class-B Formal->C1 append-only binding implementation.
Concrete merge / Production deploy remain separately gated by repository governance.
"""
from pathlib import Path
import hashlib

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected one anchor, got {count}")
    text=text.replace(old,new,1)

source_path=Path("research/system1_formal_c1_binding_v8_20_0.mjs")
source=source_path.read_text(encoding="utf-8")
raw=source.encode("utf-8")
blob_sha=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
expected="1e4518a92d561ee99d89a95b4efbf7faa0cb45d2"
if blob_sha!=expected:
    raise SystemExit("Frozen V8.20 Formal-C1 binding module changed")
module_source="\n".join(line for line in source.splitlines() if not line.startswith("import ")).replace("export ","")
module="\n// BEGIN V8.20 FORMAL C1 AUTHORITATIVE BINDING\nconst FORMAL_C1_BINDING=(()=>{\n"+module_source+"""
return {
  FORMAL_C1_BINDING_SCHEMA_VERSION,FORMAL_DECISION_PAYLOAD_SCHEMA_VERSION,FORMAL_C1_PARENT_RULE_VERSION,
  FORMAL_C1_ALLOWED_ORIGIN,canonicalFormalC1Json,formalC1Sha256,buildFormalDecisionIdentity,
  buildFormalC1BindingReceipt,verifyFormalC1BindingReceipt,persistFormalC1BindingRecord,readFormalC1Bindings
};
})();
// END V8.20 FORMAL C1 AUTHORITATIVE BINDING
"""

Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-v8_20_0.mjs").write_text(text,encoding="utf-8")

once(
  'const VERSION = "8.19.1-pve250-runtime-remediation";',
  'const VERSION = "8.20.0-formal-c1-binding-ledger";',
  "runtime version"
)

once(
  "function buildC1PopulationReceipt(",
  module+"function buildC1PopulationReceipt(",
  "binding module"
)

schema_anchor=r'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c1_chunks (
    generation_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    row_count INTEGER NOT NULL,
    rows_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY(generation_id,chunk_index)
  )`).run();'''
schema_add=schema_anchor+r'''
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_formal_c1_bindings (
    binding_id TEXT PRIMARY KEY,
    formal_decision_receipt_id TEXT NOT NULL UNIQUE,
    scan_date TEXT NOT NULL,
    plan_date TEXT NOT NULL,
    formal_decision_at TEXT NOT NULL,
    formal_runtime_version TEXT NOT NULL,
    formal_source_main_sha TEXT NOT NULL,
    formal_result_digest TEXT NOT NULL,
    formal_selected_symbols_digest TEXT NOT NULL,
    formal_selected_count INTEGER NOT NULL,
    c1_generation_id TEXT NOT NULL UNIQUE,
    c1_decision_at TEXT NOT NULL,
    c1_content_digest TEXT NOT NULL,
    c1_universe_digest TEXT NOT NULL,
    c1_population_n INTEGER NOT NULL,
    c1_scan_origin_kind TEXT NOT NULL,
    parent_selection_rule_version TEXT NOT NULL,
    binding_json TEXT NOT NULL,
    binding_digest TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_formal_c1_bindings_date
    ON trade_research_formal_c1_bindings(scan_date,formal_decision_at,binding_id)`).run();'''
once(schema_anchor,schema_add,"append-only binding D1 schema")

helper=r'''
async function persistFormalC1BindingSafe(env,{scanDate,plans,saved,c1PopulationSave,c1PopulationReceipt}={}) {
  const blocked=(reason,error=null)=>({
    schemaVersion:FORMAL_C1_BINDING.FORMAL_C1_BINDING_SCHEMA_VERSION,status:"DATA_QUALITY_BLOCKED",
    reason,error:error?String(error).slice(0,300):null,bindingId:null,formalDecisionReceiptId:null,
    c1GenerationId:c1PopulationSave?.generationId||c1PopulationReceipt?.generationId||null,
    readbackVerified:false,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  });
  try {
    if(!env?.V7_DB) return blocked("FORMAL_C1_BINDING_D1_REQUIRED");
    if(saved?.verified!==true) return blocked("FORMAL_SELECTION_UNVERIFIED");
    if(c1PopulationSave?.status!=="VERIFIED"||c1PopulationSave?.saveOk!==true||c1PopulationSave?.readbackVerified!==true)
      return blocked("FORMAL_C1_BINDING_C1_NOT_VERIFIED");
    const generationId=String(c1PopulationSave?.generationId||"");
    if(!generationId||generationId!==String(c1PopulationReceipt?.generationId||""))
      return blocked("FORMAL_C1_BINDING_C1_ID_MISMATCH");

    await ensureD1Schema(env);
    const session=env.V7_DB.withSession("first-primary");
    const row=await session.prepare(`SELECT generation_id,scan_date,decision_at,captured_at,source_main_sha,runtime_version,
      universe_digest,content_digest,population_n,captured_n,feature_n,chunk_count,completeness,header_json,created_at
      FROM trade_research_c1_generations WHERE generation_id=?1`).bind(generationId).first();
    if(!row) return blocked("FORMAL_C1_BINDING_C1_PARENT_MISSING");
    await verifyC1StoredGeneration(session,row);
    const header=JSON.parse(row.header_json||"{}");
    const origin=C1_SCAN_ORIGIN.verifyC1ScanOrigin(header);
    if(origin.originKind!==FORMAL_C1_BINDING.FORMAL_C1_ALLOWED_ORIGIN)
      return blocked("FORMAL_C1_BINDING_ORIGIN_NOT_AUTHORIZED");
    if(String(row.scan_date)!==String(scanDate)||String(row.decision_at)!==String(header.decisionAt||""))
      return blocked("FORMAL_C1_BINDING_PARENT_DATE_CLOCK_MISMATCH");
    if(String(row.runtime_version)!==VERSION||String(header.effectiveRuntimeVersion||"")!==VERSION)
      return blocked("FORMAL_C1_BINDING_PARENT_RUNTIME_MISMATCH");
    if(String(row.source_main_sha||"")!==String(header.sourceMainSha||""))
      return blocked("FORMAL_C1_BINDING_PARENT_SOURCE_MISMATCH");
    if(String(row.content_digest||"")!==String(c1PopulationSave.contentDigest||"")||
       String(row.universe_digest||"")!==String(c1PopulationSave.universeDigest||""))
      return blocked("FORMAL_C1_BINDING_PARENT_DIGEST_MISMATCH");

    const formalPlans=Array.isArray(saved?.stocks)?saved.stocks:(Array.isArray(plans)?plans:[]);
    const identity=await FORMAL_C1_BINDING.buildFormalDecisionIdentity({
      scanDate:String(scanDate),planDate:formalPlans[0]?.planDate||nextTradingDate(String(scanDate)),
      formalDecisionAt:String(row.decision_at),formalRuntimeVersion:VERSION,
      formalSourceMainSha:String(row.source_main_sha||""),plans:formalPlans
    });
    const receipt=await FORMAL_C1_BINDING.buildFormalC1BindingReceipt({
      identity,
      c1:{
        generationId:String(row.generation_id),scanDate:String(row.scan_date),decisionAt:String(row.decision_at),
        runtimeVersion:String(row.runtime_version),sourceMainSha:String(row.source_main_sha),
        contentDigest:String(row.content_digest),universeDigest:String(row.universe_digest),
        populationN:Number(row.population_n),originKind:origin.originKind
      },
      bindingCreatedAt:new Date().toISOString()
    });
    const persisted=await FORMAL_C1_BINDING.persistFormalC1BindingRecord(session,receipt);
    return {
      schemaVersion:FORMAL_C1_BINDING.FORMAL_C1_BINDING_SCHEMA_VERSION,status:"VERIFIED",
      bindingId:persisted.bindingId,formalDecisionReceiptId:persisted.formalDecisionReceiptId,
      c1GenerationId:persisted.c1GenerationId,bindingDigest:persisted.bindingDigest,
      formalSelectedCount:identity.formalSelectedCount,deduplicated:persisted.deduplicated===true,
      readbackVerified:persisted.readbackVerified===true,parentSelectionRuleVersion:receipt.parentSelectionRuleVersion,
      c1ScanOriginKind:receipt.c1ScanOriginKind,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      noPlanChanges:true,noTrade:true,noPush:true
    };
  } catch(error) {
    const message=String(error?.message||error||"FORMAL_C1_BINDING_BLOCKED");
    return blocked(message.split(":")[0]||"FORMAL_C1_BINDING_BLOCKED",message);
  }
}

'''
once(
  "async function readC1PopulationReceipt(",
  helper+"async function readC1PopulationReceipt(",
  "binding safe persistence helper"
)

once(
'''  let c1PopulationSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run", researchOnly:true });
  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });''',
'''  let c1PopulationSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run", researchOnly:true });
  let formalC1Binding = /** @type {any} */ ({
    schemaVersion:FORMAL_C1_BINDING.FORMAL_C1_BINDING_SCHEMA_VERSION,
    status:dryRun?"SKIPPED_DRY_RUN":"NOT_RUN",readbackVerified:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  });
  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });''',
  "binding runtime state"
)

once(
'''    } catch(error) {
      c1PopulationSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noPush:true,noTrade:true};
    }
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);''',
'''    } catch(error) {
      c1PopulationSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noPush:true,noTrade:true};
    }
    formalC1Binding = await persistFormalC1BindingSafe(env,{
      scanDate:marketDate,plans:stocks,saved,c1PopulationSave,c1PopulationReceipt:scan.c1PopulationReceipt
    });
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);''',
  "binding after verified Formal and C1 persistence"
)

once(
'''    researchC1Population: c1PopulationSave,
''',
'''    researchFormalC1Binding: formalC1Binding,
    researchC1Population: c1PopulationSave,
''',
  "binding summary readback"
)

route=r'''    // BEGIN V8.20 FORMAL C1 BINDING ROUTE
    if (url.pathname === "/api/research/formal-c1-binding") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      if(!env.V7_DB) return json({ok:false,error:"NO_D1",researchOnly:true},503,true);
      const formalDecisionReceiptId=String(url.searchParams.get("formalDecisionReceiptId")||"").trim();
      const scanDate=String(url.searchParams.get("scanDate")||"").trim();
      if(Boolean(formalDecisionReceiptId)===Boolean(scanDate))
        return json({ok:false,error:"EXACTLY_ONE_QUERY_REQUIRED",researchOnly:true},400,true);
      if(scanDate&&!/^\d{4}-\d{2}-\d{2}$/.test(scanDate))
        return json({ok:false,error:"scanDate 無效",researchOnly:true},400,true);
      try {
        await ensureD1Schema(env);
        const result=await FORMAL_C1_BINDING.readFormalC1Bindings(env.V7_DB.withSession("first-primary"),{
          formalDecisionReceiptId:formalDecisionReceiptId||null,scanDate:scanDate||null
        });
        return json(result,200,true);
      } catch(error) {
        return json({ok:false,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,
          formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true},409,true);
      }
    }
    // END V8.20 FORMAL C1 BINDING ROUTE

'''
once(
  "    // BEGIN V8.19 C1 GENERATION INVENTORY ROUTE",
  route+"    // BEGIN V8.19 C1 GENERATION INVENTORY ROUTE",
  "protected binding readback route"
)

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.20.0 authoritative Formal-C1 append-only binding; Formal Core unchanged")

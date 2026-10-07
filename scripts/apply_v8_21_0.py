"""Owner-approved Class-B candidate for SDA-016 T48 generation-set finalization.
Merge / Production deploy remain separately gated.
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

source_path=Path("research/system1_c1_generation_finalization_v8_21_0.mjs")
source=source_path.read_text(encoding="utf-8")
raw=source.encode("utf-8")
blob_sha=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
expected="b128ab7a373f446e7571181c456ef6c0ac47984a"
if blob_sha!=expected:
    raise SystemExit("Frozen V8.21 C1 generation finalization module changed")
module_source="\n".join(line for line in source.splitlines() if not line.startswith("import ")).replace("export ","")
module="\n// BEGIN V8.21 C1 GENERATION SET FINALIZATION\nconst C1_GENERATION_FINALIZATION=(()=>{\n"+module_source+"""
return {
  C1_GENERATION_FINALIZATION_SCHEMA_VERSION,C1_PRODUCER_REGISTRY_VERSION,C1_FINALIZATION_RULE_VERSION,
  C1_PRODUCER_REGISTRY,canonicalFinalizationJson,c1FinalizationSha256,c1ProducerRegistryIdentity,
  buildC1GenerationFinalizationReceipt,verifyC1GenerationFinalizationReceipt,persistC1GenerationFinalization,
  readC1GenerationFinalization,guardC1GenerationInsertAfterFinalization
};
})();
// END V8.21 C1 GENERATION SET FINALIZATION
"""

Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-v8_21_0.mjs").write_text(text,encoding="utf-8")

once(
  'const VERSION = "8.20.0-formal-c1-binding-ledger";',
  'const VERSION = "8.21.0-c1-generation-set-finalization";',
  "runtime version"
)

once(
  "function buildC1PopulationReceipt(",
  module+"function buildC1PopulationReceipt(",
  "finalization module"
)

schema_anchor='''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_formal_c1_bindings_date
    ON trade_research_formal_c1_bindings(scan_date,formal_decision_at,binding_id)`).run();'''
schema_add=schema_anchor+'''
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c1_generation_finalizations (
    finalization_receipt_id TEXT PRIMARY KEY,
    scan_date TEXT NOT NULL UNIQUE,
    generation_set_digest TEXT NOT NULL,
    receipt_json TEXT NOT NULL,
    receipt_digest TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c1_generation_finalization_violations (
    violation_id TEXT PRIMARY KEY,
    scan_date TEXT NOT NULL,
    generation_id TEXT NOT NULL,
    finalization_receipt_id TEXT NOT NULL,
    observed_at TEXT NOT NULL,
    violation_json TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c1_finalization_violations_date
    ON trade_research_c1_generation_finalization_violations(scan_date,observed_at,violation_id)`).run();'''
once(schema_anchor,schema_add,"append-only finalization schema")

once(
'''  const session=env.V7_DB.withSession("first-primary");
  const contentDigest=await sha256Hex(JSON.stringify(rows));''',
'''  const session=env.V7_DB.withSession("first-primary");
  await C1_GENERATION_FINALIZATION.guardC1GenerationInsertAfterFinalization(session,{
    scanDate:String(receipt.sessionDate),generationId:String(receipt.generationId),observedAt:new Date().toISOString()
  });
  const contentDigest=await sha256Hex(JSON.stringify(rows));''',
  "late-generation research guard"
)

helper=r'''
async function finalizeC1GenerationSetSafe(env,scanDate) {
  const blocked=(reason,error=null)=>({
    ok:false,status:reason,scanDate:String(scanDate||""),error:error?String(error).slice(0,300):null,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  });
  try {
    if(!env?.V7_DB) return blocked("C1_FINALIZATION_D1_REQUIRED");
    const date=String(scanDate||"");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return blocked("C1_FINALIZATION_SCAN_DATE_REQUIRED");
    const today=taiwanDate();
    if(date!==shiftDateString(today,-1)) return blocked("C1_FINALIZATION_NOT_PROSPECTIVE_PREVIOUS_DATE");
    await loadTradingCalendar(env,Number(date.slice(0,4)));
    if(!isTradingDate(date)) return blocked("C1_FINALIZATION_NOT_TRADING_DATE");
    await ensureD1Schema(env);
    const session=env.V7_DB.withSession("first-primary");
    const inventory=await C1_SCAN_ORIGIN.readC1GenerationInventory(session,{scanDate:date,limit:250});
    if(inventory.generationCount<1) return blocked("C1_FINALIZATION_GENERATION_SET_EMPTY");
    const bindingRead=await FORMAL_C1_BINDING.readFormalC1Bindings(session,{scanDate:date});
    if(bindingRead.count<1) return blocked("C1_FINALIZATION_FORMAL_BINDING_MISSING");
    const finalizedAt=new Date().toISOString();
    const sessionIdentityHash=await C1_GENERATION_FINALIZATION.c1FinalizationSha256({
      schemaVersion:"SYSTEM1_SESSION_IDENTITY_V0_1",scanDate:date
    });
    const receipt=await C1_GENERATION_FINALIZATION.buildC1GenerationFinalizationReceipt({
      scanDate:date,inventory,bindings:bindingRead.bindings,sessionIdentityHash,
      finalizedAt,knowledgeCutoff:finalizedAt
    });
    const saved=await C1_GENERATION_FINALIZATION.persistC1GenerationFinalization(session,receipt);
    const readback=await C1_GENERATION_FINALIZATION.readC1GenerationFinalization(session,{scanDate:date});
    if(readback.status!=="FINALIZED_VERIFIED"||readback.receipt?.receiptDigest!==saved.receipt?.receiptDigest)
      return blocked("C1_FINALIZATION_READBACK_MISMATCH");
    return {...readback,producerWindowClosure:"TAIWAN_DATE_ROLLOVER_PLUS_PROSPECTIVE_C1_GUARD",
      historicalBackfillPerformed:false};
  } catch(error) {
    const message=String(error?.message||error||"C1_FINALIZATION_BLOCKED");
    return blocked(message.split(":")[0]||"C1_FINALIZATION_BLOCKED",message);
  }
}

'''
once(
  "async function readC1PopulationReceipt(",
  helper+"async function readC1PopulationReceipt(",
  "finalization safe helper"
)

route=r'''    // BEGIN V8.21 C1 GENERATION FINALIZATION ROUTES
    if (url.pathname === "/api/research/c1-generation-finalization") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      if(!env.V7_DB) return json({ok:false,error:"NO_D1",researchOnly:true},503,true);
      const scanDate=String(url.searchParams.get("scanDate")||"").trim();
      try {
        await ensureD1Schema(env);
        const result=await C1_GENERATION_FINALIZATION.readC1GenerationFinalization(
          env.V7_DB.withSession("first-primary"),{scanDate}
        );
        return json(result,200,true);
      } catch(error) {
        return json({ok:false,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,
          formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true},409,true);
      }
    }
    if (url.pathname === "/api/research/c1-generation-finalize") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json().catch(()=>({}));
        const result=await finalizeC1GenerationSetSafe(env,String(body.scanDate||""));
        return json(result,result.ok===false?409:200,true);
      } catch(error) {
        return json({ok:false,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,
          formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true},409,true);
      }
    }
    // END V8.21 C1 GENERATION FINALIZATION ROUTES

'''
once(
  "    // BEGIN V8.20 FORMAL C1 BINDING ROUTE",
  route+"    // BEGIN V8.20 FORMAL C1 BINDING ROUTE",
  "protected finalization routes"
)

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.21.0 C1 generation-set finalization; Formal Core unchanged")

"""Approved C1 inventory instrumentation candidate; merge/deploy require concrete review."""
from pathlib import Path
import hashlib
p=Path('Worker.js');text=p.read_text(encoding='utf-8')
def once(old,new,label):
 global text
 if text.count(old)!=1:raise SystemExit(f'{label}: expected one anchor, got {text.count(old)}')
 text=text.replace(old,new,1)
source=Path('research/system1_c1_scan_inventory_v0_1.mjs').read_text(encoding='utf-8')
expected='07dadfddec28b86fca2f1fa226995b6525c2e564c99fe83d00ca615ea9a666ea'
if hashlib.sha256(source.encode()).hexdigest()!=expected:raise SystemExit('Frozen C1 scan inventory module changed')
source='\n'.join(line for line in source.splitlines() if not line.startswith('import ')).replace('export ','')
module='\n// BEGIN V8.19 C1 SCAN INVENTORY\nconst C1_SCAN_INVENTORY=(()=>{\nconst {canonicalJcsJson,sha256HexUtf8}=SHADOW_CANONICAL;\n'+source+'\nreturn {buildC1ScanInventory,finalizeC1ScanInventory,verifyC1ScanInventory};\n})();\n// END V8.19 C1 SCAN INVENTORY\n'
once('const VERSION = "8.18.0-valuation-source-vintage";','const VERSION = "8.19.0-c1-scan-origin-inventory";','version')
once('function buildC1PopulationReceipt(',module+'function buildC1PopulationReceipt(','module')
once('scanDate,zeroPickContext=null,valuationContext=null) {','scanDate,zeroPickContext=null,valuationContext=null,scanContext=null) {','capture argument')
once('return VALUATION_VINTAGE.attachValuationSourceVintage(receipt,valuationContext,featureRows||[]);','return C1_SCAN_INVENTORY.buildC1ScanInventory(VALUATION_VINTAGE.attachValuationSourceVintage(receipt,valuationContext,featureRows||[]),scanContext);','same generation capture')
once('  const loadedConfig = await loadStockConfig(env);\n  const currentSymbols','  // BEGIN V8.19 REQUEST SCAN CONTEXT\n  const c1ScanContext={origin:options.c1ScanOrigin,cron:options.c1Cron,scheduledTime,observedAt:new Date().toISOString(),dryRun,staged:options.c1Staged===true,marketSources:marketSourceMeta};\n  // END V8.19 REQUEST SCAN CONTEXT\n  const loadedConfig = await loadStockConfig(env);\n  const currentSymbols','request-local context')
once('V7_VALUATION_SOURCE_VINTAGE:valuationSourceVintageContext','V7_VALUATION_SOURCE_VINTAGE:valuationSourceVintageContext, V7_C1_SCAN_CONTEXT:c1ScanContext','request argument')
once('selected,scanDate,c1ZeroPickContext,env.V7_VALUATION_SOURCE_VINTAGE);','selected,scanDate,c1ZeroPickContext,env.V7_VALUATION_SOURCE_VINTAGE,env.V7_C1_SCAN_CONTEXT);','selector argument')
once('  await VALUATION_VINTAGE.verifyValuationSourceVintage(receipt);','  await VALUATION_VINTAGE.verifyValuationSourceVintage(receipt);\n  receipt=await C1_SCAN_INVENTORY.finalizeC1ScanInventory(receipt);\n  await C1_SCAN_INVENTORY.verifyC1ScanInventory(receipt);','finalize immutable root')
once('  await VALUATION_VINTAGE.verifyValuationSourceVintage({...JSON.parse(headerRow.header_json),rows});','  await VALUATION_VINTAGE.verifyValuationSourceVintage({...JSON.parse(headerRow.header_json),rows});\n  await C1_SCAN_INVENTORY.verifyC1ScanInventory({...JSON.parse(headerRow.header_json),rows});','readback integrity')
once('async function verifyC1StoredGeneration(session,headerRow) {','''async function verifyC1StoredGeneration(session,headerRow) {
  const storedHeader=JSON.parse(headerRow.header_json);
  for(const [field,column] of [["generationId","generation_id"],["sessionDate","scan_date"],["decisionAt","decision_at"],["sourceMainSha","source_main_sha"],["effectiveRuntimeVersion","runtime_version"],["universeScope","universe_scope"],["populationN","population_n"],["featureN","feature_n"]]) {
    if(storedHeader[field]!==headerRow[column]) throw new Error("C1_D1_HEADER_COLUMN_MISMATCH");
  }''','existing header/column consistency gap')
# Exact transport callsites. Never accept provenance labels from HTTP body/query/env.
once('runAfterMarketScan(env,scheduledTime,{dryRun:true,epsReviewOnly:body.epsReviewOnly===true})','runAfterMarketScan(env,scheduledTime,{dryRun:true,epsReviewOnly:body.epsReviewOnly===true,c1ScanOrigin:"HTTP_SCAN_PREVIEW"})','preview')
once('runAfterMarketScan(env, Date.now(), { dryRun: false })','runAfterMarketScan(env, Date.now(), { dryRun: false,c1ScanOrigin:"HTTP_TEST_SCAN" })','test finalize')
once('runAfterMarketScan(env, Date.now(), { dryRun: true })','runAfterMarketScan(env, Date.now(), { dryRun: true,c1ScanOrigin:"HTTP_IMPORT_SCAN" })','import preview')
once('runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true})','runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true,c1ScanOrigin:"HTTP_SCAN_API"})','scan API')
once('runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true})','runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true,c1ScanOrigin:"CRON_AFTER_MARKET",c1Cron:String(controller.cron||"")})','cron')
once('runAfterMarketScan(env,scheduledTime,{dryRun:true});\n      const watch=','runAfterMarketScan(env,scheduledTime,{dryRun:true,c1ScanOrigin:"HYBRID_RESEARCH_PREVIEW"});\n      const watch=','hybrid preview')
once('runAfterMarketScan(env,scheduledTime,{dryRun:true});\n        if(preview','runAfterMarketScan(env,scheduledTime,{dryRun:true,c1ScanOrigin:"STAGED_RECOVERY",c1Staged:true});\n        if(preview','staged capture')
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/Worker-before-v8_19_0.mjs').write_text(p.read_text(encoding='utf-8'),encoding='utf-8')
p.write_text(text,encoding='utf-8',newline='\n')
print('Applied V8.19.0 C1 scan origin and generation inventory; Formal unchanged')

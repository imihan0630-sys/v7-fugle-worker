"""Owner-approved additive C1 scan-origin and generation-inventory capture; Production merge/deploy NOT authorized."""
from pathlib import Path
import hashlib

path=Path('Worker.js')
text=path.read_text(encoding='utf-8')

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f'{label}: expected one anchor, got {count}')
    text=text.replace(old,new,1)

source=Path('research/system1_c1_scan_origin_inventory_v0_1.mjs').read_text(encoding='utf-8')
expected='4052ff24e95ca929ca5c1249c49fa3124d1936e08dac7c1dc49d313207f076b4'
if hashlib.sha256(source.encode()).hexdigest()!=expected:
    raise SystemExit('Frozen C1 scan-origin module changed')
source='\n'.join(line for line in source.splitlines() if not line.startswith('import ')).replace('export ','')
source='\n'.join(('  '+line) if line else '' for line in source.splitlines())
module='''\n// BEGIN V8.19 C1 SCAN ORIGIN INVENTORY
const C1_SCAN_ORIGIN=(()=>{
  const {canonicalJcsJson}=SHADOW_CANONICAL;
'''+source+'''
  return {C1_SCAN_ORIGIN_SCHEMA,C1_GENERATION_INVENTORY_SCHEMA,C1_SCAN_ORIGIN_KINDS,
    buildC1ScanOriginContext,attachC1ScanOrigin,verifyC1ScanOrigin,projectC1GenerationInventoryRecord};
})();
// END V8.19 C1 SCAN ORIGIN INVENTORY
'''

once('const VERSION = "8.18.0-valuation-source-vintage";',
     'const VERSION = "8.19.0-c1-scan-origin-inventory";','version')
once('function buildC1PopulationReceipt(',module+'function buildC1PopulationReceipt(','module')
once('scanDate,zeroPickContext=null,valuationContext=null) {',
     'scanDate,zeroPickContext=null,valuationContext=null,scanOriginContext=null) {','capture argument')
once('''  return VALUATION_VINTAGE.attachValuationSourceVintage(receipt,valuationContext,featureRows||[]);
}''',
     '''  const receiptWithVintage=VALUATION_VINTAGE.attachValuationSourceVintage(receipt,valuationContext,featureRows||[]);
  return C1_SCAN_ORIGIN.attachC1ScanOrigin(receiptWithVintage,scanOriginContext);
}''','origin attachment')
once('selected,scanDate,c1ZeroPickContext,env.V7_VALUATION_SOURCE_VINTAGE);',
     'selected,scanDate,c1ZeroPickContext,env.V7_VALUATION_SOURCE_VINTAGE,env.V7_C1_SCAN_ORIGIN);','selector origin handoff')
once('V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus, V7_VALUATION_SOURCE_VINTAGE:valuationSourceVintageContext }, marketDate);',
     'V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus, V7_VALUATION_SOURCE_VINTAGE:valuationSourceVintageContext, V7_C1_SCAN_ORIGIN:options?.c1ScanOriginContext||null }, marketDate);',
     'request-local origin handoff')
once('''  await VALUATION_VINTAGE.verifyValuationSourceVintage({...JSON.parse(headerRow.header_json),rows});
  return true;''',
     '''  await VALUATION_VINTAGE.verifyValuationSourceVintage({...JSON.parse(headerRow.header_json),rows});
  C1_SCAN_ORIGIN.verifyC1ScanOrigin({...JSON.parse(headerRow.header_json),rows});
  return true;''','stored-generation origin verification')

inventory=r'''
async function readC1GenerationInventory(env,{scanDate=null,cursor=0,limit=50}={}) {
  if(!env?.V7_DB) return {ok:false,error:"NO_D1",researchOnly:true};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const safeCursor=Math.max(0,Math.floor(Number(cursor)||0));
  const safeLimit=Math.max(1,Math.min(100,Math.floor(Number(limit)||50)));
  let countRow,result;
  if(scanDate) {
    countRow=await session.prepare(`SELECT COUNT(*) AS n FROM trade_research_c1_generations WHERE scan_date=?1`).bind(String(scanDate)).first();
    result=await session.prepare(`SELECT * FROM trade_research_c1_generations WHERE scan_date=?1
      ORDER BY created_at DESC,generation_id DESC LIMIT ?2 OFFSET ?3`).bind(String(scanDate),safeLimit,safeCursor).all();
  } else {
    countRow=await session.prepare(`SELECT COUNT(*) AS n FROM trade_research_c1_generations`).first();
    result=await session.prepare(`SELECT * FROM trade_research_c1_generations
      ORDER BY created_at DESC,generation_id DESC LIMIT ?1 OFFSET ?2`).bind(safeLimit,safeCursor).all();
  }
  const total=Math.max(0,Number(countRow?.n)||0);
  const records=(result?.results||[]).map(row=>C1_SCAN_ORIGIN.projectC1GenerationInventoryRecord(row));
  const nextCursor=safeCursor+records.length;
  const latestAttempt=env.STOCKS_KV?await env.STOCKS_KV.get("V7_LAST_SCAN_ATTEMPT","json"):null;
  const attemptRelevant=!scanDate||latestAttempt?.scanDate===scanDate||latestAttempt?.requestedDate===scanDate;
  return {ok:true,schemaVersion:C1_SCAN_ORIGIN.C1_GENERATION_INVENTORY_SCHEMA,
    scanDate:scanDate||null,total,records,
    page:{cursor:safeCursor,limit:safeLimit,returned:records.length,hasMore:nextCursor<total,nextCursor:nextCursor<total?nextCursor:null},
    latestScanAttempt:attemptRelevant&&latestAttempt?{
      status:latestAttempt.status||null,requestedDate:latestAttempt.requestedDate||null,scanDate:latestAttempt.scanDate||null,
      generatedAt:latestAttempt.generatedAt||null,selectedCount:Number.isFinite(Number(latestAttempt.selectedCount))?Number(latestAttempt.selectedCount):null,
      scanOriginKind:latestAttempt.scanOriginKind||null,scanAttemptId:latestAttempt.scanAttemptId||null,
      error:latestAttempt.error?String(latestAttempt.error).slice(0,300):null
    }:null,
    interpretation:"Inventory lists persisted C1 generation headers only. Pre-V8.19 origin is LEGACY_ORIGIN_NOT_CAPTURED; never infer it retroactively.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}

'''
once('async function readC1PopulationReceipt(env,{scanDate=null,generationId=null,cursor=0,limit=1}={}) {',
     inventory+'async function readC1PopulationReceipt(env,{scanDate=null,generationId=null,cursor=0,limit=1}={}) {',
     'generation inventory reader')

route=r'''    if (url.pathname === "/api/research/c1-generation-inventory") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const raw=url.searchParams.get("scanDate");
      const scanDate=raw===null?null:normalizeMarketDate(raw);
      if(raw!==null&&!scanDate) return json({error:"scanDate 無效"},400,true);
      try { return json(await readC1GenerationInventory(env,{
        scanDate,cursor:url.searchParams.get("cursor"),limit:url.searchParams.get("limit")
      }),200,true); }
      catch(error) { return json({ok:false,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,noPlanChanges:true,noTrade:true,noPush:true},500,true); }
    }

'''
once('    if (url.pathname === "/api/research/c1-population") {',
     route+'    if (url.pathname === "/api/research/c1-population") {','protected inventory route')

once('const scan = await runAfterMarketScan(env, Date.now(), { dryRun: false });',
     'const scan = await runAfterMarketScan(env, Date.now(), { dryRun: false, scanOriginKind:"TEST_FINALIZE" });',
     'test finalize origin')
once('return json(await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true}), 200, true);',
     'return json(await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true,scanOriginKind:"AUTHORIZED_MANUAL_API"}), 200, true);',
     'manual scan origin')
once('? await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true})',
     '? await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true,scanOriginKind:"CLOUDFLARE_CRON",scanOriginCronExpression:cronExpression})',
     'cron scan origin')

once('''async function runAfterMarketScan(env, scheduledTime = Date.now(), options = {}) {
  const requestedDate = taiwanDate(scheduledTime);
  const lockKey=`V7_AFTER_MARKET_LEASE:${requestedDate}`;let lease=null;''',
     '''async function runAfterMarketScan(env, scheduledTime = Date.now(), options = {}) {
  const requestedDate = taiwanDate(scheduledTime);
  const c1ScanOriginContext=C1_SCAN_ORIGIN.buildC1ScanOriginContext({
    originKind:options.scanOriginKind||(options.dryRun===true?"READ_ONLY_DRY_RUN":"INTERNAL_UNCLASSIFIED"),
    scanAttemptId:`C1SCAN:${requestedDate}:${crypto.randomUUID()}`,
    requestedDate,invokedAt:new Date().toISOString(),scheduledAt:new Date(scheduledTime).toISOString(),
    cronExpression:options.scanOriginCronExpression??null,onlyIfMissing:options.onlyIfMissing===true,testMode:isTestMode(env)
  });
  const lockKey=`V7_AFTER_MARKET_LEASE:${requestedDate}`;let lease=null;''','scan origin context')
once('const summary = await runAfterMarketScanCore(env, scheduledTime, options);',
     'const summary = await runAfterMarketScanCore(env, scheduledTime, {...options,c1ScanOriginContext});','core origin context')

Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/Worker-before-v8_19_0.mjs').write_text(path.read_text(encoding='utf-8'),encoding='utf-8')
path.write_text(text,encoding='utf-8')
print('Applied V8.19.0 C1 scan-origin and generation inventory; Formal unchanged')

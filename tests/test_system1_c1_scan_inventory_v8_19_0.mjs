import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {buildC1ScanInventory,finalizeC1ScanInventory,verifyC1ScanInventory} from '../research/system1_c1_scan_inventory_v0_1.mjs';
import {collectC1ScanInventoryEvidence} from '../research/system1_c1_scan_inventory_collection_v0_1.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const baseline=fs.readFileSync('artifacts/Worker-before-v8_19_0.mjs','utf8');
const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
const body=(s,n)=>{const i=s.indexOf('function '+n+'(');assert.ok(i>=0);return s.slice(i,s.indexOf('\n}',i)+2);};
const plumbing=['buildC1PopulationReceipt','runAfterMarketScanCore','selectTomorrowCandidates','persistC1PopulationReceipt','verifyC1StoredGeneration'];
for(const name of ['v7-regression.yml','v7-repair-ci.yml','v7-cloudflare.yml']){
 const workflow=fs.readFileSync('.github/workflows/'+name,'utf8');
 const chain=[...workflow.matchAll(/python3 (scripts\/apply_v8_[\d_]+\.py)/g)].map(m=>m[1]);
 assert.equal(chain.filter(x=>x==='scripts/apply_v8_19_0.py').length,1,name+' new patch built once');
 assert.equal(chain.indexOf('scripts/apply_v8_19_0.py'),chain.indexOf('scripts/apply_v8_18_0.py')+1,name+' preserve patch order');
 assert.ok(workflow.includes('const VERSION = "8.19.0-c1-scan-origin-inventory";'));
 assert.doesNotMatch(workflow,/run: python3[^\n]+\n\s+python3/,'single-line run must not fold the next patch into an argument');
}
let normalized=source.replace('8.19.0-c1-scan-origin-inventory','8.18.0-valuation-source-vintage').replace(/\n\/\/ BEGIN V8\.19 C1 SCAN INVENTORY[\s\S]*?\/\/ END V8\.19 C1 SCAN INVENTORY\n/,'');
for(const n of plumbing)normalized=normalized.replace(body(normalized,n),body(baseline,n));
normalized=normalized.replace(/,c1ScanOrigin:"[A-Z_]+"(?:,c1Cron:String\(controller.cron\|\|""\))?(?:,c1Staged:true)?/g,'');
assert.equal(sha(normalized),sha(baseline),'all runtime outside additive plumbing/transport labels byte-identical');
assert.equal(body(source,'selectTomorrowCandidates').replace(',env.V7_C1_SCAN_CONTEXT',''),body(baseline,'selectTomorrowCandidates'));
assert.equal(body(source,'runAfterMarketScanCore').replace(/  \/\/ BEGIN V8\.19 REQUEST SCAN CONTEXT[\s\S]*?  \/\/ END V8\.19 REQUEST SCAN CONTEXT\n/,'').replace(', V7_C1_SCAN_CONTEXT:c1ScanContext',''),body(baseline,'runAfterMarketScanCore'));
assert.equal((source.match(/c1ScanOrigin:"/g)||[]).length,7,'every actual scan entry point labeled');
assert.ok(!source.includes('c1ScanOrigin:body.'));
const load=s=>import('data:text/javascript;base64,'+Buffer.from(s+'\nexport {buildC1PopulationReceipt,persistC1PopulationReceipt,readC1PopulationReceipt,persistCompletedC1Safe,selectTomorrowCandidates};').toString('base64'));
const api=await load(source);
class Statement{
 constructor(owner,sql){this.owner=owner;this.sql=sql;this.args=[];}
 bind(...args){this.args=args;return this;}
 run(){if(this.owner.fail?.(this.sql))throw Error('D1 injected failure');return this.owner.db.prepare(this.sql).run(...this.args);}
 first(){return this.owner.db.prepare(this.sql).get(...this.args)||null;}
 all(){return {results:this.owner.db.prepare(this.sql).all(...this.args)};}
}
class D1{
 constructor(){this.db=new DatabaseSync(':memory:');}
 prepare(sql){return new Statement(this,sql);}
 withSession(){return this;}
 async batch(statements){this.db.exec('BEGIN');try{for(const s of statements)s.run();this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
}
const day='2026-10-05',stamp=day+'T15:35:00.000Z';
const OriginalDate=Date;
class FixtureDate extends OriginalDate{constructor(...args){super(...(args.length?args:[stamp]));}static now(){return OriginalDate.parse(stamp);}}
const context={origin:'CRON_AFTER_MARKET',cron:'35,55 15 * * mon-fri',scheduledTime:Date.parse(stamp),observedAt:stamp,dryRun:false};
const rows=Array.from({length:110},(_,i)=>({symbol:String(2000+i),close:100,market:'TWSE',industry:'Steel'}));
function make(ctx=context){globalThis.Date=FixtureDate;try{return api.buildC1PopulationReceipt([],rows,{stocks:{}},{},new Map(),[],day,null,null,ctx);}finally{globalThis.Date=OriginalDate;}}
const receipt=make();
assert.equal(receipt.scanInventory.scanOrigin.entryPoint,'CRON_AFTER_MARKET');
assert.equal(receipt.scanInventory.scanOrigin.actorIdentity,'NOT_PROVEN');
assert.equal(receipt.scanInventory.inventory.populationN,110);
assert.equal(receipt.scanInventory.inventory.featureN,0);
assert.equal(receipt.scanInventory.inventory.listingPopulation,'NOT_CAPTURED');
assert.equal(receipt.scanInventory.inventory.shadowMembership,'SEPARATE_POST_C1_PERSISTENCE_CHECK_REQUIRED');
assert.equal(make(null).scanInventory.scanOrigin.entryPoint,'UNKNOWN');
assert.equal(make().scanInventory.marketInputOrigins[0].state,'UNKNOWN');
const marketCtx={...context,marketSources:{TWSE:{source:'VERIFIED_CLOSING_CACHE',marketDate:day,fallback:false,count:1000},TPEx:{source:'HISTORY_CACHE',marketDate:day,fallback:true,count:800}}};
const marketReceipt=make(marketCtx);marketCtx.marketSources.TWSE.source='later mutation';
assert.equal(marketReceipt.scanInventory.marketInputOrigins[0].source,'VERIFIED_CLOSING_CACHE');
assert.equal(marketReceipt.scanInventory.marketInputOrigins[1].fallback,true);
assert.equal(make({...context,origin:'GITHUB_AUTOMATION'}).scanInventory.scanOrigin.entryPoint,'UNKNOWN');
assert.equal(make({...context,observedAt:'2099-01-01T00:00:00Z'}).scanInventory.scanOrigin.clockState,'UNKNOWN');
assert.equal(make({...context,origin:'STAGED_RECOVERY',dryRun:true,staged:true}).scanInventory.scanOrigin.executionMode,'STAGED_CAPTURE');
for(const origin of ['HTTP_SCAN_API','HTTP_SCAN_PREVIEW','HTTP_TEST_SCAN','HTTP_IMPORT_SCAN','HYBRID_RESEARCH_PREVIEW']){
 const r=make({...context,origin});assert.equal(r.scanInventory.scanOrigin.entryPoint,origin);assert.equal(r.scanInventory.scanOrigin.cron,null);
}
const final=await finalizeC1ScanInventory(receipt);
assert.equal((await verifyC1ScanInventory(final)).status,'SCAN_INVENTORY_VERIFIED');
const tampered=structuredClone(final);tampered.scanInventory.scanOrigin.entryPoint='HTTP_SCAN_API';
await assert.rejects(()=>verifyC1ScanInventory(tampered),/ROOT_DIGEST/);
await assert.rejects(()=>verifyC1ScanInventory({...final,generationId:'foreign'}),/PARENT_MISMATCH/);
const legacy={...receipt,effectiveRuntimeVersion:'8.18.0-valuation-source-vintage'};delete legacy.scanInventory;
assert.equal((await verifyC1ScanInventory(legacy)).status,'LEGACY_NO_SCAN_INVENTORY');
assert.equal(await finalizeC1ScanInventory(legacy),legacy,'legacy never backfilled');
await assert.rejects(()=>verifyC1ScanInventory({...receipt,scanInventory:undefined}),/CAPTURE_MISSING/);
await assert.rejects(()=>verifyC1ScanInventory({...final,effectiveRuntimeVersion:'8.18.0-valuation-source-vintage'}),/LEGACY_NO_BACKFILL/);
const env={V7_DB:new D1()};
const save=await api.persistC1PopulationReceipt(env,receipt);assert.equal(save.readbackVerified,true);
assert.equal((await api.persistC1PopulationReceipt(env,receipt)).deduplicated,true);
const pages=[];let cursor=0;
do{const p=await api.readC1PopulationReceipt(env,{generationId:receipt.generationId,cursor,limit:1});pages.push(p);cursor=p.page.nextCursor;}while(cursor!==null);
assert.ok(pages.length>=3);
assert.equal((await collectC1ScanInventoryEvidence(pages)).status,'SCAN_INVENTORY_VERIFIED');
const changedPage=structuredClone(pages);changedPage[1].header.scanInventory.scanOrigin.actorIdentity='claimed';
assert.equal((await collectC1ScanInventoryEvidence(changedPage)).status,'DATA_QUALITY_BLOCKED');
const original=env.V7_DB.db.prepare('SELECT header_json FROM trade_research_c1_generations WHERE generation_id=?').get(receipt.generationId).header_json;
const h=JSON.parse(original);h.scanInventory.scanOrigin.entryPoint='HTTP_SCAN_API';
env.V7_DB.db.prepare('UPDATE trade_research_c1_generations SET header_json=? WHERE generation_id=?').run(JSON.stringify(h),receipt.generationId);
await assert.rejects(()=>api.readC1PopulationReceipt(env,{generationId:receipt.generationId}),/ROOT_DIGEST/);
env.V7_DB.db.prepare('UPDATE trade_research_c1_generations SET header_json=? WHERE generation_id=?').run(original,receipt.generationId);
env.V7_DB.db.prepare('UPDATE trade_research_c1_generations SET scan_date=? WHERE generation_id=?').run('2026-10-01',receipt.generationId);
await assert.rejects(()=>api.readC1PopulationReceipt(env,{generationId:receipt.generationId}),/HEADER_COLUMN_MISMATCH/);
env.V7_DB.db.prepare('UPDATE trade_research_c1_generations SET scan_date=? WHERE generation_id=?').run(day,receipt.generationId);
await assert.rejects(()=>api.persistC1PopulationReceipt(env,tampered),/IMMUTABLE_GENERATION_CONFLICT/);
env.V7_DB.fail=sql=>sql.includes('INSERT INTO trade_research_c1_chunks');
const failed=await api.persistCompletedC1Safe(env,make(),day,{selectionVerified:true,now:Date.parse(stamp)});
assert.equal(failed.saveOk,false);assert.equal(failed.status,'DATA_QUALITY_BLOCKED');
env.V7_DB.fail=null;
const safe=await api.persistCompletedC1Safe(env,make(),day,{selectionVerified:true,now:Date.parse(stamp)});
assert.equal(safe.saveOk,true);assert.equal(safe.shadowCohort.status,'VERIFIED','existing membership shares the same C1 root');
assert.equal((await api.persistCompletedC1Safe(env,make(),day,{selectionVerified:false,now:Date.parse(stamp)})).saveOk,false);
assert.equal((await api.persistCompletedC1Safe(env,make(),day,{selectionVerified:true,now:Date.parse('2026-10-06T10:00:00Z')})).saveOk,false);
const legacyEnv={V7_DB:new D1()},before=await load(baseline);
globalThis.Date=FixtureDate;let oldReceipt;try{oldReceipt=before.buildC1PopulationReceipt([],rows,{stocks:{}},{},new Map(),[],day);}finally{globalThis.Date=OriginalDate;}
await before.persistC1PopulationReceipt(legacyEnv,oldReceipt);
const oldPage=await api.readC1PopulationReceipt(legacyEnv,{generationId:oldReceipt.generationId,limit:2});
assert.equal((await collectC1ScanInventoryEvidence([oldPage])).status,'DATA_QUALITY_BLOCKED','partial legacy pagination cannot prove inventory');
const oldPages=[oldPage,await api.readC1PopulationReceipt(legacyEnv,{generationId:oldReceipt.generationId,cursor:oldPage.page.nextCursor,limit:2})];
assert.equal((await collectC1ScanInventoryEvidence(oldPages)).status,'LEGACY_NO_SCAN_INVENTORY','new reader accepts genuine old D1 receipt without backfill');
assert.equal((await api.persistC1PopulationReceipt(legacyEnv,oldReceipt)).deduplicated,true,'legacy idempotent persistence remains compatible');
const cryptoDescriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
try{
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{randomUUID:crypto.randomUUID.bind(crypto),subtle:{digest(){throw Error('injected digest outage');}}}});
 const failed=await api.persistCompletedC1Safe(env,make(),day,{selectionVerified:true,now:Date.parse(stamp)});
 assert.equal(failed.saveOk,false);assert.equal(failed.noPush,true);assert.equal(failed.formalCoreImpact,false);
}finally{Object.defineProperty(globalThis,'crypto',cryptoDescriptor);}
const evidence={evidenceType:'LOCAL_SQLITE_D1_ADAPTER_READBACK_NOT_PRODUCTION',generationId:receipt.generationId,contentDigest:save.contentDigest,pages:pages.length,readback:await collectC1ScanInventoryEvidence(pages)};
fs.writeFileSync('artifacts/system1-c1-scan-inventory-readback.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({ok:true,protectedRuntimeParity:true,sqliteReadbackVerified:true,pages:pages.length,legacyNoBackfill:true,failOpenFormal:true,fixtureOnly:true}));

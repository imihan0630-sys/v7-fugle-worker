import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  C1_SCAN_ORIGINS,
  attachC1ScanOrigin,
  verifyC1ScanOrigin,
  readC1GenerationInventory
} from '../research/system1_c1_scan_origin_generation_inventory_v0_1.mjs';

let passed=0;
const t=async(name,fn)=>{await fn();passed++;console.log('PASS',name);};
const day='2026-10-05';
const decision=day+'T10:20:00.000Z';
const receipt=(generationId='g1',version='8.19.0-c1-scan-origin-generation-inventory')=>({
  generationId,sessionDate:day,decisionAt:decision,capturedAt:decision,
  effectiveRuntimeVersion:version,sourceMainSha:'a'.repeat(40)
});

await t('modern after-market origin is explicit and parent-bound',async()=>{
  const r=attachC1ScanOrigin(receipt(),{origin:C1_SCAN_ORIGINS.AFTER_MARKET_SCAN_PIPELINE,scanDate:day});
  const v=verifyC1ScanOrigin(r);
  assert.equal(v.status,'SCAN_ORIGIN_CAPTURED');
  assert.equal(v.originKind,'AFTER_MARKET_SCAN_PIPELINE');
  assert.equal(v.triggerTransport,'NOT_IDENTIFIED_BY_THIS_CAPTURE');
  assert.equal(r.scanOrigin.dryRunComputation,false);
  assert.equal(r.scanOrigin.backfilled,false);
});

await t('stage-selection origin records dry-run compute path without inventing scheduler origin',async()=>{
  const r=attachC1ScanOrigin(receipt('g2'),{origin:C1_SCAN_ORIGINS.STAGE_SELECTION_ROUTE,scanDate:day});
  assert.equal(r.scanOrigin.requestRoute,'/api/scan/stage-selection');
  assert.equal(r.scanOrigin.dryRunComputation,true);
  assert.equal(r.scanOrigin.triggerTransport,'AUTHORIZED_ADMIN_ROUTE');
  assert.equal(verifyC1ScanOrigin(r).originKind,'STAGE_SELECTION_ROUTE');
});

await t('same generation cannot be relabeled to another origin',async()=>{
  const r=attachC1ScanOrigin(receipt(),{origin:C1_SCAN_ORIGINS.AFTER_MARKET_SCAN_PIPELINE,scanDate:day});
  assert.throws(()=>attachC1ScanOrigin(r,{origin:C1_SCAN_ORIGINS.STAGE_SELECTION_ROUTE,scanDate:day}),/C1_SCAN_ORIGIN_CONFLICT/);
});

await t('V8.19 missing origin fails closed',async()=>{
  assert.throws(()=>verifyC1ScanOrigin(receipt()),/C1_SCAN_ORIGIN_CAPTURE_MISSING/);
});

await t('pre-V8.19 generation remains legacy and is never backfilled',async()=>{
  const legacy=receipt('legacy','8.18.0-valuation-source-vintage');
  const v=verifyC1ScanOrigin(legacy);
  assert.equal(v.status,'LEGACY_NO_SCAN_ORIGIN');
  assert.equal(v.eligibleForOriginInference,false);
  const forged={...legacy,scanOrigin:attachC1ScanOrigin({...receipt('tmp'),effectiveRuntimeVersion:'8.19.0-c1-scan-origin-generation-inventory'}).scanOrigin};
  assert.throws(()=>verifyC1ScanOrigin(forged),/C1_SCAN_ORIGIN_LEGACY_CONFLICT/);
});

await t('parent generation/date/clock mismatch is rejected',async()=>{
  const r=attachC1ScanOrigin(receipt(),{origin:C1_SCAN_ORIGINS.AFTER_MARKET_SCAN_PIPELINE});
  assert.throws(()=>verifyC1ScanOrigin({...r,generationId:'other'}),/C1_SCAN_ORIGIN_PARENT_MISMATCH/);
  assert.throws(()=>attachC1ScanOrigin(receipt(),{scanDate:'2026-10-04'}),/C1_SCAN_ORIGIN_SESSION_MISMATCH/);
});

function storedRow(header,extra={}){
  return {
    generation_id:header.generationId,scan_date:header.sessionDate,decision_at:header.decisionAt,
    captured_at:header.capturedAt,created_at:header.capturedAt,source_main_sha:header.sourceMainSha,
    runtime_version:header.effectiveRuntimeVersion,universe_digest:'b'.repeat(64),content_digest:'c'.repeat(64),
    population_n:10,captured_n:10,feature_n:8,chunk_count:1,completeness:'COMPLETE',
    header_json:JSON.stringify(header),...extra
  };
}
class FakeStatement{
  constructor(db,sql){this.db=db;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  first(){
    if(this.sql.includes('COUNT(*)'))return {n:this.db.rows.filter(r=>r.scan_date===this.args[0]).length};
    throw new Error('unexpected first query');
  }
  all(){
    if(!this.sql.includes('FROM trade_research_c1_generations'))throw new Error('unexpected all query');
    const [date,limit]=this.args;
    return {results:this.db.rows.filter(r=>r.scan_date===date)
      .sort((a,b)=>a.decision_at.localeCompare(b.decision_at)||a.generation_id.localeCompare(b.generation_id))
      .slice(0,Number(limit))};
  }
}
class FakeDb{
  constructor(rows){this.rows=rows;}
  prepare(sql){return new FakeStatement(this,sql);}
}

await t('generation inventory distinguishes legacy and modern origin without backfill',async()=>{
  const modern=attachC1ScanOrigin(receipt('modern'),{origin:C1_SCAN_ORIGINS.AFTER_MARKET_SCAN_PIPELINE});
  const legacy=receipt('legacy','8.18.0-valuation-source-vintage');
  legacy.decisionAt=day+'T10:10:00.000Z';legacy.capturedAt=legacy.decisionAt;
  const inv=await readC1GenerationInventory(new FakeDb([storedRow(modern),storedRow(legacy)]),{scanDate:day,limit:100});
  assert.equal(inv.generationCount,2);
  assert.equal(inv.returnedCount,2);
  assert.equal(inv.truncated,false);
  assert.equal(inv.historicalBackfillPerformed,false);
  assert.deepEqual(inv.generations.map(x=>x.generationId),['legacy','modern']);
  assert.equal(inv.generations[0].originStatus,'LEGACY_NO_SCAN_ORIGIN');
  assert.equal(inv.generations[1].originKind,'AFTER_MARKET_SCAN_PIPELINE');
  assert.equal(inv.modernOriginCoverageComplete,true);
});

await t('inventory total denominator stays distinct from limited returned rows',async()=>{
  const rows=[];
  for(let i=0;i<3;i++){
    const h=attachC1ScanOrigin({...receipt('g'+i),decisionAt:day+`T10:2${i}:00.000Z`},{origin:C1_SCAN_ORIGINS.DIRECT_SAFE_PERSISTENCE_CALLER});
    rows.push(storedRow(h));
  }
  const inv=await readC1GenerationInventory(new FakeDb(rows),{scanDate:day,limit:2});
  assert.equal(inv.generationCount,3);
  assert.equal(inv.returnedCount,2);
  assert.equal(inv.truncated,true);
});

await t('corrupt modern generation is visible as blocked, never silently omitted',async()=>{
  const modern=receipt('broken');
  const inv=await readC1GenerationInventory(new FakeDb([storedRow(modern)]),{scanDate:day});
  assert.equal(inv.generationCount,1);
  assert.equal(inv.integrityComplete,false);
  assert.equal(inv.modernOriginCoverageComplete,false);
  assert.equal(inv.generations[0].originStatus,'DATA_QUALITY_BLOCKED');
  assert.match(inv.generations[0].error,/C1_SCAN_ORIGIN_CAPTURE_MISSING/);
});

await t('empty legacy-only inventory does not claim modern origin coverage',async()=>{
  const inv=await readC1GenerationInventory(new FakeDb([]),{scanDate:day});
  assert.equal(inv.generationCount,0);
  assert.equal(inv.modernOriginCoverageComplete,null);
});

await t('effective Worker wires explicit origins and protected read-only route',async()=>{
  const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
  const runtimeVersion=(source.match(/const VERSION = "([^"]+)";/)||[])[1]||"";
  assert.ok([
    "8.19.0-c1-scan-origin-generation-inventory",
    "8.19.1-pve250-runtime-remediation",
    "8.20.0-formal-c1-binding-ledger",
    "8.20.1-cross-midnight-recovery-readback",
    "8.20.2-idempotent-d1-snapshots",
    "8.21.0-c1-generation-set-finalization"
  ].includes(runtimeVersion),"unexpected V8.19-layer effective Worker version: "+runtimeVersion);
  assert.match(source,/url\.pathname === "\/api\/research\/c1-generation-inventory"/);
  assert.match(source,/scanOrigin:C1_SCAN_ORIGIN\.C1_SCAN_ORIGINS\.AFTER_MARKET_SCAN_PIPELINE/);
  assert.match(source,/scanOrigin:C1_SCAN_ORIGIN\.C1_SCAN_ORIGINS\.STAGE_SELECTION_ROUTE/);
  assert.match(source,/if\(!isAuthorized\(request,env\)\) return json\(\{error:"ADMIN_TOKEN 錯誤"\},401,true\);/);
  assert.ok(!source.includes('CREATE TABLE IF NOT EXISTS trade_research_c1_generation_inventory'));
});

await t('V8.19 layer contains no provider fetch and preserves Formal core functions byte-for-byte',async()=>{
  const before=fs.readFileSync('artifacts/Worker-before-v8_19_0.mjs','utf8');
  const after=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
  const body=(s,name)=>{
    const start=s.indexOf('function '+name+'(');
    assert.ok(start>=0,'missing '+name);
    const end=s.indexOf('\n}',start);
    assert.ok(end>start,'missing end '+name);
    return s.slice(start,end+2);
  };
  for(const name of ['scoreCandidate','strategySetupState','applyMarketConsensus']){
    assert.equal(body(after,name),body(before,name),name+' changed');
  }
  const marker=after.slice(after.indexOf('// BEGIN V8.19 C1 SCAN ORIGIN GENERATION INVENTORY'),after.indexOf('// END V8.19 C1 SCAN ORIGIN GENERATION INVENTORY'));
  assert.ok(!marker.includes('fetch('));
});

console.log(`SUMMARY ${passed}/12 PASS`);

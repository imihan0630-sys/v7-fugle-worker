import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  C1_SCAN_ORIGIN_SCHEMA,C1_GENERATION_INVENTORY_SCHEMA,C1_SCAN_ORIGIN_KINDS,
  buildC1ScanOriginContext,attachC1ScanOrigin,verifyC1ScanOrigin,projectC1GenerationInventoryRecord
} from '../research/system1_c1_scan_origin_inventory_v0_1.mjs';

let n=0;
const context=buildC1ScanOriginContext({
  originKind:'CLOUDFLARE_CRON',scanAttemptId:'C1SCAN:2026-10-05:12345678-abcd',
  requestedDate:'2026-10-05',invokedAt:'2026-10-05T15:35:00.000Z',scheduledAt:'2026-10-05T15:35:00.000Z',
  cronExpression:'35 15 * * MON-FRI',onlyIfMissing:true,testMode:false
});
assert.equal(context.schemaVersion,C1_SCAN_ORIGIN_SCHEMA);n++;
assert.equal(C1_SCAN_ORIGIN_KINDS.includes('READ_ONLY_DRY_RUN'),true);n++;
const base={schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',generationId:'C1:2026-10-05:fixture',
  sourceMainSha:'a'.repeat(40),effectiveRuntimeVersion:'8.19.0-c1-scan-origin-inventory',
  sessionDate:'2026-10-05',decisionAt:'2026-10-05T15:35:01.000Z',capturedAt:'2026-10-05T15:35:01.000Z',
  universeScope:'fixture',populationN:2,featureN:2,rows:[{symbol:'1111'},{symbol:'2222'}]};
const attached=attachC1ScanOrigin(base,context);
assert.equal(attached.scanOrigin.originKind,'CLOUDFLARE_CRON');n++;
assert.equal(attached.scanOrigin.generationId,base.generationId);n++;
assert.deepEqual(attached.rows[0].c1ScanOriginAnchor,attached.scanOrigin);n++;
assert.deepEqual(verifyC1ScanOrigin(attached),{ok:true,state:'CAPTURED',originKind:'CLOUDFLARE_CRON',scanAttemptId:context.scanAttemptId});n++;
const unclassified=attachC1ScanOrigin({...base,rows:base.rows.map(x=>({...x}))},null);
assert.equal(unclassified.scanOrigin.originKind,'INTERNAL_UNCLASSIFIED');assert.match(unclassified.scanOrigin.scanAttemptId,/^C1SCAN:2026-10-05:/);n+=2;
const tampered=structuredClone(attached);tampered.rows[0].c1ScanOriginAnchor.originKind='AUTHORIZED_MANUAL_API';
assert.throws(()=>verifyC1ScanOrigin(tampered),/ANCHOR_MISMATCH/);n++;
const missing={...base,rows:base.rows.map(x=>({...x}))};
assert.throws(()=>verifyC1ScanOrigin(missing),/REQUIRED_FOR_V819_PLUS/);n++;
assert.equal(verifyC1ScanOrigin({...missing,effectiveRuntimeVersion:'8.18.0-valuation-source-vintage'}).state,'LEGACY_ORIGIN_NOT_CAPTURED');n++;

const row={generation_id:attached.generationId,scan_date:attached.sessionDate,decision_at:attached.decisionAt,captured_at:attached.capturedAt,
 source_main_sha:attached.sourceMainSha,runtime_version:attached.effectiveRuntimeVersion,universe_scope:'fixture',
 universe_digest:'u',content_digest:'c',population_n:2,captured_n:2,feature_n:2,chunk_count:1,completeness:'COMPLETE',
 header_json:JSON.stringify(attached),created_at:'2026-10-05T15:35:02.000Z'};
const projected=projectC1GenerationInventoryRecord(row);
assert.equal(projected.scanOriginState,'CAPTURED');assert.equal(projected.scanAttemptId,context.scanAttemptId);n+=2;
const legacy=projectC1GenerationInventoryRecord({...row,runtime_version:'8.18.0-valuation-source-vintage',
 header_json:JSON.stringify({...attached,effectiveRuntimeVersion:'8.18.0-valuation-source-vintage',scanOrigin:undefined,rows:undefined})});
assert.equal(legacy.scanOriginState,'LEGACY_ORIGIN_NOT_CAPTURED');assert.equal(legacy.scanOriginKind,null);n+=2;
assert.equal(C1_GENERATION_INVENTORY_SCHEMA,'SYSTEM1_C1_GENERATION_INVENTORY_V0_1');n++;

const before=fs.readFileSync('artifacts/Worker-before-v8_19_0.mjs','utf8');
const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
assert.match(source,/const VERSION = "8\.19\.0-c1-scan-origin-inventory";/);n++;
assert.match(source,/url\.pathname === "\/api\/research\/c1-generation-inventory"/);n++;
assert.match(source,/scanOriginKind:"AUTHORIZED_MANUAL_API"/);n++;
assert.match(source,/scanOriginKind:"CLOUDFLARE_CRON"/);n++;
assert.match(source,/scanOriginKind:"TEST_FINALIZE"/);n++;
assert.match(source,/LEGACY_ORIGIN_NOT_CAPTURED/);n++;

function functions(text){
 const matches=[...text.matchAll(/^(?:async )?function (\w+)\(/gm)],out={};
 for(const m of matches){const tail=text.slice(m.index+m[0].length);const e=tail.search(/^}\s*$/m);assert.ok(e>=0);out[m[1]]=text.slice(m.index,m.index+m[0].length+e+1).trimEnd();}
 return out;
}
const a=functions(before),b=functions(source);
const changed=Object.keys(a).filter(k=>a[k]!==b[k]);
const allowed=new Set(['buildC1PopulationReceipt','selectTomorrowCandidates','verifyC1StoredGeneration','runAfterMarketScanCore','runAfterMarketScan','runScheduledWithAudit']);
assert.deepEqual(changed.filter(x=>!allowed.has(x)),[]);n++;
assert.deepEqual(Object.keys(b).filter(x=>!(x in a)),['readC1GenerationInventory']);n++;
for(const critical of ['scoreCandidate','applyMarketConsensus','strategySetupState','evaluatePullback','evaluateMomentum']){
 assert.equal(a[critical],b[critical],critical+' must remain byte-identical');n++;
}
console.log(JSON.stringify({ok:true,assertions:n,fixtureOnly:true,formalCoreImpact:false,
 scanOriginSchema:C1_SCAN_ORIGIN_SCHEMA,inventorySchema:C1_GENERATION_INVENTORY_SCHEMA,
 changedFunctions:changed,newFunctions:Object.keys(b).filter(x=>!(x in a))}));

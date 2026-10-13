import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {inventoryOfficialA1CaSixLaneV0_1 as inventory}
 from '../scripts/inventory_official_a1_ca_six_lane_v0_1.mjs';
const dates=Array.from({length:60},(_,i)=>{
 const d=new Date('2026-07-01T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
}).concat(['2026-10-13']);
async function source(){
 const manifest={tradingDates:dates,effectiveTradingDay:'2026-10-13',
  sourceMarketDatePairsExpected:122,sourceMarketDatePairsValidated:122,
  sourceCoverage:'COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED',
  manifestSha256:'a'.repeat(64),originalOfficialProvenanceHash:'b'.repeat(64)};
 const a={schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',marketDate:'2026-10-13',
  manifestSha256:manifest.manifestSha256,
  sourceReceiptHash:manifest.originalOfficialProvenanceHash,
  sourceMarketDatePairsVerified:122,originalFilesRehashedAfterDownload:122,
  independentOfficialCalendarReadbackVerified:true,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  strategyPitCertified:false,selectionAuthorized:false};
 return {manifest,audit:{...a,auditHash:await sha256Hex(a)}};
}
const fetchHttpError=async()=>({ok:false,status:503,headers:{get:()=>null},
 arrayBuffer:async()=>new ArrayBuffer(0)});
test('six source HTTP errors fail closed and still produce a bounded matrix',async()=>{
 const x=await inventory({...await source(),fetchImpl:fetchHttpError,
   clock:()=>new Date('2026-10-13T12:00:00Z')});
 assert.equal(x.laneCount,6);
 assert.equal(x.finalResultReadyCount,0);
 assert.equal(x.revisionHistoryReadyCount,0);
 assert.equal(x.selectionAuthorized,false);
 assert.equal(x.noEventMayBeClaimed,false);
 assert.equal(x.lanes.every(r=>r.state==='UNAVAILABLE_FAIL_CLOSED'),true);
});
test('independent audit hash mutation cannot be accepted',async()=>{
 const s=await source();s.audit.marketDate='2026-10-12';
 await assert.rejects(()=>inventory({...s,fetchImpl:fetchHttpError}),/INDEPENDENT_AUDIT_MISMATCH/);
});
test('partial 121-of-122 raw market source denies even CA inventory',async()=>{
 const s=await source();s.manifest.sourceMarketDatePairsValidated=121;
 await assert.rejects(()=>inventory({...s,fetchImpl:fetchHttpError}),/SOURCE_INCOMPLETE/);
});
test('success-shaped empty final result never equals no-event or continuity',async()=>{
 const s=await source();
 const mock=async url=>{
  const twse=url.includes('twse.com.tw'),start=dates[0].replaceAll('-',''),
    end='20261013';
  const json=twse?{stat:'OK',strDate:start,endDate:end,
    fields:['資料日期','股票代號','除權息前收盤價','除權息參考價'],data:[]}:
    {stat:'ok',date:dates[0].replaceAll('-','/')+'~2026/10/13',
     tables:[{fields:['除權息日期','代號','除權息前收盤價','除權息參考價'],data:[]}]};
  return {ok:true,status:200,headers:{get:()=>null},
    arrayBuffer:async()=>Buffer.from(JSON.stringify(json))};
 };
 const x=await inventory({...s,fetchImpl:mock,
   clock:()=>new Date('2026-10-13T12:00:00Z')});
 assert.equal(x.laneCount,6);
 assert.equal(x.revisionHistoryReadyCount,0);
 assert.equal(x.noEventMayBeClaimed,false);
 assert.equal(x.continuityBySymbolGenerated,false);
 assert.equal(x.selectedCount,null);
});
test('no secrets, public raw publisher, Cloudflare or formal mutation',async()=>{
 const {readFile}=await import('node:fs/promises');
 const code=await readFile('system2/scripts/inventory_official_a1_ca_six_lane_v0_1.mjs','utf8');
 // Once-only physical source workflow is intentionally removed after PASS.
 // The durable pure research module must remain nonprivileged independently.
 await assert.rejects(
   ()=>readFile('.github/workflows/system2-a1-ca-six-lane-inventory-once.yml','utf8'),
   {code:'ENOENT'}
 );
 assert.doesNotMatch(code,/git push|INSERT INTO|api\.cloudflare\.com/);
 assert.doesNotMatch(code,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|S2_A1_ARCHIVE_DEPLOY_KEY/);
});

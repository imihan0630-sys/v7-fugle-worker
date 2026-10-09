import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {auditTwse2026JulSepPhysicalReadonlyV0_1 as audit} from
  "../runtime/twse2026_jul_sep_independent_physical_readonly_v0_1.mjs";

const hash=m=>String(m).repeat(64);
const key=m=>"S2-HIST-SEGMENT-MONTH|TWSE|2026|"+String(m).padStart(2,"0");
function fixture({missing=null,missingCheckpoint=null,hashMismatch=null,writeCount=0,
  receiptsWithWrongMarket=false,monthsWithCorruptFullByte=null}={}){
  const queries=[],verified=[];
  const db={database:{name:"system2-research"},metrics:{rowsWritten:writeCount,rowsRead:0,requestCount:0},
    prepare(sql){
      queries.push(sql);
      assert.match(sql,/^\s*SELECT\b/);
      return {bind(id){const m=Number(id.slice(-2));return {async first(){
        if(sql.includes("s2_historical_segment_ingest_receipts")){
          if(m===missing)return null;
          return {batch_id:key(m),receipt_id:"S2HSR-"+hash(m),
            market:receiptsWithWrongMarket&&m===8?"TPEX":"TWSE",year:2026,month:m,
            state:"COMPLETE",pack_count:310,bar_count:22000,
            manifest_rolling_hash:hash(m),completed_at:"2026-10-09T02:00:00Z"};
        }
        if(m===missingCheckpoint)return null;
        return {state:"COMPLETE",rolling_hash:m===hashMismatch?hash(4):hash(m),
          expected_pack_count:310,expected_bar_count:22000,
          object_ready_count:310,manifest_committed_count:310,next_pack_index:310};
      }}};
    }},
  };
  const store={backend:"CLOUDFLARE_R2_S3",bucketName:"system2-historical-research",
    head:async()=>null,get:async()=>null};
  async function verifyReceipt({db:roDb,objectStore,receipt}){
    assert.throws(()=>roDb.prepare("DELETE FROM s2_historical_segment_ingest_receipts"),/D1 mutation forbidden/);
    assert.throws(()=>roDb.batch([]),/D1 mutation forbidden/);
    assert.throws(()=>objectStore.putIfAbsent("fake",new Uint8Array()),/R2 write forbidden/);
    verified.push(receipt.month);
    return {state:"VERIFIED",receiptId:receipt.receipt_id,
      manifestRollingHash:receipt.manifest_rolling_hash,
      headObjectCountVerified:310,
      byteGetObjectCountVerified:receipt.month===monthsWithCorruptFullByte?309:310,
      barCount:22000};
  }
  return {db,store,verifyReceipt,queries,verified};
}
const g=fixture();
const out=await audit({db:g.db,objectStore:g.store,verifyReceipt:g.verifyReceipt});
assert.equal(out.result,"PASS_INDEPENDENT_JUL_SEP_R2_D1_READBACK");
assert.deepEqual(out.verifiedMonths,[7,8,9]);
assert.deepEqual(g.verified,[7,8,9]);
assert.equal(out.r2FullByteVerifiedObjects,930);
assert.equal(g.queries.length,6);
assert.ok(g.queries.every(sql=>/^\s*SELECT\b/i.test(sql)));
assert.equal(out.marketYearReplayPromoted,false);
assert.equal(out.historicSourceFirstKnownAtCertified,false);
assert.equal(out.d1RowsWritten,0);
for(const k of [
  {missing:8,regex:/missing COMPLETE monthly receipt/},
  {missingCheckpoint:9,regex:/incomplete checkpoint/},
  {hashMismatch:7,regex:/Expected values to be strictly equal/},
  {writeCount:1,regex:/D1 writes/},
  {receiptsWithWrongMarket:true,regex:/Expected values to be strictly equal/},
  {monthsWithCorruptFullByte:8,regex:/Expected values to be strictly equal/}
]){
  const f=fixture(k);
  await assert.rejects(()=>audit({db:f.db,objectStore:f.store,verifyReceipt:f.verifyReceipt}),k.regex);
}
await assert.rejects(()=>audit({db:fixture().db,objectStore:{backend:"UNTRUSTED"}}),/isolated R2/);

const wf=await readFile(new URL(
  "../../.github/workflows/system2-twse2026-jul-sep-independent-physical-manual.yml",import.meta.url),"utf8");
const runner=await readFile(new URL(
  "../scripts/audit_twse2026_jul_sep_independent_physical_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/workflow_dispatch:/);
assert.doesNotMatch(wf,/^\s*push:|^\s*schedule:|^\s*workflow_run:/m);
assert.match(wf,/group: system2-isolated-d1-writer/);
assert.match(wf,/read_budget_coordinated/);
assert.match(wf,/no_concurrent_writer/);
assert.doesNotMatch(wf,/wrangler.*deploy|provision_system2_d1|CREATE_SYSTEM2_ISOLATED_D1/);
assert.match(runner,/ORIGINAL_BACKFILL_NOT_COMPLETE/);
assert.match(runner,/REMEDIATION_READ_BUDGET_NOT_COORDINATED/);
assert.doesNotMatch(runner,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("System2 TWSE Jul-Sep independent physical readonly: positive + 7 fail-closed guards PASS");

import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {auditDestinationIdentityDigest,EXPECTED,PAGE_SQL,SELECT_COUNT}
  from "../migration/issue1068_dest_a1_identity_digest_readonly_20261015_v0_1.mjs";
const rows=[
  {bar_id:"a-001",bar_hash:"bh-one",source_row_hash:"sr-one",batch_id:"bb-1"},
  {bar_id:"a-002",bar_hash:"bh-two",source_row_hash:"sr-two",batch_id:"bb-1"},
  {bar_id:"b-001",bar_hash:"bh-three",source_row_hash:"sr-three",batch_id:"bb-2"}
];
function independentDigest(arr){
 const hash=createHash("sha256");
 for(const r of arr)for(const k of ["bar_id","bar_hash","source_row_hash","batch_id"]){
   const b=Buffer.from(r[k],"utf8");hash.update(Buffer.from(String(b.byteLength)+":"));hash.update(b);
 }
 return hash.digest("hex");
}
const goodDigest=independentDigest(rows);
function mock(pageRows=rows,{read=3,written=0}={}){
 return async(sql,params)=>{
  assert.equal(sql,PAGE_SQL);
  const after=pageRows.filter(r=>r.bar_id>params[0]);
  return {results:after.slice(0,2),meta:{rows_read:read,rows_written:written}};
 };
}
const run=(query,digest=goodDigest,count=3)=>auditDestinationIdentityDigest({
 query,expectedCount:count,expectedDigest:digest,pageSize:2,maxPages:4
});
test("positive independently computes exact 4-field producer-linked identity",async()=>{
 const result=await run(mock());
 assert.equal(result.observedRows,3);
 assert.equal(result.computedSha256,goodDigest);
 assert.equal(result.matchedOriginalProducerSourceLinkedDigest,true);
 assert.equal(result.cloudflareWrites,0);
 assert.equal(result.historicalFirstKnownAtPITCertified,false);
 assert.equal(result.rawPayloadByteSHAIndependentlyReplayed,false);
 assert.equal(result.formalAuditLaneAccepted,false);
});
const cases=[
 ["replaced bar hash",mock(rows.map((v,i)=>i===1?{...v,bar_hash:"forged"}:v))],
 ["forged row-source digest",mock(rows.map((v,i)=>i===1?{...v,source_row_hash:"changed"}:v))],
 ["forged batch linkage",mock(rows.map((v,i)=>i===1?{...v,batch_id:"different"}:v))],
 ["missing historical bar",mock(rows.slice(0,2))],
 ["extra forged historical bar",mock([...rows,{bar_id:"c-001",bar_hash:"h",source_row_hash:"s",batch_id:"b"}])],
 ["unqualified provider write",mock(rows,{written:1})],
 ["null provider read metering",mock(rows,{read:null})],
 ["inflated single-query read metering",mock(rows,{read:125001})],
 ["unknown extra non-source bar",mock(rows.map((v,i)=>i===2?{...v,bar_id:"zz"}:v))]
];
for(const [label,q] of cases)test(label,async()=>{await assert.rejects(run(q),/S2_ISSUE1068_DEST_IDENTITY/)}); 
test("duplicate / descending returned ids reject",async()=>{
 let calls=0;const q=async()=>({results:calls++===0?[rows[0],rows[0]]:[],meta:{rows_read:2,rows_written:0}});
 await assert.rejects(run(q),/DUPLICATE_OR_UNSORTED_BAR_ID/);
});
test("missing identity field fail closed",async()=>{
 const q=mock(rows.map((x,i)=>i===0?{...x,source_row_hash:null}:x));
 await assert.rejects(run(q),/ROW_SHAPE/);
});
test("bad page result objects fail closed",async()=>{
 const q=async()=>({results:"not a list",meta:{rows_read:0,rows_written:0}});
 await assert.rejects(run(q),/PROVIDER_NON_READONLY_RESPONSE/);
});
test("faked expected digest fails",async()=>{
 await assert.rejects(run(mock(),"f".repeat(64)),/SOURCE_LINKED_SHA256_MISMATCH/);
});
test("invalid caller parameters fail closed",async()=>{
 await assert.rejects(auditDestinationIdentityDigest({query:mock(),expectedCount:-1}),/ARGUMENTS/);
});
test("original Oct15 evidence anchor is fixed and cannot claim PIT",()=>{
 assert.equal(EXPECTED.importedBars,47420);
 assert.equal(EXPECTED.sourceOriginalBars,84688);
 assert.equal(EXPECTED.originalBatches,129);
 assert.equal(EXPECTED.frozenDecisions,0);
 assert.equal(EXPECTED.sourceLinkedProducerIdentitySha256,
   "d56b47494a8bc36b58e610ec12b58adde9ddfb5de5e95b616f716f41da1fb21d");
 assert.match(SELECT_COUNT,/s2_decisions/);
 const source=readFileSync("system2/migration/issue1068_dest_a1_identity_digest_readonly_20261015_v0_1.mjs","utf8");
 assert.match(source,/rows_written===0/);
 assert.match(source,/providerRowsWrittenTotal:0/);
 assert.match(source,/independentAuditLaneSignoff:false/);
 assert.doesNotMatch(source,/\bINSERT INTO\b|\bDELETE FROM\b|\bUPDATE s2_|\bDROP TABLE\b|\bALTER TABLE\b/i);
});

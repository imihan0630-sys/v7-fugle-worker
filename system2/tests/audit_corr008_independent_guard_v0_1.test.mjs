import assert from "node:assert/strict";
import {
  assertNcT01ReadOnlySqlV0_1,
  createNcT01RuntimeGuardV0_1,
} from "../runtime/nct01_runtime_guard_v0_1.mjs";

// AUDIT_LANE independent fixture, deliberately not imported from BUILD tests.
// No network calls, Cloudflare requests, secrets, live SQL changes, or production authority.
let transportCount=0;
let rawPrepareCount=0;
let underlyingBatchCount=0;
let networkCount=0;
const metrics={requestCount:0,rowsRead:0,rowsWritten:0,latestSizeAfter:null};
const makeStatement=(sql,params=[])=>({
  __remoteD1Statement:true, sql, params,
  bind(...args){return makeStatement(sql,args);},
  async all(){transportCount++;metrics.requestCount++;metrics.rowsRead++;return {results:[{ok:1}]};},
  async first(){transportCount++;metrics.requestCount++;metrics.rowsRead++;return {ok:1};},
  async run(){transportCount++;metrics.requestCount++;return {success:true,meta:{rows_read:0,rows_written:0}};},
});
const rawDb={
  database:{name:"system2-research",uuidDigestInput:"audit-corr008-isolated-test"},
  metrics,
  prepare(sql){rawPrepareCount++;return makeStatement(sql);},
  async batch(xs){underlyingBatchCount++;transportCount++;metrics.requestCount++;return xs.map(()=>({success:true,meta:{rows_written:0}}));},
  async rawQuery(){transportCount++;metrics.requestCount++;return [{ok:1}];},
};
const guard=createNcT01RuntimeGuardV0_1({
  executionCutId:"AUDIT-CORR008-20261009",
  fetchImpl:async()=>{networkCount++;return {status:200,headers:{get(){return null;}}};},
});
const db=await guard.wrapD1(rawDb);

const dangerous=[
  "PRAGMA user_version=1729",
  "PRAGMA writable_schema=ON",
  "PRAGMA application_id=8675309",
  "PRAGMA journal_mode=WAL",
  "PRAGMA cache_size=-1000",
  "PRAGMA foreign_keys=OFF",
  "PRAGMA temp_store=MEMORY",
  "PRAGMA main.user_version=111",
  "PRAGMA\nuser_version=111",
  "PRAGMA table_info(s2_decisions); UPDATE s2_decisions SET rank=1",
  "UPDATE s2_decisions SET rank=1",
];
for(const sql of dangerous){
  const before={transportCount,rawPrepareCount,underlyingBatchCount,networkCount};
  assert.throws(()=>assertNcT01ReadOnlySqlV0_1(sql),/NCT01_READ_ONLY_SQL_REQUIRED/,"lexical guard: "+sql);
  assert.throws(()=>db.prepare(sql),/NCT01_READ_ONLY_SQL_REQUIRED/,"wrapped prepare: "+sql);
  assert.deepEqual({transportCount,rawPrepareCount,underlyingBatchCount,networkCount},before,"pre-transport invariant: "+sql);
}

// AP-008-B: getter must never be called; original batch never invoked.
let getterCalls=0;
const exploit={
  __remoteD1Statement:true,
  get sql(){getterCalls++;return getterCalls<=2?"SELECT 1":"UPDATE s2_decisions SET rank=1";},
  params:[],
};
const beforeExploit=underlyingBatchCount;
await assert.rejects(()=>db.batch([exploit]),/NCT01_READ_ONLY_SQL_REQUIRED:MUTABLE_STATEMENT_ACCESS/);
assert.equal(getterCalls,0);
assert.equal(underlyingBatchCount,beforeExploit);

let paramsGetterCalls=0;
const paramsExploit={
  __remoteD1Statement:true,
  sql:"SELECT 1",
  get params(){paramsGetterCalls++;return [];},
};
await assert.rejects(()=>db.batch([paramsExploit]),/NCT01_READ_ONLY_SQL_REQUIRED:MUTABLE_STATEMENT_ACCESS/);
assert.equal(paramsGetterCalls,0);
assert.equal(underlyingBatchCount,beforeExploit);

// Positive control: allowed metadata query and ordinary SELECT still work,
// and the caller-owned statement may change only AFTER validated values were copied.
assert.equal(assertNcT01ReadOnlySqlV0_1("PRAGMA table_info(s2_decisions)"),"PRAGMA table_info(s2_decisions)");
await db.prepare("PRAGMA table_info(s2_decisions)").all();
const callerParams=[1];
const callerStatement={__remoteD1Statement:true,sql:"SELECT 1",params:callerParams};
const originalBatch=rawDb.batch;
let forwarded=null;
rawDb.batch=async(xs)=>{forwarded=xs;return originalBatch(xs);};
await db.batch([callerStatement]);
callerStatement.sql="UPDATE s2_decisions SET rank=1";
callerParams[0]=1234;
assert.equal(forwarded[0].sql,"SELECT 1");
assert.equal(forwarded[0].params[0],1);
assert.ok(Object.isFrozen(forwarded[0]));
assert.ok(Object.isFrozen(forwarded[0].params));

// Bypass attempts must be measured rather than claiming zero forbidden accesses.
const observed=await guard.buildRuntimeEvidenceV0_1();
assert.equal(observed.ledger.d1.rejectedMutationAttemptCount,dangerous.length+2);
assert.equal(observed.runtimeEvidence.runtimeForbiddenAccessCount,dangerous.length+2);
assert.equal(metrics.rowsWritten,0);
assert.match(observed.runtimeEvidence.runtimeEvidenceDigest,/^[a-f0-9]{64}$/);

console.log("AUDIT CORR-008 independently authored adversarial fixtures PASS");
console.log(JSON.stringify({writableSqlRejected:dangerous.length,accessorBasedRejections:2,underlyingBatchCount,rawPrepareCount,rowsWritten:metrics.rowsWritten,runtimeForbiddenAccessCount:observed.runtimeEvidence.runtimeForbiddenAccessCount}));

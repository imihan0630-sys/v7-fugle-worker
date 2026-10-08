import assert from "node:assert/strict";
import {
  NCT01_ALLOWED_NETWORK_ORIGINS_V0_1,
  assertNcT01ReadOnlySqlV0_1,
  createNcT01RuntimeGuardV0_1,
} from "../runtime/nct01_runtime_guard_v0_1.mjs";
import { buildNcT01HiddenFallbackAuditV0_1 } from "../runtime/nct01_hidden_fallback_audit_v0_1.mjs";

function response(status=200,{location=null}={}){
  const headers=new Headers();
  if(location) headers.set("location",location);
  return {
    status,
    ok:status>=200&&status<300,
    headers,
    async text(){return "{}";},
    async json(){return {};},
  };
}

function fakeDb(){
  const metrics={requestCount:0,rowsRead:0,rowsWritten:0,latestSizeAfter:null};
  function statement(sql,params=[]){
    return {
      __remoteD1Statement:true,
      sql,
      params:[...params],
      bind(...next){return statement(sql,next);},
      async first(){
        metrics.requestCount+=1;
        metrics.rowsRead+=1;
        return {ok:1};
      },
      async all(){
        metrics.requestCount+=1;
        metrics.rowsRead+=2;
        return {results:[{ok:1},{ok:2}]};
      },
      async run(){
        metrics.requestCount+=1;
        metrics.rowsRead+=1;
        return {success:true,meta:{rows_read:1,rows_written:0},results:[]};
      },
    };
  }
  return {
    database:{name:"system2-research",idPresent:true,uuidDigestInput:"fake-db-uuid-001"},
    metrics,
    prepare(sql){return statement(sql);},
    async batch(statements){
      metrics.requestCount+=1;
      metrics.rowsRead+=statements.length;
      return statements.map(()=>({success:true,meta:{rows_read:1,rows_written:0},results:[]}));
    },
    async rawQuery(){
      metrics.requestCount+=1;
      metrics.rowsRead+=1;
      return [{ok:1}];
    },
  };
}

assert.deepEqual(
  NCT01_ALLOWED_NETWORK_ORIGINS_V0_1,
  [
    "https://api.cloudflare.com",
    "https://openapi.twse.com.tw",
    "https://www.tpex.org.tw",
    "https://www.twse.com.tw",
  ],
);

for(const sql of [
  "SELECT 1",
  "WITH x AS (SELECT 1) SELECT * FROM x",
  "PRAGMA table_info(s2_historical_a1_bars)",
]){
  assert.equal(assertNcT01ReadOnlySqlV0_1(sql),sql);
}
for(const sql of [
  "INSERT INTO x VALUES (1)",
  "UPDATE x SET a=1",
  "DELETE FROM x",
  "REPLACE INTO x VALUES (1)",
  "CREATE TABLE x(a)",
  "DROP TABLE x",
  "ALTER TABLE x ADD COLUMN b",
  "VACUUM",
  "ATTACH DATABASE 'x' AS y",
  "DETACH DATABASE y",
  "WITH x AS (SELECT 1) DELETE FROM y",
  "SELECT 1; UPDATE x SET a=1",
]){
  assert.throws(()=>assertNcT01ReadOnlySqlV0_1(sql),/NCT01_READ_ONLY_SQL_REQUIRED/);
}

// Clean same-cut guard: canonical network + read-only D1.
let baseFetchCount=0;
const cleanGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-CLEAN",
  fetchImpl:async()=>{baseFetchCount+=1;return response(200);},
});
await cleanGuard.fetch("https://api.cloudflare.com/client/v4/accounts/a/d1/database");
await cleanGuard.fetch("https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json");
await cleanGuard.fetch("https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL");
await cleanGuard.fetch("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes");
assert.equal(baseFetchCount,4);

const cleanRawDb=fakeDb();
const cleanDb=await cleanGuard.wrapD1(cleanRawDb);
await cleanDb.prepare("SELECT 1").all();
await cleanDb.prepare("WITH x AS (SELECT 1) SELECT * FROM x").bind(1).first();
await cleanDb.batch([
  cleanDb.prepare("SELECT 2"),
  cleanDb.prepare("PRAGMA table_info(s2_historical_a1_bars)"),
]);
await cleanDb.rawQuery("SELECT 3");

const clean=await cleanGuard.buildRuntimeEvidenceV0_1();
assert.equal(clean.runtimeEvidence.instrumented,true);
assert.equal(clean.runtimeEvidence.sameExecutionCut,true);
assert.equal(clean.runtimeEvidence.runtimeForbiddenAccessCount,0);
assert.match(clean.runtimeEvidence.runtimeEvidenceDigest,/^[a-f0-9]{64}$/);
assert.equal(clean.ledger.d1.databaseName,"system2-research");
assert.match(clean.ledger.d1.databaseIdentityDigest,/^[a-f0-9]{64}$/);
assert.equal(clean.ledger.d1.rejectedMutationAttemptCount,0);
assert.equal(clean.ledger.d1.rowsWritten,0);
assert.equal(clean.ledger.network.allowedNetworkRequestCount,4);
assert.equal(clean.ledger.network.forbiddenOriginAttemptCount,0);
assert.equal(clean.ledger.capabilities.forbiddenCapabilityAttemptCount,0);
assert.equal(clean.ledger.runtimeForbiddenAccessCount,0);

// Mutation attempts fail before remote request count changes.
const mutGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-MUT",
  fetchImpl:async()=>response(200),
});
const mutRawDb=fakeDb();
const mutDb=await mutGuard.wrapD1(mutRawDb);
const beforePrepare=mutRawDb.metrics.requestCount;
assert.throws(()=>mutDb.prepare("UPDATE s2_decisions SET state='X'"),/NCT01_READ_ONLY_SQL_REQUIRED/);
assert.equal(mutRawDb.metrics.requestCount,beforePrepare);

const beforeRaw=mutRawDb.metrics.requestCount;
await assert.rejects(
  ()=>mutDb.rawQuery("DELETE FROM s2_decisions"),
  /NCT01_READ_ONLY_SQL_REQUIRED/,
);
assert.equal(mutRawDb.metrics.requestCount,beforeRaw);

const beforeBatch=mutRawDb.metrics.requestCount;
await assert.rejects(
  ()=>mutDb.batch([
    {__remoteD1Statement:true,sql:"SELECT 1",params:[]},
    {__remoteD1Statement:true,sql:"INSERT INTO s2_decisions VALUES (1)",params:[]},
  ]),
  /NCT01_READ_ONLY_SQL_REQUIRED/,
);
assert.equal(mutRawDb.metrics.requestCount,beforeBatch);
const mutEvidence=await mutGuard.buildRuntimeEvidenceV0_1();
assert.equal(mutEvidence.ledger.d1.rejectedMutationAttemptCount,3);
assert.equal(mutEvidence.runtimeEvidence.runtimeForbiddenAccessCount,3);

// Unexpected origin is rejected before underlying fetch.
let forbiddenBaseFetchCount=0;
const netGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-NET",
  fetchImpl:async()=>{forbiddenBaseFetchCount+=1;return response(200);},
});
await assert.rejects(
  ()=>netGuard.fetch("https://example.com/not-allowed"),
  /NCT01_FORBIDDEN_NETWORK_ORIGIN/,
);
assert.equal(forbiddenBaseFetchCount,0);
await netGuard.wrapD1(fakeDb());
const netEvidence=await netGuard.buildRuntimeEvidenceV0_1();
assert.equal(netEvidence.ledger.network.forbiddenOriginAttemptCount,1);
assert.equal(netEvidence.runtimeEvidence.runtimeForbiddenAccessCount,1);

// Redirect target is checked before the second transport.
let redirectBaseFetchCount=0;
const redirectGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-REDIRECT",
  fetchImpl:async()=>{
    redirectBaseFetchCount+=1;
    return response(302,{location:"https://evil.example/escape"});
  },
});
await assert.rejects(
  ()=>redirectGuard.fetch("https://www.twse.com.tw/rwd/zh/holidaySchedule/holidaySchedule"),
  /NCT01_FORBIDDEN_NETWORK_ORIGIN/,
);
assert.equal(redirectBaseFetchCount,1);
await redirectGuard.wrapD1(fakeDb());
const redirectEvidence=await redirectGuard.buildRuntimeEvidenceV0_1();
assert.equal(redirectEvidence.ledger.network.forbiddenOriginAttemptCount,1);

// Forbidden capability attempts are measured, not asserted.
const capGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-CAP",
  fetchImpl:async()=>response(200),
});
await capGuard.wrapD1(fakeDb());
assert.throws(
  ()=>capGuard.denyForbiddenCapabilityV0_1("SYSTEM1_TOP6_INPUT"),
  /NCT01_FORBIDDEN_CAPABILITY/,
);
const capEvidence=await capGuard.buildRuntimeEvidenceV0_1();
assert.equal(capEvidence.ledger.capabilities.forbiddenCapabilityAttemptCount,1);
assert.equal(capEvidence.runtimeEvidence.runtimeForbiddenAccessCount,1);

// Missing D1 guard binding must fail closed as uninstrumented/incomplete.
const incompleteGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-INCOMPLETE",
  fetchImpl:async()=>response(200),
});
const incomplete=await incompleteGuard.buildRuntimeEvidenceV0_1();
assert.equal(incomplete.runtimeEvidence.instrumented,false);
assert.equal(incomplete.runtimeEvidence.sameExecutionCut,false);

// Ledger identity changes when measured activity changes.
const digestGuard=createNcT01RuntimeGuardV0_1({
  executionCutId:"CUT-DIGEST",
  fetchImpl:async()=>response(200),
});
const digestDb=await digestGuard.wrapD1(fakeDb());
const before=await digestGuard.buildRuntimeEvidenceV0_1();
await digestDb.prepare("SELECT 1").all();
const after=await digestGuard.buildRuntimeEvidenceV0_1();
assert.notEqual(before.runtimeEvidence.runtimeEvidenceDigest,after.runtimeEvidence.runtimeEvidenceDigest);

// runtimeEvidenceDigest is transitively bound into the hidden-fallback audit digest.
async function audit(runtimeEvidence){
  return buildNcT01HiddenFallbackAuditV0_1({
    runnerEntryPoint:"system2/scripts/run_nct01_physical_artifact_readonly_v0_1.mjs",
    runnerHeadSha:"a".repeat(40),
    auditedBlobIdentities:[
      {path:"system2/runtime/nct01_runtime_guard_v0_1.mjs",blobSha:"b".repeat(40)},
    ],
    perDimensionDisposition:{
      cachedSystem1SelectionUsed:"PROVEN_ABSENT",
      persistedSystem1SelectionUsed:"PROVEN_ABSENT",
      aliasReconstructionUsed:"PROVEN_ABSENT",
      crossProjectFallbackUsed:"PROVEN_ABSENT",
      staleSharedStateUsed:"PROVEN_ABSENT",
    },
    runtimeEvidence,
    forbiddenSourceFamilyVersion:"S2-NCT01-FORBIDDEN-SOURCES-V0_1",
    auditGeneratedAt:"2026-10-09T00:00:00.000Z",
  });
}
const auditBefore=await audit(before.runtimeEvidence);
const auditAfter=await audit(after.runtimeEvidence);
assert.notEqual(auditBefore.auditDigest,auditAfter.auditDigest);
assert.equal(auditAfter.runtimeEvidence.runtimeForbiddenAccessCount,0);

console.log("NC-T01 runtime guard tests: PASS");

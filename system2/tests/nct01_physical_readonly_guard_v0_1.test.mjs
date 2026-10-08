import assert from "node:assert/strict";
import { runNcT01PhysicalArtifactReadonlyV0_1 } from "../scripts/run_nct01_physical_artifact_readonly_v0_1.mjs";

const marketDate="2026-10-08";
const decisionTimestamp="2026-10-08T06:30:00.000Z";
const now=()=>new Date("2026-10-08T07:00:00.000Z");
const h=(c)=>String(c).repeat(64);

function response(status=200){
  return {
    status,
    ok:status>=200&&status<300,
    headers:new Headers(),
    async text(){return "{}";},
    async json(){return {};},
  };
}

function makeRawDb(){
  const metrics={requestCount:0,rowsRead:0,rowsWritten:0,latestSizeAfter:null};
  function statement(sql,params=[]){
    return {
      __remoteD1Statement:true,
      sql,
      params:[...params],
      bind(...next){return statement(sql,next);},
      async first(){metrics.requestCount+=1;metrics.rowsRead+=1;return {ok:1};},
      async all(){metrics.requestCount+=1;metrics.rowsRead+=1;return {results:[{ok:1}]};},
      async run(){metrics.requestCount+=1;return {success:true,meta:{rows_read:0,rows_written:0},results:[]};},
    };
  }
  return {
    database:{name:"system2-research",idPresent:true,uuidDigestInput:"physical-test-db-id"},
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

function readyContext(){
  return {
    schemaVersion:"S2_DAILY_SHADOW_READONLY_CONTEXT_V0_1",
    marketDate,
    decisionTimestamp,
    decisionClockMode:"FIXED_CALLER_CLOCK",
    observedAt:"2026-10-08T06:29:00.000Z",
    a1:{
      state:"READY",
      version:"0.3-RESEARCH",
      observedAt:"2026-10-08T06:29:00.000Z",
      snapshotBatch:{
        state:"READY",
        pointInTimeEligible:true,
        marketDate,
        decisionTimestamp,
        batchHash:h("a"),
        ordinarySymbolCount:1,
        symbols:["1101"],
        bySymbol:{"1101":{symbol:"1101",market:"TWSE"}},
        blockerCodes:[],
      },
    },
    historyCoverage:{
      version:"0.4-RESEARCH",
      globalIntegrityState:"READY",
      currentUniverseCount:1,
      historyReadyCount:1,
      continuityReadyCount:0,
    },
    listingAgeCalendar:null,
    preflight:{
      state:"READY_FOR_AUTHORIZED_SHADOW_EVALUATION_WITH_SYMBOL_GAPS",
      globalInputsReady:true,
      assessorReady:true,
      selectionDenominatorComplete:false,
      zeroPickMayBeClaimed:false,
    },
  };
}

async function fakeAuditGenerator({runtimeEvidence}){
  return {
    audit:{
      auditState:
        runtimeEvidence.instrumented===true
        && runtimeEvidence.sameExecutionCut===true
        && runtimeEvidence.runtimeForbiddenAccessCount===0
          ?"CLEAN_PROVEN_ABSENT"
          :"EVIDENCE_INCOMPLETE",
      runtimeEvidence,
    },
  };
}

function historyPrefetch(){
  return {
    evidence:{prefetchHash:h("b")},
    loadPriorHistoricalBars:async()=>[],
  };
}

async function runClean({artifactRunnerOverride=null,contextBuilderOverride=null,fetchOverride=null}={}){
  const rawDb=makeRawDb();
  let baseFetchCount=0;
  const baseFetch=fetchOverride|| (async()=>{baseFetchCount+=1;return response(200);});
  const contextBuilder=contextBuilderOverride|| (async ({db,fetchImpl})=>{
    await fetchImpl("https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json");
    await db.prepare("SELECT 1").all();
    return readyContext();
  });
  const artifactRunner=artifactRunnerOverride|| (async (args)=>{
    const audit=await args.hiddenFallbackAuditEvidenceFactory({
      orchestration:{strategyId:"SHORT_MOMENTUM"},
    });
    assert.equal(audit.auditState,"CLEAN_PROVEN_ABSENT");
    return {
      receipt:{
        resultClassification:"EVIDENCE_INCOMPLETE",
        system1Top6InputAvailable:false,
        system1RankInputAvailable:false,
      },
      evidence:{system1RuntimeUsed:false},
    };
  });
  const result=await runNcT01PhysicalArtifactReadonlyV0_1({
    accountId:"account",
    apiToken:"token",
    marketDate,
    decisionTimestamp,
    now,
    fetchImpl:baseFetch,
    dbFactory:async()=>rawDb,
    contextBuilder,
    historyPrefetch:async()=>historyPrefetch(),
    artifactRunner,
    auditGenerator:fakeAuditGenerator,
  });
  return {result,rawDb,baseFetchCount};
}

const clean=await runClean();
assert.equal(clean.result.executionResult,"PASS");
assert.equal(clean.result.acceptanceState,"EVIDENCE_INCOMPLETE");
assert.equal(clean.result.runtimeGuard.runtimeEvidence.instrumented,true);
assert.equal(clean.result.runtimeGuard.runtimeEvidence.sameExecutionCut,true);
assert.equal(clean.result.runtimeGuard.runtimeEvidence.runtimeForbiddenAccessCount,0);
assert.match(clean.result.runtimeGuard.runtimeEvidence.runtimeEvidenceDigest,/^[a-f0-9]{64}$/);
assert.equal(clean.result.runtimeGuard.ledger.d1.allowedReadQueryCount,1);
assert.equal(clean.result.runtimeGuard.ledger.d1.rejectedMutationAttemptCount,0);
assert.equal(clean.result.runtimeGuard.ledger.network.allowedNetworkRequestCount,1);
assert.equal(clean.result.runtimeGuard.ledger.network.forbiddenOriginAttemptCount,0);
assert.equal(clean.result.d1Metrics.rowsWritten,0);
assert.equal(
  clean.result.hiddenFallbackAudit.audit.runtimeEvidence.runtimeEvidenceDigest,
  clean.result.runtimeGuard.runtimeEvidence.runtimeEvidenceDigest,
);

// Mutating SQL is blocked in the physical wrapper before raw DB transport.
{
  const rawDb=makeRawDb();
  await assert.rejects(
    ()=>runNcT01PhysicalArtifactReadonlyV0_1({
      accountId:"account",
      apiToken:"token",
      marketDate,
      decisionTimestamp,
      now,
      fetchImpl:async()=>response(200),
      dbFactory:async()=>rawDb,
      contextBuilder:async ({db})=>{
        await db.prepare("UPDATE s2_decisions SET state='X'").run();
        return readyContext();
      },
      historyPrefetch:async()=>historyPrefetch(),
      artifactRunner:async()=>{throw new Error("must not reach artifact runner");},
      auditGenerator:fakeAuditGenerator,
    }),
    /NCT01_READ_ONLY_SQL_REQUIRED/,
  );
  assert.equal(rawDb.metrics.requestCount,0);
  assert.equal(rawDb.metrics.rowsWritten,0);
}

// Unexpected origin is blocked before underlying fetch.
{
  const rawDb=makeRawDb();
  let baseFetchCount=0;
  await assert.rejects(
    ()=>runNcT01PhysicalArtifactReadonlyV0_1({
      accountId:"account",
      apiToken:"token",
      marketDate,
      decisionTimestamp,
      now,
      fetchImpl:async()=>{baseFetchCount+=1;return response(200);},
      dbFactory:async()=>rawDb,
      contextBuilder:async ({fetchImpl})=>{
        await fetchImpl("https://evil.example/system1-selected-list");
        return readyContext();
      },
      historyPrefetch:async()=>historyPrefetch(),
      artifactRunner:async()=>{throw new Error("must not reach artifact runner");},
      auditGenerator:fakeAuditGenerator,
    }),
    /NCT01_FORBIDDEN_NETWORK_ORIGIN/,
  );
  assert.equal(baseFetchCount,0);
}

// Incomplete runtime guard cannot be upgraded to physical independence.
{
  const rawDb=makeRawDb();
  const incompleteRuntimeGuardFactory=()=>({
    fetch:async()=>response(200),
    wrapD1:async(db)=>db,
    buildRuntimeEvidenceV0_1:async()=>({
      ledger:{guardComplete:false},
      runtimeEvidence:{
        instrumented:false,
        sameExecutionCut:false,
        runtimeForbiddenAccessCount:0,
        runtimeEvidenceDigest:h("c"),
        typedEvidence:[],
      },
    }),
  });
  await assert.rejects(
    ()=>runNcT01PhysicalArtifactReadonlyV0_1({
      accountId:"account",
      apiToken:"token",
      marketDate,
      decisionTimestamp,
      now,
      fetchImpl:async()=>response(200),
      runtimeGuardFactory:incompleteRuntimeGuardFactory,
      dbFactory:async()=>rawDb,
      contextBuilder:async()=>readyContext(),
      historyPrefetch:async()=>historyPrefetch(),
      artifactRunner:async (args)=>{
        await args.hiddenFallbackAuditEvidenceFactory({
          orchestration:{strategyId:"SHORT_MOMENTUM"},
        });
        return {
          receipt:{
            resultClassification:"PHYSICALLY_INDEPENDENT_PATH_OBSERVED",
            system1Top6InputAvailable:false,
            system1RankInputAvailable:false,
          },
          evidence:{system1RuntimeUsed:false},
        };
      },
      auditGenerator:fakeAuditGenerator,
    }),
    /cannot pass with incomplete runtime guard/,
  );
}

// Any guarded access after the audit cut invalidates same-cut identity.
{
  let guardedFetch=null;
  await assert.rejects(
    ()=>runClean({
      contextBuilderOverride:async ({db,fetchImpl})=>{
        guardedFetch=fetchImpl;
        await db.prepare("SELECT 1").all();
        return readyContext();
      },
      artifactRunnerOverride:async (args)=>{
        await args.hiddenFallbackAuditEvidenceFactory({
          orchestration:{strategyId:"SHORT_MOMENTUM"},
        });
        await guardedFetch("https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json");
        return {
          receipt:{
            resultClassification:"EVIDENCE_INCOMPLETE",
            system1Top6InputAvailable:false,
            system1RankInputAvailable:false,
          },
          evidence:{system1RuntimeUsed:false},
        };
      },
    }),
    /runtime guard ledger drifted after hidden-fallback audit cut/,
  );
}

console.log("NC-T01 physical readonly runtime guard tests: PASS");

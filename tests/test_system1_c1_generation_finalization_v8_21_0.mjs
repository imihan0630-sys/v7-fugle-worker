import assert from "node:assert/strict";
import fs from "node:fs";
import {DatabaseSync} from "node:sqlite";
import {
  C1_GENERATION_FINALIZATION_SCHEMA_VERSION,C1_PRODUCER_REGISTRY_VERSION,C1_PRODUCER_REGISTRY,
  c1ProducerRegistryIdentity,buildC1GenerationFinalizationReceipt,verifyC1GenerationFinalizationReceipt,
  persistC1GenerationFinalization,readC1GenerationFinalization,guardC1GenerationInsertAfterFinalization
} from "../research/system1_c1_generation_finalization_v8_21_0.mjs";

class Statement{
  constructor(owner,sql){this.owner=owner;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  run(){return this.owner.db.prepare(this.sql).run(...this.args);}
  first(){return this.owner.db.prepare(this.sql).get(...this.args)||null;}
  all(){return {results:this.owner.db.prepare(this.sql).all(...this.args)};}
}
class D1{
  constructor(){this.db=new DatabaseSync(":memory:");}
  prepare(sql){return new Statement(this,sql);}
  withSession(){return this;}
}
const d1=new D1();
d1.db.exec(`
CREATE TABLE trade_research_c1_generation_finalizations(
 finalization_receipt_id TEXT PRIMARY KEY,scan_date TEXT NOT NULL UNIQUE,generation_set_digest TEXT NOT NULL,
 receipt_json TEXT NOT NULL,receipt_digest TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE trade_research_c1_generation_finalization_violations(
 violation_id TEXT PRIMARY KEY,scan_date TEXT NOT NULL,generation_id TEXT NOT NULL,
 finalization_receipt_id TEXT NOT NULL,observed_at TEXT NOT NULL,violation_json TEXT NOT NULL);
`);

const day="2026-10-07";
const row=(id,at,origin="AFTER_MARKET_SCAN_PIPELINE")=>({
  generationId:id,sessionDate:day,decisionAt:at,runtimeVersion:"8.21.0-c1-generation-set-finalization",
  originKind:origin,pathKind:origin==="AFTER_MARKET_SCAN_PIPELINE"?"RUN_AFTER_MARKET_SCAN_CORE":"STAGE_SELECTION",
  contentDigest:"a".repeat(64),universeDigest:"b".repeat(64),populationN:1875,originStatus:"SCAN_ORIGIN_CAPTURED"
});
const inventory={
  scanDate:day,generationCount:2,returnedCount:2,truncated:false,integrityComplete:true,modernOriginCoverageComplete:true,
  generations:[row("g2",day+"T15:45:00.000Z","STAGE_SELECTION_ROUTE"),row("g1",day+"T15:35:00.000Z")]
};
const bindings=[{scanDate:day,bindingId:"bind-1",c1GenerationId:"g1"}];
const receipt=await buildC1GenerationFinalizationReceipt({
  scanDate:day,inventory,bindings,sessionIdentityHash:"c".repeat(64),
  finalizedAt:"2026-10-08T00:05:00.000Z",knowledgeCutoff:"2026-10-08T00:05:00.000Z"
});
assert.equal((await verifyC1GenerationFinalizationReceipt(receipt)).status,"FINALIZED_VERIFIED");
assert.deepEqual(receipt.generationIds,["g1","g2"]);
assert.equal(receipt.postFinalizationViolationCount,0);
assert.equal(receipt.historicalBackfillPerformed,false);

const first=await persistC1GenerationFinalization(d1,receipt);
assert.equal(first.deduplicated,false);
const replay=await persistC1GenerationFinalization(d1,receipt);
assert.equal(replay.deduplicated,true);
assert.equal((await readC1GenerationFinalization(d1,{scanDate:day})).status,"FINALIZED_VERIFIED");
const replayGuard=await guardC1GenerationInsertAfterFinalization(d1,{
  scanDate:day,generationId:"g1",observedAt:"2026-10-08T00:05:30.000Z"
});
assert.equal(replayGuard.allowed,true);
assert.equal(replayGuard.finalizedReplay,true);

await assert.rejects(()=>guardC1GenerationInsertAfterFinalization(d1,{
  scanDate:day,generationId:"late-g3",observedAt:"2026-10-08T00:06:00.000Z"
}),/POST_FINALIZATION_GENERATION_VIOLATION/);
const violated=await readC1GenerationFinalization(d1,{scanDate:day});
assert.equal(violated.status,"POST_FINALIZATION_GENERATION_VIOLATION");
assert.equal(violated.postFinalizationViolationCount,1);

const changed={...receipt,finalizationReceiptId:receipt.finalizationReceiptId+"x"};
await assert.rejects(()=>persistC1GenerationFinalization(d1,changed),/ID_INVALID|RECEIPT_DIGEST_MISMATCH|REJECT_MUTABLE_FINALIZATION_HISTORY/);

await assert.rejects(()=>buildC1GenerationFinalizationReceipt({
  scanDate:day,inventory,bindings:[{scanDate:day,bindingId:"bad",c1GenerationId:"outside"}],
  sessionIdentityHash:"c".repeat(64),finalizedAt:"2026-10-08T00:05:00.000Z"
}),/FINALIZATION_BINDING_SET_MISMATCH/);

const truncated={...inventory,truncated:true,returnedCount:1};
await assert.rejects(()=>buildC1GenerationFinalizationReceipt({
  scanDate:day,inventory:truncated,bindings,sessionIdentityHash:"c".repeat(64),
  finalizedAt:"2026-10-08T00:05:00.000Z"
}),/INVENTORY_TRUNCATED/);

const registry=await c1ProducerRegistryIdentity();
assert.equal(registry.producerRegistryVersion,C1_PRODUCER_REGISTRY_VERSION);
assert.deepEqual(registry.expectedProducerClasses,["AFTER_MARKET_SCAN_PIPELINE","STAGE_SELECTION_ROUTE"]);
assert.equal(C1_PRODUCER_REGISTRY.find(x=>x.producerClass==="DIRECT_SAFE_PERSISTENCE_CALLER").promotionEligible,false);

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");
const before=fs.existsSync("artifacts/Worker-before-v8_21_0.mjs")?fs.readFileSync("artifacts/Worker-before-v8_21_0.mjs","utf8"):"";
assert.match(source,/const VERSION = "8\.21\.0-c1-generation-set-finalization";/);
assert.match(source,/CREATE TABLE IF NOT EXISTS trade_research_c1_generation_finalizations/);
assert.match(source,/CREATE TABLE IF NOT EXISTS trade_research_c1_generation_finalization_violations/);
assert.match(source,/url\.pathname === "\/api\/research\/c1-generation-finalize"/);
assert.match(source,/url\.pathname === "\/api\/research\/c1-generation-finalization"/);
assert.match(source,/guardC1GenerationInsertAfterFinalization/);
assert.match(source,/WHERE NOT EXISTS \(\s*SELECT 1 FROM trade_research_c1_generation_finalizations WHERE scan_date=\?2\s*\)/,
  "generation insert must atomically reject a finalized scanDate");
assert.match(source,/WHERE EXISTS \(SELECT 1 FROM trade_research_c1_generations WHERE generation_id=\?1\)/,
  "chunk insert must not create orphan chunks when finalized generation header insert is rejected");
assert.match(source,/date!==shiftDateString\(today,-1\)/,"finalizer must remain previous-calendar-date prospective only");
assert.match(source,/C1_FINALIZATION_NOT_PROSPECTIVE_PREVIOUS_DATE/);
const finalizerBody=source.slice(source.indexOf("async function finalizeC1GenerationSetSafe"),source.indexOf("async function readC1PopulationReceipt"));
assert.doesNotMatch(finalizerBody,/\.threeMin|\.dailyReport|deliveryState|pushOutbox/i,
  "C1 set finalization must not depend on external delivery/push state");
assert.doesNotMatch(source,/C1_FINALIZATION.*14\*86400000/,"finalization must not inherit 14-day operational recovery");
assert.doesNotMatch(source,/UPDATE trade_research_c1_generation_finalizations/);
assert.doesNotMatch(source,/DELETE FROM trade_research_c1_generation_finalizations/);

if(before){
  const body=(s,name)=>{const start=s.indexOf("function "+name+"(");assert.ok(start>=0,"missing "+name);const end=s.indexOf("\n}",start);assert.ok(end>start);return s.slice(start,end+2);};
  for(const name of ["scoreCandidate","strategySetupState","applyMarketConsensus","selectTomorrowCandidates","saveStockConfig","processSignalState"])
    assert.equal(body(source,name),body(before,name),name+" changed by V8.21");
}

assert.equal(C1_GENERATION_FINALIZATION_SCHEMA_VERSION,"SYSTEM1_C1_GENERATION_FINALIZATION_V0_1");
console.log(JSON.stringify({
  ok:true,t48RuntimeCandidate:true,appendOnly:true,postFinalizationViolationDetected:true,
  historicalBackfill:false,providerCallDelta:0,formalCoreImpact:false,system2Touched:false
}));

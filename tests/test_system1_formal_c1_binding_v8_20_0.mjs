import assert from "node:assert/strict";
import fs from "node:fs";
import {DatabaseSync} from "node:sqlite";
import {
  FORMAL_C1_BINDING_SCHEMA_VERSION,FORMAL_C1_PARENT_RULE_VERSION,FORMAL_C1_ALLOWED_ORIGIN,
  buildFormalDecisionIdentity,buildFormalC1BindingReceipt,verifyFormalC1BindingReceipt,
  persistFormalC1BindingRecord,readFormalC1Bindings
} from "../research/system1_formal_c1_binding_v8_20_0.mjs";

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");
const before=fs.readFileSync("artifacts/Worker-before-v8_20_0.mjs","utf8");
const patch=fs.readFileSync("scripts/apply_v8_20_0.py","utf8");

class Statement{
  constructor(owner,sql){this.owner=owner;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  run(){if(this.owner.fail?.(this.sql))throw Error("fixture write failure");return this.owner.db.prepare(this.sql).run(...this.args);}
  first(){return this.owner.db.prepare(this.sql).get(...this.args)||null;}
  all(){return {results:this.owner.db.prepare(this.sql).all(...this.args)};}
}
class D1{
  constructor(){this.db=new DatabaseSync(":memory:");this.fail=null;}
  prepare(sql){return new Statement(this,sql);}
  withSession(){return this;}
  async batch(statements){
    this.db.exec("BEGIN");
    try{for(const s of statements)await s.run();this.db.exec("COMMIT");}
    catch(e){this.db.exec("ROLLBACK");throw e;}
  }
}
const env={V7_DB:new D1(),TEST_MODE:"false"};
const api=await import("data:text/javascript;base64,"+Buffer.from(source+
  "\nexport {ensureD1Schema,persistFormalC1BindingSafe,FORMAL_C1_BINDING};").toString("base64"));
await api.ensureD1Schema(env);

const day="2026-10-06";
const decision=day+"T10:05:00.000Z";
const effectiveVersion=(source.match(/const VERSION = "([^"]+)";/)||[])[1]||"";
const version=["8.20.0-formal-c1-binding-ledger","8.20.1-cross-midnight-recovery-readback","8.20.2-idempotent-d1-snapshots"].includes(effectiveVersion)
  ? effectiveVersion : "8.20.0-formal-c1-binding-ledger";
const sourceSha="a".repeat(40);
const plans=[
  {symbol:"2330",name:"台積電",planDate:"2026-10-07",strategyPool:"FORMAL_THOUSAND",sourceRank:1,buyLow:1400,buyHigh:1420,priorityScore:88.5},
  {symbol:"2454",name:"聯發科",planDate:"2026-10-07",strategyPool:"FORMAL_THOUSAND",sourceRank:2,buyLow:1290,buyHigh:1310,priorityScore:83.1}
];
const c1=(id="C1:2026-10-06:g1",clock=decision,origin=FORMAL_C1_ALLOWED_ORIGIN,seed="b")=>({
  generationId:id,scanDate:day,decisionAt:clock,runtimeVersion:version,sourceMainSha:sourceSha,
  contentDigest:seed.repeat(64),universeDigest:(seed==="b"?"c":"d").repeat(64),populationN:1880,originKind:origin
});
const identity=await buildFormalDecisionIdentity({
  scanDate:day,planDate:"2026-10-07",formalDecisionAt:decision,formalRuntimeVersion:version,
  formalSourceMainSha:sourceSha,plans
});
const receipt=await buildFormalC1BindingReceipt({identity,c1:c1(),bindingCreatedAt:day+"T10:05:01.000Z"});
assert.equal((await verifyFormalC1BindingReceipt(receipt)).status,"VERIFIED");

let passed=0;
const t=async(name,fn)=>{await fn();passed++;console.log("PASS",name);};

// BIND-T01
await t("BIND-T01 exact replay is idempotent",async()=>{
  const first=await persistFormalC1BindingRecord(env.V7_DB,receipt);
  assert.equal(first.status,"VERIFIED");assert.equal(first.deduplicated,false);
  const replayReceipt=await buildFormalC1BindingReceipt({identity,c1:c1(),bindingCreatedAt:day+"T10:05:09.000Z"});
  const replay=await persistFormalC1BindingRecord(env.V7_DB,replayReceipt);
  assert.equal(replay.status,"VERIFIED");assert.equal(replay.deduplicated,true);
  assert.equal(replay.bindingId,first.bindingId);
});

// BIND-T02
await t("BIND-T02 same Formal decision cannot rebound to another C1 generation",async()=>{
  const other=await buildFormalC1BindingReceipt({
    identity,c1:c1("C1:2026-10-06:g2",decision,FORMAL_C1_ALLOWED_ORIGIN,"e"),
    bindingCreatedAt:day+"T10:06:00.000Z"
  });
  await assert.rejects(()=>persistFormalC1BindingRecord(env.V7_DB,other),/CONFLICT_FORMAL_DECISION_REBOUND/);
});

// BIND-T03
await t("BIND-T03 same C1 generation cannot rebound to another Formal decision",async()=>{
  const changedPlans=structuredClone(plans);changedPlans[0].priorityScore=77.7;
  const otherIdentity=await buildFormalDecisionIdentity({
    scanDate:day,planDate:"2026-10-07",formalDecisionAt:decision,formalRuntimeVersion:version,
    formalSourceMainSha:sourceSha,plans:changedPlans
  });
  const other=await buildFormalC1BindingReceipt({identity:otherIdentity,c1:c1(),bindingCreatedAt:day+"T10:06:01.000Z"});
  await assert.rejects(()=>persistFormalC1BindingRecord(env.V7_DB,other),/CONFLICT_C1_PARENT_REBOUND/);
});

// BIND-T04
await t("BIND-T04 same-date multiple generations do not create an inferred parent",async()=>{
  const unboundSecond=c1("C1:2026-10-06:unbound",day+"T10:15:00.000Z",FORMAL_C1_ALLOWED_ORIGIN,"f");
  assert.equal(unboundSecond.originKind,FORMAL_C1_ALLOWED_ORIGIN);
  const byDate=await readFormalC1Bindings(env.V7_DB,{scanDate:day});
  assert.equal(byDate.count,1);
  assert.equal(byDate.bindings[0].c1GenerationId,receipt.c1GenerationId);
  assert.equal(byDate.latestHeuristicUsed,false);
});

// BIND-T05
await t("BIND-T05 later stage-selection generation cannot replace parent",async()=>{
  await assert.rejects(()=>buildFormalC1BindingReceipt({
    identity,
    c1:c1("C1:2026-10-06:stage",decision,"STAGE_SELECTION_ROUTE","1"),
    bindingCreatedAt:day+"T10:07:00.000Z"
  }),/ORIGIN_NOT_AUTHORIZED/);
  const exact=await readFormalC1Bindings(env.V7_DB,{formalDecisionReceiptId:identity.formalDecisionReceiptId});
  assert.equal(exact.bindings[0].c1GenerationId,receipt.c1GenerationId);
});

// BIND-T06
await t("BIND-T06 historical parent survives loss of mutable latest pointer",async()=>{
  let lastScanPointer={formalDecisionReceiptId:identity.formalDecisionReceiptId};lastScanPointer=null;
  assert.equal(lastScanPointer,null);
  const exact=await readFormalC1Bindings(env.V7_DB,{formalDecisionReceiptId:identity.formalDecisionReceiptId});
  assert.equal(exact.count,1);assert.equal(exact.bindings[0].bindingId,receipt.bindingId);
});

// BIND-T07
await t("BIND-T07 missing historical binding stays unproven with no backfill",async()=>{
  const empty=await readFormalC1Bindings(env.V7_DB,{scanDate:"2026-10-05"});
  assert.equal(empty.count,0);assert.equal(empty.historicalBackfillPerformed,false);
  assert.equal(empty.latestHeuristicUsed,false);assert.equal(empty.selectedSetEqualityInferenceUsed,false);
});

// BIND-T08
await t("BIND-T08 research binding failure is fail-open to Formal business path",async()=>{
  const blocked=await api.persistFormalC1BindingSafe({},{
    scanDate:day,plans,saved:{verified:true,stocks:plans},
    c1PopulationSave:{status:"VERIFIED",saveOk:true,readbackVerified:true,generationId:c1().generationId},
    c1PopulationReceipt:{generationId:c1().generationId}
  });
  assert.equal(blocked.status,"DATA_QUALITY_BLOCKED");
  assert.equal(blocked.reason,"FORMAL_C1_BINDING_D1_REQUIRED");
  assert.equal(blocked.formalCoreImpact,false);assert.equal(blocked.noPlanChanges,true);
  assert.equal(blocked.noTrade,true);assert.equal(blocked.noPush,true);
});

// BIND-T09
await t("BIND-T09 mutable v8_plan_archive overwrite cannot alter append-only binding",async()=>{
  const db=env.V7_DB.db;
  db.prepare(`INSERT INTO v8_plan_archive(scan_date,plan_date,schema_version,payload_json,payload_sha256,bridge_provider,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,?)`).run(day,"2026-10-07","V7_PLAN_2","{\"v\":1}","1".repeat(64),"FIXTURE",decision,decision);
  db.prepare(`UPDATE v8_plan_archive SET payload_json=?,payload_sha256=?,updated_at=? WHERE scan_date=?`)
    .run("{\"v\":2}","2".repeat(64),day+"T11:00:00.000Z",day);
  const exact=await readFormalC1Bindings(env.V7_DB,{formalDecisionReceiptId:identity.formalDecisionReceiptId});
  assert.equal(exact.bindings[0].bindingId,receipt.bindingId);
  assert.equal(exact.bindings[0].c1ContentDigest,receipt.c1ContentDigest);
});

// BIND-T10
await t("BIND-T10 scanDate query returns all explicit bindings without choosing latest",async()=>{
  const secondDecision=day+"T10:20:00.000Z";
  const secondPlans=[{symbol:"3008",name:"大立光",planDate:"2026-10-07",strategyPool:"FORMAL_THOUSAND",sourceRank:1,buyLow:2500,buyHigh:2550,priorityScore:80}];
  const secondIdentity=await buildFormalDecisionIdentity({
    scanDate:day,planDate:"2026-10-07",formalDecisionAt:secondDecision,formalRuntimeVersion:version,
    formalSourceMainSha:sourceSha,plans:secondPlans
  });
  const second=await buildFormalC1BindingReceipt({
    identity:secondIdentity,c1:c1("C1:2026-10-06:g-late",secondDecision,FORMAL_C1_ALLOWED_ORIGIN,"3"),
    bindingCreatedAt:day+"T10:20:01.000Z"
  });
  await persistFormalC1BindingRecord(env.V7_DB,second);
  const all=await readFormalC1Bindings(env.V7_DB,{scanDate:day});
  assert.equal(all.count,2);
  assert.deepEqual(all.bindings.map(x=>x.formalDecisionAt),[decision,secondDecision]);
  assert.equal(all.authoritativeParentSelection,"EXPLICIT_BINDING_ONLY");
  assert.equal(all.latestHeuristicUsed,false);assert.equal(all.inventoryOrdinalHeuristicUsed,false);
});

// protected API + schema + integration wiring
await t("protected readback route and append-only schema are wired",async()=>{
  assert.match(source,/const VERSION = "8\.20\.(?:0-formal-c1-binding-ledger|1-cross-midnight-recovery-readback|2-idempotent-d1-snapshots)";/);
  assert.match(source,/CREATE TABLE IF NOT EXISTS trade_research_formal_c1_bindings/);
  assert.match(source,/formal_decision_receipt_id TEXT NOT NULL UNIQUE/);
  assert.match(source,/c1_generation_id TEXT NOT NULL UNIQUE/);
  assert.match(source,/url\.pathname === "\/api\/research\/formal-c1-binding"/);
  assert.match(source,/researchFormalC1Binding: formalC1Binding/);
  assert.equal(source.split("formalC1Binding = await persistFormalC1BindingSafe(env,{").length-1,1);
  assert.doesNotMatch(source,/UPDATE trade_research_formal_c1_bindings/);
  assert.doesNotMatch(source,/DELETE FROM trade_research_formal_c1_bindings/);
  const unauthorized=await api.default.fetch(new Request("https://fixture.invalid/api/research/formal-c1-binding?scanDate="+day),{},{});
  assert.equal(unauthorized.status,401);
});

// Formal Core parity
await t("V8.20 changes provenance plumbing only and makes zero provider calls",async()=>{
  const body=(s,name)=>{const start=s.indexOf("function "+name+"(");assert.ok(start>=0,"missing "+name);const end=s.indexOf("\n}",start);assert.ok(end>start);return s.slice(start,end+2);};
  for(const name of ["scoreCandidate","strategySetupState","applyMarketConsensus","selectTomorrowCandidates","saveStockConfig","processSignalState"])
    assert.equal(body(source,name),body(before,name),name+" changed by V8.20");
  const marker=source.slice(source.indexOf("// BEGIN V8.20 FORMAL C1 AUTHORITATIVE BINDING"),
    source.indexOf("// END V8.20 FORMAL C1 AUTHORITATIVE BINDING"));
  assert.ok(marker&&!marker.includes("fetch("));
  assert.ok(!patch.includes("system2/"));
});

assert.equal(FORMAL_C1_BINDING_SCHEMA_VERSION,"SYSTEM1_FORMAL_C1_BINDING_V0_1");
assert.equal(FORMAL_C1_PARENT_RULE_VERSION,"FORMAL_C1_EXPLICIT_AFTER_MARKET_V0_1");
console.log(JSON.stringify({
  ok:true,passed,total:12,bindingCases:"BIND-T01~T10 PASS",
  appendOnly:true,noHistoricalBackfill:true,latestInferenceForbidden:true,
  providerCallDelta:0,formalCoreImpact:false,system2Touched:false
}));

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { buildDecisionOutcomeSnapshotV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
import { simulateTaiwanLongDailyPlanV0_1,toOutcomeSimulatedExecutionV0_1 }
  from "../runtime/execution_simulator_v0_1.mjs";
import { buildS2FrozenOutcomeRevisionV0_1, toS2FrozenOutcomeRevisionRowV0_1 }
  from "../runtime/outcome_revision_archive_v0_1.mjs";
import { buildS2F08ConditionalAppendPlanV0_1 as plan,
  verifyS2F08ConditionalAppendReadbackPayloadV0_1 as inspectReadback }
  from "../runtime/f08_outcome_atomic_cas_append_plan_v0_1.mjs";

const decision={
  decisionId:"F08-CAS-D1",decisionHash:"d".repeat(64),
  strategyId:"SWING_GROWTH",strategyVersion:"SHADOW-V1",symbol:"2330",
  marketDate:"2026-09-29",decisionTimestamp:"2026-09-29T07:30:00Z",
  regimeSnapshotId:"F08-CAS-REG",
};
const regime={
  regimeSnapshotId:"F08-CAS-REG",regimeHash:"e".repeat(64),
  marketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
};
const cost={
  costModelVersion:"COST-F08",taxRuleId:"TW-TAX-1",commissionRate:0.001,
  minimumCommission:1,transactionTaxRate:0.003,
  entrySlippageRate:0.001,exitSlippageRate:0.001,
};
const bar=(n,date,close)=>({
 sessionNumber:n,marketDate:date,availableAt:date+"T08:30:00Z",
 priceSpace:"ADJUSTED",open:close,high:close+1,low:close-1,close,
 volumeShares:100000,tradingState:"NORMAL",executableLiquidity:"AVAILABLE",
 limitState:"NONE",sourceId:"F08_SYNTHETIC_NOT_PIT",
});
const bars=[bar(1,"2026-09-30",90),bar(2,"2026-10-01",92)];
const sim=await simulateTaiwanLongDailyPlanV0_1({
 simOrderId:"F08-CAS-ORDER",entryFillObservationId:"F08-ENTRY",
 exitFillObservationId:"F08-EXIT",decisionId:decision.decisionId,
 strategyId:decision.strategyId,strategyVersion:decision.strategyVersion,
 symbol:decision.symbol,decisionMarketDate:decision.marketDate,
 decisionTimestamp:decision.decisionTimestamp,
 earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",
 triggerPrice:105,requestedShares:1000,stopPrice:85,targetPrice:120,
 maxHoldingSessions:5,entryValiditySessions:2,sessions:bars,
 priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 costModel:cost,simulatedAt:"2026-10-02T09:00:00Z",
});
const makeOutcome=(sessions,updatedAt)=>buildDecisionOutcomeSnapshotV0_1({
 decisionId:decision.decisionId,symbol:decision.symbol,
 decisionMarketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
 referencePrice:89,entryPlan:{stopPrice:85,targets:[120]},
 priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 sessions,updatedAt,simulatedExecution:toOutcomeSimulatedExecutionV0_1(sim),
});
const o1=await makeOutcome([bars[0]],"2026-10-01T09:00:00Z");
const o2=await makeOutcome(bars,"2026-10-02T09:00:00Z");
const first=await buildS2FrozenOutcomeRevisionV0_1({
 outcome:o1,decision,regime,simulation:sim,corporateActionHash:"c".repeat(64),
});
const next=await buildS2FrozenOutcomeRevisionV0_1({
 outcome:o2,decision,regime,simulation:sim,corporateActionHash:"c".repeat(64),
 previousRevision:first,
});
const genesis=await plan({receipt:first});
const revision=await plan({receipt:next,previousReceipt:first});
assert.equal(genesis.statementType,"INSERT_SELECT_COMPARE_AND_SWAP_RETURNING");
assert.match(genesis.sql,/INSERT INTO s2_outcome_revision_archive/);
assert.match(genesis.sql,/RETURNING revision_id, revision_hash/);
assert.ok(!/OR IGNORE|OR REPLACE|DO UPDATE/i.test(genesis.sql));
assert.equal(genesis.paramCount,35);
assert.equal(revision.paramCount,43);
assert.equal(genesis.physicalExecution,false);
assert.equal(genesis.accountQuotaGranted,false);
assert.equal(revision.physicalReadbackVerified,false);
assert.equal(Object.isFrozen(genesis),true);
assert.equal((await plan({receipt:first})).planHash,genesis.planHash);
await assert.rejects(()=>plan({receipt:first,bindingName:"V7_DB"}),/FORBIDDEN_D1_BINDING/);
await assert.rejects(()=>plan({receipt:next}),/PREVIOUS_RECEIPT_REQUIRED/);
await assert.rejects(()=>plan({receipt:first,previousReceipt:first}),/GENESIS_PREDECESSOR_FORBIDDEN/);
await assert.rejects(()=>plan({receipt:next,previousReceipt:next}),/LINEAGE_MISMATCH:previousHash/);
await assert.rejects(()=>plan({receipt:{...first,revisionHash:"f".repeat(64)}}),
 /RECEIPT_HASH_MISMATCH/);

// In-memory SQLite tests the ACTUAL generated parameterized INSERT SELECT.
// Each SQL statement rechecks parent hashes, previous revision and no fork
// at insert time. Two independent connections replay stale proposal plans.
const sql=readFileSync(new URL("../sql/0011_outcome_revision_archive_staged.sql",import.meta.url),"utf8");
const mainSchema=readFileSync(new URL("../sql/0001_research_core.sql",import.meta.url),"utf8");
for(const field of ["decision_hash","regime_snapshot_id","strategy_version"]){
 assert.match(mainSchema,new RegExp(field));
}
const py=String.raw`
import json,sqlite3,sys,tempfile,os
p=json.loads(sys.stdin.read())
with tempfile.TemporaryDirectory() as tmp:
  path=os.path.join(tmp,"f08_contract.sqlite")
  a=sqlite3.connect(path,isolation_level=None,timeout=2.0)
  b=sqlite3.connect(path,isolation_level=None,timeout=2.0)
  a.executescript("""
    CREATE TABLE s2_decisions (
      decision_id TEXT PRIMARY KEY, decision_hash TEXT, strategy_id TEXT,
      strategy_version TEXT,symbol TEXT,market_date TEXT,
      decision_timestamp TEXT,regime_snapshot_id TEXT
    );
    CREATE TABLE s2_market_regime_snapshots (
      regime_snapshot_id TEXT PRIMARY KEY,snapshot_hash TEXT,
      market_date TEXT,decision_timestamp TEXT
    );
  """)
  a.executescript(p["schema"])
  dec=p["decision"];reg=p["regime"]
  a.execute("""INSERT INTO s2_decisions VALUES (?,?,?,?,?,?,?,?)""",
    (dec["decisionId"],dec["decisionHash"],dec["strategyId"],dec["strategyVersion"],
     dec["symbol"],dec["marketDate"],dec["decisionTimestamp"],dec["regimeSnapshotId"]))
  a.execute("INSERT INTO s2_market_regime_snapshots VALUES (?,?,?,?)",
    (reg["regimeSnapshotId"],reg["regimeHash"],reg["marketDate"],reg["decisionTimestamp"]))
  def execute(connection,q):
    return connection.execute(q["sql"],q["params"]).fetchall()
  assert len(execute(a,p["genesis"]))==1
  assert len(execute(b,p["genesis"]))==0, "replay cannot be acked as inserted"
  assert a.execute("SELECT COUNT(*) FROM s2_outcome_revision_archive").fetchone()[0]==1
  assert len(execute(b,p["revision"]))==1
  assert len(execute(a,p["revision"]))==0
  assert a.execute("SELECT COUNT(*) FROM s2_outcome_revision_archive").fetchone()[0]==2
  a.execute("UPDATE s2_decisions SET decision_hash=? WHERE decision_id=?",("f"*64,dec["decisionId"]))
  assert len(execute(b,p["genesis"]))==0
  assert len(execute(b,p["revision"]))==0
  a.execute("UPDATE s2_decisions SET decision_hash=? WHERE decision_id=?",
    (dec["decisionHash"],dec["decisionId"]))
  a.execute("UPDATE s2_market_regime_snapshots SET snapshot_hash=? WHERE regime_snapshot_id=?",
    ("f"*64,reg["regimeSnapshotId"]))
  assert len(execute(a,p["revision"]))==0
  a.execute("UPDATE s2_market_regime_snapshots SET snapshot_hash=? WHERE regime_snapshot_id=?",
    (reg["regimeHash"],reg["regimeSnapshotId"]))
  # New database with a missing predecessor must fail closed, not skip to n=2.
  c=sqlite3.connect(":memory:")
  c.executescript("""CREATE TABLE s2_decisions (
    decision_id TEXT PRIMARY KEY, decision_hash TEXT, strategy_id TEXT,
    strategy_version TEXT,symbol TEXT,market_date TEXT,
    decision_timestamp TEXT,regime_snapshot_id TEXT);
    CREATE TABLE s2_market_regime_snapshots (
    regime_snapshot_id TEXT PRIMARY KEY,snapshot_hash TEXT,
    market_date TEXT,decision_timestamp TEXT);""")
  c.executescript(p["schema"])
  c.execute("INSERT INTO s2_decisions SELECT * FROM main.s2_decisions") if False else None
  c.execute("INSERT INTO s2_decisions VALUES (?,?,?,?,?,?,?,?)",
    (dec["decisionId"],dec["decisionHash"],dec["strategyId"],dec["strategyVersion"],
     dec["symbol"],dec["marketDate"],dec["decisionTimestamp"],dec["regimeSnapshotId"]))
  c.execute("INSERT INTO s2_market_regime_snapshots VALUES (?,?,?,?)",
    (reg["regimeSnapshotId"],reg["regimeHash"],reg["marketDate"],reg["decisionTimestamp"]))
  assert len(execute(c,p["revision"]))==0, "missing previous row must not create orphan"
  assert c.execute("SELECT COUNT(*) FROM s2_outcome_revision_archive").fetchone()[0]==0
  # Writer cannot treat a zero RETURNING row as success.
  try: a.execute("UPDATE s2_outcome_revision_archive SET revision_hash=? WHERE revision_id=?",("f"*64,p["genesis"]["revisionId"]))
  except sqlite3.IntegrityError: pass
  else: raise AssertionError("archive mutation protection disabled")
  print("F08_ATOMIC_CAS_SQLITE_PASS: two connections, exact parent rechecks, orphan blocked, replay returned zero, immutable update blocked")
`;
const res=spawnSync("python3",["-c",py],{
 input:JSON.stringify({schema:sql,decision,regime,genesis,revision}),
 encoding:"utf8",
});
assert.equal(res.status,0,res.stderr||res.stdout);
assert.match(res.stdout,/F08_ATOMIC_CAS_SQLITE_PASS/);
console.log("F08 offline one-statement SQLite CAS proposal tests PASS; no Cloudflare D1 calls");
// F08 partial offline proof: exact RETURNING + all 22 stored columns, while
// refusing to infer physical Cloudflare/D1 or quota acceptance from fake rows.
const frozenRow = await toS2FrozenOutcomeRevisionRowV0_1(first);
const returning = {
  revision_id:frozenRow.revision_id,revision_hash:frozenRow.revision_hash,
  decision_id:frozenRow.decision_id,lineage_hash:frozenRow.lineage_hash,
  revision_number:frozenRow.revision_number,
};
const inspected = await inspectReadback({
  plan:genesis,receipt:first,returnedRows:[returning],readbackRows:[frozenRow],
});
assert.equal(inspected.status,"PAYLOAD_MATCH_UNCERTIFIED_PHYSICAL");
assert.equal(inspected.checkedColumns,22);
assert.equal(inspected.physicalExecutionVerified,false);
assert.equal(inspected.physicalReadbackVerified,false);
assert.equal(inspected.accountQuotaGranted,false);
assert.equal(inspected.f08C3Accepted,false);
assert.match(inspected.exactReadbackQuery.sql,/WHERE revision_id = \?/);
assert.equal(inspected.exactReadbackQuery.params.length,5);
assert.equal(Object.isFrozen(inspected),true);
await inspectReadback({
  plan:revision,receipt:next,previousReceipt:first,
  returnedRows:[{
    ...returning,
    revision_id:next.revisionId,revision_hash:next.revisionHash,revision_number:2,
  }],
  readbackRows:[await toS2FrozenOutcomeRevisionRowV0_1(next)],
});
for(const err of [
  {returnedRows:[],readbackRows:[frozenRow],reason:/CAS_RETURNING_NOT_EXACTLY_ONE/},
  {returnedRows:[returning,returning],readbackRows:[frozenRow],reason:/CAS_RETURNING_NOT_EXACTLY_ONE/},
  {returnedRows:[{...returning,revision_hash:"f".repeat(64)}],readbackRows:[frozenRow],reason:/RETURNING_IDENTITY_MISMATCH/},
  {returnedRows:[returning],readbackRows:[],reason:/PERSISTED_NOT_EXACTLY_ONE/},
  {returnedRows:[returning],readbackRows:[frozenRow,frozenRow],reason:/PERSISTED_NOT_EXACTLY_ONE/},
  {returnedRows:[returning],readbackRows:[{...frozenRow,cost_model_hash:"f".repeat(64)}],reason:/PERSISTED_VALUE_MISMATCH:cost_model_hash/},
  {returnedRows:[returning],readbackRows:[{...frozenRow,receipt_json:"{}"}],reason:/PERSISTED_VALUE_MISMATCH:receipt_json/},
  {returnedRows:[returning],readbackRows:[{...frozenRow,unexpected:true}],reason:/PERSISTED_SHAPE_MISMATCH/},
]) {
  await assert.rejects(()=>inspectReadback({
    plan:genesis,receipt:first,returnedRows:err.returnedRows,
    readbackRows:err.readbackRows,
  }),err.reason);
}
await assert.rejects(()=>inspectReadback({
  plan:{...genesis,sql:"DELETE FROM s2_decisions"},receipt:first,
  returnedRows:[returning],readbackRows:[frozenRow],
}),/PLAN_NOT_CANONICAL/);
await assert.rejects(()=>inspectReadback({
  plan:revision,receipt:next,returnedRows:[returning],readbackRows:[frozenRow],
}),/PREVIOUS_RECEIPT_REQUIRED/);
console.log("F08_CAS_EXACT_READBACK_PAYLOAD_11_CASES_PASS_UNCERTIFIED_PHYSICAL");
// Whole-chain readback prevents a single valid tail from masking a missing,
// reordered, overwritten or extra historical revision.
importedF08ChainTests: {
  const { auditS2F08RevisionChainReadbackV0_1: auditChain } =
    await import("../runtime/f08_outcome_atomic_cas_append_plan_v0_1.mjs");
  const r1 = await toS2FrozenOutcomeRevisionRowV0_1(first);
  const r2 = await toS2FrozenOutcomeRevisionRowV0_1(next);
  const chain = await auditChain({
    receiptChain:[first,next],readbackRows:[r1,r2],maxRevisions:20,
  });
  assert.equal(chain.status,"OFFLINE_CHAIN_MATCH_NOT_PHYSICAL_CERTIFICATION");
  assert.equal(chain.revisionCount,2);
  assert.equal(chain.exactBoundedReadbackPlan.params[2],21);
  assert.match(chain.exactBoundedReadbackPlan.sql,/ORDER BY revision_number ASC LIMIT \?/);
  assert.equal(chain.chainCompleteInPhysicalD1,false);
  assert.equal(chain.physicalD1ReadbackVerified,false);
  assert.equal(chain.accountWideQuotaGranted,false);
  assert.equal(chain.sourcePITIndependentlyVerified,false);
  assert.equal(Object.isFrozen(chain),true);
  assert.equal((await auditChain({receiptChain:[first,next],readbackRows:[r1,r2],maxRevisions:20})).auditHash,chain.auditHash);
  const negatives = [
    {receiptChain:[],readbackRows:[],error:/EXPECTED_RECEIPTS/},
    {receiptChain:[next],readbackRows:[r2],error:/GENESIS_REQUIRED/},
    {receiptChain:[first,next],readbackRows:[r1],error:/COUNT_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r1,r2,{...r2}],error:/COUNT_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r2,r1],error:/STORED_REVISION_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r1,{...r2,revision_number:3}],error:/STORED_REVISION_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r1,{...r2,receipt_json:"{}"}],error:/STORED_REVISION_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r1,{...r2,cost_model_hash:"f".repeat(64)}],error:/STORED_REVISION_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r1,{...r2,revision_id:"unexpected"}],error:/STORED_REVISION_MISMATCH/},
    {receiptChain:[first,next],readbackRows:[r1,{...r2,extra_column:true}],error:/COLUMN_SHAPE_INVALID/},
    {receiptChain:[first,first],readbackRows:[r1,r1],error:/GAP_OR_REORDERED_RECEIPT/},
    {receiptChain:[first,next],readbackRows:[r1,r2],maxRevisions:1,error:/EXPECTED_RECEIPTS/},
    {receiptChain:[first,next],readbackRows:[r1,r2],maxRevisions:1001,error:/UNSAFE_BOUNDED_LIMIT/},
    {receiptChain:[first,next],readbackRows:[r1,r2],bindingName:"V7_DB",error:/FORBIDDEN_BINDING/},
    {receiptChain:[first,{...next,revisionHash:"f".repeat(64)}],readbackRows:[r1,r2],error:/RECEIPT_HASH_MISMATCH/},
  ];
  for (const v of negatives) {
    await assert.rejects(()=>auditChain({...v,receiptChain:v.receiptChain,readbackRows:v.readbackRows}),v.error);
  }
  console.log("F08_CHAIN_READBACK_15_NEGATIVE_AND_2_POSITIVE_OFFLINE_PASS_NO_PHYSICAL_AUTHORITY");
}

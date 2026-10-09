import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildDecisionOutcomeSnapshotV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
import { simulateTaiwanLongDailyPlanV0_1, toOutcomeSimulatedExecutionV0_1 } from "../runtime/execution_simulator_v0_1.mjs";
import {
  buildS2FrozenOutcomeRevisionV0_1, verifyS2FrozenOutcomeRevisionV0_1,
  toS2FrozenOutcomeRevisionRowV0_1,
} from "../runtime/outcome_revision_archive_v0_1.mjs";

const decision={
  decisionId:"S2-REV-2330",decisionHash:"d".repeat(64),
  strategyId:"SWING_GROWTH",strategyVersion:"SHADOW-V1",symbol:"2330",
  marketDate:"2026-09-29",decisionTimestamp:"2026-09-29T07:30:00Z",
  regimeSnapshotId:"S2-REG-20260929",
};
const regime={
  regimeSnapshotId:"S2-REG-20260929",regimeHash:"e".repeat(64),
  marketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
};
const action="c".repeat(64);
const model={
  costModelVersion:"COST-V1",taxRuleId:"TW-TAX-1",
  commissionRate:0.001,minimumCommission:1,transactionTaxRate:0.003,
  entrySlippageRate:0.001,exitSlippageRate:0.001,
};
const bar=(n,date,close)=>({
  sessionNumber:n,marketDate:date,availableAt:date+"T08:30:00Z",
  priceSpace:"ADJUSTED",open:close,high:close+1,low:close-1,close,
  volumeShares:100000,tradingState:"NORMAL",executableLiquidity:"AVAILABLE",
  limitState:"NONE",sourceId:"SYNTHETIC_NOT_PIT",
});
const session1=bar(1,"2026-09-30",90);
const session2=bar(2,"2026-10-01",92);
async function makeSim(costModel=model){
  return simulateTaiwanLongDailyPlanV0_1({
    simOrderId:"S2-REV-ORDER",entryFillObservationId:"S2-REV-ENTRY",
    exitFillObservationId:"S2-REV-EXIT",decisionId:decision.decisionId,
    strategyId:decision.strategyId,strategyVersion:decision.strategyVersion,
    symbol:decision.symbol,decisionMarketDate:decision.marketDate,
    decisionTimestamp:decision.decisionTimestamp,
    earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",
    triggerPrice:105,requestedShares:1000,stopPrice:85,targetPrice:120,
    maxHoldingSessions:5,entryValiditySessions:2,sessions:[session1,session2],
    priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",costModel,
    simulatedAt:"2026-10-02T09:00:00Z",
  });
}
async function makeOutcome(sim,sessions,updatedAt){
  return buildDecisionOutcomeSnapshotV0_1({
    decisionId:decision.decisionId,symbol:decision.symbol,
    decisionMarketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
    referencePrice:89,entryPlan:{stopPrice:85,targets:[120]},
    benchmarkReferenceClose:100,industryReferenceClose:100,
    costScenarios:[{scenarioId:"SIGNAL_COST",roundTripCostRate:0.004}],
    priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
    sessions,updatedAt,simulatedExecution:toOutcomeSimulatedExecutionV0_1(sim),
  });
}
const sim=await makeSim();
assert.equal(sim.state,"NO_FILL");
const first=await makeOutcome(sim,[session1],"2026-10-01T09:00:00Z");
const later=await makeOutcome(sim,[session1,session2],"2026-10-02T09:00:00Z");
const genesis=await buildS2FrozenOutcomeRevisionV0_1({
  outcome:first,decision,regime,simulation:sim,corporateActionHash:action,
});
const revision=await buildS2FrozenOutcomeRevisionV0_1({
  outcome:later,decision,regime,simulation:sim,corporateActionHash:action,
  previousRevision:genesis,
});
assert.equal(genesis.revisionNumber,1);
assert.equal(revision.revisionNumber,2);
assert.equal(revision.previousRevisionHash,genesis.revisionHash);
assert.equal(revision.lineageHash,genesis.lineageHash);
assert.notEqual(revision.revisionId,genesis.revisionId);
assert.equal(revision.certifiedPerformance,false);
assert.equal(revision.physicalPITVerified,false);
assert.equal(revision.authorizesFinalSelection,false);
assert.equal((await verifyS2FrozenOutcomeRevisionV0_1(genesis)).valid,true);
assert.equal((await verifyS2FrozenOutcomeRevisionV0_1(revision)).valid,true);
assert.equal((await buildS2FrozenOutcomeRevisionV0_1({
  outcome:later,decision,regime,simulation:sim,corporateActionHash:action,
  previousRevision:genesis,
})).revisionHash,revision.revisionHash);

const changingTax=await makeSim({...model,transactionTaxRate:0.004});
const alternate=await makeOutcome(changingTax,[session1,session2],"2026-10-02T09:00:00Z");
const newLineage=await buildS2FrozenOutcomeRevisionV0_1({
  outcome:alternate,decision,regime,simulation:changingTax,corporateActionHash:action,
});
assert.equal(newLineage.revisionNumber,1);
assert.notEqual(newLineage.lineageHash,genesis.lineageHash);
await assert.rejects(()=>buildS2FrozenOutcomeRevisionV0_1({
  outcome:alternate,decision,regime,simulation:changingTax,corporateActionHash:action,
  previousRevision:genesis,
}),/NEW_LINEAGE_REQUIRES_GENESIS/);

const deletedSession={...later,sessions:[],observedSessionCount:0};
deletedSession.outcomeHash=await sha256Hex(
  Object.fromEntries(Object.entries(deletedSession).filter(([k])=>k!=="outcomeHash")),
);
await assert.rejects(()=>buildS2FrozenOutcomeRevisionV0_1({
  outcome:deletedSession,decision,regime,simulation:sim,
  corporateActionHash:action,previousRevision:genesis,
}),/NON_MONOTONIC|SESSION_HISTORY_ERASURE|SESSION_LINEAGE/);
await assert.rejects(()=>buildS2FrozenOutcomeRevisionV0_1({
  outcome:later,decision:{...decision,strategyVersion:"OTHER"},
  regime,simulation:sim,corporateActionHash:action,
}),/PARENT_MISMATCH/);
await assert.rejects(()=>buildS2FrozenOutcomeRevisionV0_1({
  outcome:later,decision,regime,simulation:{...sim,executionHash:"f".repeat(64)},
  corporateActionHash:action,
}),/PARENT_MISMATCH|EXECUTION_HASH_MISMATCH/);
await assert.rejects(()=>buildS2FrozenOutcomeRevisionV0_1({
  outcome:later,decision,regime,simulation:sim,
  corporateActionHash:"INVALID",
}),/64 lowercase hex/);
await assert.rejects(()=>verifyS2FrozenOutcomeRevisionV0_1({
  ...genesis,revisionHash:"f".repeat(64),
}),/RECEIPT_HASH_MISMATCH/);

const row1=toS2FrozenOutcomeRevisionRowV0_1(genesis);
const row2=toS2FrozenOutcomeRevisionRowV0_1(revision);
const rowAlternative=toS2FrozenOutcomeRevisionRowV0_1(newLineage);
assert.equal(row1.revision_id,genesis.revisionId);
assert.equal(row2.previous_revision_hash,genesis.revisionHash);
assert.equal(row1.certified_performance,0);
assert.equal(row2.physical_pit_verified,0);
assert.notEqual(row2.revision_id,row1.revision_id);

const sql=readFileSync(new URL("../sql/0011_outcome_revision_archive_staged.sql",import.meta.url),"utf8");
assert.match(sql,/CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_update/);
assert.match(sql,/CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_delete/);
assert.match(sql,/UNIQUE \(decision_id, lineage_hash, revision_number\)/);
// Real in-memory SQLite test: normal chain INSERT succeeds; replay/UPDATE/
// DELETE/duplicate-version/certification-forgery must all fail.
const python=String.raw`
import sqlite3, json, sys
payload=json.loads(sys.stdin.read())
db=sqlite3.connect(":memory:")
db.executescript(payload["schema"])
def insert(row):
  cols=list(row)
  db.execute("INSERT INTO s2_outcome_revision_archive ("+",".join(cols)+") VALUES ("+",".join("?" for _ in cols)+")", list(row.values()))
insert(payload["genesis"])
insert(payload["revision"])
insert(payload["alternative"])
assert db.execute("SELECT COUNT(*) FROM s2_outcome_revision_archive").fetchone()[0]==3
attempts=[
  ("UPDATE s2_outcome_revision_archive SET observed_at=? WHERE revision_id=?",("2026-10-09T00:00:00Z",payload["genesis"]["revision_id"])),
  ("DELETE FROM s2_outcome_revision_archive WHERE revision_id=?",(payload["genesis"]["revision_id"],)),
  ("UPDATE s2_outcome_revision_archive SET certified_performance=1 WHERE revision_id=?",(payload["revision"]["revision_id"],)),
]
blocked=0
for sql, params in attempts:
  try:db.execute(sql,params)
  except sqlite3.IntegrityError:blocked+=1
  else:raise AssertionError("unexpected mutation")
try:insert(payload["genesis"])
except sqlite3.IntegrityError:blocked+=1
else:raise AssertionError("unexpected duplicate")
copy=dict(payload["revision"])
copy["revision_id"]="S2OR:"+"f"*64
copy["revision_hash"]="f"*64
try:insert(copy)
except sqlite3.IntegrityError:blocked+=1
else:raise AssertionError("unexpected duplicate revision ordinal")
copy=dict(payload["revision"])
copy["revision_id"]="S2OR:"+"a"*64
copy["revision_hash"]="a"*64
copy["revision_number"]=4
copy["certified_performance"]=1
try:insert(copy)
except sqlite3.IntegrityError:blocked+=1
else:raise AssertionError("unexpected certification")
assert blocked==6
print("IN_MEMORY_SQLITE_APPEND_ONLY_PASS: 3 inserts, 6 tamper attempts blocked")
`;
const p=spawnSync("python3",["-c",python],{
  input:JSON.stringify({schema:sql,genesis:row1,revision:row2,alternative:rowAlternative}),
  encoding:"utf8",
});
assert.equal(p.status,0,p.stderr||p.stdout);
assert.match(p.stdout,/IN_MEMORY_SQLITE_APPEND_ONLY_PASS/);
console.log("S2 CORR012 immutable outcome revision-chain tests PASS; no actual Cloudflare D1 reads/writes");

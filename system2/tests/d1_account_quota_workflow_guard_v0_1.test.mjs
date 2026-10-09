import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const registry=JSON.parse(await readFile(
  new URL("../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const workflowsDir=new URL("../../.github/workflows/",import.meta.url);
const files=(await readdir(workflowsDir)).filter(x=>x.endsWith(".yml"));
const groupPaths=[];
for(const name of files){
  const body=await readFile(new URL(name,workflowsDir),"utf8");
  if(/group:\s*system2-isolated-d1-writer/.test(body)) groupPaths.push(`.github/workflows/${name}`);
}
assert.deepEqual(groupPaths.sort(),registry.writers.map(x=>x.workflow).sort(),
  "every workflow sharing System2 D1 writer authority must be registered");

let physicalCount=0;
for(const writer of registry.writers){
  const body=await readFile(new URL("../../"+writer.workflow,import.meta.url),"utf8");
  assert.ok(writer.readReservationModel,writer.id+" must declare read reservation semantics");

  if(writer.physicalMutation){
    physicalCount++;
    assert.match(body,/\.\/\.github\/actions\/system2-d1-budget-gate/,
      `${writer.id} must use shared account quota gate`);
    assert.match(body,new RegExp(`writer_id:\\s*${writer.id.replace(/[.*+?^$\{\}()|[\]\\]/g,"\\$&")}`),
      `${writer.id} workflow must bind its registered writer id`);
    assert.match(body,/mode:\s*result/,`${writer.id} must reconcile quota result`);
    assert.match(body,/if:\s*always\(\) && steps\.quota\.outputs\.physical_allowed == 'true'/,
      `${writer.id} result finalizer must run after success/failure/partial completion`);
    assert.match(body,/execution_outcome:\s*\$\{\{ job\.status \}\}/,
      `${writer.id} must persist execution outcome`);
    assert.doesNotMatch(body,/if:\s*steps\.quota\.outputs\.physical_allowed == 'true' && success\(\)/,
      `${writer.id} must not skip result receipt on failure`);

    if(["P2","P3"].includes(writer.priority)&&/^\s*push:/m.test(body)){
      assert.equal(writer.pushPhysicalAllowed,false,`${writer.id} push must not be physical`);
      if(writer.id==="RESONANCE_DEPLOY"){
        assert.match(body,/SYSTEM2_D1_SCHEMA_MUTATION_ALLOWED:\s*\$\{\{ steps\.quota\.outputs\.physical_allowed \}\}/);
      }else{
        assert.match(body,/if:\s*steps\.quota\.outputs\.physical_allowed == 'true'/,
          `${writer.id} mutating steps must be quota-gated`);
      }
    }
  }else{
    assert.equal(writer.readReservationModel.type,"NONE");
  }
}
assert.equal(physicalCount,13);

const annual=registry.writers.find(x=>x.id==="HISTORICAL_ANNUAL_BACKFILL");
assert.equal(annual.reservationModel.type,"FIXED_MEASURED");
assert.equal(annual.reservationModel.rowsWritten,7358);
assert.equal(annual.readReservationModel.type,"CALLER_REQUIRED");
assert.equal(annual.readReservationModel.minimumRowsRead,null);
assert.equal(annual.readReservationModel.state,"READ_COST_EVIDENCE_REQUIRED");

const daily=registry.writers.find(x=>x.id==="DAILY_SHADOW_DIAGNOSTIC");
assert.equal(daily.readReservationModel.type,"FIXED_MEASURED");
assert.equal(daily.readReservationModel.rowsRead,583256);

const recentWriter=registry.writers.find(x=>x.id==="RECENT_A1_WARMUP");
assert.equal(recentWriter.readReservationModel.type,"FIXED_MEASURED");
assert.equal(recentWriter.readReservationModel.rowsRead,1047112);

const recent=await readFile(new URL("../../.github/workflows/system2-recent-a1-hot-history-warmup.yml",import.meta.url),"utf8");
assert.match(recent,/writer_id:\s*RECENT_A1_WARMUP/);
assert.match(recent,/SYSTEM2_HOT_HISTORY_MAX_DATES:\s*\$\{\{ steps\.quota\.outputs\.adaptive_max_dates \}\}/);
assert.match(recent,/quota-adaptive warmup bounds changed/);

const gate=await readFile(new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url),"utf8");
assert.match(gate,/d1AnalyticsAdaptiveGroups/);
assert.match(gate,/freshnessGuarantee:\s*"NOT_DOCUMENTED_BY_VENDOR"/);
assert.match(gate,/NON_RELEASING_SAME_DAY_RESERVATIONS_PLUS_MAX_OBSERVED_LEDGER/);
assert.match(gate,/SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1/);
assert.match(gate,/SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1/);
assert.match(gate,/readLedgerReceiptById/);
assert.match(gate,/verifyD1QuotaLedgerReceiptIdentityV0_1/);
assert.match(gate,/D1_QUOTA_LEDGER_RECEIPT_READBACK_MISSING/);
assert.match(gate,/reservationReleasePolicy:\s*"NEVER_RELEASE_BEFORE_UTC_RESET"/);
assert.match(gate,/SYSTEM2_D1_EXECUTION_OUTCOME/);
assert.match(gate,/UNREGISTERED_D1_WRITER/);
assert.doesNotMatch(gate,/billing|subscription|upgradePlan|paymentMethod/i,
  "quota remediation must never mutate billing/plan");

const action=await readFile(new URL("../../.github/actions/system2-d1-budget-gate/action.yml",import.meta.url),"utf8");
assert.match(action,/requested_rows_read:[\s\S]*default:\s*""/);
assert.match(action,/execution_outcome:/);
assert.match(action,/SYSTEM2_D1_EXECUTION_OUTCOME:/);

const reserve=JSON.parse(await readFile(
  new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
assert.equal(reserve.reserveNumberAuthorized,false);
assert.equal(reserve.authorizedReserveRows,null);
assert.equal(reserve.healthyAfterMarketDateCount,2);
assert.equal(reserve.observedWholeV7DailyRowsWritten.max,2825);

console.log("System2 account-wide D1 quota workflow guard V0.2 tests passed");

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

for(const writer of registry.writers){
  const body=await readFile(new URL("../../"+writer.workflow,import.meta.url),"utf8");
  if(writer.physicalMutation){
    assert.match(body,/\.\/\.github\/actions\/system2-d1-budget-gate/,
      `${writer.id} must use shared account quota gate`);
    assert.match(body,new RegExp(`writer_id:\\s*${writer.id.replace(/[.*+?^$\{\}()|[\]\\]/g,"\\$&")}`),
      `${writer.id} workflow must bind its registered writer id`);
    if(["P2","P3"].includes(writer.priority)&&/^\s*push:/m.test(body)){
      assert.equal(writer.pushPhysicalAllowed,false,`${writer.id} push must not be physical`);
      if(writer.id==="RESONANCE_DEPLOY"){
        assert.match(body,/SYSTEM2_D1_SCHEMA_MUTATION_ALLOWED:\s*\$\{\{ steps\.quota\.outputs\.physical_allowed \}\}/);
      }else{
        assert.match(body,/if:\s*steps\.quota\.outputs\.physical_allowed == 'true'/,
          `${writer.id} mutating steps must be quota-gated`);
      }
    }
  }
}

const recent=await readFile(new URL("../../.github/workflows/system2-recent-a1-hot-history-warmup.yml",import.meta.url),"utf8");
assert.match(recent,/writer_id:\s*RECENT_A1_WARMUP/);
assert.match(recent,/SYSTEM2_HOT_HISTORY_MAX_DATES:\s*\$\{\{ steps\.quota\.outputs\.adaptive_max_dates \}\}/);
assert.match(recent,/quota-adaptive warmup bounds changed/);

const hot=await readFile(new URL("../../.github/workflows/system2-hot-history-bootstrap.yml",import.meta.url),"utf8");
assert.match(hot,/writer_id:\s*HOT_HISTORY_BOOTSTRAP/);
assert.match(hot,/requested_rows_written:\s*\$\{\{ inputs\.quota_reservation_rows/);

const smoke=await readFile(new URL("../../.github/workflows/system2-historical-pack-real-source-smoke.yml",import.meta.url),"utf8");
assert.match(smoke,/writer_id:\s*HISTORICAL_REAL_SOURCE_SMOKE/);
assert.match(smoke,/if:\s*steps\.quota\.outputs\.physical_allowed == 'true'/);

const daily=await readFile(new URL("../../.github/workflows/system2-daily-shadow-diagnostic.yml",import.meta.url),"utf8");
assert.match(daily,/writer_id:\s*DAILY_SHADOW_DIAGNOSTIC/);
assert.match(daily,/mode:\s*result/);

const ensure=await readFile(new URL("../deploy/ensure_system2_d1_ready.mjs",import.meta.url),"utf8");
assert.match(ensure,/SYSTEM2_D1_SCHEMA_MUTATION_ALLOWED/);
assert.match(ensure,/D1_SCHEMA_MUTATION_REQUIRES_QUOTA_RESERVATION/);

const gate=await readFile(new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url),"utf8");
assert.match(gate,/d1AnalyticsAdaptiveGroups/);
assert.match(gate,/SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1/);
assert.match(gate,/SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1/);
assert.match(gate,/UNREGISTERED_D1_WRITER/);
assert.doesNotMatch(gate,/billing|subscription|upgradePlan|paymentMethod/i,
  "quota remediation must never mutate billing/plan");

const reserve=JSON.parse(await readFile(
  new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
assert.equal(reserve.reserveNumberAuthorized,false);
assert.equal(reserve.authorizedReserveRows,null);
assert.equal(reserve.healthyAfterMarketDateCount,2);
assert.equal(reserve.observedWholeV7DailyRowsWritten.max,2825);

console.log("System2 account-wide D1 quota workflow guard tests passed");

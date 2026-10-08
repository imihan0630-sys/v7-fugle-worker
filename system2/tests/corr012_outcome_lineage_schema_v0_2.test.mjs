import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migration=await readFile(
  new URL("../sql/0011_outcome_versioned_lineage.sql",import.meta.url),
  "utf8",
);
const provisioner=await readFile(
  new URL("../deploy/provision_system2_d1.mjs",import.meta.url),
  "utf8",
);

assert.match(migration,/CREATE TABLE IF NOT EXISTS s2_outcome_versions\s*\(/);
assert.match(migration,/outcome_version_id TEXT PRIMARY KEY/);
for(const column of [
  "decision_hash",
  "strategy_id",
  "strategy_version",
  "symbol",
  "decision_timestamp",
  "regime_snapshot_id",
  "regime_hash",
  "price_space",
  "corporate_action_state",
  "corporate_action_lineage_hash",
  "cost_scenario_set_hash",
  "execution_hash",
  "execution_version",
  "cost_model_hash",
  "tax_rule_id",
  "tax_rule_hash",
  "signal_return_json",
  "realized_return_after_cost",
  "simulated_execution_json",
  "outcome_hash",
  "outcome_json",
]) {
  assert.match(migration,new RegExp("\\b"+column+"\\b"),"missing "+column);
}
assert.match(migration,/UNIQUE\s*\(decision_id,\s*outcome_version_id\)/);
assert.match(
  migration,
  /idx_s2_outcome_versions_execution[\s\S]*execution_hash, cost_model_hash, tax_rule_hash/,
);

assert.match(provisioner,/\.\.\/sql\/0011_outcome_versioned_lineage\.sql/);
assert.match(provisioner,/"s2_outcome_versions"/);

console.log("CORR-012 outcome lineage schema/provision guard PASS");

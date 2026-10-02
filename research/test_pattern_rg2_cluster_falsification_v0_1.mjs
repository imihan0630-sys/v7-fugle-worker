import fs from "node:fs";
import assert from "node:assert/strict";

const path = new URL("./pattern_rg2_cluster_falsification_fixtures_v0_1.json", import.meta.url);
const spec = JSON.parse(fs.readFileSync(path, "utf8"));

assert.equal(spec.status, "OUTCOME_BLIND");
assert.equal(spec.formalCore, "LOCKED");
assert.equal(spec.effectiveSampleRule, "ROWS_DO_NOT_MULTIPLY_INDEPENDENT_N");
assert.equal(spec.inferenceGuards.unknownNeverZero, true);
assert.equal(spec.inferenceGuards.outcomeJoin, "CLOSED");

const expected = new Map([
  ["RG2C01","CLUSTER_NOT_MULTIPLY_N"],
  ["RG2C02","LONGITUDINAL_NOT_INDEPENDENT"],
  ["RG2C03","ZERO_INDEPENDENT_VOTE_INCREMENT"],
  ["RG2C04","RETAIN_SCAN_DATE_DEPENDENCE"],
  ["RG2C05","RETAIN_OVERLAPPING_WINDOW_DEPENDENCE"],
  ["RG2C06","DATA_BLOCKED"],
  ["RG2C07","DATA_BLOCKED"],
  ["RG2C08","DATA_BLOCKED"],
  ["RG2C09","UNKNOWN"],
  ["RG2C10","COMMON_SUPPORT_FAIL"],
  ["RG2C11","DECISION_CUTOFF_FAIL"],
  ["RG2C12","EQUAL_HORIZON_FAIL"],
]);

assert.equal(spec.fixtures.length, expected.size);
assert.deepEqual(new Set(spec.fixtures.map(x => x.id)), new Set(expected.keys()));
for (const x of spec.fixtures) assert.equal(x.expected, expected.get(x.id), x.id);

for (const key of ["scanDate","immutableParentDecisionReceipt","structuralEpisode"]) {
  assert.ok(spec.inferenceGuards.clusterDimensions.includes(key), key);
}
assert.equal(spec.inferenceGuards.overlappingOutcomeWindows, "DEPENDENCE_NOT_INDEPENDENCE");
assert.deepEqual(spec.inferenceGuards.multipleTestingFamilies, ["timeframe","boundary","estimand"]);

console.log(JSON.stringify({status:"PASS", fixtureCount:spec.fixtures.length, outcomeJoin:spec.inferenceGuards.outcomeJoin}));

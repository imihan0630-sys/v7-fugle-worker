import assert from "node:assert/strict";
import {
  DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION,
  fingerprintCollectorContractEntries,
} from "../runtime/decision_clock_collector_contract_v0_3.mjs";

const a = fingerprintCollectorContractEntries([
  { path: "b.mjs", content: "two" },
  { path: "a.mjs", content: "one" },
]);
const b = fingerprintCollectorContractEntries([
  { path: "a.mjs", content: "one" },
  { path: "b.mjs", content: "two" },
]);
assert.equal(a.contractVersion, DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION);
assert.equal(a.fingerprint, b.fingerprint);
assert.deepEqual(a.files.map((x) => x.path), ["a.mjs", "b.mjs"]);

const changed = fingerprintCollectorContractEntries([
  { path: "a.mjs", content: "one changed" },
  { path: "b.mjs", content: "two" },
]);
assert.notEqual(a.fingerprint, changed.fingerprint);

assert.throws(
  () => fingerprintCollectorContractEntries([
    { path: "a.mjs", content: "one" },
    { path: "a.mjs", content: "two" },
  ]),
  /duplicate collector contract path/,
);

console.log("System2 Decision Clock collector contract V0.3 tests passed");

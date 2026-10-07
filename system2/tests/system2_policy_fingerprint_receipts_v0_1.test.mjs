import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildStage1System2PolicyFingerprintSetV0_1 } from "../runtime/system2_policy_fingerprint_v0_1.mjs";

async function json(path){
  return JSON.parse(await readFile(new URL("../"+path,import.meta.url),"utf8"));
}

const staticSet=await json("evidence/SDA022_SYSTEM2_STAGE1_POLICY_FINGERPRINT_SET_V0_1.json");
const staticSm=await json("evidence/SDA022_SYSTEM2_SHORT_MOMENTUM_POLICY_FINGERPRINT_V0_1.json");
const staticSg=await json("evidence/SDA022_SYSTEM2_SWING_GROWTH_POLICY_FINGERPRINT_V0_1.json");

const rebuilt=await buildStage1System2PolicyFingerprintSetV0_1({generatedAt:staticSet.generatedAt});
assert.deepEqual(staticSet,rebuilt);
assert.deepEqual(staticSm,rebuilt.fingerprints.find(x=>x.strategyId==="SHORT_MOMENTUM"));
assert.deepEqual(staticSg,rebuilt.fingerprints.find(x=>x.strategyId==="SWING_GROWTH"));

assert.equal(staticSm.fingerprintHash,"66860e6e5c7a5c191fb1ff7a10a2c2e4eb7b3f015b87e65e6afe7a74ef06135d");
assert.equal(staticSg.fingerprintHash,"486df3f82b9c0fc4db4139f1f1039d5a1dace59e43df3e4cde75c8fc26a58602");
assert.equal(staticSet.sda022.physicalIndependentDiscovery,false);
assert.equal(staticSet.sda022.ncT01Required,true);
assert.equal(staticSet.finalSelectionEnabled,false);
assert.equal(staticSet.livePushEnabled,false);
assert.equal(staticSet.capitalImpact,false);
assert.equal(staticSet.orderImpact,false);
assert.equal(staticSet.system1RuntimeUsed,false);

console.log("SDA-022 static System2 fingerprint receipts rebuild exactly: PASS");

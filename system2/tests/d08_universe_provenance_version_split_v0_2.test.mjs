import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const v01=await readFile(new URL("../runtime/d08_twse_historical_universe_source_v0_1.mjs",import.meta.url),"utf8");
const v02=await readFile(new URL("../runtime/d08_twse_historical_universe_source_v0_2.mjs",import.meta.url),"utf8");
const capture=await readFile(new URL("../scripts/d08_twse_universe_provenance_v0_2.mjs",import.meta.url),"utf8");

assert.match(v01,/const current=currentBase;/);
assert.doesNotMatch(v01,/const current=currentReconciliation\.rows;/);
assert.match(v01,/registryId:"D08-TWSE-2023-2026-OFFICIAL-UNION-V0\.1"/);

assert.match(v02,/buildD08TwseHistoricalUniverseSourceV0_2/);
assert.match(v02,/const current=currentReconciliation\.rows;/);
assert.match(v02,/registryId:"D08-TWSE-2023-2026-OFFICIAL-UNION-V0\.2"/);
assert.match(v02,/EARLIEST_SAME_COMPANY_CONTINUOUS_LISTING/);

assert.match(capture,/D08_TWSE_UNIVERSE_PROVENANCE_V0_2/);
assert.match(capture,/frozenV01RemainsImmutable:true/);
assert.match(capture,/semanticSnapshotHash/);
assert.match(capture,/semanticSnapshotBundleHash/);
assert.match(capture,/semanticSnapshotHashExcludesCaptureClock:true/);
assert.match(capture,/symbol:"6873"/);
assert.doesNotMatch(capture,/createRemoteR2S3Adapter|createRemoteD1RestAdapter|s2_outcome|return outcome|Worker\.js/i);

console.log(JSON.stringify({ok:true,guard:"D08_UNIVERSE_PROVENANCE_VERSION_SPLIT_V0_2",formalCoreImpact:false}));

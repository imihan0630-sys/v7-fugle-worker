import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const s=await readFile(new URL("../scripts/d08_twse_semantic_universe_r2_archive_v0_2.mjs",import.meta.url),"utf8");
const w=await readFile(new URL("../../.github/workflows/d08-twse-semantic-universe-r2-v0-2.yml",import.meta.url),"utf8");

assert.match(s,/buildD08TwseHistoricalUniverseSourceV0_2/);
assert.match(s,/buildD08SemanticUniverseIdentityV0_1/);
assert.match(s,/semanticRegistryHash/);
assert.match(s,/twse-semantic-universe-v0\.2/);
assert.match(s,/readbackVerified:true/);
assert.match(s,/createRemoteR2S3Adapter/);
assert.doesNotMatch(s,/createRemoteD1RestAdapter|s2_outcome|return outcome|Worker\.js/i);

assert.match(w,/environment: system2-research/);
assert.match(w,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(w,/wrangler.*deploy|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);

console.log(JSON.stringify({ok:true,guard:"D08_SEMANTIC_UNIVERSE_R2_V0_2",formalCoreImpact:false}));

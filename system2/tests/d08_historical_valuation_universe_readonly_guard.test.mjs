import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const script=await readFile(
  new URL("../scripts/d08_historical_valuation_universe_readonly_v0_1.mjs",import.meta.url),
  "utf8"
);
const workflow=await readFile(
  new URL("../../.github/workflows/d08-historical-valuation-universe-readonly.yml",import.meta.url),
  "utf8"
);

assert.match(script,/databaseName:"system2-research"/);
assert.match(script,/s2_historical_universe_registry_receipts/);
assert.match(script,/s2_historical_universe_memberships/);
assert.match(script,/rowsWritten,0|rowsWritten\),0|rowsWritten, 0/);
assert.doesNotMatch(script,/INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|DROP\s+TABLE|ALTER\s+TABLE/i);
assert.doesNotMatch(script,/Worker\.js|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/);

assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/permissions:\s*\n\s*contents: read/);
assert.match(workflow,/d08_historical_valuation_universe_readonly_guard\.test\.mjs/);
assert.match(workflow,/d08_historical_valuation_universe_readonly_v0_1\.mjs/);
assert.doesNotMatch(workflow,/wrangler.*deploy|secret put|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);

console.log(JSON.stringify({
  ok:true,
  guard:"D08_HISTORICAL_VALUATION_UNIVERSE_READONLY",
  mutationAllowed:false,
  system1RuntimeAllowed:false,
}));
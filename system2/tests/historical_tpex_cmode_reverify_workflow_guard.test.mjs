import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(".github/workflows/system2-historical-tpex-cmode-reverify-readonly.yml","utf8");

assert.match(workflow,/System2 TPEx Cmode Historical Reverify Readonly/);
assert.match(workflow,/SYSTEM2_HISTORY_YEAR_MARKET: TPEX/);
assert.match(workflow,/historical_market_year_verify_v0_1\.mjs/);
assert.match(workflow,/d1UsageObservedThisRun/);
assert.match(workflow,/rowsWritten!==0/);
assert.match(workflow,/Production isolation PASS/);
assert.ok(!/historical_pack_year_backfill_v0_1\.mjs/.test(workflow),"readonly reverify must not run annual backfill");
assert.ok(!/provision_system2_d1\.mjs/.test(workflow),"readonly reverify must not provision D1");
assert.ok(!/wrangler\s+(deploy|delete)/.test(workflow),"readonly reverify must not mutate Cloudflare runtime");
assert.ok(!/INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|REPLACE\s+INTO/i.test(workflow),"readonly workflow must not embed persistence SQL");

console.log("System2 TPEx cmode readonly reverify workflow guard passed");

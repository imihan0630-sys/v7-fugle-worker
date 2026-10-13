import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(".github/workflows/system2-tpex-cmode-contract-probe-readonly.yml","utf8");
const script=await readFile("system2/scripts/tpex_cmode_contract_probe_v0_1.mjs","utf8");

assert.match(workflow,/System2 TPEx Cmode Contract Probe Readonly/);
assert.match(workflow,/tpex_cmode_contract_probe_v0_1\.mjs/);
assert.match(workflow,/Read-only\/System1 isolation PASS/);
assert.ok(!/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|SYSTEM2_R2_ACCESS_KEY_ID/.test(workflow));
assert.ok(!/historical_pack_year_backfill|provision_system2_d1|wrangler\s+(deploy|delete)/.test(workflow));
assert.match(script,/2023-04-10/);
assert.match(script,/2023-10-12/);
assert.match(script,/targetRows/);
assert.match(script,/tables\?\.\[0\]/);
assert.match(script,/tableFields/);
assert.match(script,/targetStopMarkers/);
assert.match(script,/field\.includes\("停止交易"\)/);
assert.match(script,/topLevelKeys/);
assert.match(script,/payloadHash/);
assert.ok(!/createRemoteD1RestAdapter|createRemoteR2S3Adapter|db\.prepare/.test(script));

console.log("System2 TPEx cmode contract probe readonly guard passed");

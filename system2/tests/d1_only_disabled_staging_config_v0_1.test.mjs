import assert from "node:assert/strict";
import {buildD1OnlyDisabledStagingConfigV0_1 as build,assertD1OnlyDisabledStagingConfigV0_1 as validate}
 from "../migration/d1_only_disabled_staging_config_v0_1.mjs";
const uuid="a".repeat(32);
const s=build({databaseId:uuid});
assert(validate(s));
assert(s.includes('database_id = "'+uuid+'"'));
assert(s.includes("workers_dev = false"));
assert(!/^\s*\[\[r2_buckets\]\]/m.test(s));
assert(!/^\s*\[triggers\]/m.test(s));
assert(!/^\s*crons\s*=/m.test(s));
assert(!/^\s*routes?\s*=/m.test(s));
assert(!/^\s*workers_dev\s*=\s*true/m.test(s));
assert(!/^\s*SYSTEM2_RESONANCE_ENABLED\s*=\s*"true"/m.test(s));
assert(!/^\s*SYSTEM2_CAPTURE_ENABLED\s*=\s*"true"/m.test(s));
assert(!/^\s*\[\[kv_namespaces\]\]/m.test(s));
for(const input of [{},{databaseId:"BOTH"},{databaseId:uuid,workerName:"fugle-test"},{databaseId:uuid,workerName:"system2-shadow-research"}])
 assert.throws(()=>build(input));
for(const malicious of [
s.replace("workers_dev = false","workers_dev = true"),
s.replace('SYSTEM2_CAPTURE_ENABLED = "false"','SYSTEM2_CAPTURE_ENABLED = "true"'),
s.replace('SYSTEM2_RESONANCE_ENABLED = "false"','SYSTEM2_RESONANCE_ENABLED = "true"'),
s+'\n[triggers]\ncrons = ["* * * * *"]\n',
s+'\n[[r2_buckets]]\nbinding = "SYSTEM2_HISTORY_BUCKET"\n',
s+'\n[[kv_namespaces]]\nbinding = "STOCKS_KV"\n',
s+'\nroutes = ["*.example.com"]\n',
s+'\nname = "fugle-test"\n',
s.replace('database_id = "'+uuid+'"','database_id = "REPLACE_WITH_PRODUCTION_DB"'),
s.replace('name = "system2-shadow-research-staging"','name = "fugle-test"'),
]) {
 // Full config validator must reject any active route, cron, write arm or missing target.
 assert.throws(()=>validate(malicious),"should refuse unsafe config");
}
console.log("System2 D1-only staging config: 16 safety checks PASS, zero Cloudflare calls");

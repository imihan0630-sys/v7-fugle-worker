import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {resolveDailyShadowAccountRouteV0_1 as route} from
  "../runtime/daily_shadow_destination_account_route_v0_1.mjs";

const workflow=readFileSync(
  ".github/workflows/system2-recent-a1-hot-history-warmup.yml","utf8");
const script=readFileSync(
  "system2/scripts/run_recent_a1_hot_history_warmup_v0_1.mjs","utf8");
const gate=readFileSync(
  "system2/scripts/run_d1_account_quota_gate_v0_1.mjs","utf8");
const quarantine=JSON.parse(readFileSync(
  "system2/config/source_account_d1_writer_quarantine_v0_1.json","utf8"));

assert.equal(quarantine.active,true);
assert.equal(quarantine.denyNewPhysicalD1Reservations,true);
assert.match(workflow,/environment: system2-schema-only/);
assert.match(workflow,/SYSTEM2_D1_ACCOUNT_ROLE: DESTINATION/);
assert.match(workflow,/S2_SCHEMA_DEST_ACCOUNT_ID/);
assert.match(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN/);
assert.match(workflow,/S2_DEST_ACCOUNT_ANALYTICS_READ_TOKEN/);
assert.match(workflow,/writer_id: RECENT_A1_WARMUP/);
assert.match(workflow,/if: steps\.quota\.outputs\.physical_allowed == 'true'/);
assert.match(workflow,/SYSTEM2_HOT_HISTORY_MAX_DATES/);
assert.doesNotMatch(workflow,
 /secrets\.CLOUDFLARE_ACCOUNT_ID|secrets\.SYSTEM2_CLOUDFLARE_API_TOKEN|secrets\.CLOUDFLARE_API_TOKEN/);
assert.match(script,/assertDailyShadowDestinationDatabaseIdentityV0_1\(db\)/);
assert.match(script,/resolveDailyShadowAccountRouteV0_1/);
assert.match(script,/role: process\.env\.SYSTEM2_D1_ACCOUNT_ROLE/);
assert.match(script,/legacyDbToken: process\.env\.SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.match(script,/continuityState: "UNVERIFIED"/);
assert.match(script,/strategyEvaluationPerformed: false/);
assert.doesNotMatch(script,/apiToken = process\.env\.SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.match(gate,/shadowReservedBilledWrites:13130/);
assert.match(gate,/DEST_DAY80_FULL_RESERVATION_WOULD_EXCEED_OWNER_CAP/);
assert.match(gate,/projectedWritten>day80\.ownerDailyOperationalMax/);

const partial={
 writerId:"RECENT_A1_WARMUP",role:"DESTINATION",
 githubEnvironment:"system2-schema-only",accountId:"a".repeat(32),
 dbToken:"INJECTED",analyticsToken:"INJECTED"
};
// Allowed writer ID proceeds to pinned account check; the wrong account fails.
// Never fabricate or print a real matching destination account ID.
assert.throws(()=>route(partial),/ACCOUNT_FINGERPRINT_MISMATCH/);
for(const mutation of [
 {role:"SOURCE"},{role:null},{githubEnvironment:"system2-research"},
 {githubEnvironment:undefined},{writerId:"RESONANCE_DEPLOY"},
 {writerId:"HISTORICAL_ANNUAL_BACKFILL"},
 {legacyAccountId:"1".repeat(32)},{legacyDbToken:"OLD"},
 {legacyAnalyticsToken:"OLD"},{dbToken:null},{analyticsToken:null}
])assert.throws(()=>route({...partial,...mutation}));
const tmp=mkdtempSync(join(tmpdir(),"s2-warmup-old-account-denied-"));
try {
 const receipt=join(tmp,"gate.json");
 const main=fileURLToPath(new URL(
  "../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url));
 const x=spawnSync(process.execPath,[main],{
  env:{PATH:process.env.PATH||"",HOME:process.env.HOME||"",
   GITHUB_EVENT_NAME:"schedule",SYSTEM2_D1_WRITER_ID:"RECENT_A1_WARMUP",
   SYSTEM2_D1_GATE_MODE:"reserve",SYSTEM2_D1_GATE_OUTPUT:receipt},
  encoding:"utf8",timeout:15000
 });
 assert.equal(x.status,0,x.stderr);
 const j=JSON.parse(readFileSync(receipt,"utf8"));
 assert.equal(j.physicalAllowed,false);
 assert.deepEqual(j.reasonCodes,["SOURCE_ACCOUNT_SYSTEM1_V8_PROTECTION_QUARANTINE"]);
 assert.equal(j.cloudflareCallsThisGate,0);
 assert.equal(j.d1SqlCallsThisGate,0);
}finally{rmSync(tmp,{recursive:true,force:true});}
console.log("S2_WARMUP_DEST_ACCOUNT_ONLY_OLD_SOURCE_QUARANTINE_ZERO_API_PASS");

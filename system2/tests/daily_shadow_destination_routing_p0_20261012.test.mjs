import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {resolveDailyShadowAccountRouteV0_1 as route} from "../runtime/daily_shadow_destination_account_route_v0_1.mjs";
const old=JSON.parse(readFileSync("system2/config/source_account_d1_writer_quarantine_v0_1.json","utf8"));
assert.equal(old.active,true);
assert.equal(old.denyNewPhysicalD1Reservations,true);
const valid={writerId:"DAILY_SHADOW_DIAGNOSTIC",
 role:"DESTINATION",githubEnvironment:"system2-schema-only",
 // Test must NOT fabricate a matching account ID. Instead validate bad
 // identities and static actual provider guard without credential access.
 accountId:"a".repeat(32),dbToken:"INJECTED_D1_TOKEN",
 analyticsToken:"INJECTED_ANALYTICS_TOKEN"};
for(const mutation of [
 {role:"SOURCE"}, {role:undefined},{writerId:"RESONANCE_DEPLOY"},
 {githubEnvironment:"system2-research"},{githubEnvironment:"unknown"},
 {legacyAccountId:"1".repeat(32)},{legacyDbToken:"SOURCE"},
 {legacyAnalyticsToken:"SOURCE_ANALYTICS"},
 {analyticsToken:null},{dbToken:null},
]){
 const vars={...valid,...mutation};
 assert.throws(()=>route(vars));
}
assert.throws(()=>route(valid),/ACCOUNT_FINGERPRINT_MISMATCH/);
const w=readFileSync(".github/workflows/system2-daily-shadow-diagnostic.yml","utf8");
assert.match(w,/environment: system2-schema-only/);
assert.match(w,/SYSTEM2_D1_ACCOUNT_ROLE: DESTINATION/);
assert.match(w,/S2_SCHEMA_DEST_ACCOUNT_ID/);
assert.match(w,/S2_SCHEMA_DEST_D1_WRITE_TOKEN/);
assert.match(w,/S2_DEST_ACCOUNT_ANALYTICS_READ_TOKEN/);
assert.match(w,/DESTINATION_D1_ORIGINAL_ROW_READBACK_PASS/);
assert.doesNotMatch(w,/secrets\.CLOUDFLARE_ACCOUNT_ID|secrets\.SYSTEM2_CLOUDFLARE_API_TOKEN|secrets\.CLOUDFLARE_API_TOKEN|system2-shadow-research\.imihan0630\.workers\.dev/);
const guard=readFileSync("system2/scripts/run_d1_account_quota_gate_v0_1.mjs","utf8");
assert.match(guard,/if \(mode === "reserve" && !verifiedDestination\)/);
assert.match(guard,/decideSourceAccountWriterQuarantineV0_1/);
assert.match(guard,/verifiedDestination\?\.analyticsToken/);
assert.match(guard,/verifiedDestination\?\.dbToken/);
assert.match(guard,/ledgerIntegrityState: ledger\.integrityState/);
assert.match(guard,/outstandingReservedRowsWritten: ledger\.outstandingReservedRowsWritten/);
assert.match(guard,/evaluateD1AccountQuotaReservationV0_1/);
assert.match(guard,/queryAccountUsage\(\{ accountId, token, quotaDay: currentQuotaDay \}\)/);
const before=readFileSync("system2/scripts/run_daily_shadow_diagnostic.mjs","utf8");
assert.match(before,/resolveDailyShadowAccountRouteV0_1/);
assert.doesNotMatch(before,/accountId: process\.env\.CLOUDFLARE_ACCOUNT_ID|apiToken: process\.env\.SYSTEM2_CLOUDFLARE_API_TOKEN/);
const tmp=mkdtempSync(join(tmpdir(),"s2-route-source-denied-"));
try{
 const outfile=join(tmp,"gate.json");
 const script=fileURLToPath(new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url));
 const cli=spawnSync(process.execPath,[script],{encoding:"utf8",timeout:15000,
 env:{PATH:process.env.PATH||"",HOME:process.env.HOME||"",
 SYSTEM2_D1_WRITER_ID:"DAILY_SHADOW_DIAGNOSTIC",
 SYSTEM2_D1_GATE_MODE:"reserve",SYSTEM2_D1_GATE_OUTPUT:outfile,
 GITHUB_EVENT_NAME:"schedule"}});
 assert.equal(cli.status,0,cli.stderr);
 const receipt=JSON.parse(readFileSync(outfile,"utf8"));
 assert.equal(receipt.physicalAllowed,false);
 assert.deepEqual(receipt.reasonCodes,["SOURCE_ACCOUNT_SYSTEM1_V8_PROTECTION_QUARANTINE"]);
 assert.equal(receipt.cloudflareCallsThisGate,0);
 assert.equal(receipt.d1SqlCallsThisGate,0);
 const bad=spawnSync(process.execPath,[script],{encoding:"utf8",timeout:15000,
 env:{PATH:process.env.PATH||"",HOME:process.env.HOME||"",
 SYSTEM2_D1_WRITER_ID:"DAILY_SHADOW_DIAGNOSTIC",
 SYSTEM2_D1_ACCOUNT_ROLE:"DESTINATION",
 SYSTEM2_GITHUB_ENVIRONMENT:"system2-research",
 GITHUB_EVENT_NAME:"schedule",
 SYSTEM2_D1_GATE_OUTPUT:outfile}});
 assert.equal(bad.status,1);
 assert.match(bad.stderr,/S2_DEST_ROUTE_ENVIRONMENT_MISMATCH/);
}finally{rmSync(tmp,{recursive:true,force:true});}
console.log("S2_P0_20261012_DESTINATION_ROUTE_GUARD_AND_LEGACY_SOURCE_NEGATIVE_PASS");

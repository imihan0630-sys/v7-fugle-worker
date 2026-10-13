import assert from "node:assert/strict";
import {validateEphemeralCleanupIdentity} from "../ops/v8_exact_run_temp_kv_cleanup_v0_1.mjs";
const account="a".repeat(32);
const valid=validateEphemeralCleanupIdentity({accountId:account,runId:"38318893727"});
assert.equal(valid.script,"v8-ro-kv-38318893727");
assert.equal(valid.account,account);
assert.ok(Object.isFrozen(valid));
for(const x of ["","fugle-test","v8-ro-kv-38318893727","../../fugle-test","00001","38;rm -rf /","0","-42"]){
 assert.throws(()=>validateEphemeralCleanupIdentity({accountId:account,runId:x}),/EXACT_GITHUB_RUN_ID_INVALID/);
}
for(const a of ["","SOURCE_ACCOUNT","../"+account,"a".repeat(31)]){
 assert.throws(()=>validateEphemeralCleanupIdentity({accountId:a,runId:"38318893727"}),/SOURCE_ACCOUNT_ID_INVALID/);
}
assert.notEqual(valid.script,"fugle-test");
console.log(JSON.stringify({pass:true,tests:"exact-run scope guard + unsafe input rejection",scope:"temporary read-only worker only",doesNotCallCloudflare:true}));

// Runs offline Python fixture tests in System2 Research CI. No Cloudflare/network.
import {spawnSync} from "node:child_process";
const p=spawnSync("python3",["system2/migration/test_issue1068_sqlite_offline_integrity_v0_1.py"],
 {stdio:"inherit",cwd:process.cwd(),timeout:120000});
if(p.error)throw p.error;
if(p.status!==0)throw Error("ISSUE1068_SQLITE_OFFLINE_INTEGRITY_TEST_FAILED");
console.log("ISSUE1068_SQLITE_OFFLINE_INTEGRITY_FIXTURES_PASS_NOT_PHYSICAL_SOURCE_ACCEPTANCE");

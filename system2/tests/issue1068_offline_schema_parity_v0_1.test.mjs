// Purely offline Python SQLite source-target structural compatibility tests.
import {spawnSync} from "node:child_process";
const p=spawnSync("python3",["system2/migration/test_issue1068_offline_schema_parity_v0_1.py"],
 {stdio:"inherit",cwd:process.cwd(),timeout:120000});
if(p.error)throw p.error;
if(p.status!==0)throw Error("ISSUE1068_SOURCE_TARGET_OFFLINE_SCHEMA_PARITY_TESTS_FAILED");
console.log("ISSUE1068_OFFLINE_SCHEMA_PARITY_12_FIXTURES_PASS_NOT_REAL_CLOUD_MIGRATION");

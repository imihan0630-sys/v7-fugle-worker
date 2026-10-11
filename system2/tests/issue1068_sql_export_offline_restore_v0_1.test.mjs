// Issue1068 offline SQL replay regression; isolated Python fixtures, no network.
import {spawnSync} from "node:child_process";
const p=spawnSync("python3",["system2/migration/test_issue1068_sql_export_offline_restore_v0_1.py"],
 {stdio:"inherit",cwd:process.cwd(),timeout:120000});
if(p.error)throw p.error;
if(p.status!==0)throw Error("ISSUE1068_SQL_EXPORT_OFFLINE_RESTORE_REGRESSION_FAILED");
console.log("ISSUE1068_SOURCE_SQL_LOCAL_RESTORE_TESTS_PASS_NO_PHYSICAL_CLOUDFLARE_IO");

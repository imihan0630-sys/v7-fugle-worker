// Issue #1068 DATA_LANE offline blocker inventory. No credentials, Cloudflare,
// network, SQL, R2 or state-changing work. No payloads or secrets printed.
import {readFileSync} from "node:fs";
import {assessIssue1068SourceIntegrityOfflineV0_1 as assess}
 from "./issue1068_source_pit_frozen_restore_offline_v0_1.mjs";
const policy=JSON.parse(readFileSync(
 "system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json","utf8"));
let supplied={};
if(process.argv.length>3)throw Error("ONLY_ONE_OPTIONAL_LOCAL_EVIDENCE_JSON");
if(process.argv[2]){
 const p=process.argv[2];
 if(!/^system2\/[a-zA-Z0-9_./-]+\.json$/.test(p)||p.includes(".."))
  throw Error("UNTRUSTED_EVIDENCE_FILE_PATH");
 supplied=JSON.parse(readFileSync(p,"utf8"));
}
const out=assess({reservePolicy:policy,...supplied,reservePolicy:policy});
console.log(JSON.stringify(out,null,2));
if(out.state==="READ_ONLY_D1_BUDGET_EVIDENCE_DEFER"||out.blockers.length)
 process.exitCode=2;

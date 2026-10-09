// Rehydrate the existing source-only 11,843-key GitHub artifact.
// No source refetch, D1/R2 SQL, DB adapter or quota reservation.
import {readFile,writeFile} from "node:fs/promises";
import {auditIssue1026P05RealArchivedManifestV0_1} from "../runtime/issue1026_p05_archived_manifest_independent_audit_v0_1.mjs";
import assert from "node:assert/strict";
const p=process.env.S2_ISSUE1026_P05_ARCHIVED_SOURCE_MANIFEST_PATH;
const out=process.env.S2_ISSUE1026_P05_AUDIT_OUTPUT||
 "/tmp/s2-issue1026-p05-independent-artifact-key-audit.json";
let report={schemaVersion:"S2_ISSUE1026_P05_ARCHIVE_AUDIT_BLOCKED_V0_1",
 result:"BLOCKED_ARCHIVED_SOURCE_MANIFEST_NOT_VERIFIED",
 physicalD1MissingKeys:"UNKNOWN",permissionToWrite:false,
 d1SqlReadsByAudit:0,d1SqlWritesByAudit:0,r2CallsByAudit:0};
try{
 assert.ok(typeof p==="string"&&p.startsWith("/tmp/"),
  "MISSING_LOCAL_ARCHIVE_MANIFEST_PATH");
 const [manifest,acceptance]=await Promise.all([
  readFile(p,"utf8").then(JSON.parse),
  readFile(new URL("../evidence/S2_ISSUE1026_P05_FULL_11843_OFFICIAL_SOURCE_KEYS_REAL_ACCEPTANCE_20261009_V0_1.json",import.meta.url),"utf8").then(JSON.parse),
 ]);
 report=auditIssue1026P05RealArchivedManifestV0_1({
  manifest,acceptance,observedAt:new Date().toISOString()});
}catch(e){
 report={...report,error:String(e?.message||e).slice(0,550)};
 process.exitCode=1;
}
await writeFile(out,JSON.stringify(report,null,2)+"\n","utf8");
console.log("S2_ISSUE1026_P05_ARCHIVE_AUDIT "+JSON.stringify({
 result:report.result,sourceKeys:report.sourceKeysIndependentlyValidated??0,
 retrospectiveOnly:report.retrospectiveOnlyKeys??0,physicalD1MissingKeys:"UNKNOWN",
 originalPITReplayAuthorized:false,d1SqlQueries:0,d1Writes:0,r2Calls:0}));

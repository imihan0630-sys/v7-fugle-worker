// Issue 1026 P03/P05 read-only checkpoint evidence. This does not call Cloudflare.
import {readFile,writeFile} from "node:fs/promises";
import {assessIssue1026P03P05SafeEvidenceV0_1} from "../runtime/issue1026_p03_p05_safe_evidence_review_v0_1.mjs";
const rel=p=>new URL("../"+p,import.meta.url);
const load=async p=>JSON.parse(await readFile(rel(p),"utf8"));
const out=process.env.S2_ISSUE1026_SAFE_EVIDENCE_OUTPUT
 ||"/tmp/s2-issue1026-p03-p05-safe-defer-evidence.json";
let record;
try{
 record=assessIssue1026P03P05SafeEvidenceV0_1({
  gapInventory:await load("system2/evidence/S2_CORR003_P01_P05_PHYSICAL_EVIDENCE_GAP_INVENTORY_20261009_V0_1.json"),
  closureGate:await load("system2/evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json"),
  system1ReservePolicy:await load("system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json"),
  octSourceAcceptance:await load("system2/evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json"),
  accountUsageEvidence:await load("system2/evidence/S2_OCT09_ACCOUNT_D1_GRAPHQL_READONLY_PHYSICAL_USAGE_ACCEPTANCE_20261009_V0_1.json"),
  quotaDeferEvidence:await load("system2/evidence/S2_OCT09_HOT_HISTORY_QUOTA_DEFER_PHYSICAL_RECEIPT_20261009_V0_1.json"),
  now:new Date().toISOString()
 });
}catch(error){
 record={schemaVersion:"S2_ISSUE1026_P03_P05_OFFLINE_REVIEW_BLOCKED_V0_1",
  state:"SOURCE_EVIDENCE_MISSING_OR_CHANGED_FAIL_CLOSED",
  reason:String(error?.message||error).slice(0,500),
  observedAt:new Date().toISOString(),physicalD1SelectAuthorizedByAssessment:false,
  physicalD1MutationAuthorizedByAssessment:false,
  physicalD1SqlReadsPerformed:0,physicalD1SqlWritesPerformed:0,cloudflareR2CallsPerformed:0};
 process.exitCode=1;
}
await writeFile(out,JSON.stringify(record,null,2)+"\n","utf8");
console.log("S2_ISSUE1026_P03_P05_EVIDENCE_ONLY "+JSON.stringify({
 state:record.state,p03Checks:record.p03?.documentedEvidenceChecks??null,
 p05Checks:record.p05?.documentedEvidenceChecks??null,
 d1ScoutExecuted:record.p05?.d1ScoutExecuted??null,
 physicalD1SelectAuthorized:false,physicalD1WriteAuthorized:false
}));

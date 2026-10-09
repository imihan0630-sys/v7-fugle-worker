// Issue #1026 DATA_LANE. Execute REAL offline P03 validation and REAL
// operational P05 CLI fail-closed gates; never create Cloudflare adapter.
// NO synthetic data/attestation. This is negative acceptance, NOT D1 coverage.
import assert from "node:assert/strict";
import {readFile,writeFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {validateIssue1026P03DeferMatrixV0_1}
 from "../runtime/issue1026_p03_cross_writer_defer_validate_v0_1.mjs";

const root=resolve(import.meta.dirname,"../..");
const load=async p=>JSON.parse(await readFile(resolve(root,p),"utf8"));
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const output=process.env.S2_ISSUE1026_OFFLINE_FAILCLOSED_OUTPUT||
 "/tmp/s2-issue1026-p03p05-offline-negative-acceptance.json";
// Remove all credentials explicitly even if caller's ambient environment differs.
const env={...process.env};
for(const name of Object.keys(env)){
 if(/TOKEN|SECRET|CLOUDFLARE|WRANGLER|S2_OCT08_|S2_NO_COMPETING|D1_DATABASE/i.test(name))
  delete env[name];
}
const p05RepairOut="/tmp/s2-issue1026-repair-missing-census-blocked.json";
const p05ScoutOut="/tmp/s2-issue1026-d1-36-budget-blocked.json";
const p05CensusOut="/tmp/s2-issue1026-d1-11843-budget-blocked.json";
const invoke=(source,args,extras)=>{
 const child=spawnSync(process.execPath,[resolve(root,source),...args],{
  cwd:root,env:{...env,...extras},encoding:"utf8",timeout:20000,maxBuffer:2**20,
 });
 assert.equal(child.error,undefined,"offline subprocess execution error");
 assert.notEqual(child.status,0,"guard unexpectedly authorized physical D1");
 assert.doesNotMatch(child.stdout,/D1_ACCOUNT_BUDGET_QUALIFIED|S2_OCT08_MISSING_KEY_PLAN_SUMMARY/,
  "offline-only guard produced unexpected ready receipt");
 return Object.freeze({exitStatus:child.status,stderr:child.stderr.slice(0,350),
  outputMarker:child.stdout.slice(-900)});
};
let report={schemaVersion:"S2_ISSUE1026_P03_P05_REAL_OFFLINE_NO_D1_GUARD_V0_1",
 result:"FAIL_CLOSED_UNVERIFIED",issue:1026,
 observedAt:new Date().toISOString(),physicalD1SQLQueries:0,
 physicalD1Mutations:0,cloudflareR2Calls:0,
 physicalMissingKeys:"UNKNOWN",hotD1ScoutQueries:0,hotD1CensusQueries:0};
try{
 const [matrix,registry,system1Producer,reservePolicy,p03P05Metadata,physicalClosure]
  =await Promise.all([
   load("system2/evidence/S2_ISSUE1026_P03_REAL_MULTIWRITER_QUOTA_DEFER_MATRIX_20261009_V0_1.json"),
   load("system2/config/d1_account_writer_registry_v0_1.json"),
   load("research/SYSTEM1_ISSUE1024_P01_P02_P04_REAL_GITHUB_D1_PRODUCER_EVIDENCE_20261009_V0_1.json"),
   load("system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json"),
   load("system2/evidence/S2_ISSUE1026_P03_P05_ACCOUNT_GRAPHQL_NONAUTHORIZING_REAL_RUN_20261009_V0_1.json"),
   load("system2/evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json"),
  ]);
 const p03=validateIssue1026P03DeferMatrixV0_1({
  matrix,registry,system1Producer,reservePolicy,p03P05Metadata,physicalClosure,
 });
 assert.equal(p03.p03PhysicalAcceptance,false);
 const repairCli=invoke("system2/scripts/build_oct08_missing_key_repair_dryrun_offline_v0_1.mjs",[],{
  S2_OCT08_REPAIR_DRYRUN_OUTPUT:p05RepairOut,
 });
 const scoutCli=invoke("system2/scripts/qualify_oct08_readonly_d1_account_budget_v0_1.mjs",["SAMPLE_36"],{
  S2_OCT08_BUDGET_GATE_RESULT:p05ScoutOut,
 });
 const censusCli=invoke("system2/scripts/qualify_oct08_readonly_d1_account_budget_v0_1.mjs",["FULL_11843"],{
  S2_OCT08_BUDGET_GATE_RESULT:p05CensusOut,
 });
 const [repair,scout,census]=await Promise.all([
  loadOutput(p05RepairOut),loadOutput(p05ScoutOut),loadOutput(p05CensusOut),
 ]);
 assert.equal(repair.result,"BLOCKED_INCOMPLETE_OR_UNTRUSTED_PHYSICAL_CENSUS_NO_REPAIR_PLAN");
 assert.equal(repair.missingPhysicalCensusCannotBeInvented,true);
 assert.equal(repair.permissionToWrite,false);
 assert.equal(repair.d1ReadRequests,0);
 assert.equal(repair.d1Writes,0);
 for(const [mode,rec] of [["SAMPLE_36",scout],["FULL_11843",census]]){
  assert.equal(rec.mode,mode);
  assert.equal(rec.state,"READ_ONLY_D1_BUDGET_EVIDENCE_DEFER");
  assert.equal(rec.reason,"OCT08_READ_BUDGET_EVIDENCE_REQUIRED_MAIN_TRACKED_JSON");
  assert.equal(rec.actualD1QueriesExecuted,0);
  assert.equal(rec.physicalReadAuthorized,false);
  assert.equal(rec.physicalWriteAuthorized,false);
 }
 report={...report,result:"PASS_P03_REAL_NEGATIVE_MATRIX_AND_P05_BOTH_GATES_FAIL_CLOSED",
  runId:Number(process.env.GITHUB_RUN_ID)||null,
  accountQuotaDayUTC:new Date().toISOString().slice(0,10),
  p03:{...p03,qualifiedPhysicalAcceptances:0},
  p05:{sourceOnlyOfficialKeyCount:11843,officialSourceEvidenceSource:
   "system2/evidence/S2_ISSUE1026_P05_FULL_11843_OFFICIAL_SOURCE_KEYS_REAL_ACCEPTANCE_20261009_V0_1.json",
   scout:{...scout,exit:scoutCli.exitStatus},
   census:{...census,exit:censusCli.exitStatus},
   missingOnlyRepair:{...repair,exit:repairCli.exitStatus}},
  accountReadReserveAuthorized:false,accountWriteReserveAuthorized:false,
  quotaGrantCreated:false,physicalD1ReadAuthorized:false,
  physicalD1WriteAuthorized:false,allPartialOrFailReceiptsAreNotLedgerGrants:true,
  evidenceDigest:hash([matrix.observedRuns.map(x=>[x.runId,x.gateState]),
   scout.state,census.state,repair.result]),
 };
}catch(error){
 report={...report,result:"BLOCKED_ORIGINAL_EVIDENCE_OR_FAIL_CLOSED_GUARD_CHANGED",
  reason:String(error?.message||error).slice(0,600)};
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(report,null,2)+"\n");
console.log("S2_ISSUE1026_OFFLINE_P03_P05_GUARDS "+JSON.stringify({
 result:report.result,p03RealWriterGateRuns:report.p03?.observedRealGateRuns??null,
 scoutBudgetState:report.p05?.scout?.state??null,
 fullCensusBudgetState:report.p05?.census?.state??null,
 repairState:report.p05?.missingOnlyRepair?.result??null,
 d1SQL:0,r2:0,
}));
async function loadOutput(path){return JSON.parse(await readFile(path,"utf8"));}

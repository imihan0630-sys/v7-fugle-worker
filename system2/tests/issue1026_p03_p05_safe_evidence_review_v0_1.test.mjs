import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {assessIssue1026P03P05SafeEvidenceV0_1 as assess}
 from "../runtime/issue1026_p03_p05_safe_evidence_review_v0_1.mjs";
const load=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const gapInventory=await load("evidence/S2_CORR003_P01_P05_PHYSICAL_EVIDENCE_GAP_INVENTORY_20261009_V0_1.json");
const closureGate=await load("evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json");
const system1ReservePolicy=await load("evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json");
const octSourceAcceptance=await load("evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json");
const accountUsageEvidence=await load("evidence/S2_OCT09_ACCOUNT_D1_GRAPHQL_READONLY_PHYSICAL_USAGE_ACCEPTANCE_20261009_V0_1.json");
const quotaDeferEvidence=await load("evidence/S2_OCT09_HOT_HISTORY_QUOTA_DEFER_PHYSICAL_RECEIPT_20261009_V0_1.json");
const base={gapInventory,closureGate,system1ReservePolicy,
 octSourceAcceptance,accountUsageEvidence,quotaDeferEvidence,
 now:"2026-10-09T13:00:00.000Z"};
const ok=assess(base);
assert.equal(ok.state,"P03_P05_PHYSICAL_ACCEPTANCE_DEFER");
assert.deepEqual([ok.p03.documentedEvidenceChecks,ok.p03.totalChecks],[3,8]);
assert.deepEqual([ok.p05.documentedEvidenceChecks,ok.p05.totalChecks],[4,9]);
assert.equal(ok.p05.officialSourceStockDateKeys,11843);
assert.equal(ok.p05.d1ScoutExecuted,0);
assert.equal(ok.p05.d1CensusExecuted,0);
assert.equal(ok.p05.physicalMissingKeys,"UNKNOWN");
assert.equal(ok.reserves.system1ReadAuthorized,false);
assert.equal(ok.reserves.system1WriteAuthorized,false);
assert.equal(ok.physicalD1SelectAuthorizedByAssessment,false);
assert.equal(ok.physicalD1MutationAuthorizedByAssessment,false);
assert.equal(ok.quotaReservationGrantedByAssessment,false);
assert.equal(ok.physicalD1SqlReadsPerformed,0);
assert.equal(ok.physicalD1SqlWritesPerformed,0);
// A next-day old lower-bound or an optimistic frontend checkbox never grants.
const later=assess({...base,now:"2026-10-10T03:00:00.000Z"});
assert.equal(later.priorAccountObservation.sameUtcDayAsAssessment,false);
assert.equal(later.physicalD1SelectAuthorizedByAssessment,false);
const forgedPolicy={...system1ReservePolicy,reserveNumberAuthorized:true,
 authorizedReserveRows:2825,readReserveNumberAuthorized:true,
 authorizedReadReserveRows:1};
const forged=assess({...base,system1ReservePolicy:forgedPolicy});
assert.equal(forged.physicalD1SelectAuthorizedByAssessment,false);
assert.equal(forged.physicalD1MutationAuthorizedByAssessment,false);
for(const [key,mutation] of [
 ["wrong directive",{gapInventory:{...gapInventory,directiveId:"MISMATCH"}}],
 ["source row count",{octSourceAcceptance:{...octSourceAcceptance,
  officialWindow:{...octSourceAcceptance.officialWindow,byMarket:{
   ...octSourceAcceptance.officialWindow.byMarket,TPEX:{ordinarySymbolSourceRows:5300}}}}}],
 ["missing real defer",{quotaDeferEvidence:{...quotaDeferEvidence,
  accountQuotaReceipt:{...quotaDeferEvidence.accountQuotaReceipt,state:"QUOTA_RESERVATION_GRANTED"}}}],
 ["false real D1 SQL",{accountUsageEvidence:{...accountUsageEvidence,
  physicalImpact:{...accountUsageEvidence.physicalImpact,cloudflareD1SqlQueriesExecutedByMetadataObserver:1}}}],
 ["missing 36 physical",{gapInventory:{...gapInventory,workPackages:gapInventory.workPackages.map(x=>
  x.id==="P05_ORIGINAL_PHYSICAL_CRITERIA"?{...x,physicalD1ScoutExecuted:36}:x)}}],
 ["false closure",{closureGate:{...closureGate,closureState:"VERIFIED_CLOSED"}}],
 ]){
 await assert.rejects(async()=>assess({...base,...mutation}),undefined,key);
}
const wf=await readFile(new URL(
 "../../.github/workflows/system2-issue1026-p03-p05-safe-metadata-evidence.yml",import.meta.url),"utf8");
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/push:[\s\S]*paths:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.match(wf,/audit_oct08_account_d1_metadata_only_v0_1\.mjs/);
assert.doesNotMatch(wf,/wrangler.*(deploy|d1)|INSERT INTO|UPDATE .+ SET|DELETE FROM/i);
// Integration: verify actual CLI path resolution, not only imported pure functions.
const cliPath=new URL("../scripts/assess_issue1026_p03_p05_safe_evidence_v0_1.mjs",import.meta.url);
const output="/tmp/s2-issue1026-offline-script-acceptance.json";
const cli=spawnSync(process.execPath,[cliPath.pathname],{
 encoding:"utf8",timeout:15000,
 env:{...process.env,S2_ISSUE1026_SAFE_EVIDENCE_OUTPUT:output},
});
assert.equal(cli.status,0,cli.stderr+"\n"+cli.stdout);
assert.match(cli.stdout,/S2_ISSUE1026_P03_P05_EVIDENCE_ONLY/);
const cliEvidence=JSON.parse(await readFile(output,"utf8"));
assert.equal(cliEvidence.state,"P03_P05_PHYSICAL_ACCEPTANCE_DEFER");
assert.equal(cliEvidence.physicalD1SelectAuthorizedByAssessment,false);
assert.equal(cliEvidence.physicalD1MutationAuthorizedByAssessment,false);
assert.equal(cliEvidence.p05.physicalMissingKeys,"UNKNOWN");
assert.equal(cliEvidence.physicalD1SqlReadsPerformed,0);
assert.equal(cliEvidence.physicalD1SqlWritesPerformed,0);

console.log("S2_ISSUE1026_P03_P05_OFFLINE_2_BASELINES_8_FALSIFICATION_RULES_PASS");

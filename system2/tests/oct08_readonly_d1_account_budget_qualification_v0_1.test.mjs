import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {qualifyOct08D1ReadonlyBudgetV0_1 as qualify} from "../runtime/oct08_readonly_d1_account_budget_qualification_v0_1.mjs";

const clock="2026-10-09T10:45:00Z";
const registry=JSON.parse(await readFile(new URL("../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const realPolicy=JSON.parse(await readFile(new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
assert.equal(realPolicy.readReserveNumberAuthorized,false);
assert.equal(realPolicy.authorizedReadReserveRows,null);
const fakePolicy={...realPolicy,readReserveNumberAuthorized:true,authorizedReadReserveRows:200000};
function fakeAttestation(mode="SAMPLE_36"){
 const full=mode==="FULL_11843";
 return {
  schemaVersion:"S2_OCT08_READONLY_ACCOUNT_BUDGET_ATTESTATION_V0_1",
  directiveId:"S2-CORR-20261007-003",
  approvalLane:"REMEDIATION_LANE",
  independentEvidenceReviewed:true,
  workflow:full?".github/workflows/system2-oct08-full-source-hot-d1-census-manual.yml":".github/workflows/system2-oct08-hot-d1-source-matched-manual-readonly.yml",
  writerId:full?"OCT08_FULL_SOURCE_HOT_D1_CENSUS":"OCT08_SOURCE_MATCHED_READONLY",
  readOnlyQueryCeiling:full?150000:35000,
  accountScope:"CLOUDFLARE_WORKERS_FREE_ACCOUNT_WIDE",
  quotaDay:"2026-10-09",
  reviewedAt:"2026-10-09T10:41:00Z",
  accountUsage:{
   known:true,quotaDay:"2026-10-09",observedAt:"2026-10-09T10:40:00Z",
   source:"CLOUDFLARE_D1_GRAPHQL_ACCOUNT_ANALYTICS",
   usageSemantics:"ACCOUNT_DAILY_AGGREGATE_LOWER_BOUND",
   freshnessGuarantee:"NOT_DOCUMENTED_BY_VENDOR",
   evidenceRunUrl:"https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/99999999999",
   rowsRead:782497,
  },
  ledgerIntegrityState:"VALID",
  nonReleasingSameDayReservationsVerified:true,
  allCrossSystemWritersCoordinated:true,
  actualD1PhysicalWritesAuthorized:false,
  outstandingSameDayRowsRead:0,maxObservedAccountRowsRead:782497,
  system1ReadReserveRows:200000,
  unobservedReadUsageBound:100000,
  unobservedReadUsageBoundEvidenceQualified:true,
  unobservedReadUsageEvidenceUrl:"https://github.com/imihan0630-sys/v7-fugle-worker/pull/99999",
  independentReviewEvidenceUrl:"https://github.com/imihan0630-sys/v7-fugle-worker/pull/99999",
 };
}
function syntheticAcceptedScout(){
 const days=["2026-10-01","2026-10-02","2026-10-05",
  "2026-10-06","2026-10-07","2026-10-08"];
 const samples=days.flatMap(marketDate=>["TWSE","TPEX"].flatMap(market=>
  ["1000","1001","1002"].map(symbol=>({
   market,marketDate,symbol,
   state:"HOT_D1_RAW_BAR_MATCHED_AT_CURRENT_OBSERVATION",
   matchingRawCount:1,historicalFirstKnownAtCertified:false,
   d1AvailableAt:"2026-10-09T10:20:00Z",
   d1ObservedAt:"2026-10-09T10:20:00Z",
  }))));
 return{
  schemaVersion:"S2_OCT08_36_KEY_HOT_D1_PHYSICAL_SCOUT_INDEPENDENT_ACCEPTANCE_V0_1",
  issueNumber:1026,directiveId:"S2-CORR-20261007-003",
  physicalScope:"OCT08_HOT_D1_36_SOURCE_MATCHED_SAMPLES",
  sourceOnly:false,
  approval:{
   lane:"AUDIT_LANE",independentArtifactReviewed:true,
   decision:"ACCEPTED_36_OF_36_PHYSICAL_SOURCE_MATCHED_ONLY",
   reviewEvidenceUrl:"https://github.com/imihan0630-sys/v7-fugle-worker/pull/99999",
  },
  physicalRun:{
   id:999999999,jobId:999999998,event:"workflow_dispatch",
   workflow:".github/workflows/system2-oct08-hot-d1-source-matched-manual-readonly.yml",
   conclusion:"success",headSha:"a".repeat(40),
   runUrl:"https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/999999999",
   artifactId:999999997,artifactSha256:"f".repeat(64),
   completedAt:"2026-10-09T10:38:00Z",
  },
  scoutResult:{
   schemaVersion:"S2_OCT08_HOT_D1_SOURCE_MATCHED_SAMPLE_READONLY_V0_1",
   result:"PASS_36_OF_36_SAMPLED_HOT_D1_BARS_SOURCE_MATCHED_ONLY",
   latestMarketDate:"2026-10-08",sourceReceiptCount:12,
   sampleCount:36,matchedSamples:36,samples,
   observedD1Metrics:{requestCount:36,rowsRead:360,rowsWritten:0},
   d1RowsWritten:0,r2ObjectsWritten:0,system1RuntimeUsed:false,
   fullMarketD1CoverageCertified:false,historicalPITFirstKnownAtCertified:false,
  },
 };
}
// All below are SYNTHETIC OFFLINE counterexamples; canonical main has
// ZERO actual accepted Hot D1 Scout records and no authorized System1 reserve.
function execute(mode="SAMPLE_36",attestation=fakeAttestation(mode),policy=fakePolicy,opts={}){
 return qualify({mode,attestation,system1ReservePolicy:policy,
  writerRegistry:registry,now:clock,noCompetingWriterConfirmed:true,
  scoutAcceptance:syntheticAcceptedScout(),...opts});
}
for(const mode of ["SAMPLE_36","FULL_11843"]){
 const approved=execute(mode);
 assert.equal(approved.state,"READ_ONLY_D1_ACCOUNT_BUDGET_QUALIFIED");
 assert.equal(approved.physicalD1WriteAuthorized,false);
 assert.equal(approved.actualD1QueriesExecutedByPreflight,0);
 assert.equal(approved.readCeiling,mode==="SAMPLE_36"?35000:150000);
}
let counterexamples=0;
async function rejected(test,match){
 await assert.rejects(async()=>test(),new RegExp(match));
 counterexamples++;
}
await rejected(()=>execute("SAMPLE_36",fakeAttestation(),realPolicy),"SYSTEM1_READ_RESERVE_NOT_EVIDENCE_AUTHORIZED");
await rejected(()=>execute("SAMPLE_36",fakeAttestation(),fakePolicy,{noCompetingWriterConfirmed:false}),"no-competing-writer");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),quotaDay:"2026-10-08"}),"rollover");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),accountUsage:{...fakeAttestation().accountUsage,observedAt:"2026-10-09T10:31:00Z"}}),"stale");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),accountUsage:{...fakeAttestation().accountUsage,observedAt:"2026-10-09T10:46:00Z"}}),"future-dated");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),independentEvidenceReviewed:false}),"review");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),approvalLane:"DATA_LANE"}),"quota owner");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),unobservedReadUsageBoundEvidenceQualified:false}),"lag");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),unobservedReadUsageBound:null}),"integer");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),allCrossSystemWritersCoordinated:false}),"coordinated");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),ledgerIntegrityState:"UNKNOWN"}),"ledger");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),nonReleasingSameDayReservationsVerified:false}),"reservations");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),outstandingSameDayRowsRead:4900000}),"HEADROOM_NOT_PROVEN");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),maxObservedAccountRowsRead:4999999}),"HEADROOM_NOT_PROVEN");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),system1ReadReserveRows:0}),"disagree");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),accountUsage:{...fakeAttestation().accountUsage,known:false}}),"UNKNOWN");
await rejected(()=>execute("FULL_11843",fakeAttestation("SAMPLE_36")),"workflow");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),readOnlyQueryCeiling:0}),"read envelope");
await rejected(()=>execute("SAMPLE_36",{...fakeAttestation(),actualD1PhysicalWritesAuthorized:true}),"mutation");
await rejected(()=>execute("SAMPLE_36",fakeAttestation(),fakePolicy,{writerRegistry:{writers:[]}}),"not registered");

// FULL_11843 must reject even fully-shaped fake account reserve when physical
// 36-scout is absent, partial, missing two markets, reused, unreviewed, or
// falsely substituted with the SOURCE_ONLY 11843-key official manifest.
await rejected(()=>execute("FULL_11843",fakeAttestation("FULL_11843"),fakePolicy,
 {scoutAcceptance:null}),"PRIOR_SCOUT_INDEPENDENT_EVIDENCE_REQUIRED");
await rejected(()=>execute("FULL_11843",fakeAttestation("FULL_11843"),fakePolicy,
 {scoutAcceptance:{schemaVersion:"S2_ISSUE1026_P05_FULL_OCT08_11843_REAL_OFFICIAL_SOURCE_KEY_MANIFEST_ACCEPTANCE_20261009_V0_1"}}),
 "PRIOR_SCOUT_INDEPENDENT_EVIDENCE_REQUIRED");
for(const [name,mutate] of [
 ["unreviewed",x=>x.approval.independentArtifactReviewed=false],
 ["misattributed",x=>x.physicalRun.workflow=".github/workflows/something.yml"],
 ["manual required",x=>x.physicalRun.event="push"],
 ["future",x=>x.physicalRun.completedAt="2026-10-09T10:46:00Z"],
 ["partial",x=>{x.scoutResult.sampleCount=35;x.scoutResult.samples.pop();}],
 ["one key missing",x=>{x.scoutResult.matchedSamples=35;}],
 ["duplicate",x=>{x.scoutResult.samples[1]={...x.scoutResult.samples[0]};}],
 ["source sample unproven",x=>x.scoutResult.samples[0].state="HOT_D1_ROW_ABSENT"],
 ["one multi-version",x=>x.scoutResult.samples[0].matchingRawCount=2],
 ["missing cost",x=>x.scoutResult.observedD1Metrics.rowsRead=null],
 ["read exceeds guard",x=>x.scoutResult.observedD1Metrics.rowsRead=35001],
 ["fictitious positive write",x=>x.scoutResult.observedD1Metrics.rowsWritten=1],
 ["fraudulent full proof",x=>x.scoutResult.fullMarketD1CoverageCertified=true],
 ["PIT already certified",x=>x.scoutResult.historicalPITFirstKnownAtCertified=true],
 ["duplicate shell",x=>x.sourceOnly=true],
]){
 const x=syntheticAcceptedScout();
 mutate(x);
 await rejected(()=>execute("FULL_11843",fakeAttestation("FULL_11843"),fakePolicy,
  {scoutAcceptance:x}),"");
}

for(const path of [
 "audit_oct08_hot_d1_source_matched_sample_readonly_v0_1.mjs",
 "audit_oct08_full_source_to_hot_d1_census_readonly_v0_1.mjs",
]){
 const runner=await readFile(new URL("../scripts/"+path,import.meta.url),"utf8");
 assert.match(runner,/requireOct08ReadonlyBudgetQualificationV0_1/);
 assert.ok(runner.indexOf("requireOct08ReadonlyBudgetQualificationV0_1({")===-1);
 const ix=runner.indexOf("await requireOct08ReadonlyBudgetQualificationV0_1(");
 assert.ok(ix>=0&&ix<runner.indexOf("createRemoteD1RestAdapter("),
  "reader must qualify budget before remote D1 client creation");
}
for(const path of [
 ".github/workflows/system2-oct08-hot-d1-source-matched-manual-readonly.yml",
 ".github/workflows/system2-oct08-full-source-hot-d1-census-manual.yml",
]){
 const file=await readFile(new URL("../../"+path,import.meta.url),"utf8");
 assert.match(file,/qualify_oct08_readonly_d1_account_budget_v0_1\.mjs/);
 assert.match(file,/read_budget_evidence_path/);
 if(path.includes("full-source-hot-d1-census"))
  assert.match(file,/scout_acceptance_evidence_path/);
 assert.doesNotMatch(file,/^\s+push:|^\s+schedule:/m);
}
console.log("S2_OCT08_READ_ONLY_BUDGET_GATE_SYNTHETIC_PASS positiveModes=2 adversarialCases="+counterexamples+
 " currentCanonicalReserve=UNAUTHORIZED physicalQueries=0");


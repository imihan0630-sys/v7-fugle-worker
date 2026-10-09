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
function execute(mode="SAMPLE_36",attestation=fakeAttestation(mode),policy=fakePolicy,opts={}){
 return qualify({mode,attestation,system1ReservePolicy:policy,
  writerRegistry:registry,now:clock,noCompetingWriterConfirmed:true,...opts});
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
 assert.doesNotMatch(file,/^\s+push:|^\s+schedule:/m);
}
console.log("S2_OCT08_READ_ONLY_BUDGET_GATE_SYNTHETIC_PASS positiveModes=2 adversarialCases="+counterexamples+
 " currentCanonicalReserve=UNAUTHORIZED physicalQueries=0");


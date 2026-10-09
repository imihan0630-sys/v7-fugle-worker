// DATA_LANE / Class A: offline-only prerequisite for physical OCT08 D1 SELECT.
// Never substitute manual booleans or a cached GraphQL lower-bound for verified account headroom.
import assert from "node:assert/strict";
import {verifyIssue1026P05PriorPhysicalScoutV0_1}
 from "./issue1026_p05_prior_scout_physical_gate_v0_1.mjs";

const MODES=Object.freeze({
 SAMPLE_36:Object.freeze({workflow:".github/workflows/system2-oct08-hot-d1-source-matched-manual-readonly.yml",readCeiling:35000,writerId:"OCT08_SOURCE_MATCHED_READONLY"}),
 FULL_11843:Object.freeze({workflow:".github/workflows/system2-oct08-full-source-hot-d1-census-manual.yml",readCeiling:150000,writerId:"OCT08_FULL_SOURCE_HOT_D1_CENSUS"}),
});
const HARD_LIMIT=5000000;
const PROTECTED_DAILY_SHADOW_READ=583256;
function nonnegative(x,label,{strictlyPositive=false}={}){
 assert.ok(Number.isSafeInteger(x)&&x>=0&&(!strictlyPositive||x>0),label+" must be evidence-qualified integer");
 return x;
}
export function qualifyOct08D1ReadonlyBudgetV0_1({
 mode,attestation,system1ReservePolicy,writerRegistry,now,
 scoutAcceptance,
 noCompetingWriterConfirmed=false,
}={}){
 assert.ok(Object.hasOwn(MODES,mode),"unknown exact D1 read-only census profile");
 const profile=MODES[mode];
 // Acceptance sequencing is an independent hard gate: even a hypothetical
 // fully funded account must NEVER bypass the 36-key physical Scout.
 const scoutProof=mode==="FULL_11843"?
  verifyIssue1026P05PriorPhysicalScoutV0_1({scoutAcceptance,now}):null;
 assert.equal(noCompetingWriterConfirmed,true,"independent no-competing-writer acknowledgment required");
 assert.equal(attestation?.schemaVersion,"S2_OCT08_READONLY_ACCOUNT_BUDGET_ATTESTATION_V0_1");
 assert.equal(attestation?.directiveId,"S2-CORR-20261007-003");
 assert.equal(attestation?.approvalLane,"REMEDIATION_LANE","only quota owner certifies read headroom");
 assert.equal(attestation?.independentEvidenceReviewed,true,"independent evidence review missing");
 assert.equal(attestation?.workflow,profile.workflow,"attestation belongs to different census workflow");
 assert.equal(attestation?.writerId,profile.writerId,"read-only registered writer identity mismatch");
 assert.equal(attestation?.accountScope,"CLOUDFLARE_WORKERS_FREE_ACCOUNT_WIDE");
 assert.equal(attestation?.accountUsage?.known,true,"GraphQL account usage UNKNOWN");
 assert.equal(attestation?.accountUsage?.source,"CLOUDFLARE_D1_GRAPHQL_ACCOUNT_ANALYTICS");
 assert.equal(attestation?.accountUsage?.usageSemantics,"ACCOUNT_DAILY_AGGREGATE_LOWER_BOUND");
 assert.equal(attestation?.accountUsage?.freshnessGuarantee,"NOT_DOCUMENTED_BY_VENDOR");
 assert.equal(attestation?.ledgerIntegrityState,"VALID","shared quota ledger invalid or unknown");
 assert.equal(attestation?.nonReleasingSameDayReservationsVerified,true,"same-day reservations not proven");
 assert.equal(attestation?.allCrossSystemWritersCoordinated,true,"no proof of coordinated competing writers");
 assert.equal(attestation?.actualD1PhysicalWritesAuthorized,false,"read attestation cannot grant mutation");
 assert.equal(attestation?.readOnlyQueryCeiling,profile.readCeiling,"read envelope must match code hard limit");
 const row=(writerRegistry?.writers||[]).find(x=>x.id===profile.writerId);
 assert.ok(row&&row.workflow===profile.workflow&&row.priority==="READ_ONLY"&&
  row.physicalMutation===false&&row.reservationModel?.type==="NONE",
  "read-only writer not registered with exact workflow identity");

 const stamp=new Date(now||NaN),observed=new Date(attestation?.accountUsage?.observedAt);
 assert.ok(Number.isFinite(stamp.getTime()),"real current clock required");
 assert.ok(Number.isFinite(observed.getTime()),"account usage capture clock invalid");
 const day=stamp.toISOString().slice(0,10);
 assert.equal(attestation?.quotaDay,day,"quota day rollover requires new independent attestation");
 assert.equal(attestation?.accountUsage?.quotaDay,day,"account usage quota day mismatch");
 const age=stamp.getTime()-observed.getTime();
 assert.ok(age>=0&&age<=600000,"stale or future-dated account usage observation");
 assert.ok(new Date(attestation?.reviewedAt).getTime()>=observed.getTime()&&
  new Date(attestation.reviewedAt).getTime()<=stamp.getTime(),
  "review must follow usage observation and predate execution");
 assert.match(attestation?.accountUsage?.evidenceRunUrl||"",/^https:\/\/github\.com\/imihan0630-sys\/v7-fugle-worker\/actions\/runs\/[0-9]+$/,"real account analytics evidence run required");
 assert.match(attestation?.independentReviewEvidenceUrl||"",/^https:\/\/github\.com\/imihan0630-sys\/v7-fugle-worker\/(pull|actions\/runs)\/[0-9]+$/,"independent review evidence URL required");

 // The current canonical System1 reserve is unauthorized. Its observed 2,825
 // rowsWritten and UNKNOWN rowsRead may never be silently converted to reserve.
 assert.equal(system1ReservePolicy?.readReserveNumberAuthorized,true,
  "SYSTEM1_READ_RESERVE_NOT_EVIDENCE_AUTHORIZED");
 const s1Reserve=nonnegative(system1ReservePolicy?.authorizedReadReserveRows,
  "System1 authorized read reserve",{strictlyPositive:true});
 assert.equal(attestation?.system1ReadReserveRows,s1Reserve,
  "attestation and canonical System1 read reserve disagree");

 const observedReads=nonnegative(attestation.accountUsage.rowsRead,"account rowsRead");
 const ledgerOutstanding=nonnegative(attestation.outstandingSameDayRowsRead,
  "non-releasing ledger rowsRead");
 const observedMax=nonnegative(attestation.maxObservedAccountRowsRead,
  "max observed account rowsRead");
 const lagAllowance=nonnegative(attestation.unobservedReadUsageBound,
  "evidence-qualified GraphQL lag exposure");
 assert.equal(attestation?.unobservedReadUsageBoundEvidenceQualified,true,
  "GraphQL lag has no independently evidenced finite bound");
 assert.ok(typeof attestation?.unobservedReadUsageEvidenceUrl==="string"&&
  /^https:\/\/github\.com\/imihan0630-sys\/v7-fugle-worker\/(pull|actions\/runs)\/[0-9]+$/.test(attestation.unobservedReadUsageEvidenceUrl),
  "GraphQL lag reserve evidence missing");
 assert.ok(observedMax>=observedReads,"max prior observed reads below current GraphQL observation");
 const budgeted=Math.max(observedReads,observedMax)+ledgerOutstanding+
  s1Reserve+PROTECTED_DAILY_SHADOW_READ+lagAllowance+profile.readCeiling;
 assert.ok(Number.isSafeInteger(budgeted),"read total overflow");
 assert.ok(budgeted<=HARD_LIMIT,"READONLY_ACCOUNT_ROWS_READ_HEADROOM_NOT_PROVEN");
 return Object.freeze({
  state:"READ_ONLY_D1_ACCOUNT_BUDGET_QUALIFIED",
  quotaDay:day,mode,readCeiling:profile.readCeiling,
  conservativeProjectedRowsRead:budgeted,accountHardLimit:HARD_LIMIT,
  actualD1QueriesExecutedByPreflight:0,d1RowsWrittenByPreflight:0,
  previouslyAcceptedScoutRunId:scoutProof?.sourceRunId??null,
  previousScoutRowsReadObserved:scoutProof?.rowsReadObserved??null,
  physicalD1WriteAuthorized:false,originalHistoricalPITProven:false,
 });
}

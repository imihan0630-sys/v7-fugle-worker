// CORR-003 P04 additive cross-store lineage *preflight*, read-only / offline.
// Accepts caller-shaped evidence only. Never authenticates remote KV/D1,
// authorizes a reserve, dispatches a scan, or claims physical acceptance.
import { inspectS1Issue1024PhysicalEvidenceV0_1 as inspectBase }
  from "./system1_issue1024_physical_evidence_attribution_gate_v0_1.mjs";

export const S1_ISSUE1024_CROSS_STORE_SCHEMA =
  "S1_ISSUE1024_CROSS_STORE_GENERATION_JOIN_V0_1";
const roles=Object.freeze({
  config:"STOCKS_KV",plan:"STOCKS_KV",dailyReport:"STOCKS_KV",
  cron:"V7_DB",lease:"V7_DB",formalC1:"V7_DB"
});
const hash40=v=>typeof v==="string" && /^[0-9a-f]{40}$/.test(v);
const hash64=v=>typeof v==="string" && /^[0-9a-f]{64}$/.test(v);
const positive=v=>Number.isSafeInteger(v) && v>0;
const validSource=s=>!!s && positive(s.runId) && positive(s.jobId) &&
  positive(s.artifactId) && hash40(s.headSha) && hash64(s.artifactSha256);
const isoUTC=s=>typeof s==="string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s) &&
  Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s.slice(0,10);
const key=r=>r?.source?.runId+":"+r?.source?.jobId+":"+r?.source?.artifactId;
const arrayUnique=x=>Object.freeze([...new Set(x)]);

export function inspectS1Issue1024CrossStoreLineageV0_1(input) {
  const base=inspectBase(input);
  const date=base.date, e=input.execution||{}, x=input.crossStoreReadbacks||{};
  const errs=[];
  const todayEvidenceOnly=input.evidenceCutoffUtc;
  if(!isoUTC(todayEvidenceOnly)) errs.push("EVIDENCE_CUTOFF_UTC_NOT_SOURCE_VERIFIED");
  const p=e.primary||{}, source=p.source||{};
  if(!validSource(source)) errs.push("PRIMARY_SOURCE_ARTIFACT_SHA256_MISSING");
  if(!isoUTC(p.scheduledAtUtc) || p.scheduledAtUtc.slice(0,16)!==date+"T15:35")
    errs.push("PRIMARY_NATURAL_SCHEDULE_CLOCK_UNPROVEN");
  if(p.event!=="NATURAL_CRON" || p.skipped===true || p.businessResult!=="SUCCESS")
    errs.push("PRIMARY_SUCCESS_NOT_WITNESSED");
  if(!hash64(input.sourceBundleSha256)) errs.push("SOURCE_BUNDLE_HASH_MISSING");
  if(typeof input.generationId!=="string" || input.generationId.length<8)
    errs.push("AUTHORITATIVE_GENERATION_ID_MISSING");

  const actual=[];
  for(const [role,store] of Object.entries(roles)){
    const r=x[role];
    if(!r){
      errs.push("MISSING_READBACK:"+role);continue;
    }
    if(r.store!==store) errs.push("WRONG_PHYSICAL_STORE:"+role);
    if(r.marketDate!==date) errs.push("MIXED_TRADING_DATE:"+role);
    if(!input.generationId || r.generationId!==input.generationId)
      errs.push("MIXED_BUSINESS_GENERATION:"+role);
    if(r.sourceBundleSha256!==input.sourceBundleSha256 || !hash64(r.sourceBundleSha256))
      errs.push("MIXED_OR_UNKNOWN_SOURCE_BUNDLE:"+role);
    if(r.readbackVerified!==true || !validSource(r.source))
      errs.push("UNQUALIFIED_ARTIFACT_PROVENANCE:"+role);
    if(!isoUTC(r.observedAtUtc) ||
       isoUTC(p.scheduledAtUtc) && Date.parse(r.observedAtUtc)<Date.parse(p.scheduledAtUtc) ||
       isoUTC(todayEvidenceOnly) && isoUTC(r.observedAtUtc) && Date.parse(r.observedAtUtc)>Date.parse(todayEvidenceOnly))
      errs.push("IMPOSSIBLE_OR_UNVERIFIED_OBSERVATION_CLOCK:"+role);
    actual.push(r);
  }

  // Same-generation readbacks must be independently sourced, but not
  // necessarily from different runs: one read-only collector can capture all.
  const rec=e.recovery||{};
  if(rec.state==="EXECUTED"){
    if(!validSource(rec.source) || !isoUTC(rec.scheduledAtUtc) ||
       rec.scheduledAtUtc.slice(0,16)!==date+"T15:55")
      errs.push("RECOVERY_EXECUTION_SOURCE_OR_CLOCK_MISSING");
    if(rec.businessResult==="SUCCESS" && p.businessResult==="SUCCESS")
      errs.push("DUPLICATE_SUCCESSFUL_BUSINESS_EXECUTION");
    if(!x.recovery || x.recovery.generationId!==input.generationId ||
       !validSource(x.recovery.source))
      errs.push("RECOVERY_GENERATION_OR_ARTIFACT_UNVERIFIED");
  }else if(rec.state==="NOT_INVOKED_PROVEN"){
    if(rec.absenceWindowReadbackVerified!==true || !validSource(rec.source) ||
       !isoUTC(rec.windowEndUtc) || rec.windowEndUtc.slice(0,10)!==date ||
       Date.parse(rec.windowEndUtc)<Date.parse(date+"T15:55:00Z"))
      errs.push("RECOVERY_NONINVOCATION_WINDOW_UNVERIFIED");
  }else errs.push("RECOVERY_STATE_UNKNOWN");

  // A different UTC quota-day observation never substitutes for the actual
  // business-run day. Metadata lower bounds cannot prove no collision.
  if(input.account?.utcQuotaDay!==date ||
     input.account?.sameDayAllWriterUsageReconciled!==true ||
     input.account?.quotaCollisionObserved!==false ||
     input.account?.graphqlLagAssessed!==true)
    errs.push("ACCOUNT_DAY_QUOTA_NO_COLLISION_UNVERIFIED");
  if(!validSource(input.account?.source))
    errs.push("ACCOUNT_USAGE_ARTIFACT_UNQUALIFIED");
  if(!actual.length || new Set(actual.map(r=>r.generationId)).size!==1)
    errs.push("NO_SINGLE_BUSINESS_GENERATION_PROVEN");

  // This function is a deterministic structural validator ONLY. Even
  // structurally complete data could be forged by a caller. Separate audit
  // of raw physical records, deployed source, and quota authorization required.
  const missing=arrayUnique(errs);
  const result={
    schemaVersion:S1_ISSUE1024_CROSS_STORE_SCHEMA,marketDate:date,
    evidenceKind:"OFFLINE_CALLER_INPUT_NOT_REMOTE_AUTHENTICATION",
    sourceRunArtifactKey:validSource(source)?key({source}):null,
    readbacksExamined:actual.length,readbackRolesRequired:Object.keys(roles).length,
    crossStoreJoinState:missing.length===0 ?
      "STRUCTURAL_ONLY_UNTRUSTED_PENDING_RAW_PHYSICAL_AUDIT" :
      "BLOCKED_UNVERIFIED_CROSS_STORE_LINEAGE",
    missing,
    upstreamP01:base.p01.state,upstreamP02:base.p02.state,
    upstreamP04:base.p04.state,
    exactPerRunWrites:base.actualOperationCostKnown.primaryRowsWritten,
    exactPerRunReads:base.actualOperationCostKnown.primaryRowsRead,
    wholeDayNotPerRun:base.wholeDayV7DbObservedOnly.neverEquivalentToPerRunCost,
    independentPhysicalAcceptance:false,
    accountReserveWriteAuthorized:false,accountReserveWriteRows:null,
    accountReserveReadAuthorized:false,accountReserveReadRows:null,
    corr003ClosureAuthorized:false,physicalD1Reads:0,physicalD1Writes:0,
    workerEdited:false,cronEdited:false
  };
  return Object.freeze(result);
}

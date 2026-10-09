// Class A research-only evidence correlation. The 2026-10-09 Worker.js
// stores plans/reports in KV, audit/lease in D1 and external plan at 3Min.
// None of those readbacks alone prove a same-run committed business outcome.
// Never performs I/O or authorizes physical persistence, quota or production.
export const S1_P04_CROSS_STORE_LINEAGE_SCHEMA =
  "S1_ISSUE1024_P04_CROSS_STORE_LINEAGE_GATE_V0_1";

const validSource=x=>x&&typeof x==="object"&&
 Number.isSafeInteger(x.runId)&&x.runId>0&&
 Number.isSafeInteger(x.jobId)&&x.jobId>0&&
 /^[a-f0-9]{40}$/.test(x.headSha||"")&&
 Number.isSafeInteger(x.artifactId)&&x.artifactId>0&&
 /^[a-f0-9]{64}$/.test(x.artifactSha256||"");
const goodDay=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
 !Number.isNaN(Date.parse(x+"T00:00:00Z"))&&
 new Date(x+"T00:00:00Z").toISOString().startsWith(x);
const goodClock=x=>typeof x==="string"&&
 /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(x)&&
 Number.isFinite(Date.parse(x));
const distinct=x=>[...new Set(x)];
const checksum=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);

export function inspectS1P04CrossStoreLineageV0_1({
  tradingDate,calendar,cron,attempt,lease,config,plan,report,
  externalPlan,collector,account,recovery,
}={}) {
  if(!goodDay(tradingDate))throw Error("S1_P04_INVALID_TRADING_DATE");
  const missing=[];
  if(calendar?.day!==tradingDate||calendar?.ordinary!==true||
     calendar?.source!=="TWSE_OFFICIAL_CALENDAR")
    missing.push("OFFICIAL_TRADING_DAY_REQUIRED");
  // Collectors run independently after the scheduled primary; a push or
  // backfill C1 result MUST NEVER rewrite a past business date.
  if(!validSource(collector?.source)||
     collector?.event!=="schedule"||
     collector?.evidenceDate!==tradingDate||
     collector?.genuineProspective!==true||
     collector?.status!=="OPERATIONAL_RECOVERY_PASS"||
     collector?.c1Parent?.status!=="VERIFIED"||
     collector?.c1Parent?.sourceOrigin!=="AFTER_MARKET_SCAN_PIPELINE")
    missing.push("GENUINE_SCHEDULED_C1_SAME_DAY_PARENT_MISSING");
  if(collector?.status==="BLOCKED"||collector?.firstBlocker==="UPSTREAM_ARTIFACT_MISSING"||
     collector?.verificationFailure==="C1_GENERATION_NOT_FOUND")
    missing.push("UPSTREAM_C1_MISSING_BLOCKS_P04");
  if(!validSource(cron?.source)||cron?.jobType!=="AFTER_MARKET_SCAN"||
     !goodClock(cron?.scheduledAtUtc)||
     !cron.scheduledAtUtc.startsWith(tradingDate+"T15:35:")||
     cron?.status!=="SUCCESS"||cron?.skipped!==false||cron?.d1ReadbackVerified!==true)
    missing.push("NATURAL_23_35_D1_CRON_READBACK_MISSING");
  const rstate=recovery?.state;
  if(!["NOT_INVOKED_WITNESSED","EXECUTED_WITNESSED"].includes(rstate))
    missing.push("RECOVERY_TRIGGER_STATE_UNKNOWN");
  if(rstate==="NOT_INVOKED_WITNESSED"&&
    (!validSource(recovery?.source)||recovery?.absenceWindowReadbackVerified!==true))
    missing.push("RECOVERY_NONINVOCATION_UNATTESTED");
  if(rstate==="EXECUTED_WITNESSED"&&
    (!validSource(recovery?.source)||!goodClock(recovery?.scheduledAtUtc)||
      !recovery.scheduledAtUtc.startsWith(tradingDate+"T15:55:")||
      recovery?.d1AuditReadbackVerified!==true))
    missing.push("RECOVERY_23_55_D1_READBACK_MISSING");
  if(!validSource(attempt?.source)||attempt?.status!=="SUCCESS"||
     attempt?.requestedDate!==tradingDate||attempt?.kvReadbackVerified!==true)
    missing.push("SAME_DATE_SUCCESS_ATTEMPT_KV_READBACK_MISSING");
  if(!validSource(lease?.source)||lease?.date!==tradingDate||
     lease?.state!=="SUCCESS"||lease?.d1ReadbackVerified!==true||
     lease?.dedupReadbackVerified!==true)
    missing.push("D1_LEASE_AND_DEDUP_READBACK_MISSING");
  if(!validSource(config?.source)||config?.kvReadbackVerified!==true||
     !goodClock(config?.updatedAt)||!checksum(config?.stockSetHash))
    missing.push("STOCK_CONFIG_KV_READBACK_MISSING");
  if(!validSource(plan?.source)||plan?.kvReadbackVerified!==true||
     plan?.scanDate!==tradingDate||plan?.dryRun!==false||
     plan?.pipelineComplete!==true||!goodClock(plan?.generatedAt)||
     plan?.configUpdatedAt!==config?.updatedAt||
     plan?.stockSetHash!==config?.stockSetHash||
     !Number.isSafeInteger(plan?.selectedCount)||plan?.selectedCount<0)
    missing.push("SAME_GENERATION_PLAN_KV_READBACK_MISSING");
  if(!validSource(report?.source)||report?.kvReadbackVerified!==true||
     report?.marketDate!==tradingDate||report?.sent!==true||
     report?.simulated!==false||report?.stockSetHash!==plan?.stockSetHash)
    missing.push("SAME_GENERATION_DAILY_REPORT_KV_READBACK_MISSING");
  if(!validSource(externalPlan?.source)||externalPlan?.verified!==true||
     externalPlan?.simulated!==false||
     externalPlan?.stockSetHash!==plan?.stockSetHash)
    missing.push("SAME_GENERATION_EXTERNAL_PLAN_VERIFICATION_MISSING");
  if(plan?.generatedAt&&cron?.scheduledAtUtc&&goodClock(plan.generatedAt)&&
     goodClock(cron.scheduledAtUtc)&&
     (Date.parse(plan.generatedAt)<Date.parse(cron.scheduledAtUtc)||
      Date.parse(plan.generatedAt)>Date.parse(cron.scheduledAtUtc)+20*60*1000))
    missing.push("PLAN_GENERATED_OUTSIDE_NATURAL_RUN_WINDOW");
  if(attempt?.generatedAt&&plan?.generatedAt&&
     attempt.generatedAt!==plan.generatedAt)
    missing.push("SUCCESS_ATTEMPT_PLAN_GENERATION_MISMATCH");
  if(!validSource(account?.source)||account?.utcDay!==tradingDate||
     account?.allWritersReconciled!==true||
     account?.graphqlLagBounded!==true||account?.quotaCollisionObserved!==false)
    missing.push("SAME_UTC_ACCOUNT_NO_COLLISION_UNPROVEN");
  if(!Number.isSafeInteger(account?.rowsWritten)||account.rowsWritten<0||
     !Number.isSafeInteger(account?.rowsRead)||account.rowsRead<0)
    missing.push("ACCOUNT_PHYSICAL_READ_WRITE_METRICS_UNKNOWN");
  const businessSuccesses=(cron?.businessExecutionSuccessful===true?1:0)+
    (rstate==="EXECUTED_WITNESSED"&&recovery?.businessExecutionSuccessful===true?1:0);
  if(businessSuccesses!==1) missing.push("EXACTLY_ONE_BUSINESS_SCAN_UNPROVEN");
  // Existing Worker.js cron D1 table does not embed the KV snapshot
  // generation ID: matching the date/clock is at most temporal correlation.
  // The stricter independent parent + exact readback must still be audited.
  if(collector?.c1Parent?.sourceOrigin==="AFTER_MARKET_SCAN_PIPELINE"&&
     (!checksum(collector.c1Parent.parentHash)||
      collector.c1Parent.scanDate!==tradingDate||
      collector.c1Parent.generatedAt!==plan?.generatedAt))
    missing.push("C1_FORMAL_PARENT_NOT_BOUND_TO_KV_GENERATION");
  const reasons=Object.freeze(distinct(missing));
  return Object.freeze({
    schemaVersion:S1_P04_CROSS_STORE_LINEAGE_SCHEMA,
    date:tradingDate,
    structuralStatus:reasons.length===0
      ?"UNTRUSTED_COMPLETE_SHAPE_REQUIRES_INDEPENDENT_PHYSICAL_AUDIT"
      :"INCOMPLETE_OR_CONTRADICTORY_SOURCE_FAIL_CLOSED",
    reasons,
    successfulBusinessCountObservation:businessSuccesses,
    sourceIndependentlyAuthenticated:false,
    physicalP04Accepted:false,
    P01ActualRowsWrittenPerRun:null,
    P02ActualRowsReadPerRun:null,
    system1WriteReserveAuthorized:false,
    system1ReadReserveAuthorized:false,
    authorizedReserveRows:null,authorizedReadReserveRows:null,
    noActualD1ReadsPerformed:true,noActualD1WritesPerformed:true,
    tradingOrProductionModification:false,
  });
}

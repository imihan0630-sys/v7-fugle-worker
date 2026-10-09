// Issue #1024 / CORR-003 — purely offline evidence intake guard.
// Never access Cloudflare/D1, deploy, dispatch a cron or approve a reserve.
// Even a complete caller-supplied fixture is NOT independent physical proof.
export const S1_ISSUE1024_ATTRIBUTION_GATE_SCHEMA =
  "S1_ISSUE1024_P01_P02_P04_PHYSICAL_EVIDENCE_ATTRIBUTION_GATE_V0_1";

const integer = v => typeof v === "number" &&
  Number.isSafeInteger(v) && v >= 0;
const sourceRef = v => v && typeof v === "object" &&
  Number.isSafeInteger(v.runId) && v.runId > 0 &&
  Number.isSafeInteger(v.jobId) && v.jobId > 0 &&
  /^[0-9a-f]{40}$/.test(v.headSha || "") &&
  (v.artifactId == null || Number.isSafeInteger(v.artifactId) && v.artifactId > 0);
const dateOnly = v => typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  new Date(v + "T00:00:00.000Z").toISOString().startsWith(v);
const clockOf = v => typeof v === "string" &&
  Number.isFinite(Date.parse(v)) ? new Date(v).toISOString() : null;

function clockMatches(clock, date, hour, minute) {
  // 23:35/23:55 Taipei maps to 15:35/15:55 on the same UTC day.
  const iso=clockOf(clock);
  return iso !== null &&
    iso.slice(0,10) === date && iso.slice(11,16) ===
      String(hour).padStart(2,"0") + ":" + String(minute).padStart(2,"0");
}
function measuredMetric(receipt, key) {
  // A whole-day Cloudflare GraphQL sum is NOT the per-operation cost.
  // A logical inserted-row count is NOT indexed D1 rowsWritten.
  return receipt && receipt.measurementScope === "ACTUAL_OPERATION_D1_META" &&
    integer(receipt[key]) && receipt.actualProviderMetaObserved === true &&
    receipt.queryAndIndexAmplificationAccounted === true &&
    receipt.retryAndPartialAttemptsAccounted === true &&
    sourceRef(receipt.source);
}
function candidateState(reasons) {
  return reasons.length === 0
    ? "STRUCTURALLY_COMPLETE_UNTRUSTED_PENDING_INDEPENDENT_PHYSICAL_REVIEW"
    : "EVIDENCE_INCOMPLETE_FAIL_CLOSED";
}
const frozen = values => Object.freeze([...new Set(values)]);
const statusOf = x => String(x || "UNKNOWN").toUpperCase();

// Separate the physical D1 audit/lease sink from KV business plan/report
// and 3Min/external effects. Do not fabricate a D1 plan/report table.
export function inspectS1Issue1024PhysicalEvidenceV0_1(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("S1_1024_INVALID_EVIDENCE_OBJECT");
  const marketDate=input.marketDate;
  if (!dateOnly(marketDate)) throw new Error("S1_1024_INVALID_MARKET_DATE");
  const e=input.execution || {}, d=input.d1Costs || {}, b=input.business || {};
  const primary=e.primary || {};
  const recovery=e.recovery || {};
  const p01=[],p02=[],p04=[];
  const currentScope = input.officialTradingSession?.date===marketDate &&
    input.officialTradingSession?.source === "TWSE_OFFICIAL_CALENDAR" &&
    input.officialTradingSession?.isOrdinarySession === true;
  if (!currentScope) p04.push("OFFICIAL_ORDINARY_SESSION_NOT_PROVEN");
  if (!sourceRef(primary.source) || primary.event !== "NATURAL_CRON" ||
      !clockMatches(primary.scheduledAtUtc,marketDate,15,35))
    p04.push("NATURAL_23_35_PROVENANCE_MISSING");
  const recoveryState=statusOf(recovery.state);
  if (!["NOT_INVOKED_PROVEN","EXECUTED"].includes(recoveryState))
    p04.push("RECOVERY_INVOKED_OR_NOT_INVOKED_UNKNOWN");
  if (recoveryState==="NOT_INVOKED_PROVEN" &&
      (recovery.absenceWindowReadbackVerified!==true || !sourceRef(recovery.source)))
    p04.push("RECOVERY_ABSENCE_NOT_PHYSICALLY_WITNESSED");
  if (recoveryState==="EXECUTED" &&
      (!sourceRef(recovery.source) || !clockMatches(recovery.scheduledAtUtc,marketDate,15,55)))
    p04.push("RECOVERY_23_55_PROVENANCE_MISSING");

  const successes=[primary,recoveryState==="EXECUTED"?recovery:null].filter(x=>
    x && statusOf(x.businessResult)==="SUCCESS" && x.skipped!==true);
  if (successes.length!==1)
    p04.push("EXACTLY_ONE_SUCCESSFUL_BUSINESS_SCAN_NOT_PROVEN");
  if (primary.failureKind==="D1_QUOTA" || recovery.failureKind==="D1_QUOTA" ||
      input.account?.quotaCollisionObserved===true)
    p04.push("D1_ACCOUNT_QUOTA_COLLISION_OBSERVED");
  const account=input.account || {};
  if (account.quotaCollisionObserved!==false ||
      !sourceRef(account.source) || account.utcQuotaDay!==marketDate ||
      account.graphqlLagAssessed!==true ||
      account.sameDayAllWriterUsageReconciled!==true)
    p04.push("SAME_UTC_DAY_ACCOUNT_NO_COLLISION_NOT_PROVEN");
  if (b.scanDate!==marketDate || b.dryRun!==false ||
      b.lastScanAttemptStatus!=="SUCCESS" ||
      b.pipelineComplete!==true ||
      b.latestAfterMarketScanKvReadbackVerified!==true)
    p04.push("NORMAL_SCAN_KV_SNAPSHOT_NOT_READBACK_VERIFIED");
  if (b.configKvReadbackVerified!==true ||
      b.configMarketDate!==marketDate ||
      b.dailyReportKvReadbackVerified!==true ||
      b.dailyReportMarketDate!==marketDate)
    p04.push("BUSINESS_CONFIG_OR_DAILY_REPORT_KV_READBACK_MISSING");
  if (b.threeMinExternalAcceptedAndVerified!==true)
    p04.push("EXTERNAL_PLAN_VERIFICATION_NOT_WITNESSED");
  if (b.cronD1AuditRowReadbackVerified!==true ||
      b.cronScanDate!==marketDate ||
      b.signalLeaseD1ReadbackVerified!==true ||
      b.exactLeaseGenerationBound!==true)
    p04.push("D1_CRON_AND_LEASE_READBACK_INCOMPLETE");
  if (b.zeroPickHonest!==true || b.recoveryIdempotencyVerified!==true)
    p04.push("ZERO_PICK_OR_RECOVERY_IDEMPOTENCY_UNPROVEN");
  if (!sourceRef(b.source))
    p04.push("BUSINESS_PERSISTENCE_SOURCE_IDENTITY_MISSING");

  const operationNames=["primary"];
  if(recoveryState==="EXECUTED")operationNames.push("recovery");
  for (const name of operationNames){
    if(!measuredMetric(d[name],"rowsWritten"))
      p01.push("EXACT_"+name.toUpperCase()+"_D1_ROWS_WRITTEN_UNKNOWN");
    if(!measuredMetric(d[name],"rowsRead"))
      p02.push("EXACT_"+name.toUpperCase()+"_D1_ROWS_READ_UNKNOWN");
    if (!measuredMetric(d[name],"rowsWritten") ||
        !measuredMetric(d[name],"rowsRead") ||
        d[name]?.utcQuotaDay!==marketDate)
      {p01.push("ACCOUNT_DAY_OPERATION_RECONCILIATION_MISSING:"+name);
       p02.push("ACCOUNT_DAY_OPERATION_RECONCILIATION_MISSING:"+name);}
  }
  if (!sourceRef(account.source) ||
      account.utcQuotaDay!==marketDate || account.graphqlLagAssessed!==true ||
      account.sameDayAllWriterUsageReconciled!==true){
    p01.push("ACCOUNT_WIDE_WRITE_USAGE_OR_GRAPHQL_LAG_UNVERIFIED");
    p02.push("ACCOUNT_WIDE_READ_USAGE_OR_GRAPHQL_LAG_UNVERIFIED");
  }
  if (d.wholeDayV7Db?.rowsWritten!=null &&
      (!integer(d.wholeDayV7Db.rowsWritten) || !sourceRef(d.wholeDayV7Db.source)))
    p01.push("WHOLE_DAY_WRITE_PROVENANCE_INVALID");
  if (d.wholeDayV7Db?.rowsRead!=null &&
      (!integer(d.wholeDayV7Db.rowsRead) || !sourceRef(d.wholeDayV7Db.source)))
    p02.push("WHOLE_DAY_READ_PROVENANCE_INVALID");

  const base={
    schemaVersion:S1_ISSUE1024_ATTRIBUTION_GATE_SCHEMA,
    issueNumber:1024,correctionId:"S2-CORR-20261007-003",
    date:marketDate,
    sourceKind:"CALLER_SUPPLIED_OFFLINE_EVIDENCE_NOT_AUTHENTICATED",
    persistenceTopology:Object.freeze({
      planAndConfig:"STOCKS_KV",
      afterMarketSnapshot:"STOCKS_KV",
      dailyReport:"STOCKS_KV",
      afterMarketLease:"V7_DB",
      cronAudit:"V7_DB",
      externalPlan:"3MIN_EXTERNAL_VERIFICATION",
    }),
    actualOperationCostKnown:Object.freeze({
      primaryRowsWritten:measuredMetric(d.primary,"rowsWritten") ? d.primary.rowsWritten : null,
      primaryRowsRead:measuredMetric(d.primary,"rowsRead") ? d.primary.rowsRead : null,
      recoveryRowsWritten:recoveryState==="EXECUTED"&&measuredMetric(d.recovery,"rowsWritten") ? d.recovery.rowsWritten : null,
      recoveryRowsRead:recoveryState==="EXECUTED"&&measuredMetric(d.recovery,"rowsRead") ? d.recovery.rowsRead : null,
    }),
    wholeDayV7DbObservedOnly:Object.freeze({
      rowsWritten:integer(d.wholeDayV7Db?.rowsWritten)&&sourceRef(d.wholeDayV7Db?.source) ?
        d.wholeDayV7Db.rowsWritten : null,
      rowsRead:integer(d.wholeDayV7Db?.rowsRead)&&sourceRef(d.wholeDayV7Db?.source) ?
        d.wholeDayV7Db.rowsRead : null,
      neverEquivalentToPerRunCost:true,
    }),
    p01:Object.freeze({state:candidateState(p01),missing:frozen(p01),independentlyAccepted:false}),
    p02:Object.freeze({state:candidateState(p02),missing:frozen(p02),independentlyAccepted:false}),
    p04:Object.freeze({state:candidateState(p04),missing:frozen(p04),independentlyAccepted:false}),
    reserveNumberAuthorized:false,authorizedReserveRows:null,
    readReserveNumberAuthorized:false,authorizedReadReserveRows:null,
    physicalD1QueriesMade:0,physicalD1WritesMade:0,workflowDispatchMade:false,
    cloudflareQuotaGranted:false,actualPhysicalReadbackAuthenticated:false,
    independentAuditClosureAuthorized:false,
    system1FormalCoreChanged:false,productionBehaviorChanged:false,
    capitalOrTradingAuthorityChanged:false,
  };
  return Object.freeze(base);
}

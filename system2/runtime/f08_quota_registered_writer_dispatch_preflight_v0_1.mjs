import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildS2F08ConditionalAppendPlanV0_1 }
  from "./f08_outcome_atomic_cas_append_plan_v0_1.mjs";
import { resolveWriterReservationV0_1 }
  from "./d1_account_quota_budget_v0_1.mjs";

// Class A F08 preparation. A caller-supplied "grant", registry JSON,
// metadata-only analytics or synthetic receipt can NEVER unlock physical D1.
// The actual gate-owned reservation/result receipt writer and a physical D1
// adapter remain separate, NOT supplied by this module.
export const F08_WRITER_PREFLIGHT_V0_1 =
  "S2_F08_QUOTA_REGISTERED_APPEND_DISPATCH_PREFLIGHT_V0_1";
export const F08_REQUIRED_WRITER_ID_V0_1 = "F08_OUTCOME_REVISION_APPEND";
const REQUIRED_BINDING = "SYSTEM2_DB";

function objectOrNull(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value : null;
}
function positiveMeasuredCost(model, type) {
  // A count of one logical inserted row is NOT the amplified D1 physical
  // rowsWritten cost. Require a measured minimum/evidence from remediation.
  const key = type === "write" ? "reservationModel" : "readReservationModel";
  const item = objectOrNull(model?.[key]);
  if (!item || !["CALLER_REQUIRED", "FIXED_MEASURED"].includes(item.type)) return false;
  const n = item.type === "FIXED_MEASURED"
    ? (type === "write" ? item.rowsWritten : item.rowsRead)
    : (type === "write" ? item.minimumRowsWritten : item.minimumRowsRead);
  return Number.isSafeInteger(n) && n > 0
    && typeof item.evidence === "string" && item.evidence.trim().length > 0;
}
function reasonsForWriter(registry) {
  const reasons = [];
  if (!objectOrNull(registry) || !Array.isArray(registry.writers)) {
    return {writer:null,reasons:["F08_ACCOUNT_WRITER_REGISTRY_MISSING"]};
  }
  const entries = registry.writers.filter(x=>x?.id === F08_REQUIRED_WRITER_ID_V0_1);
  if (entries.length !== 1) {
    reasons.push(entries.length === 0
      ? "F08_OUTCOME_WRITER_NOT_REGISTERED"
      : "F08_OUTCOME_WRITER_REGISTRATION_AMBIGUOUS");
    return {writer:null,reasons};
  }
  const writer=entries[0];
  if (writer.physicalMutation !== true || writer.pushPhysicalAllowed !== false ||
      !["P0","P1","P2","P3"].includes(writer.priority) ||
      !/^[A-Z0-9_]+$/.test(writer.writerClass||"") ||
      typeof writer.workflow !== "string" || !writer.workflow.startsWith(".github/workflows/")) {
    reasons.push("F08_WRITER_CONTRACT_UNSAFE");
  }
  if (!positiveMeasuredCost(writer,"write"))
    reasons.push("F08_MEASURED_ROWS_WRITTEN_COST_MISSING");
  if (!positiveMeasuredCost(writer,"read"))
    reasons.push("F08_MEASURED_ROWS_READ_COST_MISSING");
  return {writer,reasons};
}
export async function prepareS2F08QuotaRegisteredWriterDispatchV0_1({
  receipt,previousReceipt=null,registry=null,
  system1ReservePolicy=null,accountUsage=null,
  quotaDecision=null,eventName="workflow_dispatch",
  bindingName=REQUIRED_BINDING,db=null,
}={}) {
  // The dry-run contract MUST NOT accept an injected DB transport: callers
  // must use a separate, independently approved physical implementation.
  if (db !== null) throw Error("F08_PREFLIGHT_PHYSICAL_DB_HANDLE_FORBIDDEN");
  if (bindingName !== REQUIRED_BINDING) throw Error("F08_PREFLIGHT_FORBIDDEN_BINDING");
  const plan=await buildS2F08ConditionalAppendPlanV0_1({
    receipt,previousReceipt,bindingName,
  });
  const {writer,reasons}=reasonsForWriter(registry);
  if (eventName === "push" || eventName === "pull_request")
    reasons.push("F08_ORDINARY_PUSH_PHYSICAL_MUTATION_FORBIDDEN");
  if (!["workflow_dispatch","schedule","push","pull_request"].includes(eventName))
    reasons.push("F08_UNKNOWN_WORKFLOW_EVENT");
  if (system1ReservePolicy?.reserveNumberAuthorized !== true ||
      !Number.isSafeInteger(system1ReservePolicy?.authorizedReserveRows) ||
      system1ReservePolicy.authorizedReserveRows <= 0)
    reasons.push("F08_SYSTEM1_WRITE_RESERVE_NOT_AUTHORIZED");
  if (system1ReservePolicy?.readReserveNumberAuthorized !== true ||
      !Number.isSafeInteger(system1ReservePolicy?.authorizedReadReserveRows) ||
      system1ReservePolicy.authorizedReadReserveRows <= 0)
    reasons.push("F08_SYSTEM1_READ_RESERVE_NOT_AUTHORIZED");
  if (accountUsage?.known !== true ||
      !Number.isSafeInteger(accountUsage?.rowsRead) ||
      !Number.isSafeInteger(accountUsage?.rowsWritten) ||
      accountUsage.rowsRead < 0 || accountUsage.rowsWritten < 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(accountUsage.quotaDay||""))
    reasons.push("F08_ACCOUNT_WIDE_READ_WRITE_USAGE_NOT_PROVEN");
  if (quotaDecision?.state !== "QUOTA_RESERVATION_GRANTED" ||
      quotaDecision?.physicalAllowed !== true)
    reasons.push("F08_QUOTA_GRANT_NOT_OBSERVED");
  // Grant-looking JSON, even from a fully formed caller fixture, is not a
  // signed ledger reservation. No certified writer can be built with it.
  reasons.push("F08_QUOTA_RECEIPT_IDENTITY_NOT_INDEPENDENTLY_VERIFIED");
  reasons.push("F08_F07_SCHEMA_AND_SOURCE_PIT_NOT_PHYSICALLY_ACCEPTED");
  reasons.push("F08_PHYSICAL_WRITER_NOT_CONNECTED");
  let reservationEstimate=null;
  if (writer && reasonsForWriter(registry).reasons.length === 0) {
    reservationEstimate=resolveWriterReservationV0_1({writer});
  }
  const base={
    schemaVersion:F08_WRITER_PREFLIGHT_V0_1,
    status:"QUOTA_BUDGET_DEFER_NO_WRITER_DISPATCH",
    targetWriterId:F08_REQUIRED_WRITER_ID_V0_1,
    writerRegistryEntryObserved:writer!==null,
    bindingName:REQUIRED_BINDING,
    acceptedTransportMethod:"NONE_DRYRUN_ONLY",
    proposedStatementType:plan.statementType,
    atomicCasPlanHash:plan.planHash,
    proposedRevisionId:plan.revisionId,
    proposedRevisionHash:plan.revisionHash,
    proposedParamCount:plan.paramCount,
    reservationEstimateState:reservationEstimate?.state||"UNAVAILABLE",
    estimatedRowsWritten:reservationEstimate?.requestedRowsWritten??null,
    estimatedRowsRead:reservationEstimate?.requestedRowsRead??null,
    // An estimate never becomes a physical authorization.
    rejectionReasons:[...new Set(reasons)],
    physicalD1StatementPrepared:false,
    physicalD1WriteAttempted:false,
    physicalD1ReadAttempted:false,
    physicalD1WriteAuthorized:false,
    quotaAccountReservationAuthorized:false,
    cloudflareWriteCostIndependentlyMeasured:false,
    system1AccountReserveIndependentlyAuthorized:false,
    physicalSchemaVerified:false,
    independentSourcePITVerified:false,
    certifiedTradeReturn:null,
    finalShadowSelectionEnabled:false,
    system1FormalCoreImpact:false,
    realOrders:false,
    capitalImpact:false,
    livePush:false,
  };
  return deepFreeze({...base,preflightHash:await sha256Hex(base)});
}

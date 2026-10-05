export const PVE247_SCHEMA = "D02_PVE247_REMEDIATION_ACCEPTANCE_ORACLE_V0_1";

const nonEmpty = v => typeof v === "string" && v.trim().length > 0;
const sha256 = v => typeof v === "string" && /^[0-9a-f]{64}$/i.test(v);
const finite = v => Number.isFinite(v);
const normalizeCron = v => String(v || "").trim().toLowerCase().replace(/\s+/g, " ");
const dateOnly = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || "")) ? String(v) : null;

function fail(reasons, code, condition) {
  if (!condition) reasons.push(code);
  return condition;
}

export function evaluateScheduleIdentity(input = {}) {
  const reasons = [];
  const configured = (input.cloudflareSchedules || []).map(normalizeCron);
  const rows = Array.isArray(input.afterMarketRows) ? input.afterMarketRows : [];

  const combined = configured.includes("35,55 15 * * mon-fri");
  const separate = configured.includes("35 15 * * mon-fri") && configured.includes("55 15 * * mon-fri");
  fail(reasons, "AFTER_MARKET_CRON_FAMILY_NOT_CONFIGURED", combined || separate);

  const familyRows = rows.filter(r => ["23:35", "23:55"].includes(String(r?.taipeiClock || "")));
  const primary = familyRows.filter(r => String(r.taipeiClock) === "23:35");
  const recovery = familyRows.filter(r => String(r.taipeiClock) === "23:55");
  fail(reasons, "PRIMARY_23_35_READBACK_MISSING", primary.length >= 1);
  fail(reasons, "RECOVERY_23_55_READBACK_MISSING", recovery.length >= 1);

  fail(reasons, "AFTER_MARKET_MISCLASSIFIED_AS_INTRADAY",
    !familyRows.some(r => String(r?.jobType) === "INTRADAY_MONITOR"));
  fail(reasons, "AFTER_MARKET_JOBTYPE_NOT_GOVERNED",
    familyRows.every(r => ["AFTER_MARKET_SCAN", "AFTER_MARKET_RECOVERY"].includes(String(r?.jobType))));

  const successRows = familyRows.filter(r => String(r?.status) === "SUCCESS");
  fail(reasons, "DUPLICATE_AFTER_MARKET_SUCCESS", successRows.length <= 1);

  if (recovery.length) {
    const recoveryAcceptable = recovery.every(r => {
      if (String(r?.status) === "SUCCESS") {
        return successRows.length === 1 && !primary.some(p => String(p?.status) === "SUCCESS");
      }
      if (String(r?.status) !== "SKIPPED") return false;
      const reason = String(r?.reason || r?.detail || "");
      return /ALREADY_SCANNED|ONLY_IF_MISSING|PRIMARY_ALREADY_COMPLETED|RECOVERY_NOT_NEEDED/i.test(reason);
    });
    fail(reasons, "RECOVERY_IDEMPOTENCE_NOT_PROVEN", recoveryAcceptable);
  }

  return {pass: reasons.length === 0, reasons};
}

export function evaluateBaselineReadiness(input = {}) {
  const reasons = [];
  fail(reasons, "BOOTSTRAP_ATTEMPT_AT_MISSING", nonEmpty(input.bootstrapAttemptAt));
  fail(reasons, "BOOTSTRAP_SYMBOL_MISSING", nonEmpty(input.symbol));
  fail(reasons, "BOOTSTRAP_FROM_MISSING", dateOnly(input.from) !== null);
  fail(reasons, "BOOTSTRAP_TO_MISSING", dateOnly(input.to) !== null);
  fail(reasons, "BOOTSTRAP_PROVIDER_STATUS_NOT_SUCCESS",
    ["SUCCESS", "HTTP_200"].includes(String(input.providerStatus)));
  fail(reasons, "BOOTSTRAP_RAW_ROW_COUNT_MISSING",
    Number.isInteger(input.rawRowCount) && input.rawRowCount >= 0);
  fail(reasons, "BOOTSTRAP_NORMALIZED_SESSION_COUNT_LT_20",
    Number.isInteger(input.normalizedSessionCount) && input.normalizedSessionCount >= 20);
  fail(reasons, "BOOTSTRAP_REJECTED_SESSION_COUNT_MISSING",
    Number.isInteger(input.rejectedSessionCount) && input.rejectedSessionCount >= 0);
  fail(reasons, "BOOTSTRAP_REJECTION_REASONS_MISSING",
    Array.isArray(input.rejectedSessionReasons));
  fail(reasons, "FINAL_VALID_SESSIONS_LT_20",
    Number.isInteger(input.finalValidSessions) && input.finalValidSessions >= 20);
  fail(reasons, "SAME_SLOT_HISTORY_LT_20",
    Number.isInteger(input.slotHistoryCount) && input.slotHistoryCount >= 20);
  fail(reasons, "PV_SLOT_RVOL20_NOT_FINITE", finite(input.pvSlotRvol20));
  fail(reasons, "SAME_SLOT_BASELINE_NOT_CLEAN", input.sameSlotBaselineClean === true);
  return {pass: reasons.length === 0, reasons};
}

export function evaluateFetchBoundaryProvenance(input = {}) {
  const reasons = [];
  fail(reasons, "PROVIDER_MISSING", nonEmpty(input.provider));
  fail(reasons, "ENDPOINT_MISSING", nonEmpty(input.endpoint));
  fail(reasons, "RAW_PAYLOAD_HASH_INVALID", sha256(input.rawPayloadHash));
  fail(reasons, "RAW_PAYLOAD_HASH_BASIS_INVALID",
    String(input.rawPayloadHashBasis) === "EXACT_PROVIDER_RESPONSE_SHA256");
  fail(reasons, "FETCH_CAPTURED_AT_MISSING", nonEmpty(input.capturedAt));
  fail(reasons, "NORMALIZATION_VERSION_MISSING", nonEmpty(input.normalizationVersion));
  const endpoint = String(input.endpoint || "");
  fail(reasons, "ENDPOINT_CONTAINS_SECRET_MATERIAL",
    !/(?:api[_-]?key|x-api-key|token|secret)=/i.test(endpoint));
  fail(reasons, "SEMANTIC_FINGERPRINT_MISSING", nonEmpty(input.semanticFingerprint));
  return {pass: reasons.length === 0, reasons};
}

export function evaluatePve247(input = {}) {
  const schedule = evaluateScheduleIdentity(input.schedule || {});
  const baseline = evaluateBaselineReadiness(input.baseline || {});
  const provenance = evaluateFetchBoundaryProvenance(input.provenance || {});
  const remediationReady = schedule.pass && baseline.pass && provenance.pass;

  const receiptReasons = [];
  const receipt = input.futureReceipt || {};
  const marketDate = dateOnly(receipt.marketDate);
  fail(receiptReasons, "FUTURE_RECEIPT_MARKET_DATE_INVALID", marketDate !== null);
  fail(receiptReasons, "NON_RETROACTIVITY_VIOLATION",
    marketDate !== null && marketDate > "2026-10-05");
  fail(receiptReasons, "CANONICAL_RECEIPT_GUARD_NOT_PASS",
    receipt.canonicalReceiptGuardPass === true);
  fail(receiptReasons, "H001_LANE_GUARD_NOT_PASS",
    receipt.h001LaneGuardPass === true);
  fail(receiptReasons, "COMMON_SUPPORT_NOT_PASS",
    receipt.commonSupportPass === true);
  fail(receiptReasons, "COHORT_GENERATION_FORMAL_ISOLATION_NOT_PASS",
    receipt.cohortGenerationFormalIsolationPass === true);

  const h001ReceiptEligible = remediationReady && receiptReasons.length === 0;
  return {
    schemaVersion: PVE247_SCHEMA,
    remediationReady,
    h001ReceiptEligible,
    schedule,
    baseline,
    provenance,
    receipt: {pass: receiptReasons.length === 0, reasons: receiptReasons},
    authorizations: {
      outcomeAccessAuthorized: false,
      numericalTargetAuthorized: false,
      d16MethodSelectionAuthorized: false,
      maturityPromotionAuthorized: false,
      formalCoreChangeAuthorized: false
    }
  };
}

export const D1_ACCOUNT_QUOTA_BUDGET_VERSION = "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_2";

export const D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE = 8;

export const D1_FREE_LIMITS = Object.freeze({
  rowsWrittenPerUtcDay: 100000,
  rowsReadPerUtcDay: 5000000,
  resetAtUtc: "00:00",
  plan: "WORKERS_FREE",
  scope: "ACCOUNT_WIDE",
  source: "Cloudflare D1 Pricing + free-tier enforcement contract",
});

const PRIORITY_ORDER = Object.freeze({ P0: 0, P1: 1, P2: 2, P3: 3, READ_ONLY: 9 });

function nonNegativeInteger(value, field, { nullable = false } = {}) {
  if (nullable && (value === null || value === undefined || value === "")) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${field} must be a non-negative integer`);
  return n;
}

function positiveInteger(value, field, { nullable = false } = {}) {
  const n = nonNegativeInteger(value, field, { nullable });
  if (n === null) return null;
  if (n <= 0) throw new Error(`${field} must be a positive integer`);
  return n;
}

export function utcQuotaDay(value = new Date()) {
  const d = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(d.getTime())) throw new Error("valid date required");
  return d.toISOString().slice(0, 10);
}

function resolveFixedMeasured({
  model,
  requested,
  amountKey,
  requestedField,
  unknownState,
  underMinimumState,
  registrySource,
}) {
  const minimum = positiveInteger(model?.[amountKey], `reservationModel.${amountKey}`);
  const supplied = nonNegativeInteger(requested, requestedField, { nullable: true });
  if (supplied !== null && supplied < minimum) {
    return Object.freeze({
      state: underMinimumState,
      amount: supplied,
      verifiedMinimum: minimum,
      source: "CALLER_UNDER_VERIFIED_MINIMUM",
    });
  }
  return Object.freeze({
    state: "RESERVATION_RESOLVED",
    amount: supplied ?? minimum,
    verifiedMinimum: minimum,
    source: supplied === null ? registrySource : "CALLER_AT_OR_ABOVE_VERIFIED_MINIMUM",
  });
}

function resolveCallerEvidence({
  model,
  requested,
  amountKey,
  evidenceKey,
  requestedField,
  unknownState,
  underMinimumState,
}) {
  const minimum = nonNegativeInteger(model?.[amountKey], `reservationModel.${amountKey}`, { nullable: true });
  const evidence = typeof model?.[evidenceKey] === "string" && model[evidenceKey].trim()
    ? model[evidenceKey].trim()
    : null;
  const supplied = nonNegativeInteger(requested, requestedField, { nullable: true });

  if (minimum === null || minimum <= 0 || !evidence) {
    return Object.freeze({
      state: unknownState,
      amount: supplied,
      verifiedMinimum: minimum,
      source: "VERIFIED_COST_EVIDENCE_MISSING",
    });
  }
  if (supplied === null || supplied <= 0) {
    return Object.freeze({
      state: unknownState,
      amount: supplied,
      verifiedMinimum: minimum,
      source: "CALLER_EVIDENCE_VALUE_MISSING",
    });
  }
  if (supplied < minimum) {
    return Object.freeze({
      state: underMinimumState,
      amount: supplied,
      verifiedMinimum: minimum,
      source: "CALLER_UNDER_VERIFIED_MINIMUM",
    });
  }
  return Object.freeze({
    state: "RESERVATION_RESOLVED",
    amount: supplied,
    verifiedMinimum: minimum,
    source: "CALLER_AT_OR_ABOVE_VERIFIED_MINIMUM",
  });
}

function resolveWriteReservation({
  writer,
  requestedRowsWritten,
  availableRowsWrittenBeforeRequest,
}) {
  const model = writer.reservationModel || {};
  if (model.type === "NONE" || writer.physicalMutation === false) {
    return Object.freeze({
      state: "READ_ONLY",
      amount: 0,
      adaptiveMaxDates: null,
      verifiedMinimum: 0,
      source: "READ_ONLY",
    });
  }

  if (model.type === "FIXED_MEASURED") {
    const fixed = resolveFixedMeasured({
      model,
      requested: requestedRowsWritten,
      amountKey: "rowsWritten",
      requestedField: "requestedRowsWritten",
      unknownState: "WRITE_RESERVATION_UNKNOWN",
      underMinimumState: "WRITE_RESERVATION_UNDER_VERIFIED_MINIMUM",
      registrySource: "REGISTRY_MEASURED",
    });
    return Object.freeze({ ...fixed, adaptiveMaxDates: null });
  }

  if (model.type === "CALLER_REQUIRED") {
    const caller = resolveCallerEvidence({
      model,
      requested: requestedRowsWritten,
      amountKey: "minimumRowsWritten",
      evidenceKey: "evidence",
      requestedField: "requestedRowsWritten",
      unknownState: "WRITE_RESERVATION_EVIDENCE_REQUIRED",
      underMinimumState: "WRITE_RESERVATION_UNDER_VERIFIED_MINIMUM",
    });
    return Object.freeze({ ...caller, adaptiveMaxDates: null });
  }

  if (model.type === "PER_DATE_MEASURED") {
    const perDate = positiveInteger(model.rowsWrittenPerDate, "rowsWrittenPerDate");
    const maxDates = positiveInteger(model.maxDates, "maxDates");
    const available = nonNegativeInteger(
      availableRowsWrittenBeforeRequest,
      "availableRowsWrittenBeforeRequest",
      { nullable: true },
    );
    if (available === null) {
      return Object.freeze({
        state: "WRITE_RESERVATION_UNKNOWN",
        amount: null,
        adaptiveMaxDates: 0,
        verifiedMinimum: perDate,
        source: "HEADROOM_UNKNOWN",
      });
    }
    const adaptiveMaxDates = Math.max(0, Math.min(maxDates, Math.floor(available / perDate)));
    if (adaptiveMaxDates < 1) {
      return Object.freeze({
        state: "WRITE_RESERVATION_DOES_NOT_FIT",
        amount: perDate,
        adaptiveMaxDates: 0,
        verifiedMinimum: perDate,
        source: "PER_DATE_MEASURED",
      });
    }
    return Object.freeze({
      state: "RESERVATION_RESOLVED",
      amount: adaptiveMaxDates * perDate,
      adaptiveMaxDates,
      verifiedMinimum: perDate,
      source: "PER_DATE_MEASURED",
    });
  }

  if (model.type === "RETIRED_DATE_GATED") {
    return Object.freeze({
      state: "RETIRED",
      amount: 0,
      adaptiveMaxDates: null,
      verifiedMinimum: 0,
      source: "RETIRED",
    });
  }

  return Object.freeze({
    state: "WRITE_RESERVATION_EVIDENCE_REQUIRED",
    amount: null,
    adaptiveMaxDates: null,
    verifiedMinimum: null,
    source: "UNSUPPORTED_OR_MISSING_WRITE_MODEL",
  });
}

function resolveReadReservation({ writer, requestedRowsRead }) {
  if (writer.physicalMutation === false) {
    return Object.freeze({
      state: "READ_ONLY",
      amount: 0,
      verifiedMinimum: 0,
      source: "READ_ONLY",
    });
  }

  const model = writer.readReservationModel || {};
  if (model.type === "FIXED_MEASURED") {
    return resolveFixedMeasured({
      model,
      requested: requestedRowsRead,
      amountKey: "rowsRead",
      requestedField: "requestedRowsRead",
      unknownState: "READ_RESERVATION_UNKNOWN",
      underMinimumState: "READ_RESERVATION_UNDER_VERIFIED_MINIMUM",
      registrySource: "REGISTRY_MEASURED",
    });
  }

  if (model.type === "CALLER_REQUIRED") {
    return resolveCallerEvidence({
      model,
      requested: requestedRowsRead,
      amountKey: "minimumRowsRead",
      evidenceKey: "evidence",
      requestedField: "requestedRowsRead",
      unknownState: "READ_RESERVATION_EVIDENCE_REQUIRED",
      underMinimumState: "READ_RESERVATION_UNDER_VERIFIED_MINIMUM",
    });
  }

  return Object.freeze({
    state: "READ_RESERVATION_EVIDENCE_REQUIRED",
    amount: null,
    verifiedMinimum: null,
    source: "VERIFIED_READ_COST_EVIDENCE_MISSING",
  });
}

export function resolveWriterReservationV0_1({
  writer,
  requestedRowsWritten = null,
  requestedRowsRead = null,
  availableRowsWrittenBeforeRequest = null,
} = {}) {
  if (!writer || typeof writer !== "object") throw new Error("writer is required");

  const write = resolveWriteReservation({
    writer,
    requestedRowsWritten,
    availableRowsWrittenBeforeRequest,
  });
  const read = resolveReadReservation({ writer, requestedRowsRead });

  const writeResolved = ["RESERVATION_RESOLVED", "READ_ONLY", "RETIRED"].includes(write.state);
  const readResolved = ["RESERVATION_RESOLVED", "READ_ONLY"].includes(read.state);

  return Object.freeze({
    state: writeResolved && readResolved ? "RESERVATION_RESOLVED" : "RESERVATION_NOT_PROVEN",
    writeState: write.state,
    readState: read.state,
    requestedRowsWritten: write.amount,
    requestedRowsRead: read.amount,
    verifiedMinimumRowsWritten: write.verifiedMinimum,
    verifiedMinimumRowsRead: read.verifiedMinimum,
    adaptiveMaxDates: write.adaptiveMaxDates,
    writeSource: write.source,
    readSource: read.source,
  });
}

function reservationFailureReason(reservation) {
  if (reservation.writeState === "WRITE_RESERVATION_UNDER_VERIFIED_MINIMUM") {
    return "WRITER_WRITE_RESERVATION_BELOW_VERIFIED_MINIMUM";
  }
  if (reservation.writeState === "WRITE_RESERVATION_DOES_NOT_FIT") {
    return "WRITER_WRITE_RESERVATION_EXCEEDS_AVAILABLE_HEADROOM";
  }
  if (reservation.writeState && reservation.writeState !== "RESERVATION_RESOLVED") {
    return "WRITER_WRITE_RESERVATION_EVIDENCE_REQUIRED";
  }
  if (reservation.readState === "READ_RESERVATION_UNDER_VERIFIED_MINIMUM") {
    return "WRITER_READ_RESERVATION_BELOW_VERIFIED_MINIMUM";
  }
  if (reservation.readState && reservation.readState !== "RESERVATION_RESOLVED") {
    return "WRITER_READ_RESERVATION_EVIDENCE_REQUIRED";
  }
  return "WRITER_RESERVATION_NOT_PROVEN";
}

export function evaluateD1AccountQuotaReservationV0_1({
  writer,
  eventName,
  accountUsage,
  system1ReservePolicy,
  ledgerIntegrityState = "VALID",
  outstandingReservedRowsWritten = 0,
  outstandingReservedRowsRead = 0,
  protectedDailyShadowReserveRows = 13130,
  protectedDailyShadowReserveRowsRead = 583256,
  launchAcceptanceReserveRows = 0,
  launchAcceptanceReserveRowsRead = 0,
  requestedRowsWritten = null,
  requestedRowsRead = null,
} = {}) {
  if (!writer || typeof writer !== "object") throw new Error("writer is required");
  if (!(writer.priority in PRIORITY_ORDER)) throw new Error("writer priority is invalid");

  const event = String(eventName || "unknown");
  if (writer.physicalMutation === false) {
    return Object.freeze({
      state: "READ_ONLY_ALLOWED",
      physicalAllowed: false,
      quotaDay: null,
      reasonCodes: Object.freeze(["WRITER_REGISTERED_READ_ONLY"]),
      adaptiveMaxDates: null,
      requestedRowsWritten: 0,
      requestedRowsRead: 0,
      paidUpgradeAuthorized: false,
    });
  }

  if (event === "push" && writer.pushPhysicalAllowed !== true) {
    return Object.freeze({
      state: "PUSH_READ_ONLY_ONLY",
      physicalAllowed: false,
      quotaDay: null,
      reasonCodes: Object.freeze(["ORDINARY_PUSH_PHYSICAL_D1_MUTATION_FORBIDDEN"]),
      adaptiveMaxDates: 0,
      requestedRowsWritten: 0,
      requestedRowsRead: 0,
      paidUpgradeAuthorized: false,
    });
  }

  if (!accountUsage || accountUsage.known !== true) {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage?.quotaDay || null,
      reasonCodes: Object.freeze(["ACCOUNT_WIDE_D1_USAGE_UNKNOWN"]),
      adaptiveMaxDates: 0,
      requestedRowsWritten: null,
      requestedRowsRead: null,
      paidUpgradeAuthorized: false,
    });
  }

  if (ledgerIntegrityState !== "VALID") {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze(["D1_QUOTA_LEDGER_INTEGRITY_INVALID"]),
      adaptiveMaxDates: 0,
      requestedRowsWritten: null,
      requestedRowsRead: null,
      paidUpgradeAuthorized: false,
    });
  }

  const usedWritten = nonNegativeInteger(accountUsage.rowsWritten, "accountUsage.rowsWritten");
  const usedRead = nonNegativeInteger(accountUsage.rowsRead, "accountUsage.rowsRead");
  const outstandingWritten = nonNegativeInteger(
    outstandingReservedRowsWritten,
    "outstandingReservedRowsWritten",
  );
  const outstandingRead = nonNegativeInteger(
    outstandingReservedRowsRead,
    "outstandingReservedRowsRead",
  );
  const launchReserve = nonNegativeInteger(
    launchAcceptanceReserveRows,
    "launchAcceptanceReserveRows",
  );
  const launchReadReserve = nonNegativeInteger(
    launchAcceptanceReserveRowsRead,
    "launchAcceptanceReserveRowsRead",
  );

  if (
    !system1ReservePolicy
    || system1ReservePolicy.reserveNumberAuthorized !== true
    || !Number.isInteger(Number(system1ReservePolicy.authorizedReserveRows))
    || Number(system1ReservePolicy.authorizedReserveRows) <= 0
  ) {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze(["SYSTEM1_AFTER_MARKET_RESERVE_NOT_AUTHORIZED"]),
      adaptiveMaxDates: 0,
      requestedRowsWritten: null,
      requestedRowsRead: null,
      rowsWrittenUsed: usedWritten,
      rowsReadUsed: usedRead,
      paidUpgradeAuthorized: false,
    });
  }

  if (
    system1ReservePolicy.readReserveNumberAuthorized !== true
    || !Number.isInteger(Number(system1ReservePolicy.authorizedReadReserveRows))
    || Number(system1ReservePolicy.authorizedReadReserveRows) <= 0
  ) {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze(["SYSTEM1_AFTER_MARKET_READ_RESERVE_NOT_AUTHORIZED"]),
      adaptiveMaxDates: 0,
      requestedRowsWritten: null,
      requestedRowsRead: null,
      rowsWrittenUsed: usedWritten,
      rowsReadUsed: usedRead,
      paidUpgradeAuthorized: false,
    });
  }

  const system1Reserve = positiveInteger(
    system1ReservePolicy.authorizedReserveRows,
    "system1ReservePolicy.authorizedReserveRows",
  );
  const system1ReadReserve = positiveInteger(
    system1ReservePolicy.authorizedReadReserveRows,
    "system1ReservePolicy.authorizedReadReserveRows",
  );
  const reserveForDailyShadow = writer.priority === "P0"
    ? 0
    : nonNegativeInteger(protectedDailyShadowReserveRows, "protectedDailyShadowReserveRows");
  const reserveForDailyShadowRead = writer.priority === "P0"
    ? 0
    : nonNegativeInteger(protectedDailyShadowReserveRowsRead, "protectedDailyShadowReserveRowsRead");

  const writeHeadroomBeforeRequest = Math.max(
    0,
    D1_FREE_LIMITS.rowsWrittenPerUtcDay
      - usedWritten
      - outstandingWritten
      - system1Reserve
      - reserveForDailyShadow
      - launchReserve
      - D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE,
  );

  const reservation = resolveWriterReservationV0_1({
    writer,
    requestedRowsWritten,
    requestedRowsRead,
    availableRowsWrittenBeforeRequest: writeHeadroomBeforeRequest,
  });

  if (reservation.state !== "RESERVATION_RESOLVED") {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze([reservationFailureReason(reservation)]),
      adaptiveMaxDates: reservation.adaptiveMaxDates,
      requestedRowsWritten: reservation.requestedRowsWritten,
      requestedRowsRead: reservation.requestedRowsRead,
      verifiedMinimumRowsWritten: reservation.verifiedMinimumRowsWritten,
      verifiedMinimumRowsRead: reservation.verifiedMinimumRowsRead,
      rowsWrittenUsed: usedWritten,
      rowsReadUsed: usedRead,
      system1ReserveRows: system1Reserve,
      system1ReadReserveRows: system1ReadReserve,
      protectedDailyShadowReserveRows: reserveForDailyShadow,
      protectedDailyShadowReserveRowsRead: reserveForDailyShadowRead,
      launchAcceptanceReserveRows: launchReserve,
      launchAcceptanceReserveRowsRead: launchReadReserve,
      outstandingReservedRowsWritten: outstandingWritten,
      outstandingReservedRowsRead: outstandingRead,
      quotaLedgerRowsWrittenReserve: D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE,
      writeHeadroomBeforeRequest,
      analyticsLagPolicy: "GRAPHQL_LOWER_BOUND_PLUS_NON_RELEASING_SAME_DAY_RESERVATIONS",
      paidUpgradeAuthorized: false,
    });
  }

  const requestedWritten = nonNegativeInteger(
    reservation.requestedRowsWritten,
    "reservation.requestedRowsWritten",
  );
  const requestedRead = positiveInteger(
    reservation.requestedRowsRead,
    "reservation.requestedRowsRead",
  );

  const projectedWritten = usedWritten
    + outstandingWritten
    + system1Reserve
    + reserveForDailyShadow
    + launchReserve
    + requestedWritten
    + D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE;
  const projectedRead = usedRead
    + outstandingRead
    + system1ReadReserve
    + reserveForDailyShadowRead
    + launchReadReserve
    + requestedRead;

  if (
    projectedWritten > D1_FREE_LIMITS.rowsWrittenPerUtcDay
    || projectedRead > D1_FREE_LIMITS.rowsReadPerUtcDay
  ) {
    const reasons = [];
    if (projectedWritten > D1_FREE_LIMITS.rowsWrittenPerUtcDay) {
      reasons.push("ROWS_WRITTEN_DAILY_BUDGET_EXCEEDED");
    }
    if (projectedRead > D1_FREE_LIMITS.rowsReadPerUtcDay) {
      reasons.push("ROWS_READ_DAILY_BUDGET_EXCEEDED");
    }
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze(reasons),
      adaptiveMaxDates: reservation.adaptiveMaxDates,
      requestedRowsWritten: requestedWritten,
      requestedRowsRead: requestedRead,
      verifiedMinimumRowsWritten: reservation.verifiedMinimumRowsWritten,
      verifiedMinimumRowsRead: reservation.verifiedMinimumRowsRead,
      projectedRowsWritten: projectedWritten,
      projectedRowsRead: projectedRead,
      rowsWrittenUsed: usedWritten,
      rowsReadUsed: usedRead,
      system1ReserveRows: system1Reserve,
      system1ReadReserveRows: system1ReadReserve,
      protectedDailyShadowReserveRows: reserveForDailyShadow,
      protectedDailyShadowReserveRowsRead: reserveForDailyShadowRead,
      launchAcceptanceReserveRows: launchReserve,
      launchAcceptanceReserveRowsRead: launchReadReserve,
      outstandingReservedRowsWritten: outstandingWritten,
      outstandingReservedRowsRead: outstandingRead,
      quotaLedgerRowsWrittenReserve: D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE,
      analyticsLagPolicy: "GRAPHQL_LOWER_BOUND_PLUS_NON_RELEASING_SAME_DAY_RESERVATIONS",
      paidUpgradeAuthorized: false,
    });
  }

  return Object.freeze({
    state: "QUOTA_RESERVATION_GRANTED",
    physicalAllowed: true,
    quotaDay: accountUsage.quotaDay,
    writerId: writer.id,
    writerClass: writer.writerClass,
    priority: writer.priority,
    reservationSource: Object.freeze({
      write: reservation.writeSource,
      read: reservation.readSource,
    }),
    requestedRowsWritten: requestedWritten,
    requestedRowsRead: requestedRead,
    verifiedMinimumRowsWritten: reservation.verifiedMinimumRowsWritten,
    verifiedMinimumRowsRead: reservation.verifiedMinimumRowsRead,
    adaptiveMaxDates: reservation.adaptiveMaxDates,
    rowsWrittenUsed: usedWritten,
    rowsReadUsed: usedRead,
    system1ReserveRows: system1Reserve,
    system1ReadReserveRows: system1ReadReserve,
    protectedDailyShadowReserveRows: reserveForDailyShadow,
    protectedDailyShadowReserveRowsRead: reserveForDailyShadowRead,
    launchAcceptanceReserveRows: launchReserve,
    launchAcceptanceReserveRowsRead: launchReadReserve,
    outstandingReservedRowsWritten: outstandingWritten,
    outstandingReservedRowsRead: outstandingRead,
    quotaLedgerRowsWrittenReserve: D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE,
    projectedRowsWritten: projectedWritten,
    projectedRowsRead: projectedRead,
    rowsWrittenLimit: D1_FREE_LIMITS.rowsWrittenPerUtcDay,
    rowsReadLimit: D1_FREE_LIMITS.rowsReadPerUtcDay,
    analyticsUsageSemantics: "LOWER_BOUND_NOT_REALTIME_GUARANTEE",
    analyticsLagPolicy: "GRAPHQL_LOWER_BOUND_PLUS_NON_RELEASING_SAME_DAY_RESERVATIONS",
    paidUpgradeAuthorized: false,
  });
}

export function evaluateD1QuotaResultVarianceV0_1({
  reservedRowsWritten,
  reservedRowsRead,
  observedDeltaRowsWritten,
  observedDeltaRowsRead,
} = {}) {
  const rw = nonNegativeInteger(reservedRowsWritten, "reservedRowsWritten");
  const rr = nonNegativeInteger(reservedRowsRead, "reservedRowsRead");
  const ow = nonNegativeInteger(observedDeltaRowsWritten, "observedDeltaRowsWritten", { nullable: true });
  const or = nonNegativeInteger(observedDeltaRowsRead, "observedDeltaRowsRead", { nullable: true });

  const usageKnown = ow !== null && or !== null;
  const writeOverrun = usageKnown && ow > rw;
  const readOverrun = usageKnown && or > rr;

  return Object.freeze({
    usageKnown,
    writeOverrun,
    readOverrun,
    anyOverrun: writeOverrun || readOverrun,
    reservedRowsWritten: rw,
    reservedRowsRead: rr,
    observedDeltaRowsWritten: ow,
    observedDeltaRowsRead: or,
    releaseReservationWithinUtcDay: false,
    state: !usageKnown
      ? "RESULT_USAGE_UNKNOWN_NON_RELEASING"
      : writeOverrun || readOverrun
        ? "RESULT_RESERVATION_OVERRUN_NON_RELEASING"
        : "RESULT_OBSERVED_WITHIN_RESERVATION_NON_RELEASING",
  });
}

export function summarizeD1QuotaLedgerRowsV0_1(
  rows = [],
  { quotaDay = null, requireReceiptIdentity = false } = {},
) {
  const reservations = new Map();
  const results = new Map();
  let maxObservedRowsWrittenAfter = 0;
  let maxObservedRowsReadAfter = 0;

  const invalid = (code, rowIndex, detail = null) => Object.freeze({
    integrityState: "INVALID",
    integrityErrors: Object.freeze([Object.freeze({ code, rowIndex, detail })]),
    outstandingReservedRowsWritten: D1_FREE_LIMITS.rowsWrittenPerUtcDay,
    outstandingReservedRowsRead: D1_FREE_LIMITS.rowsReadPerUtcDay,
    reservationCount: reservations.size,
    resultCount: results.size,
    maxObservedRowsWrittenAfter,
    maxObservedRowsReadAfter,
    sameDayReservationReleasePolicy: "NEVER_RELEASE_BEFORE_UTC_RESET",
    conservativeBlockPolicy: "SATURATE_ACCOUNT_HARD_LIMIT_ON_LEDGER_INTEGRITY_FAILURE",
  });
  const strictNonNegativeInteger = (value) =>
    typeof value === "number"
    && Number.isSafeInteger(value)
    && value >= 0;
  const validQuotaDay = (value) =>
    typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value + "T00:00:00.000Z"));
  const allowedSchema = (type, version) => {
    const prefix = type === "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1"
      ? "S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_"
      : "S2_D1_ACCOUNT_BUDGET_RESULT_V0_";
    return typeof version === "string"
      && [prefix + "1", prefix + "2", prefix + "3"].includes(version);
  };

  for (let rowIndex = 0; rowIndex < (rows || []).length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!row || typeof row !== "object") {
      return invalid("LEDGER_ROW_NOT_OBJECT", rowIndex);
    }

    const type = row.check_type;
    if (![
      "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
      "SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
    ].includes(type)) {
      return invalid("LEDGER_CHECK_TYPE_INVALID", rowIndex, type ?? null);
    }

    let payload;
    try {
      payload = JSON.parse(row.observed_payload_json);
    } catch {
      return invalid("LEDGER_OBSERVED_PAYLOAD_JSON_INVALID", rowIndex);
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return invalid("LEDGER_OBSERVED_PAYLOAD_NOT_OBJECT", rowIndex);
    }
    if (typeof payload.runKey !== "string" || !payload.runKey.trim()) {
      return invalid("LEDGER_RUN_KEY_MISSING", rowIndex);
    }
    if (!validQuotaDay(payload.quotaDay)) {
      return invalid("LEDGER_QUOTA_DAY_INVALID", rowIndex, payload.quotaDay ?? null);
    }

    if (requireReceiptIdentity) {
      if (typeof row.check_id !== "string" || !row.check_id.trim()) {
        return invalid("LEDGER_CHECK_ID_MISSING", rowIndex);
      }
      if (typeof row.check_hash !== "string" || !/^[a-f0-9]{64}$/.test(row.check_hash)) {
        return invalid("LEDGER_CHECK_HASH_INVALID", rowIndex);
      }
      if (typeof row.status !== "string" || !row.status.trim()) {
        return invalid("LEDGER_STATUS_MISSING", rowIndex);
      }
      if (typeof row.expected_payload_json !== "string") {
        return invalid("LEDGER_EXPECTED_PAYLOAD_MISSING", rowIndex);
      }
      try {
        const expected = JSON.parse(row.expected_payload_json);
        if (!expected || typeof expected !== "object" || Array.isArray(expected)) {
          return invalid("LEDGER_EXPECTED_PAYLOAD_NOT_OBJECT", rowIndex);
        }
      } catch {
        return invalid("LEDGER_EXPECTED_PAYLOAD_JSON_INVALID", rowIndex);
      }
      if (!allowedSchema(type, payload.schemaVersion)) {
        return invalid("LEDGER_SCHEMA_VERSION_INVALID", rowIndex, payload.schemaVersion ?? null);
      }
      if (payload.directiveId !== "S2-CORR-20261007-003") {
        return invalid("LEDGER_DIRECTIVE_ID_INVALID", rowIndex, payload.directiveId ?? null);
      }
      if (typeof payload.budgetVersion !== "string" || !payload.budgetVersion.trim()) {
        return invalid("LEDGER_BUDGET_VERSION_MISSING", rowIndex);
      }
      const suffix = type === "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1"
        ? "RESERVATION"
        : "RESULT";
      const expectedCheckId = "S2-D1-BUDGET:"
        + payload.quotaDay + ":" + payload.runKey + ":" + suffix;
      if (row.check_id !== expectedCheckId) {
        return invalid("LEDGER_CHECK_IDENTITY_MISMATCH", rowIndex, row.check_id);
      }
      if (typeof row.check_timestamp !== "string" || !Number.isFinite(Date.parse(row.check_timestamp))) {
        return invalid("LEDGER_CHECK_TIMESTAMP_INVALID", rowIndex);
      }
    }

    const belongsToRequestedDay = !quotaDay || payload.quotaDay === quotaDay;
    if (!belongsToRequestedDay) {
      if (type === "SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1") continue;
      return invalid("LEDGER_RESERVATION_WRONG_QUOTA_DAY", rowIndex, payload.quotaDay);
    }

    if (type === "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1") {
      if (
        !strictNonNegativeInteger(payload.requestedRowsWritten)
        || !strictNonNegativeInteger(payload.requestedRowsRead)
      ) {
        return invalid("LEDGER_RESERVATION_COST_INVALID", rowIndex);
      }
      if (reservations.has(payload.runKey)) {
        return invalid("LEDGER_DUPLICATE_RESERVATION_RUN_KEY", rowIndex, payload.runKey);
      }
      reservations.set(payload.runKey, payload);
      continue;
    }

    if (typeof payload.resultState !== "string" || !payload.resultState.trim()) {
      return invalid("LEDGER_RESULT_STATE_MISSING", rowIndex);
    }
    for (const [field, value] of [
      ["accountRowsWrittenAfter", payload.accountRowsWrittenAfter],
      ["accountRowsReadAfter", payload.accountRowsReadAfter],
    ]) {
      if (value !== null && value !== undefined && !strictNonNegativeInteger(value)) {
        return invalid("LEDGER_RESULT_METRIC_INVALID:" + field, rowIndex);
      }
    }
    if (results.has(payload.runKey)) {
      return invalid("LEDGER_DUPLICATE_RESULT_RUN_KEY", rowIndex, payload.runKey);
    }
    results.set(payload.runKey, payload);
    if (strictNonNegativeInteger(payload.accountRowsWrittenAfter)) {
      maxObservedRowsWrittenAfter = Math.max(
        maxObservedRowsWrittenAfter,
        payload.accountRowsWrittenAfter,
      );
    }
    if (strictNonNegativeInteger(payload.accountRowsReadAfter)) {
      maxObservedRowsReadAfter = Math.max(
        maxObservedRowsReadAfter,
        payload.accountRowsReadAfter,
      );
    }
  }

  for (const runKey of results.keys()) {
    if (!reservations.has(runKey)) {
      return invalid("LEDGER_RESULT_WITHOUT_RESERVATION", -1, runKey);
    }
  }

  const outstandingReservedRowsWritten = [...reservations.values()]
    .reduce((sum, payload) => sum + payload.requestedRowsWritten, 0);
  const outstandingReservedRowsRead = [...reservations.values()]
    .reduce((sum, payload) => sum + payload.requestedRowsRead, 0);

  if (
    !Number.isSafeInteger(outstandingReservedRowsWritten)
    || !Number.isSafeInteger(outstandingReservedRowsRead)
  ) {
    return invalid("LEDGER_RESERVATION_AGGREGATE_OVERFLOW", -1);
  }

  return Object.freeze({
    integrityState: "VALID",
    integrityErrors: Object.freeze([]),
    outstandingReservedRowsWritten,
    outstandingReservedRowsRead,
    reservationCount: reservations.size,
    resultCount: results.size,
    maxObservedRowsWrittenAfter,
    maxObservedRowsReadAfter,
    sameDayReservationReleasePolicy: "NEVER_RELEASE_BEFORE_UTC_RESET",
    conservativeBlockPolicy: null,
  });
}

export function verifyD1QuotaLedgerReceiptIdentityV0_1(existing, intended) {
  if (!existing || !intended) throw new Error("existing and intended ledger receipt identities are required");
  const fields = [
    ["check_id", "checkId"],
    ["check_type", "checkType"],
    ["expected_payload_json", "expectedPayloadJson"],
    ["observed_payload_json", "observedPayloadJson"],
    ["status", "status"],
    ["check_hash", "checkHash"],
  ];
  const mismatches = [];
  for (const [existingKey, intendedKey] of fields) {
    if (String(existing?.[existingKey] ?? "") !== String(intended?.[intendedKey] ?? "")) {
      mismatches.push(intendedKey);
    }
  }
  if (mismatches.length) {
    throw new Error(`D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT:${mismatches.join(",")}`);
  }
  return Object.freeze({
    state: "SKIPPED_IDENTICAL_EXISTING_RECEIPT",
    idempotent: true,
    checkId: intended.checkId,
    checkHash: intended.checkHash,
  });
}

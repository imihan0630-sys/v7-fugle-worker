export const D1_ACCOUNT_QUOTA_BUDGET_VERSION = "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1";

export const D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE = 8; // reservation + result; each row touches table, PK, UNIQUE hash and time/type index

export const D1_FREE_LIMITS = Object.freeze({
  rowsWrittenPerUtcDay: 100000,
  rowsReadPerUtcDay: 5000000,
  resetAtUtc: "00:00",
  plan: "WORKERS_FREE",
  scope: "ACCOUNT_WIDE",
  source: "Cloudflare D1 Pricing + 2026-09-01 free-tier enforcement changelog",
});

const PRIORITY_ORDER = Object.freeze({ P0: 0, P1: 1, P2: 2, P3: 3, READ_ONLY: 9 });

function nonNegativeInteger(value, field, { nullable = false } = {}) {
  if (nullable && (value === null || value === undefined || value === "")) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${field} must be a non-negative integer`);
  return n;
}

export function utcQuotaDay(value = new Date()) {
  const d = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(d.getTime())) throw new Error("valid date required");
  return d.toISOString().slice(0, 10);
}

export function resolveWriterReservationV0_1({
  writer,
  requestedRowsWritten = null,
  requestedRowsRead = 0,
  availableRowsWrittenBeforeRequest = null,
} = {}) {
  if (!writer || typeof writer !== "object") throw new Error("writer is required");
  const model = writer.reservationModel || {};
  const readReservation = nonNegativeInteger(requestedRowsRead, "requestedRowsRead");

  if (model.type === "NONE" || writer.physicalMutation === false) {
    return Object.freeze({
      state: "READ_ONLY",
      requestedRowsWritten: 0,
      requestedRowsRead: readReservation,
      adaptiveMaxDates: null,
      source: "READ_ONLY",
    });
  }

  if (model.type === "FIXED_MEASURED") {
    return Object.freeze({
      state: "RESERVATION_RESOLVED",
      requestedRowsWritten: nonNegativeInteger(
        requestedRowsWritten ?? model.rowsWritten,
        "requestedRowsWritten",
      ),
      requestedRowsRead: readReservation,
      adaptiveMaxDates: null,
      source: requestedRowsWritten === null || requestedRowsWritten === undefined
        ? "REGISTRY_MEASURED"
        : "CALLER_OVERRIDE",
    });
  }

  if (model.type === "CALLER_REQUIRED") {
    const requested = nonNegativeInteger(
      requestedRowsWritten,
      "requestedRowsWritten",
      { nullable: true },
    );
    if (requested === null || requested === 0) {
      return Object.freeze({
        state: "RESERVATION_UNKNOWN",
        requestedRowsWritten: null,
        requestedRowsRead: readReservation,
        adaptiveMaxDates: null,
        source: "CALLER_REQUIRED",
      });
    }
    return Object.freeze({
      state: "RESERVATION_RESOLVED",
      requestedRowsWritten: requested,
      requestedRowsRead: readReservation,
      adaptiveMaxDates: null,
      source: "CALLER_SUPPLIED",
    });
  }

  if (model.type === "PER_DATE_MEASURED") {
    const perDate = nonNegativeInteger(model.rowsWrittenPerDate, "rowsWrittenPerDate");
    const maxDates = nonNegativeInteger(model.maxDates, "maxDates");
    const available = nonNegativeInteger(
      availableRowsWrittenBeforeRequest,
      "availableRowsWrittenBeforeRequest",
      { nullable: true },
    );
    if (available === null) {
      return Object.freeze({
        state: "RESERVATION_UNKNOWN",
        requestedRowsWritten: null,
        requestedRowsRead: readReservation,
        adaptiveMaxDates: 0,
        source: "HEADROOM_UNKNOWN",
      });
    }
    const adaptiveMaxDates = Math.max(0, Math.min(maxDates, Math.floor(available / perDate)));
    if (adaptiveMaxDates < 1) {
      return Object.freeze({
        state: "RESERVATION_DOES_NOT_FIT",
        requestedRowsWritten: perDate,
        requestedRowsRead: readReservation,
        adaptiveMaxDates: 0,
        source: "PER_DATE_MEASURED",
      });
    }
    return Object.freeze({
      state: "RESERVATION_RESOLVED",
      requestedRowsWritten: adaptiveMaxDates * perDate,
      requestedRowsRead: readReservation,
      adaptiveMaxDates,
      source: "PER_DATE_MEASURED",
    });
  }

  if (model.type === "RETIRED_DATE_GATED") {
    return Object.freeze({
      state: "RETIRED",
      requestedRowsWritten: 0,
      requestedRowsRead: readReservation,
      adaptiveMaxDates: null,
      source: "RETIRED",
    });
  }

  throw new Error(`unsupported reservation model: ${model.type || "missing"}`);
}

export function evaluateD1AccountQuotaReservationV0_1({
  writer,
  eventName,
  accountUsage,
  system1ReservePolicy,
  outstandingReservedRowsWritten = 0,
  protectedDailyShadowReserveRows = 13130,
  launchAcceptanceReserveRows = 0,
  requestedRowsWritten = null,
  requestedRowsRead = 0,
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

  const usedWritten = nonNegativeInteger(accountUsage.rowsWritten, "accountUsage.rowsWritten");
  const usedRead = nonNegativeInteger(accountUsage.rowsRead, "accountUsage.rowsRead");
  const outstanding = nonNegativeInteger(
    outstandingReservedRowsWritten,
    "outstandingReservedRowsWritten",
  );
  const launchReserve = nonNegativeInteger(
    launchAcceptanceReserveRows,
    "launchAcceptanceReserveRows",
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

  const system1Reserve = nonNegativeInteger(
    system1ReservePolicy.authorizedReserveRows,
    "system1ReservePolicy.authorizedReserveRows",
  );
  const reserveForDailyShadow = writer.priority === "P0"
    ? 0
    : nonNegativeInteger(protectedDailyShadowReserveRows, "protectedDailyShadowReserveRows");

  const writeHeadroomBeforeRequest = Math.max(
    0,
    D1_FREE_LIMITS.rowsWrittenPerUtcDay
      - usedWritten
      - outstanding
      - system1Reserve
      - reserveForDailyShadow
      - launchReserve,
  );
  const reservation = resolveWriterReservationV0_1({
    writer,
    requestedRowsWritten,
    requestedRowsRead,
    availableRowsWrittenBeforeRequest: writeHeadroomBeforeRequest,
  });

  if (!["RESERVATION_RESOLVED", "READ_ONLY"].includes(reservation.state)) {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze([
        reservation.state === "RESERVATION_UNKNOWN"
          ? "WRITER_RESERVATION_UNKNOWN"
          : "WRITER_RESERVATION_EXCEEDS_AVAILABLE_HEADROOM",
      ]),
      adaptiveMaxDates: reservation.adaptiveMaxDates,
      requestedRowsWritten: reservation.requestedRowsWritten,
      requestedRowsRead: reservation.requestedRowsRead,
      rowsWrittenUsed: usedWritten,
      rowsReadUsed: usedRead,
      system1ReserveRows: system1Reserve,
      protectedDailyShadowReserveRows: reserveForDailyShadow,
      launchAcceptanceReserveRows: launchReserve,
      outstandingReservedRowsWritten: outstanding,
      writeHeadroomBeforeRequest,
      paidUpgradeAuthorized: false,
    });
  }

  const requestedWritten = nonNegativeInteger(
    reservation.requestedRowsWritten,
    "reservation.requestedRowsWritten",
  );
  const requestedRead = nonNegativeInteger(
    reservation.requestedRowsRead,
    "reservation.requestedRowsRead",
  );
  const projectedWritten = usedWritten
    + outstanding
    + system1Reserve
    + reserveForDailyShadow
    + launchReserve
    + requestedWritten
    + D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE;
  const projectedRead = usedRead + requestedRead;

  if (
    projectedWritten > D1_FREE_LIMITS.rowsWrittenPerUtcDay
    || projectedRead > D1_FREE_LIMITS.rowsReadPerUtcDay
  ) {
    return Object.freeze({
      state: "QUOTA_BUDGET_DEFER",
      physicalAllowed: false,
      quotaDay: accountUsage.quotaDay,
      reasonCodes: Object.freeze([
        projectedWritten > D1_FREE_LIMITS.rowsWrittenPerUtcDay
          ? "ROWS_WRITTEN_DAILY_BUDGET_EXCEEDED"
          : "ROWS_READ_DAILY_BUDGET_EXCEEDED",
      ]),
      adaptiveMaxDates: reservation.adaptiveMaxDates,
      requestedRowsWritten: requestedWritten,
      requestedRowsRead: requestedRead,
      projectedRowsWritten: projectedWritten,
      projectedRowsRead: projectedRead,
      rowsWrittenUsed: usedWritten,
      rowsReadUsed: usedRead,
      system1ReserveRows: system1Reserve,
      protectedDailyShadowReserveRows: reserveForDailyShadow,
      launchAcceptanceReserveRows: launchReserve,
      outstandingReservedRowsWritten: outstanding,
      quotaLedgerRowsWrittenReserve: D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE,
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
    reservationSource: reservation.source,
    requestedRowsWritten: requestedWritten,
    requestedRowsRead: requestedRead,
    adaptiveMaxDates: reservation.adaptiveMaxDates,
    rowsWrittenUsed: usedWritten,
    rowsReadUsed: usedRead,
    system1ReserveRows: system1Reserve,
    protectedDailyShadowReserveRows: reserveForDailyShadow,
    launchAcceptanceReserveRows: launchReserve,
    outstandingReservedRowsWritten: outstanding,
    quotaLedgerRowsWrittenReserve: D1_QUOTA_LEDGER_ROWS_WRITTEN_RESERVE,
    projectedRowsWritten: projectedWritten,
    projectedRowsRead: projectedRead,
    rowsWrittenLimit: D1_FREE_LIMITS.rowsWrittenPerUtcDay,
    rowsReadLimit: D1_FREE_LIMITS.rowsReadPerUtcDay,
    paidUpgradeAuthorized: false,
  });
}

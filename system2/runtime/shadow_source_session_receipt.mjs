import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const ROLES = new Set(["REQUIRED", "OPTIONAL", "CONTEXT_ONLY"]);
const SOURCE_STATES = new Set(["KNOWN", "UNKNOWN", "STALE", "INVALID", "NOT_APPLICABLE"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function normalizeExpected(rows) {
  if (!Array.isArray(rows)) throw new Error("expectedSources must be an array");
  const seen = new Set();
  return rows.map((row, i) => {
    if (!row || typeof row !== "object") throw new Error(`expectedSources[${i}] is required`);
    const sourceId = requiredText(row.sourceId, `expectedSources[${i}].sourceId`);
    if (seen.has(sourceId)) throw new Error(`duplicate expected source: ${sourceId}`);
    seen.add(sourceId);
    const role = requiredText(row.role, `expectedSources[${i}].role`);
    if (!ROLES.has(role)) throw new Error(`unsupported source role: ${role}`);
    return {
      sourceId,
      sourceVersion: row.sourceVersion ? requiredText(row.sourceVersion, `expectedSources[${i}].sourceVersion`) : undefined,
      role,
      allowNotApplicable: row.allowNotApplicable === true,
    };
  });
}

function normalizeObserved(rows, decisionTimestamp) {
  if (!Array.isArray(rows)) throw new Error("observedSources must be an array");
  const seen = new Set();
  return rows.map((row, i) => {
    if (!row || typeof row !== "object") throw new Error(`observedSources[${i}] is required`);
    const sourceId = requiredText(row.sourceId, `observedSources[${i}].sourceId`);
    if (seen.has(sourceId)) throw new Error(`duplicate observed source: ${sourceId}`);
    seen.add(sourceId);

    const state = requiredText(row.state, `observedSources[${i}].state`);
    if (!SOURCE_STATES.has(state)) throw new Error(`unsupported source state: ${state}`);

    const availableAt = row.availableAt ? requiredText(row.availableAt, `observedSources[${i}].availableAt`) : null;
    const capturedAt = requiredText(row.capturedAt, `observedSources[${i}].capturedAt`);
    if (!Number.isFinite(Date.parse(capturedAt))) throw new Error("source capturedAt must be timestamp");
    if (availableAt && !Number.isFinite(Date.parse(availableAt))) throw new Error("source availableAt must be timestamp");

    const pitEligible = row.pointInTimeEligible === true;
    const pitFutureViolation =
      pitEligible &&
      availableAt &&
      Date.parse(availableAt) > Date.parse(decisionTimestamp);

    return {
      sourceId,
      sourceVersion: row.sourceVersion ? requiredText(row.sourceVersion, `observedSources[${i}].sourceVersion`) : undefined,
      state,
      sourceDate: row.sourceDate || undefined,
      availableAt,
      capturedAt,
      pointInTimeEligible:
        row.pointInTimeEligible === true
          ? true
          : row.pointInTimeEligible === false
            ? false
            : null,
      payloadHash: row.payloadHash || undefined,
      semanticVersion: row.semanticVersion || undefined,
      pitFutureViolation,
      warnings: Object.freeze([...(row.warnings || [])].map(String)),
    };
  });
}

export async function buildShadowSourceSessionReceipt({
  receiptId,
  marketDate,
  decisionTimestamp,
  expectedSources = [],
  observedSources = [],
  capturedAt,
} = {}) {
  const ts = requiredText(decisionTimestamp, "decisionTimestamp");
  if (!Number.isFinite(Date.parse(ts))) throw new Error("decisionTimestamp must be a timestamp");

  const expected = normalizeExpected(expectedSources);
  const observed = normalizeObserved(observedSources, ts);
  const byObserved = new Map(observed.map((x) => [x.sourceId, x]));

  const requiredBlockers = [];
  const optionalGaps = [];
  const sourceRows = expected.map((exp) => {
    const obs = byObserved.get(exp.sourceId);
    let readiness = "READY";

    if (!obs) readiness = "MISSING";
    else if (obs.pitFutureViolation) readiness = "PIT_FUTURE_VIOLATION";
    else if (obs.state === "KNOWN" && obs.pointInTimeEligible === true) readiness = "READY";
    else if (obs.state === "NOT_APPLICABLE" && exp.allowNotApplicable) readiness = "NOT_APPLICABLE_ALLOWED";
    else if (obs.state === "NOT_APPLICABLE") readiness = "NOT_APPLICABLE_BLOCKED";
    else if (obs.state === "KNOWN" && obs.pointInTimeEligible !== true) readiness = "PIT_NOT_ELIGIBLE";
    else readiness = obs.state;

    const row = {
      ...exp,
      observed: obs || null,
      readiness,
    };

    const acceptable = readiness === "READY" || readiness === "NOT_APPLICABLE_ALLOWED";
    if (!acceptable) {
      if (exp.role === "REQUIRED") requiredBlockers.push({
        sourceId: exp.sourceId,
        readiness,
      });
      else optionalGaps.push({
        sourceId: exp.sourceId,
        role: exp.role,
        readiness,
      });
    }

    return row;
  });

  const expectedIds = new Set(expected.map((x) => x.sourceId));
  const extraObservedSources = observed.filter((x) => !expectedIds.has(x.sourceId));

  const sourceSessionState =
    requiredBlockers.length === 0 ? "SOURCE_SESSION_READY" : "SOURCE_SESSION_INCOMPLETE";

  const base = {
    receiptId: requiredText(receiptId, "receiptId"),
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: ts,
    sourceSessionState,
    requiredBlockers: Object.freeze(requiredBlockers),
    optionalGaps: Object.freeze(optionalGaps),
    sourceRows: Object.freeze(sourceRows),
    extraObservedSources: Object.freeze(extraObservedSources),
    expectedSourceCount: expected.length,
    observedSourceCount: observed.length,
    outcomeJoinSourceEligible: sourceSessionState === "SOURCE_SESSION_READY",
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_SOURCE_SESSION_V0_1",
  };

  const sourceSessionHash = await sha256Hex(base);
  return deepFreeze({ ...base, sourceSessionHash });
}

export { ROLES, SOURCE_STATES };

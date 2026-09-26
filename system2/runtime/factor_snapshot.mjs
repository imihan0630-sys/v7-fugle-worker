const OBSERVATION_STATES = new Set([
  "KNOWN",
  "UNKNOWN",
  "STALE",
  "INVALID",
  "NOT_APPLICABLE",
]);

const NORMALIZATION_METHODS = new Set([
  "NONE",
  "CROSS_SECTIONAL_PERCENTILE",
  "CROSS_SECTIONAL_ZSCORE",
  "TIME_SERIES_ZSCORE",
  "BOUNDED_RATIO",
  "BOOLEAN_STATE",
  "ORDINAL_STATE",
  "CUSTOM_VERSIONED",
]);

const SCOPE_VALUES = new Set(["MARKET", "INDUSTRY", "SYMBOL", "EVENT"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertMarketDate(value) {
  const date = requiredText(value, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("marketDate must be YYYY-MM-DD");
  return date;
}

function assertIsoTimestamp(value, field) {
  const text = requiredText(value, field);
  const time = Date.parse(text);
  if (!Number.isFinite(time)) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function optionalIsoTimestamp(value, field) {
  if (value === null || value === undefined || value === "") return undefined;
  return assertIsoTimestamp(value, field);
}

function assertConfidence(value) {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error("confidence must be null or within [0,1]");
  }
  return value;
}

function assertNormalizedValue(value) {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) throw new Error("normalizedValue must be finite or null");
  return value;
}

export function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

export function buildFactorObservation(input) {
  if (!input || typeof input !== "object") throw new Error("factor input is required");

  const state = requiredText(input.state, "state");
  if (!OBSERVATION_STATES.has(state)) throw new Error(`unsupported observation state: ${state}`);

  const scope = requiredText(input.scope, "scope");
  if (!SCOPE_VALUES.has(scope)) throw new Error(`unsupported factor scope: ${scope}`);

  const decisionTimestamp = assertIsoTimestamp(input.decisionTimestamp, "decisionTimestamp");
  const normalizedValue = assertNormalizedValue(input.normalizedValue);

  const normalization = input.normalization || {};
  const method = requiredText(normalization.method, "normalization.method");
  if (!NORMALIZATION_METHODS.has(method)) throw new Error(`unsupported normalization method: ${method}`);

  const provenance = input.provenance || {};
  const availableAt = optionalIsoTimestamp(provenance.availableAt, "provenance.availableAt");
  const observedAt = optionalIsoTimestamp(provenance.observedAt, "provenance.observedAt");
  const capturedAt = assertIsoTimestamp(provenance.capturedAt, "provenance.capturedAt");

  if (state !== "KNOWN" && normalizedValue !== null) {
    throw new Error("only KNOWN observations may carry normalizedValue");
  }
  if (state === "UNKNOWN" && !String(input.unknownReason || "").trim()) {
    throw new Error("UNKNOWN observation requires unknownReason");
  }
  if (provenance.pointInTimeEligible === true) {
    if (!availableAt) throw new Error("PIT-eligible observation requires availableAt");
    if (Date.parse(availableAt) > Date.parse(decisionTimestamp)) {
      throw new Error("availableAt cannot be later than decisionTimestamp for PIT-eligible observation");
    }
  }

  return deepFreeze({
    factorId: requiredText(input.factorId, "factorId"),
    factorVersion: requiredText(input.factorVersion, "factorVersion"),
    scope,
    scopeKey: requiredText(input.scopeKey, "scopeKey"),
    marketDate: assertMarketDate(input.marketDate),
    decisionTimestamp,
    state,
    rawValue: input.rawValue ?? null,
    normalizedValue,
    confidence: assertConfidence(input.confidence),
    provenance: {
      sourceId: requiredText(provenance.sourceId, "provenance.sourceId"),
      sourceName: requiredText(provenance.sourceName, "provenance.sourceName"),
      sourceUrl: provenance.sourceUrl || undefined,
      sourceDate: provenance.sourceDate || undefined,
      observedAt,
      availableAt,
      capturedAt,
      pointInTimeEligible:
        provenance.pointInTimeEligible === true
          ? true
          : provenance.pointInTimeEligible === false
            ? false
            : null,
      payloadHash: provenance.payloadHash || undefined,
    },
    normalization: {
      method,
      normalizationVersion: requiredText(
        normalization.normalizationVersion,
        "normalization.normalizationVersion",
      ),
      referenceUniverse: normalization.referenceUniverse || undefined,
      referenceWindow: normalization.referenceWindow || undefined,
      lowerBound: Number.isFinite(normalization.lowerBound) ? normalization.lowerBound : undefined,
      upperBound: Number.isFinite(normalization.upperBound) ? normalization.upperBound : undefined,
    },
    unknownReason: input.unknownReason || undefined,
    qualityFlags: Object.freeze([...(input.qualityFlags || [])].map(String)),
  });
}

export function buildMarketRegimeSnapshot(input) {
  if (!input || typeof input !== "object") throw new Error("regime input is required");
  const allowedState = (value, field) => {
    const state = requiredText(value, field);
    if (!OBSERVATION_STATES.has(state)) throw new Error(`${field} has unsupported state`);
    return state;
  };

  return deepFreeze({
    regimeSnapshotId: requiredText(input.regimeSnapshotId, "regimeSnapshotId"),
    marketDate: assertMarketDate(input.marketDate),
    decisionTimestamp: assertIsoTimestamp(input.decisionTimestamp, "decisionTimestamp"),
    labels: Object.freeze([...(input.labels || ["UNKNOWN"])].map(String)),
    taiwanIndexState: allowedState(input.taiwanIndexState, "taiwanIndexState"),
    breadthState: allowedState(input.breadthState, "breadthState"),
    liquidityState: allowedState(input.liquidityState, "liquidityState"),
    volatilityState: allowedState(input.volatilityState, "volatilityState"),
    leadershipState: allowedState(input.leadershipState, "leadershipState"),
    sectorRotationState: allowedState(input.sectorRotationState, "sectorRotationState"),
    globalMacroState: allowedState(input.globalMacroState, "globalMacroState"),
    factorRefs: Object.freeze([...(input.factorRefs || [])].map(String)),
    warnings: Object.freeze([...(input.warnings || [])].map(String)),
  });
}

export { OBSERVATION_STATES, NORMALIZATION_METHODS };

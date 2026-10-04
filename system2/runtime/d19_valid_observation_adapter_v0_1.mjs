import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D19_VALID_OBSERVATION_VERSION_V0_1 = "D19_04_VALID_OBSERVATION_CONTRACT_V0_1";

export const D19_OBSERVATION_STATES_V0_1 = Object.freeze({
  ELIGIBLE_VALID_PRICE_SESSION: "ELIGIBLE_VALID_PRICE_SESSION",
  VERIFIED_NONTRADING_OR_EXCLUDED_SESSION: "VERIFIED_NONTRADING_OR_EXCLUDED_SESSION",
  OFFICIAL_ZERO_TRADE_ROW: "OFFICIAL_ZERO_TRADE_ROW",
  UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE: "UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE",
  SOURCE_UNKNOWN: "SOURCE_UNKNOWN",
});

export const D19_WINDOW_POLICIES_V0_1 = Object.freeze({
  CALENDAR_20_STRICT_V0_1: "CALENDAR_20_STRICT_V0_1",
  VALID_OBSERVATION_20_V0_1: "VALID_OBSERVATION_20_V0_1",
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(`${field} must be YYYY-MM-DD`);
  return text;
}

function finiteOrNull(value) {
  return Number.isFinite(value) ? Number(value) : null;
}

function nonNegativeOrNull(value) {
  const number = finiteOrNull(value);
  if (number === null) return null;
  if (number < 0) throw new Error("activity fields must be non-negative");
  return number;
}

function positiveClose(value) {
  return Number.isFinite(value) && Number(value) > 0 ? Number(value) : null;
}

function evidenceHash(value, field) {
  if (value === null || value === undefined || value === "") return null;
  return requiredText(value, field);
}

function classifyActivity(row) {
  const volumeShares = nonNegativeOrNull(row?.volumeShares);
  const tradeValue = nonNegativeOrNull(row?.tradeValue);
  const transactions = nonNegativeOrNull(row?.transactions);
  const allKnown = [volumeShares, tradeValue, transactions].every(Number.isFinite);
  const zero = allKnown && volumeShares === 0 && tradeValue === 0 && transactions === 0;
  const positive = [volumeShares, tradeValue, transactions].some((x) => Number.isFinite(x) && x > 0);
  return { volumeShares, tradeValue, transactions, allKnown, zero, positive };
}

function normalizeExternalSessionEvidence(raw, marketDate) {
  if (!raw) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("externalSessionEvidence must be an object");
  }
  const state = requiredText(raw.state, "externalSessionEvidence.state");
  if (state !== D19_OBSERVATION_STATES_V0_1.VERIFIED_NONTRADING_OR_EXCLUDED_SESSION) {
    throw new Error("externalSessionEvidence may only assert VERIFIED_NONTRADING_OR_EXCLUDED_SESSION");
  }
  const evidenceMarketDate = isoDate(raw.marketDate, "externalSessionEvidence.marketDate");
  if (evidenceMarketDate !== marketDate) {
    throw new Error("externalSessionEvidence marketDate mismatch");
  }
  const sourceHash = requiredText(raw.sourceHash, "externalSessionEvidence.sourceHash");
  const reasonCode = requiredText(raw.reasonCode, "externalSessionEvidence.reasonCode");
  return deepFreeze({
    state,
    marketDate: evidenceMarketDate,
    sourceHash,
    reasonCode,
    sourceId: requiredText(raw.sourceId, "externalSessionEvidence.sourceId"),
  });
}

export async function classifyD19ObservationV0_1({
  market,
  symbol,
  marketDate,
  sourceRow = null,
  externalSessionEvidence = null,
} = {}) {
  const mkt = requiredText(market, "market");
  const sym = requiredText(symbol, "symbol");
  const date = isoDate(marketDate, "marketDate");
  const external = normalizeExternalSessionEvidence(externalSessionEvidence, date);

  if (external) {
    const base = {
      observationVersion: D19_VALID_OBSERVATION_VERSION_V0_1,
      market: mkt,
      symbol: sym,
      marketDate: date,
      state: D19_OBSERVATION_STATES_V0_1.VERIFIED_NONTRADING_OR_EXCLUDED_SESSION,
      close: null,
      sourceRowHash: sourceRow ? evidenceHash(sourceRow.sourceRowHash, "sourceRow.sourceRowHash") : null,
      externalSessionEvidence: external,
      reasonCode: external.reasonCode,
      countsAsValidPriceObservation: false,
      factorReturnValueMayUseClose: false,
      localSuspensionInferencePerformed: false,
      forwardFillPerformed: false,
      previousCloseSubstitutionPerformed: false,
    };
    return deepFreeze({ ...base, observationHash: await sha256Hex(base) });
  }

  if (!sourceRow || typeof sourceRow !== "object" || Array.isArray(sourceRow)) {
    const base = {
      observationVersion: D19_VALID_OBSERVATION_VERSION_V0_1,
      market: mkt,
      symbol: sym,
      marketDate: date,
      state: D19_OBSERVATION_STATES_V0_1.SOURCE_UNKNOWN,
      close: null,
      sourceRowHash: null,
      externalSessionEvidence: null,
      reasonCode: "SOURCE_ROW_ABSENT",
      countsAsValidPriceObservation: false,
      factorReturnValueMayUseClose: false,
      localSuspensionInferencePerformed: false,
      forwardFillPerformed: false,
      previousCloseSubstitutionPerformed: false,
    };
    return deepFreeze({ ...base, observationHash: await sha256Hex(base) });
  }

  if (sourceRow.marketDate && isoDate(sourceRow.marketDate, "sourceRow.marketDate") !== date) {
    throw new Error("sourceRow marketDate mismatch");
  }
  if (sourceRow.market && requiredText(sourceRow.market, "sourceRow.market") !== mkt) {
    throw new Error("sourceRow market mismatch");
  }
  if (sourceRow.symbol && requiredText(sourceRow.symbol, "sourceRow.symbol") !== sym) {
    throw new Error("sourceRow symbol mismatch");
  }

  const sourceRowHash = evidenceHash(sourceRow.sourceRowHash, "sourceRow.sourceRowHash");
  const close = positiveClose(sourceRow.close);
  const activity = classifyActivity(sourceRow);
  const allOhlcNull = [sourceRow.open, sourceRow.high, sourceRow.low, sourceRow.close]
    .every((x) => x === null || x === undefined);

  let state;
  let reasonCode;
  if (close !== null && sourceRowHash) {
    state = D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION;
    reasonCode = "VALID_POSITIVE_CLOSE_WITH_SOURCE_HASH";
  } else if (activity.zero && allOhlcNull && sourceRowHash) {
    state = D19_OBSERVATION_STATES_V0_1.OFFICIAL_ZERO_TRADE_ROW;
    reasonCode = "OFFICIAL_ZERO_ACTIVITY_NULL_OHLC";
  } else if (activity.positive && close === null && sourceRowHash) {
    state = D19_OBSERVATION_STATES_V0_1.UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE;
    reasonCode = "POSITIVE_ACTIVITY_WITHOUT_ADMISSIBLE_CLOSE";
  } else {
    state = D19_OBSERVATION_STATES_V0_1.SOURCE_UNKNOWN;
    reasonCode = sourceRowHash ? "UNCLASSIFIED_SOURCE_ROW_SEMANTICS" : "SOURCE_ROW_HASH_MISSING";
  }

  const base = {
    observationVersion: D19_VALID_OBSERVATION_VERSION_V0_1,
    market: mkt,
    symbol: sym,
    marketDate: date,
    state,
    close: state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION ? close : null,
    sourceRowHash,
    externalSessionEvidence: null,
    reasonCode,
    activity,
    allOhlcNull,
    countsAsValidPriceObservation: state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION,
    factorReturnValueMayUseClose: state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION,
    localSuspensionInferencePerformed: false,
    forwardFillPerformed: false,
    previousCloseSubstitutionPerformed: false,
  };
  return deepFreeze({ ...base, observationHash: await sha256Hex(base) });
}

function normalizeObservations(observations, decisionMarketDate) {
  if (!Array.isArray(observations) || !observations.length) {
    throw new Error("observations must be a non-empty array");
  }
  const decision = isoDate(decisionMarketDate, "decisionMarketDate");
  const sorted = [...observations].sort((a, b) => a.marketDate.localeCompare(b.marketDate));
  const seen = new Set();
  for (const observation of sorted) {
    if (!observation || typeof observation !== "object") throw new Error("invalid observation");
    if (!Object.values(D19_OBSERVATION_STATES_V0_1).includes(observation.state)) {
      throw new Error("unsupported observation state");
    }
    const date = isoDate(observation.marketDate, "observation.marketDate");
    if (date > decision) throw new Error("observation after decisionMarketDate");
    if (seen.has(date)) throw new Error("duplicate observation marketDate");
    seen.add(date);
    if (!observation.observationHash) throw new Error("observationHash is required");
    if (
      observation.state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION
      && (!Number.isFinite(observation.close) || observation.close <= 0)
    ) {
      throw new Error("valid price observation requires positive close");
    }
    if (
      observation.state !== D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION
      && observation.close !== null
      && observation.close !== undefined
    ) {
      throw new Error("non-price observation must not carry close");
    }
  }
  return { decision, sorted };
}

function stateCounts(observations) {
  const counts = {};
  for (const state of Object.values(D19_OBSERVATION_STATES_V0_1)) counts[state] = 0;
  for (const observation of observations) counts[observation.state] += 1;
  return counts;
}

function blockersFromWindow(window) {
  const out = [];
  for (const observation of window) {
    if (observation.state === D19_OBSERVATION_STATES_V0_1.UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE) {
      out.push(`UNRESOLVED_PRICE_SEMANTICS:${observation.marketDate}`);
    }
    if (observation.state === D19_OBSERVATION_STATES_V0_1.SOURCE_UNKNOWN) {
      out.push(`SOURCE_UNKNOWN:${observation.marketDate}`);
    }
  }
  return out;
}

export async function evaluateD19MomentumWindowV0_1({
  market,
  symbol,
  decisionMarketDate,
  policyId,
  observations,
  maxCalendarSpanSessions = null,
  policyParameters = {},
} = {}) {
  const mkt = requiredText(market, "market");
  const sym = requiredText(symbol, "symbol");
  const policy = requiredText(policyId, "policyId");
  if (!Object.values(D19_WINDOW_POLICIES_V0_1).includes(policy)) {
    throw new Error("unsupported policyId");
  }

  const { decision, sorted } = normalizeObservations(observations, decisionMarketDate);
  const decisionObservation = sorted.find((x) => x.marketDate === decision) || null;
  const commonBlockers = [];
  if (!decisionObservation) commonBlockers.push("DECISION_SESSION_OBSERVATION_MISSING");
  else if (decisionObservation.state !== D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION) {
    commonBlockers.push(`DECISION_SESSION_NOT_VALID_PRICE:${decisionObservation.state}`);
  }

  let window = [];
  let valid = [];
  let returnValue = null;
  let state = "INCOMPLETE";
  let blockerCodes = [...commonBlockers];

  if (policy === D19_WINDOW_POLICIES_V0_1.CALENDAR_20_STRICT_V0_1) {
    window = sorted.slice(-21);
    if (window.length !== 21) blockerCodes.push("INSUFFICIENT_OFFICIAL_MARKET_SESSIONS");
    blockerCodes.push(...blockersFromWindow(window));
    const nonValid = window.filter(
      (x) => x.state !== D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION,
    );
    if (nonValid.length) {
      blockerCodes.push(...nonValid.map((x) => `STRICT_WINDOW_NON_PRICE_STATE:${x.marketDate}:${x.state}`));
    }
    valid = window.filter(
      (x) => x.state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION,
    );
    if (!blockerCodes.length && window.length === 21) {
      returnValue = window.at(-1).close / window[0].close - 1;
      state = "READY";
    }
  } else {
    if (!Number.isInteger(maxCalendarSpanSessions) || maxCalendarSpanSessions < 21) {
      blockerCodes.push("MAX_CALENDAR_SPAN_SESSIONS_REQUIRED");
    }
    const reversed = [...sorted].reverse();
    const selected = [];
    const scanned = [];
    for (const observation of reversed) {
      scanned.push(observation);
      if (
        observation.state === D19_OBSERVATION_STATES_V0_1.UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE
        || observation.state === D19_OBSERVATION_STATES_V0_1.SOURCE_UNKNOWN
      ) {
        blockerCodes.push(...blockersFromWindow([observation]));
        break;
      }
      if (observation.state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION) {
        selected.push(observation);
        if (selected.length === 21) break;
      }
    }
    window = scanned.reverse();
    valid = selected.reverse();
    if (valid.length < 21) blockerCodes.push("INSUFFICIENT_VALID_PRICE_OBSERVATIONS");
    if (
      Number.isInteger(maxCalendarSpanSessions)
      && window.length > maxCalendarSpanSessions
    ) {
      blockerCodes.push(`CALENDAR_SPAN_EXCEEDED:${window.length}>${maxCalendarSpanSessions}`);
    }
    if (!blockerCodes.length && valid.length === 21) {
      returnValue = valid.at(-1).close / valid[0].close - 1;
      state = "READY";
    }
  }

  blockerCodes = [...new Set(blockerCodes)].sort();
  const counts = stateCounts(window);
  const inputSourceHashes = [...new Set(
    window.map((x) => x.sourceRowHash).filter(Boolean),
  )].sort();
  const sessionEvidenceHashes = [...new Set(
    window.map((x) => x.externalSessionEvidence?.sourceHash).filter(Boolean),
  )].sort();
  const base = {
    receiptType: "D19_04_MOMENTUM_WINDOW_RECEIPT_V0_1",
    observationVersion: D19_VALID_OBSERVATION_VERSION_V0_1,
    market: mkt,
    symbol: sym,
    decisionMarketDate: decision,
    policyId: policy,
    state,
    stateCounts: counts,
    validObservationCount: valid.length,
    marketSessionCountScanned: window.length,
    firstValidMarketDate: valid[0]?.marketDate ?? null,
    lastValidMarketDate: valid.at(-1)?.marketDate ?? null,
    returnValue,
    inputSourceHashes,
    sessionEvidenceHashes,
    blockerCodes,
    policyParameters: deepFreeze({
      ...policyParameters,
      maxCalendarSpanSessions:
        policy === D19_WINDOW_POLICIES_V0_1.VALID_OBSERVATION_20_V0_1
          ? maxCalendarSpanSessions
          : null,
    }),
    forwardFillPerformed: false,
    previousCloseSubstitutionPerformed: false,
    zeroTradeConvertedToReturnZero: false,
    formalSelectionAuthorized: false,
    productionImpact: false,
  };
  return deepFreeze({ ...base, receiptHash: await sha256Hex(base) });
}

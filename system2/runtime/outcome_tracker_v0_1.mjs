import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const OUTCOME_HORIZONS_V0_1 = Object.freeze([1, 3, 5, 10, 20]);
const PRICE_SPACES = new Set(["RAW", "ADJUSTED"]);
const CORPORATE_ACTION_STATES = new Set(["CLEAR", "ADJUSTED", "UNKNOWN"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function positiveNumber(value, field, { optional = false } = {}) {
  if ((value === null || value === undefined) && optional) return null;
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${field} must be positive`);
  return Number(value);
}

function finiteOrNull(value, field) {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite or null`);
  return Number(value);
}

function simpleReturn(end, start) {
  return Number.isFinite(end) && Number.isFinite(start) && start > 0
    ? end / start - 1
    : null;
}

function normalizeSessions(sessions, decisionMarketDate, updatedAt, priceSpace) {
  if (!Array.isArray(sessions)) throw new Error("sessions must be an array");
  const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
  const out = [];
  let expected = 1;

  for (let i = 0; i < sorted.length; i += 1) {
    const raw = sorted[i];
    if (!raw || typeof raw !== "object") throw new Error(`sessions[${i}] is required`);
    if (!Number.isInteger(raw.sessionNumber) || raw.sessionNumber !== expected) {
      throw new Error("sessions must be contiguous and numbered from 1");
    }
    expected += 1;

    const marketDate = requiredText(raw.marketDate, `sessions[${i}].marketDate`);
    if (marketDate <= decisionMarketDate) {
      throw new Error("outcome session must be after decision marketDate");
    }
    const availableAt = timestamp(raw.availableAt, `sessions[${i}].availableAt`);
    if (Date.parse(availableAt) > Date.parse(updatedAt)) {
      throw new Error("outcome session is not available by updatedAt");
    }
    const rowPriceSpace = raw.priceSpace
      ? requiredText(raw.priceSpace, `sessions[${i}].priceSpace`)
      : priceSpace;
    if (rowPriceSpace !== priceSpace) throw new Error("mixed price spaces are not allowed");

    const open = finiteOrNull(raw.open, `sessions[${i}].open`);
    const high = finiteOrNull(raw.high, `sessions[${i}].high`);
    const low = finiteOrNull(raw.low, `sessions[${i}].low`);
    const close = finiteOrNull(raw.close, `sessions[${i}].close`);
    for (const [name, value] of Object.entries({ open, high, low, close })) {
      if (value !== null && value <= 0) throw new Error(`sessions[${i}].${name} must be positive`);
    }
    if (
      [open, high, low, close].every(Number.isFinite)
      && (high < low || high < open || high < close || low > open || low > close)
    ) {
      throw new Error(`sessions[${i}] has inconsistent OHLC`);
    }

    out.push({
      sessionNumber: raw.sessionNumber,
      marketDate,
      availableAt,
      priceSpace,
      open,
      high,
      low,
      close,
      benchmarkClose: finiteOrNull(raw.benchmarkClose, `sessions[${i}].benchmarkClose`),
      industryClose: finiteOrNull(raw.industryClose, `sessions[${i}].industryClose`),
      sourceId: raw.sourceId ? requiredText(raw.sourceId, `sessions[${i}].sourceId`) : null,
      sourceHash: raw.sourceHash ? requiredText(raw.sourceHash, `sessions[${i}].sourceHash`) : null,
    });
  }

  return out;
}

function firstFiniteTarget(entryPlan) {
  for (const value of entryPlan?.targets || []) {
    if (Number.isFinite(value) && value > 0) return Number(value);
  }
  return null;
}

function barrierObservation(sessions, entryPlan) {
  const primaryTarget = firstFiniteTarget(entryPlan);
  const stopPrice = Number.isFinite(entryPlan?.stopPrice) && entryPlan.stopPrice > 0
    ? Number(entryPlan.stopPrice)
    : null;

  let targetHitSession = null;
  let stopHitSession = null;

  for (const row of sessions) {
    if (
      targetHitSession === null
      && primaryTarget !== null
      && Number.isFinite(row.high)
      && row.high >= primaryTarget
    ) {
      targetHitSession = row.sessionNumber;
    }
    if (
      stopHitSession === null
      && stopPrice !== null
      && Number.isFinite(row.low)
      && row.low <= stopPrice
    ) {
      stopHitSession = row.sessionNumber;
    }
  }

  let firstBarrier = "NONE";
  let firstBarrierSession = null;
  let ambiguousSameBar = false;

  if (targetHitSession !== null || stopHitSession !== null) {
    if (targetHitSession !== null && stopHitSession !== null && targetHitSession === stopHitSession) {
      firstBarrier = "AMBIGUOUS_SAME_BAR";
      firstBarrierSession = targetHitSession;
      ambiguousSameBar = true;
    } else if (stopHitSession === null || (
      targetHitSession !== null && targetHitSession < stopHitSession
    )) {
      firstBarrier = "TARGET_FIRST";
      firstBarrierSession = targetHitSession;
    } else {
      firstBarrier = "STOP_FIRST";
      firstBarrierSession = stopHitSession;
    }
  }

  return {
    primaryTarget,
    stopPrice,
    targetHitSession,
    stopHitSession,
    firstBarrier,
    firstBarrierSession,
    ambiguousSameBar,
    semantics: "DAILY_OHLC_BARRIER_OBSERVATION_NOT_SIMULATED_FILL",
  };
}

function normalizeCostScenarios(costScenarios) {
  if (!Array.isArray(costScenarios)) throw new Error("costScenarios must be an array");
  const seen = new Set();
  return costScenarios.map((raw, i) => {
    if (!raw || typeof raw !== "object") throw new Error(`costScenarios[${i}] is required`);
    const scenarioId = requiredText(raw.scenarioId, `costScenarios[${i}].scenarioId`);
    if (seen.has(scenarioId)) throw new Error(`duplicate cost scenario: ${scenarioId}`);
    seen.add(scenarioId);
    if (!Number.isFinite(raw.roundTripCostRate) || raw.roundTripCostRate < 0) {
      throw new Error(`costScenarios[${i}].roundTripCostRate must be non-negative`);
    }
    return {
      scenarioId,
      roundTripCostRate: Number(raw.roundTripCostRate),
      note: raw.note ? String(raw.note) : null,
    };
  });
}

function horizonMap(sessions, referencePrice, benchmarkReference, industryReference) {
  const stock = {};
  const benchmark = {};
  const industry = {};
  const relativeBenchmark = {};
  const relativeIndustry = {};

  for (const horizon of OUTCOME_HORIZONS_V0_1) {
    const row = sessions.find((x) => x.sessionNumber === horizon);
    const key = `D${horizon}`;
    const stockReturn = row ? simpleReturn(row.close, referencePrice) : null;
    const benchmarkReturn = row && benchmarkReference !== null
      ? simpleReturn(row.benchmarkClose, benchmarkReference)
      : null;
    const industryReturn = row && industryReference !== null
      ? simpleReturn(row.industryClose, industryReference)
      : null;

    stock[key] = stockReturn;
    benchmark[key] = benchmarkReturn;
    industry[key] = industryReturn;
    relativeBenchmark[key] = stockReturn !== null && benchmarkReturn !== null
      ? stockReturn - benchmarkReturn
      : null;
    relativeIndustry[key] = stockReturn !== null && industryReturn !== null
      ? stockReturn - industryReturn
      : null;
  }

  return { stock, benchmark, industry, relativeBenchmark, relativeIndustry };
}

function excursion(sessions, referencePrice) {
  const rows = sessions.filter((x) => x.sessionNumber <= 20);
  const favorable = rows
    .filter((x) => Number.isFinite(x.high))
    .map((x) => simpleReturn(x.high, referencePrice));
  const adverse = rows
    .filter((x) => Number.isFinite(x.low))
    .map((x) => simpleReturn(x.low, referencePrice));
  return {
    mfe: favorable.length ? Math.max(...favorable) : null,
    mae: adverse.length ? Math.min(...adverse) : null,
    evaluatedThroughSession: rows.length ? rows.at(-1).sessionNumber : 0,
  };
}

function costScenarioReturns(horizonReturns, costScenarios) {
  return Object.fromEntries(costScenarios.map((scenario) => [
    scenario.scenarioId,
    {
      roundTripCostRate: scenario.roundTripCostRate,
      horizonReturns: Object.fromEntries(
        Object.entries(horizonReturns).map(([key, value]) => [
          key,
          value === null ? null : value - scenario.roundTripCostRate,
        ]),
      ),
      semantics: "SIGNAL_RETURN_MINUS_COST_SCENARIO_NOT_REALIZED_FILL_RETURN",
    },
  ]));
}

export async function buildDecisionOutcomeSnapshotV0_1({
  decisionId,
  symbol,
  decisionMarketDate,
  decisionTimestamp,
  referencePrice,
  referencePriceType = "DECISION_CLOSE",
  entryPlan = {},
  sessions = [],
  benchmarkReferenceClose = null,
  industryReferenceClose = null,
  costScenarios = [],
  priceSpace,
  corporateActionState = "UNKNOWN",
  updatedAt,
  simulatedExecution = null,
} = {}) {
  const id = requiredText(decisionId, "decisionId");
  const code = requiredText(symbol, "symbol");
  const date = requiredText(decisionMarketDate, "decisionMarketDate");
  const decisionTime = timestamp(decisionTimestamp, "decisionTimestamp");
  const asOf = timestamp(updatedAt, "updatedAt");
  if (Date.parse(asOf) < Date.parse(decisionTime)) {
    throw new Error("updatedAt cannot be earlier than decisionTimestamp");
  }

  const ref = positiveNumber(referencePrice, "referencePrice");
  const space = requiredText(priceSpace, "priceSpace");
  if (!PRICE_SPACES.has(space)) throw new Error("unsupported priceSpace");
  const caState = requiredText(corporateActionState, "corporateActionState");
  if (!CORPORATE_ACTION_STATES.has(caState)) {
    throw new Error("unsupported corporateActionState");
  }

  const benchmarkRef = positiveNumber(
    benchmarkReferenceClose,
    "benchmarkReferenceClose",
    { optional: true },
  );
  const industryRef = positiveNumber(
    industryReferenceClose,
    "industryReferenceClose",
    { optional: true },
  );
  const normalizedSessions = normalizeSessions(sessions, date, asOf, space);
  const normalizedCosts = normalizeCostScenarios(costScenarios);
  const returns = horizonMap(normalizedSessions, ref, benchmarkRef, industryRef);
  const excursions = excursion(normalizedSessions, ref);
  const barriers = barrierObservation(normalizedSessions, entryPlan);

  let sim = null;
  if (simulatedExecution !== null) {
    if (!simulatedExecution || typeof simulatedExecution !== "object") {
      throw new Error("simulatedExecution must be an object or null");
    }
    sim = {
      state: requiredText(simulatedExecution.state, "simulatedExecution.state"),
      realizedReturnAfterCost: finiteOrNull(
        simulatedExecution.realizedReturnAfterCost,
        "simulatedExecution.realizedReturnAfterCost",
      ),
      holdingSessions: simulatedExecution.holdingSessions === null
        || simulatedExecution.holdingSessions === undefined
        ? null
        : Number(simulatedExecution.holdingSessions),
      fillQuality: simulatedExecution.fillQuality
        ? requiredText(simulatedExecution.fillQuality, "simulatedExecution.fillQuality")
        : null,
      executionVersion: simulatedExecution.executionVersion
        ? requiredText(simulatedExecution.executionVersion, "simulatedExecution.executionVersion")
        : null,
    };
    if (
      sim.holdingSessions !== null
      && (!Number.isInteger(sim.holdingSessions) || sim.holdingSessions < 0)
    ) {
      throw new Error("simulatedExecution.holdingSessions must be a non-negative integer or null");
    }
  }

  const maturedHorizons = OUTCOME_HORIZONS_V0_1.filter(
    (horizon) => returns.stock[`D${horizon}`] !== null,
  );
  const warnings = [];
  if (caState === "UNKNOWN") warnings.push("CORPORATE_ACTION_STATE_UNKNOWN");
  if (benchmarkRef === null) warnings.push("BENCHMARK_REFERENCE_MISSING");
  if (industryRef === null) warnings.push("INDUSTRY_REFERENCE_MISSING");

  const performanceEligible = caState !== "UNKNOWN";
  const base = {
    decisionId: id,
    symbol: code,
    decisionMarketDate: date,
    decisionTimestamp: decisionTime,
    referencePrice: ref,
    referencePriceType: requiredText(referencePriceType, "referencePriceType"),
    priceSpace: space,
    corporateActionState: caState,
    observedSessionCount: normalizedSessions.length,
    maturedHorizons: Object.freeze(maturedHorizons),
    horizonReturns: returns.stock,
    benchmarkReturns: returns.benchmark,
    industryReturns: returns.industry,
    relativeBenchmarkReturns: returns.relativeBenchmark,
    relativeIndustryReturns: returns.relativeIndustry,
    mfe: excursions.mfe,
    mae: excursions.mae,
    excursionEvaluatedThroughSession: excursions.evaluatedThroughSession,
    barrierObservation: barriers,
    costScenarios: deepFreeze(costScenarioReturns(returns.stock, normalizedCosts)),
    simulatedExecution: sim,
    sessions: Object.freeze(normalizedSessions),
    performanceEligible,
    warnings: Object.freeze(warnings),
    updatedAt: asOf,
    schemaVersion: "S2_DECISION_OUTCOME_V0_1",
  };

  const outcomeHash = await sha256Hex(base);
  return deepFreeze({ ...base, outcomeHash });
}

export function toS2OutcomeRowV0_1(snapshot) {
  if (!snapshot || typeof snapshot !== "object") throw new Error("outcome snapshot is required");
  const h = snapshot.horizonReturns || {};
  const b = snapshot.barrierObservation || {};
  const sim = snapshot.simulatedExecution || null;

  return Object.freeze({
    decision_id: requiredText(snapshot.decisionId, "decisionId"),
    d1_return: finiteOrNull(h.D1, "horizonReturns.D1"),
    d3_return: finiteOrNull(h.D3, "horizonReturns.D3"),
    d5_return: finiteOrNull(h.D5, "horizonReturns.D5"),
    d10_return: finiteOrNull(h.D10, "horizonReturns.D10"),
    d20_return: finiteOrNull(h.D20, "horizonReturns.D20"),
    mfe: finiteOrNull(snapshot.mfe, "mfe"),
    mae: finiteOrNull(snapshot.mae, "mae"),
    target_hit_session: b.targetHitSession ?? null,
    stop_hit_session: b.stopHitSession ?? null,
    ambiguous_same_bar: b.ambiguousSameBar ? 1 : 0,
    realized_return_after_cost: sim
      ? finiteOrNull(sim.realizedReturnAfterCost, "simulatedExecution.realizedReturnAfterCost")
      : null,
    holding_sessions: sim?.holdingSessions ?? null,
    outcome_json: JSON.stringify(snapshot),
    updated_at: requiredText(snapshot.updatedAt, "updatedAt"),
  });
}

function equalNullableNumber(a, b, tolerance = 1e-12) {
  if (a === null || a === undefined) return b === null || b === undefined;
  if (b === null || b === undefined) return false;
  return Math.abs(Number(a) - Number(b)) <= tolerance;
}

export function validateMonotonicOutcomeUpdateV0_1(existingRow, nextRow) {
  if (existingRow === null || existingRow === undefined) {
    return deepFreeze({ state: "INSERT_ALLOWED", updateAllowed: true, blockers: [] });
  }
  if (!existingRow || typeof existingRow !== "object" || !nextRow || typeof nextRow !== "object") {
    throw new Error("existingRow and nextRow must be outcome row objects");
  }
  if (existingRow.decision_id !== nextRow.decision_id) {
    throw new Error("outcome update decision_id mismatch");
  }

  const blockers = [];
  for (const key of ["d1_return", "d3_return", "d5_return", "d10_return", "d20_return"]) {
    const oldValue = existingRow[key];
    const nextValue = nextRow[key];
    if (oldValue !== null && oldValue !== undefined && !equalNullableNumber(oldValue, nextValue)) {
      blockers.push(`IMMUTABLE_HORIZON_REVISION:${key}`);
    }
  }

  if (
    existingRow.target_hit_session !== null
    && existingRow.target_hit_session !== undefined
    && existingRow.target_hit_session !== nextRow.target_hit_session
  ) {
    blockers.push("TARGET_HIT_SESSION_REVISION");
  }
  if (
    existingRow.stop_hit_session !== null
    && existingRow.stop_hit_session !== undefined
    && existingRow.stop_hit_session !== nextRow.stop_hit_session
  ) {
    blockers.push("STOP_HIT_SESSION_REVISION");
  }
  if (Number(existingRow.ambiguous_same_bar) === 1 && Number(nextRow.ambiguous_same_bar) !== 1) {
    blockers.push("AMBIGUITY_REVISION");
  }
  if (
    existingRow.mfe !== null && existingRow.mfe !== undefined
    && nextRow.mfe !== null && nextRow.mfe !== undefined
    && Number(nextRow.mfe) + 1e-12 < Number(existingRow.mfe)
  ) {
    blockers.push("MFE_NON_MONOTONIC");
  }
  if (
    existingRow.mae !== null && existingRow.mae !== undefined
    && nextRow.mae !== null && nextRow.mae !== undefined
    && Number(nextRow.mae) - 1e-12 > Number(existingRow.mae)
  ) {
    blockers.push("MAE_NON_MONOTONIC");
  }
  if (
    existingRow.realized_return_after_cost !== null
    && existingRow.realized_return_after_cost !== undefined
    && !equalNullableNumber(
      existingRow.realized_return_after_cost,
      nextRow.realized_return_after_cost,
    )
  ) {
    blockers.push("REALIZED_RETURN_REVISION");
  }
  if (Date.parse(nextRow.updated_at) < Date.parse(existingRow.updated_at)) {
    blockers.push("UPDATED_AT_MOVED_BACKWARD");
  }

  return deepFreeze({
    state: blockers.length ? "OUTCOME_REVISION_CONFLICT" : "UPDATE_ALLOWED",
    updateAllowed: blockers.length === 0,
    blockers: Object.freeze(blockers),
  });
}

export { PRICE_SPACES, CORPORATE_ACTION_STATES };

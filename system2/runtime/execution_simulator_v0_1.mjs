import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const EXECUTION_SIMULATOR_VERSION_V0_1 = "S2_TW_DAILY_EXECUTION_SIMULATOR_V0_1";

const ENTRY_ORDER_TYPES = new Set(["BUY_STOP", "BUY_LIMIT"]);
const PRICE_SPACES = new Set(["RAW", "ADJUSTED"]);
const CORPORATE_ACTION_STATES = new Set(["CLEAR", "ADJUSTED", "UNKNOWN"]);
const TRADING_STATES = new Set(["NORMAL", "HALTED", "SUSPENDED", "NO_TRADE"]);
const LIQUIDITY_STATES = new Set(["AVAILABLE", "UNAVAILABLE", "UNKNOWN"]);
const LIMIT_STATES = new Set(["NONE", "LOCKED_UP", "LOCKED_DOWN", "UNKNOWN"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function positive(value, field) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${field} must be positive`);
  return Number(value);
}

function nonNegative(value, field) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${field} must be non-negative`);
  return Number(value);
}

function positiveInteger(value, field) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer`);
  }
  return value;
}

function finiteOrNull(value, field) {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite or null`);
  return Number(value);
}

function normalizeCostModel(raw = {}) {
  const commissionRate = nonNegative(raw.commissionRate ?? 0, "costModel.commissionRate");
  const minimumCommission = nonNegative(
    raw.minimumCommission ?? 0,
    "costModel.minimumCommission",
  );
  const transactionTaxRate = nonNegative(
    raw.transactionTaxRate ?? 0,
    "costModel.transactionTaxRate",
  );
  const entrySlippageRate = nonNegative(
    raw.entrySlippageRate ?? 0,
    "costModel.entrySlippageRate",
  );
  const exitSlippageRate = nonNegative(
    raw.exitSlippageRate ?? 0,
    "costModel.exitSlippageRate",
  );

  return {
    costModelVersion: requiredText(raw.costModelVersion, "costModel.costModelVersion"),
    taxRuleId: requiredText(raw.taxRuleId, "costModel.taxRuleId"),
    commissionRate,
    minimumCommission,
    transactionTaxRate,
    entrySlippageRate,
    exitSlippageRate,
    commissionSemantics: "MAX_RATE_OR_MINIMUM_PER_FILL",
    taxSemantics: "SELL_SIDE_ONLY",
  };
}

function normalizeSessions(sessions, {
  decisionMarketDate,
  earliestEligibleMarketDate,
  simulatedAt,
  priceSpace,
}) {
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
      throw new Error("execution session must be after decision marketDate");
    }
    if (marketDate < earliestEligibleMarketDate) {
      throw new Error("execution session precedes earliestEligibleMarketDate");
    }
    const availableAt = isoTimestamp(raw.availableAt, `sessions[${i}].availableAt`);
    if (Date.parse(availableAt) > Date.parse(simulatedAt)) {
      throw new Error("execution session is not available by simulatedAt");
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

    const officialLimitUp = finiteOrNull(
      raw.officialLimitUp,
      `sessions[${i}].officialLimitUp`,
    );
    const officialLimitDown = finiteOrNull(
      raw.officialLimitDown,
      `sessions[${i}].officialLimitDown`,
    );
    if (officialLimitUp !== null && officialLimitUp <= 0) {
      throw new Error(`sessions[${i}].officialLimitUp must be positive`);
    }
    if (officialLimitDown !== null && officialLimitDown <= 0) {
      throw new Error(`sessions[${i}].officialLimitDown must be positive`);
    }
    if (
      officialLimitUp !== null
      && officialLimitDown !== null
      && officialLimitUp < officialLimitDown
    ) {
      throw new Error(`sessions[${i}] has inverted official price limits`);
    }
    if (
      officialLimitUp !== null
      && [open, high, low, close].some((x) => x !== null && x > officialLimitUp + 1e-9)
    ) {
      throw new Error(`sessions[${i}] price exceeds officialLimitUp`);
    }
    if (
      officialLimitDown !== null
      && [open, high, low, close].some((x) => x !== null && x < officialLimitDown - 1e-9)
    ) {
      throw new Error(`sessions[${i}] price is below officialLimitDown`);
    }

    const tradingState = raw.tradingState || "NORMAL";
    const executableLiquidity = raw.executableLiquidity || "UNKNOWN";
    const limitState = raw.limitState || "UNKNOWN";
    if (!TRADING_STATES.has(tradingState)) throw new Error("unsupported tradingState");
    if (!LIQUIDITY_STATES.has(executableLiquidity)) {
      throw new Error("unsupported executableLiquidity");
    }
    if (!LIMIT_STATES.has(limitState)) throw new Error("unsupported limitState");

    out.push({
      sessionNumber: raw.sessionNumber,
      marketDate,
      availableAt,
      priceSpace,
      open,
      high,
      low,
      close,
      volumeShares: finiteOrNull(raw.volumeShares, `sessions[${i}].volumeShares`),
      tradingState,
      executableLiquidity,
      limitState,
      officialLimitUp,
      officialLimitDown,
      sourceId: raw.sourceId ? requiredText(raw.sourceId, `sessions[${i}].sourceId`) : null,
      sourceHash: raw.sourceHash ? requiredText(raw.sourceHash, `sessions[${i}].sourceHash`) : null,
    });
  }

  return out;
}

function executionBlocker(session, side) {
  if (session.tradingState !== "NORMAL") {
    return {
      fillQuality: "HALT_BLOCKED",
      reason: `TRADING_STATE_${session.tradingState}`,
    };
  }
  if (session.executableLiquidity !== "AVAILABLE") {
    if (
      (side === "BUY" && session.limitState === "LOCKED_UP")
      || (side === "SELL" && session.limitState === "LOCKED_DOWN")
    ) {
      return { fillQuality: "LIMIT_BLOCKED", reason: session.limitState };
    }
    return {
      fillQuality: session.executableLiquidity === "UNKNOWN"
        ? "DATA_UNKNOWN"
        : "LIQUIDITY_BLOCKED",
      reason: `EXECUTABLE_LIQUIDITY_${session.executableLiquidity}`,
    };
  }
  return null;
}

function entryCandidate(session, orderType, triggerPrice, limitPrice) {
  if (![session.open, session.high, session.low].every(Number.isFinite)) {
    return { state: "DATA_UNKNOWN", reason: "ENTRY_OHLC_INCOMPLETE" };
  }
  if (orderType === "BUY_STOP") {
    if (session.open >= triggerPrice) {
      return { state: "TOUCHED", rawPrice: session.open, timing: "OPEN", gap: true };
    }
    if (session.high >= triggerPrice) {
      return { state: "TOUCHED", rawPrice: triggerPrice, timing: "INTRADAY_TOUCH", gap: false };
    }
    return { state: "NOT_TOUCHED" };
  }

  if (session.open <= limitPrice) {
    return { state: "TOUCHED", rawPrice: session.open, timing: "OPEN", gap: true };
  }
  if (session.low <= limitPrice) {
    return { state: "TOUCHED", rawPrice: limitPrice, timing: "INTRADAY_TOUCH", gap: false };
  }
  return { state: "NOT_TOUCHED" };
}

function applySlippage(rawPrice, rate, side, session) {
  let price = side === "BUY" ? rawPrice * (1 + rate) : rawPrice * (1 - rate);
  const flags = [];
  if (side === "BUY" && session.officialLimitUp !== null && price > session.officialLimitUp) {
    price = session.officialLimitUp;
    flags.push("SLIPPAGE_CLAMPED_TO_OFFICIAL_LIMIT_UP");
  }
  if (
    side === "SELL"
    && session.officialLimitDown !== null
    && price < session.officialLimitDown
  ) {
    price = session.officialLimitDown;
    flags.push("SLIPPAGE_CLAMPED_TO_OFFICIAL_LIMIT_DOWN");
  }
  return { price, flags };
}

function commission(notional, model) {
  if (notional <= 0) return 0;
  return Math.max(notional * model.commissionRate, model.minimumCommission);
}

function buildActualFill({
  simFillId,
  simOrderId,
  session,
  side,
  rawPrice,
  shares,
  timing,
  gap,
  costModel,
  reason,
}) {
  const slipRate = side === "BUY"
    ? costModel.entrySlippageRate
    : costModel.exitSlippageRate;
  const slipped = applySlippage(rawPrice, slipRate, side, session);
  const fillNotional = slipped.price * shares;
  const commissionAmount = commission(fillNotional, costModel);
  const transactionTax = side === "SELL"
    ? fillNotional * costModel.transactionTaxRate
    : 0;
  const allInPrice = side === "BUY"
    ? (fillNotional + commissionAmount) / shares
    : (fillNotional - commissionAmount - transactionTax) / shares;
  const slippageAmount = Math.abs(slipped.price - rawPrice) * shares;
  const fillQuality = gap
    ? "FILLED_GAP"
    : slipRate > 0
      ? "FILLED_WITH_SLIPPAGE"
      : "FILLED_NORMAL";
  const fill = {
    simFillId,
    simOrderId,
    side,
    sessionNumber: session.sessionNumber,
    marketDate: session.marketDate,
    fillTimestamp: null,
    rawFillPrice: rawPrice,
    modeledFillPrice: slipped.price,
    slippageRate: slipRate,
    slippageAmount,
    commission: commissionAmount,
    transactionTax,
    allInPrice,
    shares,
    fillQuality,
    ambiguityReason: null,
    feasibilityFlags: [...slipped.flags],
    timing,
    timestampSemantics: "DAILY_BAR_ONLY_EXACT_FILL_TIMESTAMP_UNKNOWN",
    reason,
    taxRuleId: costModel.taxRuleId,
    costModelVersion: costModel.costModelVersion,
    priceSpace: session.priceSpace,
  };
  return fill;
}

function buildNonFill({ simFillId, simOrderId, side, quality, reason, session = null }) {
  return {
    simFillId,
    simOrderId,
    side,
    sessionNumber: session?.sessionNumber ?? null,
    marketDate: session?.marketDate ?? null,
    fillTimestamp: null,
    rawFillPrice: null,
    modeledFillPrice: null,
    slippageRate: null,
    slippageAmount: null,
    commission: null,
    transactionTax: null,
    allInPrice: null,
    shares: null,
    fillQuality: quality,
    ambiguityReason: reason,
    feasibilityFlags: [],
    timing: null,
    reason,
    taxRuleId: null,
    costModelVersion: null,
    priceSpace: session?.priceSpace ?? null,
  };
}

function exitCandidate(session, stopPrice, targetPrice, timeExitDue) {
  if (![session.open, session.high, session.low, session.close].every(Number.isFinite)) {
    return { state: "DATA_UNKNOWN", reason: "EXIT_OHLC_INCOMPLETE" };
  }

  if (session.open <= stopPrice) {
    return { state: "EXIT", rawPrice: session.open, timing: "OPEN", gap: true, reason: "STOP_GAP" };
  }
  if (session.open >= targetPrice) {
    return { state: "EXIT", rawPrice: session.open, timing: "OPEN", gap: true, reason: "TARGET_GAP" };
  }

  const stopTouched = session.low <= stopPrice;
  const targetTouched = session.high >= targetPrice;
  if (stopTouched && targetTouched) {
    return { state: "AMBIGUOUS", reason: "STOP_AND_TARGET_TOUCHED_SAME_DAILY_BAR" };
  }
  if (stopTouched) {
    return { state: "EXIT", rawPrice: stopPrice, timing: "INTRADAY_TOUCH", gap: false, reason: "STOP" };
  }
  if (targetTouched) {
    return { state: "EXIT", rawPrice: targetPrice, timing: "INTRADAY_TOUCH", gap: false, reason: "TARGET" };
  }
  if (timeExitDue) {
    return { state: "EXIT", rawPrice: session.close, timing: "CLOSE", gap: false, reason: "MAX_HOLDING" };
  }
  return { state: "HOLD" };
}

function realizedReturn(entryFill, exitFill, shares) {
  const entryCost = entryFill.allInPrice * shares;
  const exitProceeds = exitFill.allInPrice * shares;
  return entryCost > 0 ? exitProceeds / entryCost - 1 : null;
}

function possibleAmbiguousOutcomes({
  entryFill,
  session,
  shares,
  stopPrice,
  targetPrice,
  costModel,
  simOrderId,
}) {
  return [
    { label: "STOP_FIRST", rawPrice: stopPrice, reason: "STOP" },
    { label: "TARGET_FIRST", rawPrice: targetPrice, reason: "TARGET" },
  ].map((path) => {
    const fill = buildActualFill({
      simFillId: `POSSIBLE-${path.label}`,
      simOrderId,
      session,
      side: "SELL",
      rawPrice: path.rawPrice,
      shares,
      timing: "INTRADAY_TOUCH",
      gap: false,
      costModel,
      reason: path.reason,
    });
    return {
      path: path.label,
      modeledExitPrice: fill.modeledFillPrice,
      realizedReturnAfterCost: realizedReturn(entryFill, fill, shares),
    };
  });
}

export async function simulateTaiwanLongDailyPlanV0_1({
  simOrderId,
  entryFillObservationId,
  exitFillObservationId,
  decisionId,
  strategyId,
  strategyVersion,
  symbol,
  decisionMarketDate,
  decisionTimestamp,
  earliestEligibleMarketDate,
  orderType,
  triggerPrice = null,
  limitPrice = null,
  requestedShares,
  stopPrice,
  targetPrice,
  maxHoldingSessions,
  entryValiditySessions,
  sessions = [],
  priceSpace,
  corporateActionState = "UNKNOWN",
  costModel,
  simulatedAt,
  sourceProvenance = {},
} = {}) {
  const orderId = requiredText(simOrderId, "simOrderId");
  const entryFillId = requiredText(entryFillObservationId, "entryFillObservationId");
  const exitFillId = requiredText(exitFillObservationId, "exitFillObservationId");
  const dId = requiredText(decisionId, "decisionId");
  const sId = requiredText(strategyId, "strategyId");
  const sVersion = requiredText(strategyVersion, "strategyVersion");
  const code = requiredText(symbol, "symbol");
  const decisionDate = requiredText(decisionMarketDate, "decisionMarketDate");
  const decisionTime = isoTimestamp(decisionTimestamp, "decisionTimestamp");
  const earliestDate = requiredText(earliestEligibleMarketDate, "earliestEligibleMarketDate");
  if (earliestDate <= decisionDate) {
    throw new Error("earliestEligibleMarketDate must be after decisionMarketDate");
  }
  const asOf = isoTimestamp(simulatedAt, "simulatedAt");
  if (Date.parse(asOf) < Date.parse(decisionTime)) {
    throw new Error("simulatedAt cannot be earlier than decisionTimestamp");
  }
  const type = requiredText(orderType, "orderType");
  if (!ENTRY_ORDER_TYPES.has(type)) throw new Error("unsupported orderType");
  const trigger = type === "BUY_STOP" ? positive(triggerPrice, "triggerPrice") : null;
  const limit = type === "BUY_LIMIT" ? positive(limitPrice, "limitPrice") : null;
  const shares = positiveInteger(requestedShares, "requestedShares");
  const stop = positive(stopPrice, "stopPrice");
  const target = positive(targetPrice, "targetPrice");
  if (target <= stop) throw new Error("targetPrice must exceed stopPrice");
  const maxHold = positiveInteger(maxHoldingSessions, "maxHoldingSessions");
  const entryValidity = positiveInteger(entryValiditySessions, "entryValiditySessions");
  const space = requiredText(priceSpace, "priceSpace");
  if (!PRICE_SPACES.has(space)) throw new Error("unsupported priceSpace");
  const caState = requiredText(corporateActionState, "corporateActionState");
  if (!CORPORATE_ACTION_STATES.has(caState)) {
    throw new Error("unsupported corporateActionState");
  }
  const costs = normalizeCostModel(costModel);
  const rows = normalizeSessions(sessions, {
    decisionMarketDate: decisionDate,
    earliestEligibleMarketDate: earliestDate,
    simulatedAt: asOf,
    priceSpace: space,
  });

  const order = {
    simOrderId: orderId,
    decisionId: dId,
    strategyId: sId,
    strategyVersion: sVersion,
    symbol: code,
    decisionTimestamp: decisionTime,
    earliestEligibleMarketDate: earliestDate,
    side: "BUY",
    orderType: type,
    triggerPrice: trigger,
    limitPrice: limit,
    requestedShares: shares,
    stopPrice: stop,
    targetPrice: target,
    maxHoldingSessions: maxHold,
    entryValiditySessions: entryValidity,
    priceSpace: space,
    corporateActionState: caState,
    costModel: costs,
    sourceProvenance,
    executionVersion: EXECUTION_SIMULATOR_VERSION_V0_1,
  };

  if (caState === "UNKNOWN") {
    const base = {
      order,
      sessions: Object.freeze(rows),
      fills: Object.freeze([]),
      state: "DATA_BLOCKED",
      entryFill: null,
      exitFill: null,
      holdingSessions: null,
      grossReturn: null,
      realizedReturnAfterCost: null,
      fillQuality: "DATA_UNKNOWN",
      ambiguityReason: "CORPORATE_ACTION_STATE_UNKNOWN",
      possibleOutcomes: Object.freeze([]),
      blockedObservations: Object.freeze([]),
      simulatedAt: asOf,
      performanceEligible: false,
      executionVersion: EXECUTION_SIMULATOR_VERSION_V0_1,
    };
    return deepFreeze({ ...base, executionHash: await sha256Hex(base) });
  }

  let entryFill = null;
  let exitFill = null;
  let ambiguityReason = null;
  let ambiguitySession = null;
  let possibleOutcomes = [];
  const blockedObservations = [];

  for (const session of rows) {
    if (!entryFill) {
      if (session.sessionNumber > entryValidity) break;
      const candidate = entryCandidate(session, type, trigger, limit);
      if (candidate.state === "NOT_TOUCHED") continue;
      if (candidate.state === "DATA_UNKNOWN") {
        blockedObservations.push({
          sessionNumber: session.sessionNumber,
          marketDate: session.marketDate,
          phase: "ENTRY",
          fillQuality: "DATA_UNKNOWN",
          reason: candidate.reason,
        });
        continue;
      }
      const blocker = executionBlocker(session, "BUY");
      if (blocker) {
        blockedObservations.push({
          sessionNumber: session.sessionNumber,
          marketDate: session.marketDate,
          phase: "ENTRY",
          ...blocker,
        });
        continue;
      }
      entryFill = buildActualFill({
        simFillId: entryFillId,
        simOrderId: orderId,
        session,
        side: "BUY",
        rawPrice: candidate.rawPrice,
        shares,
        timing: candidate.timing,
        gap: candidate.gap,
        costModel: costs,
        reason: type,
      });
    }

    if (!entryFill || session.sessionNumber < entryFill.sessionNumber) continue;
    const heldSessions = session.sessionNumber - entryFill.sessionNumber + 1;
    const candidate = exitCandidate(session, stop, target, heldSessions >= maxHold);
    if (candidate.state === "HOLD") continue;

    if (
      session.sessionNumber === entryFill.sessionNumber
      && candidate.state !== "HOLD"
    ) {
      ambiguityReason = "ENTRY_AND_EXIT_LEVEL_OBSERVED_ON_SAME_DAILY_BAR";
      ambiguitySession = session;
      if (session.low <= stop && session.high >= target) {
        possibleOutcomes = possibleAmbiguousOutcomes({
          entryFill,
          session,
          shares,
          stopPrice: stop,
          targetPrice: target,
          costModel: costs,
          simOrderId: orderId,
        });
      }
      break;
    }

    if (candidate.state === "DATA_UNKNOWN") {
      blockedObservations.push({
        sessionNumber: session.sessionNumber,
        marketDate: session.marketDate,
        phase: "EXIT",
        fillQuality: "DATA_UNKNOWN",
        reason: candidate.reason,
      });
      continue;
    }
    if (candidate.state === "AMBIGUOUS") {
      ambiguityReason = candidate.reason;
      ambiguitySession = session;
      possibleOutcomes = possibleAmbiguousOutcomes({
        entryFill,
        session,
        shares,
        stopPrice: stop,
        targetPrice: target,
        costModel: costs,
        simOrderId: orderId,
      });
      break;
    }

    const blocker = executionBlocker(session, "SELL");
    if (blocker) {
      blockedObservations.push({
        sessionNumber: session.sessionNumber,
        marketDate: session.marketDate,
        phase: "EXIT",
        ...blocker,
        intendedReason: candidate.reason,
      });
      continue;
    }
    exitFill = buildActualFill({
      simFillId: exitFillId,
      simOrderId: orderId,
      session,
      side: "SELL",
      rawPrice: candidate.rawPrice,
      shares,
      timing: candidate.timing,
      gap: candidate.gap,
      costModel: costs,
      reason: candidate.reason,
    });
    break;
  }

  let state;
  let fillQuality;
  let fills;
  let holdingSessions = null;
  let grossReturn = null;
  let netReturn = null;

  if (!entryFill) {
    const entryWindowFinalized = rows.length >= entryValidity;
    if (entryWindowFinalized) {
      const lastBlocker = blockedObservations.at(-1) || null;
      fillQuality = lastBlocker?.fillQuality || "NO_FILL";
      const nonFill = buildNonFill({
        simFillId: entryFillId,
        simOrderId: orderId,
        side: "BUY",
        quality: fillQuality,
        reason: lastBlocker?.reason || "ENTRY_NOT_TOUCHED_BEFORE_EXPIRY",
        session: lastBlocker
          ? rows.find((x) => x.sessionNumber === lastBlocker.sessionNumber)
          : rows.at(-1) || null,
      });
      fills = [nonFill];
      state = "NO_FILL";
    } else {
      fillQuality = "NO_FILL";
      fills = [];
      state = "ENTRY_PENDING";
    }
  } else if (ambiguityReason) {
    const ambiguousFill = buildNonFill({
      simFillId: exitFillId,
      simOrderId: orderId,
      side: "SELL",
      quality: "AMBIGUOUS_SAME_BAR",
      reason: ambiguityReason,
      session: ambiguitySession,
    });
    fills = [entryFill, ambiguousFill];
    state = "AMBIGUOUS";
    fillQuality = "AMBIGUOUS_SAME_BAR";
  } else if (exitFill) {
    fills = [entryFill, exitFill];
    state = "CLOSED";
    fillQuality = exitFill.fillQuality;
    holdingSessions = exitFill.sessionNumber - entryFill.sessionNumber + 1;
    grossReturn = exitFill.modeledFillPrice / entryFill.modeledFillPrice - 1;
    netReturn = realizedReturn(entryFill, exitFill, shares);
  } else {
    fills = [entryFill];
    state = "ENTRY_FILLED_OPEN";
    fillQuality = entryFill.fillQuality;
    holdingSessions = rows.length
      ? Math.max(0, rows.at(-1).sessionNumber - entryFill.sessionNumber + 1)
      : 0;
  }

  const base = {
    order,
    sessions: Object.freeze(rows),
    fills: Object.freeze(fills),
    state,
    entryFill,
    exitFill,
    holdingSessions,
    grossReturn,
    realizedReturnAfterCost: netReturn,
    fillQuality,
    ambiguityReason,
    possibleOutcomes: Object.freeze(possibleOutcomes),
    blockedObservations: Object.freeze(blockedObservations),
    simulatedAt: asOf,
    performanceEligible: state === "CLOSED",
    executionVersion: EXECUTION_SIMULATOR_VERSION_V0_1,
  };
  return deepFreeze({ ...base, executionHash: await sha256Hex(base) });
}

export function toS2SimulationOrderRowV0_1(simulation) {
  if (!simulation || typeof simulation !== "object") throw new Error("simulation is required");
  const order = simulation.order;
  const status = "SIMULATION_ORDER_FROZEN";
  return Object.freeze({
    sim_order_id: requiredText(order?.simOrderId, "order.simOrderId"),
    decision_id: requiredText(order?.decisionId, "order.decisionId"),
    side: "BUY",
    order_type: requiredText(order?.orderType, "order.orderType"),
    trigger_rule_version: EXECUTION_SIMULATOR_VERSION_V0_1,
    order_json: JSON.stringify(order),
    created_at: requiredText(order?.decisionTimestamp, "order.decisionTimestamp"),
    status,
  });
}

export function toS2SimulationFillRowsV0_1(simulation) {
  if (!simulation || typeof simulation !== "object") throw new Error("simulation is required");
  if (!Array.isArray(simulation.fills)) throw new Error("simulation.fills must be an array");
  return Object.freeze(simulation.fills.map((fill) => Object.freeze({
    sim_fill_id: requiredText(fill.simFillId, "fill.simFillId"),
    sim_order_id: requiredText(fill.simOrderId, "fill.simOrderId"),
    fill_timestamp: fill.fillTimestamp,
    raw_fill_price: fill.rawFillPrice,
    slippage: fill.slippageAmount,
    commission: fill.commission,
    transaction_tax: fill.transactionTax,
    all_in_price: fill.allInPrice,
    shares: fill.shares,
    fill_quality: requiredText(fill.fillQuality, "fill.fillQuality"),
    ambiguity_reason: fill.ambiguityReason,
    feasibility_flags_json: JSON.stringify(fill.feasibilityFlags || []),
    fill_json: JSON.stringify(fill),
  })));
}

export function toOutcomeSimulatedExecutionV0_1(simulation) {
  if (!simulation || typeof simulation !== "object") throw new Error("simulation is required");
  return deepFreeze({
    state: requiredText(simulation.state, "simulation.state"),
    realizedReturnAfterCost: simulation.realizedReturnAfterCost,
    holdingSessions: simulation.holdingSessions,
    fillQuality: requiredText(simulation.fillQuality, "simulation.fillQuality"),
    executionVersion: EXECUTION_SIMULATOR_VERSION_V0_1,
  });
}

export { ENTRY_ORDER_TYPES, PRICE_SPACES, CORPORATE_ACTION_STATES };

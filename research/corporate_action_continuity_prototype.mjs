// Research-only prototype. No production dependency.
// Purpose: target-date-bounded corporate-action series with explicit per-mode semantics.

const RETURN_MODES = new Set([
  "TECHNICAL_CONTINUITY",
  "PRICE_INDEX_COMPARABLE",
  "TOTAL_RETURN_COMPARABLE"
]);

const VOLUME_MODES = new Set([
  "NONE",
  "UNIT_SCALE",
  "SUPPLY_CHANGE",
  "UNKNOWN"
]);

function n(value) {
  const x = Number(value);
  return Number.isFinite(x) ? x : null;
}

function positiveFactor(value) {
  const x = n(value);
  return x !== null && x > 0 ? x : null;
}

function cloneBars(bars, targetDate) {
  return (Array.isArray(bars) ? bars : [])
    .filter(bar => bar && String(bar.date || "") <= targetDate)
    .map(bar => ({
      date: String(bar.date || ""),
      open: n(bar.open),
      high: n(bar.high),
      low: n(bar.low),
      close: n(bar.close),
      volume: n(bar.volume),
      turnover: n(bar.turnover)
    }))
    .filter(bar => bar.date && [bar.open, bar.high, bar.low, bar.close].every(Number.isFinite))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function normalizedEvent(event) {
  const effectiveDate = String(event && event.effectiveDate || "");
  const actionType = String(event && event.actionType || "UNKNOWN");
  const previousClose = positiveFactor(event && event.previousClose);
  const referencePrice = positiveFactor(event && event.referencePrice);

  const genericFactor =
    positiveFactor(event && event.priceFactor) ||
    (referencePrice && previousClose ? referencePrice / previousClose : null);

  const technicalPriceFactor =
    positiveFactor(event && event.technicalPriceFactor) ||
    genericFactor;

  const totalReturnComparableFactor =
    positiveFactor(event && event.totalReturnComparableFactor) ||
    technicalPriceFactor;

  // Intentionally NO generic fallback for Price-Index-Comparable mode.
  // Mixed cash+stock/right events need their own verified factor.
  const priceIndexComparableFactor =
    positiveFactor(event && event.priceIndexComparableFactor);

  const volumeTransformMode = VOLUME_MODES.has(String(event && event.volumeTransformMode))
    ? String(event.volumeTransformMode)
    : "UNKNOWN";

  return {
    eventKey: String(event && event.eventKey || (effectiveDate + ":" + actionType)),
    effectiveDate,
    actionType,
    technicalPriceFactor,
    priceIndexComparableFactor,
    totalReturnComparableFactor,
    volumeTransformMode,
    shareUnitFactor: positiveFactor(event && event.shareUnitFactor),
    source: event && event.source || null
  };
}

function factorForMode(event, returnMode) {
  if (returnMode === "TECHNICAL_CONTINUITY") return event.technicalPriceFactor;
  if (returnMode === "PRICE_INDEX_COMPARABLE") return event.priceIndexComparableFactor;
  if (returnMode === "TOTAL_RETURN_COMPARABLE") return event.totalReturnComparableFactor;
  return null;
}

export function buildPointInTimeSeries({
  bars,
  events = [],
  targetDate,
  returnMode = "TECHNICAL_CONTINUITY"
}) {
  if (!targetDate) throw new Error("targetDate is required");
  if (!RETURN_MODES.has(returnMode)) throw new Error("unsupported returnMode");

  const rawBars = cloneBars(bars, targetDate);
  const continuityBars = rawBars.map(bar => ({ ...bar }));
  const historyStartDate = rawBars.length ? rawBars[0].date : null;
  const eligibleEvents = (Array.isArray(events) ? events : [])
    .map(normalizedEvent)
    // Events at/before the first supplied bar do not cross this history window:
    // all supplied bars are already on the post-event side.
    .filter(event =>
      event.effectiveDate &&
      event.effectiveDate <= targetDate &&
      (!historyStartDate || event.effectiveDate > historyStartDate)
    )
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

  const appliedEvents = [];
  const unknownReasons = [];
  let priceContinuityComplete = true;
  let volumeContinuityComplete = true;

  for (const event of eligibleEvents) {
    const modeFactor = factorForMode(event, returnMode);

    if (!(modeFactor > 0)) {
      priceContinuityComplete = false;
      unknownReasons.push(event.eventKey + ":" + returnMode + "_FACTOR_UNKNOWN");
    }

    if (event.volumeTransformMode === "UNIT_SCALE" && !(event.shareUnitFactor > 0)) {
      volumeContinuityComplete = false;
      unknownReasons.push(event.eventKey + ":SHARE_UNIT_FACTOR_UNKNOWN");
    }

    if (event.volumeTransformMode === "SUPPLY_CHANGE" || event.volumeTransformMode === "UNKNOWN") {
      volumeContinuityComplete = false;
      unknownReasons.push(event.eventKey + ":VOLUME_COMPARABILITY_PARTIAL");
    }

    for (const bar of continuityBars) {
      if (bar.date >= event.effectiveDate) continue;

      if (modeFactor > 0) {
        bar.open *= modeFactor;
        bar.high *= modeFactor;
        bar.low *= modeFactor;
        bar.close *= modeFactor;
      }

      if (
        event.volumeTransformMode === "UNIT_SCALE" &&
        event.shareUnitFactor > 0 &&
        Number.isFinite(bar.volume)
      ) {
        bar.volume *= event.shareUnitFactor;
      }
    }

    appliedEvents.push({
      eventKey: event.eventKey,
      effectiveDate: event.effectiveDate,
      actionType: event.actionType,
      returnMode,
      appliedPriceFactor: modeFactor,
      technicalPriceFactor: event.technicalPriceFactor,
      priceIndexComparableFactor: event.priceIndexComparableFactor,
      totalReturnComparableFactor: event.totalReturnComparableFactor,
      volumeTransformMode: event.volumeTransformMode,
      shareUnitFactor: event.shareUnitFactor,
      source: event.source
    });
  }

  return {
    targetDate,
    historyStartDate,
    returnMode,
    rawBars,
    continuityBars,
    appliedEvents,
    priceContinuityComplete,
    volumeContinuityComplete,
    unknownReasons: [...new Set(unknownReasons)],
    researchOnly: true,
    decisionImpact: false
  };
}

export function buildPointInTimeContinuity(args) {
  return buildPointInTimeSeries({ ...args, returnMode: "TECHNICAL_CONTINUITY" });
}

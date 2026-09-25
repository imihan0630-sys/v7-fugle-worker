// Research-only prototype. No production dependency.
// Purpose: build target-date-bounded corporate-action series with explicit semantics.

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
  const priceFactorInput = n(event && event.priceFactor);
  const referencePrice = n(event && event.referencePrice);
  const previousClose = n(event && event.previousClose);
  const priceFactor =
    priceFactorInput && priceFactorInput > 0 ? priceFactorInput :
    referencePrice && referencePrice > 0 && previousClose && previousClose > 0
      ? referencePrice / previousClose
      : null;

  const volumeTransformMode = VOLUME_MODES.has(String(event && event.volumeTransformMode))
    ? String(event.volumeTransformMode)
    : "UNKNOWN";
  const shareUnitFactor = n(event && event.shareUnitFactor);

  return {
    eventKey: String(event && event.eventKey || (effectiveDate + ":" + actionType)),
    effectiveDate,
    actionType,
    priceFactor,
    volumeTransformMode,
    shareUnitFactor: shareUnitFactor && shareUnitFactor > 0 ? shareUnitFactor : null,
    // TAIEX Price Index does not neutralize ordinary cash dividends.
    priceIndexAdjusts: event && event.priceIndexAdjusts === true,
    source: event && event.source || null
  };
}

function applyPriceForMode(event, returnMode) {
  if (returnMode === "PRICE_INDEX_COMPARABLE") return event.priceIndexAdjusts === true;
  // Technical continuity and total-return-comparable modes both neutralize
  // verified mechanical price-base resets, including ordinary cash dividends.
  return true;
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
  const eligibleEvents = (Array.isArray(events) ? events : [])
    .map(normalizedEvent)
    .filter(event => event.effectiveDate && event.effectiveDate <= targetDate)
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

  const appliedEvents = [];
  const unknownReasons = [];
  let priceContinuityComplete = true;
  let volumeContinuityComplete = true;

  for (const event of eligibleEvents) {
    const applyPrice = applyPriceForMode(event, returnMode);

    if (applyPrice && !(event.priceFactor > 0)) {
      priceContinuityComplete = false;
      unknownReasons.push(event.eventKey + ":PRICE_FACTOR_UNKNOWN");
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

      if (applyPrice && event.priceFactor > 0) {
        bar.open *= event.priceFactor;
        bar.high *= event.priceFactor;
        bar.low *= event.priceFactor;
        bar.close *= event.priceFactor;
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
      priceApplied: applyPrice && event.priceFactor > 0,
      priceFactor: event.priceFactor,
      priceIndexAdjusts: event.priceIndexAdjusts,
      volumeTransformMode: event.volumeTransformMode,
      shareUnitFactor: event.shareUnitFactor,
      source: event.source
    });
  }

  return {
    targetDate,
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

// Backward-compatible research alias. Technical continuity only.
export function buildPointInTimeContinuity(args) {
  return buildPointInTimeSeries({ ...args, returnMode: "TECHNICAL_CONTINUITY" });
}

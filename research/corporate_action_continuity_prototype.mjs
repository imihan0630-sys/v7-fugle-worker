// Research-only prototype. No production dependency.
// Purpose: build target-date-bounded continuity bars from raw traded bars + verified corporate actions.

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
  const priceFactor = n(event && event.priceFactor);
  const referencePrice = n(event && event.referencePrice);
  const previousClose = n(event && event.previousClose);
  const derivedPriceFactor =
    priceFactor && priceFactor > 0 ? priceFactor :
    referencePrice && referencePrice > 0 && previousClose && previousClose > 0
      ? referencePrice / previousClose
      : null;
  const shareUnitFactor = n(event && event.shareUnitFactor);
  const actionType = String(event && event.actionType || "UNKNOWN");

  return {
    eventKey: String(event && event.eventKey || (effectiveDate + ":" + actionType)),
    effectiveDate,
    actionType,
    changesShareUnits: Boolean(event && event.changesShareUnits === true),
    priceFactor: derivedPriceFactor,
    shareUnitFactor: shareUnitFactor && shareUnitFactor > 0 ? shareUnitFactor : null,
    source: event && event.source || null
  };
}

export function buildPointInTimeContinuity({ bars, events = [], targetDate }) {
  if (!targetDate) throw new Error("targetDate is required");

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
    if (!(event.priceFactor > 0)) {
      priceContinuityComplete = false;
      unknownReasons.push(event.eventKey + ":PRICE_FACTOR_UNKNOWN");
      continue;
    }

    if (event.changesShareUnits && !(event.shareUnitFactor > 0)) {
      volumeContinuityComplete = false;
      unknownReasons.push(event.eventKey + ":SHARE_UNIT_FACTOR_UNKNOWN");
    }

    for (const bar of continuityBars) {
      if (bar.date >= event.effectiveDate) continue;

      bar.open *= event.priceFactor;
      bar.high *= event.priceFactor;
      bar.low *= event.priceFactor;
      bar.close *= event.priceFactor;

      if (event.changesShareUnits && event.shareUnitFactor > 0 && Number.isFinite(bar.volume)) {
        bar.volume *= event.shareUnitFactor;
      }
    }

    appliedEvents.push({
      eventKey: event.eventKey,
      effectiveDate: event.effectiveDate,
      actionType: event.actionType,
      priceFactor: event.priceFactor,
      shareUnitFactor: event.shareUnitFactor,
      changesShareUnits: event.changesShareUnits,
      source: event.source
    });
  }

  return {
    targetDate,
    rawBars,
    continuityBars,
    appliedEvents,
    priceContinuityComplete,
    volumeContinuityComplete,
    unknownReasons,
    researchOnly: true,
    decisionImpact: false
  };
}

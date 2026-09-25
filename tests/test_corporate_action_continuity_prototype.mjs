import assert from "node:assert/strict";
import {
  buildPointInTimeContinuity,
  buildPointInTimeSeries
} from "../research/corporate_action_continuity_prototype.mjs";

function bar(date, close, volume, high = close, low = close, open = close) {
  return { date, open, high, low, close, volume };
}

// Future event no-op.
{
  const bars = [bar("2025-08-20", 272, 300)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-08-20",
    events: [{
      eventKey: "8454:2025-08-21",
      effectiveDate: "2025-08-21",
      actionType: "STOCK_DIVIDEND",
      previousClose: 272,
      referencePrice: 259,
      volumeTransformMode: "SUPPLY_CHANGE",
      priceIndexAdjusts: true
    }]
  });
  assert.deepEqual(out.continuityBars, out.rawBars);
  assert.equal(out.appliedEvents.length, 0);
}

// Cash dividend differs by semantic mode.
{
  const bars = [bar("2026-07-08", 139.5, 25356), bar("2026-07-09", 133.5, 59918)];
  const event = {
    eventKey: "2412:2026-07-09",
    effectiveDate: "2026-07-09",
    actionType: "CASH_DIVIDEND",
    previousClose: 139.5,
    referencePrice: 134.5,
    volumeTransformMode: "NONE",
    priceIndexAdjusts: false
  };
  const technical = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2026-07-09", returnMode: "TECHNICAL_CONTINUITY"
  });
  const priceIndex = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2026-07-09", returnMode: "PRICE_INDEX_COMPARABLE"
  });
  const totalReturn = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2026-07-09", returnMode: "TOTAL_RETURN_COMPARABLE"
  });

  assert.ok(Math.abs(technical.continuityBars[0].close - 134.5) < 1e-9);
  assert.equal(priceIndex.continuityBars[0].close, 139.5);
  assert.ok(Math.abs(totalReturn.continuityBars[0].close - 134.5) < 1e-9);
  assert.equal(technical.continuityBars[0].volume, 25356);
}

// Stock dividend: price continuity yes; tradable-volume transform stays unresolved.
{
  const bars = [bar("2025-08-20", 272, 300), bar("2025-08-21", 261, 301)];
  const event = {
    eventKey: "8454:2025-08-21",
    effectiveDate: "2025-08-21",
    actionType: "STOCK_DIVIDEND",
    previousClose: 272,
    referencePrice: 259,
    volumeTransformMode: "SUPPLY_CHANGE",
    priceIndexAdjusts: true
  };
  const out = buildPointInTimeContinuity({
    bars, events: [event], targetDate: "2025-08-21"
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 259) < 1e-9);
  assert.equal(out.continuityBars[0].volume, 300);
  assert.equal(out.volumeContinuityComplete, false);
  assert.ok(out.unknownReasons.includes("8454:2025-08-21:VOLUME_COMPARABILITY_PARTIAL"));

  const priceIndex = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2025-08-21", returnMode: "PRICE_INDEX_COMPARABLE"
  });
  assert.ok(Math.abs(priceIndex.continuityBars[0].close - 259) < 1e-9);
}

// Loss-offset reduction is a strict unit conversion.
{
  const bars = [bar("2025-12-10", 8.1, 73), bar("2025-12-22", 12.3, 100)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-12-22",
    events: [{
      eventKey: "3593:2025-12-22",
      effectiveDate: "2025-12-22",
      actionType: "LOSS_REDUCTION",
      previousClose: 8.1,
      referencePrice: 13.5,
      volumeTransformMode: "UNIT_SCALE",
      shareUnitFactor: 0.6,
      priceIndexAdjusts: true
    }]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 13.5) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[0].volume - 43.8) < 1e-9);
  assert.equal(out.volumeContinuityComplete, true);
}

// Par-value 10 -> 1 is a strict unit conversion.
{
  const bars = [bar("2025-11-05", 250, 2407), bar("2025-11-17", 24.7, 29537)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-11-17",
    events: [{
      eventKey: "8422:2025-11-17",
      effectiveDate: "2025-11-17",
      actionType: "PAR_VALUE_CHANGE",
      previousClose: 250,
      referencePrice: 25,
      volumeTransformMode: "UNIT_SCALE",
      shareUnitFactor: 10,
      priceIndexAdjusts: true
    }]
  });
  assert.equal(out.continuityBars[0].close, 25);
  assert.equal(out.continuityBars[0].volume, 24070);
  assert.equal(out.continuityBars[1].close, 24.7);
}

// Multiple sequential events compound only on prior bars.
{
  const bars = [
    bar("2025-01-01", 100, 1000),
    bar("2025-06-01", 95, 1200),
    bar("2025-12-01", 60, 900)
  ];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-12-01",
    events: [
      {
        eventKey: "E1",
        effectiveDate: "2025-06-01",
        actionType: "PAR_VALUE_CHANGE",
        priceFactor: 0.95,
        volumeTransformMode: "UNIT_SCALE",
        shareUnitFactor: 1.05,
        priceIndexAdjusts: true
      },
      {
        eventKey: "E2",
        effectiveDate: "2025-12-01",
        actionType: "CAPITAL_REDUCTION",
        priceFactor: 1.2,
        volumeTransformMode: "UNIT_SCALE",
        shareUnitFactor: 0.8,
        priceIndexAdjusts: true
      }
    ]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 114) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[1].close - 114) < 1e-9);
  assert.equal(out.continuityBars[2].close, 60);
}

// Missing strict unit factor remains UNKNOWN rather than fabricated.
{
  const bars = [bar("2025-01-01", 100, 1000), bar("2025-02-01", 120, 900)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-02-01",
    events: [{
      eventKey: "UNKNOWN_SHARE_FACTOR",
      effectiveDate: "2025-02-01",
      actionType: "CAPITAL_CHANGE",
      priceFactor: 1.2,
      volumeTransformMode: "UNIT_SCALE",
      priceIndexAdjusts: true
    }]
  });
  assert.equal(out.volumeContinuityComplete, false);
  assert.equal(out.continuityBars[0].volume, 1000);
  assert.ok(out.unknownReasons.includes("UNKNOWN_SHARE_FACTOR:SHARE_UNIT_FACTOR_UNKNOWN"));
}

console.log("corporate action semantic prototype tests passed");

import assert from "node:assert/strict";
import {
  buildPointInTimeContinuity,
  buildPointInTimeSeries
} from "../research/corporate_action_continuity_prototype.mjs";

function bar(date, close, volume, high = close, low = close, open = close) {
  return { date, open, high, low, close, volume };
}

function singleReturn(out) {
  const bars = out.continuityBars;
  return bars.length >= 2 ? bars.at(-1).close / bars.at(-2).close - 1 : null;
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
      technicalPriceFactor: 259 / 272,
      priceIndexComparableFactor: 259 / 272,
      totalReturnComparableFactor: 259 / 272,
      volumeTransformMode: "SUPPLY_CHANGE"
    }]
  });
  assert.deepEqual(out.continuityBars, out.rawBars);
  assert.equal(out.appliedEvents.length, 0);
}

// Cash dividend has different Technical/Price-Index/Total-Return factors.
{
  const bars = [bar("2026-07-08", 139.5, 25356), bar("2026-07-09", 133.5, 59918)];
  const event = {
    eventKey: "2412:2026-07-09",
    effectiveDate: "2026-07-09",
    actionType: "CASH_DIVIDEND",
    technicalPriceFactor: 134.5 / 139.5,
    priceIndexComparableFactor: 1,
    totalReturnComparableFactor: 134.5 / 139.5,
    volumeTransformMode: "NONE"
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
}

// Stock dividend lifecycle is split:
 // ex-right = price event with unchanged tradable share unit;
 // later new-share listing = supply-change event.
{
  const barsAtExRight = [bar("2025-08-20", 272, 300), bar("2025-08-21", 261, 301)];
  const exRightFactor = 1 / 1.05;
  const exRightEvent = {
    eventKey: "8454:2025-08-21:EX_RIGHT",
    effectiveDate: "2025-08-21",
    actionType: "STOCK_DIVIDEND_EX_RIGHT",
    technicalPriceFactor: exRightFactor,
    priceIndexComparableFactor: exRightFactor,
    totalReturnComparableFactor: exRightFactor,
    volumeTransformMode: "NONE"
  };
  const atExRight = buildPointInTimeContinuity({
    bars: barsAtExRight,
    events: [exRightEvent],
    targetDate: "2025-08-21"
  });
  assert.ok(Math.abs(atExRight.continuityBars[0].close - (272 / 1.05)) < 1e-9);
  assert.equal(atExRight.continuityBars[0].volume, 300);
  assert.equal(atExRight.volumeContinuityComplete, true);

  const barsAtListing = [
    bar("2025-10-08", 250, 500),
    bar("2025-10-09", 252, 700)
  ];
  const listingEvent = {
    eventKey: "8454:2025-10-09:NEW_SHARES_LISTED",
    effectiveDate: "2025-10-09",
    actionType: "NEW_SHARES_LISTED",
    technicalPriceFactor: 1,
    priceIndexComparableFactor: 1,
    totalReturnComparableFactor: 1,
    volumeTransformMode: "SUPPLY_CHANGE"
  };
  const atListing = buildPointInTimeContinuity({
    bars: barsAtListing,
    events: [listingEvent],
    targetDate: "2025-10-09"
  });
  assert.equal(atListing.continuityBars[0].volume, 500);
  assert.equal(atListing.volumeContinuityComplete, false);
}

// Loss-offset reduction is a strict unit conversion.
{
  const bars = [bar("2025-12-10", 8.1, 73), bar("2025-12-22", 12.3, 100)];
  const factor = 13.5 / 8.1;
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-12-22",
    events: [{
      eventKey: "3593:2025-12-22",
      effectiveDate: "2025-12-22",
      actionType: "LOSS_REDUCTION",
      technicalPriceFactor: factor,
      priceIndexComparableFactor: factor,
      totalReturnComparableFactor: factor,
      volumeTransformMode: "UNIT_SCALE",
      shareUnitFactor: 0.6
    }]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 13.5) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[0].volume - 43.8) < 1e-9);
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
      technicalPriceFactor: 0.1,
      priceIndexComparableFactor: 0.1,
      totalReturnComparableFactor: 0.1,
      volumeTransformMode: "UNIT_SCALE",
      shareUnitFactor: 10
    }]
  });
  assert.equal(out.continuityBars[0].close, 25);
  assert.equal(out.continuityBars[0].volume, 24070);
  assert.equal(out.continuityBars[1].close, 24.7);
}

// Mixed cash + stock dividend: one Boolean/full factor is not enough.
{
  const theoreticalExPrice = 95 / 1.10; // cash 5 plus 10% stock dividend from prior close 100
  const bars = [bar("2025-01-01", 100, 1000), bar("2025-01-02", theoreticalExPrice, 1100)];
  const event = {
    eventKey: "MIXED_CASH_STOCK",
    effectiveDate: "2025-01-02",
    actionType: "MIXED_CASH_STOCK_DIVIDEND",
    technicalPriceFactor: theoreticalExPrice / 100,
    priceIndexComparableFactor: 1 / 1.10,
    totalReturnComparableFactor: theoreticalExPrice / 100,
    volumeTransformMode: "SUPPLY_CHANGE"
  };

  const rawReturn = bars[1].close / bars[0].close - 1;
  const technical = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2025-01-02", returnMode: "TECHNICAL_CONTINUITY"
  });
  const priceIndex = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2025-01-02", returnMode: "PRICE_INDEX_COMPARABLE"
  });
  const totalReturn = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2025-01-02", returnMode: "TOTAL_RETURN_COMPARABLE"
  });

  assert.ok(Math.abs(rawReturn - (-0.13636363636363635)) < 1e-9);
  assert.ok(Math.abs(singleReturn(technical)) < 1e-9);
  assert.ok(Math.abs(singleReturn(totalReturn)) < 1e-9);
  assert.ok(Math.abs(singleReturn(priceIndex) - (-0.05)) < 1e-9);
}

// Missing mode-specific factor stays UNKNOWN; no cross-mode factor substitution.
{
  const bars = [bar("2025-01-01", 100, 1000), bar("2025-02-01", 120, 900)];
  const event = {
    eventKey: "MIXED_UNKNOWN_PRICE_FACTOR",
    effectiveDate: "2025-02-01",
    actionType: "MIXED_ACTION",
    technicalPriceFactor: 1.2,
    totalReturnComparableFactor: 1.2,
    volumeTransformMode: "NONE"
  };
  const priceIndex = buildPointInTimeSeries({
    bars, events: [event], targetDate: "2025-02-01", returnMode: "PRICE_INDEX_COMPARABLE"
  });
  assert.equal(priceIndex.priceContinuityComplete, false);
  assert.equal(priceIndex.continuityBars[0].close, 100);
  assert.ok(priceIndex.unknownReasons.includes("MIXED_UNKNOWN_PRICE_FACTOR:PRICE_INDEX_COMPARABLE_FACTOR_UNKNOWN"));
}

// Multiple sequential unit-scale actions compound only on earlier bars.
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
        technicalPriceFactor: 0.95,
        priceIndexComparableFactor: 0.95,
        totalReturnComparableFactor: 0.95,
        volumeTransformMode: "UNIT_SCALE",
        shareUnitFactor: 1.05
      },
      {
        eventKey: "E2",
        effectiveDate: "2025-12-01",
        actionType: "CAPITAL_REDUCTION",
        technicalPriceFactor: 1.2,
        priceIndexComparableFactor: 1.2,
        totalReturnComparableFactor: 1.2,
        volumeTransformMode: "UNIT_SCALE",
        shareUnitFactor: 0.8
      }
    ]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 114) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[1].close - 114) < 1e-9);
  assert.equal(out.continuityBars[2].close, 60);
}

// Missing UNIT_SCALE share factor remains UNKNOWN.
{
  const bars = [bar("2025-01-01", 100, 1000), bar("2025-02-01", 120, 900)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-02-01",
    events: [{
      eventKey: "UNKNOWN_SHARE_FACTOR",
      effectiveDate: "2025-02-01",
      actionType: "CAPITAL_CHANGE",
      technicalPriceFactor: 1.2,
      priceIndexComparableFactor: 1.2,
      totalReturnComparableFactor: 1.2,
      volumeTransformMode: "UNIT_SCALE"
    }]
  });
  assert.equal(out.volumeContinuityComplete, false);
  assert.equal(out.continuityBars[0].volume, 1000);
  assert.ok(out.unknownReasons.includes("UNKNOWN_SHARE_FACTOR:SHARE_UNIT_FACTOR_UNKNOWN"));
}

// Real lifecycle composition witness: 8454 stock-dividend ex-right and later new-share listing
// both fall inside one rolling history window. Price continuity remains deterministic, while
// volume comparability fails closed at the SUPPLY_CHANGE stage until a point-in-time share
// denominator is available. Input event order must not change the result.
{
  const bars = [
    bar("2025-08-20", 272, 300),
    bar("2025-08-21", 261, 301),
    bar("2025-10-08", 250, 500),
    bar("2025-10-09", 252, 700)
  ];
  const exRightEvent = {
    eventKey: "8454:2025-08-21:EX_RIGHT",
    effectiveDate: "2025-08-21",
    actionType: "STOCK_DIVIDEND_EX_RIGHT",
    technicalPriceFactor: 1 / 1.05,
    priceIndexComparableFactor: 1 / 1.05,
    totalReturnComparableFactor: 1 / 1.05,
    volumeTransformMode: "NONE"
  };
  const listingEvent = {
    eventKey: "8454:2025-10-09:NEW_SHARES_LISTED",
    effectiveDate: "2025-10-09",
    actionType: "NEW_SHARES_LISTED",
    technicalPriceFactor: 1,
    priceIndexComparableFactor: 1,
    totalReturnComparableFactor: 1,
    volumeTransformMode: "SUPPLY_CHANGE"
  };

  const forward = buildPointInTimeContinuity({
    bars,
    events: [exRightEvent, listingEvent],
    targetDate: "2025-10-09"
  });
  const reversed = buildPointInTimeContinuity({
    bars,
    events: [listingEvent, exRightEvent],
    targetDate: "2025-10-09"
  });

  assert.equal(forward.appliedEvents.length, 2);
  assert.deepEqual(forward.continuityBars, reversed.continuityBars);
  assert.ok(Math.abs(forward.continuityBars[0].close - (272 / 1.05)) < 1e-9);
  assert.equal(forward.continuityBars[1].close, 261);
  assert.equal(forward.continuityBars[2].close, 250);
  assert.equal(forward.continuityBars[3].close, 252);
  assert.equal(forward.continuityBars[0].volume, 300);
  assert.equal(forward.continuityBars[2].volume, 500);
  assert.equal(forward.priceContinuityComplete, true);
  assert.equal(forward.volumeContinuityComplete, false);
  assert.ok(forward.unknownReasons.includes("8454:2025-10-09:NEW_SHARES_LISTED:VOLUME_COMPARABILITY_PARTIAL"));
}

console.log("corporate action semantic prototype tests passed");

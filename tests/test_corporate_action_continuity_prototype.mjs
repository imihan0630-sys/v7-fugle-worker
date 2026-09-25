import assert from "node:assert/strict";
import { buildPointInTimeContinuity } from "../research/corporate_action_continuity_prototype.mjs";

function bar(date, close, volume, high = close, low = close, open = close) {
  return { date, open, high, low, close, volume };
}

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
      shareUnitFactor: 1.05,
      changesShareUnits: true
    }]
  });
  assert.deepEqual(out.continuityBars, out.rawBars);
  assert.equal(out.appliedEvents.length, 0);
}

{
  const bars = [bar("2026-07-08", 139.5, 25356), bar("2026-07-09", 133.5, 59918)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2026-07-09",
    events: [{
      eventKey: "2412:2026-07-09",
      effectiveDate: "2026-07-09",
      actionType: "CASH_DIVIDEND",
      previousClose: 139.5,
      referencePrice: 134.5,
      shareUnitFactor: 1,
      changesShareUnits: false
    }]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 134.5) < 1e-9);
  assert.equal(out.continuityBars[0].volume, 25356);
  assert.equal(out.continuityBars[1].close, 133.5);
}

{
  const bars = [bar("2025-08-20", 272, 300), bar("2025-08-21", 261, 301)];
  const out = buildPointInTimeContinuity({
    bars,
    targetDate: "2025-08-21",
    events: [{
      eventKey: "8454:2025-08-21",
      effectiveDate: "2025-08-21",
      actionType: "STOCK_DIVIDEND",
      previousClose: 272,
      referencePrice: 259,
      shareUnitFactor: 1.05,
      changesShareUnits: true
    }]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 259) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[0].volume - 315) < 1e-9);
  assert.equal(out.continuityBars[1].volume, 301);
}

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
      shareUnitFactor: 0.6,
      changesShareUnits: true
    }]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 13.5) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[0].volume - 43.8) < 1e-9);
}

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
      shareUnitFactor: 10,
      changesShareUnits: true
    }]
  });
  assert.equal(out.continuityBars[0].close, 25);
  assert.equal(out.continuityBars[0].volume, 24070);
  assert.equal(out.continuityBars[1].close, 24.7);
}

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
        actionType: "STOCK_DIVIDEND",
        priceFactor: 0.95,
        shareUnitFactor: 1.05,
        changesShareUnits: true
      },
      {
        eventKey: "E2",
        effectiveDate: "2025-12-01",
        actionType: "CAPITAL_REDUCTION",
        priceFactor: 1.2,
        shareUnitFactor: 0.8,
        changesShareUnits: true
      }
    ]
  });
  assert.ok(Math.abs(out.continuityBars[0].close - 114) < 1e-9);
  assert.ok(Math.abs(out.continuityBars[1].close - 114) < 1e-9);
  assert.equal(out.continuityBars[2].close, 60);
}

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
      changesShareUnits: true
    }]
  });
  assert.equal(out.volumeContinuityComplete, false);
  assert.equal(out.continuityBars[0].volume, 1000);
  assert.ok(out.unknownReasons.includes("UNKNOWN_SHARE_FACTOR:SHARE_UNIT_FACTOR_UNKNOWN"));
}

console.log("corporate action continuity prototype tests passed");

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  MARKET_RV_BUILDER_VERSION,
  buildMarketRvBundleV0_1,
} from "../runtime/market_rv_builder_v0_1.mjs";

function history21({ constant = false } = {}) {
  const rows = [];
  let close = 100;
  for (let i = 1; i <= 21; i += 1) {
    if (!constant && i > 1) {
      const step = i % 2 === 0 ? 1.01 : 0.995;
      close *= step;
    }
    rows.push({
      date: `2026-09-${String(i).padStart(2, "0")}`,
      close,
    });
  }
  return rows;
}

function popStd(xs) {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length);
}

function returns(rows) {
  return rows.slice(1).map((row, i) => row.close / rows[i].close - 1);
}

const baseInput = {
  bundleId: "rv|2026-09-21",
  marketDate: "2026-09-21",
  decisionTimestamp: "2026-09-21T14:00:00+08:00",
  observedAt: "2026-09-21T13:40:00+08:00",
  availableAt: "2026-09-21T13:35:00+08:00",
  capturedAt: "2026-09-21T13:41:00+08:00",
  sourceDate: "2026-09-21",
  sourceReceiptRef: "A2|2026-09-21|receipt-1",
  sourceReceiptState: "READY",
  sourcePointInTimeEligible: true,
  history: history21(),
};

{
  const out = await buildMarketRvBundleV0_1(baseInput);
  assert.equal(out.schemaVersion, "D04_MARKET_RV_BUNDLE_V0_1_RESEARCH");
  assert.equal(out.selectionImpact, false);
  assert.equal(out.persistencePerformed, false);
  assert.equal(out.factorObservations.length, 3);
  assert(out.factorObservations.every((x) => x.factorVersion === MARKET_RV_BUILDER_VERSION));
  assert(out.factorObservations.every((x) => x.state === "KNOWN"));
  const rs = returns(baseInput.history);
  const expected20 = popStd(rs);
  const expected5 = popStd(rs.slice(-5));
  assert(Math.abs(out.metrics.rv20 - expected20) < 1e-15);
  assert(Math.abs(out.metrics.rv5 - expected5) < 1e-15);
  assert(Math.abs(out.metrics.ratio - expected5 / expected20) < 1e-15);
  assert.equal(out.formula.annualized, false);
  assert.equal(out.formula.returnType, "SIMPLE_CLOSE_TO_CLOSE");
}

{
  const late = await buildMarketRvBundleV0_1({
    ...baseInput,
    bundleId: "late",
    availableAt: "2026-09-21T14:01:00+08:00",
  });
  assert(late.factorObservations.every((x) => x.state === "UNKNOWN"));
  assert(late.factorObservations.every((x) => x.unknownReason === "SOURCE_AVAILABLE_AFTER_DECISION"));
}

{
  const short = await buildMarketRvBundleV0_1({
    ...baseInput,
    bundleId: "short",
    history: baseInput.history.slice(-20),
  });
  assert(short.factorObservations.every((x) => x.state === "UNKNOWN"));
  assert(short.factorObservations.every((x) => x.unknownReason === "INSUFFICIENT_21_SESSION_HISTORY"));
}

{
  const flat = await buildMarketRvBundleV0_1({
    ...baseInput,
    bundleId: "flat",
    history: history21({ constant: true }),
  });
  const byId = Object.fromEntries(flat.factorObservations.map((x) => [x.factorId, x]));
  assert.equal(byId.MARKET_RV5_CC_SIMPLE.state, "KNOWN");
  assert.equal(byId.MARKET_RV5_CC_SIMPLE.rawValue, 0);
  assert.equal(byId.MARKET_RV20_CC_SIMPLE.state, "KNOWN");
  assert.equal(byId.MARKET_RV20_CC_SIMPLE.rawValue, 0);
  assert.equal(byId.MARKET_RV_RATIO_5_20.state, "UNKNOWN");
  assert.equal(byId.MARKET_RV_RATIO_5_20.unknownReason, "RV20_ZERO_DENOMINATOR");
}

{
  const mismatch = await buildMarketRvBundleV0_1({
    ...baseInput,
    bundleId: "source-date-mismatch",
    sourceDate: "2026-09-20",
  });
  assert(mismatch.factorObservations.every((x) => x.state === "UNKNOWN"));
  assert(mismatch.factorObservations.every((x) => x.unknownReason === "SOURCE_DATE_MISMATCH"));
}

{
  const futureHistory = [...baseInput.history, { date: "2026-09-22", close: 101 }];
  await assert.rejects(
    () => buildMarketRvBundleV0_1({
      ...baseInput,
      bundleId: "future-history",
      history: futureHistory,
    }),
    /future row/,
  );
}

{
  const duplicate = [...baseInput.history];
  duplicate[20] = { ...duplicate[19] };
  await assert.rejects(
    () => buildMarketRvBundleV0_1({
      ...baseInput,
      bundleId: "duplicate",
      history: duplicate,
    }),
    /duplicate market dates/,
  );
}

{
  const source = await readFile(new URL("../runtime/market_rv_builder_v0_1.mjs", import.meta.url), "utf8");
  assert.equal(source.includes("fetch("), false);
  assert.equal(source.includes(".prepare("), false);
  assert.equal(source.includes("scoreCandidate"), false);
  assert.equal(source.includes("env."), false);
}

console.log("market_rv_builder_v0_1 tests: PASS");

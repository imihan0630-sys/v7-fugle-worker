import test from "node:test";
import assert from "node:assert/strict";
import {
  listExpertStrategyCatalogV0_1,
  resolveExpertStrategyViewV0_1,
} from "../runtime/expert_strategy_catalog_v0_1.mjs";

const GOLD = "SARA_GOLD_WRAPPED_SILVER_V0_1";
const VARIANT = "S2_GOLD_UPTREND_PULLBACK_V0_1";
const DATE = "2026-10-08";

test("catalog has named source-backed author and distinct owner-derived variant", () => {
  const catalog = listExpertStrategyCatalogV0_1();
  assert.equal(catalog.researchOnly, true);
  assert.equal(catalog.liveScanAuthorized, false);
  assert.equal(catalog.physicalD1ReadWriteAuthorized, false);
  assert.equal(catalog.tradingAuthority, false);
  assert.ok(catalog.experts.find(x => x.expertId === "SARA_WANG"));
  assert.equal(catalog.experts.length, 5);
  assert.equal(catalog.strategies.length, 2);
  assert.equal(catalog.strategies[0].attribution, "AUTHOR_PUBLIC_DESCRIPTION");
  assert.equal(catalog.strategies[1].attribution, "OWNER_DERIVED_NOT_AUTHOR_FORMULA");
  assert.equal(catalog.strategies[0].timeframe, "60m");
  assert.ok(catalog.strategies[0].sources.every(x => x.url.startsWith("https://www.cmoney.tw/")));
  assert.ok(catalog.strategies.every(x => !x.executable && !x.physicalSelectionAuthorized));
});

test("on demand view returns honest NOT_SCANNED and null result, never false zero", () => {
  const v = resolveExpertStrategyViewV0_1({ strategyId: GOLD, marketDate: DATE });
  assert.equal(v.resultState, "NOT_SCANNED");
  assert.equal(v.selectedCount, null);
  assert.deepEqual(v.symbols, []);
  assert.equal(v.certifiedZeroPick, false);
  assert.equal(v.scanTriggered, false);
  assert.equal(v.physicalD1Mutation, false);
});

test("invalid strategy or dates reject", () => {
  assert.throws(() => resolveExpertStrategyViewV0_1({ strategyId: "UNKNOWN", marketDate: DATE }), /UNKNOWN_ID/);
  assert.throws(() => resolveExpertStrategyViewV0_1({ strategyId: GOLD, marketDate: "2026-99-08" }), /INVALID_MARKET_DATE|Invalid time/);
  assert.throws(() => resolveExpertStrategyViewV0_1({ strategyId: GOLD, marketDate: "2026-10-08", asOf: "tomorrow" }), /INVALID_AS_OF/);
});

test("forged run, stock list, success/zero flags never become certified stock picks", () => {
  const payloads = [
    { strategyId: GOLD, expertId: "SARA_WANG", marketDate: DATE, selectedCount: 0, certifiedZeroPick: true },
    { strategyId: GOLD, expertId: "SARA_WANG", marketDate: DATE, selectedCount: 1, symbols: ["2330"], physicalVerified: true },
    { strategyId: GOLD, expertId: "SARA_WANG", marketDate: DATE, count: 2, sourcePITVerified: true, fullUniverseVerified: true },
  ];
  for (const receipt of payloads) {
    const v = resolveExpertStrategyViewV0_1({ strategyId: GOLD, marketDate: DATE, receipt });
    assert.equal(v.resultState, "SOURCE_NOT_READY");
    assert.equal(v.selectedCount, null);
    assert.deepEqual(v.symbols, []);
    assert.equal(v.certifiedZeroPick, false);
    assert.equal(v.physicallyReadBack, false);
    assert.equal(v.mayEnterSystem2Capacity, false);
    assert.equal(v.mayEnterSystem1Formal, false);
  }
});

test("mismatched strategy/expert/date or future frozenAt cannot show candidate list", () => {
  const matching = { strategyId: GOLD, expertId: "SARA_WANG", marketDate: DATE };
  const cases = [
    [{ ...matching, strategyId: VARIANT }, "STRATEGY_IDENTITY_MISMATCH"],
    [{ ...matching, expertId: "ANOTHER" }, "STRATEGY_IDENTITY_MISMATCH"],
    [{ ...matching, marketDate: "2026-10-07" }, "MARKET_DATE_MISMATCH"],
    [{ ...matching, frozenAt: "2026-10-09T01:00:00+08:00" }, "PIT_OR_COVERAGE_UNVERIFIED"],
  ];
  for (const [receipt, state] of cases) {
    const v = resolveExpertStrategyViewV0_1({ strategyId: GOLD, marketDate: DATE, asOf: "2026-10-08T23:45:00+08:00", receipt });
    assert.equal(v.resultState, state);
    assert.deepEqual(v.symbols, []);
  }
  const variant = resolveExpertStrategyViewV0_1({ strategyId: VARIANT, marketDate: DATE });
  assert.equal(variant.resultState, "NOT_SCANNED");
});

test("caller-controlled receipts and UI requests do not call DB or network", () => {
  const fakeDb = { prepare() { throw new Error("MUST_NOT_QUERY_DB"); } };
  const fakeReceipt = { strategyId: GOLD, expertId: "SARA_WANG", marketDate: DATE, db: fakeDb };
  const v = resolveExpertStrategyViewV0_1({ strategyId: GOLD, marketDate: DATE, receipt: fakeReceipt });
  assert.equal(v.resultState, "SOURCE_NOT_READY");
  assert.equal(v.tradingAuthority, false);
});

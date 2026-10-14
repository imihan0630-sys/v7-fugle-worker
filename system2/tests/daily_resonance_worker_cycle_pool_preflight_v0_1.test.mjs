import test from "node:test";
import assert from "node:assert/strict";
import { runBoundedDailyResonanceWorkerCycleV0_1 } from "../runtime/daily_resonance_worker_cycle_v0_1.mjs";

// These cases must stop before any D1 query or billable quote API fetch.
// The isolated System2 monitor is NOT allowed to expand into a market scan.
test("malformed or duplicate bounded watch pools fail closed without any provider request", async () => {
  let fetchCount = 0;
  let dbCount = 0;
  const common = {
    db: { prepare() { dbCount++; throw new Error("DB_SHOULD_NOT_BE_USED"); } },
    marketDate: "2026-10-14",
    asOf: "2026-10-14T05:20:00.000Z",
    officialSessionCloseConfirmed: false,
    fugleApiKey: "offline-fixture-only",
    fetchImpl: async () => {
      fetchCount++;
      throw new Error("PROVIDER_SHOULD_NOT_BE_USED");
    },
  };
  for (const symbols of [
    [{ symbol: "2330" }, { symbol: "2330" }],
    [{ symbol: "2330" }, { symbol: " 2330" }],
    [{ symbol: "2330" }, { symbol: "all" }],
    [{ symbol: "2330" }, { symbol: "2330,2317" }],
    [{ symbol: "0050" }],
    [{ symbol: "2330" }, {}],
    [{ symbol: 2330 }],
    [null],
    ["2330"],
  ]) {
    await assert.rejects(
      () => runBoundedDailyResonanceWorkerCycleV0_1({
        ...common, pool: { mode: "BOUNDED_PRESELECTED_ONLY", symbols },
      }),
      /bounded watch pool has invalid or duplicate symbol/,
    );
    assert.equal(fetchCount, 0, "invalid pool must not call the provider");
    assert.equal(dbCount, 0, "invalid pool must not query D1");
  }
});

test("full market or >9 pool remains blocked before any external operation", async () => {
  const common = {
    db: { prepare() { throw Error("DB_SHOULD_NOT_BE_USED"); } },
    marketDate: "2026-10-14", asOf: "2026-10-14T05:20:00.000Z",
    fugleApiKey: "offline-fixture-only",
    fetchImpl: async () => { throw Error("PROVIDER_SHOULD_NOT_BE_USED"); },
  };
  const nine = Array.from({ length: 10 }, (_, i) => ({ symbol: String(2300 + i) }));
  await assert.rejects(
    () => runBoundedDailyResonanceWorkerCycleV0_1({
      ...common, pool: { mode: "BOUNDED_PRESELECTED_ONLY", symbols: nine },
    }), /at most 9 symbols/,
  );
  await assert.rejects(
    () => runBoundedDailyResonanceWorkerCycleV0_1({
      ...common, pool: { mode: "ALL_MARKET", symbols: [] },
    }), /bounded watch pool is required/,
  );
});

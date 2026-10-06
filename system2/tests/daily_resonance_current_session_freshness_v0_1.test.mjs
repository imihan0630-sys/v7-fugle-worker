import assert from "node:assert/strict";
import { readLatestResonanceApiV0_1 } from "../runtime/daily_resonance_persistence_v0_1.mjs";

function fixtureDb(rows = []) {
  return {
    prepare(sql) {
      const execute = (args = []) => {
        if (sql.includes("SELECT market_date FROM s2_resonance_latest")) {
          const latest = [...rows].sort((a, b) => b.market_date.localeCompare(a.market_date))[0] || null;
          return { first: async () => latest ? { market_date: latest.market_date } : null };
        }
        if (sql.includes("FROM s2_resonance_latest WHERE market_date = ? AND symbol = ?")) {
          const filtered = rows
            .filter((row) => row.market_date === args[0] && row.symbol === args[1])
            .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
          return { all: async () => ({ results: filtered }) };
        }
        if (sql.includes("FROM s2_resonance_latest WHERE market_date = ?")) {
          const filtered = rows
            .filter((row) => row.market_date === args[0])
            .sort((a, b) => a.symbol.localeCompare(b.symbol));
          return { all: async () => ({ results: filtered }) };
        }
        throw new Error("unexpected SQL: " + sql);
      };
      return {
        bind(...args) {
          return execute(args);
        },
        first() {
          return execute([]).first();
        },
      };
    },
  };
}

const yesterday = "2026-10-05";
const today = "2026-10-06";
const yesterdayRow = {
  market_date: yesterday,
  symbol: "3443",
  snapshot_id: "SNAP-YESTERDAY",
  pool_id: "POOL-YESTERDAY",
  episode_id: "EP-YESTERDAY",
  episode_state: "CONFIRMED",
  updated_at: "2026-10-05T05:30:00.000Z",
  read_model_json: JSON.stringify({
    symbol: "3443",
    marketDate: yesterday,
    displaySignal: "BUY_RESONANCE",
    signalConfirmationState: "CONFIRMED",
    chart: {
      marketDate: yesterday,
      asOf: "2026-10-05T05:30:00.000Z",
    },
  }),
};
const db = fixtureDb([yesterdayRow]);

// Case A: current-session explicit query must not fall back to yesterday.
const current = await readLatestResonanceApiV0_1(db, { marketDate: today });
assert.equal(current.requestedMarketDate, today);
assert.equal(current.marketDate, today);
assert.equal(current.dateSelectionMode, "EXPLICIT_MARKET_DATE");
assert.equal(current.latestAnyDateFallbackUsed, false);
assert.equal(current.symbolCount, 0);
assert.deepEqual(current.symbols, []);

// Case C: explicit historical query remains available and is explicit by provenance.
const historical = await readLatestResonanceApiV0_1(db, { marketDate: yesterday });
assert.equal(historical.requestedMarketDate, yesterday);
assert.equal(historical.marketDate, yesterday);
assert.equal(historical.dateSelectionMode, "EXPLICIT_MARKET_DATE");
assert.equal(historical.latestAnyDateFallbackUsed, false);
assert.equal(historical.symbolCount, 1);
assert.equal(historical.symbols[0].symbol, "3443");
assert.equal(historical.symbols[0].marketDate, yesterday);

// Legacy/history latest-any-date remains supported, but is visibly marked as such.
const latestAnyDate = await readLatestResonanceApiV0_1(db);
assert.equal(latestAnyDate.requestedMarketDate, null);
assert.equal(latestAnyDate.marketDate, yesterday);
assert.equal(latestAnyDate.dateSelectionMode, "LATEST_AVAILABLE_DATE");
assert.equal(latestAnyDate.latestAnyDateFallbackUsed, true);
assert.equal(latestAnyDate.symbolCount, 1);

await assert.rejects(
  () => readLatestResonanceApiV0_1(db, { marketDate: "2026/10/06" }),
  /marketDate must be YYYY-MM-DD/,
);

const emptyLatest = await readLatestResonanceApiV0_1(fixtureDb());
assert.equal(emptyLatest.marketDate, null);
assert.equal(emptyLatest.dateSelectionMode, "LATEST_AVAILABLE_DATE");
assert.equal(emptyLatest.latestAnyDateFallbackUsed, true);
assert.equal(emptyLatest.symbolCount, 0);
assert.deepEqual(emptyLatest.symbols, []);

console.log("System2 current-session resonance freshness tests PASS");

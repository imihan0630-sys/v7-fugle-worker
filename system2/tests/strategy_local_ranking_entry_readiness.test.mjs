import assert from "node:assert/strict";
import {
  rankGlobalAdmissionWithEntryProximity,
  rankActiveMonitorWithEntryReadiness,
} from "../runtime/strategy_local_ranking_entry_readiness.mjs";

const baseline = {
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  ranked: [
    {
      symbol: "A",
      decisionId: "DA",
      paretoTier: 1,
      entryReadiness: "WATCH",
      tieBreakHash: "a",
      reasonCodes: [],
      warnings: [],
    },
    {
      symbol: "B",
      decisionId: "DB",
      paretoTier: 1,
      entryReadiness: "NEAR_ENTRY",
      tieBreakHash: "z",
      reasonCodes: [],
      warnings: [],
    },
    {
      symbol: "C",
      decisionId: "DC",
      paretoTier: 2,
      entryReadiness: "BUY_ELIGIBLE",
      tieBreakHash: "c",
      reasonCodes: [],
      warnings: [],
    },
    {
      symbol: "D",
      decisionId: "DD",
      paretoTier: 1,
      entryReadiness: "BUY_ELIGIBLE",
      tieBreakHash: "y",
      reasonCodes: [],
      warnings: [],
    },
  ],
  unranked: [],
};

const global = rankGlobalAdmissionWithEntryProximity(baseline);
assert.deepEqual(global.ranked.map((x) => x.symbol), ["D", "B", "A", "C"]);
assert.equal(global.ranked[0].entryProximityClass, "PROXIMATE");
assert.equal(global.ranked[2].entryProximityClass, "NON_PROXIMATE");

const active = rankActiveMonitorWithEntryReadiness(baseline);
assert.deepEqual(active.ranked.map((x) => x.symbol), ["D", "B", "C"]);
assert.deepEqual(
  active.ranked.map((x) => x.entryReadiness),
  ["BUY_ELIGIBLE", "NEAR_ENTRY", "BUY_ELIGIBLE"],
);
assert.equal(active.excludedNonProximate[0].symbol, "A");

console.log("System2 RANK-02 entry-readiness tests passed");

import assert from "node:assert/strict";
import {
  buildHistoricalUniverseRegistryV0_1,
  buildHistoricalUniverseSnapshotV0_1,
  toHistoricalUniverseMembershipRows,
  toHistoricalUniverseSnapshotRows,
} from "../runtime/historical_universe_registry_v0_1.mjs";

const registry = await buildHistoricalUniverseRegistryV0_1({
  registryId: "HIST-UNIVERSE-TEST-V0.1",
  datasetStartDate: "2017-01-01",
  observedAt: "2026-09-28T12:50:00Z",
  firstTradingDateByMarketSymbol: {
    "TWSE|2456": "2017-01-03",
    "TPEX|9999": null,
  },
  sourceRows: [
    {
      market: "TWSE",
      symbol: "2330",
      companyName: "台積電",
      memberState: "CURRENT",
      listingDate: "1994-09-05",
      industry: "半導體業",
      sourceId: "TWSE_ISIN_CURRENT",
      sourceName: "TWSE ISIN current listed equities",
      sourceUrl: "https://isin.twse.com.tw/",
      sourceRowHash: "SRC-2330",
    },
    {
      market: "TWSE",
      symbol: "2456",
      companyName: "奇力新",
      memberState: "DELISTED",
      listingDate: null,
      delistingDate: "2022-01-05",
      industry: "電子零組件業",
      sourceId: "TWSE_DELISTED",
      sourceName: "TWSE delisted companies",
      sourceUrl: "https://www.twse.com.tw/",
      sourceRowHash: "SRC-2456",
    },
    {
      market: "TPEX",
      symbol: "6488",
      companyName: "環球晶",
      memberState: "CURRENT",
      listingDate: "2011-10-18",
      industry: "半導體業",
      sourceId: "TPEX_ISIN_CURRENT",
      sourceName: "TPEx ISIN current listed equities",
      sourceUrl: "https://isin.twse.com.tw/",
      sourceRowHash: "SRC-6488",
    },
    {
      market: "TPEX",
      symbol: "9999",
      companyName: "未知起始樣本",
      memberState: "DELISTED",
      listingDate: null,
      delistingDate: "2020-12-31",
      sourceId: "TPEX_DELISTED",
      sourceName: "TPEx delisted companies",
      sourceUrl: "https://www.tpex.org.tw/",
      sourceRowHash: "SRC-9999",
    },
  ],
});

assert.equal(registry.membershipCount, 4);
assert.equal(registry.replayEligibleCount, 3);
assert.equal(registry.unknownStartCount, 1);
assert.equal(registry.currentCount, 2);
assert.equal(registry.delistedCount, 2);
assert.equal(registry.survivorshipPolicy, "CURRENT_PLUS_DELISTED_MARKET_INTERVALS");
assert.equal(registry.futureDelistingInfoExposedToStrategy, false);

const byKey = Object.fromEntries(
  registry.memberships.map((x) => [x.market + "|" + x.symbol, x]),
);

assert.equal(byKey["TWSE|2330"].effectiveFrom, "2017-01-01");
assert.equal(byKey["TWSE|2330"].startBasis, "DATASET_START_CLAMP");
assert.equal(byKey["TWSE|2330"].effectiveTo, null);

assert.equal(byKey["TWSE|2456"].effectiveFrom, "2017-01-03");
assert.equal(byKey["TWSE|2456"].startBasis, "HISTORY_FIRST_TRADING_DATE");
assert.equal(byKey["TWSE|2456"].effectiveTo, "2022-01-05");
assert.equal(byKey["TWSE|2456"].endBasis, "OFFICIAL_DELISTING_DATE");

assert.equal(byKey["TPEX|9999"].replayEligible, false);
assert.equal(byKey["TPEX|9999"].effectiveFrom, null);
assert.match(byKey["TPEX|9999"].qualityFlags.join(","), /LISTING_START_UNKNOWN/);

const snapshot2021 = await buildHistoricalUniverseSnapshotV0_1({
  snapshotId: "U-2021-12-30",
  registry,
  marketDate: "2021-12-30",
  capturedAt: "2026-09-28T12:55:00Z",
});
assert.equal(snapshot2021.memberCount, 3);
assert.deepEqual(
  snapshot2021.members.map((x) => x.market + "|" + x.symbol),
  ["TPEX|6488", "TWSE|2330", "TWSE|2456"],
);
assert.equal(snapshot2021.futureMembershipEndExposed, false);
assert.equal(
  Object.prototype.hasOwnProperty.call(
    snapshot2021.members.find((x) => x.symbol === "2456"),
    "effectiveTo",
  ),
  false,
);

const snapshotAfterDelist = await buildHistoricalUniverseSnapshotV0_1({
  snapshotId: "U-2022-01-06",
  registry,
  marketDate: "2022-01-06",
  capturedAt: "2026-09-28T12:55:00Z",
});
assert.equal(snapshotAfterDelist.members.some((x) => x.symbol === "2456"), false);

const snapshotBeforeHistoryStart = await buildHistoricalUniverseSnapshotV0_1({
  snapshotId: "U-2017-01-02",
  registry,
  marketDate: "2017-01-02",
  capturedAt: "2026-09-28T12:55:00Z",
});
assert.equal(snapshotBeforeHistoryStart.members.some((x) => x.symbol === "2456"), false);
assert.equal(snapshotBeforeHistoryStart.members.some((x) => x.symbol === "2330"), true);

const membershipRows = toHistoricalUniverseMembershipRows(registry);
assert.equal(membershipRows.length, 4);
assert.equal(membershipRows.find((x) => x.symbol === "2456").replay_eligible, 1);

const snapshotRows = toHistoricalUniverseSnapshotRows(snapshot2021);
assert.equal(snapshotRows.length, 3);
assert.equal(snapshotRows[0].market_date, "2021-12-30");

await assert.rejects(
  () => buildHistoricalUniverseRegistryV0_1({
    registryId: "BAD-CURRENT",
    observedAt: "2026-09-28T12:50:00Z",
    sourceRows: [{
      market: "TWSE",
      symbol: "2330",
      memberState: "CURRENT",
      listingDate: "1994-09-05",
      delistingDate: "2026-01-01",
    }],
  }),
  /CURRENT membership cannot have delistingDate/,
);

await assert.rejects(
  () => buildHistoricalUniverseRegistryV0_1({
    registryId: "BAD-RANGE",
    observedAt: "2026-09-28T12:50:00Z",
    sourceRows: [{
      market: "TWSE",
      symbol: "2456",
      memberState: "DELISTED",
      listingDate: "2023-01-01",
      delistingDate: "2022-01-05",
    }],
  }),
  /listingDate cannot be after delistingDate/,
);

console.log("System2 historical universe registry v0.1 tests passed");

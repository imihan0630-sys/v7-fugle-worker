import assert from "node:assert/strict";
import {
  parseTpexNewListedCsvV0_1,
  parseTpexDelistedPayloadV0_1,
  buildD19TpexHistoricalUniverseSourceV0_1,
  buildD19TpexUniverseSnapshotV0_1,
} from "../runtime/d19_tpex_historical_universe_source_v0_1.mjs";

const csv2023 = [
  "112 annual new listed",
  "month,code,name,listingDate",
  '"3","9001","NEW-A","2023/03/10"',
  "",
].join("\r\n");
const csv2024 = [
  "113 annual new listed",
  "month,code,name,listingDate",
  '"2","9002","NEW-B","2024/02/15"',
  "",
].join("\r\n");

assert.deepEqual(
  parseTpexNewListedCsvV0_1(csv2023, { year: 2023 }).map((x) => [x.symbol, x.listingDate]),
  [["9001", "2023-03-10"]],
);
assert.throws(
  () => parseTpexNewListedCsvV0_1(csv2023, { year: 2024 }),
  /year mismatch/,
);

const delisted2023 = {
  stat: "ok",
  tables: [{
    fields: ["股票代號", "公司名稱", "終止上櫃日期", "終止上櫃原因", "公司資料網址"],
    data: [
      ["9001", "NEW-A", "112-12-15", "reason-a", "https://example.test/a"],
      ["9003", "OLD-C", "112-11-20", "reason-c", "https://example.test/c"],
    ],
    totalCount: 2,
  }],
};
assert.deepEqual(
  parseTpexDelistedPayloadV0_1(delisted2023, { requestedYear: 2023 })
    .map((x) => [x.symbol, x.delistingDate]),
  [["9003", "2023-11-20"], ["9001", "2023-12-15"]],
);

const current = Array.from({ length: 600 }, (_, i) => {
  const symbol = String(1000 + i);
  return {
    Date: "1151004",
    SecuritiesCompanyCode: symbol,
    CompanyName: "CURRENT-" + symbol,
    DateOfListing: "20100104",
    SecuritiesIndustryCode: "00",
  };
});

const delisted2024 = {
  stat: "ok",
  tables: [{
    fields: ["股票代號", "公司名稱", "終止上櫃日期", "終止上櫃原因", "公司資料網址"],
    data: [
      ["9002", "NEW-B", "113-09-30", "reason-b", "https://example.test/b"],
    ],
    totalCount: 1,
  }],
};

function jsonResponse(value) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json;charset=UTF-8" },
  });
}
function csvResponse(value) {
  return new Response(Buffer.from(value, "ascii"), {
    status: 200,
    headers: { "content-type": "application/csv;charset=MS950" },
  });
}

async function fetchImpl(url) {
  const u = String(url);
  if (u.includes("/openapi/v1/mopsfin_t187ap03_O")) return jsonResponse(current);
  if (u.includes("applicantStatDl?type=list&date=2023")) return csvResponse(csv2023);
  if (u.includes("applicantStatDl?type=list&date=2024")) return csvResponse(csv2024);
  if (u.includes("company/deListed") && u.includes("date=2023")) return jsonResponse(delisted2023);
  if (u.includes("company/deListed") && u.includes("date=2024")) return jsonResponse(delisted2024);
  if (u.includes("afterTrading/tradingStock") && u.includes("code=9003") && u.includes("2023%2F01%2F01")) {
    return jsonResponse({
      tables: [{
        title: "個股日成交資訊",
        data: [
          ["112/01/03", "10", "100", "10", "10", "10", "10", "0", "1"],
          ["112/01/04", "12", "120", "10", "10", "10", "10", "0", "2"],
        ],
      }],
      date: "20230101",
      code: "9003",
      name: "OLD-C",
      flagField: "張數",
      stat: "ok",
    });
  }
  throw new Error("unexpected URL: " + u);
}

const source = await buildD19TpexHistoricalUniverseSourceV0_1({
  datasetStartDate: "2023-01-01",
  observedAt: "2024-10-04T11:50:00Z",
  archiveStartYear: 2023,
  throughYear: 2024,
  fetchImpl,
});

assert.equal(source.registry.currentCount, 600);
assert.equal(source.registry.delistedCount, 3);
assert.equal(source.registry.unknownStartCount, 0);
assert.equal(source.registry.replayEligibleCount, source.registry.membershipCount);
assert.equal(source.sourceReceipt.newListedArchiveCount, 2);
assert.equal(source.sourceReceipt.delistedCount, 3);
assert.equal(source.sourceReceipt.datasetStartFallbackCount, 1);
assert.equal(source.sourceReceipt.datasetStartFallbacks[0].symbol, "9003");
assert.equal(source.sourceReceipt.currentIndustryUsedForHistoricalReplay, false);
assert.equal(source.registry.futureDelistingInfoExposedToStrategy, false);

const a = source.registry.memberships.find((x) => x.symbol === "9001");
assert.equal(a.listingDate, "2023-03-10");
assert.equal(a.effectiveFrom, "2023-03-10");
assert.equal(a.effectiveTo, "2023-12-15");
assert.equal(a.startBasis, "OFFICIAL_LISTING_DATE");

const old = source.registry.memberships.find((x) => x.symbol === "9003");
assert.equal(old.listingDate, null);
assert.equal(old.firstTradingDate, "2023-01-03");
assert.equal(old.effectiveFrom, "2023-01-03");
assert.equal(old.startBasis, "HISTORY_FIRST_TRADING_DATE");

const snapshotMid2023 = await buildD19TpexUniverseSnapshotV0_1({
  source,
  marketDate: "2023-06-30",
  capturedAt: "2024-10-04T11:51:00Z",
});
assert.equal(snapshotMid2023.members.some((x) => x.symbol === "9001"), true);
assert.equal(snapshotMid2023.members.some((x) => x.symbol === "9002"), false);
assert.equal(snapshotMid2023.members.some((x) => x.symbol === "9003"), true);
assert.equal(snapshotMid2023.futureMembershipEndExposed, false);
assert.ok(snapshotMid2023.members.every((x) => !Object.hasOwn(x, "effectiveTo")));

const snapshotAfter2023Delist = await buildD19TpexUniverseSnapshotV0_1({
  source,
  marketDate: "2024-01-31",
  capturedAt: "2024-10-04T11:52:00Z",
});
assert.equal(snapshotAfter2023Delist.members.some((x) => x.symbol === "9001"), false);
assert.equal(snapshotAfter2023Delist.members.some((x) => x.symbol === "9003"), false);

const snapshotMid2024 = await buildD19TpexUniverseSnapshotV0_1({
  source,
  marketDate: "2024-06-30",
  capturedAt: "2024-10-04T11:53:00Z",
});
assert.equal(snapshotMid2024.members.some((x) => x.symbol === "9002"), true);

await assert.rejects(
  () => buildD19TpexHistoricalUniverseSourceV0_1({
    datasetStartDate: "2023-01-01",
    observedAt: "2024-10-04T11:50:00Z",
    archiveStartYear: 2023,
    throughYear: 2024,
    fetchImpl: async (url) => {
      const u = String(url);
      if (u.includes("afterTrading/tradingStock") && u.includes("code=9003")) {
        return jsonResponse({ tables: [{ data: [] }], code: "9003", flagField: "張數", stat: "ok" });
      }
      return fetchImpl(url);
    },
  }),
  /UNRESOLVED_OLD_DELISTED_DATASET_START:9003/,
);

console.log("D19 TPEx historical universe source v0.1 tests passed");

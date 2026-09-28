import assert from "node:assert/strict";
import {
  buildHistoricalA1PacksResearchV0_1,
  unpackHistoricalA1PackResearchV0_1,
} from "../runtime/historical_pack_research_v0_1.mjs";

const rows = Array.from({ length: 20 }, (_, i) => ({
  market: "TWSE",
  symbol: "2330",
  companyName: "台積電",
  marketDate: `2017-01-${String(i + 2).padStart(2, "0")}`,
  priceSpace: "RAW",
  open: 180 + i,
  high: 182 + i,
  low: 179 + i,
  close: 181 + i,
  volumeShares: 20_000_000 + i * 10_000,
  tradeValue: 3_600_000_000 + i * 1_000_000,
  transactions: 10_000 + i,
  change: 1,
  continuityState: "UNVERIFIED",
  sourceId: "TWSE_FIXTURE",
  sourceName: "fixture",
  sourceRowHash: "hash-" + i,
}));

const set = await buildHistoricalA1PacksResearchV0_1({
  rows,
  capturedAt: "2026-09-28T12:10:00Z",
});
assert.equal(set.packCount, 1);
assert.equal(set.barCount, 20);
assert.ok(set.gzipBytes < set.payloadJsonBytes);
assert.ok(set.base64Bytes < set.payloadJsonBytes);

const payload = await unpackHistoricalA1PackResearchV0_1(set.packs[0]);
assert.equal(payload.symbol, "2330");
assert.equal(payload.market, "TWSE");
assert.equal(payload.year, 2017);
assert.equal(payload.bars.length, 20);
assert.equal(payload.bars[0][0], "2017-01-02");
assert.equal(payload.nameTimeline[0][1], "台積電");

const changedName = await buildHistoricalA1PacksResearchV0_1({
  rows: rows.map((x, i) => i < 10 ? x : { ...x, companyName: "台積電新名" }),
  capturedAt: "2026-09-28T12:10:00Z",
});
const changedPayload = await unpackHistoricalA1PackResearchV0_1(changedName.packs[0]);
assert.equal(changedPayload.nameTimeline.length, 2);
assert.equal(changedPayload.nameTimeline[1][0], rows[10].marketDate);

console.log("System2 packed historical A1 research v0.1 tests passed");

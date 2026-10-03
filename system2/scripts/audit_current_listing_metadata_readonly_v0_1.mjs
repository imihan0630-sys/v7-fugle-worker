import assert from "node:assert/strict";
import { fetchCurrentListingMetadataV0_1 } from "../runtime/current_listing_metadata_v0_1.mjs";

const observedAt = new Date().toISOString();
const result = await fetchCurrentListingMetadataV0_1({ observedAt });
assert.equal(result.state, "READY", "current listing metadata must be READY");
assert.ok(result.counts.TWSE >= 500, "TWSE listing metadata coverage too low");
assert.ok(result.counts.TPEX >= 400, "TPEX listing metadata coverage too low");
assert.equal(result.byMarketSymbol["TWSE|2330"]?.listingDate, "1994-09-05");
assert.equal(result.byMarketSymbol["TPEX|6488"]?.listingDate, "2015-09-25");
assert.equal(result.externalMutationPerformed, false);

const recent = Object.values(result.byMarketSymbol)
  .filter((row) => row.listingDate >= "2026-01-01")
  .sort((a, b) => b.listingDate.localeCompare(a.listingDate) || a.symbol.localeCompare(b.symbol))
  .slice(0, 20)
  .map((row) => ({
    market: row.market, symbol: row.symbol, companyName: row.companyName, listingDate: row.listingDate,
  }));

console.log(JSON.stringify({
  result: "PASS",
  schemaVersion: result.schemaVersion,
  observedAt: result.observedAt,
  counts: result.counts,
  metadataHash: result.metadataHash,
  witness: {
    twse2330: result.byMarketSymbol["TWSE|2330"],
    tpex6488: result.byMarketSymbol["TPEX|6488"],
  },
  recentListings: recent,
  mutationPerformed: false,
  selectionAuthority: false,
  continuityPromotionPerformed: false,
  system1RuntimeUsed: false,
}, null, 2));
import assert from "node:assert/strict";
import {
  fetchCurrentListingMetadataV0_1,
  parseCsvRowsV0_1,
  parseListingDateV0_1,
} from "../runtime/current_listing_metadata_v0_1.mjs";

const listed = [
  "出表日期,公司代號,公司名稱,公司簡稱,產業別,成立日期,上市日期",
  '20261003,2330,"台灣積體電路製造股份有限公司",台積電,半導體業,1987/02/21,1994/09/05',
  "20261003,1101,台灣水泥股份有限公司,台泥,水泥工業,1950/12/29,1962/02/09",
  "20261003,00631L,ETF,ETF,ETF,2014/01/01,2014/10/31",
].join("\r\n");
const otc = [
  "出表日期,公司代號,公司名稱,公司簡稱,產業別,成立日期,上櫃日期",
  "20261003,6488,環球晶圓股份有限公司,環球晶,半導體業,2011/03/18,2015/09/25",
  "20261003,7777,測試新櫃公司,新櫃,其他,2026/08/01,115/09/29",
].join("\n");

assert.deepEqual(parseCsvRowsV0_1('a,"b,b","c""d"\n1,2,3'), [
  ["a", "b,b", 'c"d'],
  ["1", "2", "3"],
]);
assert.equal(parseListingDateV0_1("1994/09/05"), "1994-09-05");
assert.equal(parseListingDateV0_1("115/09/29"), "2026-09-29");
assert.equal(parseListingDateV0_1("20261002"), "2026-10-02");

const fetched = await fetchCurrentListingMetadataV0_1({
  observedAt: "2026-10-03T05:00:00.000Z",
  minimumByMarket: { TWSE: 2, TPEX: 2 },
  fetchImpl: async (url) => ({
    ok: true,
    status: 200,
    async text() {
      return String(url).includes("t187ap03_L") ? listed : otc;
    },
  }),
});
assert.equal(fetched.state, "READY");
assert.deepEqual(fetched.counts, { TWSE: 2, TPEX: 2 });
assert.equal(fetched.byMarketSymbol["TWSE|2330"].listingDate, "1994-09-05");
assert.equal(fetched.byMarketSymbol["TPEX|7777"].listingDate, "2026-09-29");
assert.equal(fetched.byMarketSymbol["TWSE|00631L"], undefined);
assert.match(fetched.metadataHash, /^[a-f0-9]{64}$/);
assert.equal(fetched.externalMutationPerformed, false);

const incomplete = await fetchCurrentListingMetadataV0_1({
  observedAt: "2026-10-03T05:00:00.000Z",
  minimumByMarket: { TWSE: 3, TPEX: 2 },
  fetchImpl: async (url) => ({
    ok: true,
    status: 200,
    text: async () => String(url).includes("t187ap03_L") ? listed : otc,
  }),
});
assert.equal(incomplete.state, "INCOMPLETE");
assert.ok(incomplete.blockerCodes.includes("TWSE:LISTING_METADATA_COVERAGE_LOW"));

console.log("System2 current listing metadata adapter tests passed");


let retryCalls = 0;
const retried = await fetchCurrentListingMetadataV0_1({
  observedAt: "2026-10-03T05:00:00.000Z",
  minimumByMarket: { TWSE: 2, TPEX: 2 },
  retryAttempts: 3,
  retryDelayMs: 0,
  fetchImpl: async (url) => {
    retryCalls += 1;
    if (retryCalls === 1) throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    return {
      ok: true,
      status: 200,
      text: async () => String(url).includes("t187ap03_L") ? listed : otc,
    };
  },
});
assert.equal(retried.state, "READY");
assert.ok(retryCalls >= 3, "one transient timeout plus both market fetches should be observed");

let exhaustedCalls = 0;
await assert.rejects(
  () => fetchCurrentListingMetadataV0_1({
    observedAt: "2026-10-03T05:00:00.000Z",
    minimumByMarket: { TWSE: 2, TPEX: 2 },
    retryAttempts: 2,
    retryDelayMs: 0,
    fetchImpl: async () => {
      exhaustedCalls += 1;
      throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    },
  }),
  /listing metadata transport exhausted after 2 attempts/,
);
assert.equal(exhaustedCalls, 4, "both markets must fail closed after their own retry budgets");


let bodyRetryCalls = 0;
const bodyRetried = await fetchCurrentListingMetadataV0_1({
  observedAt: "2026-10-03T05:00:00.000Z",
  minimumByMarket: { TWSE: 2, TPEX: 2 },
  retryAttempts: 3,
  retryDelayMs: 0,
  fetchImpl: async (url) => ({
    ok: true,
    status: 200,
    async text() {
      bodyRetryCalls += 1;
      if (bodyRetryCalls === 1) {
        throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
      }
      return String(url).includes("t187ap03_L") ? listed : otc;
    },
  }),
});
assert.equal(bodyRetried.state, "READY");
assert.ok(bodyRetryCalls >= 3, "body-read timeout must be retried inside adapter");


const listedJson = JSON.stringify([
  {"出表日期":"20261003","公司代號":"2330","公司名稱":"台灣積體電路製造股份有限公司","公司簡稱":"台積電","產業別":"半導體業","上市日期":"1994/09/05"},
  {"出表日期":"20261003","公司代號":"1101","公司名稱":"台灣水泥股份有限公司","公司簡稱":"台泥","產業別":"水泥工業","上市日期":"1962/02/09"}
]);
const otcJson = JSON.stringify([
  {"Date":"1151003","SecuritiesCompanyCode":"6488","CompanyName":"環球晶圓股份有限公司","CompanyAbbreviation":"環球晶","SecuritiesIndustryCode":"24","DateOfListing":"20150925"},
  {"Date":"1151003","SecuritiesCompanyCode":"7777","CompanyName":"測試新櫃公司","CompanyAbbreviation":"新櫃","SecuritiesIndustryCode":"99","DateOfListing":"20260929"}
]);
const jsonFetched = await fetchCurrentListingMetadataV0_1({
  observedAt: "2026-10-03T05:00:00.000Z",
  minimumByMarket: { TWSE: 2, TPEX: 2 },
  retryAttempts: 1,
  retryDelayMs: 0,
  fetchImpl: async (url) => ({
    ok: true,
    status: 200,
    text: async () => String(url).includes("t187ap03_L") ? listedJson : otcJson,
  }),
});
assert.equal(jsonFetched.state, "READY");
assert.equal(jsonFetched.byMarketSymbol["TWSE|2330"].listingDate, "1994-09-05");
assert.equal(jsonFetched.byMarketSymbol["TPEX|6488"].listingDate, "2015-09-25");


let tpexOnlyCalls = 0;
const tpexOnly = await fetchCurrentListingMetadataV0_1({
  observedAt: "2026-10-03T05:00:00.000Z",
  markets: ["TPEX"],
  minimumByMarket: { TPEX: 2 },
  retryAttempts: 1,
  retryDelayMs: 0,
  fetchImpl: async (url) => {
    tpexOnlyCalls += 1;
    assert.match(String(url), /t187ap03_O/);
    return { ok: true, status: 200, text: async () => otcJson };
  },
});
assert.equal(tpexOnly.state, "READY");
assert.deepEqual(tpexOnly.counts, { TWSE: 0, TPEX: 2 });
assert.deepEqual(tpexOnly.requestedMarkets, ["TPEX"]);
assert.equal(tpexOnlyCalls, 1);
assert.equal(tpexOnly.byMarketSymbol["TWSE|2330"], undefined);
assert.equal(tpexOnly.byMarketSymbol["TPEX|6488"].listingDate, "2015-09-25");

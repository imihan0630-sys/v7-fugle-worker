// DATA_LANE Issue #1026 P05: revalidate official 12 frozen source receipts and
// generate a fully enumerated stock-date source-key baseline without D1/R2.
// This is source evidence ONLY, not D1 key-presence, original PIT, or a quota grant.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchOfficialHistoricalA1DateV0_1} from "./official_historical_a1_source_v0_1.mjs";
import {validateOct08FrozenSourceEvidenceV0_1}
 from "./oct08_full_source_to_hot_d1_census_readonly_v0_1.mjs";

const MARKET_ORDER=Object.freeze(["TWSE","TPEX"]);
const DATES=Object.freeze(["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"]);
const digest=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sourceTuple=r=>[r.symbol,r.open,r.high,r.low,r.close,
 r.volumeShares,r.tradeValue,r.transactions];
const sourceValuesSha=rows=>digest(rows.map(sourceTuple)
 .sort((a,b)=>a[0].localeCompare(b[0])));
const expectedSourceId=market=>market==="TWSE"?
 "A1_TWSE_MI_INDEX_HISTORICAL_DAILY":"A1_TPEX_DAILY_QUOTES_HISTORICAL";

export async function buildIssue1026Oct08SourceKeyManifestV0_1({
 officialEvidence,
 fetchDate=fetchOfficialHistoricalA1DateV0_1,
 onStage=()=>{},
}={}){
 assert.equal(typeof fetchDate,"function");
 assert.equal(typeof onStage,"function");
 assert.equal(officialEvidence?.cutoff,"2026-10-08");
 assert.equal(officialEvidence?.officialWindow?.sourceResult,
  "PASS_20261001_08_12_OFFICIAL_SOURCE_DATE_RECEIPTS_ONLY");
 const frozen=validateOct08FrozenSourceEvidenceV0_1(officialEvidence);
 assert.equal(frozen.size,12);
 const keyRows=[],perDate=[],uniqueKeys=new Set();
 let total=0,twseCount=0,tpexCount=0;
 for(const date of DATES)for(const market of MARKET_ORDER){
  const expected=frozen.get(market+"|"+date);
  assert.ok(expected,"frozen market-date receipt missing");
  assert.equal(expected.sourceId,expectedSourceId(market),"frozen source ID changed");
  await onStage({stage:"BEFORE_OFFICIAL_FETCH",market,date});
  const source=await fetchDate({market,marketDate:date,
   observedAt:()=>new Date().toISOString()});
  assert.equal(source?.state,"READY","OFFICIAL_SOURCE_NOT_READY");
  assert.equal(source?.market,market,"OFFICIAL_MARKET_CHANGED");
  assert.equal(source?.marketDate,date,"OFFICIAL_MARKET_DATE_CHANGED");
  assert.equal(source?.sourceDateEvidence,date,"OFFICIAL_PAYLOAD_DATE_CHANGED");
  assert.equal(source?.sourceId,expected.sourceId,"OFFICIAL_SOURCE_ID_CHANGED");
  assert.equal(source?.transportMode,"PRIMARY","LEGACY_SOURCE_NOT_CANONICAL");
  assert.equal(source?.sourceDateEvidenceBasis,expected.sourceDateEvidenceBasis,
   "SOURCE_DATE_EVIDENCE_BASIS_CHANGED");
  assert.equal(source?.ordinarySymbolCount,expected.ordinarySymbolCount,
   "OFFICIAL_SOURCE_KEY_COUNT_CHANGED");
  assert.equal(source?.rows?.length,expected.ordinarySymbolCount,
   "OFFICIAL_ROWS_INCOMPLETE");
  assert.equal(sourceValuesSha(source.rows),expected.normalizedBarSha256,
   "OFFICIAL_FULL_BAR_TUPLES_CHANGED_FROM_IMMUTABLE_PROOF");
  const sorted=[...source.rows].sort((a,b)=>a.symbol.localeCompare(b.symbol));
  assert.equal(new Set(sorted.map(x=>x.symbol)).size,sorted.length,
   "DUPLICATE_ORDINARY_SYMBOL_IN_OFFICIAL_SOURCE");
  const day=[];
  for(const item of sorted){
   assert.equal(item.market,market);
   assert.equal(item.marketDate,date);
   assert.match(item.symbol,/^[1-9][0-9]{3}$/);
   assert.equal(item.priceSpace,"RAW");
   assert.equal(item.continuityState,"UNVERIFIED");
   const key=market+"|"+date+"|"+item.symbol;
   assert.ok(!uniqueKeys.has(key),"DUPLICATE_MARKET_DATE_SYMBOL");
   uniqueKeys.add(key);
   const receipt=Object.freeze({
    market,marketDate:date,symbol:item.symbol,
    sourceValueSha256:digest(sourceTuple(item)),
    sourceObservationIsRetrospective:true,
    historicalOriginalFirstKnownAtCertified:false,
    physicalHotD1Presence:"UNKNOWN",
    physicalHotD1VersionCount:"UNKNOWN",
    originalPITReplayAuthorized:false,
   });
   day.push(receipt);
   keyRows.push(receipt);
  }
  const rec=Object.freeze({
   market,marketDate:date,sourceId:expected.sourceId,
   ordinarySymbolCount:sorted.length,
   frozenNormalizedBarSha256:expected.normalizedBarSha256,
   sourceKeyIdentitySha256:digest(day.map(x=>x.symbol)),
   sourceKeyValueSha256:digest(day.map(x=>[x.symbol,x.sourceValueSha256])),
   sourceDateEvidenceBasis:source.sourceDateEvidenceBasis,
   sourceTransport:"PRIMARY",
   originalHistoricalFirstKnownAtCertified:false,
   hotD1ReadbackCertified:false,
  });
  perDate.push(rec);
  total+=day.length;
  if(market==="TWSE")twseCount+=day.length;
  else tpexCount+=day.length;
  await onStage({stage:"FROZEN_OFFICIAL_SOURCE_DATE_PASS",
   market,marketDate:date,count:day.length,done:perDate.length});
 }
 assert.equal(perDate.length,12);
 assert.equal(total,11843,"OFFICIAL_MARKET_SOURCE_TOTAL_CHANGED");
 assert.equal(twseCount,6518);
 assert.equal(tpexCount,5325);
 assert.equal(uniqueKeys.size,total);
 return Object.freeze({
  schemaVersion:"S2_ISSUE1026_P05_OCT08_FULL_OFFICIAL_SOURCE_KEY_MANIFEST_V0_1",
  result:"PASS_11843_OFFICIAL_SOURCE_KEYS_ONLY_NO_D1_CENSUS",
  issue:1026,marketDateCutoff:"2026-10-08",
  originalFrozenSourceRunId:37878847039,
  originalFrozenSourceSha:"39ca8dce38fa675874074609fb32d9c44321e944",
  sourceDateMarketReceipts:12,
  officialSourceStockDateKeys:total,marketSourceKeys:{TWSE:twseCount,TPEX:tpexCount},
  dateSourceReceipts:perDate,
  manifestKeyCount:keyRows.length,
  manifestSourceKeysSha256:digest(keyRows.map(x=>[x.market,x.marketDate,x.symbol])),
  manifestSourceKeyValuesSha256:digest(keyRows.map(x=>[
   x.market,x.marketDate,x.symbol,x.sourceValueSha256])),
  manifestSourceKeyRows:keyRows,
  sourceOnly:true,
  hotD1ScoutPhysicalExecuted:0,
  hotD1FullPhysicalExecuted:0,
  physicalD1MissingKeys:"UNKNOWN",
  physicalD1MultiVersionKeys:"UNKNOWN",
  pointInTimeAvailableAtAtHistoricalCutCertified:false,
  originalFirstKnownAtCertified:false,
  noEventContinuityCertified:false,
  selectedToTradeAuthorized:false,
  d1SelectsExecutedByManifest:0,d1WritesExecutedByManifest:0,
  r2CallsExecutedByManifest:0,system1RuntimeUsed:false,
 });
}

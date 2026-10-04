import assert from "node:assert/strict";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { classifyD19ObservationV0_1 } from "../runtime/d19_valid_observation_adapter_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

const fromDate="2026-08-03";
const toDate="2026-08-31";
const observedAt=new Date().toISOString();
const targetSymbols=new Set([
  "1213","1341","1443","1472","1516","1538","2254","2321","2712","4190",
  "5906","6955","8101","8482","9110",
]);

const range=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TWSE",
  fromDate,
  toDate,
  observedAt,
  pauseMs:25,
  includeRowProvenance:true,
});
assert.equal(range.tradingDateCount,21);
assert.equal(range.fetchedTradingDateCount,21);

const targetRows=range.rows.filter((row)=>targetSymbols.has(row.symbol));
const classified=[];
for(const row of targetRows){
  const observation=await classifyD19ObservationV0_1({
    market:"TWSE",
    symbol:row.symbol,
    marketDate:row.marketDate,
    sourceRow:row,
  });
  if(observation.state!=="ELIGIBLE_VALID_PRICE_SESSION"){
    classified.push(observation);
  }
}

const counts=Object.fromEntries(
  [...new Set(classified.map((x)=>x.state))]
    .sort()
    .map((state)=>[state,classified.filter((x)=>x.state===state).length]),
);

assert.equal(classified.length,50);
assert.equal(counts.OFFICIAL_ZERO_TRADE_ROW,11);
assert.equal(counts.UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE,39);
assert.equal(counts.SOURCE_UNKNOWN ?? 0,0);
assert.ok(classified.every((x)=>x.forwardFillPerformed===false));
assert.ok(classified.every((x)=>x.previousCloseSubstitutionPerformed===false));
assert.ok(classified.every((x)=>x.factorReturnValueMayUseClose===false));
assert.ok(classified.every((x)=>x.close===null));

const canonical=classified
  .map((x)=>({
    market:x.market,
    symbol:x.symbol,
    marketDate:x.marketDate,
    state:x.state,
    reasonCode:x.reasonCode,
    sourceRowHash:x.sourceRowHash,
    observationHash:x.observationHash,
  }))
  .sort((a,b)=>
    (a.symbol+"|"+a.marketDate).localeCompare(b.symbol+"|"+b.marketDate)
  );

const evidenceHash=await sha256Hex(canonical);

console.log(JSON.stringify({
  result:"PASS_REAL_SOURCE_NEGATIVE_GATE",
  smokeVersion:"D19_VALID_OBSERVATION_REAL_SOURCE_SMOKE_V0_1",
  fromDate,
  toDate,
  officialTradingDates:range.tradingDateCount,
  sourceRowCount:range.rowCount,
  targetSymbolCount:targetSymbols.size,
  nonPriceObservationCount:classified.length,
  stateCounts:counts,
  evidenceHash,
  samples:canonical,
  interpretation:{
    oldProbeReproduced:true,
    positiveActivityWithoutCloseRemainsUnknownPrice:true,
    zeroTradeNotZeroReturn:true,
    forwardFillPerformed:false,
    previousCloseSubstitutionPerformed:false,
    localSuspensionInferencePerformed:false,
    l3PromotionAuthorized:false,
  },
  formalCoreChanged:false,
  productionChanged:false,
},null,2));

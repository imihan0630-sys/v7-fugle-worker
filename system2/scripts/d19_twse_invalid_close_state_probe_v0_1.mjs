import assert from "node:assert/strict";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";

const fromDate="2026-08-03";
const toDate="2026-08-31";
const observedAt=new Date().toISOString();
const targetSymbols=new Set([
  "1213","1341","1443","1472","1516","1538","2254","2321","2712","4190",
  "5906","6955","8101","8482","9110",
]);

const range=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TWSE",fromDate,toDate,observedAt,pauseMs:25,includeRowProvenance:true,
});
assert.equal(range.tradingDateCount,21);
assert.equal(range.fetchedTradingDateCount,21);

const rows=range.rows.filter(row=>targetSymbols.has(row.symbol));
const diagnostics=[];
for(const symbol of [...targetSymbols].sort()){
  const symbolRows=rows.filter(row=>row.symbol===symbol).sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  const invalid=symbolRows.filter(row=>!Number.isFinite(row.close)||row.close<=0);
  diagnostics.push({
    symbol,
    rowCount:symbolRows.length,
    invalidCloseCount:invalid.length,
    invalidRows:invalid.map(row=>({
      marketDate:row.marketDate,
      open:row.open,high:row.high,low:row.low,close:row.close,
      volumeShares:row.volumeShares,
      tradeValue:row.tradeValue,
      transactions:row.transactions,
      change:row.change,
      sourceRowHash:row.sourceRowHash,
      zeroVolume:row.volumeShares===0,
      zeroTradeValue:row.tradeValue===0,
      zeroTransactions:row.transactions===0,
      allOhlcNull:[row.open,row.high,row.low,row.close].every(x=>x===null),
      state:
        row.volumeShares===0
        && row.tradeValue===0
        && row.transactions===0
        && [row.open,row.high,row.low,row.close].every(x=>x===null)
          ?"OFFICIAL_ZERO_TRADE_ROW"
          :"UNRESOLVED_INVALID_CLOSE_ROW",
    })),
  });
}
const allInvalid=diagnostics.flatMap(x=>x.invalidRows);
const stateCounts=Object.fromEntries(
  [...new Set(allInvalid.map(x=>x.state))].sort()
    .map(state=>[state,allInvalid.filter(x=>x.state===state).length])
);
console.log(JSON.stringify({
  result:"PASS",
  probeVersion:"D19_TWSE_INVALID_CLOSE_STATE_V0_1",
  fromDate,toDate,
  officialTradingDates:range.tradingDateCount,
  sourceRowCount:range.rowCount,
  targetSymbolCount:targetSymbols.size,
  targetInvalidRowCount:allInvalid.length,
  stateCounts,
  diagnostics,
  interpretation:{
    zeroTradeIsNotMissingSource:true,
    stalePriceRiskMustRemainExplicit:true,
    forwardFillProhibited:true,
    factorEligibilityNeedsPredeclaredValidObservationRule:true,
  },
  formalCoreChanged:false,
  productionChanged:false,
},null,2));

import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { buildHistoricalA1PacksResearchV0_1 } from "../runtime/historical_pack_research_v0_1.mjs";

const fromDate=process.env.SYSTEM2_PACK_BENCH_FROM || "2026-08-03";
const toDate=process.env.SYSTEM2_PACK_BENCH_TO || "2026-08-31";
const capturedAt=new Date().toISOString();

const marketResults=[];
const allRows=[];
for(const market of ["TWSE","TPEX"]){
  const range=await fetchOfficialHistoricalA1RangeV0_1({
    market,fromDate,toDate,observedAt:capturedAt,pauseMs:25,
  });
  allRows.push(...range.rows);
  marketResults.push({
    market,
    tradingDateCount:range.tradingDateCount,
    rowCount:range.rowCount,
    averageRowsPerTradingDate:range.tradingDateCount
      ? Number((range.rowCount/range.tradingDateCount).toFixed(2))
      : null,
  });
}

const packSet=await buildHistoricalA1PacksResearchV0_1({
  rows:allRows,capturedAt,
});
const rowCount=allRows.length;
const bytesPerBar={
  json:rowCount?packSet.payloadJsonBytes/rowCount:null,
  gzip:rowCount?packSet.gzipBytes/rowCount:null,
  base64:rowCount?packSet.base64Bytes/rowCount:null,
};
const projectionBars=4_700_000;
const projected={
  assumedBars:projectionBars,
  gzipMiB:bytesPerBar.gzip===null?null:Number((bytesPerBar.gzip*projectionBars/1024/1024).toFixed(1)),
  base64MiB:bytesPerBar.base64===null?null:Number((bytesPerBar.base64*projectionBars/1024/1024).toFixed(1)),
  note:"Conservative month-pack projection; full-year per-symbol packs should compress better because fixed pack overhead is amortized across more bars.",
};

console.log(JSON.stringify({
  result:"PASS",
  benchmarkVersion:"S2_HISTORICAL_PACK_FULL_MARKET_MONTH_BENCH_V0_1",
  fromDate,toDate,capturedAt,
  markets:marketResults,
  rowCount,
  packCount:packSet.packCount,
  payloadJsonBytes:packSet.payloadJsonBytes,
  gzipBytes:packSet.gzipBytes,
  base64Bytes:packSet.base64Bytes,
  gzipRatio:packSet.payloadJsonBytes?Number((packSet.gzipBytes/packSet.payloadJsonBytes).toFixed(4)):null,
  base64Ratio:packSet.payloadJsonBytes?Number((packSet.base64Bytes/packSet.payloadJsonBytes).toFixed(4)):null,
  bytesPerBar:Object.fromEntries(Object.entries(bytesPerBar).map(([k,v])=>[k,v===null?null:Number(v.toFixed(2))])),
  projection:projected,
  writesPerformed:false,
  system1RuntimeChanged:false,
},null,2));

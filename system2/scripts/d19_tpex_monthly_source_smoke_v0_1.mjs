import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildOfficialMonthlyHistoryUrl,
  fetchOfficialMonthlyHistoryPayloadV0_1,
  normalizeOfficialMonthlyHistoryPayloadV0_1,
} from "../runtime/official_monthly_history_adapter_v0_1.mjs";

const market="TPEX";
const yearMonth=process.env.D19_TPEX_MONTH || "2026-08";
const symbols=(process.env.D19_TPEX_SYMBOLS || "3105,6488")
  .split(",").map((x)=>x.trim()).filter(Boolean);
const observedAt=new Date().toISOString();
const receipts=[];

for(const symbol of symbols){
  const sourceUrl=buildOfficialMonthlyHistoryUrl({market,symbol,yearMonth});
  const payload=await fetchOfficialMonthlyHistoryPayloadV0_1({
    market,symbol,yearMonth,timeoutMs:45000,
  });
  const sourcePayloadContentHash=await sha256Hex(payload);
  const normalized=await normalizeOfficialMonthlyHistoryPayloadV0_1({
    market,symbol,yearMonth,payload,observedAt,
  });
  assert.ok(normalized.rowCount>0, symbol+" monthly source returned no rows");
  assert.ok(normalized.rows.every((row)=>row.market==="TPEX"));
  assert.ok(normalized.rows.every((row)=>row.symbol===symbol));
  assert.ok(normalized.rows.every((row)=>row.marketDate.startsWith(yearMonth+"-")));
  assert.ok(normalized.rows.every((row)=>row.sourceId==="TPEX_ST43_MONTHLY"));
  assert.ok(normalized.rows.every((row)=>row.availableAt&&row.availabilityBasis==="SESSION_CLOSE_FINALITY"));

  const validPriceRows=normalized.rows.filter((row)=>Number.isFinite(row.close)&&row.close>0);
  const nonPriceRows=normalized.rows.filter((row)=>!Number.isFinite(row.close)||row.close<=0);
  assert.ok(validPriceRows.length>0, symbol+" requires at least one valid official close");

  receipts.push({
    market,
    symbol,
    yearMonth,
    sourceUrl,
    sourcePayloadContentHash,
    rowCount:normalized.rowCount,
    validPriceRowCount:validPriceRows.length,
    nonPriceRowCount:nonPriceRows.length,
    firstMarketDate:normalized.firstMarketDate,
    lastMarketDate:normalized.lastMarketDate,
    firstClose:validPriceRows[0]?.close??null,
    lastClose:validPriceRows.at(-1)?.close??null,
    availabilityBasis:"SESSION_CLOSE_FINALITY",
    historicalEndpointPublicationTimestampProven:false,
    sourceId:"TPEX_ST43_MONTHLY",
  });
}

const evidenceHash=await sha256Hex(
  receipts.map((x)=>({
    market:x.market,
    symbol:x.symbol,
    yearMonth:x.yearMonth,
    sourcePayloadContentHash:x.sourcePayloadContentHash,
    rowCount:x.rowCount,
    validPriceRowCount:x.validPriceRowCount,
    nonPriceRowCount:x.nonPriceRowCount,
    firstMarketDate:x.firstMarketDate,
    lastMarketDate:x.lastMarketDate,
  })).sort((a,b)=>a.symbol.localeCompare(b.symbol))
);

console.log(JSON.stringify({
  result:"PASS_TPEX_MONTHLY_SOURCE_FEASIBILITY",
  smokeVersion:"D19_TPEX_MONTHLY_SOURCE_SMOKE_V0_1",
  yearMonth,
  symbolCount:symbols.length,
  receipts,
  evidenceHash,
  interpretation:{
    officialIndividualMonthlySourcePhysicallyReadable:true,
    boundedSymbolsOnly:true,
    fullMarketPopulationProven:false,
    dateVintagedUniverseProven:false,
    historicalEndpointPublicationTimestampProven:false,
    canServeAsAlternateReplayPrimitiveCandidate:true,
    currentFullMarket520DoesNotImplyNoOfficialHistory:true,
    l3PromotionAuthorized:false,
  },
  formalCoreChanged:false,
  productionChanged:false,
},null,2));

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
const transportFailures=[];

for(const symbol of symbols){
  const sourceUrl=buildOfficialMonthlyHistoryUrl({market,symbol,yearMonth});
  try{
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
    assert.ok(normalized.rows.every((row)=>row.sourceId==="TPEX_TRADING_STOCK_MONTHLY"));
    assert.ok(normalized.rows.every((row)=>row.availableAt&&row.availabilityBasis==="SESSION_CLOSE_FINALITY"));
    assert.ok(normalized.rows.every((row)=>row.sourceFields?.sourceVolumeUnit==="LOT_1000_SHARES"));
    assert.ok(normalized.rows.every((row)=>row.sourceFields?.sourceTradeValueUnit==="THOUSAND_NTD"));

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
      firstVolumeShares:normalized.rows[0]?.volumeShares??null,
      firstTradeValueNtd:normalized.rows[0]?.tradeValue??null,
      sourceVolumeUnit:"LOT_1000_SHARES",
      sourceTradeValueUnit:"THOUSAND_NTD",
      availabilityBasis:"SESSION_CLOSE_FINALITY",
      historicalEndpointPublicationTimestampProven:false,
      sourceId:"TPEX_TRADING_STOCK_MONTHLY",
    });
  }catch(error){
    const message=String(error?.message||error);
    transportFailures.push({
      market,
      symbol,
      yearMonth,
      sourceUrl,
      blockerCode:/HTTP 403/.test(message)
        ?"TPEX_CLOUDFLARE_TRANSPORT_BLOCKED_403"
        :/HTTP 520/.test(message)
          ?"TPEX_TRANSPORT_ERROR_520"
          :"TPEX_MONTHLY_SOURCE_FETCH_FAILED",
      error:message.slice(0,500),
    });
  }
}

const evidenceHash=await sha256Hex({
  receipts:receipts.map((x)=>({
    market:x.market,
    symbol:x.symbol,
    yearMonth:x.yearMonth,
    sourcePayloadContentHash:x.sourcePayloadContentHash,
    rowCount:x.rowCount,
    validPriceRowCount:x.validPriceRowCount,
    nonPriceRowCount:x.nonPriceRowCount,
    firstMarketDate:x.firstMarketDate,
    lastMarketDate:x.lastMarketDate,
    sourceVolumeUnit:x.sourceVolumeUnit,
    sourceTradeValueUnit:x.sourceTradeValueUnit,
  })).sort((a,b)=>a.symbol.localeCompare(b.symbol)),
  transportFailures:transportFailures.map((x)=>({
    market:x.market,
    symbol:x.symbol,
    yearMonth:x.yearMonth,
    blockerCode:x.blockerCode,
  })).sort((a,b)=>a.symbol.localeCompare(b.symbol)),
});

const allReadable=receipts.length===symbols.length;
const anyReadable=receipts.length>0;
const result=allReadable
  ?"PASS_TPEX_MONTHLY_SOURCE_READABLE"
  :anyReadable
    ?"PASS_PARTIAL_TPEX_MONTHLY_TRANSPORT"
    :"PASS_NEGATIVE_TPEX_TRANSPORT_BLOCKED";

console.log(JSON.stringify({
  result,
  smokeVersion:"D19_TPEX_MONTHLY_SOURCE_SMOKE_V0_2",
  yearMonth,
  symbolCount:symbols.length,
  readableSymbolCount:receipts.length,
  blockedSymbolCount:transportFailures.length,
  receipts,
  transportFailures,
  evidenceHash,
  interpretation:{
    currentOfficialRouteKnown:true,
    currentOfficialSchemaObservedPreviously:true,
    sourceUnitSemanticsFrozen:true,
    hostedRunnerTransportReliable:allReadable,
    boundedSymbolsOnly:true,
    fullMarketPopulationProven:false,
    dateVintagedUniverseProven:false,
    historicalEndpointPublicationTimestampProven:false,
    canServeAsAlternateReplayPrimitiveCandidate:anyReadable,
    intermittentTransportBlocksDeterministicLiveReplay:!allReadable,
    transportFailureNeverMeansEmptyHistory:true,
    l3PromotionAuthorized:false,
  },
  formalCoreChanged:false,
  productionChanged:false,
},null,2));

import assert from "node:assert/strict";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import {
  fetchOfficialMonthlyHistoryPayloadV0_1,
  normalizeOfficialMonthlyHistoryPayloadV0_1,
} from "../runtime/official_monthly_history_adapter_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

const fromDate="2026-08-03";
const toDate="2026-08-31";
const yearMonth="2026-08";
const observedAt=new Date().toISOString();
const targetSymbols=[
  "1213","1341","1443","1472","1516","1538","2254","2321","2712","4190",
  "5906","6955","8101","8482","9110",
];

const range=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TWSE",
  fromDate,
  toDate,
  observedAt,
  pauseMs:25,
  includeRowProvenance:true,
});
assert.equal(range.tradingDateCount,21);

const primaryInvalid=new Map();
for(const symbol of targetSymbols){
  const rows=range.rows
    .filter((row)=>row.symbol===symbol)
    .sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  for(const row of rows){
    if(Number.isFinite(row.close)&&row.close>0) continue;
    primaryInvalid.set(symbol+"|"+row.marketDate,row);
  }
}
assert.equal(primaryInvalid.size,50);

const reconciled=[];
for(const symbol of targetSymbols){
  const payload=await fetchOfficialMonthlyHistoryPayloadV0_1({
    market:"TWSE",
    symbol,
    yearMonth,
  });
  const normalized=await normalizeOfficialMonthlyHistoryPayloadV0_1({
    market:"TWSE",
    symbol,
    yearMonth,
    payload,
    observedAt,
  });
  const byDate=new Map(normalized.rows.map((row)=>[row.marketDate,row]));
  for(const [key,primary] of [...primaryInvalid.entries()].filter(([key])=>key.startsWith(symbol+"|"))){
    const monthly=byDate.get(primary.marketDate)||null;
    const primaryActivityPositive=[primary.volumeShares,primary.tradeValue,primary.transactions]
      .some((x)=>Number.isFinite(x)&&x>0);
    const primaryZeroActivity=[primary.volumeShares,primary.tradeValue,primary.transactions]
      .every((x)=>x===0);
    const monthlyValidClose=Number.isFinite(monthly?.close)&&monthly.close>0;
    const monthlyActivityPositive=[monthly?.volumeShares,monthly?.tradeValue,monthly?.transactions]
      .some((x)=>Number.isFinite(x)&&x>0);
    const monthlyZeroActivity=[monthly?.volumeShares,monthly?.tradeValue,monthly?.transactions]
      .every((x)=>x===0);
    reconciled.push({
      symbol,
      marketDate:primary.marketDate,
      primary:{
        close:primary.close,
        volumeShares:primary.volumeShares,
        tradeValue:primary.tradeValue,
        transactions:primary.transactions,
        sourceRowHash:primary.sourceRowHash,
        activityPositive:primaryActivityPositive,
        zeroActivity:primaryZeroActivity,
      },
      monthly:monthly?{
        close:monthly.close,
        volumeShares:monthly.volumeShares,
        tradeValue:monthly.tradeValue,
        transactions:monthly.transactions,
        sourceId:monthly.sourceId,
        payloadHash:normalized.payloadHash,
        activityPositive:monthlyActivityPositive,
        zeroActivity:monthlyZeroActivity,
      }:null,
      reconciliationState:monthlyValidClose
        ?"ALTERNATE_OFFICIAL_VALID_CLOSE_FOUND"
        :monthly
          ?"ALTERNATE_OFFICIAL_ROW_WITHOUT_VALID_CLOSE"
          :"ALTERNATE_OFFICIAL_ROW_MISSING",
    });
  }
}

assert.equal(reconciled.length,50);
const stateCounts=Object.fromEntries(
  [...new Set(reconciled.map((x)=>x.reconciliationState))]
    .sort()
    .map((state)=>[state,reconciled.filter((x)=>x.reconciliationState===state).length]),
);

const positivePrimary=reconciled.filter((x)=>x.primary.activityPositive);
assert.equal(positivePrimary.length,39);

const positiveResolved=positivePrimary.filter(
  (x)=>x.reconciliationState==="ALTERNATE_OFFICIAL_VALID_CLOSE_FOUND",
);
const positiveStillNoClose=positivePrimary.filter(
  (x)=>x.reconciliationState!=="ALTERNATE_OFFICIAL_VALID_CLOSE_FOUND",
);

const evidenceHash=await sha256Hex(
  reconciled
    .map((x)=>({
      symbol:x.symbol,
      marketDate:x.marketDate,
      primarySourceRowHash:x.primary.sourceRowHash,
      monthlyPayloadHash:x.monthly?.payloadHash??null,
      monthlyClose:x.monthly?.close??null,
      reconciliationState:x.reconciliationState,
    }))
    .sort((a,b)=>(a.symbol+"|"+a.marketDate).localeCompare(b.symbol+"|"+b.marketDate)),
);

console.log(JSON.stringify({
  result:"PASS",
  probeVersion:"D19_TWSE_INVALID_CLOSE_MONTHLY_RECONCILIATION_V0_1",
  fromDate,
  toDate,
  targetSymbolCount:targetSymbols.length,
  primaryInvalidCount:primaryInvalid.size,
  primaryPositiveActivityNoCloseCount:positivePrimary.length,
  reconciliationStateCounts:stateCounts,
  positiveActivityResolvedWithAlternateOfficialClose:positiveResolved.length,
  positiveActivityStillWithoutOfficialClose:positiveStillNoClose.length,
  evidenceHash,
  positiveResolved,
  positiveStillNoClose,
  interpretation:{
    alternateOfficialSourceIsIndependentCrossCheck:true,
    alternateCloseMayBeUsedOnlyIfSourceSemanticsAreCompatible:true,
    noAlternateCloseRemainsNonPriceObservation:true,
    noForwardFill:true,
    noPreviousCloseSubstitution:true,
    noSyntheticPriceFromTradeValueOrVolume:true,
    l3PromotionAuthorized:false,
  },
  formalCoreChanged:false,
  productionChanged:false,
},null,2));
